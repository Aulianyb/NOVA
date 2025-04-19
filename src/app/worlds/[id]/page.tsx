"use client";
import React, { useCallback } from "react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  World,
  NodeObject,
  Relationship,
  NodeData,
  RelationshipData,
} from "../../../../types/types";
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
  EdgeChange,
  ReactFlowInstance,
} from "@xyflow/react";
import CustomNode from "@/components/CustomNode";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import WorldSettingDialog from "@/components/worldSettingDialog";
import ObjectCreationDialog from "@/components/objectCreationDialog";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/loading";
import ObjectDetailSheet from "@/components/objectDetailSheet";
import RelationshipDetailSheet from "@/components/relationshipDetailSheet";

// const flowKey = "example-flow";

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
  relationshipData,
}: {
  worldData: World | null;
  objectData: NodeObject[] | null;
  relationshipData: Relationship[] | null;
}) {
  const flow = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isNodeClicked, setIsNodeClicked] = useState(false);
  const [isEdgeClicked, setIsEdgeClicked] = useState(false);
  const [hasChange, setHasChanged] = useState(0);
  const [objectMap, setObjectMap] = useState<Record<string, NodeObject>>({});
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<
    Node,
    Edge
  > | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [selectedEdge, setSelectedEdge] =
    useState<Edge<RelationshipData> | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<NodeObject | null>(null);
  const [selectedSource, setSelectedSource] = useState<NodeObject | null>(null);
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

  const notifySaved = () => {
    const toastId = toast({
      title: "Changes are saved!",
      description: "You can continue editing now :D",
      variant: "success",
    });
  };

  const onConnect = useCallback(
    (params: any) => {
      handleChanges();
      const id = generateObjectId();
      const newEdge = {
        ...params,
        id: id,
        data: {
          relationshipDescription: "Describe their relationship!",
        },
        type: "straight",
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, hasChange]
  );

  function fetchData() {
    if (objectData) {
      const currentNodes = objectData.map((object: NodeObject) => ({
        id: object.id,
        position: { x: object.positionX, y: object.positionY },
        data: {
          objectName: object.objectName,
          objectDescription: object.objectDescription,
          objectPicture: object.objectPicture,
          images: object.images,
          tags: object.tags,
          relationships: object.relationships,
        },
        type: "customNode",
      }));
      setNodes(currentNodes);
      const objectMap = Object.fromEntries(
        objectData.map((obj) => [obj.id, obj])
      );
      setObjectMap(objectMap);
    }
    if (relationshipData) {
      const currentEdges = relationshipData.map((edge: Relationship) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        data: {
          relationshipDescription: edge.relationshipDescription,
        },
        type: "straight",
      }));
      setEdges(currentEdges);
    }
  }

  async function handleSave() {
    try {
      if (!rfInstance) {
        throw new Error("React flow instance not found.");
      }
      if (!worldData) {
        throw new Error("World not found.");
      }

      const flow = rfInstance.toObject();
      const nodeArray = flow.nodes.map((node) => ({
        id: node.id,
        data: node.data,
        position: node.position,
      }));

      const edgeArray = flow.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        data: edge.data,
      }));

      const res = await fetch("/api/objects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          worldID: worldData.id,
          nodes: nodeArray,
          edges: edgeArray,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to save objects: ${res.status}`);
      }

      notifySaved();
    } catch (error) {
      console.log(error);
    } finally {
      setHasChanged(1);
    }
  }

  function handleChanges() {
    if (hasChange < 2) {
      setHasChanged(hasChange + 1);
    }
    if (hasChange > 1 && hasChange < 3) {
      notifyChanges();
      setHasChanged(hasChange + 1);
    }
  }

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (changes[0].type == "position" || changes[0].type == "dimensions") {
        handleChanges();
      }
      onNodesChange(changes);
    },
    [hasChange, onNodesChange]
  );

  const handleEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      handleChanges();
    },
    [hasChange]
  );

  useEffect(() => {
    fetchData();
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
      objectName,
      objectDescription,
      objectPicture,
    }: {
      objectName: string;
      objectDescription: string;
      objectPicture: string | undefined;
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
          objectName: objectName,
          objectDescription: objectDescription,
          objectPicture: "/NOVA-placeholder.png",
          images: [],
          tags: [],
          relationships: [],
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    []
  );

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    console.log("click node", node);
    setSelectedNode(node as Node<NodeData>);
    setIsNodeClicked(true);
  };

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    console.log("click edge", edge);
    if (objectData) {
      setSelectedEdge(edge as Edge<RelationshipData>);
      setSelectedSource(objectMap[edge.source]);
      setSelectedTarget(objectMap[edge.target]);
    }
    setIsEdgeClicked(true);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={handleEdgesDelete}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionLineStyle={connectionLineStyle}
        connectionMode={ConnectionMode.Loose}
        onInit={setRfInstance}
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
            {hasChange > 1 && (
              <Button
                size="icon"
                variant="destructive"
                onClick={() => handleSave()}
              >
                <Save />
              </Button>
            )}
          </div>
          <ObjectDetailSheet
            isNodeClicked={isNodeClicked}
            openFunction={setIsNodeClicked}
            nodeData={selectedNode}
          />
          <RelationshipDetailSheet
            isEdgeClicked={isEdgeClicked}
            openFunction={setIsEdgeClicked}
            sourceNode={selectedSource}
            targetNode={selectedTarget}
            relationshipData={selectedEdge}
          />
        </Panel>
        <Background variant={BackgroundVariant.Lines} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default function Page() {
  const [session, setSession] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [world, setWorld] = useState<World | null>(null);
  const [objects, setObjects] = useState<NodeObject[] | null>(null);
  const [relationships, setRelationships] = useState<Relationship[] | null>(
    null
  );
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
        objects: worldData.data.object,
        changes: worldData.data.changes,
      };
      setWorld(currentWorld);
      const resNodesEdges = await fetch(
        `/api/objects/?worldID=${currentWorld.id}`
      );
      if (!resNodesEdges.ok) {
        throw new Error("Failed to get objects");
      }
      const NodesAndEdges = await resNodesEdges.json();
      const worldObjects = NodesAndEdges.data.worldObjects;
      const objectArray: NodeObject[] = worldObjects.map((object: any) => ({
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

      const worldRelationships = NodesAndEdges.data.worldRelationships;
      const relationArray: Relationship[] = worldRelationships.map(
        (relation: any) => ({
          id: relation._id,
          source: relation.source,
          target: relation.target,
          tags: relation.tags,
          relationshipDescription: relation.relationshipDescription,
        })
      );

      setObjects(objectArray);
      setRelationships(relationArray);
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
    return <Loading />;
  }

  return (
    <ReactFlowProvider>
      <FlowContent
        worldData={world}
        objectData={objects}
        relationshipData={relationships}
      />
    </ReactFlowProvider>
  );
}
