import React, { memo } from "react";
import { Handle, Position, useConnection } from "@xyflow/react";
import Image from "next/image";

export default memo(({ isConnectable, data, id }: any) => {
  const connection = useConnection();
  const isTarget = connection.inProgress && connection.fromNode.id !== id;
  const label = isTarget ? "Drop here" : "Drag to connect";

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <div className="flex flex-col items-center text-sm gap-2">
        {!connection.inProgress && (
          <Handle
            className="customHandle"
            position={Position.Right}
            type="source"
          />
        )}
        {(!connection.inProgress || isTarget) && (
          <Handle
            className="customHandle"
            position={Position.Left}
            type="target"
            isConnectableStart={false}
          />
        )}
        <Image
          src={`/cat-nerd.jpg`}
          alt="NOVA, the mascot, greeting you"
          width="100"
          height="100"
          className="rounded-full border-2 border-zinc-800"
        />
        <p>Character Name</p>
        <p>{label}</p>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        isConnectable={isConnectable}
      />
    </>
  );
});
