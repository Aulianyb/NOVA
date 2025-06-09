import { CldImage } from "next-cloudinary";
import { ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Node } from "@xyflow/react";
import { NodeData, Tag, GalleryImage } from "@shared/types";
import ObjectSettingDialog from "./objectSettingDialog";
import DeleteAlert from "./deleteAlert";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GraphTags } from "./graphTags";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageElement from "./imageElement";
import { ScrollArea } from "./ui/scroll-area";
import ImageCreationDialog from "./imageCreationDialog";
import { BookOpenText, ImagePlus } from "lucide-react";
import ObjectDetailSettingDialogue from "./objectDetailSettingDialog";

export default function ObjectDetailSheet({
  isNodeClicked,
  openFunction,
  nodeData,
  deleteNodeFunction,
  graphRefresh,
  worldID,
  existingNodes,
}: {
  isNodeClicked: boolean;
  openFunction: React.Dispatch<React.SetStateAction<boolean>>;
  nodeData: Node<NodeData> | null;
  deleteNodeFunction: (objectID: string) => void;
  graphRefresh: () => void;
  worldID: string;
  existingNodes: Node<NodeData>[];
}) {
  const [tagsList, setTagsList] = useState<Tag[]>([]);
  const [GalleryList, setGalleryList] = useState<GalleryImage[]>([]);

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
      const ImageRes = await fetch(`/api/objects/${nodeData.id}/images`);
      const res = await fetch(`/api/objects/${nodeData.id}/tags`);
      if (!res.ok || !ImageRes.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.error || "Something went wrong.");
      }
      const tagData = await res.json();
      setTagsList(tagData.data);
      const galleryData = await ImageRes.json();
      setGalleryList(galleryData.data);
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
          fixed flex flex-col gap-4 z-50 bg-white p-6 pb-0 inset-y-0 right-0 h-[100vh] shadow-lg border-l-2
          transform transition-transform duration-300 ease-in-out w-[550px]
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
            <ImageCreationDialog
              existingNodes={existingNodes}
              currentObject={nodeData}
              graphRefresh={graphRefresh}
            />
            <ObjectDetailSettingDialogue
              graphRefresh={graphRefresh}
              nodeData={nodeData}
            />
          </>
        )}
      </div>

      {nodeData && (
        <>
          <div className="flex flex-wrap gap-4">
            <CldImage
              src={usedPicture}
              alt="NOVA, the mascot, greeting you"
              width="125"
              height="125"
              className="rounded-md object-cover"
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
          <Tabs
            defaultValue="info"
            className="w-full h-full flex flex-col flex-1 overflow-hidden"
          >
            <TabsList>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="story">Story</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="flex-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-2 pb-10">
                  {nodeData.data.info ? (
                    <>
                      <h3 className="bg-zinc-100 py-1 px-2 rounded-lg text-lg">
                        Basic Info
                      </h3>
                      {nodeData.data.info.bio && (
                        <>
                          {Object.entries(nodeData.data.info.bio).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between px-2"
                              >
                                <span className="font-semibold">{key}</span>
                                <span>{value}</span>
                              </div>
                            )
                          )}
                        </>
                      )}
                      <h3 className="bg-zinc-100 py-1 px-2 rounded-lg text-lg">
                        Description
                      </h3>
                      <p className="px-2">{nodeData.data.info.description}</p>
                    </>
                  ) : (
                    <>
                      <div className="text-center flex flex-col justify-center items-center text-zinc-500">
                        <h2 className="italic">WHOOPS!</h2>
                        <p>Seems like there's nothing here.</p>
                        <div className="flex gap-2 items-center">
                          <span>Write your information on</span>
                          <BookOpenText size={18} strokeWidth={2} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="story" className="flex-0 overflow-hidden">
              {nodeData.data.story ? (
                <ScrollArea className="h-full">
                  <p>{nodeData.data.story}</p>
                </ScrollArea>
              ) : (
                <>
                  <div className="text-center flex flex-col justify-center items-center text-zinc-500">
                    <h2 className="italic">WHOOPS!</h2>
                    <p>Seems like there's nothing here.</p>
                    <div className="flex gap-2 items-center">
                      <span>Write your story on</span>
                      <BookOpenText size={18} strokeWidth={2} />
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
            <TabsContent
              value="gallery"
              className="flex flex-col flex-1 overflow-hidden"
            >
              {nodeData.data.images.length > 0 ? (
                <>
                  <ScrollArea className="h-full">
                    <div className="grid grid-cols-3 gap-2 pb-5">
                      {GalleryList.map((image) => {
                        return (
                          <ImageElement
                            imageData={image}
                            key={image._id}
                            existingNodes={existingNodes}
                            currentObject={nodeData}
                            graphRefresh={graphRefresh}
                          />
                        );
                      })}
                    </div>
                  </ScrollArea>
                </>
              ) : (
                <>
                  <div className="text-center flex flex-col justify-center items-center text-zinc-500">
                    <h2 className="italic">WHOOPS!</h2>
                    <p>Seems like there's nothing here.</p>
                    <div className="flex gap-2 items-center">
                      <span>Add images on</span>
                      <ImagePlus size={18} strokeWidth={2} />
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
