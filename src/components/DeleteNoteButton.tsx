"use client";

import { deleteNoteAction } from "@/actions/notes";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { Delete, Loader2, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

type Props = {
  noteId: string;
  deleteNoteLocally: (noteId: string) => void;
};

function DeleteNoteButton({ noteId, deleteNoteLocally }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const noteIdParam = useSearchParams().get("noteId") || "";

  const [isPending, startTransition] = useTransition();

  const handleDeleteNote = async () => {
    startTransition(async () => {
      const { errorMessage } = await deleteNoteAction(noteId);
      if (!errorMessage) {
        toast.success("Note deleted");
        toast.info("You have successfully deleted your note.");

        deleteNoteLocally(noteId);

        if (noteIdParam === noteId) {
          router.replace("/");
        }
      } else {
        toast.error(errorMessage);
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="absolute top-1/2 right-2 size-7 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 [&_svg]:size-3"
          variant="ghost"
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this note?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your note
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteNote}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteNoteButton;
