"use client";
import { Trash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Collaborator } from "@shared/types";

export const columns = (
  worldID: string,
  notify: () => void,
  readOnly: boolean,
  graphRefresh : ()=>void
): ColumnDef<Collaborator>[] => [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      if (readOnly) return null; // 🔒 Don't render actions if read-only

      const user = row.original;
      const handleDelete = async () => {
        try {
          const res = await fetch(
            `/api/worlds/${worldID}/collaborators/${user._id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!res.ok) {
            throw new Error("Failed to Remove Collaborator");
          }
          graphRefresh();
          notify();
        } catch (error) {
          console.log(error);
        }
      };

      return (
        <div className="flex justify-end w-full pr-2">
          <Button
            variant="ghost"
            size="iconSm"
            className="hover:text-red-500"
            onClick={handleDelete}
          >
            <Trash size={16} strokeWidth={1} />
          </Button>
        </div>
      );
    },
  },
];
