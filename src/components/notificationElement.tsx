import { Notification } from "../../types/types";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

export default function NotificationElement({
  notificationData,
  worldRefresh,
}: {
  notificationData: Notification;
  worldRefresh: () => void;
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

  async function handleRespond(response: string) {
    try {
      const req = {
        status: response,
      };
      const res = await fetch(`/api/notifications/${notificationData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });
      if (!res.ok) {
        throw new Error("Response Failed!");
      }
      worldRefresh();
      showNotification(response);
    } catch (error) {
      console.log(error);
    }
  }

  if (!notificationData.worldID) {
    return (
      <div className="flex justify-between text-sm p-2 items-center italic">
        <p> This is an invitation for a world that no longer exists. </p>
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
