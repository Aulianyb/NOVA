import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { World } from "../../types/types";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  worldName: z
    .string()
    .min(1, "Your world must have a name")
    .max(20, "World name must be at most 20 characters long"),
  worldDescription: z
    .string()
    .max(240, "Description must be under 240 characters long"),
});

export default function WorldSettingDialog({ worldData }: { worldData: World }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      worldName: worldData.worldName,
      worldDescription: worldData.worldDescription,
    },
  });

  async function onEdit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(`/api/worlds/${worldData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        throw new Error("World edit failed");
      }
      window.location.reload();
    } catch (error) {
      
    }
  }

  async function onDelete() {
    try {
      const res = await fetch(`/api/worlds/${worldData.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("World delete failed");
      }
      router.push("/worlds");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>World Settings</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Edit your world's name and description
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEdit)}>
            <FormField
              control={form.control}
              name="worldName"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name" className="text-right">
                    World Name
                  </Label>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="worldDescription"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name" className="text-right">
                    World Description
                  </Label>
                  <FormControl>
                    <Textarea {...field} className="resize-none h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="rounded-lg mt-4">
              Save Changes
            </Button>
          </form>
        </Form>
        <div className="mt-4 w-full space-y-2 p-2 border-red-200 border-2 rounded-lg">
          <DialogTitle className=" text-red-900">Danger Zone</DialogTitle>
          <DialogDescription>
            Delete your world and it's contents. This action is irreversible.
          </DialogDescription>
          <Button
            className="rounded-lg w-full bg-red-500 hover:bg-red-600"
            onClick={() => {
              onDelete();
            }}
          >
            Destroy World
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
