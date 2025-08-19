import { Star } from "lucide-react";

export default function Loading() {
  return (
    <main className="bg-[var(--white)]">
      <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
        <Star className="animate-spin" color="#c478ff" size={50} />
      </div>
    </main>
  );
}
