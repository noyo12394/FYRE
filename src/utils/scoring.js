// Shared scenario scoring — used by the results debrief and by the
// response payload sent to the instructor's collection backend.

export function scoreSelection(bridges, selectedIds, reasons) {
  const selected = [...new Set(selectedIds)]
    .map((id) => bridges.find((b) => b.id === id))
    .filter(Boolean)
  const highSelected = selected.filter((b) => b.trueRisk === 'high')
  const mediumSelected = selected.filter((b) => b.trueRisk === 'medium')
  const collapsesCaught = selected.filter((b) => b.outcome === 'Collapsed')
  const missedCollapses = bridges.filter(
    (b) => b.outcome === 'Collapsed' && !selectedIds.includes(b.id),
  )
  const missedHigh = bridges.filter(
    (b) => b.trueRisk === 'high' && !selectedIds.includes(b.id),
  )
  const reasoningHits = highSelected.filter(
    (b) => (reasons[b.id] || 'hunch') === b.primaryFactor,
  )
  const totalCollapses = bridges.filter((b) => b.outcome === 'Collapsed').length
  const totalHigh = bridges.filter((b) => b.trueRisk === 'high').length

  const points =
    highSelected.length * 2 + mediumSelected.length + reasoningHits.length

  let label
  if (collapsesCaught.length >= 3 && missedCollapses.length <= 1) {
    label = 'Sharp triage instincts! 🌟'
  } else if (points >= 6) {
    label = 'Strong start, planner! 💪'
  } else if (points >= 3) {
    label = 'Solid first read. 📈'
  } else if (points >= 1) {
    label = 'A start — real data will sharpen this. 🔍'
  } else {
    label = 'The valley needs a closer look! 🧭'
  }

  return {
    selected,
    highSelected,
    mediumSelected,
    collapsesCaught,
    missedCollapses,
    missedHigh,
    reasoningHits,
    totalCollapses,
    totalHigh,
    label,
  }
}

export function scoreMission(bridges, selectedIds, reasons) {
  const score = scoreSelection(bridges, selectedIds, reasons)
  const hospitalPriority = selectedIds.indexOf('st-lukes-link')
  const lifelineProtected = hospitalPriority >= 0 && hospitalPriority < 3
  const urgentDispatch = score.collapsesCaught.some(
    (bridge) => selectedIds.indexOf(bridge.id) < 2,
  )
  const rubric = [
    {
      name: 'Collapsed bridges caught',
      earned: score.collapsesCaught.length * 20,
      max: 40,
    },
    {
      name: 'High-risk crossings flagged',
      earned: score.highSelected.length * 5,
      max: 20,
    },
    {
      name: 'Primary vulnerability identified',
      earned: score.reasoningHits.length * 5,
      max: 20,
    },
    {
      name: 'Hospital link in the first three',
      earned: lifelineProtected ? 10 : 0,
      max: 10,
    },
    {
      name: 'A collapsed bridge in the first two',
      earned: urgentDispatch ? 10 : 0,
      max: 10,
    },
  ]
  const points = rubric.reduce((sum, item) => sum + item.earned, 0)
  const badges = [
    ...(score.collapsesCaught.length === score.totalCollapses
      ? [
          {
            name: 'Damage Detective',
            emoji: '🔎',
            detail: 'Caught both modeled collapses',
          },
        ]
      : []),
    ...(score.reasoningHits.length >= 3
      ? [
          {
            name: 'Evidence Builder',
            emoji: '🧠',
            detail: 'Matched at least three primary vulnerabilities',
          },
        ]
      : []),
    ...(lifelineProtected
      ? [
          {
            name: 'Lifeline Guardian',
            emoji: '🚑',
            detail: 'Prioritized the hospital connection',
          },
        ]
      : []),
    ...(points >= 90
      ? [
          {
            name: 'Mission Commander',
            emoji: '🏅',
            detail: 'Earned 90 or more scenario points',
          },
        ]
      : []),
  ]
  return {
    ...score,
    points,
    rubric,
    badges,
    lifelineProtected,
    urgentDispatch,
    label:
      points >= 90
        ? 'Mission commander'
        : points >= 70
          ? 'Strong response'
          : points >= 45
            ? 'Promising plan'
            : 'Keep investigating',
  }
}
