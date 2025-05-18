"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

export default function PatchNotesPage() {
  const router = useRouter();
  return (
    <main className="">
      <div className="flex flex-col gap-4 justify-start items-center min-h-screen">
        <h1 className="font-bold">PATCH NOTES</h1>
        <Image
          src={`/NOVA-placeholder.png`}
          alt="Mascot, NOVA"
          width="200"
          height="200"
          className="rounded-full"
        />
        <CldImage
          width="200"
          height="200"
          src="nova/iq0jj82afy4nlg1awsa7"
          sizes="100vw"
          alt="Description of my image"
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
          <div>
            <h2>NOVA v0.2.0</h2>
            <li>Added World Portal for adding, editing and deleting worlds</li>
            <li>Added World Graph, changing and saving nodes and edges</li>
            <li>Added node and graph editing</li>
            <li>Fixed buncha bugs! 🐛🐛</li>
          </div>
        </div>
        <Button
          className="mt-12"
          onClick={() => {
            router.push("/");
          }}
        >
          GO BACK
        </Button>
      </div>
    </main>
  );
}
