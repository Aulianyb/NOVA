import React, { memo } from "react";
import {
  Handle,
  Position,
  useConnection,
  Node,
  NodeProps,
} from "@xyflow/react";
import Image from "next/image";

type CustomNode = Node<{ name: string }, "custom">;

export default function CustomNode({
  isConnectable,
  data,
  id,
}: NodeProps<CustomNode>) {
  return (
    <>
        <Handle
          type="target"
          position={Position.Top}
          onConnect={(params) => console.log("handle onConnect", params)}
          isConnectable={isConnectable}
        />
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
            <p>Character Name</p>
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          id="a"
          isConnectable={isConnectable}
        />
    </>
  );
}
