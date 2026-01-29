import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useAuth } from "@/context/AuthContext"
import { APP_USERS } from "@/constants/users"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"

export default function NewWordPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [word, setWord] = useState("")
  const [definition, setDefinition] = useState("")
  const [example, setExample] = useState("")
  const [notes, setNotes] = useState("")
  const [linkedWords, setLinkedWords] = useState("")
  const [coinedBy, setCoinedBy] = useState<string | undefined>()

  const [errors, setErrors] = useState<{ word?: string; definition?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate() {
    const newErrors: typeof errors = {}

    if (!word.trim()) {
      newErrors.word = "Word/Phrase is required"
    }

    if (!definition.trim()) {
      newErrors.definition = "Definition is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || !user) return

    setIsSubmitting(true)

    const linkedWordsArray =
      linkedWords
        .split(",")
        .map(w => w.trim())
        .filter(Boolean)

    const { error } = await supabase
      .from("vocabulary_words")
      .insert({
        word,
        definition,
        example: example || null,
        notes: notes || null,
        linked_words: linkedWordsArray.length ? linkedWordsArray : null,
        coined_by: coinedBy || null,
        created_by: user.id,
      })

    setIsSubmitting(false)

    if (error) {
      console.error(error)
      return
    }

    navigate("/vocabulary")
  }

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardHeader>
            <CardTitle>
                <h1 className="font-semibold text-primary text-2xl">
                    Add New Word/Phrase
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
                        value={word}
                        onChange={e => setWord(e.target.value)}
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
                        value={definition}
                        onChange={e => setDefinition(e.target.value)}
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
                    value={example}
                    onChange={e => setExample(e.target.value)}
                    placeholder="e.g., I'm tired for realsies"
                    className="whitespace-pre-wrap"
                />                
            </Field>       

            {/* Coined by */}
            <div className="space-y-1">
              <Label>Coined by</Label>
              <Select value={coinedBy} onValueChange={setCoinedBy}>
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
                    value={linkedWords}
                    onChange={e => setLinkedWords(e.target.value)}
                    placeholder="e.g., True, You're so right, Fr"
                />           
            </Field>

            {/* Notes */}
            <Field>
                <FieldLabel htmlFor="notes">Notes</FieldLabel>
                <Textarea
                    id="notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Anything else worth noting?"
                />                
            </Field>

          </CardContent>

          <CardFooter className="flex justify-between gap-2 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/vocabulary")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
