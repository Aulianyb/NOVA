import { Hash, X } from "lucide-react";

export function GraphTags({
  tagName,
  color,
  isReadOnly,
}: {
  tagName: string;
  color: string;
  isReadOnly: boolean;
}) {

  function onRemoveTag(){
    console.log(tagName);
  }

  return (
    <div
      className={`p-1 px-2 text-xs text-${color}-500 bg-${color}-200 w-fit rounded-sm flex gap-1 items-center`}
    >
      <Hash size={13} />
      <span>{tagName}</span> {isReadOnly && <X size={13} onClick={()=>onRemoveTag()}/>}
    </div>
  );
}
