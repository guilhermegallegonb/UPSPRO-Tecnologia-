import { NextResponse } from 'next/server'

export async function GET() {
  const checks = {
    NEXT_PUBLIC_SUPABASE_URL:      !!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('SEU_PROJETO'),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 20,
    SUPABASE_SERVICE_ROLE_KEY:     !!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY.length > 20,
    MERCADOPAGO_ACCESS_TOKEN:      !!process.env.MERCADOPAGO_ACCESS_TOKEN && !process.env.MERCADOPAGO_ACCESS_TOKEN.includes('xxxx'),
    MERCADOPAGO_WEBHOOK_SECRET:    !!process.env.MERCADOPAGO_WEBHOOK_SECRET && process.env.MERCADOPAGO_WEBHOOK_SECRET !== 'sua_chave_secreta',
    NEXT_PUBLIC_BASE_URL:          !!process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL !== 'http://localhost:3000',
  }

  const missing = Object.entries(checks).filter(([, ok]) => !ok).map(([k]) => k)
  const ok = missing.length === 0

  // Testar conexão Supabase
  let supabaseOk = false
  let supabaseError = ''
  if (checks.NEXT_PUBLIC_SUPABASE_URL && checks.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createServerClient } = await import('@/lib/supabase/server')
      const supabase = createServerClient()
      const { error } = await supabase.from('tributes').select('id').limit(1)
      supabaseOk = !error
      if (error) supabaseError = error.message
    } catch (e) {
      supabaseError = e instanceof Error ? e.message : 'Erro desconhecido'
    }
  }

  return NextResponse.json({
    ok,
    envVars: checks,
    missing,
    supabase: { connected: supabaseOk, error: supabaseError || null },
    hint: ok && supabaseOk
      ? 'Tudo configurado!'
      : missing.length > 0
        ? `Adicione no Vercel (Settings → Environment Variables): ${missing.join(', ')}`
        : `Env vars OK mas Supabase falhou: ${supabaseError}`,
  })
}
