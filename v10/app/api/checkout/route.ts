import { NextRequest, NextResponse } from 'next/server'
import { Payment } from 'mercadopago'
import { mpClient } from '@/lib/mercadopago/client'
import { createServerClient } from '@/lib/supabase/server'

const PRICES: Record<string, number> = {
  basic:   14.90,
  premium: 24.90,
}

export async function POST(req: NextRequest) {
  const { tributeId, plan } = await req.json()

  if (!tributeId || !plan || !PRICES[plan]) {
    return NextResponse.json({ error: 'tributeId e plan (basic|premium) obrigatórios' }, { status: 400 })
  }

  const supabase = createServerClient()

  // Validar que o tribute existe e não está pago
  const { data: tribute, error: tErr } = await supabase
    .from('tributes')
    .select('id, paid, mom_name')
    .eq('id', tributeId)
    .single()

  if (tErr || !tribute) return NextResponse.json({ error: 'Tribute não encontrado' }, { status: 404 })
  if (tribute.paid)      return NextResponse.json({ error: 'Já pago' }, { status: 400 })

  try {
    const payment = new Payment(mpClient)
    const result = await payment.create({
      body: {
        payment_method_id: 'pix',
        transaction_amount: PRICES[plan],
        description: `MotherRoll ${plan === 'premium' ? 'Premium' : 'Básico'} — ${tribute.mom_name}`,
        payer: { email: 'pagador@motherroll.app' },
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/mercadopago`,
        external_reference: `${tributeId}:${plan}`,
      },
    })

    const pix = result.point_of_interaction?.transaction_data
    if (!pix?.qr_code || !result.id) {
      return NextResponse.json({ error: 'Erro ao gerar PIX' }, { status: 500 })
    }

    // Salvar payment_id e status pending
    await supabase
      .from('tributes')
      .update({ payment_id: String(result.id), payment_status: 'pending', plan })
      .eq('id', tributeId)

    return NextResponse.json({
      paymentId: result.id,
      pixQrCode:     pix.qr_code_base64,
      pixCopyPaste:  pix.qr_code,
      expiresAt:     result.date_of_expiration,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
