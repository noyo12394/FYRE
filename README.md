# QuakeQuest: The Golden Hour · v3.1

One continuous earthquake-response challenge in simulated Bethlehem, PA.
The previous visual-triage and shaking exercises are merged into this mission.
There are no separate weeks, locked modules, or future-module cards.

## The challenge

1. **Scout:** choose exactly five of ten crossings using field notes. Lock
   your initial plan before seeing shaking evidence.
2. **Adapt:** unlock the simulated PGA map and a hospital radio request.
   Revise flags, explain each crossing with an evidence-based reason, and
   reorder crews using accessible Move up / Move down controls.
3. **Dispatch:** add your planner name, review all five assignments, then
   commit your final call. Outcomes stay hidden until dispatch.
4. **Debrief:** get a transparent 100-point scenario score, earned badges,
   modeled outcomes for every crossing, and an initial/final comparison.

The support tabs are Bridge intel (search, filtering, and shaking sorting),
Mission log (history, learner filters, replay, and CSV), and Field guide.
The mission takes about 10–15 minutes; there is no forced countdown.

The score rewards two modeled collapses caught (40), four high-risk crossings
flagged (20), their primary vulnerabilities matched (20), the hospital link
in the first three crews (10), and a collapsed bridge in the first two (10).
This is a teaching rubric, not an engineering inspection rule.

## Development

```bash
npm ci
npm run dev
npm test
npm run build
```

Tests cover stage gating, immutable baseline snapshots, draft migration,
dispatch validation, rankings, scoring, legacy history, CSV safety, and storage
failures. GitHub Actions runs tests and builds for pull requests and `main`.
The existing Vercel Git integration deploys production from `main`.
The optional `.github/workflows/deploy.yml` only runs when opted in.

## Persistence and accessibility

The map uses stable 44px numbered buttons, matching a visible crossing-card
selector beneath it. Crews can be assigned from either surface. Clicking an
incomplete next step explains missing assignments, names, or reasons and
focuses the relevant control. Native selects have explicit touch-friendly
sizes, including Safari styling. Mobile navigation shows every support tab.

The active workspace uses `quakequest-mission-v3`; the active old draft is
migrated from `quakequest-workspace-v2` without unlocking evidence. The old
storage key is not deleted. Reports use `quakequest-responses`, preserving
earlier attempts without counting them as completed new missions. A fresh
mission clears only the active draft; reports remain in the Mission log.
Storage is device-specific and failures are reported. Export a CSV to keep
both the initial plan and final dispatch order outside this browser.

Mission log also displays the active planner name, mission stage, and assigned
crews before dispatch. Edit the name in either the mission or Mission log;
both use the same autosaved workspace and survive reloads on this device.
Reviewed/dispatched plans keep their names locked. This active workspace is
not a shared roster and is not counted as a completed attempt. Typing a name
does not submit it to the instructor database.

Tabs support arrow keys and Home/End; URLs and browser history preserve the
selected tab. Old `?tab=drill&week=2` links open the single mission, and the
obsolete query is removed. A URL cannot skip the evidence reveal.

The mission sequence stays visible across all support tabs. Numbered steps
show completed, current, next, and later states using text as well as color.
Each stage has a three-item instruction checklist, a live next-action prompt,
and a guidance button that scrolls to and focuses the required control.
Guidance does not skip stages or submit responses; the crew planner buttons
still lock the initial plan, open review, and dispatch. Instructions stay
visible on phones and focus updates to the new stage when it unlocks.

The debrief
traps keyboard focus, closes with Escape, makes the background inert, and
restores focus. Bridge intel provides larger alternatives to map controls.
Layouts adapt to phones and respect reduced-motion preferences.

## Instructor database (optional)

The mission also tries `POST /api/submit`. Without a configured backend it
continues to work locally and the report explains where the response was saved.
For Supabase, configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in
Vercel; never expose the service-role key in client code. The existing table
remains compatible, with no required migration:

```sql
create table quake_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  student text not null,
  week int default 1,
  score_label text,
  collapses_caught int,
  high_flagged int,
  reasoning_hits int,
  missed_collapses int,
  selections jsonb
);
```

The numeric `week` column is retained only for backend compatibility. New
selection JSON carries final priority, initial priority/reason, and mission
metadata with the complete baseline on the first assignment. The score is
also recorded in `score_label`. Local reports keep the complete mission.
Set an `EXPORT_KEY` for the instructor-only `/api/export?key=<EXPORT_KEY>`
CSV endpoint. Device exports are available through the Mission log.

## Teaching scenario

Bethlehem names provide the setting, not verified infrastructure facts.
Shaking, structural descriptions, damage, and the hospital radio message are
simulated. This application is not live emergency information or an
engineering assessment. Model outcomes are inspectable in the client source;
the mission is a learning exercise, not an anti-cheating assessment.
