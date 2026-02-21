import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Upload } from "lucide-react"
import MediaPreview from "@/pages/Media/MediaPreview.tsx"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import type { MediaFormValues } from "@/types"
import { TagSelector } from "@/pages/Media/TagSelector.tsx"

type Props = {
    title: string
    initialValues: MediaFormValues
    submitLabel: string
    onSubmit: (values: MediaFormValues) => Promise<void>
    onCancel: () => void
}

export default function MediaForm({
    title,
    initialValues,
    submitLabel,
    onSubmit,
    onCancel,
}: Props) {
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState<{ file?: string; caption?: string }>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { user } = useAuth()

    function validate() {
        const newErrors: typeof errors = {}

        // File required only if no existing file (edit mode)
        if (!values.file && !values.existingFileUrl) {
            newErrors.file = "File is required"
        }

        if (!values.caption.trim()) {
            newErrors.caption = "Caption is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0 //returns true if there are no errors
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!validate() || !user) return

        setIsSubmitting(true)
        await onSubmit(values)
        setIsSubmitting(false)
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (files && files.length > 0) {
            setValues(v => ({
                ...v,
                file: files[0],
                existingFileUrl: null, // override existing preview
            }))
        }
    }

    function handleRemoveFile() {
        setValues(v => ({
            ...v,
            file: null,
            existingFileUrl: null,
        }))
    }

    // Memoized preview to avoid media re-rendering when any state changes (e.g., writing the caption)
    const preview = useMemo(() => {
        if (values.file) {
            return <MediaPreview file={values.file} onRemove={handleRemoveFile} />
        }

        if (values.existingFileUrl && values.existingFileType) {
            return <MediaPreview
                existingFileUrl={values.existingFileUrl}
                existingFileType={values.existingFileType}
                onRemove={handleRemoveFile}
            />
        }

        return null
    }, [values.file, values.existingFileUrl])

    return (
        <div className="max-w-xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>
                        <h1 className="font-semibold text-primary text-2xl">
                            {title}
                        </h1>
                    </CardTitle>
                    <CardDescription>
                        Fields with a * are required (cannot be empty), the rest are optional
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {/* Upload */}
                        <div className="space-y-1">
                            <Field className="border-dashed border-2 p-4 flex flex-col items-center justify-center rounded-lg">
                                <Upload className="h-6 max-w-6 text-muted-foreground mb-2" />
                                <Label
                                    htmlFor="mediaUploadFile"
                                    className="bg-primary justify-center text-center text-primary-foreground rounded-lg p-2 max-w-30 cursor-pointer"
                                >
                                    Choose File
                                </Label>

                                <Input
                                    id="mediaUploadFile"
                                    type="file"
                                    accept="image/*,video/*,audio/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </Field>

                            {errors.file && (
                                <p className="text-sm text-destructive">{errors.file}</p>
                            )}
                        </div>

                        {/* Preview */}
                        {preview}

                        {/* Caption */}
                        <div className="space-y-1">
                            <Field>
                                <FieldLabel htmlFor="caption">Caption *</FieldLabel>
                                <Textarea
                                    id="caption"
                                    placeholder="Describe the media item"
                                    value={values.caption}
                                    onChange={e =>
                                        setValues(v => ({ ...v, caption: e.target.value }))
                                    }
                                />
                            </Field>

                            {errors.caption && (
                                <p className="text-sm text-destructive">{errors.caption}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Field>
                                <FieldLabel>Tags</FieldLabel>
                                <TagSelector
                                    context={{
                                        scope:"media",
                                        joinTable:"media_tag_map",
                                        entityColumn:"media_id"
                                    }}
                                    selectedTags={values.tags!}
                                    onChangeSelected={newTags =>
                                        setValues(v => ({ ...v, tags: newTags }))
                                    }
                                />
                            </Field>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between gap-2 pt-6">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving…" : submitLabel}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
