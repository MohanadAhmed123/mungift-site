import type { VocabularyWord } from "@/types/vocabulary.ts";

interface Props {
  word: VocabularyWord;
}

export function VocabularyCard({ word }: Props) {
  return (
    <div className="rounded-xl border p-4 bg-sky-500/50 shadow-sm">
      {/* Word */}
      <h2 className="text-xl font-bold">{word.word}</h2>

      {/* Definition */}
      <p className="text-black">{word.definition}</p>


      {/* Example */}
      {word.example && (
        <p className="text-sm italic text-black whitespace-pre-wrap py-4">
          {word.example}
        </p>
      )}

      {/* Linked Words */}
      {word.linked_words && word.linked_words.length > 0 && (
        <p className="text-sm text-black">
          <span className="font-medium">Similar:</span>{" "}
          {word.linked_words.join(", ")}
        </p>
      )}

      {/* Notes */}
      {word.notes && (
        <p className="text-sm text-gray-400">
          <span className="font-medium">Notes:</span> {word.notes}
        </p>
      )}

      {/* Metadata */}
      <div className="text-xs text-gray-400">
        {word.coined_by && (
          <span>Coined by {word.coined_by} <br /></span>
          
        )}

        {word.created_at && (
          <span>Created on {new Date(word.created_at).toLocaleDateString()} <br /></span>
        )}
        
        {word.created_at && (
          <span>Last Updated on {new Date(word.updated_at).toLocaleDateString()} at {new Date(word.updated_at).toLocaleTimeString()}</span>
        )}
      </div>
    </div>
  );
}
