import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

// GET /api/tribute?id=xxx
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('tributes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Se não pago, não retorna photo_urls completas
  if (!data.paid) {
    return NextResponse.json({ ...data, photo_urls: [], _photoCount: data.photo_urls?.length ?? 0 })
  }

  return NextResponse.json(data)
}

// POST /api/tribute — criar ou atualizar (upsert)
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { id, momName, senderName, occasion, message, phrases, theme, musicTrackId, musicTrackName } = body

  if (!momName || !senderName) {
    return NextResponse.json({ error: 'momName e senderName são obrigatórios' }, { status: 400 })
  }

  const supabase = createServerClient()

  const payload: Record<string, unknown> = {
    mom_name: momName,
    sender_name: senderName,
    occasion: occasion ?? 'Dia das Mães',
    message: message ?? null,
    phrases: phrases ?? [],
    theme: theme ?? 'rose',
    music_track_id: musicTrackId ?? null,
    music_track_name: musicTrackName ?? null,
  }

  if (id) payload.id = id

  const { data, error } = await supabase
    .from('tributes')
    .upsert(payload, { onConflict: 'id' })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ id: data.id })
}

// PATCH /api/tribute — atualizar campos parciais
export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, ...fields } = body

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // Mapear camelCase → snake_case
  const mapped: Record<string, unknown> = {}
  if (fields.momName !== undefined)        mapped.mom_name = fields.momName
  if (fields.senderName !== undefined)     mapped.sender_name = fields.senderName
  if (fields.occasion !== undefined)       mapped.occasion = fields.occasion
  if (fields.message !== undefined)        mapped.message = fields.message
  if (fields.phrases !== undefined)        mapped.phrases = fields.phrases
  if (fields.theme !== undefined)          mapped.theme = fields.theme
  if (fields.musicTrackId !== undefined)   mapped.music_track_id = fields.musicTrackId
  if (fields.musicTrackName !== undefined) mapped.music_track_name = fields.musicTrackName

  const supabase = createServerClient()
  const { error } = await supabase.from('tributes').update(mapped).eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
