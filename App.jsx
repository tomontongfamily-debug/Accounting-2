import { makeReport, stations } from "./data";
import { compute, makeAllStationMonthlySummary, posPrice } from "./utils";

export function runTests() {
  const mabolo = makeReport("Mabolo");
  const maboloResult = compute(mabolo);
  const pondol = makeReport("Pondol");
  const pondolResult = compute(pondol);

  console.assert(posPrice(60) === 58, "less 2 pesos per liter should be applied");
  console.assert(mabolo.pumpRows.length === 4, "Mabolo should have four pump rows");
  console.assert(mabolo.pumpRows.map((row) => row.product).join(",") === "Premium,Regular,Regular,Diesel", "Mabolo pump layout should be Premium, Regular, Regular, Diesel");
  console.assert(pondol.pumpRows.length === 3, "Pondol should have three listed pump rows");
  console.assert(maboloResult.pumpCounts.Regular === 2, "Mabolo should count two Regular pumps");
  console.assert(maboloResult.tankRows.length === 3, "each station should have three tanks");
  console.assert(maboloResult.cokeSold === 25, "coke sold should be beginning minus ending minus redemption");
  console.assert(maboloResult.grossSales === maboloResult.fuelSales + mabolo.oilSales, "gross sales should be fuel plus oil only");
  console.assert(maboloResult.poTotal === 12354, "PO total should add all PO rows");
  console.assert(maboloResult.purchaseTotal === 15575, "purchase request total should add all purchase rows");
  console.assert(maboloResult.bankTotal === 38500, "bank total should add all deposits");
  console.assert(maboloResult.pendingBank === 38500, "pending bank should be total minus verified");
  console.assert(maboloResult.actualCash === maboloResult.bankTotal, "manager bank deposits are the actual cash basis in this demo");
  console.assert(maboloResult.totalLiters > 0, "total liters should compute from pump readings");
  console.assert(maboloResult.deductions === 60730, "deductions should total all cashier deduction rows");
  console.assert(maboloResult.fuelSales > 0, "fuel sales should compute using manager price less discount");
  console.assert(maboloResult.liters.Diesel > 0 && maboloResult.liters.Premium > 0 && maboloResult.liters.Regular > 0, "all product liters should compute");
  console.assert(maboloResult.verifiedBank === 0, "default deposits should start unverified");
  console.assert(maboloResult.cashVariance === maboloResult.actualCash - maboloResult.expectedCash, "cash variance should be actual cash minus expected cash");
  console.assert(pondolResult.totalPumps === 3, "Pondol total pumps should follow the listed layout");

  const monthly = makeAllStationMonthlySummary();
  console.assert(monthly.rows.length === stations.length, "monthly summary should include all stations");
  console.assert(monthly.totals.totalPumps > 0, "monthly summary should total pump count");
  console.assert(monthly.totals.totalLiters > maboloResult.totalLiters, "monthly all-station liters should be larger than one station daily liters");
  console.assert(monthly.totals.bankTotal > 0, "monthly all-station bank total should compute");
  console.assert(monthly.totals.liters.Diesel > 0, "monthly diesel liters should compute");
  console.assert(monthly.totals.poTotal > 0 && monthly.totals.purchaseTotal > 0, "monthly PO and purchase totals should compute");
  console.assert(Object.keys(monthly.totals.liters).length === 3, "monthly summary should keep three fuel products");
}
