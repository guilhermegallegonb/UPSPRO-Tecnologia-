import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

// GET /api/checkout/status?paymentId=xxx
// Polling do cliente para saber se pagamento foi aprovado
export async function GET(req: NextRequest) {
  const paymentId = req.nextUrl.searchParams.get('paymentId')
  if (!paymentId) return NextResponse.json({ error: 'paymentId required' }, { status: 400 })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('tributes')
    .select('id, paid, payment_status, plan')
    .eq('payment_id', paymentId)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    paid:          data.paid,
    status:        data.payment_status,
    plan:          data.plan,
    tributeId:     data.id,
  })
}
