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
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function WorldSavingAlert() {
  const router = useRouter();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon">
          <ArrowLeft />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Wait! You haven't saved your layout!
          </AlertDialogTitle>
          <AlertDialogDescription>
            You haven't saved your graph layout, do you want to save it? (Object
            and Relationship data is already saved, however the position of
            objects has not been saved)
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className="rounded-lg"
            onClick={() => router.push("/worlds")}
          >
            Continue without saving
          </AlertDialogAction>
          <AlertDialogCancel className="rounded-lg">Go Back</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
