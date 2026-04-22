export default function Toast({ message, show }) {
  if (!show) return null;

  return (
    <div className="toast toast-end toast-bottom p-6 z-[1000]">
      <div className="alert alert-info shadow-lg border-base-content/10">
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}