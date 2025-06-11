"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { quantico, quanticoItalic } from "./fonts";
import Image from "next/image";
import { Star } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  return (
    <main className="bg-[var(--black)]">
      <div className="relative flex flex-wrap justify-center gap-8 min-h-[80vh] pt-24 px-20">
        <main className="flex flex-col row-start-2 ml-12">
          <div className="flex-shrink">
            <Button
              className="mb-12"
              variant="outline"
              onClick={() => router.push("/patchnotes")}
            >
              PATCH NOTES
            </Button>
            <h1
              className={`${quantico.className} text-[180px] -my-[50px] text-[var(--primary)] -mx-[14px]`}
            >
              NOVA
            </h1>
            <h2 className="text-2xl italic text-[var(--white)]">
              Narrative Organization and Visualization Assistant
            </h2>
            <div className="flex justify-start my-4 gap-2">
              <Button size="xl" onClick={() => router.push("/signup")}>
                REGISTER
              </Button>
              <Button
                size="xl"
                variant="secondary"
                onClick={() => router.push("/login")}
              >
                LOGIN
              </Button>
            </div>
          </div>
        </main>
        <div className="flex-shrink self-end">
          <Image
            src={`/NOVA-greet-cropped.png`}
            alt="NOVA, the mascot, greeting you"
            width="500"
            height="500"
            className="object-contain"
          />
        </div>
      </div>
      <div className="bg-[var(--white)] flex flex-col items-center gap-12 p-20">
        <div className="flex items-center gap-8">
          <Star
            className="w-12 h-12 text-[var(--primary)]"
            style={{ fill: "var(--primary)" }}
          />
          <h1
            className={`${quantico.className} text-center text-5xl text-[var(--primary)]`}
          >
            Things you can do with NOVA
          </h1>
          <Star
            className="w-12 h-12 text-[var(--primary)]"
            style={{ fill: "var(--primary)" }}
          />
        </div>
        <div className="flex gap-2">
          <div className="bg-[var(--primary)] text-[var(--white)] text-center p-8 rounded-xl max-w-[280px]">
            <h1 className={`${quanticoItalic.className}`}>Write!</h1>
            <p>Write about your beloved world and it’s cast of characters.</p>
          </div>
          <div className="bg-[var(--primary)] text-[var(--white)] text-center p-8 rounded-xl max-w-[280px]">
            <h1 className={`${quanticoItalic.className}`}>Visualize!</h1>
            <p>
              Show how each element of your world interact with the use of
              graphs.
            </p>
          </div>
          <div className="bg-[var(--primary)] text-[var(--white)] text-center p-8 rounded-xl max-w-[280px]">
            <h1 className={`${quanticoItalic.className}`}>Share!</h1>
            <p>Share your world with collaborators and work together.</p>
          </div>
        </div>
      </div>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center p-4">
        <h3 className="text-[var(--white)]">
          Final project by @TheVoidMask - v0.4.0
        </h3>
      </footer>
    </main>
  );
}
