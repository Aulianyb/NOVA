import { Volleyball, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { NodeObject, RelationshipData, Tag, TagAPI } from "@shared/types";
import { Edge } from "@xyflow/react";
import RelationshipSettingDialog from "./relationshipSettingDialog";
import { CldImage } from "next-cloudinary";
import DeleteAlert from "./deleteAlert";
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { GraphTags } from "./graphTags";

export default function RelationshipDetailSheet({
  isEdgeClicked,
  openFunction,
  sourceNode,
  targetNode,
  relationshipData,
  graphRefresh,
  deleteEdgeFunction,
  worldID,
}: {
  isEdgeClicked: boolean;
  openFunction: React.Dispatch<React.SetStateAction<boolean>>;
  sourceNode: NodeObject | null;
  targetNode: NodeObject | null;
  relationshipData: Edge<RelationshipData> | null;
  graphRefresh: () => void;
  deleteEdgeFunction: (objectID: string) => void;
  worldID: string;
}) {
  const [tagsList, setTagsList] = useState<Tag[]>([]);

  const { toast } = useToast();

  let usedSourcePicture = "objectPicture/fuetkmzyox2su7tfkib3";
  if (sourceNode) {
    const sourcePicture = sourceNode.objectPicture;
    if (sourcePicture != "/NOVA-placeholder.png") {
      usedSourcePicture = sourcePicture;
    }
  }
  let usedTargetPicture = "objectPicture/fuetkmzyox2su7tfkib3";
  if (targetNode) {
    const targetPicture = targetNode.objectPicture;
    if (targetPicture != "/NOVA-placeholder.png") {
      usedTargetPicture = targetPicture;
    }
  }

  const fetchData = useCallback(async () => {
    function showError(message: string) {
      const notify = () => {
        toast({
          title: "An Error has Occured!",
          description: message,
          variant: "destructive",
        });
      };
      notify();
    }
    try {
      if (!relationshipData) {
        throw new Error("relationshipData not found");
      }
      console.log(relationshipData.id);
      const res = await fetch(`/api/relationships/${relationshipData.id}/tags`);
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.error || "Something went wrong.");
      }
      const tagData = await res.json();
      const tags: Tag[] = tagData.data.map((tag: TagAPI) => ({
        _id: tag._id,
        tagName: tag.tagName,
        tagColor: tag.tagColor,
      }));
      setTagsList(tags);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    }
  }, [relationshipData, toast]);

  useEffect(() => {
    if (isEdgeClicked) {
      fetchData();
    }
  }, [fetchData, isEdgeClicked]);

  return (
    <div>
      <div
        className={`
          fixed flex flex-col gap-4 z-50 bg-white p-6 inset-y-0 right-0 h-full shadow-lg border-l-2 w-2/4
          transform transition-transform duration-300 ease-in-out
          ${isEdgeClicked ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => openFunction(false)}
          >
            <ChevronRight />
          </Button>
          {relationshipData && (
            <>
              <RelationshipSettingDialog
                relationshipData={relationshipData}
                graphRefresh={graphRefresh}
                worldID={worldID}
                currentTags={tagsList}
                fetchData={fetchData}
              />
              <DeleteAlert
                id={relationshipData.id}
                deleteFunction={deleteEdgeFunction}
                openFunction={openFunction}
                type="relationship"
              />
            </>
          )}
        </div>

        {sourceNode && targetNode && relationshipData && (
          <div className="flex gap-4">
            <div className="text-center">
              <CldImage
                src={usedSourcePicture}
                alt="NOVA, the mascot, greeting you"
                width="100"
                height="100"
                className="rounded-md"
              />
              <p>{sourceNode.objectName}</p>
            </div>

            <div className="flex flex-col space-y-4 p-2 flex-grow items-center">
              <div className="flex flex-wrap justify-center gap-2">
                {tagsList.map((tag) => {
                  return (
                    <GraphTags key={tag._id} tagData={tag} isReadOnly={true} />
                  );
                })}
              </div>
              {relationshipData.data && (
                <p className="italic">
                  {relationshipData.data.relationshipDescription}
                </p>
              )}
              <div className="flex gap-1"></div>
            </div>
            <div className="text-center">
              <CldImage
                src={usedTargetPicture}
                alt="NOVA, the mascot, greeting you"
                width="100"
                height="100"
                className="rounded-md"
              />
              <p>{targetNode.objectName}</p>
            </div>
          </div>
        )}

        <hr className="border-gray-300 flex-grow" />

        <div className="h-full">
          <div className="flex flex-col text-center justify-center items-center h-full text-slate-400">
            <Volleyball size={50} className="mb-2" />
            <p>We're working on this feature!</p>
            <p>Pages coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
