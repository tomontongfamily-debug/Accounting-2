import { DISCOUNT_PER_LITER, makeReport, monthLabel, products, stationPumpLayouts, stations } from "./data";

export const php = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 2,
});

export const litersFmt = new Intl.NumberFormat("en-PH", {
  maximumFractionDigits: 2,
});

export function toNum(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function posPrice(price) {
  return Math.max(0, toNum(price) - DISCOUNT_PER_LITER);
}

export function tankProduct(tank) {
  if (tank.includes("Diesel")) return "Diesel";
  if (tank.includes("Premium")) return "Premium";
  return "Regular";
}

export function compute(report) {
  const liters = { Diesel: 0, Premium: 0, Regular: 0 };
  const pumpCounts = { Diesel: 0, Premium: 0, Regular: 0 };

  report.pumpRows.forEach((row) => {
    pumpCounts[row.product] += 1;
    liters[row.product] += Math.max(0, toNum(row.closing) - toNum(row.opening));
  });

  const totalPumps = report.pumpRows.length;
  const totalLiters = products.reduce((sum, product) => sum + liters[product], 0);
  const fuelSales = products.reduce((sum, product) => sum + liters[product] * posPrice(report.prices[product]), 0);
  const grossSales = fuelSales + toNum(report.oilSales);
  const deductions = report.deductionRows.reduce((sum, row) => sum + toNum(row.amount), 0);
  const poTotal = report.poRows.reduce((sum, row) => sum + toNum(row.amount), 0);
  const purchaseTotal = report.purchaseRows.reduce((sum, row) => sum + toNum(row.amount), 0);
  const bankTotal = report.deposits.reduce((sum, row) => sum + toNum(row.amount), 0);
  const verifiedBank = report.deposits.filter((row) => row.verified).reduce((sum, row) => sum + toNum(row.amount), 0);
  const expectedCash = grossSales - deductions;
  const actualCash = bankTotal;

  const tankRows = report.tankRows.map((row) => {
    const product = tankProduct(row.tank);
    const expectedDip =
      toNum(row.opening) +
      toNum(row.delivery) -
      liters[product] -
      toNum(row.pullOut) -
      toNum(row.calibration);

    return {
      ...row,
      product,
      sold: liters[product],
      expectedDip,
      variance: toNum(row.actualDip) - expectedDip,
    };
  });

  return {
    liters,
    pumpCounts,
    totalPumps,
    totalLiters,
    fuelSales,
    grossSales,
    deductions,
    poTotal,
    purchaseTotal,
    bankTotal,
    verifiedBank,
    pendingBank: bankTotal - verifiedBank,
    expectedCash,
    actualCash,
    cashVariance: actualCash - expectedCash,
    tankRows,
    tankVariance: tankRows.reduce((sum, row) => sum + row.variance, 0),
    cokeSold: Math.max(0, toNum(report.coke.beginning) - toNum(report.coke.ending) - toNum(report.coke.redemption)),
  };
}

export function makeMonthlyReport(station, index) {
  const report = makeReport(station);
  const multiplier = index + 1;

  report.date = monthLabel;
  report.oilSales += multiplier * 750;

  report.pumpRows = report.pumpRows.map((row) => ({
    ...row,
    closing: row.closing + multiplier * 18,
    mechanical: row.mechanical + multiplier * 18,
  }));

  report.tankRows = report.tankRows.map((row) => ({
    ...row,
    delivery: row.delivery + multiplier * 250,
    actualDip: row.actualDip + multiplier * 60,
  }));

  report.deductionRows = report.deductionRows.map((row) => ({
    ...row,
    amount: row.amount + multiplier * 300,
  }));

  report.poRows = report.poRows.map((row) => ({
    ...row,
    amount: row.amount + multiplier * 450,
  }));

  report.purchaseRows = report.purchaseRows.map((row) => ({
    ...row,
    amount: row.amount + multiplier * 325,
  }));

  report.deposits = report.deposits.map((row) => ({
    ...row,
    amount: row.amount + multiplier * 2200,
  }));

  return report;
}

export function makeAllStationMonthlySummary() {
  const rows = stations.map((station, index) => {
    const report = makeMonthlyReport(station, index);
    return { station, report, result: compute(report), pumpLayout: stationPumpLayouts[station] || [] };
  });

  const totals = rows.reduce(
    (sum, row) => {
      products.forEach((product) => {
        sum.liters[product] += row.result.liters[product];
        sum.pumpCounts[product] += row.result.pumpCounts[product];
      });

      sum.totalPumps += row.result.totalPumps;
      sum.totalLiters += row.result.totalLiters;
      sum.fuelSales += row.result.fuelSales;
      sum.grossSales += row.result.grossSales;
      sum.deductions += row.result.deductions;
      sum.expectedCash += row.result.expectedCash;
      sum.bankTotal += row.result.bankTotal;
      sum.verifiedBank += row.result.verifiedBank;
      sum.pendingBank += row.result.pendingBank;
      sum.cashVariance += row.result.cashVariance;
      sum.tankVariance += row.result.tankVariance;
      sum.poTotal += row.result.poTotal;
      sum.purchaseTotal += row.result.purchaseTotal;
      sum.oilSales += row.report.oilSales;
      sum.cokeSold += row.result.cokeSold;

      return sum;
    },
    {
      liters: { Diesel: 0, Premium: 0, Regular: 0 },
      pumpCounts: { Diesel: 0, Premium: 0, Regular: 0 },
      totalPumps: 0,
      totalLiters: 0,
      fuelSales: 0,
      grossSales: 0,
      deductions: 0,
      expectedCash: 0,
      bankTotal: 0,
      verifiedBank: 0,
      pendingBank: 0,
      cashVariance: 0,
      tankVariance: 0,
      poTotal: 0,
      purchaseTotal: 0,
      oilSales: 0,
      cokeSold: 0,
    }
  );

  return { rows, totals };
}
