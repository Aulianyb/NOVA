import { BaseEdge, EdgeLabelRenderer, getStraightPath } from "@xyflow/react";

const ColorMap: Record<string, string> = {
  red: "#ef4444", // bg-red-500
  orange: "#f97316", // bg-orange-500
  yellow: "#eab308", // bg-yellow-500
  green: "#22c55e", // bg-green-500
  cyan: "#06b6d4", // bg-cyan-500
  blue: "#3b82f6", // bg-blue-500
  violet: "#8b5cf6", // bg-violet-500
  pink: "#ec4899", // bg-pink-500
  zinc: "#71717a", // bg-zinc-500
};

export const BackgroundColorMap: Record<string, string> = {
  red: "bg-red-100",
  orange: "bg-orange-100",
  yellow: "bg-yellow-100",
  green: "bg-green-100",
  cyan: "bg-cyan-100",
  blue: "bg-blue-100",
  violet: "bg-violet-100",
  pink: "bg-pink-100",
  zinc: "bg-zinc-100",
};

export const BorderColorMap: Record<string, string> = {
  red: "border-red-600",
  orange: "border-orange-600",
  yellow: "border-yellow-600",
  green: "border-green-600",
  cyan: "border-cyan-600",
  blue: "border-blue-600",
  violet: "border-violet-600",
  pink: "border-pink-600",
  zinc: "border-zinc-600",
};

export const TextColorMap: Record<string, string> = {
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

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  data: {
    tagName?: string;
    tagColor?: string;
  };
}) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  console.log(data.tagColor);
  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          strokeWidth: 2,
          stroke: data.tagColor ? ColorMap[data.tagColor] : "#9f9ea8",
        }}
      />
      {data.tagName && data.tagColor && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className={`nodrag nopan ${BackgroundColorMap[data.tagColor]} ${
              TextColorMap[data.tagColor]
            } py-2 px-3 rounded-full border-2 ${BorderColorMap[data.tagColor]}`}
          >
            {data.tagName}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
