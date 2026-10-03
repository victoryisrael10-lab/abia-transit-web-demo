import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  History,
  Plus,
  Wallet,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const money = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

function TopUpDialog({ onClose }) {
  const { addFunds } = useAuth();
  const [amount, setAmount] = useState(1000);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  function topUp() {
    try {
      addFunds(amount, "Bank Transfer");
      setComplete(true);
    } catch (topUpError) {
      setError(topUpError.message);
    }
  }

  return (
    <div className="fixed inset-0 z-[1600] grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <section
        aria-labelledby="topup-title"
        aria-modal="true"
        className="glass-panel relative w-full max-w-md rounded-3xl p-6"
        role="dialog"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close wallet top up"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-white/10"
        >
          <X size={18} />
        </button>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
          Abia Connect Wallet
        </p>
        <h2 id="topup-title" className="mt-2 text-2xl font-semibold text-white">
          Top up your wallet
        </h2>
        {complete ? (
          <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.08] p-4">
            <p role="status" className="text-sm font-semibold text-emerald-200">
              {money(amount)} added to your demo wallet.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 min-h-10 rounded-xl bg-emerald-400 px-4 text-xs font-bold text-[#062419]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Choose a demo amount. No real bank transfer will be initiated.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[500, 1000, 2000].map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={amount === option}
                  onClick={() => setAmount(option)}
                  className={`min-h-11 rounded-xl border text-xs font-semibold ${
                    amount === option
                      ? "border-emerald-300/50 bg-emerald-300/10 text-emerald-200"
                      : "border-white/10 text-slate-300"
                  }`}
                >
                  {money(option)}
                </button>
              ))}
            </div>
            {error && <p role="alert" className="mt-3 text-xs text-rose-300">{error}</p>}
            <button
              type="button"
              onClick={topUp}
              className="mt-5 min-h-12 w-full rounded-xl bg-emerald-400 text-sm font-bold text-[#062419] hover:bg-emerald-300"
            >
              Simulate Bank Transfer
            </button>
          </>
        )}
      </section>
    </div>
  );
}

export default function WalletPage() {
  const { user, walletBalance, transactions, setAuthOpen, persistenceError } =
    useAuth();
  const [topUpOpen, setTopUpOpen] = useState(false);

  return (
    <div className="min-h-screen text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-7">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
            <Wallet size={15} /> Abia Connect Wallet
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            Wallet & transactions
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage your demo wallet and Green Shuttle payments.
          </p>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-emerald-300/20 bg-gradient-to-br from-[#0d5b46] via-[#0a4038] to-[#102837] p-6 shadow-[0_22px_65px_rgba(0,0,0,.28)] sm:p-8">
          <div className="subtle-grid absolute inset-0 opacity-20" />
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/70">
                Available balance
              </p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {money(walletBalance)}
              </p>
              <p className="mt-3 text-xs text-emerald-50/70">
                {user ? `${user.name} · ${user.passengerId}` : "Demo wallet · Log in to link a profile"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => (user ? setTopUpOpen(true) : setAuthOpen(true))}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-[#0b352b] transition hover:bg-emerald-50"
            >
              <Plus size={17} /> Top Up Wallet
            </button>
          </div>
        </section>

        {!user && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-300/15 bg-sky-300/[0.05] p-4">
            <p className="text-sm text-sky-100">Log in to bind this wallet to your rider profile.</p>
            <button type="button" onClick={() => setAuthOpen(true)} className="text-xs font-bold text-sky-200 underline underline-offset-4">Demo login</button>
          </div>
        )}
        {persistenceError && (
          <p role="alert" className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-3 text-xs text-amber-100">
            {persistenceError} Keep this tab open during the demo.
          </p>
        )}

        <section className="glass-panel mt-7 overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <History size={16} className="text-emerald-300" />
              <h2 className="text-sm font-semibold text-white">Recent activity</h2>
            </div>
            <span className="text-[10px] text-slate-500">{transactions.length} transactions</span>
          </div>
          <ul className="divide-y divide-white/[0.06]">
            {transactions.map((transaction) => {
              const isCredit = transaction.balanceImpact > 0;
              return (
                <li key={transaction.id} className="flex items-center gap-3 px-5 py-4 sm:px-6">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${isCredit ? "bg-emerald-300/10 text-emerald-300" : "bg-sky-300/10 text-sky-300"}`}>
                    {isCredit ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{transaction.label}</p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      {transaction.method} · {new Date(transaction.createdAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <p className={`shrink-0 text-sm font-semibold ${isCredit ? "text-emerald-300" : "text-slate-200"}`}>
                    {isCredit ? "+" : transaction.balanceImpact < 0 ? "−" : ""}{money(transaction.amount)}
                  </p>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-2 border-t border-white/10 px-5 py-3 text-[10px] text-slate-500 sm:px-6">
            <CreditCard size={13} className="text-emerald-300" />
            Demo wallet balance updates immediately for Abia Connect Wallet payments.
          </div>
        </section>
      </main>
      {topUpOpen && <TopUpDialog onClose={() => setTopUpOpen(false)} />}
    </div>
  );
}
