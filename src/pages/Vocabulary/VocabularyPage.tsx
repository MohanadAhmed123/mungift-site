import { VocabularyCard } from "./VocabularyCard"
import { mockVocabulary } from "./mockData"

export default function VocabularyPage() {
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
    </div>
  )
}
