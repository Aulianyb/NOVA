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
import { SquarePlus } from "lucide-react";
import { useState } from "react";
import { XYPosition } from "@xyflow/react";

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
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export default function ObjectCreationDialog({
  createFunction,
  worldID,
  position,
}: {
  createFunction: (input: {
    objectID: string;
    objectName: string;
    objectDescription: string;
    objectPicture: string;
  }) => void;
  worldID: string;
  position: XYPosition;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      objectName: "",
      objectDescription: "",
      objectPicture: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("objectName", values.objectName);
      formData.append("objectDescription", values.objectDescription);
      formData.append("objectPicture", values.objectPicture);
      formData.append("positionX", String(position.x));
      formData.append("positionY", String(position.y));
      formData.append("worldID", worldID);

      const res = await fetch("/api/objects", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Object creation failed");
      }

      const responseData = await res.json();
      const newNode = responseData.data;
      createFunction({
        objectID: newNode._id,
        objectName: newNode.objectName,
        objectDescription: newNode.objectDescription,
        objectPicture: newNode.objectPicture,
      });
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          onClick={() => {
            setIsOpen(true);
          }}
        >
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
                    Files can only be JPG and PNG
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
