type VocabularyCardProps = {
  word: string
  meaning: string
  coinedBy?: string
}

export function VocabularyCard({
  word,
  meaning,
  coinedBy,
}: VocabularyCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">
        {word}
      </h2>

      <p className="text-sm leading-relaxed mb-3">
        {meaning}
      </p>

      {coinedBy && (
        <p className="text-xs text-neutral-500">
          Coined by {coinedBy}
        </p>
      )}
    </div>
  )
}
