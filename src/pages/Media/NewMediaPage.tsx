import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import MediaForm from "@/pages/Media/MediaForm.tsx";
import { uploadMediaFile, createMediaItem, getFileType } from "@/services/mediaService";
import { toast } from "sonner";
import { setTagsForItem } from "@/services/tagService";
import type { Tag } from "@/types";


export default function NewMediaPage() {
    const navigate = useNavigate()
    const { user } = useAuth()

    return (
        <MediaForm
            title="Add New Media Item"
            submitLabel="Save"
            initialValues={{
                file: null,
                caption: "",
                tags: [] as Tag[]
            }}
            onCancel={() => navigate("/media")}
            onSubmit={async values => {
                if (!user) return
                try {
                    const filePath = await uploadMediaFile(values.file!, user.id)

                    const insertedItem = await createMediaItem({
                        file_url: filePath,
                        file_type: getFileType(values.file!),
                        caption: values.caption,
                        userId: user.id,
                    })
                    
                    if (values.tags) {
                        await setTagsForItem({
                            scope: "media",
                            joinTable: "media_tag_map",
                            entityColumn: "media_id"
                        }, insertedItem.id, values.tags.map(t => t.id))
                    }


                } catch (error) {
                    console.error(error)
                    toast.error('Error adding new media item', {
                        description: `${error instanceof Error ? error.message : String(error)}`,
                    })
                    return
                }

                toast.success('Added Successfully', {
                    description: `"${values.caption}" has been created.`,
                })
                navigate("/media")
            }}
        />
    );
}


