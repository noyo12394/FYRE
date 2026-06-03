// QuakeQuest: Northridge 1994 — Bridge Triage (Week 1)
//
// This Week-1 module is grounded in the real 1994 Northridge earthquake
// (Mw 6.7, 4:31 a.m., Jan 17, 1994, San Fernando Valley). The four "high"
// bridges below are the documented collapses from the MCEER-98-0004 record;
// the others are realistic medium/low cases used to create honest trade-offs.
//
// IMPORTANT (Week 1 pedagogy): students see ONLY vague visual clues — no PGA,
// no fragility numbers, no HAZUS classes. The hidden fields (trueRisk, outcome,
// factors, reason, lesson) are revealed in the results briefing so we can show
// that intuition alone is a fragile basis for triage. Numbers arrive in Week 2+.

export const MAX_SELECTIONS = 5

// The dominant real-world driver behind each bridge's behavior. Students can
// tag *why* they flagged a bridge; we then compare their reasoning to reality.
export const REASON_OPTIONS = [
  { id: 'old', label: 'Looks old', emoji: '🧱' },
  { id: 'shape', label: 'Odd shape / sharp angle', emoji: '📐' },
  { id: 'epicenter', label: 'Near the epicenter', emoji: '🎯' },
  { id: 'soft', label: 'Soft / low ground', emoji: '💧' },
  { id: 'lifeline', label: 'Critical lifeline', emoji: '🚑' },
  { id: 'hunch', label: 'Just a hunch', emoji: '🤔' },
]

// Approx. epicenter on the cartoon valley map (Northridge, NW San Fernando Valley)
export const EPICENTER = { x: 30, y: 40 }

