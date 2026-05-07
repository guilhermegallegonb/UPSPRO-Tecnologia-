import { NextRequest, NextResponse } from 'next/server'
import { Payment } from 'mercadopago'
import { mpClient } from '@/lib/mercadopago/client'
import { createServerClient } from '@/lib/supabase/server'
import crypto from 'crypto'

function validateSignature(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
  if (!secret) return true // Em desenvolvimento, pular validação

  const xSignature = req.headers.get('x-signature') ?? ''
  const xRequestId = req.headers.get('x-request-id') ?? ''
  const dataId = req.nextUrl.searchParams.get('data.id') ?? ''

  const tsPart = xSignature.split(',').find(p => p.startsWith('ts='))?.split('=')[1]
  const v1Part = xSignature.split(',').find(p => p.startsWith('v1='))?.split('=')[1]

  if (!tsPart || !v1Part) return false

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${tsPart};`
  const computed = crypto.createHmac('sha256', secret).update(manifest).digest('hex')

  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(v1Part))
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  if (!validateSignature(req, rawBody)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try { body = JSON.parse(rawBody) } catch { return NextResponse.json({ ok: true }) }

  // MP envia type=payment para notificações de pagamento
  if (body.type !== 'payment') return NextResponse.json({ ok: true })

  const paymentId = (body.data as Record<string, unknown>)?.id
  if (!paymentId) return NextResponse.json({ ok: true })

  try {
    const payment = new Payment(mpClient)
    const result = await payment.get({ id: String(paymentId) })

    if (!result || !result.external_reference) return NextResponse.json({ ok: true })

    const [tributeId, plan] = result.external_reference.split(':')
    const supabase = createServerClient()

    if (result.status === 'approved') {
      await supabase.from('tributes').update({
        paid:           true,
        plan:           plan ?? 'basic',
        payment_status: 'approved',
        paid_at:        new Date().toISOString(),
        amount_paid:    result.transaction_amount,
      }).eq('id', tributeId)
    } else if (result.status === 'rejected' || result.status === 'cancelled') {
      await supabase.from('tributes').update({
        payment_status: 'rejected',
      }).eq('id', tributeId)
    }
  } catch (err) {
    console.error('Webhook error:', err)
    // Retornar 200 sempre — MP re-tenta em 5xx
  }

  return NextResponse.json({ ok: true })
}
