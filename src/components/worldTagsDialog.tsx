import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
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
import { Hash } from "lucide-react";
import TagElement from "./TagElement";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  tagName: z
    .string()
    .min(1, "Your tag must have a name")
    .max(20, "Tag name must be at most 20 characters long"),
});

export default function WorldTagsDialog() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagName: "",
    },
  });

  async function onCreate(values: z.infer<typeof formSchema>) {
    console.log("Create tag " + values.tagName);
  }

  // async function onDelete() {
  //   console.log("Deleted X");
  // }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon">
          <Hash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>World Tags</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Tags can be used to categorize objects and relationships
        </DialogDescription>
        <div>
          <div className="mt-2 flex">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onCreate)}
                className="flex items-center gap-2"
              >
                <FormField
                  control={form.control}
                  name="tagName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="Insert tag name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="outline" className="rounded-md">
                  Create
                </Button>
              </form>
            </Form>
          </div>

          <ScrollArea className="h-[50vh] w-full">
            <div className="flex flex-wrap gap-2">
              <TagElement color="red" tagName="Placeholder"/>
              <TagElement color="blue" tagName="Family"/>
              <TagElement color ="zinc" tagName="Romantic"/>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
