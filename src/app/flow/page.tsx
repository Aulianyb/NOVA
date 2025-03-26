"use client";
import React, { useCallback } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  ConnectionMode,
  BackgroundVariant,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import FloatingEdge from "@/components/FloatingEdge";
import CustomConnectionLine from "@/components/CustomConnectionLine";
import CustomNode from "@/components/CustomNode";

const nodeTypes = {
  customNode: CustomNode,
};

const connectionLineStyle = {
  stroke: "#b1b1b7",
};

const initialNodes = [
  { id: "1", position: { x: 500, y: 100 }, data: { label: "1" } },
  { id: "2", position: { x: 500, y: 200 }, data: { label: "2" } },
  {
    id: "4",
    position: { x: 600, y: 400 },
    type: "customNode",
    data: { name: "name" },
  },
  {
    id: "5",
    position: { x: 500, y: 400 },
    type: "customNode",
    data: { name: "name" },
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

function FlowContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const flow = useReactFlow();

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) => addEdge({ ...params, type: "straight" }, eds)),
    [setEdges]
  );

  const addNode = useCallback(() => {
    const id = Math.random().toString();
    const newNode = {
      id: id,
      position: flow.screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      }),
      type: "customNode",
      data: { name: "Jane Doe" },
      // origin: [0.5, 0.0],
    };
    setNodes((nds) => nds.concat(newNode));
  }, []);

  return (
    <main>
      {/* <Navbar username="Test" type={"menu"} /> */}
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionLineComponent={CustomConnectionLine}
          connectionLineStyle={connectionLineStyle}
          connectionMode={ConnectionMode.Loose}
        >
          <Panel>
            <h1>World Name</h1>
            <Button
              onClick={() => {
                addNode();
              }}
            >
              Add Node
            </Button>
          </Panel>
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Lines} gap={12} size={1} />
        </ReactFlow>
      </div>
    </main>
  );
}

export default function Flow() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
}
