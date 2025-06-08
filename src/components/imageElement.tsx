import { CldImage } from "next-cloudinary";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GalleryImage } from "@shared/types";
export default function ImageElement({
  imageData,
}: {
  imageData: GalleryImage;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative aspect-square transition ease-in-out hover:opacity-80">
          <CldImage
            src={imageData.imageID}
            alt="NOVA, the mascot, greeting you"
            width="150"
            height="150"
            className="rounded-md"
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="relative aspect-square">
          <CldImage
            src={imageData.imageID}
            alt="placeholder"
            className="object-contain rounded-lg"
            fill
          />
        </div>
        <DialogTitle>{imageData.imageTitle}</DialogTitle>
        <div className="flex flex-wrap gap-1">
          {imageData.objects.map((obj) => {
            return (
              <div
                key={obj._id}
                className="text-sm text-zinc-500 bg-zinc-200 border-2 border-zinc-300 rounded-full py-1 px-2 w-fit"
              >
                {obj.objectName}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
