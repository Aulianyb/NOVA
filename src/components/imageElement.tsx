import { CldImage } from "next-cloudinary";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { GalleryImage } from "@shared/types";
import { Button } from "./ui/button";
import { PencilLine, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Node } from "@xyflow/react";
import { NodeData } from "@shared/types";

const imageSchema = z.object({
  imageTitle: z
    .string()
    .min(1, "Your image must have a title")
    .max(36, "Image title name must be at most 36 characters long"),
});

export default function ImageElement({
  imageData,
  existingNodes,
  currentObject,
  graphRefresh,
}: {
  imageData: GalleryImage;
  existingNodes: Node<NodeData>[];
  currentObject: Node<NodeData>;
  graphRefresh: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [existingObjects, setExistingObjects] = useState<Node<NodeData>[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const imageObjectIds = new Set(imageData.objects.map((obj) => obj._id));
    const filteredNodes = existingNodes.filter(
      (node) => !imageObjectIds.has(node.id)
    );
    setExistingObjects(filteredNodes);
  }, [currentObject, existingNodes, imageData.objects]);

  const form = useForm<z.infer<typeof imageSchema>>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      imageTitle: imageData.imageTitle,
    },
  });

  async function onSubmit(values: z.infer<typeof imageSchema>) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/images/${imageData._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageTitle: values.imageTitle,
          }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.error || "Something went wrong");
      }
      setIsEditing(false);
      graphRefresh();
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function addObject() {
    try {
      const res = await fetch(
        `http://localhost:3000/api/images/${imageData._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            addedObject: selectedObjectId,
          }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.error || "Something went wrong");
      }
      graphRefresh();
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteImage() {
    try {
      const res = await fetch(
        `http://localhost:3000/api/objects/${currentObject.id}/images/${imageData._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.error || "Something went wrong");
      }
      graphRefresh();
      setIsEditing(false);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div className="relative aspect-square transition ease-in-out hover:opacity-80">
          <CldImage
            src={imageData.imageID}
            alt="NOVA, the mascot, greeting you"
            fill
            className="rounded-md object-cover"
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        {isEditing ? (
          <>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={() => setIsEditing(false)}
                >
                  <ChevronLeft />
                </Button>
                <span>Edit Image</span>
              </div>
            </DialogTitle>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
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
                <Button type="submit" className="rounded-lg mt-1">
                  Save Changes
                </Button>
              </form>
            </Form>
            <div className="space-y-2">
              <Label>Objects</Label>
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
                  onClick={() => addObject()}
                  disabled={!selectedObjectId}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {imageData.objects.map((obj) => {
                  return (
                    <div
                      key={obj._id}
                      className="text-sm text-zinc-500 bg-zinc-200 border-2 border-zinc-300 rounded-full py-1 px-2 w-fit"
                    >
                      {obj.objectName}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2 mt-5">
              <div className="w-full space-y-2 p-2 border-red-200 border-2 rounded-lg">
                <DialogDescription>
                  Removes this image from this object only. It will still appear
                  if another object is holding it.
                </DialogDescription>
                <Button
                  variant="destructive"
                  className="w-full rounded-md"
                  onClick={() => deleteImage()}
                >
                  Remove Image
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative aspect-square">
              <CldImage
                src={imageData.imageID}
                alt="placeholder"
                className="object-contain rounded-lg"
                fill
              />
            </div>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <span>{imageData.imageTitle}</span>
                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={() => setIsEditing(true)}
                >
                  <PencilLine />
                </Button>
              </div>
            </DialogTitle>
            <div className="flex flex-wrap gap-1">
              {imageData.objects.map((obj) => {
                return (
                  <div
                    key={obj._id}
                    className="text-sm text-zinc-500 bg-zinc-200 border-2 border-zinc-300 rounded-full py-1 px-2 w-fit"
                  >
                    {obj.objectName}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
