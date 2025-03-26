"use client";
import { Navbar } from "@/components/navbar";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { World } from "../../../../types/types";

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
    <main className="bg-[var(--white)] h-full">
      <Navbar
        username={session!.username}
        type={"individual"}
        worldData={world}
      />
      <h1>Hi there! Welcome to {world!.worldName}</h1>
      <p>{world!.worldDescription}</p>
    </main>
  );
}
