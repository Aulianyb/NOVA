import {
  Form,
  FormControl,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Node } from "@xyflow/react";
import { NodeData } from "@shared/types";
import { X, ImagePlus } from "lucide-react";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const imageSchema = z.object({
  imageTitle: z
    .string()
    .min(1, "Your image must have a title")
    .max(36, "Image title name must be at most 36 characters long"),
  imageFile: z
    .any()
    .transform((val) => (val instanceof FileList ? val[0] : val))
    .superRefine((file, ctx) => {
      if (!(file instanceof File) || file.size === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "An image file is required",
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Max image size is 5MB.",
        });
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
        });
      }
    }),
});

export default function ImageCreationDialog({
  currentObject,
  existingNodes,
  graphRefresh,
}: {
  currentObject: Node<NodeData>;
  existingNodes: Node<NodeData>[];
  graphRefresh: () => void;
}) {
  const [addedObjects, setAddedObjects] = useState<string[]>([]);
  const [existingObjects, setExistingObjects] = useState<Node<NodeData>[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAddedObjects([currentObject.id]);

    const filteredNodes = existingNodes.filter(
      (node) => node.id !== currentObject.id
    );
    setExistingObjects(filteredNodes);
  }, [currentObject, existingNodes]);

  const form = useForm<z.infer<typeof imageSchema>>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      imageTitle: "",
      imageFile: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof imageSchema>) {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("imageTitle", values.imageTitle);
      formData.append("imageFile", values.imageFile);
      for (const id of addedObjects) {
        formData.append("objects", id);
      }
      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.error || "Something went wrong");
      }
      graphRefresh();
      setIsOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  function addObject(newObjectID: string) {
    setAddedObjects((prev) => [...prev, newObjectID]);
    setExistingObjects((prev) =>
      prev.filter((node) => node.id !== newObjectID)
    );
    setSelectedObjectId("");
  }

  function deleteObject(newObjectID: string) {
    setAddedObjects((prev) => prev.filter((id) => id !== newObjectID));

    const node = existingNodes.find((n) => n.id === newObjectID);
    if (node) {
      setExistingObjects((prev) => [...prev, node]);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="iconSm" className="rounded-md mb-2">
          <ImagePlus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new image</DialogTitle>
          <DialogDescription>Add an image into the gallery!</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="imageFile"
              render={() => (
                <FormItem>
                  <Label htmlFor="picture">Image File</Label>
                  <FormControl>
                    <Input
                      id="picture"
                      type="file"
                      className="bg-white border border-slate-200"
                      {...form.register("imageFile")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageTitle"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name" className="text-right">
                    Image Title
                  </Label>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label htmlFor="name" className="text-right">
                Objects
              </Label>
              <div className="flex gap-2">
                <Select
                  value={selectedObjectId}
                  onValueChange={setSelectedObjectId}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Object" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Add Object</SelectLabel>
                      {existingObjects.map((node) => {
                        return (
                          <SelectItem key={node.id} value={node.id}>
                            {node.data.objectName}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="rounded-md"
                  onClick={() => addObject(selectedObjectId)}
                  disabled={!selectedObjectId}
                >
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-1">
                {addedObjects.map((object) => {
                  const node = existingNodes.find((n) => n.id === object);
                  return (
                    <div
                      key={object}
                      className="text-sm text-zinc-500 bg-zinc-200 border-2 border-zinc-300 rounded-full py-1 px-2 w-fit flex gap-2 items-center"
                    >
                      {node?.data.objectName}
                      {object != currentObject.id && (
                        <X size={18} onClick={() => deleteObject(object)} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" className="rounded-lg mt-4" disabled={isLoading}>
                {isLoading ? "Uploading..." : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
