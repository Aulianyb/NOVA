import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { World } from "../../types/types";
import { useRouter } from "next/navigation";
import { SquarePlus } from "lucide-react";

const formSchema = z.object({
  objectName: z
    .string()
    .min(1, "Your object must have a name")
    .max(20, "Object name must be at most 20 characters long"),
  objectDescription: z
    .string()
    .max(240, "Description must be under 240 characters long"),
  // Temporary, of course
  objectImage: z.string(),
});

export function ObjectCreationDialog() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      objectName: "",
      objectDescription: "",
      objectImage: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitted!");
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
          <DialogTitle>Create a New Object</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This can be anything, like characters, locations, etc!
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="objectImage"
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
                  <FormDescription>
                    This will be added later!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="objectName"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name" className="text-right">
                    Object Name
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
              name="objectDescription"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name" className="text-right">
                    Object Description
                  </Label>
                  <FormControl>
                    <Textarea {...field} className="resize-none h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="rounded-lg mt-4">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
