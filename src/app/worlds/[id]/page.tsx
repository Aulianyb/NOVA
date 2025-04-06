"use client";
import React, { useCallback } from "react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { World } from "../../../../types/types";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  ConnectionMode,
  BackgroundVariant,
  Edge,
  Node,
  NodeChange,
} from "@xyflow/react";
import CustomNode from "@/components/CustomNode";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { WorldSettingDialog } from "@/components/worldSettingDialog";
import { ObjectCreationDialog } from "@/components/objectCreationDialog";
import { Object } from "../../../../types/types";

const connectionLineStyle = {
  stroke: "#b1b1b7",
};

const nodeTypes = {
  customNode: CustomNode,
};

const initialEdges: Edge[] = [];
const initialNodes: Node[] = [];

function FlowContent({
  worldData,
  objectData,
}: {
  worldData: World | null;
  objectData: Object[] | null;
}) {
  const flow = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [hasChange, setHasChanged] = useState(false);
  const router = useRouter();

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) => addEdge({ ...params, type: "straight" }, eds)),
    [setEdges]
  );

  function fetchObjects() {
    if (objectData) {
      const currentNodes = objectData.map((object: Object) => ({
        id: object.id,
        position: { x: object.positionX, y: object.positionY },
        data: {
          objectName: object.objectName,
        },
        type: "customNode",
      }));
      setNodes(currentNodes);
    }
  }

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (!hasChange) {
        if (changes.length > 0) {
          setHasChanged(true);
        }
        console.log("Im called!");
      }
      onNodesChange(changes);
    },
    [hasChange, onNodesChange]
  );

  useEffect(() => {
    fetchObjects();
  }, []);

  const addNode = useCallback(
    ({
      objectName,
      objectDescription,
      objectPicture,
    }: {
      objectName: string;
      objectDescription: string;
      objectPicture: string | undefined;
    }) => {
      const id = Math.random().toString();
      const newNode = {
        id: id,
        position: flow.screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        }),
        type: "customNode",
        data: { objectName: objectName },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    []
  );

  return (
    <main>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionLineStyle={connectionLineStyle}
          connectionMode={ConnectionMode.Loose}
        >
          <Panel>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  router.back();
                }}
                size="icon"
              >
                <ArrowLeft />
              </Button>
              <WorldSettingDialog worldData={worldData!} />
              <ObjectCreationDialog createFunction={addNode} />
              {hasChange && (
                <Button size="icon" variant="destructive">
                  <Save />
                </Button>
              )}
            </div>
          </Panel>
          <Background variant={BackgroundVariant.Lines} gap={12} size={1} />
        </ReactFlow>
      </div>
    </main>
  );
}

export default function Page() {
  const [session, setSession] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [world, setWorld] = useState<World | null>(null);
  const [objects, setObjects] = useState<Object[] | null>(null);
  // const flow = useReactFlow();
  const params = useParams();
  async function fetchSession() {
    try {
      const res = await fetch("/api/auth/self");
      if (!res.ok) {
        throw new Error("Failed to get session");
      }
      const sessionData = await res.json();
      const session = sessionData.session;
      setSession(session);

      const world = await fetch(`/api/worlds/${params.id}`);
      if (!world.ok) {
        throw new Error("Failed to get world");
      }
      const worldData = await world.json();
      const currentWorld: World = {
        id: worldData.data._id,
        worldName: worldData.data.worldName,
        worldDescription: worldData.data.worldDescription,
        owners: worldData.data.owners,
        categories: worldData.data.categories,
        objects: worldData.data.object,
        changes: worldData.data.changes,
      };
      setWorld(currentWorld);
      const objects = await fetch(`/api/objects/?worldID=${currentWorld.id}`);
      if (!objects.ok) {
        throw new Error("Failed to get objects");
      }
      const objectData = await objects.json();
      const objectArray: Object[] = objectData.data.map((object: any) => ({
        id: object._id,
        objectName: object.objectName,
        objectDescription: object.objectDescription,
        objectPicture: object.objectPicture,
        images: object.images,
        relationships: object.relationships,
        tags: object.tags,
        positionX: object.positionX,
        positionY: object.positionY,
      }));
      setObjects(objectArray);
    } catch (error) {
      console.log({ error: error instanceof Error ? error.message : error });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSession();
  }, []);

  if (loading) {
    return (
      <main className="bg-[var(--white)]">
        <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  return (
    <ReactFlowProvider>
      <FlowContent worldData={world} objectData={objects} />
    </ReactFlowProvider>
  );
}
