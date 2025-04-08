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
import { NodeCreationDialog } from "@/components/nodeCreationDialog";
import { NodeType } from "../../../../types/types";
import { useToast } from "@/hooks/use-toast";

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
  nodeData,
}: {
  worldData: World | null;
  nodeData: NodeType[] | null;
}) {
  const flow = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [hasChange, setHasChanged] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const notifyChanges = () => {
    const toastId = toast({
      title: "Your changes are not saved.",
      description: (
        <div className="flex gap-1">
          <span>Save your changes with the</span>
          <Save size={15} />
          <span>button!</span>
        </div>
      ),
      variant: "destructive",
    });
  };

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) => addEdge({ ...params, type: "straight" }, eds)),
    [setEdges]
  );

  function handleSave() {
    console.log(nodes);
  }

  function fetchNodes() {
    if (nodeData) {
      const currentNodes = nodeData.map((node: NodeType) => ({
        id: node.id,
        position: { x: node.positionX, y: node.positionY },
        data: {
          nodeName: node.nodeName,
          nodeDescription: node.nodeDescription,
          nodePicture: node.nodePicture,
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
          notifyChanges();
          console.log("what");
        }
      }
      onNodesChange(changes);
    },
    [hasChange, onNodesChange]
  );

  useEffect(() => {
    fetchNodes();
  }, []);

  function generateObjectId(): string {
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
    const random = "xxxxxxxxxxxxxxxx".replace(/[x]/g, () =>
      ((Math.random() * 16) | 0).toString(16)
    );
    return timestamp + random;
  }

  const addNode = useCallback(
    ({
      nodeName,
      nodeDescription,
      nodePicture,
    }: {
      nodeName: string;
      nodeDescription: string;
      nodePicture: string | undefined;
    }) => {
      const id = generateObjectId();
      const newNode = {
        id: id,
        position: flow.screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        }),
        type: "customNode",
        data: {
          nodeName: nodeName,
          nodeDescription: nodeDescription,
          nodePicture: nodePicture,
        },
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
              <NodeCreationDialog createFunction={addNode} />
              {hasChange && (
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleSave()}
                >
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
  const [nodes, setNodes] = useState<NodeType[] | null>(null);
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
        nodes: worldData.data.nodes,
        changes: worldData.data.changes,
      };
      setWorld(currentWorld);
      const nodes = await fetch(`/api/nodes?worldID=${currentWorld.id}`);
      if (!nodes.ok) {
        throw new Error("Failed to get nodes");
      }
      const nodeData = await nodes.json();
      const nodeArray: NodeType[] = nodeData.data.map((node: any) => ({
        id: node._id,
        nodeName: node.nodeName,
        nodeDescription: node.nodeDescription,
        nodePicture: node.nodePicture,
        images: node.images,
        relationships: node.relationships,
        tags: node.tags,
        positionX: node.positionX,
        positionY: node.positionY,
      }));
      setNodes(nodeArray);
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
      <FlowContent worldData={world} nodeData={nodes} />
    </ReactFlowProvider>
  );
}
