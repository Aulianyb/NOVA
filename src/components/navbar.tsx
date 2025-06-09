import { CircleUserRound, ChevronsUpDown } from "lucide-react";
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
import NotificationDropdown from "./notificationDropdown";
import { useCallback, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@shared/types";

export function Navbar({
  username,
  worldRefresh,
}: {
  username: string;
  worldRefresh: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const fetchNotifications = useCallback(async () => {
    function showError(message: string) {
      const notify = () => {
        toast({
          title: "An Error has Occured!",
          description: message,
          variant: "destructive",
        });
      };
      notify();
    }
    try {
      const res = await fetch("/api/notifications");
      const notifRes = await res.json();
      if (!res.ok) throw new Error(notifRes.error || "Something went wrong");

      const notifData = notifRes.data;
      setNotifications(notifData);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    }
  }, [toast]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

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
        <CreateWorldDialog worldRefresh={worldRefresh} />
      </div>

      <div>
        <NotificationDropdown
          worldRefresh={worldRefresh}
          notifications={notifications}
          fetchNotification={fetchNotifications}
        />
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
