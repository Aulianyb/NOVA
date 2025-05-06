import { Change } from "../../types/types";

export default function ChangeElement({changeData} : {changeData : Change}) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="border-2 border-slate-200 rounded-xl">
        <div className="p-2">
          <p className="text-base font-bold">{changeData.username}</p>
          <p>{changeData.time}</p>
        </div>
        <hr />
        <div className="p-2">
          <p className="italic">{changeData.description}</p>
        </div>
      </div>
    </div>
  );
}
