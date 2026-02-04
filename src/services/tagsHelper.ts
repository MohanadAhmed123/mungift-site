import { supabase } from "@/lib/supabase"
import type { Tag } from "@/types/tags"

export async function upsertTags(names: string[]): Promise<string[]> {
  const normalized = names.map(n => n.trim().toLowerCase())

  const { data: existing } = await supabase
    .from("tags")
    .select("id, name")
    .in("name", normalized)

  const existingMap = new Map(
    existing?.map(t => [t.name, t.id])
  )

  const missing = normalized.filter(n => !existingMap.has(n))

  let newTags: Tag[] = []

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
