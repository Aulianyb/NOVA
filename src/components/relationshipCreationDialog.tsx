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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { useEffect } from "react";
import { Edge } from "@xyflow/react";
import { RelationshipData } from "../../types/types";

const formSchema = z.object({
  relationshipDescription: z
    .string()
    .max(240, "Description must be under 240 characters long"),
});

export default function RelationshipCreationDialog({
  setIsAddingEdge,
  isAddingEdge,
  setNewEdge,
  relationshipData,
  worldID,
  graphRefresh,
  addEdgeFunction
}: {
  setIsAddingEdge: React.Dispatch<React.SetStateAction<boolean>>;
  isAddingEdge: boolean;
  setNewEdge: React.Dispatch<
    React.SetStateAction<Edge<RelationshipData> | undefined>
  >;
  relationshipData: Edge<RelationshipData>;
  worldID: string;
  graphRefresh: () => void;
  addEdgeFunction : (newEdge : Edge) => void; 
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      relationshipDescription: "",
    },
  });

  const resetForm = useCallback(() => {
    form.reset({
      relationshipDescription: "",
    });
  }, [form]);

  useEffect(() => {
    resetForm();
  }, [relationshipData, form, resetForm]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const reqBody = {
        relationshipDescription: values.relationshipDescription,
        target: relationshipData.target,
        source: relationshipData.source,
        worldID: worldID,
      };
      console.log(JSON.stringify(reqBody));
      const res = await fetch(`/api/relationships/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });
      if (!res.ok) {
        throw new Error("Relationship creation failed");
      }
      addEdgeFunction(relationshipData);
      graphRefresh();
      form.reset();
      setIsAddingEdge(false);
    } catch (error) {
      console.error(error);
    } finally {
      setNewEdge(undefined);
    }
  }

  return (
    <Dialog open={isAddingEdge} onOpenChange={setIsAddingEdge}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Relationships</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="relationshipDescription"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name" className="text-right">
                    Describe their relationship!
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
