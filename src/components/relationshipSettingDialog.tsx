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
import { useState } from "react";
import { useEffect } from "react";
import { Edge } from "@xyflow/react";
import { RelationshipData } from "../../types/types";

const formSchema = z.object({
  relationshipDescription: z
    .string()
    .max(240, "Description must be under 240 characters long"),
});

export default function RelationshipSettingDialog({
  relationshipData,
}: {
  relationshipData: Edge<RelationshipData>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      relationshipDescription: relationshipData.data!.relationshipDescription,
    },
  });

  function resetForm() {
    form.reset({
      relationshipDescription: relationshipData.data!.relationshipDescription,
    });
  }

  useEffect(() => {
    resetForm();
  }, [relationshipData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const reqBody = {
        relationshipDescription: values.relationshipDescription,
      };
      console.log(JSON.stringify(reqBody));
      const res = await fetch(`/api/relationships/${relationshipData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });
      if (!res.ok) {
        throw new Error("Relationship edit failed");
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
          <DialogTitle>Edit Relationship</DialogTitle>
        </DialogHeader>
        <DialogDescription>Change Relationship Description</DialogDescription>
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
