"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { quantico } from "../fonts";
import { Navbar } from "@/components/ui/navbar";
import { WorldElement } from "@/components/ui/worldElement";

export default function Home() {
  const [session, setSession] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/self");
        if (!res.ok) {
          throw new Error("Failed to get session");
        }
        const data = await res.json();
        setSession(data.session);
      } catch (error) {
        console.log({ error: error instanceof Error ? error.message : error });
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, []);

  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!res.ok) {
        //self note : fix this so it'll be more descriptive
        throw new Error("Failed to login");
      }
      console.log("Logout successful!");
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  }

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
        <h1 className={`${quantico.className} font-bold text-[--primary] text-6xl`}>
          World Portal
        </h1>
        <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
          <WorldElement />
          <WorldElement />
          <WorldElement />
          <WorldElement />
          <WorldElement />
          <WorldElement />
          <WorldElement />
          <WorldElement />
        </div>
      </div>
    </main>
  );
}
