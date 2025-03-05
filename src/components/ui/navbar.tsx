import {
  SquarePlus,
  CircleUserRound,
  ChevronsUpDown,
  Bell,
} from "lucide-react";
import { Button } from "./button";
import { quantico } from "@/app/fonts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function Navbar({ username }: { username: string }) {
  const router = useRouter();
  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!res.ok) {
        //self note : fix this so it'll be more descriptive
        throw new Error("Failed to login");
      }
      console.log("Logout successful!");
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-w-screen text-[var(--white)] bg-[var(--primary)] flex items-center justify-between py-3 px-12">
      <div className="flex items-center gap-4">
        <h1 className={`${quantico.className}`}>NOVA</h1>
        <Button variant="ghost" className="h-12 rounded-md">
          <SquarePlus size={10} /> CREATE NEW WORLD
        </Button>
      </div>

      <div>
        <Button variant="ghost" size="icon">
          <Bell />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-4 h-12 rounded-md">
              <CircleUserRound />
              {username}
              <ChevronsUpDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  handleLogout();
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
