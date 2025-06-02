import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
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
import { PencilLine } from "lucide-react";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import { Edge } from "@xyflow/react";
import { RelationshipData, Tag, TagAPI } from "@shared/types";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraphTags } from "./graphTags";

const formSchema = z.object({
  relationshipDescription: z
    .string()
    .max(240, "Description must be under 240 characters long"),
  mainTag: z.string().optional().nullable(),
});

const tagSchema = z.object({
  tagID: z.string(),
});

export default function RelationshipSettingDialog({
  relationshipData,
  graphRefresh,
  worldID,
  currentTags,
  mainTag,
  fetchData,
}: {
  relationshipData: Edge<RelationshipData>;
  graphRefresh: () => void;
  worldID: string;
  currentTags: Tag[];
  mainTag: Tag | undefined;
  fetchData: () => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tagsList, setTagsList] = useState<Tag[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      relationshipDescription: relationshipData.data!.relationshipDescription,
      mainTag: mainTag ? mainTag._id : undefined,
    },
  });

  const tagForm = useForm<z.infer<typeof tagSchema>>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      tagID: "",
    },
  });

  const resetForm = useCallback(() => {
    form.reset({
      relationshipDescription: relationshipData.data!.relationshipDescription,
    });
  }, [form, relationshipData.data]);

  useEffect(() => {
    resetForm();
  }, [relationshipData, form, resetForm]);

  const { toast } = useToast();
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

  const fetchWorldTags = useCallback(async () => {
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
      const tagData = await res.json();
      if (!res.ok) {
        console.log(tagData);
        throw new Error(tagData.error || "Something went wrong.");
      }
      const tags: Tag[] = tagData.data
        .filter((tag: TagAPI) => !currentTags.some((t) => t._id === tag._id))
        .map((tag: TagAPI) => ({
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
  }, [worldID, toast, currentTags]);

  useEffect(() => {
    if (isOpen) {
      fetchWorldTags();
    }
  }, [fetchWorldTags, isOpen, currentTags]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const reqBody = {
        relationshipDescription: values.relationshipDescription,
        mainTag: values.mainTag,
      };
      const res = await fetch(`/api/relationships/${relationshipData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.error || "Something went wrong");
      }
      graphRefresh();
      setIsOpen(false);
      showNotification(
        "Successfuly edited relationship!",
        "Changes of the relaionship is saved",
        "success"
      );
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    }
  }

  async function onTagging(values: z.infer<typeof tagSchema>) {
    try {
      const res = await fetch(
        `/api/relationships/${relationshipData.id}/tags`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          graphRefresh();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => console.log("Edit")}
        >
          <PencilLine />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[50vw]">
        <DialogHeader>
          <DialogTitle>Edit Relationship</DialogTitle>
        </DialogHeader>
        <DialogDescription>Change Relationship Description</DialogDescription>
        <div className="flex gap-5">
          <div className="flex-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="relationshipDescription"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="name" className="text-right">
                        Relationship Description
                      </Label>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2 mt-4">
                  <Label htmlFor="name">Main Tag</Label>
                  <FormField
                    control={form.control}
                    name="mainTag"
                    render={({ field }) => (
                      <Select
                        disabled={currentTags.length == 0}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            placeholder={
                              mainTag ? mainTag.tagName : "Select Tag"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select Tag</SelectLabel>
                            {currentTags.map((tag) => {
                              return (
                                <SelectItem value={tag._id} key={tag._id}>
                                  {tag.tagName}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormDescription>
                    This will shown in the graph
                  </FormDescription>
                </div>
                <DialogFooter>
                  <Button type="submit" className="rounded-lg mt-4">
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>

          <div className="pl-4 border-l border-zinc-300 flex-1 space-y-2 mt-4 ">
            <Label htmlFor="name">Add Tags</Label>
            <Form {...tagForm}>
              <form
                onSubmit={tagForm.handleSubmit(onTagging)}
                className="flex gap-2"
              >
                <FormField
                  control={tagForm.control}
                  name="tagID"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Tag" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Tag</SelectLabel>
                          {tagsList.map((tag) => {
                            return (
                              <SelectItem value={tag._id} key={tag._id}>
                                {tag.tagName}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button type="submit" variant="outline" className="rounded-md">
                  Add
                </Button>
              </form>
            </Form>

            <div className="flex flex-wrap gap-2">
              {currentTags.map((tag: Tag) => {
                return (
                  <GraphTags
                    key={tag._id}
                    tagData={tag}
                    isReadOnly={false}
                    type={"relationships"}
                    id={relationshipData.id}
                    fetchData={fetchData}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
