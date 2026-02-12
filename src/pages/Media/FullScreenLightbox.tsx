import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import type { MediaType } from "@/types"

type ImageLightboxProps = {
  type: Omit<MediaType, 'video'>
  src: string
  onClose: () => void
}

export function FullScreenLightbox({ type, src, onClose }: ImageLightboxProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      {/* Close button */}
      <Button
        size="icon"
        variant="secondary"
        className="absolute top-4 right-4 z-50"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Image */}
      <div className="flex h-full w-full items-center justify-center p-4">
        {type === 'image' &&
            (<img
            src={src}
            alt=""
            className="
                max-h-full
                max-w-full
                object-contain
                select-none
                touch-manipulation
            "
            />)
        }
        {type === 'audio' &&
            (
            <audio 
                controls 
                className="max-h-full
                        max-w-full
                        object-contain
                        select-none
                        touch-manipulation">
                <source src={src} 
            />
            </audio>
          )
        }
        
      </div>
    </div>
  )
}
