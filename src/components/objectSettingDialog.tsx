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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PencilLine } from "lucide-react";
import { useCallback, useState } from "react";
import { Node } from "@xyflow/react";
import { NodeData, Tag, TagAPI } from "@shared/types";
import { useEffect } from "react";
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

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  objectName: z
    .string()
    .min(1, "Your object must have a name")
    .max(20, "Object name must be at most 20 characters long"),
  objectDescription: z
    .string()
    .max(240, "Description must be under 240 characters long"),
  objectPicture: z
    .any()
    .transform((val) => (val instanceof FileList ? val[0] : val))
    .optional()
    .refine(
      (file) => file === undefined || file?.size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`
    )
    .refine(
      (file) => file === undefined || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, and .png formats are supported."
    ),
});

const tagSchema = z.object({
  tagID: z.string(),
});

export default function ObjectSettingDialog({
  nodeData,
  graphRefresh,
  worldID,
  currentTags,
  fetchData,
}: {
  nodeData: Node<NodeData>;
  graphRefresh: () => void;
  worldID: string;
  currentTags: Tag[];
  fetchData: () => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tagsList, setTagsList] = useState<Tag[]>([]);
  const { toast } = useToast();

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      objectName: nodeData.data.objectName,
      objectDescription: nodeData.data.objectDescription,
      objectPicture: undefined,
    },
  });

  const tagForm = useForm<z.infer<typeof tagSchema>>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      tagID: "",
    },
  });

  const selectedTagID = tagForm.watch("tagID");

  const resetForm = useCallback(() => {
    form.reset({
      objectName: nodeData.data.objectName,
      objectDescription: nodeData.data.objectDescription,
      objectPicture: nodeData.data.objectPicture,
    });
  }, [
    form,
    nodeData.data.objectDescription,
    nodeData.data.objectName,
    nodeData.data.objectPicture,
  ]);

  useEffect(() => {
    resetForm();
  }, [nodeData, form, resetForm]);

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("objectName", values.objectName);
      formData.append("objectDescription", values.objectDescription);
      formData.append("objectPicture", values.objectPicture);
      const res = await fetch(`/api/objects/${nodeData.id}`, {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.error || "Something went wrong");
      }
      graphRefresh();
      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    } finally {
      form.reset();
    }
  }

  async function onTagging(values: z.infer<typeof tagSchema>) {
    try {
      const res = await fetch(`/api/objects/${nodeData.id}/tags`, {
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
        <Button variant="ghost" size="iconSm">
          <PencilLine />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[50vw]">
        <DialogHeader>
          <DialogTitle>Edit Object</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Change the object's name or description
        </DialogDescription>
        <div className="flex gap-5">
          <div className="flex-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="objectPicture"
                  render={() => (
                    <FormItem>
                      <Label htmlFor="picture">Profile Picture</Label>
                      <FormControl>
                        <Input
                          id="picture"
                          type="file"
                          className="bg-white border border-slate-200"
                          {...form.register("objectPicture")}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Only .jpg, .jpeg, and .png formats are supported.
                      </FormDescription>
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
                        <Textarea
                          {...field}
                          className="resize-none h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" className="rounded-lg mt-4">
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
          <div className="pl-4 border-l border-zinc-300 space-y-2 mt-4 flex-1">
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
                <Button
                  type="submit"
                  variant="outline"
                  className="rounded-md"
                  disabled={!selectedTagID}
                >
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
                    id={nodeData.id}
                    type={"objects"}
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