export const bridges = [
  // ---------------- DOCUMENTED COLLAPSES (high) ----------------
  {
    id: 'la-cienega-venice',
    name: 'La Cienega–Venice Undercrossing',
    route: 'I-10 · Santa Monica Fwy',
    emoji: '🛣️',
    x: 72,
    y: 84,
    rotation: -6,
    trueRisk: 'high',
    outcome: 'Collapsed',
    primaryFactor: 'shape',
    clue: 'Old concrete, sharp angle',
    factors: ['1964 design (pre-code)', 'Steep skew angle', 'Far from epicenter — shaking was only moderate'],
    reason:
      'It collapsed even though shaking here was only moderate. Its sharp skew angle and 1960s design — not strong shaking — drove the failure.',
    lesson: 'A bridge can fail far from the epicenter. Shaking alone does not tell the whole story.',
    importance: 'Major freeway artery',
  },
  {
    id: 'gavin-canyon',
    name: 'Gavin Canyon Undercrossing',
    route: 'US-101 / I-5',
    emoji: '🌉',
    x: 28,
    y: 13,
    rotation: 8,
    trueRisk: 'high',
    outcome: 'Collapsed',
    primaryFactor: 'shape',
    clue: 'Steep, sharply skewed canyon span',
    factors: ['Heavy 69° skew', 'Narrow hinge seats', 'Strong near-epicenter shaking'],
    reason:
      'A heavily skewed canyon crossing with narrow seats. Strong shaking near the source caused its spans to slide off their supports.',
    lesson: 'Unusual geometry (skew) makes a bridge much more fragile than it looks.',
    importance: 'Regional connector',
  },
  {
    id: 'newhall-interchange',
    name: 'I-5 / SR-14 Interchange',
    route: 'Newhall Pass',
    emoji: '🏗️',
    x: 41,
    y: 7,
    rotation: -4,
    trueRisk: 'high',
    outcome: 'Collapsed',
    primaryFactor: 'epicenter',
    clue: 'Tall ramps near the worst shaking',
    factors: ['Towering connector ramps', 'Near-epicenter ground motion', 'Multiple spans dropped'],
    reason:
      'The tall connector ramps at Newhall Pass sat in the zone of the strongest shaking. Several spans dropped onto the freeway below.',
    lesson: 'Tall, complex structures near the source are exposed to the most violent shaking.',
    importance: 'Critical freeway junction',
  },
  {
    id: 'mission-gothic',
    name: 'Mission–Gothic Undercrossing',
    route: 'SR-118',
    emoji: '🛤️',
    x: 49,
    y: 23,
    rotation: 5,
    trueRisk: 'high',
    outcome: 'Collapsed',
    primaryFactor: 'old',
    clue: 'Older span, never upgraded',
    factors: ['1970s design', 'No modern seismic retrofit', 'Column buckling'],
    reason:
      'An older span that had never received a modern seismic upgrade. Its columns buckled and part of the deck came down.',
    lesson: 'Retrofit history matters: un-upgraded older bridges carry hidden weakness.',
    importance: 'Valley arterial',
  },
  // ---------------- SEVERE / MEDIUM ----------------
  {
    id: 'bull-creek',
    name: 'Bull Creek Canyon Bridge',
    route: 'SR-118',
    emoji: '💧',
    x: 39,
    y: 28,
    rotation: 10,
    trueRisk: 'high',
    outcome: 'Major damage',
    primaryFactor: 'soft',
    clue: 'Sits low over soft creek ground',
    factors: ['Soft channel soils', 'Close to the epicenter', 'Ground deformation'],
    reason:
      'Built low over soft creek soils close to the epicenter. Soft ground amplifies shaking and shifts foundations.',
    lesson: 'Soft, low ground can shake far harder than firm ground nearby.',
    importance: 'Local lifeline',
  },
  {
    id: 'hospital-link',
    name: 'Valley General Hospital Link',
    route: 'I-405 ramp',
    emoji: '🏥',
    x: 60,
    y: 50,
    rotation: -7,
    trueRisk: 'medium',
    outcome: 'Minor damage',
    primaryFactor: 'lifeline',
    clue: 'The only road to the hospital',
    factors: ['Sole emergency access to the hospital', 'Looks fairly modern', 'Carries ambulances'],
    reason:
      'It is not the weakest bridge, but it is the only route ambulances use to reach the hospital — so it must be inspected early no matter what.',
    lesson: 'Importance is not always visible. Some bridges matter because of what they connect.',
    importance: 'Emergency lifeline',
  },
  {
    id: 'sepulveda-405',
    name: 'Sepulveda Pass Overcrossing',
    route: 'I-405',
    emoji: '🚗',
    x: 66,
    y: 38,
    rotation: 4,
    trueRisk: 'medium',
    outcome: 'Minor damage',
    primaryFactor: 'lifeline',
    clue: 'Always jammed with traffic',
    factors: ['Enormous daily traffic', 'A closure would gridlock the region', 'Moderately exposed'],
    reason:
      'One of the busiest crossings in the region. Even minor damage here would disrupt hundreds of thousands of trips.',
    lesson: 'Consequence is about people and traffic, not just whether a bridge falls.',
    importance: 'Regional commuter artery',
  },
  {
    id: 'reseda-overpass',
    name: 'Reseda Boulevard Overpass',
    route: 'Surface street',
    emoji: '🛍️',
    x: 33,
    y: 47,
    rotation: -3,
    trueRisk: 'medium',
    outcome: 'Moderate damage',
    primaryFactor: 'epicenter',
    clue: 'Cracks in the road nearby',
    factors: ['Very close to the epicenter', 'Visible pavement cracks', 'Newer than the collapsed spans'],
    reason:
      'Sits in a hard-hit neighborhood right by the epicenter, with cracks already showing in the streets nearby.',
    lesson: 'Visible ground damage is a real clue — but proximity matters as much as appearance.',
    importance: 'Neighborhood access',
  },
  // ---------------- LOW ----------------
  {
    id: 'santa-clarita',
    name: 'Santa Clarita Suburb Overpass',
    route: 'Local connector',
    emoji: '🏡',
    x: 71,
    y: 12,
    rotation: 6,
    trueRisk: 'low',
    outcome: 'Undamaged',
    primaryFactor: 'hunch',
    clue: 'Looks new and freshly built',
    factors: ['Modern, retrofitted design', 'Firm ground', 'Alternate routes nearby'],
    reason:
      'A modern, retrofitted overpass on firm ground with detours available. It came through fine.',
    lesson: 'Newer, upgraded bridges on firm ground are usually lower priority — but always verify.',
    importance: 'Low consequence',
  },
  {
    id: 'simi-edge',
    name: 'Simi Valley Edge Connector',
    route: 'Hillside road',
    emoji: '⛰️',
    x: 9,
    y: 30,
    rotation: -9,
    trueRisk: 'low',
    outcome: 'Undamaged',
    primaryFactor: 'hunch',
    clue: 'Small bridge on a quiet hill',
    factors: ['Solid bedrock', 'Far from the epicenter', 'Light, local traffic'],
    reason:
      'A small crossing on solid rock at the quiet valley edge, far from the strongest shaking.',
    lesson: 'Firm ground and distance from the source both reduce risk.',
    importance: 'Low consequence',
  },
]
