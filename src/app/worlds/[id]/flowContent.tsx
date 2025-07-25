import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, History } from "lucide-react";
import { useRouter } from "next/navigation";
import WorldSettingDialog from "@/components/worldSettingDialog";
import ObjectCreationDialog from "@/components/objectCreationDialog";
import { useToast } from "@/hooks/use-toast";
import ObjectDetailSheet from "@/components/objectDetailSheet";
import RelationshipDetailSheet from "@/components/relationshipDetailSheet";
import {
  RelationshipData,
  NodeData,
  NodeObject,
  World,
  RelationshipJSON,
} from "@shared/types";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Panel,
  useReactFlow,
  ConnectionMode,
  Edge,
  Node,
  NodeChange,
  ReactFlowInstance,
  OnConnect,
} from "@xyflow/react";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import ChangesSheet from "@/components/changesSheet";
import CustomNode from "@/components/CustomNode";
import RelationshipCreationDialog from "@/components/relationshipCreationDialog";
import WorldSavingAlert from "@/components/worldSavingAlert";
import WorldTagsDialog from "@/components/worldTagsDialog";
import CustomEdge from "@/components/CustomEdge";

const connectionLineStyle = {
  stroke: "#791dab",
};

const nodeTypes = {
  customNode: CustomNode,
};

const edgeTypes = {
  "custom-edge": CustomEdge,
};

const initialEdges: Edge[] = [];
const initialNodes: Node[] = [];

function generateObjectId(): string {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
  const random = "xxxxxxxxxxxxxxxx".replace(/[x]/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  );
  return timestamp + random;
}

