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

const formSchema = z.object({
  objectName: z
    .string()
    .min(1, "Your object must have a name")
    .max(20, "Object name must be at most 20 characters long"),
  objectDescription: z
    .string()
    .max(240, "Description must be under 240 characters long"),
  // Temporary, of course
  objectPicture: z.string().optional(),
});

export default function ObjectSettingDialog({
  nodeData,
}: {
  nodeData: Node<NodeData>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      objectName: nodeData.data.objectName,
      objectDescription: nodeData.data.objectDescription,
      objectPicture: "/NOVA-placeholder.png",
    },
  });

  const resetForm = useCallback(() => {
    form.reset({
      objectName: nodeData.data.objectName,
      objectDescription: nodeData.data.objectDescription,
      objectPicture: "/NOVA-placeholder.png",
    });
  }, [form, nodeData.data.objectDescription, nodeData.data.objectName]);

  useEffect(() => {
    resetForm();
  }, [nodeData, form, resetForm]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const reqBody = {
        objectName: values.objectName,
        objectDescription: values.objectDescription,
        objectPicture: values.objectPicture,
      };
      console.log(JSON.stringify(reqBody));
      const res = await fetch(`/api/objects/${nodeData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });
      if (!res.ok) {
        throw new Error("Object edit failed");
      }
      form.reset();
      window.location.reload();
    } catch (error) {
      console.error(error);
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
