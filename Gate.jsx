import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { php } from "../utils";

export function Num({ value, onChange, prefix, suffix }) {
  return (
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{prefix}</span>}
      <input
        type="number"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value === "" ? "" : Number(event.target.value))}
        className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 ${prefix ? "pl-12" : ""} ${suffix ? "pr-10" : ""}`}
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{suffix}</span>}
    </div>
  );
}

export function Text({ value, onChange, placeholder }) {
  return (
    <input
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
    />
  );
}

export function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-5 flex gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon size={22} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </motion.section>
  );
}

export function Card({ title, value, note, dark }) {
  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${dark ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-900"}`}>
      <p className="text-sm font-medium opacity-70">{title}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
      {note && <p className="mt-2 text-xs opacity-60">{note}</p>}
    </div>
  );
}

export function ReadOnlyLine({ label, value }) {
  return (
    <div className="flex justify-between gap-3 rounded-2xl bg-slate-50 p-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-black text-slate-950">{value}</span>
    </div>
  );
}

export function SimpleExplain({ number, title, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">{number}</div>
        <div>
          <p className="text-base font-black text-slate-950">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{children}</p>
        </div>
      </div>
    </div>
  );
}

export function DataTable({ headers, children, minWidth = "760px" }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>{headers.map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

export function RowList({ rows, firstKey, firstLabel, total, addLabel, placeholder, onAdd, onPatch, onDelete }) {
  return (
    <>
      <DataTable headers={[firstLabel, "Amount", "Action"]} minWidth="520px">
        {rows.map((row) => (
          <tr key={row.id}>
            <td className="px-4 py-3">
              <Text value={row[firstKey]} onChange={(value) => onPatch(row.id, firstKey, value)} placeholder={placeholder} />
            </td>
            <td className="px-4 py-3">
              <Num value={row.amount} onChange={(value) => onPatch(row.id, "amount", value)} prefix="PHP" />
            </td>
            <td className="px-4 py-3">
              <button onClick={() => onDelete(row.id)} className="rounded-xl bg-rose-50 px-3 py-2 text-rose-600">
                <Trash2 size={18} />
              </button>
            </td>
          </tr>
        ))}
        <tr className="bg-emerald-50">
          <td className="px-4 py-3 font-black text-emerald-950">TOTAL</td>
          <td className="px-4 py-3 font-black text-emerald-950">{php.format(total)}</td>
          <td />
        </tr>
      </DataTable>
      <button onClick={onAdd} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">
        <Plus size={18} /> {addLabel}
      </button>
    </>
  );
}
