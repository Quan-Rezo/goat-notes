import Link from "next/link";
import Image from "next/image";
import { shadow } from "@/styles/utils";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import { getUser } from "@/auth/server";
import LogOutButton from "./LogOutButton";
import { SidebarTrigger } from "@/components/ui/sidebar";

async function Header() {
  const user = await getUser();
  return (
    <header
      className="bg-popover relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
      style={{
        boxShadow: shadow,
      }}
    >
      <SidebarTrigger className="absolute left-4" />
      <Link className="flex items-end gap-2" href="/">
        <Image
          src="/goat.jpg"
          height={60}
          width={60}
          alt="logo"
          className="rounded-full object-cover"
          priority
        />
        <h1 className="flex flex-col pb-1 text-2xl leading-6 font-semibold text-white">
          GOAT <span>Notes</span>
        </h1>
      </Link>
      <div className="flex gap-4">
        {user ? (
          <LogOutButton />
        ) : (
          <>
            <Button asChild>
              <Link className="hidden sm:block" href="/signup">
                Sign Up
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}

export default Header;
