"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PatchNotesPage() {
  const router = useRouter();
  return (
    <main className="">
      <div className="flex flex-col gap-4 justify-start items-center min-h-screen">
        <h1 className="font-bold">PATCH NOTES</h1>
        <Image
          src={`/cat-nerd.jpg`}
          alt="Nerdy cat meme"
          width="200"
          height="200"
        />
        <p>Hi there, this page won't be in the final product.</p>
        <div className="space-y-5">
          <div>
            <h2>NOVA v0.1.0</h2>
            <li>Initialized project</li>
            <li>Implemented sign up, login and logout functionality</li>
            <li>Setting up the home page</li>
          </div>
          <div>
            <h2>NOVA v0.1.2</h2>
            <li>Fixed double sign up bug</li>
            <li>Landing page visual overhaul</li>
            <li>Adjusting button and input sizes</li>
            <li>Added patch notes page</li>
          </div>
        </div>
        <Button className="mt-12" onClick={()=>{router.push("/")}}> GO BACK </Button>
      </div>
    </main>
  );
}
