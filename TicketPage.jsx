import { useRef } from "react";
import {
  ArrowDownToLine,
  BadgeCheck,
  BusFront,
  CreditCard,
  MapPin,
  QrCode,
  TicketCheck,
  UserRound,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "../components/Navbar";
import greenShuttleCrest from "../assets/green-shuttle-bus.jpg";
import { useAuth } from "../context/AuthContext";
import { demoTicket, operator, paymentMethod, routes, stops } from "../data/mockData";

const money = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

function saveTicketOffline(qrCodeRef, pass, ticketRoute, ticketStops) {
  const qrCode = qrCodeRef.current?.outerHTML;
  if (!qrCode) {
    throw new Error("Ticket QR code is not available for download.");
  }

  const ticketHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Abia Green Shuttle Pass ${pass.reference}</title>
<style>*{box-sizing:border-box}body{font:15px Arial,sans-serif;color:#142234;background:#edf2f3;margin:0;padding:32px 16px}main{max-width:620px;margin:auto;background:white;border:1px solid #dce5e7;border-radius:22px;overflow:hidden}header{background:linear-gradient(135deg,#092b27,#087857);color:white;padding:28px}.brand{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#a7f3d0;font-weight:bold}h1{font-size:25px;margin:22px 0 8px}.route{color:#d1fae5}dl{display:grid;grid-template-columns:1fr 1fr;gap:22px 16px;padding:28px;margin:0}dt{color:#718096;font-size:10px;text-transform:uppercase;font-weight:bold}dd{margin:6px 0 0;font-weight:bold}.cut{border-top:2px dashed #d5dfe2;margin:0 28px}.qr{text-align:center;padding:24px}.qr svg{max-width:100%;height:auto}.id{font:12px monospace;color:#526273;margin-top:12px}footer{text-align:center;color:#718096;border-top:1px solid #e6ecee;padding:16px;font-size:11px}</style></head>
<body><main><header><span class="brand">Abia State Green Shuttle · Digital pass</span><h1>${ticketRoute.name}</h1><p class="route">${operator.name}</p><strong>PAID · ${pass.paymentMethod}</strong></header>
<dl><div><dt>Ticket holder</dt><dd>${escapeHtml(pass.holderName)}</dd></div><div><dt>Passenger ID</dt><dd>${escapeHtml(pass.passengerId)}</dd></div><div><dt>Passengers</dt><dd>${pass.passengerCount}</dd></div><div><dt>Total paid</dt><dd>${money(pass.totalPaid)}</dd></div><div><dt>Boarding</dt><dd>${ticketStops[0]}</dd></div><div><dt>Destination</dt><dd>${ticketStops[ticketStops.length - 1]}</dd></div><div><dt>Payment method</dt><dd>${escapeHtml(pass.paymentMethod)}</dd></div><div><dt>Transaction reference</dt><dd>${escapeHtml(pass.reference)}</dd></div></dl><div class="cut"></div><div class="qr">${qrCode}<div class="id">${escapeHtml(pass.reference)}</div><p>Present this paid pass to the inspector</p></div><footer>Abia State Green Shuttle Bus Service · Demo transaction</footer></main></body></html>`;
  const ticketFile = new Blob([ticketHtml], { type: "text/html;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(ticketFile);
  const downloadLink = document.createElement("a");
  downloadLink.href = downloadUrl;
  downloadLink.download = `${pass.reference}.html`;
  downloadLink.click();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
}

export default function TicketPage() {
  const qrCodeRef = useRef(null);
  const { user, walletBalance, passes, setAuthOpen } = useAuth();
  const query = new URLSearchParams(window.location.search);
  const requestedPass = query.get("pass");
  const requestedRoute = routes.find(({ id }) => id === query.get("route"));
  const pass =
    passes.find(({ id }) => id === requestedPass) ??
    passes[0] ??
    (requestedRoute
      ? {
          id: "preview",
          routeId: requestedRoute.id,
          routeName: requestedRoute.name,
          holderName: user?.name ?? demoTicket.passengerName,
          passengerId: user?.passengerId ?? "Sign in to view your Passenger ID",
          passengerCount: 1,
          totalPaid: requestedRoute.fareNgn,
          reference: demoTicket.ticketId,
          paymentMethod: "Preview only",
          status: "preview",
        }
      : null);
  const route = routes.find(({ id }) => id === pass?.routeId);

  if (!pass || !route) {
    return (
      <div className="min-h-screen text-slate-100">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-300">
            <TicketCheck size={25} />
          </span>
          <h1 className="mt-5 text-3xl font-semibold text-white">Your digital passes</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Paid Green Shuttle tickets appear here after checkout.
          </p>
          {!user && (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="mt-5 rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200"
            >
              Demo Login
            </button>
          )}
          <a href="/" className="mx-auto mt-5 flex min-h-11 w-fit items-center rounded-xl bg-emerald-400 px-5 text-sm font-bold text-[#062419]">
            Browse Green Shuttle routes
          </a>
        </main>
      </div>
    );
  }

  const routeStops = route.stopIds.map((stopId) =>
    stops.find(({ id }) => id === stopId).name,
  );
  const isPaid = pass.status === "paid";
  const qrValue = JSON.stringify({
    reference: pass.reference,
    routeId: pass.routeId,
    holderName: pass.holderName,
    holderAvatar: pass.holderAvatar,
    passengerId: pass.passengerId,
    passengerCount: pass.passengerCount,
    totalPaid: pass.totalPaid,
    paymentMethod: pass.paymentMethod,
    status: pass.status,
  });

  return (
    <div className="min-h-screen text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200">
            <TicketCheck size={13} /> {isPaid ? "Paid · ready to board" : "Preview · not paid"}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Digital boarding pass
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Passenger details and payment reference are encoded in this pass.
          </p>
        </div>

        <article className="glass-panel mx-auto grid max-w-4xl overflow-hidden rounded-3xl lg:grid-cols-[1fr_300px]">
          <div>
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0e483b] via-[#0c6650] to-[#0b3b3c] px-6 py-7 text-white sm:px-9 sm:py-9">
              <div className="subtle-grid absolute inset-0 opacity-30" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/10">
                    <img src={greenShuttleCrest} alt="Abia State coat of arms" className="h-8 w-8 rounded-full object-contain" />
                  </span>
                  <div>
                    <p className="text-sm font-bold tracking-wide">Abia Green Shuttle</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-emerald-100/70">{operator.name}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100/20 bg-emerald-100/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-50">
                  <BadgeCheck size={13} /> {isPaid ? "Paid" : "Preview"}
                </span>
              </div>
              <div className="relative mt-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100/65">Your route</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{pass.routeName}</h2>
                <div className="mt-4 flex items-center gap-2 text-xs text-emerald-50/75">
                  <MapPin size={14} /> {routeStops[0]} <span>→</span> {routeStops[routeStops.length - 1]}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-6 py-7 sm:grid-cols-3 sm:px-9">
              <div>
                <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500"><UserRound size={12} /> Ticket holder</p>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-white">
                  <span aria-label="Profile avatar" className="grid h-6 w-6 place-items-center rounded-full bg-emerald-300/15 text-[9px] font-bold text-emerald-200">
                    {pass.holderAvatar ?? pass.holderName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                  {pass.holderName}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">Passenger ID</p>
                <p className="mt-2 text-sm font-semibold text-white">{pass.passengerId}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">Passengers</p>
                <p className="mt-2 text-sm font-semibold text-white">{pass.passengerCount}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500"><CreditCard size={12} /> Payment</p>
                <p className="mt-2 text-sm font-semibold text-white">{pass.paymentMethod}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">Total paid</p>
                <p className="mt-2 text-sm font-semibold text-emerald-300">{money(pass.totalPaid)}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">Wallet balance</p>
                <p className="mt-2 text-sm font-semibold text-white">{money(walletBalance)}</p>
              </div>
            </div>
            <div className="border-t border-dashed border-white/15 px-6 py-5 sm:px-9">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">Transaction reference</p>
              <p className="mt-1 font-mono text-sm tracking-[0.12em] text-slate-200">{pass.reference}</p>
            </div>
          </div>
          <aside className="flex flex-col items-center justify-center border-t border-white/10 bg-[#091725]/70 px-6 py-7 text-center lg:border-l lg:border-t-0">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-300">
              <QrCode size={15} className="text-emerald-300" /> {isPaid ? "Inspector scan code" : "Preview QR code"}
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-[0_14px_36px_rgba(0,0,0,.3)]">
              <QRCodeSVG ref={qrCodeRef} value={qrValue} size={176} level="M" fgColor="#102233" title={`QR code for ${pass.holderName}`} />
            </div>
            <p className="mt-3 font-mono text-[10px] tracking-[0.12em] text-slate-500">{pass.reference}</p>
            <p className="mt-4 max-w-52 text-xs leading-5 text-slate-500">Show the QR code to an inspector when boarding.</p>
            {isPaid ? (
              <>
                <button
                  type="button"
                  onClick={() => saveTicketOffline(qrCodeRef, pass, route, routeStops)}
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 text-xs font-bold text-[#062419] hover:bg-emerald-300"
                >
                  <ArrowDownToLine size={15} /> Save pass offline
                </button>
                <a href="/inspector" className="mt-3 text-xs font-semibold text-emerald-200 underline underline-offset-4">Open Inspector Mode</a>
              </>
            ) : (
              <p className="mt-5 rounded-xl border border-amber-300/15 bg-amber-300/[0.06] p-3 text-[10px] leading-5 text-amber-100">
                This is a preview. Complete checkout to create a paid pass for inspector verification.
              </p>
            )}
          </aside>
        </article>
      </main>
    </div>
  );
}
