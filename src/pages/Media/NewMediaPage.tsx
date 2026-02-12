import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import MediaForm from "@/pages/Media/MediaForm"
import { createMediaItem, uploadMediaFile } from "@/pages/Media/media"
import { supabase } from "@/lib/supabase.ts"
import { toast } from "sonner"
import type { MediaFormValues } from "@/types"

export default function NewMediaPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  

  async function handleSubmit(values: MediaFormValues) {
    if (!user || !values.file) return
    
    const {  } = await createMediaItem(values)
    // const { url, type } = await uploadMediaFile(values.file, user.id)

    // const { data, error } = await supabase
    //   .from("media_items")
    //   .insert({
    //     file_url: url,
    //     file_type: type,
    //     caption: values.caption,
    //     created_by: user.id,
    //   })
    //   .select()

    // if (error){
    //   console.error(error)
    //   toast.error('Error adding new media item', {
    //       description: `${error.message}`,
    //   })
    //   return
    // }

    // const addedMediaItemId = data[0].id

    // // if (values.newTags.length) {
    // //   const { data: newTagRows } = await supabase
    // //     .from("tags")
    // //     .insert(values.newTags.map((name: string) => ({ name })))
    // //     .select()

    // //   if (newTagRows) {
    // //     tagIds.push(...newTagRows.map(t => t.id))
    // //   }
    // // }

    // if (values.tagIds?.length) {
    //   const { data: newTagRows } = await supabase
    //     .from("tags")
    //     .insert(values.tagIds.map((name: string) => ({ name })))
    //     .select()
    //   const { error } = await supabase.from("media_tag_map").insert(
    //     values.tagIds.split(",").map(tagId => ({
    //       media_id: addedMediaItemId,
    //       tag_id: tagId,
    //     }))
    //   )
      
    //   if (error){
    //     toast.error('Error adding new media item', {
    //       description: `${error.message}`,
    //     })
    //     return
    //   }
    // }

    toast.success('Added Successfully', {
        description: `"${values.caption}" has been created.`,
    })
    navigate("/media")
  }

  return  <MediaForm 
            title="Add New Media Item"
            submitLabel="Save"
            initialValues={{
              file: null,
              caption: "",
              tagIds: undefined,
            }}
            onCancel={() => navigate("/media")}
            onSubmit={handleSubmit} 
          />
}
