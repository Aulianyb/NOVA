import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

export function WorldElement({
  worldID,
  worldName,
  worldDescription,
  worldCover,
}: {
  worldID: string;
  worldName: string;
  worldDescription: string;
  worldCover: string | undefined;
}) {
  const router = useRouter();
  let usedCover = "worldCover/gn9gyt4gxzebqb6icrwj";
  if (worldCover) {
    usedCover = worldCover;
  }
  return (
    <div
      className="h-[490px] hover:scale-105 transition-all duration-500 ease-in-out"
      onClick={() => router.push(`/worlds/${worldID}`)}
    >
      {/* <div className="bg-slate-300 h-1/2 rounded-t-2xl"></div> */}
      <div className="border-2 border-b-0 border-slate-300 h-1/2 rounded-t-2xl overflow-hidden">
        {/* <Image
          src="/NOVA-worldCover.png"
          alt="NOVA, the mascot, greeting you"
          width={250}
          height={250}
          className="w-full h-full object-cover"
        /> */}
        <CldImage
          width="250"
          height="250"
          src={usedCover}
          alt="World Cover"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="border-2 h-1/2 border-slate-300 p-4">
        <h2 className="font-bold mb-2">{worldName}</h2>
        <p>{worldDescription}</p>
      </div>
    </div>
  );
}
