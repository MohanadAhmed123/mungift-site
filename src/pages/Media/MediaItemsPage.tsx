import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getMediaItems } from "@/pages/Media/media.ts"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { MediaCard } from "@/pages/Media/MediaCard.tsx"
import { useAuth } from "@/context/AuthContext"

export default function MediaItemsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth();

  useEffect(() => {
    getMediaItems().then(setItems)
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="p-4">Loading…</div>
  }

  return (
    <div className="relative min-h-screen">
      <div className="max-w-3xl mx-auto">
        <header className="mb-4">
          <h1 className="text-4xl font-bold">Media</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Our gallery of pictures, videos and voice recordings
          </p>
        </header>

        <div className="columns-2 sm:columns-3 md:columns-3 gap-2 space-y-4">
            {items.map(item => (
            <MediaCard key={item.id} item={item} />
          ))}
          
        </div>

        {/* Floating Add Button */}
        <Button
          onClick={() => navigate("/media/new")}
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
    </div>
  )
}
