import { ClipboardList, Database, FileText, Gauge, ReceiptText } from "lucide-react";
import { shifts } from "../data";
import { litersFmt, php, toNum } from "../utils";
import { Card, DataTable, Num, RowList, Section, Text } from "./SharedUI";

export function Cashier({
  report,
  result,
  patch,
  patchObj,
  patchPump,
  patchTank,
  patchDeduction,
  addPo,
  patchPo,
  deletePo,
  addPurchase,
  patchPurchase,
  deletePurchase,
}) {
  return (
    <div className="space-y-6">
      <Section icon={ClipboardList} title="Shift Details" subtitle="Cashier input for daily station report.">
        <div className="grid gap-4 md:grid-cols-3">
          <label>
            <span className="text-xs font-bold uppercase text-slate-500">Report Date</span>
            <Text value={report.date} onChange={(value) => patch("date", value)} />
          </label>

          <label>
            <span className="text-xs font-bold uppercase text-slate-500">Shift</span>
            <select
              value={report.shift}
              onChange={(event) => patch("shift", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              {shifts.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>

          <label>
            <span className="text-xs font-bold uppercase text-slate-500">Cashier</span>
            <Text value={report.cashier} onChange={(value) => patch("cashier", value)} />
          </label>
        </div>
      </Section>

      <Section icon={Gauge} title="Pump Reading - Liters Only" subtitle="Cashier sees liters sold only. Manager controls price per liter.">
        <DataTable headers={["Pump", "Product", "Opening", "Closing", "Mechanical", "Liters Sold"]} minWidth="760px">
          {report.pumpRows.map((row) => {
            const liters = Math.max(0, toNum(row.closing) - toNum(row.opening));

            return (
              <tr key={row.id}>
                <td className="px-4 py-3 font-bold">Pump {row.pump}</td>
                <td className="px-4 py-3">{row.product}</td>
                <td className="px-4 py-3"><Num value={row.opening} onChange={(value) => patchPump(row.id, "opening", value)} /></td>
                <td className="px-4 py-3"><Num value={row.closing} onChange={(value) => patchPump(row.id, "closing", value)} /></td>
                <td className="px-4 py-3"><Num value={row.mechanical} onChange={(value) => patchPump(row.id, "mechanical", value)} /></td>
                <td className="px-4 py-3 font-black text-emerald-700">{litersFmt.format(liters)} L</td>
              </tr>
            );
          })}
        </DataTable>
      </Section>

      <Section icon={Database} title="Tank Inventory" subtitle="One Diesel tank, one Premium tank, and one Regular tank per station.">
        <DataTable headers={["Tank", "Opening", "Delivery", "Pull-Out", "Calibration", "Actual Dip", "Expected Dip", "Variance"]} minWidth="820px">
          {result.tankRows.map((row) => (
            <tr key={row.tank}>
              <td className="px-4 py-3 font-bold">{row.tank}</td>
              <td className="px-4 py-3"><Num value={row.opening} onChange={(value) => patchTank(row.tank, "opening", value)} suffix="L" /></td>
              <td className="px-4 py-3"><Num value={row.delivery} onChange={(value) => patchTank(row.tank, "delivery", value)} suffix="L" /></td>
              <td className="px-4 py-3"><Num value={row.pullOut} onChange={(value) => patchTank(row.tank, "pullOut", value)} suffix="L" /></td>
              <td className="px-4 py-3"><Num value={row.calibration} onChange={(value) => patchTank(row.tank, "calibration", value)} suffix="L" /></td>
              <td className="px-4 py-3"><Num value={row.actualDip} onChange={(value) => patchTank(row.tank, "actualDip", value)} suffix="L" /></td>
              <td className="px-4 py-3 font-black">{litersFmt.format(row.expectedDip)} L</td>
              <td className="px-4 py-3 font-black">{litersFmt.format(row.variance)} L</td>
            </tr>
          ))}
        </DataTable>
      </Section>

      <Section icon={ReceiptText} title="Deductions" subtitle="Cashier handles deductions. Manager does not edit deductions.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {report.deductionRows.map((row) => (
            <label key={row.id}>
              <span className="text-xs font-bold uppercase text-slate-500">{row.name}</span>
              <Num value={row.amount} onChange={(value) => patchDeduction(row.id, value)} prefix="PHP" />
            </label>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-white">
          <p className="text-xs text-slate-300">Total Deductions</p>
          <p className="mt-1 text-2xl font-black">{php.format(result.deductions)}</p>
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section icon={ReceiptText} title="Daily PO Accounts" subtitle="PO list with auto total.">
          <RowList rows={report.poRows} firstKey="account" firstLabel="PO / Account" total={result.poTotal} addLabel="Add PO" placeholder="Customer / account" onAdd={addPo} onPatch={patchPo} onDelete={deletePo} />
        </Section>

        <Section icon={ReceiptText} title="Daily Purchase Requests" subtitle="Purchase request list with auto total.">
          <RowList rows={report.purchaseRows} firstKey="particular" firstLabel="Particular" total={result.purchaseTotal} addLabel="Add Particular" placeholder="Example: supplies" onAdd={addPurchase} onPatch={patchPurchase} onDelete={deletePurchase} />
        </Section>
      </div>

      <Section icon={FileText} title="Oil Sales & Coke Count" subtitle="Oil sales are included in gross sales. Coke is counted only and not added to sales.">
        <div className="grid gap-4 md:grid-cols-4">
          <label className="space-y-2 md:col-span-4">
            <span className="text-xs font-bold uppercase text-slate-500">Oil Sales Amount</span>
            <Num value={report.oilSales} onChange={(value) => patch("oilSales", value)} prefix="PHP" />
          </label>

          <label>
            <span className="text-xs font-bold uppercase text-slate-500">Coke Beginning</span>
            <Num value={report.coke.beginning} onChange={(value) => patchObj("coke", "beginning", value)} />
          </label>

          <label>
            <span className="text-xs font-bold uppercase text-slate-500">Coke Ending</span>
            <Num value={report.coke.ending} onChange={(value) => patchObj("coke", "ending", value)} />
          </label>

          <label>
            <span className="text-xs font-bold uppercase text-slate-500">Coke Redemption</span>
            <Num value={report.coke.redemption} onChange={(value) => patchObj("coke", "redemption", value)} />
          </label>

          <Card title="Coke Sold" value={`${result.cokeSold} pcs`} />
        </div>
      </Section>
    </div>
  );
}
