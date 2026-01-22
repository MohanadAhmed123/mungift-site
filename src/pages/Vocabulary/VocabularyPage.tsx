import { useNavigate } from "react-router-dom"
import { VocabularyCard } from "./VocabularyCard"
import { mockVocabulary } from "./mockData"

export default function VocabularyPage() {

  const navigate = useNavigate()
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
          {mockVocabulary.map((item) => (
            <VocabularyCard
              key={item.id}
              word={item.word}
              meaning={item.meaning}
              coinedBy={item.coinedBy}
            />
          ))}
        </div>
      </div>

      <button
        aria-label="Add new word"
        className="
          fixed bottom-6 right-6
          h-14 w-14
          rounded-full
          shadow-lg
          flex items-center justify-center
          text-2xl
        "
        onClick={() => navigate("/vocabulary/new")}
      >
        +
      </button>

    </div>
  )
}
