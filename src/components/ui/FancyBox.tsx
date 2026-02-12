"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Edit2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DialogClose } from "@radix-ui/react-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Tag } from "@/types"

type FancyBoxProps = {
  allTags: Tag[]
  selectedTags: Tag[]
  onChangeSelected: (tags: Tag[]) => void

  onCreateTag: (name: string) => Promise<Tag>
  onUpdateTag: (tagId: string, newName: string) => Promise<void>
  onDeleteTag: (tagId: string) => Promise<void>
}

export function FancyBox({
  allTags,
  selectedTags,
  onChangeSelected,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
}: FancyBoxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [openCombobox, setOpenCombobox] = React.useState(false)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const toggleTag = (tag: Tag) => {
    const exists = selectedTags.some(t => t.id === tag.id)

    onChangeSelected(
      exists
        ? selectedTags.filter(t => t.id !== tag.id)
        : [...selectedTags, tag],
    )

    inputRef.current?.focus()
  }

  const createTag = async () => {
    if (!inputValue.trim()) return

    const newTag = await onCreateTag(inputValue.trim())
    onChangeSelected([...selectedTags, newTag])
    setInputValue("")
  }

  const hasExactMatch = allTags.some(
    t => t.name.toLowerCase() === inputValue.toLowerCase(),
  )

  return (
    <div className="max-w-[260px]">
      <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedTags.length === 0 && "Select tags"}
              {selectedTags.length === 1 && selectedTags[0].name}
              {selectedTags.length === 2 &&
                selectedTags.map(t => t.name).join(", ")}
              {selectedTags.length > 2 &&
                `${selectedTags.length} tags selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[260px] p-0">
          <Command loop>
            <CommandInput
              ref={inputRef}
              placeholder="Search tags..."
              value={inputValue}
              onValueChange={setInputValue}
            />

            <CommandList>
              <CommandGroup className="max-h-[160px] overflow-auto">
                {allTags.map(tag => {
                  const isActive = selectedTags.some(t => t.id === tag.id)

                  return (
                    <CommandItem
                      key={tag.id}
                      onSelect={() => toggleTag(tag)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span>{tag.name}</span>
                    </CommandItem>
                  )
                })}

                {!hasExactMatch && inputValue && (
                  <CommandItem
                    className="text-xs text-muted-foreground"
                    onSelect={createTag}
                  >
                    Create tag “{inputValue}”
                  </CommandItem>
                )}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup>
                <CommandItem
                  className="text-xs text-muted-foreground"
                  onSelect={() => setOpenDialog(true)}
                >
                  <Edit2 className="mr-2 h-3 w-3" />
                  Edit tags
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected badges */}
      <div className="mt-3 flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <Badge key={tag.id} variant="secondary">
            {tag.name}
          </Badge>
        ))}
      </div>

      {/* Edit dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Tags</DialogTitle>
            <DialogDescription>
              Rename or delete existing tags.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {allTags.map(tag => (
              <EditableTagRow
                key={tag.id}
                tag={tag}
                onUpdate={onUpdateTag}
                onDelete={onDeleteTag}
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
    </div>
  )
}


function EditableTagRow({
  tag,
  onUpdate,
  onDelete,
}: {
  tag: Tag
  onUpdate: (id: string, name: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [value, setValue] = React.useState(tag.name)
  const [open, setOpen] = React.useState(false)

  const isUnchanged = value.trim() === tag.name

  return (
    <Accordion type="single" collapsible value={open ? tag.id : ""}>
      <AccordionItem value={tag.id}>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{tag.name}</Badge>

          <div className="flex items-center gap-2">
            <AccordionTrigger onClick={() => setOpen(!open)}>
              Edit
            </AccordionTrigger>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="xs" variant="destructive">
                  Delete
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete tag?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove the tag from all media items.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(tag.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <AccordionContent>
          <form
            className="mt-2 flex gap-2"
            onSubmit={async e => {
              e.preventDefault()
              if (!isUnchanged) {
                await onUpdate(tag.id, value.trim())
              }
              setOpen(false)
            }}
          >
            <Input
              value={value}
              onChange={e => setValue(e.target.value)}
              className="h-8"
            />
            <Button size="xs" type="submit" disabled={isUnchanged}>
              Save
            </Button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
