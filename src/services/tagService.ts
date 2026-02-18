import { supabase } from "@/lib/supabase"
import type { Tag, TagContext } from "@/types"

// Get All Tags For A Page (by scope)
export async function getTags(context: TagContext): Promise<Tag[]> {
  const { data, error } = await supabase
    .from("tags")
    .select("id, name, scope")
    .eq("scope", context.scope)
    .order("name")

  if (error) throw error
  return data
}

// Get tags for a specific item based on its id
export async function getTagsForItem(
  context: TagContext,
  entityId: string
): Promise<Tag[]> {
  const { data, error } = await supabase
    .from(context.joinTable)
    .select(`tag_id, tags(id, name, scope)`)
    .eq(context.entityColumn, entityId)

  if (error) throw error

  return data.map((row: any) => row.tags)
}


// Create a tag with a scope (different scopes have their own tags, can reshare tag name while being edited/deleted separately per page/scope)
export async function createTag(
  context: TagContext,
  name: string
): Promise<Tag> {
  const { data, error } = await supabase
    .from("tags")
    .insert({
      name,
      scope: context.scope,
    })
    .select()
    .single()

  if (error) throw error
  return data
}


// update tag name (automatically assumes updating per scope since we are using the tag id to update)
export async function updateTag(
  tagId: string,
  newName: string
): Promise<void> {
  const { error } = await supabase
    .from("tags")
    .update({ name: newName })
    .eq("id", tagId)

  if (error) throw error
}


// delete tag entirely
export async function deleteTag(tagId: string): Promise<void> {
  const { error } = await supabase
    .from("tags")
    .delete()
    .eq("id", tagId)

  if (error) throw error
}


// edit selected tags for an item
export async function setTagsForItem(
  context: TagContext,
  entityId: string,
  tagIds: string[]
): Promise<void> {
  // Remove existing mappings
  const { error: deleteError } = await supabase
    .from(context.joinTable)
    .delete()
    .eq(context.entityColumn, entityId)

  if (deleteError) throw deleteError

  if (tagIds.length === 0) return

  const rows = tagIds.map(tagId => ({
    [context.entityColumn]: entityId,
    tag_id: tagId,
  }))

  const { error: insertError } = await supabase
    .from(context.joinTable)
    .insert(rows)

  if (insertError) throw insertError
}

// for adding a single tag, probably won't need it
// export async function addTagToItem(
//   context: TagContext,
//   entityId: string,
//   tagId: string
// ): Promise<void> {
//   const { error } = await supabase
//     .from(context.joinTable)
//     .insert({
//       [context.entityColumn]: entityId,
//       tag_id: tagId,
//     })

//   if (error) throw error
// }



// export async function upsertTags(names: string[]): Promise<string[]> {
//   const normalized = names.map(n => n.trim().toLowerCase())

//   const { data: existing } = await supabase
//     .from("tags")
//     .select("id, name")
//     .in("name", normalized)

//   const existingMap = new Map(
//     existing?.map(t => [t.name, t.id])
//   )

//   const missing = normalized.filter(n => !existingMap.has(n))

//   let newTags: Tag[] = []

//   if (missing.length) {
//     const { data } = await supabase
//       .from("tags")
//       .insert(missing.map(name => ({ name })))
//       .select()

//     newTags = data || []
//   }

//   return [
//     ...existingMap.values(),
//     ...newTags.map(t => t.id),
//   ]
// }
