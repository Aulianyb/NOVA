"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Home() {
  const [session, setSession] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function fetchSession(){
      try{
        const res = await fetch("/api/auth/self");
        if(!res.ok){
          throw new Error("Failed to get session");
        }
        const data = await res.json();
        setSession(data.session);
      } catch(error){
        console.log({ error: error instanceof Error ? error.message : error })
      } finally {
        setLoading(false);
      }
    }

    fetchSession(); 
  }, []);

  if (loading){
    return(
      <main className="bg-[var(--white)]">
      <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
        <LoadingSpinner/>
      </div>
    </main>
    );
  }

  return (
    <main className="bg-[var(--white)]">
      <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
        <h1>Welcome, { session ? session.username : "Loading..." }</h1>
        <Button size="lg">LOGOUT</Button>
      </div>
    </main>
  );
}
