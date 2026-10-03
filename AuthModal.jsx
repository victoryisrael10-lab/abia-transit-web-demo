import { useState } from "react";
import { BusFront, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal() {
  const { authOpen, setAuthOpen, login } = useAuth();
  const [name, setName] = useState("");
  const [role, setRole] = useState("rider");

  if (!authOpen) return null;

  function submit(event) {
    event.preventDefault();
    login(role, name.trim());
    setName("");
  }

  return (
    <div className="fixed inset-0 z-[2000] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="presentation">
      <section
        aria-labelledby="auth-title"
        aria-modal="true"
        className="glass-panel relative w-full max-w-md rounded-3xl p-6 sm:p-8"
        role="dialog"
      >
        <button
          type="button"
          aria-label="Close login dialog"
          onClick={() => setAuthOpen(false)}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-300/10 text-emerald-300">
          <BusFront size={21} />
        </span>
        <h2 id="auth-title" className="mt-5 text-2xl font-semibold text-white">
          Welcome to AbiaRide
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Sign in or create a demo profile to book a Green Shuttle.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => login("rider")}
            className="min-h-12 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.08] px-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/15"
          >
            Demo Login as Rider
          </button>
          <button
            type="button"
            onClick={() => login("inspector")}
            className="min-h-12 rounded-xl border border-sky-300/20 bg-sky-300/[0.08] px-3 text-sm font-semibold text-sky-100 transition hover:bg-sky-300/15"
          >
            Inspector / Driver
          </button>
        </div>

        <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.14em] text-slate-600">
          <span className="h-px flex-1 bg-white/10" /> Or create a profile{" "}
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <label className="block text-xs font-semibold text-slate-300">
            Your name
            <input
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Adaeze Okafor"
              required
              className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-[#0b1929] px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-300/50"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-300">
            Demo profile
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-[#0b1929] px-3 text-sm text-white outline-none focus:border-emerald-300/50"
            >
              <option value="rider">Rider</option>
              <option value="inspector">Inspector / Driver</option>
            </select>
          </label>
          <button
            type="submit"
            className="min-h-11 w-full rounded-xl bg-emerald-400 px-4 text-sm font-bold text-[#062419] transition hover:bg-emerald-300"
          >
            Continue
          </button>
        </form>
        <p className="mt-4 text-center text-[10px] text-slate-600">
          Demo profile only. No credentials are sent to a server.
        </p>
      </section>
    </div>
  );
}
