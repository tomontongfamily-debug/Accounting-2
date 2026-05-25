import { Lock } from "lucide-react";
import { Section } from "./SharedUI";

export function Gate({ title, password, setPassword, error, onUnlock, demo }) {
  return (
    <Section icon={Lock} title={title} subtitle="Enter password to continue.">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onUnlock();
          }}
          placeholder="Enter password"
          className="w-full rounded-xl border border-slate-200 px-3 py-3 outline-none"
        />
        {error && <p className="mt-3 text-sm font-bold text-rose-600">{error}</p>}
        <button onClick={onUnlock} className="mt-4 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white">
          Unlock
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">Demo password: {demo}</p>
      </div>
    </Section>
  );
}
