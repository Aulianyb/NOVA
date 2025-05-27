import { X, Ellipsis } from "lucide-react";
export default function TagElement({color, tagName} : {color : string; tagName : string}) {
  return (
    <div className={`p-1 px-2 text-${color}-500 bg-${color}-200 w-fit rounded-sm flex gap-1 items-center`}>
      <span className="mr-2">{tagName}</span>
      <X size={18}/>
      <Ellipsis size={18}/>
    </div>
  );
}
