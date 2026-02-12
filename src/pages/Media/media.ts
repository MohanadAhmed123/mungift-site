import { supabase } from "@/lib/supabase"
import type { CreateMediaInput, MediaItemWithTags } from "@/types"

export async function getMediaItems(): Promise<MediaItemWithTags[]> {
  const { data, error } = await supabase
    .from("media_items")
    .select(`
      *,
      media_tag_map (
        tags ( id, name )
      )
    `)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data.map(item => ({
    ...item,
    tags: item.media_tag_map.map((mt: any) => mt.tags),
  }))
}



export async function createMediaItem(input: CreateMediaInput) {
  const { data: media, error } = await supabase
    .from("media_items")
    .insert({
      file_url: input.file_url,
      file_type: input.file_type,
      caption: input.caption,
      created_by: input.created_by,
    })
    .select()
    .single()

  if (error) throw error

  if (input.tagNames.length) {
    const tagIds = await upsertMediaTags(input.tagNames)

    await supabase.from("media_tag_map").insert(
      tagIds.map(tagId => ({
        media_id: media.id,
        tag_id: tagId,
      }))
    )
  }

  return media
}

async function upsertMediaTags(names: string[]): Promise<string[]> {
  const normalized = names.map(n => n.trim().toLowerCase())

  const { data: existing } = await supabase
    .from("tags")
    .select("id, name")
    .in("name", normalized)

  const existingMap = new Map(
    existing?.map(t => [t.name, t.id])
  )

  const missing = normalized.filter(n => !existingMap.has(n))

  let newTags = []

  if (missing.length) {
    const { data } = await supabase
      .from("tags")
      .insert(missing.map(name => ({ name })))
      .select()

    newTags = data || []
  }

  return [
    ...existingMap.values(),
    ...newTags.map(t => t.id),
  ]
}

export async function uploadMediaFile(file: File, userId: string) {
  const ext = file.name.split(".").pop()
  const filePath = `${userId}${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from("media")
    .upload(filePath, file)

  if (error) throw error

  const { data } = supabase.storage
    .from("media")
    .getPublicUrl(filePath)

  return {
    url: data.publicUrl,
    type: file.type.startsWith("image")
      ? "image"
      : file.type.startsWith("video")
      ? "video"
      : "audio",
  }
}