import { useRef, useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  CreditCard,
  Wallet,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const paymentOptions = [
  { id: "Abia Connect Wallet", label: "Abia Connect Wallet", Icon: Wallet },
  { id: "Bank Transfer", label: "Bank Transfer", Icon: Building2 },
  { id: "Debit Card / USSD", label: "Debit Card / USSD", Icon: CreditCard },
];

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

export default function CheckoutModal({
  route,
  passengerCount,
  onClose,
}) {
  const { user, walletBalance, completePayment, setAuthOpen } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0].id);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef(false);
  const total = route.fareNgn * passengerCount;

  function pay() {
    if (processingRef.current) return;
    setError("");
    if (!user) {
      setAuthOpen(true);
      return;
    }
    try {
      processingRef.current = true;
      setProcessing(true);
      const pass = completePayment({
        route,
        passengerCount,
        paymentMethod,
      });
      if (pass) {
        window.location.assign(`/ticket?pass=${encodeURIComponent(pass.id)}`);
      }
    } catch (paymentError) {
      setError(paymentError.message);
      processingRef.current = false;
      setProcessing(false);
    }
  }

  if (!route) return null;

  return (
    <div className="fixed inset-0 z-[1500] grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <section
        aria-labelledby="checkout-title"
        aria-modal="true"
        className="glass-panel relative my-auto w-full max-w-lg rounded-3xl p-5 sm:p-7"
        role="dialog"
      >
        <button
          type="button"
          aria-label="Close checkout"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
          Green Shuttle checkout
        </p>
        <h2 id="checkout-title" className="mt-2 pr-9 text-2xl font-semibold text-white">
          Choose how to pay
        </h2>
        <div className="mt-5 flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div>
            <p className="text-sm font-semibold text-white">{route.name}</p>
            <p className="mt-1 text-xs text-slate-400">
              {passengerCount} passenger{passengerCount === 1 ? "" : "s"} ·{" "}
              {formatMoney(route.fareNgn)} each
            </p>
          </div>
          <p className="shrink-0 text-lg font-bold text-emerald-300">
            {formatMoney(total)}
          </p>
        </div>

        <div className="mt-5 space-y-2">
          {paymentOptions.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={paymentMethod === id}
              onClick={() => setPaymentMethod(id)}
              className={`flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 text-left transition ${
                paymentMethod === id
                  ? "border-emerald-300/45 bg-emerald-300/[0.08]"
                  : "border-white/10 bg-[#0b1929]/60 hover:border-white/20"
              }`}
            >
              <Icon
                size={18}
                className={
                  paymentMethod === id ? "text-emerald-300" : "text-slate-400"
                }
              />
              <span className="flex-1 text-sm font-semibold text-white">
                {label}
              </span>
              {paymentMethod === id && (
                <Check size={16} className="text-emerald-300" />
              )}
            </button>
          ))}
        </div>

        {paymentMethod === "Abia Connect Wallet" && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-300/[0.06] px-4 py-3 text-xs">
            <span className="text-slate-400">
              Available wallet balance · {formatMoney(walletBalance)}
            </span>
            <span
              className={
                walletBalance >= total
                  ? "font-semibold text-emerald-300"
                  : "font-semibold text-rose-300"
              }
            >
              {walletBalance >= total ? "Sufficient" : "Insufficient"}
            </span>
          </div>
        )}
        {paymentMethod === "Bank Transfer" && (
          <div className="mt-4 rounded-xl border border-white/10 bg-[#0b1929]/70 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Demo virtual account · Green Shuttle
            </p>
            <p className="mt-2 font-mono text-xl tracking-[0.15em] text-white">
              012 345 6789
            </p>
            <p className="mt-1 text-xs text-slate-400">
              AbiaRide Transit · Transfer exactly {formatMoney(total)}
            </p>
            <p className="mt-2 text-[10px] text-amber-200/75">
              Demo only: no bank transfer is initiated or verified.
            </p>
          </div>
        )}
        {paymentMethod === "Debit Card / USSD" && (
          <div className="mt-4 rounded-xl border border-white/10 bg-[#0b1929]/70 p-4">
            <p className="text-sm font-semibold text-white">Mock secure payment</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Continue to simulate a successful debit-card or USSD payment of{" "}
              {formatMoney(total)}. No card details are collected.
            </p>
          </div>
        )}
        {!user && (
          <p className="mt-4 rounded-xl border border-sky-300/15 bg-sky-300/[0.06] px-3 py-2 text-xs text-sky-100">
            Sign in or use Demo Login to complete checkout.
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 rounded-xl border border-rose-300/20 bg-rose-300/[0.08] px-3 py-2 text-xs text-rose-200">
            {error}
          </p>
        )}
        <button
          type="button"
          disabled={processing}
          onClick={pay}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 text-sm font-bold text-[#062419] transition hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-60"
        >
          {paymentMethod === "Bank Transfer"
            ? "Simulate Transfer Received"
            : `Proceed to Pay ${formatMoney(total)}`}
          <ArrowRight size={16} />
        </button>
        <p className="mt-3 text-center text-[10px] text-slate-600">
          Pitch demo only · payment methods are simulated
        </p>
      </section>
    </div>
  );
}
