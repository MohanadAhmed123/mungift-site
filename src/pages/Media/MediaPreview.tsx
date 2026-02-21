import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

type Props = {
  file?: File | null
  existingFileUrl?: string | null
  existingFileType?: string | null
  onRemove: () => void
}

export default function MediaPreview({ file, existingFileUrl, existingFileType, onRemove }: Props) {
  if(!file && (!existingFileUrl || !existingFileType)) return null

  const objectUrl = file ? URL.createObjectURL(file) : null
  const fileSrc = objectUrl ?? existingFileUrl
  const fileType = file?.type ?? existingFileType

  const [isActuallyAudio, setIsActuallyAudio] = useState(false);

  useEffect(() => {
    // Reset for every new file
    setIsActuallyAudio(false);

    if (fileType?.startsWith("video")) {
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

      video.src = fileSrc!;
    }
  }, [fileSrc, fileType]);


  return (
    <div className="flex justify-center items-center relative mx-auto w-fit max-w-sm pt-0">
      {fileType?.startsWith("image") ? (
        <img key="img" src={fileSrc!} className="rounded-md block max-h-64 object-contain" />
      ) : (fileType?.startsWith("audio") || isActuallyAudio) ? (
        /* Render audio if it's an audio MIME OR if the video-hack detected no visuals */
        <audio key="audio" src={fileSrc!} controls className="w-full min-w-64" />
      ) : fileType?.startsWith("video") ? (
        <video key="video" src={fileSrc!} controls className="rounded-md max-h-64" />
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
