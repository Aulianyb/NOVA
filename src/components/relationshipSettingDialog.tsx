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
import { RelationshipData } from "../../types/types";
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
import { Hash, X } from "lucide-react";

const formSchema = z.object({
  relationshipDescription: z
    .string()
    .max(240, "Description must be under 240 characters long"),
});

export default function RelationshipSettingDialog({
  relationshipData,
  graphRefresh,
}: {
  relationshipData: Edge<RelationshipData>;
  graphRefresh: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      relationshipDescription: relationshipData.data!.relationshipDescription,
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
            <div className="space-y-2 mt-4">
              <Label htmlFor="name">Main Tag</Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select Tag</SelectLabel>
                    <SelectItem value="apple">Doomed</SelectItem>
                    <SelectItem value="banana">Toxic</SelectItem>
                    <SelectItem value="blueberry">Parent</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription>This will shown in the graph</FormDescription>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="name">Add Tags</Label>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Tag</SelectLabel>
                      <SelectItem value="apple">Doomed</SelectItem>
                      <SelectItem value="banana">Toxic</SelectItem>
                      <SelectItem value="blueberry">Parent</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="rounded-md">
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <div
                  className={`p-1 text-red-500 bg-red-200 w-fit rounded-sm flex gap-1 items-center justify-between`}
                >
                  <Hash size={15} />
                  <span className="mr-2">Placeholder</span>
                  <X size={18} className="ml-2" />
                </div>
                <div
                  className={`p-1 text-red-500 bg-red-200 w-fit rounded-sm flex gap-1 items-center justify-between`}
                >
                  <Hash size={15} />
                  <span className="mr-2">Placeholder</span>
                  <X size={18} className="ml-2" />
                </div>
                <div
                  className={`p-1 text-red-500 bg-red-200 w-fit rounded-sm flex gap-1 items-center justify-between`}
                >
                  <Hash size={15} />
                  <span className="mr-2">Placeholder</span>
                  <X size={18} className="ml-2" />
                </div>
              </div>
            </div>

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
