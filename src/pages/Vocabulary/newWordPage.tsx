import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext"
import VocabularyForm from "@/pages/Vocabulary/VocabularyForm"
import { toast } from "sonner"

export default function NewWordPage() {
    const navigate = useNavigate()
    const { user } = useAuth()  

    return (
        <VocabularyForm
        title="Add New Word/Phrase"
        submitLabel="Save"
        initialValues={{
            word: "",
            definition: "",
            example: "",
            notes: "",
            linkedWords: "",
            coinedBy: undefined,
        }}
        onCancel={() => navigate("/vocabulary")}
        onSubmit={async values => {
            if (!user) return

            const linkedWordsArray = values.linkedWords
            .split(",")
            .map(w => w.trim())
            .filter(Boolean)

            const { error } = await supabase
            .from("vocabulary_words")
            .insert({
            word: values.word,
            definition: values.definition,
            example: values.example || null,
            notes: values.notes || null,
            linked_words: linkedWordsArray.length ? linkedWordsArray : null,
            coined_by: values.coinedBy || null,
            created_by: user.id,
            })
            
            if (error) {
                console.error(error)
                toast.error('Error adding new word', {
                    description: `${error.message}`,
                })
                return
            }

            toast.success('Added Successfully', {
                description: `"${values.word}" has been created.`,
            })
            navigate("/vocabulary")
        }}
        />
    )
}
