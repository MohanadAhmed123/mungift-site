import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import MediaPreview from "@/pages/Media/MediaPreview.tsx"
import MediaTagSelector from "@/pages/Media/MediaTagSelector.tsx"
import type { MediaFormValues, Tag } from "@/types"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { FancyBox } from "@/components/ui/FancyBox"
import { supabase } from "@/lib/supabase"


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
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<{ file?: string; caption?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    async function loadTags() {
        // 1. Get tag IDs used by media
        const { data: tagMapRows, error: tagMapError } = await supabase
            .from("media_tag_map")
            .select("tag_id")

        if (tagMapError) {
            console.error(tagMapError)
            return
        }

        const tagIds = tagMapRows.map(row => row.tag_id)

        if (tagIds.length === 0) {
            setTags([])
            return
        }

        // 2. Fetch actual tag records
        const { data: tagsData, error: tagsError } = await supabase
            .from("tags")
            .select("id, name")
            .in("id", tagIds)

        if (tagsError) {
            console.error(tagsError)
            return
        }

        setTags(tagsData)
    }

    loadTags()
    }, [])

  async function createTag(name: string): Promise<Tag> {
    const { data, error } = await supabase
      .from("tags")
      .insert({ name, scope: "media" })
      .select()
      .single()

    if (error) throw error

    setTags(prev => [...prev, data])
    return data
  }  

  async function updateTag(tagId: string, newName: string) {
    const { error } = await supabase
      .from("tags")
      .update({ name: newName })
      .eq("id", tagId)

    if (error) throw error

    // update local state
    setTags(prev =>
      prev.map(t => (t.id === tagId ? { ...t, name: newName } : t)),
    )

    setSelectedTags(prev =>
      prev.map(t => (t.id === tagId ? { ...t, name: newName } : t)),
    )
  }

  async function deleteTag(tagId: string) {
    const { error } = await supabase
      .from("tags")
      .delete()
      .eq("id", tagId)

    if (error) throw error

    setTags(prev => prev.filter(t => t.id !== tagId))
    setSelectedTags(prev => prev.filter(t => t.id !== tagId))
  }

  function handleMediaRemove() {
    setValues(v => ({ ...v, file: null }));
  }
  const mediaPrev = useMemo(() => 
    {return values.file && <MediaPreview file={values.file} onRemove={handleMediaRemove} />}
  , [values.file]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const filesList = e.target.files;

    if (filesList && filesList.length > 0) setValues(v => ({ ...v, file: filesList[0] }))
  }
  function validate() {
    const newErrors: typeof errors = {}
    
    if (!values.file) {
          newErrors.file = "File is required"
    }
    if (!values.caption.trim()) {
      newErrors.caption = "Caption is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || !user) return

    setIsSubmitting(true)
    await onSubmit(values)
    setIsSubmitting(false)
  }

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
            {/* File upload */}
            <div className="space-y-1">
              <Field className="border-dashed border-2 p-4 flex flex-col items-center justify-center rounded-lg">
                <Upload className="h-6 max-w-6 text-muted-foreground" />
                <Label htmlFor="mediaUploadFile" className="bg-primary justify-center text-center text-primary-foreground rounded-lg p-2 max-w-30">
                  Choose File
                </Label>
                <Input 
                  id="mediaUploadFile"
                  accept="image/*,video/*,audio/*" 
                  className="hidden max-w-3xs bg-primary text-primary-foreground" 
                  type="file" 
                  required 
                  onChange={handleFileChange} 
                />
              </Field>
              {errors.file && (
                  <p className="text-sm text-destructive">{errors.file}</p>
              )}
            </div>
            {/* <label className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
              <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
              <Button> 
                  Upload Media File
              </Button>
              <span className="text-sm text-muted-foreground">
                Drag & drop or click to upload
              </span>
              
            </label> */}


            {values.file && mediaPrev}

            {/* Caption */}
            <div className="space-y-1">
              <Field>
                <FieldLabel htmlFor="caption">Caption *</FieldLabel>
                <Textarea
                  placeholder="Describe or name the media item"
                  value={values.caption}
                  onChange={e => setValues(v => ({ ...v, caption: e.target.value }))}
                />
              </Field>
              {errors.caption && (
                  <p className="text-sm text-destructive">{errors.caption}</p>
              )}
            </div>

            {/* Tags */}
            {/* <MediaTagSelector
              selectedTagIds={tagIds}
              onChange={setTagIds}
              onNewTagsChange={setNewTags}
            /> */}
            <FancyBox 
              allTags={tags}
              selectedTags={[] as Tag[]}
              onChangeSelected={setSelectedTags}
              onCreateTag={createTag}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          </CardContent>

          {/* <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              Upload
            </Button>
          </CardFooter> */}
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
