export const operators = [
  {
    id: "abia-green-shuttle",
    name: "Abia State Green Shuttle Bus Service",
    serviceType: "State city and inter-city shuttle",
    badge: "Abia Green Shuttle",
  },
];

export const operator = operators[0];

export const stops = [
  { id: "aba", name: "Aba", area: "aba", lat: 5.1167, lng: 7.3667 },
  { id: "umuahia", name: "Umuahia", area: "umuahia", lat: 5.5252, lng: 7.4908 },
  { id: "ohafia", name: "Ohafia", area: "inter-city", lat: 5.6146, lng: 7.8241 },
  { id: "ubakala", name: "Ubakala", area: "umuahia", lat: 5.4776, lng: 7.4869 },
  { id: "isi-gate", name: "Isi Gate", area: "umuahia", lat: 5.5252, lng: 7.4908 },
  { id: "tower", name: "Tower", area: "umuahia", lat: 5.5247, lng: 7.5012 },
  { id: "secretariat-jac", name: "Secretariat / JAC", area: "umuahia", lat: 5.5264, lng: 7.5086 },
  { id: "mouau", name: "MOUAU", area: "umuahia", lat: 5.4728, lng: 7.5519 },
  { id: "osisioma", name: "Osisioma", area: "aba", lat: 5.1268, lng: 7.3406 },
  { id: "zonal-board", name: "Zonal Board", area: "aba", lat: 5.1197, lng: 7.3594 },
  { id: "bata", name: "Bata", area: "aba", lat: 5.1128, lng: 7.3608 },
  { id: "opopo", name: "Opopo", area: "aba", lat: 5.1224, lng: 7.3729 },
  { id: "park", name: "Park", area: "aba", lat: 5.1089, lng: 7.3675 },
  { id: "uratta", name: "Uratta", area: "aba", lat: 5.1181, lng: 7.3812 },
  { id: "ohabiam", name: "Ohabiam", area: "aba", lat: 5.1039, lng: 7.3861 },
  { id: "flyover", name: "Flyover", area: "aba", lat: 5.1098, lng: 7.3778 },
];

export const routes = [
  {
    id: "aba-umuahia",
    name: "Aba – Umuahia",
    area: "inter-city",
    stopIds: ["aba", "umuahia"],
    fareNgn: 800,
  },
  {
    id: "umuahia-ohafia",
    name: "Umuahia – Ohafia",
    area: "inter-city",
    stopIds: ["umuahia", "ohafia"],
    fareNgn: 1000,
  },
  {
    id: "ubakala-isi-gate",
    name: "Ubakala to Isi Gate",
    area: "umuahia",
    stopIds: ["ubakala", "isi-gate"],
    fareNgn: 150,
  },
  {
    id: "isi-gate-tower",
    name: "Isi Gate to Tower",
    area: "umuahia",
    stopIds: ["isi-gate", "tower"],
    fareNgn: 150,
  },
  {
    id: "isi-gate-secretariat-jac",
    name: "Isi Gate to Secretariat / JAC",
    area: "umuahia",
    stopIds: ["isi-gate", "secretariat-jac"],
    fareNgn: 150,
  },
  {
    id: "isi-gate-mouau",
    name: "Isi Gate to MOUAU",
    area: "umuahia",
    stopIds: ["isi-gate", "mouau"],
    fareNgn: 150,
  },
  {
    id: "osisioma-park",
    name: "Osisioma to Park",
    area: "aba",
    stopIds: ["osisioma", "zonal-board", "bata", "park"],
    via: ["Zonal Board", "Bata"],
    fareNgn: 150,
  },
  {
    id: "opopo-park",
    name: "Opopo to Park",
    area: "aba",
    stopIds: ["opopo", "park"],
    fareNgn: 150,
  },
  {
    id: "park-flyover",
    name: "Park to Flyover",
    area: "aba",
    stopIds: ["park", "uratta", "ohabiam", "flyover"],
    via: ["Uratta", "Ohabiam"],
    fareNgn: 150,
  },
  {
    id: "flyover-osisioma",
    name: "Flyover to Osisioma",
    area: "aba",
    stopIds: ["flyover", "osisioma"],
    fareNgn: 150,
  },
];

export const routeAreas = [
  { id: "umuahia", name: "Umuahia" },
  { id: "aba", name: "Aba" },
  { id: "inter-city", name: "Inter-city" },
];

export const paymentMethod = "Abia Connect Card";

export const demoTicket = {
  passengerName: "Adaeze Okafor",
  routeId: "isi-gate-secretariat-jac",
  departureTime: "Check operator timetable",
  status: "Demo",
  ticketId: "ABR-UMU-2026-0042",
};
