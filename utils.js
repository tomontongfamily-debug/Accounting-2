export const today = new Date().toISOString().slice(0, 10);
export const monthLabel = today.slice(0, 7);
export const uid = () => Math.random().toString(36).slice(2, 9);

export const MANAGER_PASSWORD = "manager123";
export const ADMIN_PASSWORD = "admin123";
export const DISCOUNT_PER_LITER = 2;

export const stations = ["Mabolo", "Barili", "Liloan", "Moalboal", "Arpili", "Pondol"];
export const products = ["Diesel", "Premium", "Regular"];
export const tanks = ["Diesel Tank", "Premium Tank", "Regular Tank"];

export const stationPumpLayouts = {
  Mabolo: ["Premium", "Regular", "Regular", "Diesel"],
  Liloan: ["Premium", "Regular", "Regular", "Diesel"],
  Pondol: ["Premium", "Regular", "Diesel"],
  Barili: ["Premium", "Regular", "Diesel"],
  Moalboal: ["Premium", "Regular", "Diesel"],
  Arpili: ["Premium", "Regular", "Diesel"],
};

export const shifts = [
  "Shift 1 - 6:00 AM to 2:00 PM",
  "Shift 2 - 2:00 PM to 10:00 PM",
  "Shift 3 - 10:00 PM to 6:00 AM",
];

export const deductionNames = [
  "GCash",
  "PayMaya",
  "Credit / Debit Card",
  "PO Account",
  "Pull-Out Product",
  "Calibration",
  "Cash Redemption",
  "Fuel Redemption",
  "Purchase Request",
];

export function makePumpRows(station) {
  const layout = stationPumpLayouts[station] || ["Premium", "Regular", "Diesel"];

  return layout.map((product, index) => {
    const opening = 84000 + index * 220;
    const sold = 95 + index * 15;

    return {
      id: `${station}-pump-${index + 1}-${product}`,
      pump: index + 1,
      product,
      opening,
      closing: opening + sold,
      mechanical: opening + sold,
    };
  });
}

export function makeReport(station) {
  const deductionAmounts = [14250, 6200, 18900, 15575, 1280, 550, 900, 1225, 1850];

  return {
    station,
    date: today,
    shift: shifts[0],
    cashier: "Cashier Demo",
    prices: { Diesel: 58.75, Premium: 64.9, Regular: 62.4 },
    pumpRows: makePumpRows(station),
    tankRows: tanks.map((tank, index) => ({
      tank,
      opening: tank.includes("Diesel") ? 6200 : tank.includes("Premium") ? 4300 : 5100,
      delivery: index === 0 ? 2000 : 0,
      pullOut: tank.includes("Diesel") ? 12 : 0,
      calibration: tank.includes("Regular") ? 6 : 3,
      actualDip: tank.includes("Diesel") ? 7780 : tank.includes("Premium") ? 3820 : 4540,
    })),
    oilSales: 2350,
    coke: { beginning: 160, ending: 126, redemption: 9 },
    deductionRows: deductionNames.map((name, index) => ({
      id: uid(),
      name,
      amount: deductionAmounts[index],
    })),
    poRows: [
      { id: uid(), account: "ABC Construction", amount: 7050 },
      { id: uid(), account: "Village Maintenance", amount: 5304 },
    ],
    purchaseRows: [
      { id: uid(), particular: "Lube oil replenishment", amount: 7050 },
      { id: uid(), particular: "Station cleaning supplies", amount: 5304 },
      { id: uid(), particular: "Office and receipt supplies", amount: 3221 },
    ],
    deposits: [
      { id: uid(), date: today, time: "9:30 AM", bank: "BDO", reference: "BDO-001", amount: 25000, verified: false },
      { id: uid(), date: today, time: "3:45 PM", bank: "BPI", reference: "BPI-002", amount: 13500, verified: false },
    ],
  };
}