export function FlowContent({
  worldData,
  objectData,
  relationshipData,
  graphRefresh,
  currentUser,
}: {
  worldData: World | null;
  objectData: NodeObject[] | null;
  relationshipData: RelationshipJSON[] | null;
  graphRefresh: () => void;
  currentUser: string;
}) {
  const flow = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isNodeClicked, setIsNodeClicked] = useState(false);
  const [isEdgeClicked, setIsEdgeClicked] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [hasChange, setHasChanged] = useState(0);
  const [objectMap, setObjectMap] = useState<Record<string, NodeObject>>({});
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<
    Node,
    Edge
  > | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<NodeObject | null>(null);
  const [selectedSource, setSelectedSource] = useState<NodeObject | null>(null);
  const [newEdge, setNewEdge] = useState<Edge<RelationshipData> | undefined>(
    undefined
  );
  const [isAddingEdge, setIsAddingEdge] = useState(false);
  const [hiddenTags, setHiddenTags] = useState<string[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const notifyChanges = useCallback(() => {
    toast({
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
  }, [toast]);

  function showNotification(
    title: string,
    description: string,
    variant: "default" | "destructive" | "success" | null | undefined
  ) {
    const notify = () => {
      toast({
        title: title,
        description: description,
        variant: variant,
      });
    };
    notify();
  }

  function showError(message: string) {
    showNotification("An Error has Occcured", message, "destructive");
  }

  const handleChanges = useCallback(() => {
    if (hasChange < 2) {
      setHasChanged(hasChange + 1);
    }
    if (hasChange > 1 && hasChange < 3) {
      notifyChanges();
      setHasChanged(hasChange + 1);
    }
  }, [hasChange, notifyChanges]);

  function addingEdges(newEdge: Edge) {
    setEdges((eds) => addEdge(newEdge, eds));
  }

  const onConnect: OnConnect = useCallback(
    (connection) => {
      handleChanges();
      const id = generateObjectId();
      const newEdge: Edge = {
        ...connection,
        id: id,
        data: {
          relationshipDescription: "Describe their relationship!",
        },
        type: "custom-edge",
      };
      setNewEdge(newEdge as Edge<RelationshipData>);
      setIsAddingEdge(true);
    },
    [handleChanges]
  );

  const fetchData = useCallback(() => {
    if (objectData) {
      const currentNodes = objectData.map((object: NodeObject) => ({
        id: object._id,
        position: { x: object.positionX, y: object.positionY },
        data: {
          objectName: object.objectName,
          objectDescription: object.objectDescription,
          objectPicture: object.objectPicture,
          images: object.images,
          tags: object.tags,
          relationships: object.relationships,
          info: object.info,
          story: object.story,
        },
        type: "customNode",
      }));
      setNodes(currentNodes);
      const objectMap = Object.fromEntries(
        objectData.map((obj) => [obj._id, obj])
      );
      setObjectMap(objectMap);
    }
    if (relationshipData) {
      const currentEdges = relationshipData.map((edge: RelationshipJSON) => ({
        id: edge._id,
        source: edge.source,
        target: edge.target,
        data: {
          tagName: edge.mainTag ? edge.mainTag.tagName : undefined,
          tagColor: edge.mainTag ? edge.mainTag.tagColor : undefined,
          relationshipDescription: edge.relationshipDescription,
          tags: edge.tags,
          story: edge.story,
          info: edge.info,
        },
        type: "custom-edge",
        style: {
          strokeWidth: 2,
        },
      }));
      setEdges(currentEdges);
    }
  }, [objectData, relationshipData, setEdges, setNodes]);

  function getCenterScreen() {
    const position = flow.screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    return position;
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
        position: node.position,
      }));

      const res = await fetch("/api/objects/layout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nodes: nodeArray,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.error || "Something went wrong");
      }

      showNotification(
        "Graph layout is saved!",
        "You can continue editing now :D",
        "success"
      );
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    } finally {
      setHasChanged(1);
    }
  }

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (changes[0].type == "position") {
        handleChanges();
      }
      onNodesChange(changes);
    },
    [onNodesChange, handleChanges]
  );

  const handleEdgesDelete = useCallback(() => {
    handleChanges();
  }, [handleChanges]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hideNode = (hidden: boolean) => (node: Node) => {
    return {
      ...node,
      hidden,
    };
  };
  const hideEdge = (hidden: boolean) => (edge: Edge) => {
    return {
      ...edge,
      hidden,
    };
  };

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        const nodeTags: string[] = Array.isArray(node.data?.tags)
          ? node.data.tags
          : [];
        const hiddenNodes = nodeTags.some((tagId: string) =>
          hiddenTags.includes(tagId)
        );
        return hideNode(hiddenNodes)(node);
      })
    );
    setEdges((eds) =>
      eds.map((edge) => {
        const edgeTags: string[] = Array.isArray(edge.data?.tags)
          ? edge.data.tags
          : [];
        const hiddenEdges = edgeTags.some((tagId: string) =>
          hiddenTags.includes(tagId)
        );
        return hideEdge(hiddenEdges)(edge);
      })
    );
  }, [hiddenTags, setEdges, setNodes]);

  const addNode = useCallback(
    ({
      objectID,
      objectName,
      objectDescription,
      objectPicture,
    }: {
      objectID: string;
      objectName: string;
      objectDescription: string;
      objectPicture: string;
    }) => {
      const newNode = {
        id: objectID,
        position: flow.screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        }),
        type: "customNode",
        data: {
          objectName: objectName,
          objectDescription: objectDescription,
          objectPicture: objectPicture,
          images: [],
          tags: [],
          relationships: [],
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, flow]
  );

  const deleteNode = useCallback(
    (objectID: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== objectID));
    },
    [setNodes]
  );

  const deleteEdge = useCallback(
    (relationshipID: string) => {
      setEdges((egs) => egs.filter((edge) => edge.id !== relationshipID));
    },
    [setEdges]
  );

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) ?? null;
  }, [nodes, selectedNodeId]);

  const selectedEdge = useMemo(() => {
    return edges.find((n) => n.id === selectedEdgeId) ?? null;
  }, [edges, selectedEdgeId]);

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setIsNodeClicked(true);
  };

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    if (objectData) {
      setSelectedEdgeId(edge.id);
      setSelectedSource(objectMap[edge.source]);
      setSelectedTarget(objectMap[edge.target]);
    }
    console.log(selectedEdge);
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
        edgeTypes={edgeTypes}
        connectionLineStyle={connectionLineStyle}
        connectionMode={ConnectionMode.Loose}
        onInit={setRfInstance}
        deleteKeyCode={[]}
        minZoom={0.1}
      >
        <Panel>
          <div className="flex flex-col gap-2">
            {hasChange > 2 ? (
              <WorldSavingAlert />
            ) : (
              <>
                <Button
                  onClick={() => {
                    router.back();
                  }}
                  size="icon"
                >
                  <ArrowLeft />
                </Button>
              </>
            )}
            <Button size="icon" onClick={() => setIsSheetOpen(true)}>
              <History />
            </Button>

            {worldData && (
              <>
                <WorldSettingDialog
                  worldData={worldData}
                  graphRefresh={graphRefresh}
                  currentUser={currentUser}
                />
                <ObjectCreationDialog
                  createFunction={addNode}
                  worldID={worldData._id}
                  position={getCenterScreen()}
                />
                <WorldTagsDialog
                  worldID={worldData._id}
                  hiddenTags={hiddenTags}
                  setHiddenTags={setHiddenTags}
                  graphRefresh={graphRefresh}
                />
                <RelationshipCreationDialog
                  setIsAddingEdge={setIsAddingEdge}
                  isAddingEdge={isAddingEdge}
                  setNewEdge={setNewEdge}
                  relationshipData={newEdge as Edge<RelationshipData>}
                  worldID={worldData._id}
                  graphRefresh={graphRefresh}
                  addEdgeFunction={addingEdges}
                />
              </>
            )}

            {hasChange > 2 && (
              <Button
                size="icon"
                variant="destructive"
                onClick={() => handleSave()}
              >
                <Save />
              </Button>
            )}
          </div>
          {worldData && (
            <>
              <ChangesSheet
                isOpen={isSheetOpen}
                openFunction={setIsSheetOpen}
                worldID={worldData._id}
              />
              <ObjectDetailSheet
                isNodeClicked={isNodeClicked}
                openFunction={setIsNodeClicked}
                nodeData={selectedNode as Node<NodeData>}
                deleteNodeFunction={deleteNode}
                graphRefresh={graphRefresh}
                worldID={worldData._id}
                existingNodes={nodes as Node<NodeData>[]}
              />
              <RelationshipDetailSheet
                isEdgeClicked={isEdgeClicked}
                openFunction={setIsEdgeClicked}
                sourceNode={selectedSource}
                targetNode={selectedTarget}
                relationshipData={selectedEdge as Edge<RelationshipData>}
                graphRefresh={graphRefresh}
                deleteEdgeFunction={deleteEdge}
                worldID={worldData._id}
              />
            </>
          )}
        </Panel>
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
