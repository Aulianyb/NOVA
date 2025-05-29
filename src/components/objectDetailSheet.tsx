import { CldImage } from "next-cloudinary";
import { Volleyball, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Node } from "@xyflow/react";
import { NodeData } from "../../types/types";
import ObjectSettingDialog from "./objectSettingDialog";
import DeleteAlert from "./deleteAlert";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tag, TagAPI } from "../../types/types";
import { GraphTags } from "./graphTags";

export default function ObjectDetailSheet({
  isNodeClicked,
  openFunction,
  nodeData,
  deleteNodeFunction,
  graphRefresh,
  worldID,
}: {
  isNodeClicked: boolean;
  openFunction: React.Dispatch<React.SetStateAction<boolean>>;
  nodeData: Node<NodeData> | null;
  deleteNodeFunction: (objectID: string) => void;
  graphRefresh: () => void;
  worldID: string;
}) {
  const [tagsList, setTagsList] = useState<Tag[]>([]);

  let usedPicture = "objectPicture/fuetkmzyox2su7tfkib3";
  if (nodeData) {
    const objectPicture = nodeData.data.objectPicture;
    if (objectPicture != "/NOVA-placeholder.png") {
      usedPicture = objectPicture;
    }
  }

  const { toast } = useToast();
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
      if (!nodeData) {
        throw new Error("nodeData not found");
      }
      console.log(nodeData.id);
      const res = await fetch(`/api/objects/${nodeData.id}/tags`);
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
  }, [nodeData, toast]);

  useEffect(() => {
    if (isNodeClicked) {
      fetchData();
    }
  }, [fetchData, isNodeClicked]);

  return (
    <div
      className={`
          fixed flex flex-col gap-4 z-50 bg-white p-6 inset-y-0 right-0 h-full shadow-lg border-l-2 w-2/4
          transform transition-transform duration-300 ease-in-out
          ${isNodeClicked ? "translate-x-0" : "translate-x-full"}
        `}
    >
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => openFunction(false)}
        >
          <ChevronRight />
        </Button>
        {nodeData && (
          <>
            <ObjectSettingDialog
              nodeData={nodeData}
              graphRefresh={graphRefresh}
              worldID={worldID}
              currentTags={tagsList}
              fetchData={fetchData}
            />
            <DeleteAlert
              id={nodeData.id}
              deleteFunction={deleteNodeFunction}
              openFunction={openFunction}
              type="object"
            />
          </>
        )}
      </div>

      {nodeData && (
        <div className="flex gap-4">
          <CldImage
            src={usedPicture}
            alt="NOVA, the mascot, greeting you"
            width="150"
            height="150"
            className="rounded-md"
          />
          <div className="space-y-2 p-2">
            <h2 className="font-bold"> {nodeData.data.objectName} </h2>
            <p className="italic"> {nodeData.data.objectDescription} </p>
            <div className="flex gap-1">
              {tagsList.map((tag) => {
                return (
                  <GraphTags
                    key={tag._id}
                    color={tag.tagColor}
                    tagName={tag.tagName}
                  />
                );
              })}
            </div>
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
  );
}
