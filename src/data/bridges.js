// QuakeQuest: Bridge Triage — Lehigh Valley Earthquake Drill (Week 1)
//
// Setting: Bethlehem, Pennsylvania — home of Lehigh University. The Lehigh
// River splits the historic North Side (Moravian downtown) from the South Side
// (Lehigh University + the SteelStacks blast furnaces). Real river crossings are
// used as the playable bridges.
//
// This is a DRILL: a rare-but-possible Lehigh Valley earthquake. The "outcome"
// values are the drill's *modeled* results based on each bridge's age, type,
// ground, and importance — not a historical record. The real damage evidence we
// teach from (the 1994 Northridge collapses) appears in the debrief as history.
//
// WEEK 1 RULE: students see only vague visual clues — no magnitudes, no PGA, no
// fragility numbers. Hidden fields are revealed only in the debrief.

export const MAX_SELECTIONS = 5

export const REASON_OPTIONS = [
  { id: 'old', label: 'Looks old', emoji: '🧱' },
  { id: 'shape', label: 'Odd shape / long span', emoji: '📐' },
  { id: 'epicenter', label: 'Near the epicenter', emoji: '🎯' },
  { id: 'soft', label: 'Soft riverbank ground', emoji: '💧' },
  { id: 'lifeline', label: 'Critical lifeline', emoji: '🚑' },
  { id: 'hunch', label: 'Just a hunch', emoji: '🤔' },
]

// Drill epicenter: South Side, near the old steel works / South Mountain front.
export const EPICENTER = { x: 52, y: 71 }

