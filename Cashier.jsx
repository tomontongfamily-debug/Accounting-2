import { stations } from "../data";

export function Header({ mode, setMode, station, selectStation }) {
  const tabs = [
    ["cashier", "Cashier Input"],
    ["manager", "Manager Review"],
    ["admin", "Admin Verification"],
  ];

  return (
    <header className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[1.2fr_.8fr]">
        <div className="p-6 sm:p-8">
          <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-slate-950">ft</div>
            <span>Fueltech <span className="text-yellow-300">Phils</span></span>
          </div>

          <h1 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Fueltech Phils station reporting app
          </h1>

          <div className="mt-6 flex flex-wrap gap-3">
            {tabs.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`rounded-2xl px-5 py-3 text-sm font-bold ${mode === key ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 p-6 sm:p-8">
          <div className="rounded-3xl bg-white p-6">
            <div className="rounded-3xl bg-slate-950 px-6 py-8 text-center">
              <p className="text-4xl font-black text-white sm:text-5xl">FUELTECH</p>
              <p className="mt-1 text-3xl font-black text-yellow-400 sm:text-4xl">PHILS</p>
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-500">Selected Station</p>
            <select
              value={station}
              onChange={(event) => selectStation(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-950 outline-none"
            >
              {stations.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
