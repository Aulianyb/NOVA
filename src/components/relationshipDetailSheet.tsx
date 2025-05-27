import { Hash } from "lucide-react";
import { Volleyball, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { NodeObject } from "../../types/types";
import { Edge } from "@xyflow/react";
import { RelationshipData } from "../../types/types";
import RelationshipSettingDialog from "./relationshipSettingDialog";
import { CldImage } from "next-cloudinary";
import DeleteAlert from "./deleteAlert";


export default function RelationshipDetailSheet({
  isEdgeClicked,
  openFunction,
  sourceNode,
  targetNode,
  relationshipData,
  graphRefresh,
  deleteEdgeFunction,
}: {
  isEdgeClicked: boolean;
  openFunction: React.Dispatch<React.SetStateAction<boolean>>;
  sourceNode: NodeObject | null;
  targetNode: NodeObject | null;
  relationshipData: Edge<RelationshipData> | null;
  graphRefresh: () => void;
  deleteEdgeFunction: (objectID: string) => void;
}) {
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
              <div className="p-1 px-2 text-s text-zinc-500 bg-zinc-200 w-fit rounded-sm flex gap-1 items-center">
                <Hash size={13} />
                <span> Tags 1 </span>
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
