import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const imageSchema = z.object({
  imageTitle: z
    .string()
    .min(1, "Your image must have a title")
    .max(20, "Image title name must be at most 20 characters long"),
  imageFile: z
    .any()
    .transform((val) => (val instanceof FileList ? val[0] : val))
    .superRefine((file, ctx) => {
      if (!(file instanceof File) || file.size === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "An image file is required",
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Max image size is 5MB.",
        });
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
        });
      }
    })
});

export default function ImageCreationDialog() {
  const form = useForm<z.infer<typeof imageSchema>>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      imageTitle: "",
      imageFile: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof imageSchema>) {
    console.log(values.imageTitle);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-md w-full mb-2">
          Add Image
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new image</DialogTitle>
          <DialogDescription>Add an image into the gallery!</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="imageFile"
              render={() => (
                <FormItem>
                  <Label htmlFor="picture">Image File</Label>
                  <FormControl>
                    <Input
                      id="picture"
                      type="file"
                      className="bg-white border border-slate-200"
                      {...form.register("imageFile")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageTitle"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name" className="text-right">
                    Image Title
                  </Label>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="rounded-lg mt-4">
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
