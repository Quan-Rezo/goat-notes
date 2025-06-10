"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Note } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useNote from "@/hooks/useNote";
import Link from "next/link";

type Props = {
  note: Note;
};

function SelectNoteButton({ note }: Props) {
  const noteId = useSearchParams().get("noteId") || "";
  const { noteText: selectedNoteText } = useNote();
  const [localNoteText, setLocalNoteText] = useState(note.text);
  const [shouldUseLocalNoteText, setShouldUseLocalNoteText] = useState(false);

  useEffect(() => {
    if (note.id === noteId) {
      setShouldUseLocalNoteText(true);
    } else {
      setShouldUseLocalNoteText(false);
    }
  }, [note.id, noteId]);

  useEffect(() => {
    if (shouldUseLocalNoteText) {
      setLocalNoteText(selectedNoteText);
    }
  }, [selectedNoteText, shouldUseLocalNoteText]);

  const blankNoteText = "EMPTY NOTE";
  let noteText = localNoteText || blankNoteText;
  if (shouldUseLocalNoteText) {
    noteText = selectedNoteText || blankNoteText;
  }

  return (
    <SidebarMenuButton
      asChild
      className={`items-start gap-0 pr-12 ${note.id === noteId && "bg-sidebar-accent/50"}`}
    >
      <Link href={`/?note=${note.id}`} className="flex h-fit flex-col">
        <p className="w-full truncate overflow-hidden text-ellipsis whitespace-nowrap">
          {noteText}
        </p>
        <p className="text-muted-foreground text-xs">
          {note.updatedAt.toLocaleDateString()}
        </p>
      </Link>
    </SidebarMenuButton>
  );
}

export default SelectNoteButton;
