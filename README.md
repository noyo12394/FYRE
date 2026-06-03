# 🌉 QuakeQuest: Bridge Rescue — Week 1

A cute, playful, browser-based educational mini-game for **Week 1** of a
first-year undergraduate **catastrophe modeling** module.

> _"An earthquake just shook QuakeTown! You are the city's new resilience
> planner. Based only on what you can see, choose the bridges you think should
> be inspected first."_

Week 1 is **not** about equations. Students act as policy makers and use
**intuition** to pick which bridges to inspect after an earthquake. After
submitting, they get friendly feedback — some picks were good, some clues were
missed — and a teaser for the data layers they'll unlock in later weeks.

## ✨ Features

- Cartoon city map built with pure HTML/CSS/SVG (no GIS, no mapbox/leaflet)
- 10 clickable cute bridges with hover tooltips and vague clues
- Select up to **5** bridges (with a friendly "crews are limited" toast)
- Confetti / sparkle celebration on submit
- Friendly results modal with non-harsh score labels, per-bridge feedback,
  missed-clue cards, and a Week 1 teaching message
- Locked "upcoming weeks" cards (Weeks 2–6)
- Pastel colors, rounded cards, mascot **PGA Pal** 🐿️⛑️, floating icons
- Respects `prefers-reduced-motion`

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
