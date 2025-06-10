"use client";

import { debounceTimeout } from "@/lib/constant";
import { useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";
import { useEffect } from "react";
import { updateNoteAction } from "@/actions/notes";
import useNote from "@/hooks/useNote";

type Props = {
  noteId: string;
  startingNoteText: string;
};

let updateTimeout: NodeJS.Timeout;
function NoteTextInput({ noteId, startingNoteText }: Props) {
  const noteIdParam = useSearchParams().get("noteId") || "";
  const { noteText, setNoteText } = useNote();

  useEffect(() => {
    if (noteIdParam === noteId) {
      setNoteText(startingNoteText);
    }
  }, [noteIdParam, noteId, startingNoteText, setNoteText]);

  const handleUpdateNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;

    setNoteText(text);

    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      updateNoteAction(noteId, text);
    }, debounceTimeout);
  };
  return (
    <textarea
      className="custom-scrollbar placeholder:text-muted-foreground mb-4 h-full w-full resize-none border p-4 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
      value={noteText}
      onChange={handleUpdateNote}
      placeholder="Write your note here..."
    />
  );
}

export default NoteTextInput;
