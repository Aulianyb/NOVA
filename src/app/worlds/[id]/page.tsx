"use client";
import React, { useCallback } from "react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { World, NodeObject, RelationshipJSON } from "@shared/types";
import { ReactFlowProvider } from "@xyflow/react";
import { FlowContent } from "./flowContent";
import Loading from "@/app/loading";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { quantico } from "@/app/fonts";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [unAuthAccess, setUnAuthAccess] = useState(false);
  const [world, setWorld] = useState<World | null>(null);
  const [objects, setObjects] = useState<NodeObject[] | null>(null);
  const [relationships, setRelationships] = useState<RelationshipJSON[] | null>(
    null
  );
  const params = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string>("");

  const fetchSession = useCallback(async () => {
    function showError(message: string) {
      const notify = () => {
        toast({
          title: "An Error has Occured!",
          description: message,
          variant: "destructive",
        });
      };
      notify();
    }
    try {
      const res = await fetch("/api/auth/self");
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData.error);
        throw new Error(errorData.error || "Something went wrong");
      }
      const resData = await res.json();
      setCurrentUser(resData.session.id);
      const world = await fetch(`/api/worlds/${params.id}`);
      if (!world.ok) {
        console.log(world.status);
        if (world.status == 401) {
          setUnAuthAccess(true);
          throw new Error("You have no access to this world!");
        } else {
          const worldErrorData = await world.json();
          console.log(worldErrorData.error);
          throw new Error(worldErrorData.error || "Something went wrong");
        }
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
        collaborators: worldData.data.collaborators ?? [],
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
          info: object.info,
          story: object.story,
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
          mainTag: relation.mainTag,
          relationshipDescription: relation.relationshipDescription,
        })
      );
      setObjects(objectArray);
      setRelationships(relationArray);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [setObjects, toast, setRelationships, setWorld, params.id]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  if (unAuthAccess) {
    return (
      <div className="flex flex-col gap-8 justify-center items-center min-h-screen">
        <div className="flex flex-row items-center gap-4">
          <Image
            src={`/NOVA-lost.png`}
            alt="NOVA, the mascot, greeting you"
            width="250"
            height="250"
          />
          <h1
            className={`${quantico.className} font-bold text-[var(--primary)] text-[180px]`}
          >
            401
          </h1>
        </div>
        <p className="text-center text-lg">
          <strong>Trying to access a world without permission?</strong>
          <br /> Nuh uh, you can't do that!
        </p>
        <Button
          size="lg"
          onClick={() => {
            router.push("/");
          }}
        >
          Take me back!
        </Button>
      </div>
    );
  }

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
        currentUser={currentUser}
      />
    </ReactFlowProvider>
  );
}
