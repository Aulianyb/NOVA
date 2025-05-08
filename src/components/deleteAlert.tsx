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
  id,
  deleteFunction,
  openFunction,
  type
}: {
  id: string;
  deleteFunction: (id : string) => void;
  openFunction: React.Dispatch<React.SetStateAction<boolean>>;
  type : string
}) {
  async function onSubmit() {
    try {
      const res = await fetch(`/api/${type}s/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`${type} deletion failed`);
      }
      deleteFunction(id);
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
