"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Image from "next/image";
import { quantico } from "../fonts";
import { Navbar } from "@/components/ui/navbar";

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
    <main className="bg-[var(--white)]">
      <Navbar username={session!.username}/>
      <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
        <h1 className={`${quantico.className} font-bold text-[var(--primary)]`}>
          Welcome, {session!.username}
        </h1>
        <Image
          src={`/NOVA-greet.png`}
          alt="NOVA, the mascot, greeting you"
          width="250"
          height="250"
        />
        <p>
          <strong>Hi there, thanks for trying out NOVA v.0.1.0!</strong>
          <br /> There's lots of features that hasn't been implemented yet
          <br /> and that's because this version is meant to test
          <br /> the authentication features first (login, signup, etc)
          <br /> as well as initiation of the project!
          <br />
          <br /> Got feedback? Let me know!
          <br /><strong>Discord : TheVoidMask</strong>
        </p>
        <Button
          size="lg"
          onClick={() => {
            handleLogout();
          }}
        >
          LOGOUT
        </Button>
      </div>
    </main>
  );
}
