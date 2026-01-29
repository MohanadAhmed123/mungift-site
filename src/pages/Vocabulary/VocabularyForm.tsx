import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { APP_USERS } from "@/constants/users"
import type { VocabularyFormValues } from "@/types/vocabulary"
import { useAuth } from "@/context/AuthContext"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"

type Props = {
  title: string
  initialValues: VocabularyFormValues
  submitLabel: string
  onSubmit: (values: VocabularyFormValues) => Promise<void>
  onCancel: () => void
}

export default function VocabularyForm({
  title,
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<{ word?: string; definition?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  function validate() {
    const newErrors: typeof errors = {}

    if (!values.word.trim()) {
      newErrors.word = "Word/Phrase is required"
    }

    if (!values.definition.trim()) {
      newErrors.definition = "Definition is required"
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

            {/* Word */}
            <div className="space-y-1">
                <Field>
                    <FieldLabel htmlFor="word">Word / Phrase *</FieldLabel>
                    <Input
                        id="word"
                        value={values.word}
                        onChange={e => setValues(v => ({ ...v, word: e.target.value }))}
                        placeholder="e.g. for realsies"
                    />                
                </Field>
                {errors.word && (
                    <p className="text-sm text-destructive">{errors.word}</p>
                )}
            </div>

            {/* Definition */}
            <div className="space-y-1">
                <Field>
                    <FieldLabel htmlFor="definition">Definition *</FieldLabel>
                    <Textarea
                        id="definition"
                        value={values.definition}
                        onChange={e => setValues(v => ({ ...v, definition: e.target.value }))}
                        placeholder="What does this mean?"
                    />                
                </Field>
                {errors.definition && (
                    <p className="text-sm text-destructive">{errors.definition}</p>
                )}
            </div>

            {/* Example */}
            <Field>
                <FieldLabel htmlFor="example">Example Usage</FieldLabel>
                <Textarea
                    id="example"
                    value={values.example}
                    onChange={e => setValues(v => ({ ...v, example: e.target.value }))}
                    placeholder="e.g., I'm tired for realsies"
                    className="whitespace-pre-wrap"
                />                
            </Field>

            {/* Coined by */}
            <div className="space-y-1">
              <Label>Coined by</Label>
              <Select value={values.coinedBy} onValueChange={value =>
                  setValues(v => ({ ...v, coinedBy: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a person" />
                </SelectTrigger>
                <SelectContent>
                  {APP_USERS.map(name => (
                    <SelectItem key={name.id} value={name.label}>
                      {name.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Linked words */}
            <Field className="gap-2">
                <FieldLabel htmlFor="linkedWords">Similar / Related Words</FieldLabel>
                <FieldDescription>Use comma seperated words</FieldDescription>
                <Input
                    id="linkedWords"
                    value={values.linkedWords}
                    onChange={e => setValues(v => ({ ...v, linkedWords: e.target.value }))}
                    placeholder="e.g., True, You're so right, Fr"
                />           
            </Field>

            {/* Notes */}
            <Field>
                <FieldLabel htmlFor="notes">Notes</FieldLabel>
                <Textarea
                    id="notes"
                    value={values.notes}
                    onChange={e => setValues(v => ({ ...v, notes: e.target.value }))}
                    placeholder="Anything else worth noting?"
                />                
            </Field>

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
