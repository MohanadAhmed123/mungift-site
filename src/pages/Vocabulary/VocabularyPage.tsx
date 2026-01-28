import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { VocabularyWord } from "@/types/vocabulary"
import { VocabularyCard } from "./VocabularyCard"
import { useNavigate } from "react-router-dom"

export default function VocabularyPage() {
  const [words, setWords] = useState<VocabularyWord[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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

  if (loading) {
    return <div className="p-4">Loading…</div>
  }

  return (
    <div className="relative min-h-screen">
      <div className="px-4 py-6 max-w-md mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Vocabulary</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Our shared inside-joke dictionary
          </p>
        </header>

        <div className="space-y-4 pb-24">
          {words.map((item) => (
            <VocabularyCard
              key={item.id}
              word={item}
            />
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => navigate("/vocabulary/new")}
        className="
          fixed bottom-6 right-6
          h-14 w-14 rounded-full
          shadow-lg text-2xl
          flex items-center justify-center
        "
        aria-label="Add new word"
      >
        +
      </button>
    </div>
  )
}
