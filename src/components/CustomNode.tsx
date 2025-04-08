import React from "react";
import { Position, Node, NodeProps, Handle } from "@xyflow/react";
import Image from "next/image";
import { BaseHandle } from "./base-handle";
type CustomNode = Node<{ objectName: string }, "custom">;

export default function CustomNode({
  data,
  isConnectable,
}: NodeProps<CustomNode>) {
  return (
    <>
      <div className="flex flex-col items-center text-sm rounded-lg bg-zinc-100 border border-zinc-300">
        <Image
          src={`/cat-nerd.jpg`}
          alt="NOVA, the mascot, greeting you"
          width="120"
          height="120"
          className="rounded-t-lg"
          draggable={false}
        />
        <div className="p-2">
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
