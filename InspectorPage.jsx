import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Camera,
  CircleAlert,
  QrCode,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const money = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

export default function InspectorPage() {
  const { user, passes, setAuthOpen } = useAuth();
  const [selectedId, setSelectedId] = useState(passes[0]?.id ?? "");
  const [scannedId, setScannedId] = useState("");
  const selectedPass = useMemo(
    () => passes.find(({ id }) => id === selectedId),
    [passes, selectedId],
  );
  const verifiedPass = passes.find(({ id }) => id === scannedId);

  return (
    <div className="min-h-screen text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-7">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-200">
            <ShieldCheck size={15} /> Green Shuttle operations
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            Inspector scan mode
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Simulate scanning a paid passenger pass and verify its payment record.
          </p>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-slate-300">
            Signed in as{" "}
            <strong className="font-semibold text-white">
              {user?.name ?? "Demo inspector"}
            </strong>
            {user?.passengerId ? ` · ${user.passengerId}` : ""}
          </p>
          {user?.role !== "inspector" && (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="min-h-9 rounded-xl bg-amber-300 px-3 text-xs font-bold text-[#302207]"
            >
              Demo Login as Inspector
            </button>
          )}
        </div>

        <section className="glass-panel grid gap-6 rounded-3xl p-5 sm:p-7 md:grid-cols-[1fr_230px]">
          <div>
            <div className="flex items-center gap-2">
              <Camera size={17} className="text-emerald-300" />
              <h2 className="text-sm font-semibold text-white">Select a pass to scan</h2>
            </div>
            {passes.length > 0 ? (
              <>
                <label className="mt-4 block text-xs font-semibold text-slate-400">
                  Recent paid passes
                  <select
                    value={selectedId}
                    onChange={(event) => {
                      setSelectedId(event.target.value);
                      setScannedId("");
                    }}
                    className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-[#0b1929] px-3 text-sm text-white outline-none focus:border-emerald-300/50"
                  >
                    {passes.map((pass) => (
                      <option key={pass.id} value={pass.id}>
                        {pass.holderName} · {pass.routeName} · {pass.reference}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="mt-4 text-xs leading-5 text-slate-400">
                  Demo scan validates the selected QR payload against the paid passes saved in this browser.
                </p>
                <button
                  type="button"
                  disabled={!selectedPass}
                  onClick={() => setScannedId(selectedPass?.id ?? "")}
                  className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 text-sm font-bold text-[#062419] hover:bg-emerald-300 disabled:opacity-40"
                >
                  <QrCode size={16} /> Simulate QR Scan
                </button>
              </>
            ) : (
              <div className="mt-5 rounded-2xl border border-amber-300/15 bg-amber-300/[0.05] p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-amber-100">
                  <CircleAlert size={16} /> No paid passes yet
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Book a Green Shuttle journey and complete a demo payment first. Its pass will appear here automatically.
                </p>
                <a href="/" className="mt-4 inline-flex min-h-9 items-center rounded-lg border border-white/10 px-3 text-xs font-semibold text-white hover:bg-white/5">
                  Go to route booking
                </a>
              </div>
            )}
          </div>
          <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#091725]/70 p-4 text-center">
            {selectedPass ? (
              <>
                <div className="rounded-xl bg-white p-2">
                  <QRCodeSVG
                    value={JSON.stringify({
                      reference: selectedPass.reference,
                      passengerId: selectedPass.passengerId,
                      passengerCount: selectedPass.passengerCount,
                      totalPaid: selectedPass.totalPaid,
                      status: selectedPass.status,
                    })}
                    size={132}
                    title={`Pass code for ${selectedPass.holderName}`}
                  />
                </div>
                <p className="mt-3 font-mono text-[10px] text-slate-500">
                  {selectedPass.reference}
                </p>
              </>
            ) : (
              <div className="grid h-36 w-36 place-items-center rounded-2xl border border-dashed border-white/10 text-slate-600">
                <QrCode size={38} />
              </div>
            )}
            <p className="mt-2 text-[10px] text-slate-500">Demo scan target</p>
          </div>
        </section>

        {scannedId && verifiedPass && (
          <section
            aria-live="polite"
            className="mt-5 overflow-hidden rounded-3xl border border-emerald-300/30 bg-gradient-to-br from-[#07583e] to-[#0a382e] p-6 shadow-[0_20px_60px_rgba(0,0,0,.25)] sm:p-8"
          >
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-300 text-[#063c29]">
                <BadgeCheck size={25} />
              </span>
              <div>
                <p className="text-xl font-extrabold tracking-wide text-white sm:text-2xl">
                  VALID PASS — PAID
                </p>
                <p className="mt-1 text-xs text-emerald-100/75">
                  Payment verified · {verifiedPass.paymentMethod}
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 border-t border-white/15 pt-5 sm:grid-cols-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-100/60">Passenger</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-white">
                  <UserRound size={14} /> {verifiedPass.holderName}
                </p>
                <p className="mt-1 text-[10px] text-emerald-100/70">{verifiedPass.passengerId}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-100/60">Journey</p>
                <p className="mt-1 text-sm font-semibold text-white">{verifiedPass.routeName}</p>
                <p className="mt-1 text-xs text-emerald-100/70">{verifiedPass.passengerCount} passenger(s)</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-100/60">Paid</p>
                <p className="mt-1 text-sm font-semibold text-white">{money(verifiedPass.totalPaid)}</p>
                <p className="mt-1 font-mono text-[10px] text-emerald-100/70">{verifiedPass.reference}</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
