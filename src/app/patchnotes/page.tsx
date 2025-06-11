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
          src={`/NOVA-placeholder.png`}
          alt="Mascot, NOVA"
          width="200"
          height="200"
          className="rounded-full"
        />
        <p>Hi there, this is just documentation for this web's development!</p>
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
          <div>
            <h2>NOVA v0.3.0</h2>
            <li>Added Changes Tracker</li>
            <li>Added the ability to change profile pictures and world cover</li>
            <li>Added Collaboration Feature, you can invite people with their username</li>
            <li>Fix saving bug, making sure everything is well synchronized</li>
            <li>Fix deleting UI, now deleting requires user to press the delete button</li>
            <li>Changed background, line size, and line color</li>
            <li>Added error alert and confirmation pop up for better user experience</li>
          </div>
          <div>
            <h2>NOVA v0.4.0</h2>
            <li>Added world tags</li>
            <li>You can now filter objects and relationship with world tags</li>
            <li>Added gallery feature</li>
            <li>You can upload, change image title and delete images</li>
            <li>You can finally change the object details</li>
            <li>Add basic information and story for your world!</li>
            <li>Bug fixxing and refactoring all that nerd stuff</li>
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
