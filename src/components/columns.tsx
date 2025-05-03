"use client";
import { Trash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export type Collaborator = {
  id: string;
  username: string;
};

export const columns: ColumnDef<Collaborator>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex justify-end w-full pr-2">
          <Button variant="ghost" size="iconSm" className="hover:text-red-500" onClick={()=>{console.log(user)}}>
            <Trash size={16} strokeWidth={1} />
          </Button>
        </div>
      );
    },
  },
];
