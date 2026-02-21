import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash, Maximize } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import type { MediaItemWithTags, Tag } from "@/types"
import { FullScreenLightbox } from "@/pages/Media/FullScreenLightbox"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Props {
  item: MediaItemWithTags;
  onDelete: (mediaItem: MediaItemWithTags) => void;
}

export function MediaCard({ item, onDelete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false)

  const [isActuallyAudio, setIsActuallyAudio] = useState(false);
  
    useEffect(() => {
      // Reset for every new file
      setIsActuallyAudio(false);
  
      if (item.file_type.startsWith("video")) {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.muted = true;
        
        video.onloadedmetadata = () => {
          // If a video file has no height/width, it's an audio-only container
          if (video.videoHeight === 0 && video.videoWidth === 0) {
            setIsActuallyAudio(true);
          }
        };
  
        video.src = item.file_url;
      }
    }, [item.file_type, item.file_url]);


  return (
    <Card className="overflow-hidden py-0 gap-4 gap-y-2 h-auto max-w-full">
      {/* Media preview */}
      <div 
        ref={containerRef}
        className="touch-manipulation"
      >
        {item.file_type.startsWith("image") ? (
          <img
            src={item.file_url}
            className="object-contain w-full h-full select-none touch-manipulation"
          />
        ) : (item.file_type.startsWith("audio") || isActuallyAudio) ? (
          <audio controls className="w-full px-2">
            <source src={item.file_url} />
          </audio>
        ) : 
          item.file_type.startsWith("video") ? (
          <video
            src={item.file_url}
            controls
            className="w-full h-full object-contain"
          />
        ) : null
        }
      </div>
      <CardHeader className="px-2">
        <CardTitle className="font-semibold text-primary text-sm sm:text-md break-normal">
          {item.caption}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-2">
        <div className="">
          
          {item.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag: Tag) => (
                <Badge key={tag.id} className="border-purple-200 bg-purple-50 text-purple-700 dark:border-0 dark:bg-purple-950 dark:text-purple-300">
                    {tag.name}
                </Badge>
              ))}
            </div>
          ) : (
            <Badge className="italic" variant="outline">No tags</Badge>
          )
          }
        </div>
        
      </CardContent>

      {/* Actions */}
      <CardFooter className="flex justify-center px-2">
        
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/media/edit/${item.id}`, {
                            state: { item }, //passing in the current media item values to the edit form page
                          })
            }
          >
            <Pencil />
          </Button>

          <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Trash className="text-destructive" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete media item?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete “{item.caption}”.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground"
                    onClick={() => onDelete(item)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          {(item.file_type.startsWith("image") || item.file_type.startsWith("audio") || isActuallyAudio) && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsOpen(true)} //activating fullscreen lightbox component
              
            >
              <Maximize />
            </Button>
          )}
        
        
      </CardFooter>
      {isOpen && (
        <FullScreenLightbox
          type={isActuallyAudio ? "audio" : item.file_type}
          src={item.file_url}
          onClose={() => setIsOpen(false)}
        />
      )}
    </Card>
    
  )
}
