export function WorldElement({
  worldName,
  worldDescription,
}: {
  worldName: string;
  worldDescription: string;
}) {
  return (
    <div className="w-full h-[490px] hover:scale-105 transition-all duration-500 ease-in-out">
      <div className="bg-slate-300 h-1/2 rounded-t-2xl"></div>
      <div className="border-2 h-1/2 border-slate-300 p-4">
        <h2 className="font-bold mb-2">{worldName}</h2>
        <p>{worldDescription}</p>
      </div>
    </div>
  );
}
