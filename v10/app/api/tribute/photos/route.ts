import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

const BUCKET = 'tribute-photos'
const MAX_PHOTOS = 10
const MAX_SIZE_MB = 5

export async function POST(req: NextRequest) {
  const tributeId = req.nextUrl.searchParams.get('id')
  if (!tributeId) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const formData = await req.formData()
  const file = formData.get('photo') as File | null
  const indexStr = formData.get('index') as string | null

  if (!file) return NextResponse.json({ error: 'photo required' }, { status: 400 })
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json({ error: `Foto muito grande (máx ${MAX_SIZE_MB}MB)` }, { status: 400 })
  }

  const supabase = createServerClient()

  // Checar limite de fotos
  const { data: tribute } = await supabase
    .from('tributes')
    .select('photo_urls')
    .eq('id', tributeId)
    .single()

  const existing: string[] = tribute?.photo_urls ?? []
  if (existing.length >= MAX_PHOTOS) {
    return NextResponse.json({ error: 'Limite de 10 fotos atingido' }, { status: 400 })
  }

  const index = indexStr ? parseInt(indexStr) : existing.length
  const ext = file.type.includes('webp') ? 'webp' : file.name.endsWith('.png') ? 'png' : 'jpg'
  const path = `${tributeId}/${Date.now()}-${index}.${ext}`

  const bytes = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: true })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)

  // Adicionar URL ao array
  const newUrls = [...existing, publicUrl]
  await supabase.from('tributes').update({ photo_urls: newUrls }).eq('id', tributeId)

  return NextResponse.json({ url: publicUrl, total: newUrls.length })
}

export async function DELETE(req: NextRequest) {
  const tributeId = req.nextUrl.searchParams.get('id')
  const url = req.nextUrl.searchParams.get('url')
  if (!tributeId || !url) return NextResponse.json({ error: 'id e url required' }, { status: 400 })

  const supabase = createServerClient()
  const { data: tribute } = await supabase
    .from('tributes')
    .select('photo_urls')
    .eq('id', tributeId)
    .single()

  const newUrls = (tribute?.photo_urls ?? []).filter((u: string) => u !== url)
  await supabase.from('tributes').update({ photo_urls: newUrls }).eq('id', tributeId)

  // Extrair path do bucket e deletar
  const pathMatch = url.match(/tribute-photos\/(.+)$/)
  if (pathMatch) {
    await supabase.storage.from(BUCKET).remove([pathMatch[1]])
  }

  return NextResponse.json({ ok: true, total: newUrls.length })
}
