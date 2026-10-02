import { dispatchRequirements } from './progress.js'

export function missionGuidance(phase, draft, studentName) {
  const missing = dispatchRequirements(draft, studentName)
  if (phase === 'recon') {
    return {
      title: 'Choose five crossings for your first inspection plan.',
      instructions: [
        'Read the bridge clues, then tap five numbered map markers or crossing cards. Tap again to remove a choice.',
        'A reason is optional at this stage. This is your first instinct, not your final answer.',
        'Once you have five crews assigned, click “Lock plan & reveal shaking” in the crew planner. This unlocks step 2.',
      ],
      next: missing.missingCrews
        ? `${draft.selectedIds.length}/5 assigned. Choose ${missing.missingCrews} more crossing${missing.missingCrews === 1 ? '' : 's'}.`
        : 'All five crews assigned. Lock your initial plan to unlock the new evidence.',
      action: missing.missingCrews ? 'Go to crossing cards' : 'Go to lock plan',
      target: missing.missingCrews ? 'crossings' : 'advance',
    }
  }
  if (phase === 'intel') {
    return {
      title: 'Use the new evidence to improve your five-crew plan.',
      instructions: [
        'Read the shaking overlay and hospital radio message. You can replace crossings; your original plan stays saved.',
        'Choose an evidence-based reason for every assigned crossing, add your planner name, and use Move up / Move down to set the crew order.',
        'Keep exactly five crews. Click “Review final dispatch” when your name and all five reasons are filled in.',
      ],
      next: missing.missingCrews
        ? `Assign ${missing.missingCrews} more crew${missing.missingCrews === 1 ? '' : 's'} first.`
        : missing.missingName
          ? 'Add your planner name in the crew planner.'
          : missing.missingReasons.length
            ? `Choose evidence-based reasons for ${missing.missingReasons.length} crossing${missing.missingReasons.length === 1 ? '' : 's'}. A hunch does not count here.`
            : 'Your name and five reasons are ready. Check the crew order, then review your final dispatch.',
      action: missing.missingCrews
        ? 'Go to crossing cards'
        : missing.missingName
          ? 'Go to planner name'
          : missing.missingReasons.length
            ? 'Go to missing evidence'
            : 'Go to final review',
      target: missing.missingCrews
        ? 'crossings'
        : missing.missingName
          ? 'name'
          : missing.missingReasons.length
            ? 'reason'
            : 'advance',
      reasonId: missing.missingReasons[0],
    }
  }
  if (phase === 'review') {
    return {
      title: 'Check the final plan, then dispatch your crews.',
      instructions: [
        'Read your five assignments in order: crew 1 leaves first. Check every crossing and its reason.',
        'Use “Back to editing” if you want to change your name, crossings, reasons, or order.',
        'Click “Dispatch crews & reveal outcomes” in the crew planner to submit the plan and unlock step 4.',
      ],
      next: 'Your plan is ready for the final decision. Results appear only after you dispatch.',
      action: 'Go to dispatch button',
      target: 'advance',
    }
  }
  return {
    title: 'Explore your results and what changed.',
    instructions: [
      'Open your debrief to see modeled damage, your score, and earned badges.',
      'Compare your initial plan with your final dispatch. Mission log keeps the saved report.',
      'Use “Start a new mission” to try another strategy. Earlier reports stay saved.',
    ],
    next: 'Mission complete. Your report is available in the debrief and Mission log.',
    action: 'Open my debrief',
    target: 'results',
  }
}