export const bridges = [
  {
    id: 'hill-to-hill',
    name: 'Hill-to-Hill Bridge',
    route: 'PA-378',
    emoji: '🌉',
    x: 17,
    y: 57.5,
    rotation: -6,
    trueRisk: 'high',
    outcome: 'Major damage',
    primaryFactor: 'old',
    clue: 'Big 1920s multi-span arch',
    factors: ['Built in 1924', 'Long, complex multi-span concrete arches', 'Carries PA-378 — the main downtown lifeline'],
    reason:
      "Bethlehem's iconic 1924 bridge is large and structurally complex, and it's the primary route between the North and South Sides — both fragile and indispensable.",
    lesson: 'Old, complex, heavily-used bridges combine high fragility with high consequence.',
    importance: 'Primary downtown lifeline',
  },
  {
    id: 'minsi-trail',
    name: 'Minsi Trail Bridge',
    route: 'Stefko Blvd',
    emoji: '🏗️',
    x: 73,
    y: 48.5,
    rotation: -5,
    trueRisk: 'high',
    outcome: 'Major damage',
    primaryFactor: 'old',
    clue: 'Tall aging steel truss',
    factors: ['1950s steel truss', 'Tall, slender members', 'Older steel is fracture-prone'],
    reason:
      'A tall mid-century steel truss on the East Side. Slender older steel members are prone to buckling and fracture under strong shaking.',
    lesson: 'Tall, slender steel trusses from the mid-century are a classic seismic weak point.',
    importance: 'East-side arterial',
  },
  {
    id: 'norfolk-southern',
    name: 'Norfolk Southern Rail Bridge',
    route: 'Freight rail',
    emoji: '🚂',
    x: 58,
    y: 52,
    rotation: -4,
    trueRisk: 'high',
    outcome: 'Collapsed',
    primaryFactor: 'old',
    clue: 'Old stone railroad piers',
    factors: ['Early-1900s unreinforced masonry piers', 'Brittle stone construction', 'Soft riverbank soils'],
    reason:
      'Century-old unreinforced stone piers on soft riverbank soils. Brittle masonry has little ability to flex — exactly the kind of structure that fails first.',
    lesson: 'Unreinforced masonry is brittle: it cracks and drops rather than bending.',
    importance: 'Freight rail lifeline',
  },
  {
    id: 'route-412',
    name: 'Route 412 Overpass',
    route: 'PA-412 · South Side',
    emoji: '🛣️',
    x: 38,
    y: 71,
    rotation: 3,
    trueRisk: 'high',
    outcome: 'Collapsed',
    primaryFactor: 'soft',
    clue: 'Long ramps on soft, low-lying fill',
    factors: ['Long approach ramps', 'Saturated, soft low-lying fill', 'Right beside the epicenter'],
    reason:
      'Its long approach ramps sit on saturated, soft fill right beside the epicenter. Soft ground can lose strength and flow during strong shaking, dropping the spans.',
    lesson: 'Soft, saturated ground can liquefy — turning solid support into quicksand.',
    importance: 'Highway connector to I-78',
  },
  {
    id: 'fahy',
    name: 'Fahy Bridge',
    route: 'New Street',
    emoji: '🚗',
    x: 44,
    y: 58.5,
    rotation: -3,
    trueRisk: 'medium',
    outcome: 'Moderate damage',
    primaryFactor: 'epicenter',
    clue: 'Busy steel girder near downtown',
    factors: ['1970s steel girders', 'Very heavy daily traffic', 'Close to the epicenter'],
    reason:
      'A busy newer steel girder bridge — but it sits close to the epicenter and carries enormous downtown traffic, so even moderate damage is disruptive.',
    lesson: 'Proximity to the source and heavy use raise priority even for sturdier bridges.',
    importance: 'Downtown commuter link',
  },
  {
    id: 'st-lukes-link',
    name: "St. Luke's Hospital Link",
    route: 'Ostrum St',
    emoji: '🏥',
    x: 6,
    y: 54.5,
    rotation: 4,
    trueRisk: 'medium',
    outcome: 'Minor damage',
    primaryFactor: 'lifeline',
    clue: 'The fastest route to the hospital',
    factors: ['Sole quick route to St. Luke’s', 'Looks fairly modern', 'Carries ambulances'],
    reason:
      "It's not the weakest bridge, but it's the fastest ambulance route to St. Luke's — so it must be confirmed open early no matter how it looks.",
    lesson: 'Some bridges matter because of what they connect, not how strong they look.',
    importance: 'Emergency lifeline',
  },
  {
    id: 'freemansburg',
    name: 'Freemansburg Ave Bridge',
    route: 'Freemansburg Ave',
    emoji: '🛤️',
    x: 92,
    y: 44,
    rotation: -4,
    trueRisk: 'medium',
    outcome: 'Moderate damage',
    primaryFactor: 'old',
    clue: 'Aging east-end crossing',
    factors: ['Older design', 'Moderate traffic', 'Farther from the epicenter'],
    reason:
      'An aging crossing at the east edge of town. Older, but farther from the strongest shaking, so it fares better than the central bridges.',
    lesson: 'Age raises risk, but distance from the source lowers the shaking it receives.',
    importance: 'East-side access',
  },
  {
    id: 'sand-island',
    name: 'Sand Island Footbridge',
    route: 'Pedestrian',
    emoji: '🚶',
    x: 30,
    y: 61,
    rotation: 2,
    trueRisk: 'low',
    outcome: 'Minor damage',
    primaryFactor: 'hunch',
    clue: 'Light footbridge to the island',
    factors: ['Light pedestrian structure', 'No vehicle loads', 'Easy to detour'],
    reason:
      'A light footbridge to Sand Island. Low loads and easy detours make it a low priority for the first inspection wave.',
    lesson: 'Light, low-consequence structures can usually wait.',
    importance: 'Low consequence',
  },
  {
    id: 'monocacy-union',
    name: 'Monocacy Creek Bridge',
    route: 'Union Blvd',
    emoji: '💧',
    x: 24,
    y: 27,
    rotation: -8,
    trueRisk: 'low',
    outcome: 'Undamaged',
    primaryFactor: 'hunch',
    clue: 'Small low creek crossing',
    factors: ['Short, low span', 'Firm creek-bank rock', 'Far from the epicenter'],
    reason:
      'A short, low crossing over the Monocacy Creek on firm ground, well away from the epicenter. It came through fine.',
    lesson: 'Short spans on firm ground far from the source are usually safe.',
    importance: 'Low consequence',
  },
  {
    id: 'packer-hill',
    name: 'Packer Avenue Overpass',
    route: 'Lehigh University',
    emoji: '🎓',
    x: 82,
    y: 74,
    rotation: 3,
    trueRisk: 'low',
    outcome: 'Undamaged',
    primaryFactor: 'hunch',
    clue: 'Newer span up on the hillside',
    factors: ['Modern, retrofitted design', 'Founded on firm South Mountain rock', 'Alternate campus routes'],
    reason:
      'A modern, retrofitted overpass up on the firm rock of South Mountain. Good design plus solid ground equals low risk.',
    lesson: 'Modern design on bedrock is the best-case combination.',
    importance: 'Campus access',
  },
]
