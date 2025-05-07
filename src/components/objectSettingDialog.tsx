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
import { NodeData } from "../../types/types";
import { useEffect } from "react";

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

export default function ObjectSettingDialog({
  nodeData,
  graphRefresh,
}: {
  nodeData: Node<NodeData>;
  graphRefresh: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      objectName: nodeData.data.objectName,
      objectDescription: nodeData.data.objectDescription,
      objectPicture: undefined,
    },
  });

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("objectName", values.objectName);
      formData.append("objectDescription", values.objectDescription);
      formData.append("objectPicture", values.objectPicture);
      const res = await fetch(`/api/objects/${nodeData.id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Object edit failed");
      }
      graphRefresh();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      form.reset();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => console.log("Edit")}
        >
          <PencilLine />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Object</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Change the object's name or description
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
                  <FormDescription>Only .jpg, .jpeg, and .png formats are supported.</FormDescription>
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
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
