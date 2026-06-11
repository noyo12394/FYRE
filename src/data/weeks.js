// Per-week content for the QuakeQuest course arc. Each week reuses the same
// Bethlehem map and bridge truth, but reveals one more layer of evidence and
// reframes the briefing + debrief around it. Week 1 is pure visual hunch;
// Week 2 unlocks the shaking-intensity map.
//
// `revealsShaking` toggles the Week-2 heat overlay, the per-bridge shaking
// chips, and the shaking-aware debrief copy.

export const WEEKS = [
  {
    id: 1,
    label: 'Week 1',
    name: 'Bridge Triage',
    eyebrow: 'Catastrophe Modeling · Week 1 Field Module',
    subtitle: 'Lehigh Valley Earthquake Drill · Bethlehem, PA',
    tagline: 'Decide with your eyes',
    revealsShaking: false,
    story: {
      alert:
        'a rare but possible earthquake has just struck the Lehigh Valley, with its epicenter under the South Side of Bethlehem. 🏭〰️',
      role:
        "You're the resilience planner in the city's Emergency Operations Center. The Lehigh River splits the city, and every crossing matters — but you have no engineering data yet, only the map.",
      call:
        'which river bridges get an inspection crew first? Hover each one for a field note, then flag it and tell us why. 🔍🌉',
      hint:
        '⚠️ The ground shook hardest near the glowing epicenter — but as you\'ll learn, shaking is only one clue among many.',
    },
    brief:
      'Flag up to {MAX} bridges for the first inspection wave. For each, tell us why — your reasoning gets scored too. 🧠',
    lessonTitle: '📘 Week 1 Lesson',
    lesson:
      'Early disaster decisions are made with incomplete information. Visual clues help, but they can mislead — and the bridges that matter most aren\'t always the ones that look worst. Catastrophe modeling lets us add better layers of evidence, one week at a time.',
    insights: [
      {
        icon: '🎭',
        title: 'Looks can deceive.',
        body: 'The La Cienega–Venice bridge collapsed under only moderate shaking — its 1960s design and sharp angle, not strong ground motion, brought it down. A shaking map alone would have under-rated it.',
      },
      {
        icon: '💸',
        title: 'A few failures dominate.',
        body: 'Just 6 bridges collapsed out of 3,500+ (~0.17%) — yet they caused about 69% of all bridge repair costs. Predicting which failures matter most is its own skill.',
      },
      {
        icon: '🚑',
        title: 'Importance is invisible.',
        body: "The hospital link wasn't the weakest bridge — but it was the only route for ambulances. Consequence is not the same as fragility.",
      },
    ],
    teaser: {
      emoji: '🔓',
      text: "Next week, you'll unlock the real shaking-intensity map — and start replacing hunches with data.",
    },
  },
  {
    id: 2,
    label: 'Week 2',
    name: 'Shaking Intensity Map',
    eyebrow: 'Catastrophe Modeling · Week 2 Field Module',
    subtitle: 'Shaking-Intensity Layer · Bethlehem, PA',
    tagline: 'How hard did it shake?',
    revealsShaking: true,
    story: {
      alert:
        'the aftershock data is in. Seismometers across the Valley have mapped how hard the ground actually shook — now overlaid on your map as a color heat field. 📳🌡️',
      role:
        "You're still the planner in the Emergency Operations Center, but this week you have a real ground-motion layer. Redder ground shook harder; each crossing now carries its measured shaking.",
      call:
        're-triage the valley with this new evidence. Flag the 5 crossings you would inspect first now — and watch for surprises the heatmap can\'t see. 🔍🌉',
      hint:
        '⚠️ Shaking is the single strongest clue — but a weak or oddly-shaped bridge can still fail in moderate shaking, and a modern one can ride out a strong jolt.',
    },
    brief:
      'You now have the shaking-intensity map. Flag up to {MAX} bridges — but remember last week\'s twist: shaking is the strongest clue, not the only one. 📳',
    lessonTitle: '📘 Week 2 Lesson',
    lesson:
      'Shaking intensity is the most powerful single predictor of damage — but not a perfect one. An old or oddly-shaped bridge can fail in only moderate shaking, while a modern bridge on bedrock can ride out a strong jolt. Next you\'ll add each bridge\'s own vulnerability: age, material, and span type.',
    insights: [
      {
        icon: '📳',
        title: 'Shaking explains a lot — but not all.',
        body: 'In Northridge, ground-motion maps correctly flagged most of the heavy damage. Yet several collapses sat in only moderate-shaking zones — the map alone would have passed them over.',
      },
      {
        icon: '🏗️',
        title: 'Fragility hides under the heatmap.',
        body: 'A 1950s steel truss in moderate shaking can fare worse than a retrofitted span in strong shaking. Age, material, and design decide who survives the same jolt.',
      },
      {
        icon: '⛰️',
        title: 'The ground changes the shaking.',
        body: 'Soft riverbank soil amplifies motion; solid bedrock damps it. Two bridges the same distance from the epicenter can feel very different earthquakes.',
      },
    ],
    teaser: {
      emoji: '🔓',
      text: 'Next week: the bridge inventory — age, material, and span type. You\'ll learn why two bridges in identical shaking can meet very different fates.',
    },
  },
]

export const FIRST_WEEK = WEEKS[0].id
export const LAST_WEEK = WEEKS[WEEKS.length - 1].id

export function getWeek(id) {
  return WEEKS.find((w) => w.id === id) || WEEKS[0]
}
