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
import React from "react";
export default function NotificationDropdown({
  worldRefresh,
  notifications,
  fetchNotification,
}: {
  worldRefresh: () => void;
  notifications: Notification[];
  fetchNotification: () => Promise<void>;
}) {
  const isValidPending = (n: Notification) =>
    n.status === "pending" && n.worldID != null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {notifications.some(isValidPending) ? (
            <BellDot className="animate-bounce" />
          ) : (
            <Bell />
          )}
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
                fetchNotification={fetchNotification}
              />
              <DropdownMenuSeparator />
            </React.Fragment>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
