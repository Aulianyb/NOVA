import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
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
import { World } from "@type/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useToast } from "@/hooks/use-toast";
import WorldDeleteAlert from "./worldDeleteAlert";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  worldName: z
    .string()
    .min(1, "Your world must have a name")
    .max(20, "World name must be at most 20 characters long"),
  worldDescription: z
    .string()
    .max(240, "Description must be under 240 characters long"),
  worldCover: z
    .any()
    .transform((val) => (val instanceof FileList ? val[0] : val))
    .optional()
    .refine(
      (file) => file === undefined || file?.size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`
    )
    .refine(
      (file) => file === undefined || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

const inviteSchema = z.object({
  receiver: z.string().min(1, "Your must enter a username to invite"),
  worldID: z.string(),
});

export default function WorldSettingDialog({
  worldData,
  graphRefresh,
}: {
  worldData: World;
  graphRefresh: () => void;
}) {
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
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.error || "Something went wrong");
      }
      showNotification(
        "Invitation Sent!",
        "Collaborator will be added when the other user accepted this invitation.",
        "success"
      );
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    }
  }

  async function onEdit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("worldName", values.worldName);
      formData.append("worldDescription", values.worldDescription);
      formData.append("worldCover", values.worldCover);
      const res = await fetch(`/api/worlds/${worldData._id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.error || "Something went wrong");
      }
      showNotification("World Edited!", "Your changes are saved.", "success");
      graphRefresh();
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
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
                  name="worldCover"
                  render={() => (
                    <FormItem>
                      <Label htmlFor="picture">World Cover</Label>
                      <FormControl>
                        <Input
                          id="picture"
                          type="file"
                          className="bg-white border border-slate-200"
                          {...form.register("worldCover")}
                        />
                      </FormControl>
                      <FormDescription>
                        If you left this blank, it won't change anything!
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              <WorldDeleteAlert id={worldData._id} />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
