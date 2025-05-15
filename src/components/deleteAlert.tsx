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
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DeleteAlert({
  id,
  deleteFunction,
  openFunction,
  type,
}: {
  id: string;
  deleteFunction: (id: string) => void;
  openFunction: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
}) {
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
      const res = await fetch(`/api/${type}s/${id}`, {
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
      deleteFunction(id);
      openFunction(false);
      showNotification(
        "Deleted " + type + "!",
        type + " is deleted succesfully",
        "success"
      );
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="iconSm" className="hover:text-red-500">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This {type} will be deleted permanently.
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
