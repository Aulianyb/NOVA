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
} from "@xyflow/react";
import CustomNode from "@/components/CustomNode";
import { Button } from "@/components/ui/button";
import { Settings, SquarePlus, ArrowLeft } from "lucide-react";

const nodeTypes = {
  customNode: CustomNode,
};

const initialEdges: Node[] = [];
const initialNodes: Node[] = [];

function FlowContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const flow = useReactFlow();

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) => addEdge({ ...params, type: "straight" }, eds)),
    [setEdges]
  );
  return (
    <main>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow>
          <Panel>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  console.log("Adding Node");
                }}
                size="icon"
              >
                <ArrowLeft />
              </Button>
              <Button
                onClick={() => {
                  console.log("Adding Node");
                }}
                size="icon"
              >
                <Settings />
              </Button>
              <Button
                onClick={() => {
                  console.log("Adding Node");
                }}
                size="icon"
              >
                <SquarePlus />
              </Button>
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
      console.log(currentWorld);
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
      <FlowContent />
    </ReactFlowProvider>
  );
}
