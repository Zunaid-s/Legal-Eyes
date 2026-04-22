export default function Upload() {
  return (
    <div className="p-10 flex flex-col items-center gap-5">
      <h1 className="text-3xl font-bold text-primary">Upload Project</h1>
      <input type="file" className="file-input file-input-bordered file-input-primary w-full max-w-xs" />
      <button className="btn btn-primary">Submit</button>
    </div>
  );
}
