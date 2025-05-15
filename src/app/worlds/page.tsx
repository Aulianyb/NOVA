"use client";

import { useCallback, useEffect, useState } from "react";
import { quantico } from "../fonts";
import { Navbar } from "@/components/navbar";
import { WorldElement } from "@/components/worldElement";
import { World } from "../../../types/types";
import Loading from "../loading";
import { useToast } from "@/hooks/use-toast";

export default function Worlds() {
  const [session, setSession] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [worlds, setWorlds] = useState<World[]>([]);

  const { toast } = useToast();

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
        console.log(errorData);
        throw new Error(errorData.error || "Failed to get session");
      }
      const sessionData = await res.json();
      const session = sessionData.session;
      setSession(session);
      const resWorld = await fetch(`api/worlds`);
      if (!resWorld.ok) {
        throw new Error("Failed to get world data");
      }
      const worldData = await resWorld.json();
      const worldArray: World[] = worldData.data.map((world: World) => ({
        _id: world._id,
        worldName: world.worldName,
        worldDescription: world.worldDescription,
        owners: world.owners,
        objects: world.objects,
        relationships: world.relationships,
        changes: world.changes,
        worldCover: world.worldCover,
      }));
      setWorlds(worldArray);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="bg-[var(--white)] h-full">
      <Navbar username={session!.username} worldRefresh={fetchSession} />
      <div className="flex flex-col space-y-10 justify-start items-center mx-auto h-full max-w-screen-xl py-10 px-10">
        <h1
          className={`${quantico.className} font-bold text-[--primary] text-6xl`}
        >
          World Portal
        </h1>
        <div className="w-full grid gap-5 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 items-start">
          {worlds.toReversed().map((world) => {
            return (
              <WorldElement
                key={world._id}
                worldName={world.worldName}
                worldDescription={world.worldDescription}
                worldID={world._id}
                worldCover={world.worldCover}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
