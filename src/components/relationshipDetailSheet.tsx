import Image from "next/image";
import { Hash } from "lucide-react";
import { Volleyball, ChevronRight, PencilLine } from "lucide-react";
import { Button } from "./ui/button";

export default function RelationshipDetailSheet({
  isEdgeClicked,
  openFunction,
}: {
  isEdgeClicked: boolean;
  openFunction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => console.log("Edit")}
          >
            <PencilLine />
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="text-center">
            <Image
              src={`/cat-nerd.jpg`}
              alt="NOVA, the mascot, greeting you"
              width="100"
              height="100"
              className="rounded-md"
            />
            <p>Object 1</p>
          </div>

          <div className="flex flex-col space-y-4 p-2 flex-grow items-center">
            <p className="italic"> Description </p>
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
          <div className="text-center">
            <Image
              src={`/cat-nerd.jpg`}
              alt="NOVA, the mascot, greeting you"
              width="100"
              height="100"
              className="rounded-md"
            />
            <p>Object 2</p>
          </div>
        </div>

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
