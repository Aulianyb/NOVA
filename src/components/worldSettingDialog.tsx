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
import { ScrollArea } from "@/components/ui/scroll-area";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  worldName: z
    .string()
    .min(1, "Your world must have a name")
    .max(20, "World name must be at most 20 characters long"),
  worldDescription: z
    .string()
    .max(240, "Description must be under 240 characters long"),
});

const inviteSchema = z.object({
  receiver: z.string().min(1, "Your must enter a username to invite"),
  worldID: z.string(),
});

export default function WorldSettingDialog({
  worldData,
}: {
  worldData: World;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      worldName: worldData.worldName,
      worldDescription: worldData.worldDescription,
    },
  });

  const inviteForm = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      receiver: "",
      worldID: worldData._id,
    },
  });

  const notifyAdded = () => {
    toast({
      title: "Invitation Sent!",
      description:
        "Collaborator will be added when the other user accepted this invitation.",
      variant: "success",
    });
  };

  const notifyDeleted = () => {
    toast({
      title: "Collaborator Removed!",
      description: "Collaborator has been removed from this world.",
      variant: "success",
    });
  };

  async function onInvite(values: z.infer<typeof inviteSchema>) {
    try {
      const res = await fetch(`/api/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        throw new Error("Invite failed");
      }
      notifyAdded();
    } catch (error) {
      console.log(error);
    }
  }

  async function onEdit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(`/api/worlds/${worldData._id}`, {
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
      console.log(error);
    }
  }

  async function onDelete() {
    try {
      const res = await fetch(`/api/worlds/${worldData._id}`, {
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
        <ScrollArea className="h-[70vh] w-full">
          <div className="space-y-2">
            <h2>Manage World</h2>
            <hr />
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
                        <Textarea
                          {...field}
                          className="resize-none h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="rounded-lg mt-2">
                  Save Changes
                </Button>
              </form>
            </Form>
          </div>
          <div className="space-y-2 mt-10">
            <div className="flex justify-between items-center">
              <h2>Manage Collaborators</h2>
            </div>
            <hr />
            <div className="flex flex-col gap-5">
              <div>
                <Label>Invite New Collaborators</Label>
                <div className="mt-2 flex">
                  <Form {...inviteForm}>
                    <form
                      onSubmit={inviteForm.handleSubmit(onInvite)}
                      className="flex items-center gap-2"
                    >
                      <FormField
                        control={inviteForm.control}
                        name="receiver"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Find username" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        variant="outline"
                        className="rounded-md"
                      >
                        Invite
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>

              <div>
                <Label>Collaborators in this world</Label>
                <DataTable
                  columns={columns(worldData._id, notifyDeleted)}
                  data={worldData.collaborators}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2  mt-10">
            <h2>Danger Zone</h2>
            <hr />
            <div className="w-full space-y-2 p-2 border-red-200 border-2 rounded-lg">
              <DialogDescription>
                Delete your world and it's contents. This action is
                irreversible.
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
