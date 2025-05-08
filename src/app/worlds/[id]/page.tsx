"use client";
import React, { useCallback } from "react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { World, NodeObject, RelationshipJSON } from "../../../../types/types";
import { ReactFlowProvider } from "@xyflow/react";
import { FlowContent } from "./flowContent";
import Loading from "@/app/loading";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [world, setWorld] = useState<World | null>(null);
  const [objects, setObjects] = useState<NodeObject[] | null>(null);
  const [relationships, setRelationships] = useState<RelationshipJSON[] | null>(
    null
  );
  // const flow = useReactFlow();
  const params = useParams();
  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/self");
      if (!res.ok) {
        throw new Error("Failed to get session");
      }
      const world = await fetch(`/api/worlds/${params.id}`);
      if (!world.ok) {
        throw new Error("Failed to get world");
      }
      const worldData = await world.json();
      const currentWorld: World = {
        _id: worldData.data._id,
        worldName: worldData.data.worldName,
        worldDescription: worldData.data.worldDescription,
        owners: worldData.data.owners,
        objects: worldData.data.object,
        changes: worldData.data.changes,
        relationships: worldData.data.relationships,
        worldCover: worldData.data.worldCover,
      };
      setWorld(currentWorld);
      const resNodesEdges = await fetch(
        `/api/objects/?worldID=${currentWorld._id}`
      );
      if (!resNodesEdges.ok) {
        throw new Error("Failed to get objects");
      }
      const NodesAndEdges = await resNodesEdges.json();
      const worldObjects = NodesAndEdges.data.worldObjects;
      const objectArray: NodeObject[] = worldObjects.map(
        (object: NodeObject) => ({
          _id: object._id,
          objectName: object.objectName,
          objectDescription: object.objectDescription,
          objectPicture: object.objectPicture,
          images: object.images,
          relationships: object.relationships,
          tags: object.tags,
          positionX: object.positionX,
          positionY: object.positionY,
        })
      );
      setObjects(objectArray);

      const worldRelationships = NodesAndEdges.data.worldRelationships;
      const relationArray: RelationshipJSON[] = worldRelationships.map(
        (relation: RelationshipJSON) => ({
          _id: relation._id,
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
  }, [setObjects, setRelationships, setWorld, params.id]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  if (loading) {
    return <Loading />;
  }

  return (
    <ReactFlowProvider>
      <FlowContent
        worldData={world}
        objectData={objects}
        relationshipData={relationships}
        graphRefresh={fetchSession}
      />
    </ReactFlowProvider>
  );
}
