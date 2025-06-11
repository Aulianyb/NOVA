import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpenText } from "lucide-react";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Node } from "@xyflow/react";
import { NodeData } from "@shared/types";
import { useCallback } from "react";

const bioSchema = z.object({
  key: z.string().min(1, "Key required"),
  value: z.string().min(1, "Value required"),
});

const formSchema = z.object({
  story: z.string().optional(),
  bio: z.array(bioSchema),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ObjectDetailSettingDialogue({
  nodeData,
  graphRefresh,
}: {
  nodeData: Node<NodeData>;
  graphRefresh: () => void;
}) {
  const [isEditingStory, setIsEditingStory] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      story: nodeData.data.story ? nodeData.data.story : "",
      description: nodeData.data.info?.description ?? "",
      bio: nodeData.data.info?.bio
        ? Object.entries(nodeData.data.info.bio).map(([key, value]) => ({
            key,
            value,
          }))
        : [{ key: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bio",
  });

  const resetForm = useCallback(() => {
    reset({
      story: nodeData.data.story ?? "",
      description: nodeData.data.info?.description ?? "",
      bio: nodeData.data.info?.bio
        ? Object.entries(nodeData.data.info.bio).map(([key, value]) => ({
            key,
            value,
          }))
        : [{ key: "", value: "" }],
    });
    setIsEditingStory(false);
  }, [
    reset,
    nodeData.data.story,
    nodeData.data.info?.description,
    nodeData.data.info?.bio,
  ]);

  async function onSubmit(data: FormValues) {
    const bioObject: Record<string, string> = {};
    data.bio.forEach((pair) => {
      bioObject[pair.key] = pair.value;
    });

    const payload = {
      story: data.story,
      bio: bioObject,
      description: data.description,
    };
    console.log("Submitting:", payload);
    const res = await fetch(`/api/objects/${nodeData.id}/details`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData);
      throw new Error(errorData.error || "Something went wrong");
    }
    graphRefresh();
    setIsOpen(false);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) resetForm(); // reset when dialog opens
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="iconSm">
          <BookOpenText />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isEditingStory ? (
            <>
              <Button
                variant="ghost"
                className="rounded-md p-0 pr-2"
                onClick={() => setIsEditingStory(false)}
              >
                <ChevronLeft size={13} />
                Basic Info
              </Button>
              <DialogTitle>Write your story!</DialogTitle>
              <div>
                <Textarea
                  {...register("story")}
                  placeholder="Write the story here..."
                />
                {errors.story && (
                  <p className="text-sm text-red-500">{errors.story.message}</p>
                )}
              </div>
            </>
          ) : (
            <>
              <DialogHeader></DialogHeader>
              <Button
                variant="ghost"
                className="rounded-md p-0 pr-2"
                onClick={() => setIsEditingStory(true)}
              >
                <ChevronLeft size={13} />
                Story
              </Button>
              <DialogTitle>Basic Information</DialogTitle>

              <div>
                <label className="block font-semibold mb-1">Bio</label>
                {errors.bio && (
                  <p className="text-sm text-red-500">
                    Please complete all bio fields.
                  </p>
                )}
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-center">
                      <Input
                        placeholder="Key"
                        {...register(`bio.${index}.key`)}
                        className="w-1/3"
                      />
                      <Input
                        placeholder="Value"
                        {...register(`bio.${index}.value`)}
                        className="w-2/3"
                      />
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        size="iconSm"
                        variant="ghost"
                      >
                        <X />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => append({ key: "", value: "" })}
                    className="rounded-md"
                    size="iconSm"
                  >
                    <Plus size={13} />
                  </Button>
                </div>
                <div>
                  <label className="block font-semibold mb-1 mt-4">
                    Description
                  </label>
                  <Textarea
                    {...register("description")}
                    placeholder="Write a short description..."
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
          <DialogFooter>
            <Button type="submit" className="rounded-md">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
