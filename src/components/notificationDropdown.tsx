import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import NotificationElement from "./notificationElement";
import { Notification } from "../../types/types";
import { useState, useCallback } from "react";
import React from "react";

export default function NotificationDropdown({
  worldRefresh,
}: {
  worldRefresh: () => void;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) {
        throw new Error("Failed to get notifications");
      }
      const notifRes = await res.json();
      const notifData = notifRes.data;
      console.log(notifData);
      setNotifications(notifData);
    } catch (error) {
      console.log(error);
    }
  }, []);

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
          <Bell />
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
