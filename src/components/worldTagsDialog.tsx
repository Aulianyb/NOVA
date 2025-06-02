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
import { useCallback, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tag, TagAPI } from "@shared/types";

const formSchema = z.object({
  tagName: z
    .string()
    .min(1, "Your tag must have a name")
    .max(20, "Tag name must be at most 20 characters long"),
});

export default function WorldTagsDialog({ worldID }: { worldID: string }) {
  const [tagsList, setTagsList] = useState<Tag[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagName: "",
    },
  });

  const { toast } = useToast();

  const handleOpenChange = (newOpenState: boolean) => {
    setIsOpen(newOpenState);
  };

  const fetchData = useCallback(async () => {
    function showError(message: string) {
      const notify = () => {
        toast({
          title: "An Error has Occured!",
          description: message,
          variant: "destructive",
        });
      };
      notify();
    }
    try {
      const res = await fetch(`/api/worlds/${worldID}/tags`);
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.error || "Something went wrong.");
      }
      const tagData = await res.json();
      const tags: Tag[] = tagData.data.map((tag: TagAPI) => ({
        _id: tag._id,
        tagName: tag.tagName,
        tagColor: tag.tagColor,
      }));
      setTagsList(tags);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    }
  }, [worldID, toast]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [fetchData, isOpen]);

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

  async function onCreate(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(`/api/worlds/${worldID}/tags`, {
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
      form.reset();
      fetchData();
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
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
              {tagsList.map((tag) => {
                return (
                  <TagElement
                    key={tag._id}
                    worldID={worldID}
                    tagData={tag}
                    fetchData={fetchData}
                  />
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
