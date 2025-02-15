"use client";
import Image from "next/image";
import { quantico } from "./fonts";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Custom404() {
  const router = useRouter();
  return (
    <main className="bg-[var(--white)]">
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
            404
          </h1>
        </div>
        <p className="text-center text-lg">
          <strong>This page does not exist</strong>
          <br /> Whoopsie! Looks like you've traveled too far!
        </p>
        <Button size="lg" onClick={()=>{router.push("/")}}>Take me back!</Button>
      </div>
    </main>
  );
}
