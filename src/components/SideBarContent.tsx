"use client";
import { Note } from "@prisma/client";

type Props = {
  notes: Note[];
};
function SidebarGroupContent({ notes }: Props) {
  console.log(notes);
  return (
    <div>
      {notes.map((note) => (
        <div key={note.id}>{note.text}</div>
      ))}
    </div>
  );
}

export default SidebarGroupContent;
