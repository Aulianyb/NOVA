import { Hash, X } from "lucide-react";
import { Tag } from "@shared/types";

const BackgroundColorMap: Record<string, string> = {
  red: "bg-red-200",
  orange: "bg-orange-200",
  yellow: "bg-yellow-200",
  green: "bg-green-200",
  cyan: "bg-cyan-200",
  blue: "bg-blue-200",
  violet: "bg-violet-200",
  pink: "bg-pink-200",
  zinc: "bg-zinc-200",
};

const TextColorMap: Record<string, string> = {
  red: "text-red-600",
  orange: "text-orange-600",
  yellow: "text-yellow-600",
  green: "text-green-600",
  cyan: "text-cyan-600",
  blue: "text-blue-600",
  violet: "text-violet-600",
  pink: "text-pink-600",
  zinc: "text-zinc-500",
};

export function GraphTags({
  tagData,
  isReadOnly,
}: {
  tagData: Tag;
  isReadOnly: boolean;
}) {
  function onRemoveTag() {
    console.log(tagData._id);
  }

  return (
    <div
      className={`p-1 px-2 text-xs ${BackgroundColorMap[tagData.tagColor]} ${
        TextColorMap[tagData.tagColor]
      } w-fit rounded-sm flex gap-1 items-center`}
    >
      <Hash size={13} />
      <span>{tagData.tagName}</span>{" "}
      {!isReadOnly && <X size={13} onClick={() => onRemoveTag()} />}
    </div>
  );
}
