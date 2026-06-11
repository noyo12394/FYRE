// Shared scoring for the Week 1 drill — used by the results debrief and by the
// response payload sent to the instructor's collection backend.

export function scoreSelection(bridges, selectedIds, reasons) {
  const selected = bridges.filter((b) => selectedIds.includes(b.id))
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

  const points = highSelected.length * 2 + mediumSelected.length + reasoningHits.length

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
