import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase.ts"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"

import type { Tag } from "@/types"

type Props = {
    selectedTagIds: string[]
    onChange: (ids: string[]) => void
    onNewTagsChange: (tags: string[]) => void
}

export default function MediaTagSelector({
    selectedTagIds,
    onChange,
    onNewTagsChange,
}: Props) {
    const [tags, setTags] = useState<Tag[]>([])
    const [newTagsInput, setNewTagsInput] = useState("")
    const anchor = useComboboxAnchor()

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

    function handleNewTagsChange(value: string) {
        setNewTagsInput(value)
        const parsed = value
            .split(",")
            .map(t => t.trim())
            .filter(Boolean)
        onNewTagsChange(parsed)
    }

    return (
        <div className="space-y-2">
            <p className="text-sm font-medium">Tags</p>
            <Combobox
            multiple
            autoHighlight
            items={tags}
            itemToStringValue={(tag: Tag) => tag.name}
            onValueChange={setTags}
            defaultValue={tags}
            >
            <ComboboxChips ref={anchor} className="w-full max-w-xs">
                <ComboboxValue>
                {(values) => (
                    <>
                    {values.map((value: string) => (
                        <ComboboxChip key={value}>{value}</ComboboxChip>
                    ))}
                    <ComboboxChipsInput />
                    </>
                )}
                </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                {(item) => (
                    <ComboboxItem key={item} value={item}>
                    {item}
                    </ComboboxItem>
                )}
                </ComboboxList>
            </ComboboxContent>
            </Combobox>

            {/* <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <button
                        key={tag.id}
                        type="button"
                        className={`px-2 py-1 rounded text-sm border ${selectedTagIds.includes(tag.id)
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                        onClick={() =>
                            onChange(
                                selectedTagIds.includes(tag.id)
                                    ? selectedTagIds.filter(id => id !== tag.id)
                                    : [...selectedTagIds, tag.id]
                            )
                        }
                    >
                        {tag.name}
                    </button>
                ))}
            </div> */}

            <Input
                placeholder="Add new tags (comma separated)"
                value={newTagsInput}
                onChange={e => handleNewTagsChange(e.target.value)}
            />
        </div>
    )
}
