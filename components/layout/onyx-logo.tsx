export function OnyxLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/20 bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.35),rgba(34,197,94,0.08)_35%,rgba(15,23,34,1)_70%)] shadow-glow">
        <div className="h-4 w-4 rotate-45 rounded-[4px] border border-emerald-300/70 bg-emerald-400/25" />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Algorithmic control</p>
        <h1 className="text-sm font-semibold tracking-[0.24em] text-white">ONYX</h1>
      </div>
    </div>
  );
}
