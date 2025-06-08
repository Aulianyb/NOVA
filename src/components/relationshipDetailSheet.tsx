import { ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { NodeObject, RelationshipData, Tag, TagAPI } from "@shared/types";
import { Edge } from "@xyflow/react";
import RelationshipSettingDialog from "./relationshipSettingDialog";
import { CldImage } from "next-cloudinary";
import DeleteAlert from "./deleteAlert";
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { GraphTags } from "./graphTags";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [mainTag, setMainTag] = useState<Tag | undefined>(undefined);

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
    setMainTag(undefined);
    try {
      if (!relationshipData) {
        throw new Error("relationshipData not found");
      }
      const res = await fetch(`/api/relationships/${relationshipData.id}/tags`);
      const tagData = await res.json();
      if (!res.ok) {
        const tagData = await res.json();
        console.log(tagData);
        throw new Error(tagData.error || "Something went wrong.");
      }
      const tags: Tag[] = tagData.tags.map((tag: TagAPI) => ({
        _id: tag._id,
        tagName: tag.tagName,
        tagColor: tag.tagColor,
      }));
      if (tagData.mainTag) {
        const mainTag: Tag = {
          _id: tagData.mainTag._id,
          tagName: tagData.mainTag.tagName,
          tagColor: tagData.mainTag.tagColor,
        };
        setMainTag(mainTag);
      }
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
          fixed flex flex-col gap-4 z-50 bg-white p-6 inset-y-0 right-0 h-full shadow-lg border-l-2 w-[550px]
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
                mainTag={mainTag}
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
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-wrap justify-center gap-2">
              {tagsList.map((tag) => {
                return (
                  <GraphTags key={tag._id} tagData={tag} isReadOnly={true} />
                );
              })}
            </div>
            <div className="flex gap-2">
              <div className="text-center">
                <CldImage
                  src={usedSourcePicture}
                  alt="NOVA, the mascot, greeting you"
                  width="100"
                  height="100"
                  className="rounded-md object-cover"
                />
                <p>{sourceNode.objectName}</p>
              </div>
              <div className="text-center ">
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
            {relationshipData.data && (
              <p className="italic text-center">
                {relationshipData.data.relationshipDescription}
              </p>
            )}
            <div className="flex gap-1"></div>
          </div>
        )}

        <hr className="border-gray-300 flex-grow" />

        <div className="h-full">
          <div>
            <Tabs defaultValue="info" className="w-full">
              <TabsList>
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="story">Story</TabsTrigger>
              </TabsList>
              <TabsContent value="info">
                <div className="space-y-2">
                  <h3 className="bg-zinc-100 py-1 px-2 rounded-lg text-lg">
                    Thoughts
                  </h3>
                  <div className="space-y-2">
                    <p className="font-semibold">
                      What source thinks of target?
                    </p>
                    <p className="border-l-2 border-zinc-300 pl-4 italic text-zinc-500">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      In eget malesuada ante. Suspendisse vitae nisl quis mi
                      venenatis ornare.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold">
                      What source thinks of target?
                    </p>
                    <p className="border-l-2 border-zinc-300 pl-4 italic text-zinc-500">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      In eget malesuada ante. Suspendisse vitae nisl quis mi
                      venenatis ornare.
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="story">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                  eget malesuada ante. Suspendisse vitae nisl quis mi venenatis
                  ornare. Nulla tincidunt euismod suscipit. Fusce molestie
                  placerat odio, sit amet dignissim dolor lobortis mattis.
                  Curabitur eget turpis a metus sodales condimentum. Aliquam
                  erat volutpat.
                  <br />
                  <br />
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                  eget malesuada ante. Suspendisse vitae nisl quis mi venenatis
                  ornare. Nulla tincidunt euismod suscipit. Fusce molestie
                  placerat odio, sit amet dignissim dolor lobortis mattis.
                  Curabitur eget turpis a metus sodales condimentum. Aliquam
                  erat volutpat.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
