import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

type Props = {
  file: File | undefined
  onRemove: () => void
}

export default function MediaPreview({ file, onRemove }: Props) {
  if(!file) return null
  const url = URL.createObjectURL(file)

  const [isActuallyAudio, setIsActuallyAudio] = useState(false);

  useEffect(() => {
    // Reset for every new file
    setIsActuallyAudio(false);

    if (file.type.startsWith("video")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      
      video.onloadedmetadata = () => {
        // If a video file has no height/width, it's an audio-only container
        if (video.videoHeight === 0 && video.videoWidth === 0) {
          setIsActuallyAudio(true);
        }
        // Clean up the object URL to prevent memory leaks
        URL.revokeObjectURL(video.src);
      };

      video.src = url;
    }
  }, [url, file.type]);


  return (
    <div className="flex justify-center items-center relative mx-auto w-fit max-w-sm pt-0">
      {file.type.startsWith("image") ? (
        <img key="img" src={url} className="rounded-md block max-h-64 object-contain" />
      ) : (file.type.startsWith("audio") || isActuallyAudio) ? (
        /* Render audio if it's an audio MIME OR if the video-hack detected no visuals */
        <audio key="audio" src={url} controls className="w-full min-w-64" />
      ) : file.type.startsWith("video") ? (
        <video key="video" src={url} controls className="rounded-md max-h-64" />
      ) : null}
      
      <Button
        type="button"
        onClick={onRemove}
        size="icon-xs"
        variant="outline"
        className="text-destructive absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2"
      >
        <X className="h-4 w-4" />
      </Button>

    </div>
    
  )
  
}
