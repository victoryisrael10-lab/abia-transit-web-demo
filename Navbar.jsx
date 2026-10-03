import {
  ArrowUpRight,
  BusFront,
  CreditCard,
  Info,
  LogOut,
  Map,
  Ticket,
} from "lucide-react";
import greenShuttleCrest from "../assets/green-shuttle-bus.jpg";
import { useAuth } from "../context/AuthContext";

const navigationLinks = [
  { label: "Home", href: "/", Icon: BusFront },
  { label: "Live Map", href: "/map", Icon: Map },
  { label: "E-Ticket", href: "/ticket", Icon: Ticket },
  { label: "Wallet", href: "/wallet", Icon: CreditCard },
  { label: "Service & fares", href: "/for-operators", Icon: Info },
];

export default function Navbar() {
  const { user, walletBalance, logout, setAuthOpen } = useAuth();
  const currentPath = window.location.pathname;
  const isInspector = currentPath === "/inspector";

  return (
    <header className="sticky top-0 z-[1000] border-b border-white/10 bg-[#07111f]/80 text-slate-200 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6"
      >
        <a
          href="/"
          className="group inline-flex min-h-11 items-center gap-3"
          aria-label="Abia Green Shuttle home"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,.12)]">
            <img
              src={greenShuttleCrest}
              alt=""
              className="h-8 w-8 rounded-full object-contain"
            />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-tight text-white">
              Abia <span className="text-emerald-300">Green Shuttle</span>
            </span>
            <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              State transit service
            </span>
          </span>
        </a>
        <ul className="flex flex-wrap items-center gap-1">
          {navigationLinks.map(({ label, href, Icon }) => {
            const isCurrent = currentPath === href;

            return (
              <li key={href}>
                <a
                  href={href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 ${
                    isCurrent
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <Icon size={15} aria-hidden="true" />
                  <span>{label}</span>
                  {isCurrent && (
                    <ArrowUpRight
                      size={13}
                      className="text-emerald-300"
                      aria-hidden="true"
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={isInspector ? "/" : "/inspector"}
            aria-pressed={isInspector}
            className={`inline-flex min-h-9 items-center gap-2 rounded-xl border px-3 text-[11px] font-semibold transition ${
              isInspector
                ? "border-amber-300/30 bg-amber-300/10 text-amber-100"
                : "border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isInspector ? "bg-amber-300" : "bg-slate-600"}`} />
            {isInspector ? "Inspector mode · On" : "Inspector mode · Off"}
          </a>
          {user ? (
            <div className="flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-300/15 text-[10px] font-bold text-emerald-200">
                {user.avatar}
              </span>
              <span className="hidden max-w-36 lg:block">
                <span className="block max-w-36 truncate text-xs font-semibold text-white">
                  {user.name}
                </span>
                <span className="block max-w-36 truncate text-[9px] text-slate-500">
                  {user.passengerId}
                </span>
              </span>
              <a
                href="/wallet"
                className="text-[10px] font-semibold text-emerald-300 hover:text-emerald-200"
                aria-label={`Wallet balance ${walletBalance} naira`}
              >
                ₦{walletBalance.toLocaleString("en-NG")}
              </a>
              <button
                type="button"
                onClick={logout}
                aria-label="Log out"
                title="Log out"
                className="grid h-7 w-7 place-items-center rounded-lg text-slate-500 transition hover:bg-white/10 hover:text-white"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="min-h-10 rounded-xl bg-emerald-400 px-3 text-xs font-bold text-[#062419] hover:bg-emerald-300"
            >
              Log in
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
