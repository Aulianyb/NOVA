import { X, Eye, EyeClosed } from "lucide-react";
import TagEditingPopover from "./tagEditingPopover";
import { Tag } from "@shared/types";
import { useState } from "react";

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

export default function TagElement({
  worldID,
  tagData,
  fetchData,
  isHidden,
  setHiddenTags,
  graphRefresh,
}: {
  worldID: string;
  tagData: Tag;
  fetchData: () => Promise<void>;
  isHidden: boolean;
  setHiddenTags: React.Dispatch<React.SetStateAction<string[]>>;
  graphRefresh: () => void;
}) {
  const [hidden, setHidden] = useState<boolean>(isHidden);
  const [tagColor, setTagColor] = useState<string>(tagData.tagColor);
  const [tagName, setTagName] = useState<string>(tagData.tagName);

  async function onHide() {
    try {
      setHiddenTags((prevTags) => [...prevTags, tagData._id]);
      setHidden(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function onShow() {
    try {
      setHiddenTags((prevTags) =>
        prevTags.filter((_id) => _id !== tagData._id)
      );
      setHidden(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function onDelete() {
    try {
      const res = await fetch(`/api/worlds/${worldID}/tags/${tagData._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong.");
      }
      fetchData();
      graphRefresh();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className={`p-1 px-2 ${BackgroundColorMap[tagColor]} ${TextColorMap[tagColor]}
      w-fit rounded-sm flex gap-1 items-center`}
    >
      <span className="mr-2">{tagName}</span>
      {hidden ? (
        <EyeClosed size={18} onClick={() => onShow()} />
      ) : (
        <Eye size={18} onClick={() => onHide()} />
      )}
      <X size={18} onClick={() => onDelete()} />
      <TagEditingPopover
        tagData={tagData}
        worldID={worldID}
        setTagColor={setTagColor}
        setTagName={setTagName}
      />
    </div>
  );
}
