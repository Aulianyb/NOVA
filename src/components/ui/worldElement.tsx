export function WorldElement() {
  return (
    <div className="w-[48vh] h-[68vh] hover:h-[72vh] transition-all duration-500 ease-in-out">
      <div className="bg-slate-300 h-[50%] rounded-t-2xl"></div>
      <div className="border-2 h-[50%] border-slate-300 p-4">
        <h2 className="font-bold mb-2">Mystery Story</h2>
        <p>
          A story set in the 1920's about the mystery of a magician's death. A
          detective trying to figure out the mystery by learning about the
          victim's past with the help of Marie Wright, a police officer who will
          help investigate the crime scene.
        </p>
      </div>
    </div>
  );
}
