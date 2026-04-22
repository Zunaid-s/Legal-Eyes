export default function SummarySection({ icon, title, badge, summary, children, plain, plainLabel }) {
  return (
    <div className="collapse collapse-arrow bg-base-200 border border-base-300 mb-4 shadow-sm">
      <input type="checkbox" defaultChecked /> 
      <div className="collapse-title flex items-center gap-4 text-lg font-medium">
        <div className="text-xl">{icon}</div>
        <div className="flex-1">{title}</div>
        {badge && <span className="badge badge-outline opacity-70">{badge}</span>}
      </div>
      <div className="collapse-content px-6 pb-6">
        <div className="border-l-4 border-primary pl-4 italic text-lg mb-4 opacity-90">
          {summary}
        </div>
        <div className="text-sm leading-relaxed opacity-80 mb-6">
          {children}
        </div>
        {plain && (
          <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
              {plainLabel || '✦ In plain English'}
            </div>
            <p className="text-sm leading-relaxed">{plain}</p>
          </div>
        )}
      </div>
    </div>
  );
}