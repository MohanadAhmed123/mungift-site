"use client"

import { Check, ChevronsUpDown, Edit2 } from "lucide-react"
import { cn } from "@/lib/utils"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { getTags, createTag, updateTag, deleteTag } from "@/services/tagService"
import { useEffect, useRef, useState } from "react"

import type { Tag, TagContext } from "@/types"
import { toast } from "sonner"


type Props = {
    context: TagContext
    selectedTags: Tag[]
    onChangeSelected: (tags: Tag[]) => void
}

export function TagSelector({ context, selectedTags, onChangeSelected }: Props) {
    const inputRef = useRef<HTMLInputElement>(null)

    const [allTags, setAllTags] = useState<Tag[]>([])
    const [openCombobox, setOpenCombobox] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [inputValue, setInputValue] = useState("")

    useEffect(() => {
        async function fetchTags() {
            const tags = await getTags(context)
            setAllTags(tags)
        }
        fetchTags()
    }, [context])

    async function handleCreateTag(name: string) {
        try {
            const newTag = await createTag(context, name)
            setAllTags(prev => [...prev, newTag])
            onChangeSelected([...selectedTags, newTag])
        } catch (error) {
            console.error(error)
            toast.error('Error creating new tag', {
                description: `${error instanceof Error ? error.message : String(error)}`,
            })
            return
        }
    }

    async function handleUpdateTag(tag: Tag, newName: string) {
        try {
            await updateTag(tag.id, newName)

            const updated = { ...tag, name: newName }

            setAllTags(prev =>
                prev.map(t => (t.id === tag.id ? updated : t))
            )

            onChangeSelected(
                selectedTags.map(t => (t.id === tag.id ? updated : t))
            )
        } catch (error) {
            console.error(error)
            toast.error('Error updating tag', {
                description: `${error instanceof Error ? error.message : String(error)}`,
            })
            return
        }
    }

    async function handleDeleteTag(tag: Tag) {
        try {
            await deleteTag(tag.id)

            setAllTags(prev => prev.filter(t => t.id !== tag.id))
            onChangeSelected(selectedTags.filter(t => t.id !== tag.id))
        } catch (error) {
            console.error(error)
            toast.error('Error deleting tag', {
                description: `${error instanceof Error ? error.message : String(error)}`,
            })
            return
        }
    }

    function toggleTag(tag: Tag) {
        const isSelected = selectedTags.some(t => t.id === tag.id)

        if (isSelected) {
            onChangeSelected(selectedTags.filter(t => t.id !== tag.id))
        } else {
            onChangeSelected([...selectedTags, tag])
        }

        inputRef.current?.focus()
    }

    const onComboboxOpenChange = (value: boolean) => {
        inputRef.current?.blur(); // HACK: otherwise, would scroll automatically to the bottom of page
        setOpenCombobox(value);
    };

    // for filtering the tags list when user is typing a tag name
    const filteredTags = allTags.filter(t =>
        t.name.toLowerCase().includes(inputValue.toLowerCase())
    )

    //check if the new inputted tag is empty or already exists
    const canCreate =
        inputValue.trim() !== "" &&
        !allTags.some(t => t.name.toLowerCase() === inputValue.toLowerCase())

    return (
        <div>
            <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="w-[200px] justify-between text-foreground"
                    >
                        <span className="truncate">
                            {selectedTags.length === 0 && "Select tags"}
                            {selectedTags.length === 1 && selectedTags[0].name}
                            {selectedTags.length === 2 &&
                                selectedTags.map(t => t.name).join(", ")}
                            {selectedTags.length > 2 &&
                                `${selectedTags.length} tags selected`}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0 w-[200px]">
                    <Command loop>
                        <CommandInput
                            ref={inputRef}
                            placeholder="Search tags..."
                            value={inputValue}
                            onValueChange={setInputValue}
                        />

                        <CommandList>
                            <CommandGroup className="max-h-[145px] overflow-auto">
                                {filteredTags.map(tag => {
                                    const isSelected = selectedTags.some(t => t.id === tag.id)

                                    return (
                                        <CommandItem
                                            key={tag.id}
                                            value={tag.name}
                                            onSelect={() => toggleTag(tag)}
                                            className={cn(
                                                "data-[selected=true]:bg-accent",
                                                "data-[selected=false]:bg-transparent",
                                                "cursor-pointer hover:bg-accent"
                                            )}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    isSelected ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex-1">{tag.name}</div>

                                        </CommandItem>
                                    )
                                })}

                                {canCreate && (
                                    <CommandItem
                                        onSelect={() => handleCreateTag(inputValue)}
                                        className="text-xs text-muted-foreground"
                                    >
                                        Create "{inputValue}"
                                    </CommandItem>
                                )}
                            </CommandGroup>

                            <CommandSeparator alwaysRender />

                            <CommandGroup>
                                <CommandItem
                                    value={`:${inputValue}:`} // HACK: that way, the edit button will always be shown
                                    onSelect={() => setOpenDialog(true)}
                                    className="text-xs text-muted-foreground"
                                >
                                    <div className={cn("mr-2 h-4 w-4")} />
                                    <Edit2 className="mr-2 h-2.5 w-2.5" />
                                    Edit Tags
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Edit Dialog */}
            <Dialog
                open={openDialog}
                onOpenChange={(open) => {
                    if (!open) {
                        setOpenCombobox(true);
                    }
                    setOpenDialog(open);
                }}
            >
                <DialogContent className="flex max-h-[90vh] flex-col gap-2">
                    <DialogHeader>
                        <DialogTitle className="font-semibold text-primary text-xl mb-0">Edit Tags</DialogTitle>
                        <DialogDescription>
                            Change the tag names or delete the tags. This affects all items using these tags.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-scroll py-2">
                        {allTags.map(tag => (
                            <TagEditItem
                                key={tag.id}
                                tag={tag}
                                onUpdate={handleUpdateTag}
                                onDelete={handleDeleteTag}
                            />
                        ))}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Selected Badges */}
            <div className="relative mt-3">
                {selectedTags.map(tag => (
                    <Badge key={tag.id} className="mb-2 mr-2 border-purple-200 bg-purple-50 text-purple-700 dark:border-0 dark:bg-purple-950 dark:text-purple-300">
                        {tag.name}
                    </Badge>
                ))}
            </div>
        </div>
    )
}

