import type { VocabularyWord } from "@/types/vocabulary.ts";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"

import { Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  word: VocabularyWord;
  onDelete: (word: VocabularyWord) => void;
}

export function VocabularyCard({ word, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <Card className="gap-y-2">
      {/* Header */}
      <CardHeader>
        <CardTitle className="font-bold text-primary text-3xl sm:text-4xl">
          {word.word}
        </CardTitle>
        <CardAction className="flex justify-end">
          <div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/vocabulary/edit/${word.id}`, {
                              state: { word }, //passing in the current word values to the edit form page
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
                  <AlertDialogTitle>Delete word?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete “{word.word}”.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground"
                    onClick={() => onDelete(word)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
        </CardAction>
      </CardHeader>

      {/* Content */}
      <CardContent>
        {/* Definition */}
        <p className="text-card-foreground text-lg sm:text-xl">
          {word.definition}
        </p>

        {/* Example */}
        {word.example && (
          <p className="italic pt-2 whitespace-pre-wrap text-base sm:text-lg text-muted-foreground">
            {word.example}
          </p>
        )}

        {word.coined_by && (
          <p className="mt-4 font-semibold">by {word.coined_by}</p>
        )}

        {/* Linked words */}
        {word.linked_words && word.linked_words?.length > 0 && (
          <p className="text-base mt-2 text-muted-foreground">
            <span>Similar: &thinsp;</span>
            {word.linked_words.join(" | ")}
          </p>
        )}


      </CardContent>

      {/* Footer */}
      <CardFooter>
        <div className="flex flex-col items-start gap-1 text-xs text-muted-foreground">

          {/* Notes */}
          {word.notes && (
            <p>
              Notes: {word.notes}
            </p>
          )}

          {word.created_at && (
            <span>Created on {new Date(word.created_at).toLocaleDateString()} <br /></span>
          )}

          {word.updated_at && (
            <span>Last Updated on {new Date(word.updated_at).toLocaleDateString()} at {new Date(word.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          )}
        </div>
      </CardFooter>
    </Card>

  );
}
