import { Hash, X } from "lucide-react";
import { Tag } from "@shared/types";

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
      className={`p-1 px-2 text-xs text-${tagData.tagColor}-500 bg-${tagData.tagColor}-200 w-fit rounded-sm flex gap-1 items-center`}
    >
      <Hash size={13} />
      <span>{tagData.tagColor}</span>{" "}
      {!isReadOnly && <X size={13} onClick={() => onRemoveTag()} />}
    </div>
  );
}
