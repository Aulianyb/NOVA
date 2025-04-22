import {
  SquarePlus,
  CircleUserRound,
  ChevronsUpDown,
  Bell,
} from "lucide-react";
import { Button } from "./ui/button";
import { quantico } from "@/app/fonts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { CreateWorldDialog } from "./worldCreationDialog";
import WorldSettingDialog from "./worldSettingDialog";
import { World } from "../../types/types";

export function Navbar({
  username,
  worldRefresh,
}: {
  username: string;
  worldRefresh : () => void
}) {
  const router = useRouter();

  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!res.ok) {
        //self note : fix this so it'll be more descriptive
        throw new Error("Failed to logout");
      }
      console.log("Logout successful!");
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="w-full text-[var(--white)] bg-[var(--primary)] flex items-center justify-between py-3 px-12">
      <div className="flex items-center gap-4">
        <h1 className={`${quantico.className}`}>NOVA</h1>
        <CreateWorldDialog worldRefresh={worldRefresh}/>
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
