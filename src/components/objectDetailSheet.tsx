import { CldImage } from "next-cloudinary";
import { Volleyball, ChevronRight, Hash } from "lucide-react";
import { Button } from "./ui/button";
import { Node } from "@xyflow/react";
import { NodeData } from "../../types/types";
import ObjectSettingDialog from "./objectSettingDialog";
import DeleteAlert from "./deleteAlert";

export default function ObjectDetailSheet({
  isNodeClicked,
  openFunction,
  nodeData,
  deleteNodeFunction,
}: {
  isNodeClicked: boolean;
  openFunction: React.Dispatch<React.SetStateAction<boolean>>;
  nodeData: Node<NodeData> | null;
  deleteNodeFunction: (objectID: string) => void;
}) {
  let usedPicture = "objectPicture/fuetkmzyox2su7tfkib3";
  if (nodeData) {
    const objectPicture = nodeData.data.objectPicture;
    if (objectPicture != "/NOVA-placeholder.png") {
      usedPicture = objectPicture;
    }
  }

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
        {nodeData && <ObjectSettingDialog nodeData={nodeData} />}
        {nodeData && (
          <DeleteAlert
            objectID={nodeData.id}
            deleteNodeFunction={deleteNodeFunction}
            openFunction={openFunction}
          />
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
          <div className="space-y-4 p-2">
            <h2 className="font-bold"> {nodeData.data.objectName} </h2>
            <p className="italic"> {nodeData.data.objectDescription} </p>
            <div className="flex gap-1">
              <div className="p-1 px-2 text-xs text-red-500 bg-red-200 w-fit rounded-sm flex gap-1 items-center">
                <Hash size={13} />
                <span> Tags 1 </span>
              </div>
              <div className="p-1 px-2 text-xs text-blue-500 bg-blue-200 w-fit rounded-sm flex gap-1 items-center">
                <Hash size={13} />
                <span> Tags 1 </span>
              </div>
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
