import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Ellipsis } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Tag } from "@shared/types";
import { Dispatch, SetStateAction } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const tagSchema = z.object({
  tagName: z
    .string()
    .min(1, "Your tag must have a name")
    .max(20, "Tag name must be at most 20 characters long"),
});

const ColorMap: Record<string, string> = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  cyan: "bg-cyan-500",
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  pink: "bg-pink-500",
  zinc: "bg-zinc-500",
};

const Colors: string[] = [
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "violet",
  "pink",
  "zinc",
];

// NOTE : ADD ERROR HANDLING WITH TOAST HERE

export default function TagEditingPopover({
  worldID,
  tagData,
  setTagColor,
  setTagName,
}: {
  worldID: string;
  tagData: Tag;
  setTagColor: Dispatch<SetStateAction<string>>;
  setTagName: Dispatch<SetStateAction<string>>;
}) {
  const form = useForm<z.infer<typeof tagSchema>>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      tagName: tagData.tagName,
    },
  });
  async function handleColorChange(color: string) {
    try {
      const reqBody = {
        tagColor: color,
      };
      const res = await fetch(
        `http://localhost:3000/api/worlds/${worldID}/tags/${tagData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqBody),
        }
      );
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Something went wrong");
      } else {
        setTagColor(color);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onChangeName(values: z.infer<typeof tagSchema>) {
    try {
      if (values.tagName != tagData.tagName) {
        const reqBody = {
          tagName: values.tagName,
        };
        const res = await fetch(
          `http://localhost:3000/api/worlds/${worldID}/tags/${tagData._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
          }
        );
        const resData = await res.json();
        if (!res.ok) {
          throw new Error(resData.error || "Something went wrong");
        } else {
          setTagName(values.tagName);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      console.log("Closing");
      form.handleSubmit(onChangeName)();
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        <Ellipsis size={18} />
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-3">
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="tagName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} className="h-7 text-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <div className="flex flex-wrap gap-2">
            {Colors.map((color) => {
              return (
                <Button
                  key={color}
                  className={`rounded-full ${ColorMap[color]} hover:bg-opacity-70 h-9 w-9`}
                  onClick={() => handleColorChange(color)}
                ></Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
