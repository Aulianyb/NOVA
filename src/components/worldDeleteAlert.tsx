import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function WorldDeleteAlert({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();

  function showNotification(
    title: string,
    description: string,
    variant: "default" | "destructive" | "success" | null | undefined
  ) {
    const notify = () => {
      toast({
        title: title,
        description: description,
        variant: variant,
      });
    };
    notify();
  }

  function showError(message: string) {
    showNotification("An Error has Occcured", message, "destructive");
  }

  async function onSubmit() {
    try {
      const res = await fetch(`/api/worlds/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.error || "Something went wrong");
      }
      showNotification(
        "World Deleted!",
        "This world is successfully deleted.",
        "success"
      );
      router.push("/worlds");
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="rounded-lg w-full bg-red-500 hover:bg-red-600">
          Destroy World
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This world will be deleted permanently. There is no way to undo this
            action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="rounded-lg" onClick={() => onSubmit()}>
            Delete
          </AlertDialogAction>
          <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
