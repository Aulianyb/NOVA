import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import ChangeElement from "./changeElement";
import { useCallback, useState, useEffect } from "react";
import { Change, ChangeAPI } from "../../types/types";

function convertDate(ISODate: string) {
  const date = new Date(ISODate);
  const formatted = date.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return formatted;
}

export default function ChangesSheet({
  isOpen,
  openFunction,
  worldID,
}: {
  isOpen: boolean;
  openFunction: React.Dispatch<React.SetStateAction<boolean>>;
  worldID: string;
}) {
  const [changesList, setChangesList] = useState<Change[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/worlds/${worldID}/changes`);
      if (!res.ok) {
        throw new Error("Failed to get changes");
      }
      const changesData = await res.json();
      const changes: Change[] = changesData.data.map((change: ChangeAPI) => ({
        _id: change._id,
        description: change.description,
        username: change.username,
        time: convertDate(change.createdAt),
      }));
      setChangesList(changes);
    } catch (error) {
      console.log({ error });
    }
  }, [worldID]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [fetchData, isOpen]);

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
          {changesList.map((change) => {
            return <ChangeElement key={change._id} changeData={change} />;
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
