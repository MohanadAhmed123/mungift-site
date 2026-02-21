import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { deleteMediaItemWithFile, getAllMedia } from "@/services/mediaService"
import { Button } from "@/components/ui/button"
import { MediaCard } from "@/pages/Media/MediaCard.tsx"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import type { MediaItemWithTags } from "@/types"

export default function MediaItemsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth();

  useEffect(() => {
    async function fetchMediaItems() {
      try {
        const data = await getAllMedia()
        setItems(data)
      } catch (e: any){
        console.error(e)
        toast.error('Error editing word', {
            description: `${e.message}`,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMediaItems()
  }, [])

  async function handleDelete(mediaItem: MediaItemWithTags) {
      if (!user) return
      try {
        await deleteMediaItemWithFile(mediaItem.id, mediaItem.file_url)
      } catch (error) {
        console.error(error)
        toast.error('Error deleting media item', {
          description: `${error instanceof Error ? error.message : String(error)}`,
        })
        return
      }
      // removing media item from list to avoid re-fetch from db
      setItems(prev => prev.filter(i => i.id !== mediaItem.id))

      toast.success('Deleted Successfully', {
        description: `"${mediaItem.caption}" has been deleted.`,
      })
  }

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
            <MediaCard key={item.id} item={item} onDelete={handleDelete} />
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
