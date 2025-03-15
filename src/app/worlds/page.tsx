"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { quantico } from "../fonts";
import { Navbar } from "@/components/ui/navbar";
import { WorldElement } from "@/components/ui/worldElement";
import { World } from "../../../types/types"; 

export default function Worlds() {
  const [session, setSession] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [worlds, setWorlds] = useState<World[]>([]);

  async function fetchSession() {
    try {
      const res = await fetch("/api/auth/self");
      if (!res.ok) {
        throw new Error("Failed to get session");
      }
      const sessionData = await res.json();
      const session = sessionData.session;
      setSession(session);
      const resWorld = await fetch(`api/worlds`);
      if (!resWorld.ok) {
        throw new Error("Failed to get world data");
      }
      const worldData = await resWorld.json();
      const worldArray : World[] = worldData.data.map((world : any) =>({
        id: world._id,
        worldName: world.worldName,
        worldDescription: world.worldDescription,
        owners: world.owners,
        categories: world.categories,
        // note to self : HARUSNYA OBJECTS! CHANGE LATER
        objects: world.object,
        changes: world.changes,
      }))
      setWorlds(worldArray);
      console.log(worldArray);
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
    <main className="bg-[var(--white)] h-full">
      <Navbar username={session!.username} />
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
                key={world.id}
                worldName={world.worldName}
                worldDescription={world.worldDescription}
                worldID={world.id}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
