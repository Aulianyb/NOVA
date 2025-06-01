import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Bell, BellDot } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import NotificationElement from "./notificationElement";
import { Notification } from "@shared/types";
import { useState, useCallback } from "react";
import React from "react";
import { useToast } from "@/hooks/use-toast";
export default function NotificationDropdown({
  worldRefresh,
}: {
  worldRefresh: () => void;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  function isPending(notif: Notification) {
    return notif.status == "pending";
  }

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
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.error || "Something went wrong");
      }
      const notifRes = await res.json();
      const notifData = notifRes.data;
      console.log(notifData);
      setNotifications(notifData);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    }
  }, [toast]);

  const handleOpenChange = (isOpen: boolean) => {
    console.log(isOpen);
    if (isOpen) {
      fetchNotifications();
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {notifications.some(isPending) ? <BellDot /> : <Bell />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-80 w-96 overflow-y-auto">
          {notifications.map((notif) => (
            <React.Fragment key={notif._id}>
              <NotificationElement
                notificationData={notif}
                worldRefresh={worldRefresh}
              />
              <DropdownMenuSeparator />
            </React.Fragment>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
