import { Notification } from "@shared/types";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

export default function NotificationElement({
  notificationData,
  worldRefresh,
  fetchNotification,
}: {
  notificationData: Notification;
  worldRefresh: () => void;
  fetchNotification: () => Promise<void>;
}) {
  const { toast } = useToast();

  function showNotification(response: string) {
    const notifyResponded = () => {
      toast({
        title: "You " + response + " this invitation.",
        variant: response == "accepted" ? "success" : "destructive",
      });
    };
    notifyResponded();
  }

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

  async function handleRespond(response: string) {
    try {
      const req = {
        status: response,
      };
      const res = await fetch(`/api/notifications/${notificationData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.error || "Something went wrong");
      }
      worldRefresh();
      fetchNotification();
      showNotification(response);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    }
  }

  if (!notificationData.worldID) {
    return (
      <div className="flex justify-between text-sm p-2 items-center italic">
        <p> This is an invitation for a world that no longer exists. </p>
      </div>
    );
  }

  if (notificationData.status == "kicked") {
    return (
      <div className="flex justify-between text-sm p-2 items-center italic">
        <p> You were kicked out from {notificationData.worldID.worldName}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-between text-sm p-2 items-center">
      <p>
        {notificationData.sender.username} invited you to{" "}
        {notificationData.worldID.worldName}
      </p>
      <div className="flex gap-1">
        <Button
          disabled={notificationData.status != "pending"}
          onClick={() => handleRespond("accepted")}
          className="rounded-md"
          size="sm"
          variant="success"
        >
          accept
        </Button>
        <Button
          disabled={notificationData.status != "pending"}
          onClick={() => handleRespond("rejected")}
          className="rounded-md"
          variant="destructive"
          size="sm"
        >
          reject
        </Button>
      </div>
    </div>
  );
}
