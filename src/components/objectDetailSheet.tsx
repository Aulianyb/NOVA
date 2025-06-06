import { CldImage } from "next-cloudinary";
import { ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Node } from "@xyflow/react";
import { NodeData, Tag, TagAPI } from "@shared/types";
import ObjectSettingDialog from "./objectSettingDialog";
import DeleteAlert from "./deleteAlert";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GraphTags } from "./graphTags";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageElement from "./imageElement";
import { ScrollArea } from "./ui/scroll-area";

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
            <div className="flex gap-1 flex-wrap">
              {tagsList.map((tag) => {
                return (
                  <GraphTags key={tag._id} tagData={tag} isReadOnly={true} />
                );
              })}
            </div>
          </div>
        </div>
      )}

      <hr className="border-gray-300 flex-grow" />

      <div className="h-full">
        <Tabs defaultValue="account" className="w-full">
          <TabsList>
            <TabsTrigger value="account">Info</TabsTrigger>
            <TabsTrigger value="password">Gallery</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            Put Information for your character here
          </TabsContent>
          <TabsContent value="password">
            <ScrollArea className="h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pb-4">
                <ImageElement placeholder="/cat-emo.jpg" />
                <ImageElement placeholder="/cat-fish.png" />
                <ImageElement placeholder="/cat-nerd.jpg" />
                <ImageElement placeholder="/placeholder-art.png" />
                <ImageElement placeholder="/cat-emo.jpg" />
                <ImageElement placeholder="/nova-greet.png" />
                <ImageElement placeholder="/cat-emo.jpg" />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
