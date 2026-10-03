import { useEffect, useRef, useState } from "react";
import {
  Activity,
  BusFront,
  CreditCard,
  LocateFixed,
  Radio,
  Route as RouteIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import greenShuttleCrest from "../assets/green-shuttle-bus.jpg";
import { paymentMethod, routeAreas, routes, stops } from "../data/mockData";

const initialRoute =
  routes.find(
    ({ id }) => id === new URLSearchParams(window.location.search).get("route"),
  ) ?? routes[0];

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function MapPage() {
  const mapElementRef = useRef(null);
  const [area, setArea] = useState(initialRoute.area);
  const [selectedRouteId, setSelectedRouteId] = useState(initialRoute.id);
  const [mapError, setMapError] = useState("");
  const selectedRoute =
    routes.find(({ id }) => id === selectedRouteId) ?? initialRoute;
  const areaRoutes = routes.filter((route) => route.area === area);
  const routeStops = selectedRoute.stopIds.map((stopId) =>
    stops.find(({ id }) => id === stopId),
  );

  function selectArea(nextArea) {
    setArea(nextArea);
    const firstRoute = routes.find((route) => route.area === nextArea);
    setSelectedRouteId(firstRoute.id);
  }

  useEffect(() => {
    let map;
    let animationFrame;
    let isCancelled = false;

    async function initializeMap() {
      try {
        const leafletModule = await import("leaflet");
        if (isCancelled || !mapElementRef.current) {
          return;
        }

        const L = leafletModule.default;
        const routeCoordinates = routeStops.map(({ lat, lng }) => [lat, lng]);

        map = L.map(mapElementRef.current, {
          scrollWheelZoom: false,
          zoomControl: false,
        }).setView(routeCoordinates[0], 13);
        L.control.zoom({ position: "bottomright" }).addTo(map);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        L.polyline(routeCoordinates, {
          color: "#087857",
          weight: 8,
          opacity: 0.2,
          lineCap: "round",
        }).addTo(map);
        L.polyline(routeCoordinates, {
          color: "#12a875",
          weight: 4,
          opacity: 0.95,
          lineCap: "round",
          dashArray: "1 10",
        }).addTo(map);

        const stopIcon = L.divIcon({
          className: "abiaride-stop-marker",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        routeStops.forEach((stop) => {
          L.marker([stop.lat, stop.lng], { icon: stopIcon })
            .addTo(map)
            .bindTooltip(stop.name, {
              permanent: true,
              direction: "top",
              offset: [0, -8],
              className: "abiaride-stop-label",
            });
        });

        const busIcon = L.divIcon({
          className: "abiaride-bus-marker",
          html: `<span aria-label="Abia State Green Shuttle"><img src="${greenShuttleCrest}" alt="" /></span>`,
          iconSize: [54, 54],
          iconAnchor: [27, 27],
        });
        const busMarker = L.marker(routeCoordinates[0], {
          icon: busIcon,
          title: "Abia State Green Shuttle Bus Service",
          zIndexOffset: 1000,
        }).addTo(map);

        map.fitBounds(L.latLngBounds(routeCoordinates).pad(0.25));

        if (routeCoordinates.length > 1) {
          const segmentDuration = 2400;
          let segmentIndex = 0;
          let direction = 1;
          let segmentStartedAt;

          function animateBus(timestamp) {
            if (isCancelled) return;
            if (segmentStartedAt === undefined) segmentStartedAt = timestamp;

            const progress = Math.min(
              (timestamp - segmentStartedAt) / segmentDuration,
              1,
            );
            const start = routeCoordinates[segmentIndex];
            const end = routeCoordinates[segmentIndex + direction];
            busMarker.setLatLng([
              start[0] + (end[0] - start[0]) * progress,
              start[1] + (end[1] - start[1]) * progress,
            ]);

            if (progress === 1) {
              segmentIndex += direction;
              if (
                segmentIndex === routeCoordinates.length - 1 ||
                segmentIndex === 0
              ) {
                direction *= -1;
              }
              segmentStartedAt = timestamp;
            }
            animationFrame = window.requestAnimationFrame(animateBus);
          }

          animationFrame = window.requestAnimationFrame(animateBus);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Unable to initialize the Green Shuttle route map.", error);
          setMapError("The route map could not be loaded. Please try again later.");
        }
      }
    }

    initializeMap();
    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(animationFrame);
      map?.remove();
    };
  }, [selectedRouteId]);

  return (
    <div className="min-h-screen text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
        <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              <Radio size={14} /> Official State Transit Network
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Green Shuttle routes
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Route and stop map · Illustrative movement, not live vehicle GPS
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/[0.08] px-3 py-2 text-xs font-semibold text-sky-200">
            <Activity size={14} /> ROUTE PREVIEW
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            aria-label="Filter routes by service area"
            className="inline-flex w-fit flex-wrap gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1"
          >
            {routeAreas.map((routeArea) => (
              <button
                key={routeArea.id}
                type="button"
                aria-pressed={area === routeArea.id}
                onClick={() => selectArea(routeArea.id)}
                className={`min-h-10 rounded-xl px-4 text-xs font-semibold transition ${
                  area === routeArea.id
                    ? "bg-emerald-400 text-[#062419]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {routeArea.name}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3 text-xs font-semibold text-slate-400">
            Select route
            <select
              value={selectedRoute.id}
              onChange={(event) => setSelectedRouteId(event.target.value)}
              className="min-h-11 min-w-60 rounded-xl border border-white/10 bg-[#0b1929] px-3 text-sm text-white outline-none focus:border-emerald-300/60"
            >
              {areaRoutes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
          <section className="glass-panel relative overflow-hidden rounded-3xl p-2">
            <div
              ref={mapElementRef}
              aria-label={`Schematic map showing the ${selectedRoute.name} Green Shuttle route and stops`}
              className="h-[55vh] min-h-80 w-full overflow-hidden rounded-[1.35rem] bg-[#dbe5e7] sm:h-[64vh]"
            />
            {mapError && (
              <p
                role="alert"
                className="absolute inset-x-5 top-5 z-[500] rounded-xl border border-red-300/20 bg-[#251923] p-4 text-sm font-medium text-red-200 shadow-xl"
              >
                {mapError}
              </p>
            )}
            <div className="pointer-events-none absolute left-5 top-5 z-[500] rounded-xl border border-white/50 bg-[#0b1929]/90 px-3 py-2 shadow-lg backdrop-blur">
              <p className="flex items-center gap-2 text-xs font-bold text-white">
                <BusFront size={15} className="text-emerald-300" />
                ABIA GREEN SHUTTLE
              </p>
              <p className="mt-1 pl-[23px] text-[10px] text-slate-400">
                {selectedRoute.name}
              </p>
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <section className="glass-panel rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Selected route
                </p>
                <RouteIcon size={16} className="text-emerald-300" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-white">
                {selectedRoute.name}
              </h2>
              <div className="my-5 h-px bg-white/10" />
              <ol className="space-y-0">
                {routeStops.map((stop, index) => (
                  <li key={stop.id} className="relative flex gap-3 pb-4 last:pb-0">
                    {index < routeStops.length - 1 && (
                      <span className="absolute bottom-0 left-[7px] top-4 border-l border-dashed border-white/15" />
                    )}
                    <span
                      className={`relative mt-1 h-4 w-4 shrink-0 rounded-full border-[3px] ${
                        index === 0
                          ? "border-emerald-300 bg-emerald-300/20"
                          : "border-slate-600 bg-[#101d2c]"
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        index === 0
                          ? "font-semibold text-white"
                          : "text-slate-400"
                      }`}
                    >
                      {stop.name}
                    </span>
                  </li>
                ))}
              </ol>
              {selectedRoute.via?.length > 0 && (
                <p className="mt-4 text-xs text-slate-500">
                  Via {selectedRoute.via.join(" · ")}
                </p>
              )}
            </section>

            <section className="glass-panel rounded-3xl p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Official route fare
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-emerald-300">
                {money.format(selectedRoute.fareNgn)}
              </p>
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] p-3">
                <CreditCard size={17} className="mt-0.5 shrink-0 text-emerald-300" />
                <p className="text-xs leading-5 text-slate-300">
                  Cashless fare with the{" "}
                  <strong className="font-semibold text-white">{paymentMethod}</strong>.
                </p>
              </div>
            </section>
          </aside>
        </div>
        <p className="mt-4 flex items-center gap-2 text-[10px] text-slate-600">
          <LocateFixed size={12} />
          Stop coordinates are approximate for this demo · Map data © OpenStreetMap contributors
        </p>
      </main>
    </div>
  );
}