function TagEditItem({
    tag,
    onUpdate,
    onDelete,
}: {
    tag: Tag
    onUpdate: (tag: Tag, newName: string) => void
    onDelete: (tag: Tag) => void
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState(tag.name)
    const [accordionValue, setAccordionValue] = useState<string>("");
    const disabled = name === tag.name;

    useEffect(() => {
        if (accordionValue !== "") {
            inputRef.current?.focus();
        }
    }, [accordionValue]);

    return (
        <Accordion
            key={tag.id}
            type="single"
            collapsible
            value={accordionValue}
            onValueChange={setAccordionValue}
        >
            <AccordionItem value={tag.id}>
                <div className="flex justify-between items-center">
                    <div>
                        <Badge key={tag.id} className="border-purple-200 bg-purple-50 text-purple-700 dark:border-0 dark:bg-purple-950 dark:text-purple-300">
                            {tag.name}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-4">
                        <AccordionTrigger>Edit</AccordionTrigger>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                    Delete
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete "{tag.name}"?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You are about to delete the tag {" "}
                                        <Badge key={tag.id} className="border-purple-200 bg-purple-50 text-purple-700 dark:border-0 dark:bg-purple-950 dark:text-purple-300">
                                            {tag.name}
                                        </Badge>
                                        <br />
                                        This will permanently delete the tag from any item using it as well.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction variant="destructive" onClick={() => onDelete(tag)}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <AccordionContent>
                    <form
                        className="flex items-end gap-4 p-2"
                        onSubmit={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            onUpdate(tag, name)
                            setAccordionValue("");
                        }}
                    >
                        <div className="grid w-full gap-3">
                            <Label htmlFor="name">Tag name</Label>
                            <Input
                                ref={inputRef}
                                id="name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="h-8"
                            />
                        </div>

                        <Button size="sm" type="submit" disabled={disabled}>
                            Save
                        </Button>
                    </form>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}