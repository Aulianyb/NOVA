import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpenText } from "lucide-react";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Edge } from "@xyflow/react";
import { RelationshipData } from "@shared/types";
import { useCallback } from "react";

const formSchema = z.object({
  story: z.string().optional(),
  sourceToTarget: z.string().optional(),
  targetToSource: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RelationshipDetailSettingDialogue({
  relationshipData,
  graphRefresh,
  sourceName,
  targetName,
}: {
  relationshipData: Edge<RelationshipData>;
  graphRefresh: () => void;
  sourceName: string;
  targetName: string;
}) {
  const [isEditingStory, setIsEditingStory] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      story: relationshipData.data?.story ?? "",
      sourceToTarget: relationshipData.data?.info?.sourceToTarget ?? "",
      targetToSource: relationshipData.data?.info?.targetToSource ?? "",
    },
  });

  const resetForm = useCallback(() => {
    reset({
      story: relationshipData.data?.story ?? "",
      sourceToTarget: relationshipData.data?.info?.sourceToTarget ?? "",
      targetToSource: relationshipData.data?.info?.targetToSource ?? "",
    });
    setIsEditingStory(false);
  }, [
    reset,
    relationshipData.data?.story,
    relationshipData.data?.info?.sourceToTarget,
    relationshipData.data?.info?.targetToSource,
  ]);

  async function onSubmit(data: FormValues) {
    try {
      const res = await fetch(
        `/api/relationships/${relationshipData.id}/details`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            story: data.story,
            sourceToTarget: data.sourceToTarget,
            targetToSource: data.targetToSource,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error(errorData);
        throw new Error(errorData.error || "Something went wrong");
      }

      graphRefresh();
      setIsOpen(false);
    } catch (err) {
      console.error("Submit error:", err);
    }
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
                <div>
                  <label className="block font-semibold mb-1 mt-4">
                    What do they think about each other?
                  </label>
                  <Textarea
                    {...register("sourceToTarget")}
                    placeholder={`What ${sourceName} thinks of ${targetName}`}
                  />
                  {errors.sourceToTarget && (
                    <p className="text-sm text-red-500">
                      {errors.sourceToTarget.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold mb-1 mt-4">
                    Description
                  </label>
                  <Textarea
                    {...register("targetToSource")}
                    placeholder={`What ${sourceName} thinks of ${targetName}`}
                  />
                  {errors.targetToSource && (
                    <p className="text-sm text-red-500">
                      {errors.targetToSource.message}
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
