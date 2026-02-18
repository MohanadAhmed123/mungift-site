import { supabase } from "@/lib/supabase";
import type { MediaItemWithTags } from "@/types";

// retrieve all  media items with their selected tags
export async function getAllMedia(): Promise<MediaItemWithTags[]> {
  const { data, error } = await supabase
    .from("media_items")
    .select(`
      *,
      media_tag_map (
        tags (
          id,
          name
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((item) => ({
    ...item,
    tags: item.media_tag_map.map((m: any) => m.tags),
  }));
}


// upload media file to supabase storage
export async function uploadMediaFile(
  file: File,
  userId: string
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("media")
    .upload(fileName, file, {
      upsert: false,
    });

  if (error) throw error;

  return fileName; // store this in DB
}

// delete media file from supabase storage (used for media item editing or deletion)
export async function deleteMediaFile(path: string) {
  const { error } = await supabase.storage
    .from("media")
    .remove([path]);

  if (error) throw error;
}


// adding a new media item, file upload is called separately by UI and tags are handled separately by setTagsForItem call from UI as well
export async function createMediaItem(data: {
  file_url: string;
  file_type: "image" | "video" | "audio";
  caption?: string;
  userId: string;
}) {
  const { data: inserted, error } = await supabase
    .from("media_items")
    .insert({
      file_url: data.file_url,
      file_type: data.file_type,
      caption: data.caption ?? null,
      created_by: data.userId,
    })
    .select()
    .single();

  if (error) throw error;

  return inserted;
}


// editing existing media item, selected tags updating will be handled separately by setTagsForItem call by UI
// editing file in storage will also be called separately by UI 
export async function updateMediaItem(
  id: string,
  updates: {
    caption?: string;
    file_url?: string;
    file_type?: "image" | "video" | "audio";
  }
) {
  const { data, error } = await supabase
    .from("media_items")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}
/*
CODE TO BE USED IN THE UI MEDIA EDIT FORM FOR HANDLING FILE CHANGE 

if (newFileSelected) {
  await deleteMediaFile(oldFilePath);
  const newPath = await uploadMediaFile(newFile, user.id);

  await updateMediaItem(mediaId, {
    file_url: newPath,
    file_type: detectedType,
  });
}
*/


// delete a media item and the the respective file from storage
export async function deleteMediaItemWithFile(id: string, filePath: string) {
  // 1. delete DB row (tag_map auto deletes)
  const { error } = await supabase
    .from("media_items")
    .delete()
    .eq("id", id);

  if (error) throw error;

  // 2. delete storage file
  await deleteMediaFile(filePath);
}
