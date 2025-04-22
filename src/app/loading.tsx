import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <main className="bg-[var(--white)]">
      <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    </main>
  );
}
