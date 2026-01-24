import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { APP_USERS } from "@/constants/users";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function NewWordPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [example, setExample] = useState("");
  const [notes, setNotes] = useState("");
  const [linkedWordsInput, setLinkedWordsInput] = useState("");
  const [coinedBy, setCoinedBy] = useState<string>("");

  const handleSubmit = async () => {
    if (!user) return;

    const linkedWordsArray =
      linkedWordsInput.trim().length > 0
        ? linkedWordsInput
            .split(",")
            .map(w => w.trim())
            .filter(Boolean)
        : null;

    const { error } = await supabase
      .from("vocabulary_words")
      .insert({
        word,
        definition,
        example: example || null,
        notes: notes || null,
        linked_words: linkedWordsArray,
        coined_by: coinedBy || null,
        created_by: user.id,
      });

    if (error) {
      console.error(error);
      alert("Failed to save word");
    } else {
      // reset / navigate
      // **********************LATER ADD A TOAST TO SAY WORD ADDED SUCCESSFULLY
      navigate("/vocabulary");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <input
        className="input"
        placeholder="Word"
        value={word}
        onChange={e => setWord(e.target.value)}
      />

      <textarea
        className="input"
        placeholder="Definition"
        value={definition}
        onChange={e => setDefinition(e.target.value)}
      />

      <textarea
        className="input"
        placeholder="Example (optional)"
        value={example}
        onChange={e => setExample(e.target.value)}
      />

      <textarea
        className="input"
        placeholder="Notes (optional)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />

      <input
        className="input"
        placeholder="Similar words (comma separated)"
        value={linkedWordsInput}
        onChange={e => setLinkedWordsInput(e.target.value)}
      />

      <select
        className="input bg-gray-900"
        value={coinedBy}
        onChange={e => setCoinedBy(e.target.value)}
      >
        <option value="">Coined by (optional)</option>
        {APP_USERS.map(u => (
          <option key={u.id} value={u.label}>
            {u.label}
          </option>
        ))}
      </select>

      <button className="btn-primary" onClick={handleSubmit}>
        Add word
      </button>
    </div>
  );
}
