const engine = require("./src/assets/js/itinerary-engine.js");
const assert = require("assert");

function say(label, ok) {
  console.log((ok ? "OK   " : "FAIL ") + label);
  if (!ok) process.exitCode = 1;
}

// --- Jeu de fiches synthétique : 3 lieux proches (Périgord) + 2 lieux
// très éloignés (Bretagne, Provence) + 1 lieu "trop long" pour tenir
// dans une journée standard.
const fiches = [
  { id: "a", title: "Château A", status: "verifie", themes: ["patrimoine"], region: "naquitaine", coords: { lat: 44.85, lon: 0.5 }, visitDurationMin: 90, votes: 5 },
  { id: "b", title: "Grotte B", status: "verifie", themes: ["nature"], region: "naquitaine", coords: { lat: 44.86, lon: 0.55 }, visitDurationMin: 60, votes: 3 },
  { id: "c", title: "Village C", status: "verifie", themes: ["patrimoine"], region: "naquitaine", coords: { lat: 44.9, lon: 0.6 }, visitDurationMin: 120, votes: 8 },
  { id: "d", title: "Phare D (Bretagne)", status: "verifie", themes: ["nature"], region: "bretagne", coords: { lat: 48.4, lon: -4.5 }, visitDurationMin: 60, votes: 1 },
  { id: "e", title: "Calanque E (Provence)", status: "verifie", themes: ["nature"], region: "paca", coords: { lat: 43.2, lon: 5.4 }, visitDurationMin: 60, votes: 1 },
  { id: "f", title: "Fiche trop longue", status: "verifie", themes: ["patrimoine"], region: "naquitaine", coords: { lat: 44.87, lon: 0.52 }, visitDurationMin: 600, votes: 0 },
  { id: "g", title: "Fiche brouillon", status: "brouillon", themes: ["patrimoine"], region: "naquitaine", coords: { lat: 44.87, lon: 0.52 }, visitDurationMin: 60, votes: 99 },
];

// Test 1 : demande de 3 jours, pace standard (6h/j). Les lieux proches
// (a,b,c) doivent se regrouper sur un même jour ; d et e (à des centaines
// de km) ne doivent JAMAIS être mélangés dans la même journée que a/b/c.
{
  const plan = engine.planItinerary(fiches, { days: 3, pace: "standard" }, {});
  say("plan ok", plan.ok === true);
  say("statut brouillon jamais inclus", plan.days.every((day) => day.stops.every((s) => s.ficheId !== "g")));
  say("fiche trop longue exclue et signalée", plan.tooLongFicheIds.includes("f"));

  const allIds = plan.days.flatMap((d) => d.stops.map((s) => s.ficheId));
  say("aucun lieu utilisé deux fois", new Set(allIds).size === allIds.length);

  // Bretagne et Provence ne doivent pas être sur le même jour qu'un lieu du Périgord
  plan.days.forEach((day) => {
    const ids = day.stops.map((s) => s.ficheId);
    const hasPerigord = ids.some((id) => ["a", "b", "c"].includes(id));
    const hasFar = ids.some((id) => ["d", "e"].includes(id));
    say(`jour ${day.dayIndex} ne mélange pas Périgord et lieux lointains`, !(hasPerigord && hasFar));
  });

  console.log(JSON.stringify(plan, null, 2));
}

// Test 2 : aucun candidat (thème inexistant) -> réponse honnête, pas de crash.
{
  const plan = engine.planItinerary(fiches, { days: 3, pace: "standard", themes: ["inexistant"] }, {});
  say("aucun candidat -> ok:false proprement", plan.ok === false && plan.reason === "no_candidates");
}

// Test 3 : pace "détendu" (4h/j) doit produire des journées plus courtes
// (moins d'arrêts ou plus de jours) qu'un pace "intensif" (8h/j) pour le
// même jeu de données.
{
  const relaxed = engine.planItinerary(fiches, { days: 5, pace: "detendu", regions: ["naquitaine"] }, {});
  const intense = engine.planItinerary(fiches, { days: 5, pace: "intensif", regions: ["naquitaine"] }, {});
  const relaxedStops = relaxed.days.reduce((s, d) => s + d.stops.length, 0);
  const intenseStops = intense.days.reduce((s, d) => s + d.stops.length, 0);
  say("intensif n'inclut jamais moins de lieux que détendu (à offre égale)", intenseStops >= relaxedStops);
}

// Test 4 : demande de 1 seul jour ne doit jamais renvoyer 2 jours.
{
  const plan = engine.planItinerary(fiches, { days: 1, pace: "intensif", regions: ["naquitaine"] }, {});
  say("1 jour demandé -> au plus 1 jour renvoyé", plan.days.length <= 1);
}

// Test 5 : recomputeTimes ne réordonne pas manuellement, recalcule juste.
{
  const ficheById = Object.fromEntries(fiches.map((f) => [f.id, f]));
  const manual = [{ stops: [{ ficheId: "c" }, { ficheId: "a" }, { ficheId: "b" }] }];
  const recomputed = engine.recomputeTimes(manual, ficheById, {});
  const order = recomputed[0].stops.map((s) => s.ficheId);
  say("recomputeTimes conserve l'ordre manuel (c,a,b)", JSON.stringify(order) === JSON.stringify(["c", "a", "b"]));
  say("recomputeTimes calcule des temps > 0", recomputed[0].totalTravelMin > 0 && recomputed[0].totalVisitMin > 0);
}

console.log(process.exitCode ? "\n--- DES TESTS ONT ECHOUE ---" : "\n--- TOUS LES TESTS PASSENT ---");
