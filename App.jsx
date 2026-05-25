import { useMemo, useState } from "react";
import { ADMIN_PASSWORD, MANAGER_PASSWORD, makeReport, uid } from "./data";
import { compute, makeAllStationMonthlySummary } from "./utils";
import { Admin } from "./Admin";
import { Cashier } from "./Cashier";
import { Gate } from "./Gate";
import { Manager } from "./Manager";

function Header({ mode, setMode, station, selectStation }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-black text-slate-950">Station Report</h1>
        <p className="text-sm text-slate-600">Station: {station}</p>
      </div>
      <div className="flex gap-2">
        {["cashier", "manager", "admin"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-4 py-2 font-bold capitalize ${
              mode === m
                ? "bg-slate-950 text-white"
                : "bg-slate-200 text-slate-900 hover:bg-slate-300"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("cashier");
  const [station, setStation] = useState("Mabolo");
  const [report, setReport] = useState(() => makeReport("Mabolo"));
  const [managerOpen, setManagerOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const result = useMemo(() => compute(report), [report]);
  const monthly = useMemo(() => makeAllStationMonthlySummary(), []);

  function selectStation(nextStation) {
    setStation(nextStation);
    setReport(makeReport(nextStation));
  }

  function patch(key, value) {
    setReport((old) => ({ ...old, [key]: value }));
  }

  function patchObj(section, key, value) {
    setReport((old) => ({
      ...old,
      [section]: { ...old[section], [key]: value },
    }));
  }

  function patchPump(rowId, key, value) {
    setReport((old) => ({
      ...old,
      pumpRows: old.pumpRows.map((row) => (row.id === rowId ? { ...row, [key]: value } : row)),
    }));
  }

  function patchTank(tank, key, value) {
    setReport((old) => ({
      ...old,
      tankRows: old.tankRows.map((row) => (row.tank === tank ? { ...row, [key]: value } : row)),
    }));
  }

  function patchDeduction(rowId, value) {
    setReport((old) => ({
      ...old,
      deductionRows: old.deductionRows.map((row) => (row.id === rowId ? { ...row, amount: value } : row)),
    }));
  }

  function setPrice(product, value) {
    setReport((old) => ({
      ...old,
      prices: { ...old.prices, [product]: value },
    }));
  }

  function addPo() {
    setReport((old) => ({
      ...old,
      poRows: [...old.poRows, { id: uid(), account: "", amount: 0 }],
    }));
  }

  function patchPo(rowId, key, value) {
    setReport((old) => ({
      ...old,
      poRows: old.poRows.map((row) => (row.id === rowId ? { ...row, [key]: value } : row)),
    }));
  }

  function deletePo(rowId) {
    setReport((old) => ({
      ...old,
      poRows: old.poRows.filter((row) => row.id !== rowId),
    }));
  }

  function addPurchase() {
    setReport((old) => ({
      ...old,
      purchaseRows: [...old.purchaseRows, { id: uid(), particular: "", amount: 0 }],
    }));
  }

  function patchPurchase(rowId, key, value) {
    setReport((old) => ({
      ...old,
      purchaseRows: old.purchaseRows.map((row) => (row.id === rowId ? { ...row, [key]: value } : row)),
    }));
  }

  function deletePurchase(rowId) {
    setReport((old) => ({
      ...old,
      purchaseRows: old.purchaseRows.filter((row) => row.id !== rowId),
    }));
  }

  function addDeposit() {
    setReport((old) => ({
      ...old,
      deposits: [
        ...old.deposits,
        { id: uid(), date: old.date, time: "", bank: "", reference: "", amount: 0, verified: false },
      ],
    }));
  }

  function patchDeposit(rowId, key, value) {
    setReport((old) => ({
      ...old,
      deposits: old.deposits.map((row) => (row.id === rowId ? { ...row, [key]: value } : row)),
    }));
  }

  function deleteDeposit(rowId) {
    setReport((old) => ({
      ...old,
      deposits: old.deposits.filter((row) => row.id !== rowId),
    }));
  }

  function verifyDeposit(rowId) {
    setReport((old) => ({
      ...old,
      deposits: old.deposits.map((row) => (row.id === rowId ? { ...row, verified: !row.verified } : row)),
    }));
  }

  function unlock(role) {
    const correct = role === "manager" ? MANAGER_PASSWORD : ADMIN_PASSWORD;

    if (password === correct) {
      if (role === "manager") setManagerOpen(true);
      if (role === "admin") setAdminOpen(true);
      setPassword("");
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

  let page = null;

  if (mode === "cashier") {
    page = (
      <Cashier
        report={report}
        result={result}
        patch={patch}
        patchObj={patchObj}
        patchPump={patchPump}
        patchTank={patchTank}
        patchDeduction={patchDeduction}
        addPo={addPo}
        patchPo={patchPo}
        deletePo={deletePo}
        addPurchase={addPurchase}
        patchPurchase={patchPurchase}
        deletePurchase={deletePurchase}
      />
    );
  }

  if (mode === "manager") {
    page = managerOpen ? (
      <Manager
        report={report}
        result={result}
        setPrice={setPrice}
        addDeposit={addDeposit}
        patchDeposit={patchDeposit}
        deleteDeposit={deleteDeposit}
      />
    ) : (
      <Gate
        title="Manager Password"
        password={password}
        setPassword={setPassword}
        error={error}
        onUnlock={() => unlock("manager")}
        demo={MANAGER_PASSWORD}
      />
    );
  }

  if (mode === "admin") {
    page = adminOpen ? (
      <Admin report={report} result={result} monthly={monthly} verifyDeposit={verifyDeposit} />
    ) : (
      <Gate
        title="Admin Password"
        password={password}
        setPassword={setPassword}
        error={error}
        onUnlock={() => unlock("admin")}
        demo={ADMIN_PASSWORD}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dcfce7_0,#f8fafc_34%,#f8fafc_100%)] p-4 text-slate-900 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Header
          mode={mode}
          setMode={(next) => {
            setMode(next);
            setPassword("");
            setError("");
          }}
          station={station}
          selectStation={selectStation}
        />
        {page}
      </div>
    </div>
  );
}
