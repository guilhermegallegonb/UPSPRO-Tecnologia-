import { createServerClient } from '@/lib/supabase/server'

const BUCKET = 'tribute-photos'

export async function uploadPhoto(
  tributeId: string,
  index: number,
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  const supabase = createServerClient()
  const ext = mimeType.includes('webp') ? 'webp' : 'jpg'
  const path = `${tributeId}/${index}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: mimeType, upsert: true })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function deletePhotos(tributeId: string) {
  const supabase = createServerClient()
  const { data } = await supabase.storage.from(BUCKET).list(tributeId)
  if (!data?.length) return
  const paths = data.map(f => `${tributeId}/${f.name}`)
  await supabase.storage.from(BUCKET).remove(paths)
}
