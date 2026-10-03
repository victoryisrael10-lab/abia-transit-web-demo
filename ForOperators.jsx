import { ArrowUpRight, BusFront, CreditCard } from "lucide-react";
import Navbar from "../components/Navbar";
import { paymentMethod, routeAreas, routes } from "../data/mockData";

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function ForOperators() {
  return (
    <div className="min-h-screen text-slate-100">
      <Navbar />
      <main>
        <section className="relative isolate overflow-hidden">
          <div className="subtle-grid absolute inset-0 -z-10 opacity-50" />
          <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-20">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
              <BusFront size={22} />
            </span>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Official state transit
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Abia State Green Shuttle Bus Service
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              One shuttle network for city journeys and inter-city connections
              across Abia State.
            </p>
            <a
              href="/map"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3 font-bold text-[#062419] transition hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
            >
              Explore routes <ArrowUpRight size={16} />
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="glass-panel flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:p-7">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-300/10 text-emerald-300">
              <CreditCard size={20} />
            </span>
            <div>
              <h2 className="font-semibold text-white">
                Cashless fares with {paymentMethod}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Fares shown are the route amounts supplied for this network.
                Use the Abia Connect Card for cashless payment.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {routeAreas.map((area) => {
              const areaRoutes = routes.filter(
                (route) => route.area === area.id,
              );

              return (
                <article key={area.id} className="glass-panel rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-white">
                      {area.name}
                    </h2>
                    <span className="rounded-full border border-emerald-300/15 bg-emerald-300/10 px-2.5 py-1 text-[10px] font-bold text-emerald-200">
                      {areaRoutes.length} routes
                    </span>
                  </div>
                  <ul className="mt-4 divide-y divide-white/10">
                    {areaRoutes.map((route) => (
                      <li
                        key={route.id}
                        className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <a
                          href={`/map?route=${route.id}`}
                          className="text-sm font-medium text-slate-300 transition hover:text-emerald-200"
                        >
                          {route.name}
                          {route.via?.length > 0 && (
                            <span className="mt-1 block text-xs font-normal text-slate-500">
                              Via {route.via.join(" · ")}
                            </span>
                          )}
                        </a>
                        <span className="shrink-0 text-sm font-semibold text-emerald-300">
                          {money.format(route.fareNgn)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
