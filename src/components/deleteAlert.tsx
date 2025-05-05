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

export default function DeleteAlert({
  objectID,
  deleteNodeFunction,
  openFunction,
}: {
  objectID: string;
  deleteNodeFunction: (objectID: string) => void;
  openFunction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  async function onSubmit() {
    try {
      console.log(objectID);
      const res = await fetch(`/api/objects/${objectID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Object deletion failed");
      }
      deleteNodeFunction(objectID);
      openFunction(false); 
    } catch (error) {
      console.log(error);
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
            This node will be deleted permanently.
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
