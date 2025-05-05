export default function ChangeElement() {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="border-2 border-slate-200 rounded-xl">
        <div className="p-2">
          <p className="text-base font-bold">Username</p>
          <p>4 April 2025, 10:31 AM</p>
        </div>
        <hr />
        <div className="p-2">
          <p className="italic">"This is for fun yall"</p>
          <p>- Added Node 1, Node 2, Node 3</p>
          <p>- Deleted Node 2</p>
        </div>
      </div>
    </div>
  );
}
