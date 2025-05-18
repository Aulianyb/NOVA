import React from "react";
import { Position, Node, NodeProps } from "@xyflow/react";
import { BaseHandle } from "./base-handle";
type CustomNode = Node<
  {
    objectName: string;
    objectDescription: string;
    objectPicture: string;
    Images: string[];
    tags: string[];
    relationships: string[];
  },
  "custom"
>;
import { CldImage } from "next-cloudinary";

export default function CustomNode({
  data,
  isConnectable,
}: NodeProps<CustomNode>) {
  const objectPicture = data.objectPicture;
  let usedPicture = "objectPicture/fuetkmzyox2su7tfkib3";
  if (objectPicture != "/NOVA-placeholder.png") {
    usedPicture = objectPicture;
  }

  return (
    <>
      <div className="w-[120px] flex flex-col items-center text-sm rounded-lg bg-zinc-100 border border-zinc-300">
        <CldImage
          src={usedPicture}
          alt="Object Picture"
          width="120"
          height="120"
          className="rounded-t-lg"
        />
        <div className="p-2 text-center">
          <p>{data.objectName}</p>
        </div>
      </div>
      <BaseHandle
        type="source"
        position={Position.Bottom}
        id="customHandle"
        isConnectable={isConnectable}
      />
    </>
  );
}
