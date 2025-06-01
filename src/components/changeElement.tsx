import { Change } from "@type/types";

export default function ChangeElement({ changeData }: { changeData: Change }) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="border-2 border-slate-200 rounded-xl">
        <div className="p-2">
          <p className="text-base font-bold">{changeData.username}</p>
          <p>{changeData.time}</p>
        </div>
        <hr />
        <div className="p-2">
          {changeData.description.length > 1 ? (
            <>
              <ul className="list-disc ml-6">
                {changeData.description.map((change, index) => {
                  return <li key={index}>{change}</li>;
                })}
              </ul>
            </>
          ) : (
            <p>{changeData.description[0]}</p>
          )}
        </div>
      </div>
    </div>
  );
}
