import { useAuth } from "@/context/AuthContext"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import MediaForm from "@/pages/Media/MediaForm.tsx";
import { uploadMediaFile, getFileType, deleteMediaFile, updateMediaItem } from "@/services/mediaService";
import { toast } from "sonner";
import type { MediaFormValues, MediaItemWithTags } from "@/types";
import { setTagsForItem } from "@/services/tagService";



export default function EditMediaPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()

    // loading the passed in media values from the navigate state
    const location = useLocation();
    const currItem = location.state?.item as MediaItemWithTags | undefined
    const formMediaItem = {
        file: null,
        caption: currItem?.caption,
        existingFileUrl: currItem?.file_url,
        existingFileType: currItem?.file_type,
        tags: currItem?.tags,
    } as MediaFormValues

    return (
        <MediaForm
            title="Edit Media Item"
            submitLabel="Save Changes"
            initialValues={formMediaItem}
            onCancel={() => navigate("/media")}
            onSubmit={async values => {
                if (!user) return

                try {
                    let newPath = formMediaItem.existingFileUrl
                    let newFileType = formMediaItem.existingFileType

                    //if there is a new file, then update db storage to replace the existing file
                    if (values.file) {
                        await deleteMediaFile(formMediaItem.existingFileUrl!)
                        newPath = await uploadMediaFile(values.file, user.id)
                        newFileType = getFileType(values.file);
                    }

                    await updateMediaItem(id!, {
                        caption: values.caption,
                        file_url: newPath!,
                        file_type: newFileType!,
                    })

                    await setTagsForItem({
                        scope: "media",
                        joinTable: "media_tag_map",
                        entityColumn: "media_id"
                    }, id!, values.tags!.map(t => t.id))
                    
                } catch (error) {
                    console.error(error)
                    toast.error('Error editing media item', {
                        description: `${error instanceof Error ? error.message : String(error)}`,
                    })
                    return
                }

                toast.success('Edited Successfully', {
                    description: `"${values.caption}" has been updated.`,
                })
                navigate("/media")
            }}
        />
    );
}


