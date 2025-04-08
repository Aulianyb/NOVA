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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { World } from "../../types/types";
import { useRouter } from "next/navigation";
import { SquarePlus } from "lucide-react";

const formSchema = z.object({
  nodeName: z
    .string()
    .min(1, "Your node must have a name")
    .max(20, "Node name must be at most 20 characters long"),
  nodeDescription: z
    .string()
    .max(240, "Description must be under 240 characters long"),
  // Temporary, of course
  nodePicture: z.string().optional(),
});

export function NodeCreationDialog({
  createFunction,
}: {
  createFunction: (input: {
    nodeName: string;
    nodeDescription: string;
    nodePicture: string | undefined;
  }) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nodeName: "",
      nodeDescription: "",
      nodePicture: "/cat-nerd.jpg",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values.nodeName);
    createFunction({
      nodeName: values.nodeName,
      nodeDescription: values.nodeDescription,
      nodePicture: values.nodePicture,
    });
    form.reset(); 
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon">
          <SquarePlus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Node</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This can be anything, like characters, locations, etc!
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="nodePicture"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="picture">Profile Picture</Label>
                  <FormControl>
                    <Input
                      disabled
                      id="picture"
                      type="file"
                      className="bg-white border border-slate-200"
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>This will be added later!</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nodeName"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name" className="text-right">
                    Node Name
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
              name="nodeDescription"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name" className="text-right">
                    Node Description
                  </Label>
                  <FormControl>
                    <Textarea {...field} className="resize-none h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit" className="rounded-lg mt-4">
                  Create
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
