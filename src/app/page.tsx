"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { quantico } from "./fonts";

export default function Home() {
  const router = useRouter();

  return (
    <main className="bg-[var(--black)]">
      <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-8 row-start-2 ml-12">
          <div className="min-w-64">
            <h1
              className={`${quantico.className} text-[200px] -my-[50px] text-[var(--primary)]`}
            >
              NOVA
            </h1>
            <h2 className="text-2xl italic text-[var(--white)]">
              Narrative Organization and Visualization Assistant
            </h2>
            <div className="flex justify-start gap-4 my-8">
              <Button size="xl" onClick={() => router.push("/register")}>
                REGISTER
              </Button>
              <Button
                size="xl"
                variant="secondary"
                className="ml-4"
                onClick={() => router.push("/login")}
              >
                LOGIN
              </Button>
            </div>
          </div>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <h3 className="text-[var(--white)] text-xl">
            Made with 💖 by @TheVoidMask
          </h3>
        </footer>
      </div>
    </main>
  );
}
