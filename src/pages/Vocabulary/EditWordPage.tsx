import { useLocation, useNavigate, useParams } from "react-router-dom"
import type { VocabularyWord, VocabularyFormValues } from "@/types";
import VocabularyForm from "./VocabularyForm";
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function EditWordPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // loading the passed in word values from the navigate state
    const location = useLocation();
    const currWord = location.state?.word as VocabularyWord | undefined
    const formWord = {
        word: currWord?.word,
        definition: currWord?.definition,
        example: currWord?.example,
        notes: currWord?.notes,
        linkedWords: currWord?.linked_words?.join(", "),
        coinedBy: currWord?.coined_by,
    } as VocabularyFormValues

    return (
        <VocabularyForm
        title="Edit Word/Phrase"
        submitLabel="Save Changes"
        initialValues={formWord}
        onCancel={() => navigate("/vocabulary")}
        onSubmit={async values => {
            if (!user) return

            const linkedWordsArray = values.linkedWords
            .split(",")
            .map(w => w.trim())
            .filter(Boolean)

            const { error } = await supabase
            .from("vocabulary_words")
            .update({
                word: values.word,
                definition: values.definition,
                example: values.example || null,
                notes: values.notes || null,
                linked_words: linkedWordsArray.length ? linkedWordsArray : null,
                coined_by: values.coinedBy || null,
            })
            .eq("id", id);

            if (error) {
                console.error(error)
                toast.error('Error editing word', {
                    description: `${error.message}`,
                })
                return
            }

            toast.success('Edited Successfully', {
                description: `"${values.word}" has been updated.`,
            })
            navigate("/vocabulary")
        }}
        />
    );
}
