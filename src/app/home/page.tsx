"use client";

import { useRouter } from "next/navigation";
import { quantico } from "../fonts";

export default function Home() {
  const router = useRouter();

  return (
    <main className="bg-[var(--white)]">
      <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <h1>HOME</h1>
      </div>
    </main>
  );
}
