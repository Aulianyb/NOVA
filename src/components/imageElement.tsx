import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export default function ImageElement({ placeholder }: { placeholder: string }) {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative aspect-square transition ease-in-out hover:opacity-80">
          <Image
            src={placeholder}
            alt="placeholder"
            fill
            className="object-cover rounded-xl"
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        {/* <DialogHeader></DialogHeader> */}
        <div className="relative aspect-square">
          <Image
            src={placeholder}
            alt="placeholder"
            className="object-contain rounded-lg"
            fill
          />
        </div>
        <DialogTitle>Image Title</DialogTitle>

        <div className="flex flex-wrap gap-1">
          <div className="text-sm text-zinc-500 bg-zinc-200 border-2 border-zinc-300 rounded-full py-1 px-2 w-fit">
            Character 1
          </div>
          <div className="text-sm text-zinc-500 bg-zinc-200 border-2 border-zinc-300 rounded-full py-1 px-2 w-fit">
            Character 1
          </div>
          <div className="text-sm text-zinc-500 bg-zinc-200 border-2 border-zinc-300 rounded-full py-1 px-2 w-fit">
            Character 1
          </div>
          <div className="text-sm text-zinc-500 bg-zinc-200 border-2 border-zinc-300 rounded-full py-1 px-2 w-fit">
            Character 1
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
