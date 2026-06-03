# 🌉 QuakeQuest: Bridge Triage — Week 1 (1994 Northridge)

A polished, playful-yet-professional browser mini-game for **Week 1** of a
first-year undergraduate **catastrophe modeling** module, set during the real
**1994 Northridge earthquake** (Mw 6.7, San Fernando Valley).

> _"It's 4:31 a.m., January 17, 1994. A hidden-fault earthquake just struck
> beneath the San Fernando Valley. You're the resilience planner in the
> Emergency Operations Center — with no engineering data yet. Which bridges get
> a crew first?"_

Week 1 is **not** about equations. Students do rapid **triage** using intuition,
flagging up to five bridges and tagging *why*. The debrief then reveals what
actually happened — grounded in the documented damage record (MCEER-98-0004) —
including the four real collapses (La Cienega–Venice, Gavin Canyon, the I-5/SR-14
Newhall Pass interchange, and Mission–Gothic), and teaches three real lessons:
looks deceive, a few failures dominate cost (~6 collapses ≈ 69% of repair $),
and importance ≠ fragility.

## ✨ Features

- Cartoon **San Fernando Valley** map in pure HTML/CSS/SVG — freeway network
  (I-5, I-405, I-10, US-101, SR-118, SR-14), a pulsing **epicenter** with a
  radial shaking field, LA River, hills, hospital, cracks. No GIS / mapbox / leaflet.
- 10 clickable bridges (4 real collapses + realistic medium/low cases) with
  hover field-notes and vague clues — no numbers.
- Flag up to **5** bridges, each with a **"why did you flag it?"** reasoning tag
  that gets scored against the real cause of failure.
- Confetti on dispatch; an opening map "aftershock" shudder.
- Professional **debrief**: collapses caught, reasoning matches, per-bridge
  real outcomes (Collapsed/Major/Minor/Safe), missed-clue cards, three
  real-event insight cards, and the Week 1 lesson.
- Course roadmap (Weeks 2–6) mirroring the real capstone arc: shaking intensity,
  inventory & age, vulnerability score, damage probability, network criticality.
- Mascot field-guide **PGA Pal** 🐿️⛑️ (PGA intentionally unexplained until Week 2),
  rounded cards, `prefers-reduced-motion` support.

## 🚀 Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

Build for production:

```bash
npm run build
npm run preview
```

## ▲ Deploying to Vercel

The repo is import-ready (`vercel.json`, Vite preset, `dist` output). A GitHub
Actions workflow at `.github/workflows/deploy.yml` deploys to **production on
every push to `main`** — once you opt in:

1. **Create the Vercel project** and link it locally once to get the IDs:
   ```bash
   npm i -g vercel
   vercel link        # creates .vercel/project.json with orgId + projectId
   ```
2. In GitHub → **Settings → Secrets and variables → Actions**:
   - Add **secrets**: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
   - Add a **variable**: `ENABLE_VERCEL_DEPLOY` = `true`
3. Push to `main` (or run the workflow manually via **Actions → Deploy to
   Vercel → Run workflow**).

Until `ENABLE_VERCEL_DEPLOY` is set, the workflow skips cleanly — no failed
checks. Prefer zero config? Just **Import Project** at vercel.com and Vercel
auto-detects Vite and deploys on every push (no workflow needed).

## 🧱 Project structure

```
src/
  App.jsx                 # State + layout
  main.jsx                # React entry
  components/
    Header.jsx            # Title + mascot
    StoryPanel.jsx        # Story intro
    CityMap.jsx           # Cartoon map (river, roads, buildings, cracks)
    Bridge.jsx            # A single clickable bridge
    MissionPanel.jsx      # Mission, crew tracker, selected list, submit
    ResultsModal.jsx      # Scoring + feedback + lesson
    LockedModules.jsx     # Weeks 2–6 locked cards
    Toast.jsx             # "Crews are limited" warning
    Confetti.jsx          # Dependency-free sparkle burst
  data/
    bridges.js            # 10 bridges with hidden risk data
  styles/
    App.css               # All styling
```

## 🧠 Teaching note

Hidden bridge properties (`trueRisk`, `reason`, `visualClue`) live only in
`src/data/bridges.js` and are revealed in the results modal. In Week 1 students
are **not expected to be correct** — the point is that early disaster decisions
are made with incomplete information, and catastrophe modeling adds better
layers of evidence over time.

Later weeks (locked for now): shaking intensity, bridge inventory,
vulnerability score, damage probability, and policy & recovery planning.
