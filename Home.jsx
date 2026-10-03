import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BusFront,
  CreditCard,
  Minus,
  Plus,
  MapPin,
  MoveRight,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";
import CheckoutModal from "../components/CheckoutModal";
import { routes, stops } from "../data/mockData";

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function getAvailableTrips(originId, destinationId) {
  return routes.flatMap((route) => {
    const originIndex = route.stopIds.indexOf(originId);
    const destinationIndex = route.stopIds.indexOf(destinationId);

    if (originIndex < 0 || destinationIndex <= originIndex) {
      return [];
    }

    const journeyStops = route.stopIds
      .slice(originIndex, destinationIndex + 1)
      .map((stopId) => stops.find(({ id }) => id === stopId).name);

    return [{
      id: route.id,
      route,
      journeyStops,
    }];
  });
}

export default function Home() {
  const [originId, setOriginId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [searched, setSearched] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [checkoutRoute, setCheckoutRoute] = useState(null);

  const trips =
    searched && originId && destinationId
      ? getAvailableTrips(originId, destinationId)
      : [];

  function handleSearch(event) {
    event.preventDefault();
    setSelectedTripId(null);
    setPassengerCount(1);
    setSearched(true);
  }

  function handleOriginChange(event) {
    setOriginId(event.target.value);
    if (event.target.value === destinationId) {
      setDestinationId("");
    }
    setSelectedTripId(null);
    setSearched(false);
  }

  function handleDestinationChange(event) {
    setDestinationId(event.target.value);
    setSelectedTripId(null);
    setSearched(false);
  }

  return (
    <div className="min-h-screen text-slate-100">
      <Navbar />
      <main>
        <section className="relative isolate overflow-hidden">
          <div className="subtle-grid absolute inset-0 -z-10 opacity-50" />
          <div className="absolute -right-36 top-12 -z-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16 lg:py-24">
            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_#6ee7b7]" />
                Official Abia State Green Shuttle Network
              </div>
              <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl">
                Your city.
                <br />
                <span className="bg-gradient-to-r from-emerald-200 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  In motion.
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400 sm:text-lg">
                Plan journeys across Umuahia, Aba, and inter-city corridors.
                See official route fares and pay cashlessly with the Abia
                Connect Card.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#plan-ride" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-[#062419] shadow-[0_8px_28px_rgba(16,185,129,.2)] transition hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200">
                  Plan your ride <ArrowRight size={17} />
                </a>
                <a href="/map" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white">
                  Explore live map <ArrowUpRight size={16} />
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-slate-500">
                <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-emerald-300" /> Official state shuttle</span>
                <span className="inline-flex items-center gap-2"><Zap size={15} className="text-emerald-300" /> Three service areas</span>
                <span className="inline-flex items-center gap-2"><CreditCard size={15} className="text-emerald-300" /> Abia Connect Card</span>
              </div>
            </div>

            <form
              id="plan-ride"
              onSubmit={handleSearch}
              className="glass-panel relative rounded-3xl p-5 text-slate-100 sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <Search size={19} />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Plan a journey</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Search the Green Shuttle network.
                  </p>
                </div>
                <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                  {routes.length} official routes
                </span>
              </div>
              <div className="relative mt-6">
                <div className="absolute bottom-7 left-[17px] top-7 border-l border-dashed border-emerald-300/30" />
                <div className="grid gap-3">
                  <label className="relative block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <span className="mb-2 flex items-center gap-2"><MapPin size={14} className="text-emerald-300" /> From</span>
                    <select
                      required
                      value={originId}
                      onChange={handleOriginChange}
                      className="min-h-12 w-full appearance-none rounded-xl border border-white/10 bg-[#0b1929] pl-4 pr-3 text-sm font-medium normal-case tracking-normal text-slate-100 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/10"
                    >
                      <option value="" disabled>Select origin</option>
                      {stops.map((stop) => (
                        <option key={stop.id} value={stop.id}>{stop.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="relative block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <span className="mb-2 flex items-center gap-2"><MapPin size={14} className="text-rose-300" /> To</span>
                    <select
                      required
                      value={destinationId}
                      onChange={handleDestinationChange}
                      className="min-h-12 w-full appearance-none rounded-xl border border-white/10 bg-[#0b1929] pl-4 pr-3 text-sm font-medium normal-case tracking-normal text-slate-100 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/10"
                    >
                      <option value="" disabled>Select destination</option>
                      {stops
                        .filter((stop) => stop.id !== originId)
                        .map((stop) => (
                          <option key={stop.id} value={stop.id}>{stop.name}</option>
                        ))}
                    </select>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-[#062419] transition hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
              >
                Search available buses <MoveRight size={17} />
              </button>
              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <CreditCard size={13} className="text-emerald-300" /> Official fares shown · cashless with Abia Connect Card
              </p>
            </form>
          </div>
        </section>

        {searched && (
          <section
            aria-live="polite"
            className="mx-auto max-w-7xl px-4 py-10 sm:px-6"
          >
            <h2 className="text-2xl font-semibold text-white">
              {trips.length > 0 ? "Available trips" : "No trips found"}
            </h2>
            {trips.length > 0 ? (
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {trips.map((trip) => {
                  const isSelected = selectedTripId === trip.id;

                  return (
                    <article
                      key={trip.id}
                      className={`glass-panel overflow-hidden rounded-2xl border transition ${
                        isSelected
                          ? "border-emerald-300/50 ring-2 ring-emerald-300/10"
                          : "border-white/10"
                      }`}
                    >
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() =>
                          setSelectedTripId(isSelected ? null : trip.id)
                        }
                        className="block min-h-11 w-full p-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-emerald-300"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <span className="inline-flex rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                              {trip.route.area === "inter-city" ? "INTER-CITY" : trip.route.area.toUpperCase()}
                            </span>
                            <p className="mt-3 text-lg font-semibold text-white">
                              {trip.route.name}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              {trip.route.via?.length
                                ? `Via ${trip.route.via.join(" · ")}`
                                : trip.journeyStops.join(" → ")}
                            </p>
                          </div>
                          <p className="text-lg font-bold text-emerald-300">
                            <span className="block text-lg">{nairaFormatter.format(trip.route.fareNgn)}</span>
                            <span className="mt-1 block text-right text-[9px] font-semibold uppercase tracking-wider text-slate-500">Connect Card fare</span>
                          </p>
                        </div>
                        <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-sm text-slate-400">
                          <BusFront size={14} className="text-emerald-300" />
                          Abia State Green Shuttle Bus Service
                        </div>
                      </button>
                      {isSelected && (
                        <div className="border-t border-white/10 bg-black/10 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold text-slate-300">Passengers</p>
                              <p className="mt-1 text-[10px] text-slate-500">Choose 1–5 tickets</p>
                            </div>
                            <div className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b1929] p-1">
                              <button
                                type="button"
                                aria-label="Remove one passenger"
                                disabled={passengerCount <= 1}
                                onClick={() => setPassengerCount((count) => Math.max(1, count - 1))}
                                className="grid h-8 w-8 place-items-center rounded-lg text-slate-300 hover:bg-white/10 disabled:opacity-30"
                              >
                                <Minus size={14} />
                              </button>
                              <span aria-live="polite" className="min-w-4 text-center text-sm font-bold text-white">{passengerCount}</span>
                              <button
                                type="button"
                                aria-label="Add one passenger"
                                disabled={passengerCount >= 5}
                                onClick={() => setPassengerCount((count) => Math.min(5, count + 1))}
                                className="grid h-8 w-8 place-items-center rounded-lg text-emerald-300 hover:bg-white/10 disabled:opacity-30"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                          <a
                            href={`/map?route=${trip.route.id}`}
                            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                          >
                            View Route Map
                          </a>
                          <button
                            type="button"
                            onClick={() => setCheckoutRoute(trip.route)}
                            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-emerald-400 px-4 py-2 text-sm font-bold text-[#062419] hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
                          >
                            Proceed to Pay {nairaFormatter.format(trip.route.fareNgn * passengerCount)}
                          </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="mt-2 max-w-2xl text-slate-400">
                There are no direct trips for those stops yet. Try choosing
                another origin or destination.
              </p>
            )}
          </section>
        )}
      </main>
      {checkoutRoute && (
        <CheckoutModal
          route={checkoutRoute}
          passengerCount={passengerCount}
          onClose={() => setCheckoutRoute(null)}
        />
      )}
    </div>
  );
}
