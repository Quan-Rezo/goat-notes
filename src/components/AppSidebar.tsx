import { getUser } from "@/auth/server";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { prisma } from "@/db/prisma";
import { Note } from "@prisma/client";
import Link from "next/link";
import SidebarGroupContent from "./SidebarGroupContent";

async function AppSidebar() {
  const user = await getUser();
  let notes: Note[] = [];
  if (user) {
    notes = await prisma.note.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup />
        <SidebarGroupLabel>
          {user ? (
            "Your Notes"
          ) : (
            <p>
              <Link href="/login" className="underline">
                Login
              </Link>
              {""}
              to see your notes.
            </p>
          )}
        </SidebarGroupLabel>
        {user && <SidebarGroupContent notes={notes} />}
      </SidebarContent>
    </Sidebar>
  );
}
export default AppSidebar;
