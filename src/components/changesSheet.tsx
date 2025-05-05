import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import ChangeElement from "./changeElement";

export default function ChangesSheet({
  isOpen,
  openFunction,
}: {
  isOpen: boolean;
  openFunction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      className={`
          fixed flex flex-col gap-4 z-50 bg-white p-6 inset-y-0 right-0 h-full shadow-lg border-l-2 w-1/4
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
    >
      <div>
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => openFunction(false)}
        >
          <ChevronRight />
        </Button>
      </div>
      <h2>List of Changes</h2>
      <hr />
      <ScrollArea>
        <div className="flex flex-col gap-2">
          <ChangeElement />
          <ChangeElement />
          <ChangeElement />
          <ChangeElement />
        </div>
      </ScrollArea>
    </div>
  );
}
