import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { VocabularyWord } from "@/types/vocabulary"
import { VocabularyCard } from "./VocabularyCard"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

export default function VocabularyPage() {
  const [words, setWords] = useState<VocabularyWord[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth();

  useEffect(() => {
    const fetchWords = async () => {
      const { data, error } = await supabase
        .from("vocabulary_words")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error && data) {
        setWords(data)
      }

      setLoading(false)
    }

    fetchWords()
  }, [])

  async function handleDelete(word: VocabularyWord) {
    if (!user) return
    const { error } = await supabase
      .from("vocabulary_words")
      .delete()
      .eq("id", word.id)

    if (error) {
      console.error(error)
      toast.error('Error deleting word', {
        description: `${error.message}`,
      })
      return
    }

    // removing word from list to avoid re-fetch from db
    setWords(prev => prev.filter(w => w.id !== word.id))

    toast.success('Deleted Successfully', {
      description: `"${word.word}" has been deleted.`,
    })
  }

  if (loading) {
    return <div className="p-4">Loading…</div>
  }

  return (
    <div className="relative min-h-screen">
      <div className="max-w-md mx-auto">
        <header className="mb-4">
          <h1 className="text-4xl font-bold">Vocabulary</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Our silly and funny dictionary of words/phrases
          </p>
        </header>

        <div className="space-y-4 pb-24">
          {words.map((item) => (
            <VocabularyCard
              key={item.id}
              word={item}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <Button
        onClick={() => navigate("/vocabulary/new")}
        size="icon"
        variant="default"
        className="
          fixed bottom-6 right-6
          rounded-full
          shadow-lg text-2xl
          flex items-center justify-center
        "
        aria-label="Add new word"
      >
        +
      </Button>
    </div>
  )
}
