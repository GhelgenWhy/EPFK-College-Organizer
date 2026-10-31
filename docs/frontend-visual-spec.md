# EPFK College Organizer — Frontend Visual Spec (from source)

Source of truth: `frontend/src/**` (Tailwind v4, `@tailwindcss/vite` 4.3.3). Values marked **≈** are Tailwind v4 *default-scale* utilities that the code relies on (not re-declared by the app). Values marked `not specified` are genuinely absent from code.

## 0. Global conventions

- **Spacing/radius scale** (Tailwind v4 defaults, used everywhere): 1 unit = 4px. `p-1`=4 `p-1.5`=6 `p-2`=8 `p-3`=12 `p-4`=16 `p-5`=20 `p-6`=24. `rounded`=4 `rounded-sm`=6 `rounded-md`=8 `rounded-lg`=10 `rounded-xl`=14 `rounded-2xl`=18 (unused) `rounded-full`=9999. Arbitrary radii (`rounded-[19px]`, `rounded-[20px]`, …) are used verbatim from code.
- **Font**: `Inter` loaded from Google Fonts (`index.html`), `body { font-family: "Inter" }`. Global text color `text-primary` (#01253B, light). `body` = `min-h-screen overflow-hidden bg-bg-main text-black` (`--color-black` → `--text-primary`).
- **The app DOES NOT use the `--radius-sm/md/pill` vars defined in `:root`** (`index.css:66-68`) — note `rounded-md` in Tailwind v4 = 8px, **not** the 20px `--radius-md`. Do not use those tokens.
- **Numbered `--gray-*`, `--teal-*`, `--red-*`, `--amber-*` scale** from `@theme` are fully remapped onto semantic tokens: `gray-50`=surface-muted, `gray-100/200/300`=border, `gray-400`=text-muted, `gray-500/600`=text-secondary, `gray-700/800/900`=text-primary, `slate-100`=surface-muted, `teal-50`=accent-soft, `teal-600/700`=accent, `teal-800`=accent-hover, `red-50/100`=danger-soft, `red-600/700`=danger, `amber-700`=warning, `amber-50`=warning-soft.
- App-shell: every route renders `<AppLayout>` = Sidebar + one column (Header, then page `<main>`). Page `<main>` uses `flex-1` and page padding starts *below* the 60px Header. Root bg = `body`/`AppLayout` `bg-bg-main` = **#EEF7F6**.
- **Focus rings** generally: HomePage sets `outline-3` = 3px solid `var(--focus)` #0B8580, `outline-offset 3px` on all `button/a/input:focus-visible` inside it. Other pages: per-component `outline-2`/`outline-3` (no offset where not stated).

### 0.1 Semantic token table (light) — `themes/light.json` → CSS var name (`camelCase → --kebab-case`) → Tailwind class

| Token key | CSS var | Tailwind class | HEX / value |
|---|---|---|---|
| background | `--background` | `bg-bg-main` | **#EEF7F6** |
| surface | `--surface` | `bg-surface`, `--color-white` | **#FFFFFF** |
| surfaceMuted | `--surface-muted` | `bg-surface-muted`, `bg-gray-50`, `bg-slate-100` | **#F5FAF9** |
| surfaceHover | `--surface-hover` | *(no class; used as `bg-[var(--surface-hover)]`)* | **#EAF8F6** |
| lessonBackground | `--lesson-background` | `bg-bg-card` | **#E4F6F5** |
| scheduleTodayBackground | `--schedule-today-background` | `bg-bg-day-active` | **#FFEAB2** |
| calendarSelected | `--calendar-selected` | `bg-calendar-selected` | **#FFF6DC** |
| calendarOutsideMonth | `--calendar-outside-month` | `bg-calendar-outside-month` | **#E2ECEB** |
| textPrimary | `--text-primary` | `text-primary`, `--color-black` | **#01253B** |
| textSecondary | `--text-secondary` | `text-secondary`, `text-gray-500/600` | **#657A83** |
| textMuted | `--text-muted` | `text-muted`, `text-gray-400` | **#82969F** |
| border | `--border` | `border-border`, `bg-gray-100/200/300` | **#DFEAE8** |
| accent | `--accent` | `bg-accent`, `text-accent`, `text-link`, `teal-600/700` | **#079B98** |
| accentHover | `--accent-hover` | `bg-accent-hover`, `teal-800` | **#078582** |
| accentSoft | `--accent-soft` | `bg-accent-soft`, `teal-50` | **#E6F5F2** |
| accentStrong | `--accent-strong` | *(no class)* | **#0B8580** |
| onAccent | `--on-accent` | `text-on-accent` | **#FFFFFF** |
| navActive | `--nav-active` | `bg-bg-active`, `bg-(--nav-active)` | **#FFD86F** |
| onNavActive | `--on-nav-active` | `text-on-nav-active` | **#01253B** |
| danger | `--danger` | `text/bg/border-danger`, `red-600/700` | **#D94A52** |
| dangerSoft | `--danger-soft` | `bg-red-50/100`, `bg-[var(--danger-soft)]` | **#FBD5D7** |
| success | `--success` | `text/bg-success` | **#087977** |
| successSoft | `--success-soft` | `bg-success-soft` | **#DFF0EB** |
| warning | `--warning` | `text/bg-warning`, `amber-700` | **#9A6500** |
| warningSoft | `--warning-soft` | `bg-warning-soft`, `amber-50` | **#FFF6DD** |
| currentLesson | `--current-lesson` | *(no class; `bg-[var(--current-lesson)]`)* | **#FFD86F** |
| currentLessonSoft | `--current-lesson-soft` | *(no class; `bg-[var(--current-lesson-soft)]`)* | **#FFF6DC** |
| info | `--info` | `text-info` | **#0369A1** |
| infoSoft | `--info-soft` | `bg-info-soft` | **#E0F2FE** |
| deadlineBg | `--deadline-bg` | `bg-deadline-bg` | **#FFD5D5** |
| deadlineText | `--deadline-text` | `text-deadline-text` | **#8C3035** |
| eventBg | `--event-bg` | `bg-event-bg` | **#D1CBFB** |
| eventText | `--event-text` | `text-event-text` | **#403A78** |
| calendarHighlight | `--calendar-highlight` | `bg-calendar-highlight` | **#E48CFF** |
| calendarHighlightStrong | `--calendar-highlight-strong` | `bg-calendar-highlight-strong` | **#9C28C1** |
| inputBackground | `--input-background` | `bg-input-background` | **#F7F7F7** |
| disabled | `--disabled` | `text/bg-disabled` | **#A3AAA9** |
| focus | `--focus` | `outline-focus`, `border-focus` | **#0B8580** |
| scrollbar | `--scrollbar` | *(CSS only)* | **#C4D8D4** |
| shadowColor | `--shadow-color` | via `shadow-xl` | **rgba(1,37,59,0.11)** |
| shadowSoftColor | `--shadow-soft-color` | via `shadow-sm/md` | **rgba(1,37,59,0.05)** |
| shadowSubtleColor | `--shadow-subtle-color` | *(inline shadows)* | **rgba(1,37,59,0.035)** |

Shadows (`index.css:60-62`): `shadow-sm` = `0 1px 2px 0 rgba(1,37,59,.05)`; `shadow-md` = `0 4px 8px -1px rgba(1,37,59,.05), 0 2px 4px -1px rgba(1,37,59,.05)`; `shadow-xl` = `0 12px 24px -4px rgba(1,37,59,.11), 0 6px 12px -6px rgba(1,37,59,.05)`. The `--radius-*` vars are NOT in `@theme` so `rounded-sm/md/xl` keep Tailwind defaults.

Dark theme tokens (`themes/dark.json`) for reference: background #101B22, surface #182831, surfaceMuted #20343E, surfaceHover #29434D, lessonBackground #24454A, scheduleTodayBackground #463B25, calendarSelected #463B25, calendarOutsideMonth #142129, textPrimary #E8F2F5, textSecondary #B1C2C9, textMuted #91A5AE, border #344B57, accent #49C9C2, accentHover #65D8D1, accentSoft #203F42, accentStrong #73E0D9, onAccent #082A2D, navActive #E8BC58, onNavActive #28200A, danger #FF9292, dangerSoft #49292E, success #74D3AE, successSoft #1D3D36, warning #F1C66A, warningSoft #463B25, currentLesson #6B5418, currentLessonSoft #3D3218, info #7DC9F0, infoSoft #203A4A, deadlineBg #49292E, deadlineText #FFC0C0, eventBg #373451, eventText #D0CAFF, calendarHighlight #594066, calendarHighlightStrong #E7B6FF, inputBackground #20343E, disabled #71848C, focus #65D8D1, scrollbar #45606A, shadowColor rgba(0,0,0,.35), shadowSoftColor rgba(0,0,0,.22), shadowSubtleColor rgba(0,0,0,.18).

---

## 1. Layout shell (Sidebar + Header) — `features/layout/components/*`

### 1.1 AppLayout (`AppLayout.tsx`)
- Root: `flex min-h-screen items-start gap-[10px] bg-bg-main p-[10px]`. → bg **#EEF7F6**, gap **10px**, padding **10px all sides**.
- Content column: `flex h-[calc(100vh-20px)] min-h-0 min-w-0 flex-1 flex-col`. Width: flexible (`flex-1`) = viewport − 20px padding − 80px sidebar − 10px gap.
- Mobile ≤760px: root `min-h-dvh p-2` (8px); column `h-[calc(100dvh-16px)] pb-[68px]`.

### 1.2 Sidebar (`Sidebar.tsx`) — desktop ≥761px
- Container `<aside>`: `flex min-h-[calc(100vh-20px)] w-[80px] shrink-0 flex-col items-center justify-between px-[10px] py-0`.
  - **Width 80px fixed**, full height minus 10px top/bottom padding, background **transparent** (shows page bg #EEF7F6), no border, no radius, **no shadow** on desktop.
- Top group: `flex w-full flex-col items-center gap-[50px]`.
  - **Logo**: 60×60 box (`h-[60px] w-[60px]`) containing `assets/logo.svg` (natural 60×60: rounded-10px teal #059492 square with white mark), `object-contain`.
  - **Nav pill** `<nav>`: `w-[60px] flex flex-col items-center gap-[10px] rounded-[50px] bg-surface py-[5px] shadow-[0_1px_3px_var(--shadow-soft-color)]`
    - bg **#FFFFFF**, radius **50px**, padding **5px top/bottom**, gap **10px**, shadow `0 1px 3px rgba(1,37,59,0.05)`.
  - **Nav items** (`NavLink`, in order):
    | # | Route | Label (aria-label/title, no visible text) | Icon |
    |---|---|---|---|
    | 1 | `/` (end) | `Головна` | home |
    | 2 | `/calendar` | `Календар` | calendar |
    | 3 | `/schedule` | `Розклад` | schedule |
    | 4 | `/disciplines` | `Дисципліни` | disciplines |
    | 5 | `/assignments` | `Завдання` | tasks |
    | 6 | `/events` | `Події` | events |
    | 7 | `/manage` — **managers only** | `Керування` if admin, **`Моя група`** if starosta | manage |
  - Item geometry: `h-[50px] w-[50px] rounded-full`, icon centered, gap between items 10px (from nav).
  - **Inactive**: transparent bg, icon `text-muted` **#82969F**; hover `bg-[var(--surface-hover)]` **#EAF8F6**.
  - **Active**: `bg-bg-active` **#FFD86F**, icon `text-on-nav-active` **#01253B**.
- Bottom: **Logout button** `h-[60px] w-[60px] rounded-full bg-surface shadow-[0_1px_3px_var(--shadow-soft-color)]`, hover `bg-red-100` **#FBD5D7**.
  - Icon: inline SVG logout (door + arrow), **20×20**, `stroke var(--danger)` **#D94A52**, `stroke-width 2`, no fill.
  - `title="Вийти"`, `aria-label="Вийти з облікового запису"`.
- **Icons** (`SidebarIcon.tsx`): inline SVG **24×24**, `viewBox 0 0 24 24`, `fill:none stroke:currentColor strokeWidth 1.8 strokeLinecap/Join: round`, `aria-hidden`. Paths: home (house), calendar (rect+ticks), schedule (notebook card + lines), disciplines (mortarboard), tasks (list w/ checkmarks), events (megaphone/confetti), manage (shield w/ check). `students` icon exists but unused in nav.
- **Mobile ≤760px**: aside becomes `fixed right-3 bottom-3 left-3 z-50 w-auto rounded-[50px] border border-border bg-surface/95 p-[6px] shadow-[0_8px_30px_var(--shadow-color)] backdrop-blur-[12px]`; logo & logout hidden; nav becomes `flex-row justify-evenly gap-[3px] w-full bg-transparent py-0 shadow-none`; items `h-[46px] w-[46px]`.

### 1.3 Header (`Header.tsx`)
- `<header>`: `flex h-[60px] w-full shrink-0 items-center justify-between px-[75px] pl-[85px]`.
  - **Height 60px** (→72px mobile), padding: left **85px**, right **75px**, top/bottom 0. Background transparent (#EEF7F6 shows through). No border/shadow.
- **Left: Sync button** `<button>`: `flex h-[34px] items-center gap-1 whitespace-nowrap rounded-[50px] border-0 bg-surface px-5 py-[10px] text-base font-semibold text-muted`
  - **h 34px**, radius **50px**, bg **#FFFFFF**, padding-x **20px**, padding-y 10px, gap **4px**, no border, no shadow. Hover: none.
  - Text 1: `Остання синхронізація:` — inline `font-bold` #657A83, inherits 16px.
  - Text 2 (value): `formatLastSync()` → `26.10.26, 09:15` (uk-UA dd.MM.yy HH:mm, Kyiv) or default **`ще не було`**; `font-semibold` #82969F, 16px.
  - `title="Час останньої успішної перевірки з Moodle. Натисніть, щоб оновити дані."`; click = re-fetch profile.
  - Mobile: `max-w-[52%] overflow-hidden px-3 py-2 text-[9px] text-ellipsis`.
- **Right: Profile chip** (`NavLink → /profile`, `end`):
  - Inactive: `flex h-[60px] items-center gap-[10px] rounded-[50px] py-2 pr-[27px] pl-[10px] bg-surface text-primary` → **h 60px**, radius 50px, bg **#FFFFFF**, pl **10px**, pr **27px**, py **8px**, gap **10px**. Hover: `bg-[var(--surface-hover)]` #EAF8F6 + `ring-2 ring-surface` (2px #FFFFFF ring).
  - **Active (/profile)**: `bg-(--nav-active)` **#FFD86F**, `text-on-nav-active` **#01253B**, `ring-0`.
  - Avatar box: `h-10 w-10 rounded-[20px] overflow-hidden bg-[var(--surface-muted)]` → **40×40**, radius 20px, bg #F5FAF9; `<img>` = Clerk `imageUrl` or `assets/profile-avatar.png` (natural 42×42), **no width/height class** → renders at intrinsic 42×42 (cropped by 40×40 overflow-hidden; height 42 overflows the 40px row — code-faithful quirk, do not "fix").
  - Name span: `text-xs font-bold` (12px/700); `max-w-[90px] truncate` at ≤760px, `min-[761px]:` **`text-base` 16px, no max-width**.
  - Chevron SVG **18×10**, `viewBox 0 0 19 10`, `fill currentColor`.
  - Mobile: `h-11 gap-[7px] py-1 pr-[11px] pl-[5px]`; avatar 34×34.

---

## 2. HomePage (Головна) — `pages/HomePage.tsx`, `features/home/components/*`

### 2.1 Container (`HomeContent.tsx`)
- `<main className="flex min-h-0 flex-1 flex-col gap-[clamp(8px,1.4vh,14px)] overflow-hidden px-[18px] py-[clamp(12px,2vh,20px)] pr-5">`
  - **px 18px, right 20px (pr-5 overrides)**, **py clamp(12,2vh,20)**, **vertical gap clamp(8,1.4vh,14)**, overflow hidden (scrolls ≤960px / max-height 700px), thin scrollbar #C4D8D4 transparent.
  - ≤1200px: `px-6` (24). ≤760px: `gap-[17px] px-1 py-4`.
  - Hidden `<h1 id="home-heading" class="sr-only">Головна</h1>`.
- Loading branch (no data): `<main class="min-h-0 flex-1 overflow-auto p-6">` + `h1.mb-5.text-3xl.font-bold.text-primary` **`Головна`** (30px/700 #01253B) + `ApiQueryStatus` (default text `Завантаження даних…`, `p-4 text-secondary`).

### 2.2 Row A — `grid grid-cols-[minmax(0,1.535fr)_minmax(0,1fr)] gap-[clamp(12px,2.5vw,36px)] items-stretch` (→1 col ≤760, gap 12; gap 20 ≤1200)
#### A1. NextLessonCard (`NextLessonCard.tsx`) — 3 states
Common: `relative flex min-h-[clamp(150px,20vh,180px)] items-center overflow-hidden rounded-[19px] p-4` (mobile `min-h-[208px] p-[17px]`). **Radius 19px**, padding **16px**, min-height clamp(150,20vh,180). No border; no shadow in colored states.

1. **`current`** (a lesson in progress): card bg `bg-[var(--current-lesson)]` **#FFD86F**; ink `text-[#4A3500]`; badge bg `var(--current-lesson-soft)` **#FFF6DC**, text `#4A3500`.
2. **`next`** (first not-started lesson today): card bg `bg-accent` **#079B98**; ink `text-on-accent` **#FFFFFF**; badge bg `bg-accent-soft` **#E6F5F2**, text `bg-accent-hover`→`text-accent-hover` **#078582**.
3. **`none`** (no lesson today): `bg-surface` **#FFFFFF**, `shadow-[0_1px_3px_var(--shadow-soft-color)]`, centered `text-center`, contents below.
- Content (states 1–2): inner div `min-w-0 pr-[220px]` (≤1200: 195px; ≤760: pr-0).
  - Badge `inline-flex min-h-7 items-center rounded-lg px-3 text-[11px] font-bold uppercase` → **min-h 28px, radius 10px, px 12px, 11px/700 uppercase**. Text: **`Зараз`** (current) | **`Наступна пара`** (next). Mobile 10px/min-h 26.
  - Time line `<p>`: `mt-[11px] text-[clamp(25px,1.8vw,34px)] leading-[1.08] font-bold tracking-[-0.035em] tabular-nums` + ink. Text = `{startsAt} – {endsAt}` fallback `— – —` (en-dash with spaces). Mobile: mt 9, **26px**.
  - Title `<h2 id="next-lesson-heading">`: `mt-[13px] text-[clamp(18px,1.25vw,24px)] leading-[1.25] font-bold tracking-[-0.025em]` + ink. = lesson title. Mobile mt-8px, 18px.
  - Meta `<p>`: `mt-[7px] text-sm leading-[1.4] opacity-90` + ink. Text = `{teacher | "Викладача не вказано"} · онлайн-заняття` (middle dot `·` with px-1, `aria-hidden`). Mobile 12px.
  - **Meet button** (only if `meetingUrl`): `absolute right-4 bottom-3 inline-flex min-h-[38px] min-w-[195px] items-center justify-center gap-[9px] rounded-[11px] bg-surface px-4 text-xs font-bold text-accent-hover` → anchored **right 16px / bottom 12px**, **195×38 min**, radius **11px**, bg #FFFFFF, text 12px/700 **#078582**. Label **`Приєднатися до Meet →`** (arrow `aria-hidden`), `target=_blank`. Hover: `-translate-y-px` + `bg-surface-hover` #EAF8F6.
- State 3 (empty day) contents, centered:
  - Badge: `inline-flex min-h-7 items-center rounded-lg bg-[var(--accent-soft)] px-3 text-[11px] font-bold uppercase text-[var(--accent-hover)]` → **`Вільний день`** (bg #E6F5F2, text #078582).
  - `<h2 class="mt-[13px] text-[clamp(18px,1.25vw,24px)] leading-[1.25] font-bold text-[var(--text-secondary)]">` **`Сьогодні пар немає`** (#657A83).
  - `<p class="mt-[7px] text-sm text-[var(--text-muted)]">` **`Наступна пара з’явиться тут, коли розклад це передбачає.`** (#82969F, 14px, note curly apostrophe `’`).

#### A2. FocusCard = "Аджента" summary (`FocusCard.tsx`)
- `<section class="flex min-h-[clamp(150px,20vh,180px)] flex-col justify-center rounded-[19px] bg-surface px-4 py-3">` → bg **#FFFFFF**, radius **19px**, px **16px**, py **12px**, **no border, no shadow**. Mobile: min-h 190, p 17.
- Title `<h2>`: `text-lg font-bold tracking-[-0.025em] text-primary` → **`Аджента`** 18px/700 #01253B (mobile 20px).
- Subtitle `<p class="mt-1 text-[11px] leading-[1.35] text-[var(--text-muted)]">` → **`«справи, які слід виконати»`** 11px #82969F.
- Metrics: `mt-2 grid grid-cols-3 gap-[6px]` — 3 equal columns, gap **6px**.
- Each metric `<button>`: `grid min-h-[66px] grid-cols-[auto_1fr] content-center items-baseline gap-x-[6px] rounded-[13px] p-[7px] text-left text-primary transition-[filter] hover:brightness-[0.97]`
  - bg: metric 1 (urgent) `bg-[var(--danger-soft)]` **#FBD5D7**; metrics 2–3 `bg-[var(--surface-muted)]` **#F5FAF9**. Radius **13px**, padding **7px**, min-h **66px**, border 0. Hover: brightness .97. Mobile min-h 82.
  - Number `<span>`: `text-[22px] leading-none font-bold tracking-[-0.04em] tabular-nums` (≤1200: 20px).
  - Label `<span>`: `whitespace-nowrap text-xs font-bold` (12px/700; ≤1200 11px).
  - Detail `<span>`: `col-span-full mt-2 text-ellipsis whitespace-nowrap text-[9px] text-[var(--text-muted)]`.
  | # | value | label | detail | bg |
  |---|---|---|---|---|
  | 1 | `summary.overdueTasks` | `прострочені` | `Дедлайн уже минув` | #FBD5D7 |
  | 2 | `summary.deadlinesNext3Days` | `дедлайни` | `Протягом 3 днів` | #F5FAF9 |
  | 3 | `summary.activeTasks` | `завдання` | `Ще не виконані` | #F5FAF9 |
  - Clicks: 1&2 → `/calendar?date=<first deadline date>&month=<yyyy-mm>&filter=deadlines_only`; 3 → today + `filter=deadlines_only`.

### 2.3 Row B — `grid flex-1 items-stretch grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-[clamp(10px,1.4vw,20px)] gap-y-[clamp(8px,1.4vh,14px)]`
(≤960: `grid-cols-2 gap-[18px]`, ScheduleSection `col-span-full`; ≤760: 1 col gap 12.)
All three cards: `bg-surface` **#FFFFFF**, `rounded-[19px]`, `p-3` **12px**, **no border, no shadow**. (≤760: `p-[17px_14px_12px]`.)

**Shared SectionHeading** (`SectionHeading.tsx`): `flex items-start justify-between gap-2 border-b border-[var(--border)] pb-[11px]`
- `h2`: `text-[21px] leading-[1.25] font-bold tracking-[-0.025em] text-primary` → **21px/700 #01253B** (mobile 16px).
- `p` subtitle: `mt-[6px] text-xs text-[var(--text-muted)]` → **12px #82969F** (mobile 10px).
- optional action button: `inline-flex items-center gap-[6px] py-1 text-xs font-bold text-[var(--accent)] hover:underline hover:underline-offset-[3px]` → 12px/700 **#079B98**.

#### B1. ScheduleSection — `class="col-start-1 flex min-h-0 flex-col rounded-[19px] bg-surface p-3"`
- Heading: title **`Розклад на сьогодні`**, id `today-schedule-heading`; subtitle = `{Київський day name, 1st letter upper} · {n} пари`, e.g. `П'ятниця · 4 пари` (e.g. `Середа · 0 пари` — no pluralization logic).
- Empty: `<p class="flex flex-1 items-center justify-center p-4 text-sm text-muted">` **`На цей день пар немає`** (14px #82969F).
- List `<ol>`, each row `<li>`: `grid flex-1 grid-cols-[92px_minmax(0,1fr)_118px] items-center gap-2 border-b border-[var(--border)] px-2 py-1 last:border-b-0`
  - Row columns **92px | 1fr | 118px**, gap **8px**, px **8px**, py **4px**, divider 1px #DFEAE8. ≤1200 `66px/1fr/74px`; ≤760 `64px/1fr/78px`, min-h 75.
  - State styling: `current` → `my-1 rounded-[13px] border-0 bg-[var(--current-lesson-soft)]` **#FFF6DC**; `next` → `my-1 rounded-[13px] border-0 bg-[var(--accent-soft)]` **#E6F5F2**; `done` → `opacity-60`.
  - **Time `<time>`**: `h-[46px] flex-col justify-center gap-1 border-r border-[var(--border)] text-sm leading-[1.1] font-bold tabular-nums text-primary` (+`pl-3` when current) → column **46px** high, right border 1px, start time **14px/700**, end time span `text-[11px] font-medium text-[var(--text-muted)]` **11px/500 #82969F**.
  - **Title `h3`**: `text-ellipsis whitespace-nowrap text-sm leading-[1.4] font-bold text-primary` (14px/700).
  - **Sub**: `mt-[5px] text-[11px] text-[var(--text-muted)] ellipsis nowrap` — text `Онлайн · Google Meet` if `meetingUrl`, else `{location | "Аудиторію не вказано"}`.
  - **Badge** `<span>`: `inline-flex min-h-[26px] min-w-[74px] justify-self-end justify-center rounded-[9px] px-2 text-[10px] font-semibold whitespace-nowrap`:
    | state | label | bg | text |
    |---|---|---|---|
    | done | `Завершено` | #F5FAF9 | #82969F |
    | current | `Поточна` | #FFD86F | #4A3500 |
    | next | `Наступна` | #DFF0EB (`success-soft`) | #078582 (`accent-hover`) |
    | later | `Пізніше` | #F5FAF9 | #82969F |

#### B2. DeadlinesSection — title **`Найближчі дедлайни`**, subtitle **`Спочатку найтерміновіші`**
- `ul`: `flex flex-col gap-2 pt-2` → gap **8px**, padding-top 8px.
- Each `<li class="flex-1 min-h-0"><button class="flex h-full w-full flex-col items-start rounded-xl border px-3 py-2 text-left transition-colors hover:border-[var(--accent-hover)]">`
  - Radius **14px** (rounded-xl), border **1px**, px **12px**, py **8px**. Urgent: `border-[var(--danger)]` #D94A52 + `bg-[var(--danger-soft)]` #FBD5D7; normal: `border-border` #DFEAE8 + `bg-surface` #FFFFFF. Hover: border → #078582.
  - Date/label chip `<span>`: `inline-flex min-h-[25px] min-w-[140px] items-center rounded-lg px-[10px] text-[10px] font-bold` (radius 10px, min-w **140px**, 10px/700), text = `formatEuropeanLabel(deadline.label)` → `2026-09-30 · 23:59` rendered `30.09.2026 · 23:59`.
    - **index === 1** (2nd row always) → `bg-[var(--warning-soft)]` #FFF6DD, `text-[var(--warning)]` #9A6500.
    - else urgent → `bg-[var(--danger)]` #D94A52, text #FFFFFF.
    - else → `bg-[var(--accent-soft)]` #E6F5F2, text #079B98.
  - Title `<span class="mt-1 line-clamp-1 text-xs leading-[1.25] font-bold text-primary">` 12px/700 #01253B, 1 line clamp.
  - Course `<span class="mt-1 text-[10px] text-[var(--text-muted)]">` 10px #82969F.
- Empty state: none rendered (just heading).

#### B3. TasksSection — title **`Мої завдання`**, subtitle **`Невиконані завдання`**
- Only uncompleted tasks are listed (completed disappear).
- Rows `<li class="flex flex-1 items-center border-b border-[var(--border)] last:border-b-0">` (mobile min-h 88). Inner `flex items-start gap-[10px]`.
- Marker `<span>` (decorative, `aria-hidden`): `mt-px grid h-6 w-6 place-items-center rounded-full border-2 border-[var(--accent)] bg-surface` → **24×24**, 2px border **#079B98**, bg #FFFFFF, radius full (always unchecked here).
- Title span: `line-clamp-2 break-words text-[15px] leading-[1.45] font-bold text-primary` → **15px/700**.
- Course span: `mt-[6px] text-xs truncate text-[var(--text-muted)]` 12px.
- Due `<time>`: `mt-2 text-xs font-semibold text-[var(--accent)]` → 12px/600 **#079B98**, text `До <day> <month>` (e.g. `До 5 жовтня`, space after "До").
- Empty state: none rendered.

### 2.4 Row C — EventsSection — title **`Події коледжу`** (`EventsSection.tsx`)
- `<section class="grid min-h-[62px] shrink-0 grid-cols-[minmax(217px,0.44fr)_2fr] items-stretch rounded-[19px] bg-surface py-1 pr-3">`
  - bg #FFFFFF, radius **19px**, py **4px**, pr **12px**, grid **minmax(217px,0.44fr) | 2fr**.
- Left heading cell: `relative flex flex-col justify-center border-r border-[var(--border)] py-[6px] pr-[19px] pl-6` + `before:` accent bar `absolute top-1/2 -translate-y-1/2 left-2.5 w-[4px] h-[85%] rounded-[5px] bg-[var(--accent)]` → 4×85% bar #079B98 at left **10px**, radius 5px, vertically centered.
  - `h2`: `text-lg font-bold text-primary` → **`Події коледжу`** 18px/700.
  - Link button: `mt-2 inline-flex items-center gap-[6px] self-start py-1 text-xs font-bold text-[var(--accent)] hover:underline` → **`Переглянути всі →`** 12px/700 #079B98. Click → `/calendar?...filter=events_only` (first event date).
- Right `<ul class="grid grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)]">` — **2 columns 0.75fr / 1fr**.
- Event row `<li>`: vertical divider `[&+li]:border-l border-[var(--border)]`; `<button class="flex min-h-[54px] w-full items-center gap-[10px] px-3 py-1">`.
  - Date chip `<time>`: `inline-flex min-h-7 min-w-[69px] items-center justify-center rounded-lg bg-[var(--accent-soft)] px-2 text-[11px] font-bold text-[var(--accent)]` → **min 69×28**, radius 10px, #E6F5F2 / #079B98, text `{day number} {monthLabel}` e.g. `2 ЖОВ`.
  - Title: `text-sm leading-[1.4] font-bold text-primary ellipsis` 14px/700.
  - Details: `mt-1 text-[10px] text-[var(--text-muted)]` e.g. `Актова зала · 14:00`.
- Empty state: none rendered. (≤760px: 1 column, heading cell stacked with bottom border.)

---

## 3. SchedulePage (Розклад) — `pages/SchedulePage.tsx`

- `<main class="flex flex-1 flex-col gap-[13px] overflow-hidden px-[30px] pt-[29px] pr-[40px] pb-5">`
  - bg #EEF7F6 (page), **pl 30px, pr 40px, pt 29px, pb 20px**, **gap 13px**. ≤760: px 16, pt 16.
  - No visible page title (`aria-labelledby="schedule-page-title"` but no h1 rendered). Loading `Завантаження розкладу…` (`p.p-4.text-secondary`).
- **Toggle row**: `<div class="flex h-[75px] shrink-0 items-center py-[10px]">` → **height 75px**, centered vertically.

### 3.1 WeekTypeToggle
- Wrapper: `flex h-[55px] w-fit items-center gap-[15px] rounded-md bg-surface p-[5px]` → **h 55px**, radius **8px**, bg #FFFFFF, padding **5px**, gap **15px**, w fit-content, no shadow/border.
- Button (both): `h-full whitespace-nowrap rounded-sm border-0 px-7 py-[5px] text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-link focus-visible:outline-offset-2`
  - h **45px**, radius **6px**, px **28px**, py 5px, **16px/700**.
  - Active (`aria-pressed`): `bg-bg-active` **#FFD86F** + `text-on-nav-active` **#01253B**.
  - Inactive: transparent, `text-primary` **#01253B**; hover `bg-bg-main` **#EEF7F6**.
  - Focus: 2px outline `text-link` = **#079B98**, offset 2px.
- Labels: **`Чисельник`** | **`Знаменник`**. URL param `?week=numerator|denominator` (default numerator).

### 3.2 TimetableGrid
- Root: `grid flex-1 gap-1` (gap **4px**), inline `gridTemplateColumns: clamp(60px,8vw,130px) repeat(N, minmax(0,1fr))`. N = visible days (Mon–Fri always; Saturday only when it has lessons).
- Day columns (N+1 grid columns): each `grid grid-rows-[clamp(28px,5vh,48px)_minmax(0,1fr)] gap-1`.
- **Header cells** (Час + day names): `flex items-center justify-center rounded-md px-1 text-center text-[clamp(9px,1vw,16px)] font-bold leading-tight` → radius **8px**, font clamp(9,1vw,16)px/700.
  - Час label **`Час`** — `bg-surface` #FFFFFF, `text-primary`.
  - Day — today: `bg-bg-active` **#FFD86F** + `text-on-nav-active` **#01253B** and `aria-current="date"`; else `bg-surface` #FFFFFF + `text-primary`. Day names come from API `day.name` (e.g. `Понеділок`).
- **Time column body**: `grid grid-rows-6 gap-1 p-1` → 6 equal rows, gap 4px, padding 4px. Each cell `flex items-center justify-center rounded-md bg-surface px-1 text-[clamp(9px,1vw,16px)] font-bold text-primary`; value = slot string (e.g. `09:35–10:55`).
- **Day body**: `grid grid-rows-6 gap-1 rounded-md p-1 bg-surface` → **bg #FFFFFF**, radius 8px, padding 4px; each of 6 cells `flex items-stretch`.

### 3.3 LessonCard
- `flex flex-1 flex-col items-start justify-between gap-0.5 overflow-hidden rounded-sm bg-bg-card p-[clamp(4px,0.65vw,10px)]`
  - bg `bg-bg-card` = **#E4F6F5**, radius **6px**, padding clamp(4,0.65vw,10)px, gap **2px**, no border, no shadow.
- Discipline: `line-clamp-2 text-[clamp(9px,0.85vw,14px)] font-bold leading-tight text-primary` (max 2 lines, #01253B).
- Teacher: `truncate text-[clamp(8px,0.75vw,12px)] font-semibold leading-tight text-secondary` (#657A83).
- Format lines (`text-[clamp(8px,0.75vw,12px)] font-bold leading-tight text-link` = **#079B98**):
  - ONLINE/HYBRID + link → `<a>` **`Google meet`** (lowercase "meet" in code), underline on hover.
  - ONLINE/HYBRID without link → `<span>` **`Онлайн`**.
  - OFFLINE/HYBRID with location → `<span>` location text (truncate).
- Empty cell: nothing rendered.

---

## 4. CalendarPage (Календар) — `pages/CalendarPage.tsx`

- `<main class="flex flex-1 flex-col gap-[13px] overflow-hidden px-[30px] pt-[29px] pb-5">` → **pl 30, pr 30, pt 29, pb 20, gap 13**; bg #EEF7F6.
- Header row: `<header class="flex min-h-[38px] shrink-0 items-center">` with `h1`: `text-[clamp(30px,1.8vw,34px)] font-bold leading-[1.15] tracking-[-0.045em] text-primary` → **`Календар`** clamp(30,1.8vw,34)px/700 #01253B.
- Loading: `Завантаження календаря…`.
- Body (when data): `flex flex-1 gap-5` (gap **20px**). ≤760: `flex-col gap-3`.
  - Left: `flex flex-col flex-1` (≤760 `overflow-y-auto`).
  - Right: EventSidebar `w-[360px]`.

### 4.1 CalendarHeader (`CalendarHeader.tsx`)
- `flex h-[76px] flex-col justify-center gap-[6px] rounded-[20px] bg-surface px-6 py-2`
  - **height 76px**, radius **20px**, bg #FFFFFF, px **24px**, py **8px**, gap **6px**, no shadow/border. (≤760: h auto, gap 8, py 12.)
- Row 1 — month nav: `flex items-center gap-[10px]`:
  - Prev/Next buttons: `flex h-[30px] w-[30px] items-center justify-center rounded-[10px] border border-[var(--text-muted)] text-[var(--text-secondary)] transition-colors hover:bg-slate-100` → **30×30**, radius **10px**, 1px border **#82969F**, chevron `text-[var(--text-secondary)]` **#657A83** (chevron is an inline SVG 6×12, `fill currentColor`), hover bg `slate-100` = **#F5FAF9**. `aria-label="Попередній місяць"` / `"Наступний місяць"`.
  - Month title `h2`: `text-xl font-bold text-primary` → `formatMonthHeader` = `<Місяць> <YYYY> р.` e.g. **`Жовтень 2026 р.`**, 20px/700 #01253B.
  - Order: [◀] [Month Year р.] [▶].
- Row 2 — filters: `flex h-8 items-center gap-[10px]`:
  - Label `<span>`: `text-[13px] font-bold tracking-[0.02em] text-[var(--text-secondary)]` → **`ПОКАЗАТИ`** (uppercase literal), 13px/700 #657A83, letter-spacing 0.26px.
  - **Filter button — `Дедлайни`** (`aria-pressed` = filter is `DEADLINES_ONLY`):
    - base: `inline-flex h-[30px] items-center gap-[5px] rounded-[15px] border px-3 py-[6px] text-[13px] font-bold transition-all`
    - **active**: `border-bg-active` (#FFD86F) + `bg-calendar-selected` (**#FFF6DC**) + `text-primary` (#01253B)
    - **inactive**: `border-secondary` (#657A83) + `bg-[var(--surface-muted)]` (**#F5FAF9**) + `text-secondary` (#657A83)
    - swatch: `div h-[15px] w-[15px] rounded-[10px] bg-[var(--danger-soft)]` (#FBD5D7) with inner `div h-[10px] w-[10px] rounded-[10px] bg-[var(--deadline-bg)]` (**#FFD5D5**)
  - **Filter button — `Події`** (same base/active/inactive styles):
    - swatch outer `bg-[var(--calendar-highlight)]` (**#E48CFF**), inner `bg-[var(--calendar-highlight-strong)]` (**#9C28C1**), 15px/10px circles.
  - There is **no separate "Усі" button**: the two filters are toggles. Clicking an active one → `ALL` (and removes the `filter` URL param). Only one can be active at a time (state is single-valued, but toggling DEADLINES then EVENTS switches).

### 4.2 CalendarGrid + DayCell
- Weekday strip: `grid h-9 grid-cols-7 items-center rounded-[20px] bg-[var(--surface-muted)]` → **height 36px**, radius **20px**, bg **#F5FAF9**, 7 equal columns. Labels `WEEKDAYS_SHORT` = **`ПН ВТ СР ЧТ ПТ СБ НД`**, each `text-center text-[13px] font-bold text-[var(--text-muted)]` (#82969F).
- Grid: `grid h-full flex-1 auto-rows-[minmax(0,1fr)] grid-cols-7 gap-[6px]` → **7 columns, gap 6px**, equal rows, rows stack below weekday strip (no extra gap).
- **DayCell**: `flex h-full cursor-pointer flex-col items-start gap-[2px] overflow-hidden rounded-[10px] border-2 p-[4px_6px] transition-transform duration-100 hover:-translate-y-px`
  - **radius 10px, border 2px, padding 4px 6px, gap 2px**; hover translateY(-1px). Click selects the date.
  - States (in priority order):
    | state | classes | bg | border (2px) |
    |---|---|---|---|
    | selected | `border-bg-active bg-calendar-selected` | **#FFF6DC** | **#FFD86F** |
    | current month | `border-transparent bg-surface` | **#FFFFFF** | transparent |
    | outside month | `border-transparent bg-calendar-outside-month` | **#E2ECEB** | transparent |
  - Day number: `flex h-[26px] w-[26px] items-center justify-center rounded-[7px] text-lg leading-none font-bold` → **26×26, radius 7px, 18px/700**.
    - today: `bg-bg-active text-on-nav-active` **#FFD86F / #01253B**.
    - else: transparent, `text-primary` #01253B (both in-month and outside-month — outside cells are only dimmed via cell bg).
  - Events: only the **first** event is rendered (others counted). Pill: `flex h-[18px] w-full items-center rounded-[4px] px-1` + text `text-[11px] font-bold leading-[1.2] truncate`:
    - `DEADLINE`: bg **#FFD5D5** (`bg-[var(--deadline-bg)]`), text **#8C3035** (`text-deadline-text`).
    - `EVENT`: bg **#D1CBFB** (`bg-[var(--event-bg)]`), text **#403A78** (`text-event-text`).
  - Overflow: `<span class="mt-auto mb-0.5 text-[11px] font-bold leading-none text-muted">` **`ще +N`**.
  - Cells: 42 (6×7) or 35 (5×7) — code pads to a full week, variable row count.

### 4.3 EventSidebar (`EventSidebar.tsx`)
- Wrapper: `flex w-[360px] shrink-0 flex-col gap-2` → **width 360px**, gap **8px**. (≤760: `max-h-[35%] w-full`.)
- Date header: `flex h-[110px] items-center rounded-[20px] bg-[var(--accent-soft)] px-5` → **height 110px**, radius **20px**, bg **#E6F5F2**, px **20px**. No border/shadow.
  - `h3`: `text-[32px] font-bold text-[var(--text-primary)]` → `formatSelectedDateHeader` = `` `${weekday}, ${day} ${monthGenitive}` `` → e.g. **`П'ятниця, 30 жовтня`** (weekday from `UKRAINIAN_WEEKDAYS_FULL`, straight apostrophe as in code), **32px/700 #01253B**.
- List panel: `flex flex-1 flex-col gap-[9px] overflow-y-auto rounded-[20px] bg-surface px-3 py-[14px]` → radius **20px**, bg #FFFFFF, px **12px**, py **14px**, gap **9px**, thin scrollbar.
  - Empty: `<p class="px-1 py-[10px] text-muted">` **`На цей день подій немає`** (16px #82969F).
  - Event card: `flex flex-col rounded-[15px] p-[10px]` → radius **15px**, padding **10px**; DEADLINE: `gap-[2px] bg-[var(--deadline-bg)]` **#FFD5D5**; EVENT: `gap-[10px] bg-[var(--event-bg)]` **#D1CBFB**.
    - Title: `text-sm font-bold text-primary` 14px/700.
    - Discipline (if present): `text-sm text-primary` 14px/400.
    - Description (if present): `whitespace-pre-line text-base text-primary` 16px/400.
    - Date/time line: `text-xs font-bold text-primary` 12px/700, `dd.MM.yyyy` (+`, HH:mm` if time).
    - Link (if `linkUrl`): `text-xs font-bold text-primary underline` — **`Відкрити в Moodle`** for DEADLINE, **`Детальніше`** for EVENT.

---

## 5. DisciplinesPage (Дисципліни) — `pages/DisciplinesPage.tsx`

- `<main class="min-h-0 flex-1 overflow-y-auto px-[30px] pb-8 pt-7 pr-[40px]">` → bg #EEF7F6; **px 30 px (pr 40), pt 28, pb 32**; scrollable.
- `h1`: `mb-5 text-3xl font-bold text-primary` → **`Дисципліни`** 30px/700 #01253B, margin-bottom **20px**.
- Loading: `Завантаження дисциплін з Moodle…` (`p.p-4.text-secondary`).
- **Empty**: `<p class="text-secondary">` **`У Moodle поки немає доступних дисциплін.`** (16px #657A83).
  (Note: `DisciplineGrid` also has an unreachable empty state `Дисциплін поки немає.` in `rounded-xl bg-surface p-6 text-sm text-secondary` — page handles empty first.)
- **Grid**: `grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4` → gap **20px**; 1 col <640, 2 ≥640, 3 ≥1280, 4 ≥1536 (default Tailwind breakpoints).
- **DisciplineCard**: `<article class="flex min-h-[120px] flex-col items-start rounded-[18px] border border-border bg-surface p-4 shadow-sm">`
  - **min-height 120px, radius 18px, 1px border #DFEAE8, bg #FFFFFF, padding 16px**, `shadow-sm` = 0 1px 2px rgba(1,37,59,.05).
  - Name `h2`: `text-base font-bold leading-snug text-primary` → 16px/700 #01253B, line-height 1.375.
  - Teacher `p`: `mb-3 mt-3 text-sm font-medium text-link` → 14px/500 **#079B98**; text = `teacherName` or **`Викладача не вказано`**.
  - Moodle link: `inline-flex min-h-7 items-center rounded-[9px] bg-accent px-2.5 text-[10px] font-semibold text-on-accent hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-focus outline-offset-2`
    → **min-h 28px, radius 9px, px 10px, 10px/600, bg #079B98, text #FFFFFF**; hover bg **#078582**. Label **`Перейти в Moodle`**.
  - If no link: `<span class="text-xs text-muted">` **`Посилання ще не додано`** (12px #82969F).

---

## 6. AssignmentsPage (Завдання) — `pages/AssignmentsPage.tsx`, `features/tasks/components/*`

### 6.1 Container (`AssignmentsContent.tsx`)
- `<main class="flex h-full flex-1 flex-col gap-[13px] px-[40px] pt-[29px] pr-[40px] pb-6">` → bg #EEF7F6, **px 40, pt 29, pb 24, gap 13**. ≤1250 px-24; ≤760 px-4 gap-14 py-16.
- `h1`: `translate-y-1 text-[33px] font-bold leading-[1.15] tracking-[-0.045em] text-primary` → **`Завдання`** 33px/700 #01253B, offset down 4px (mobile 29px).
- Loading branch: `main.p-6` + h1 `Завдання` (`text-3xl mb-5`) + `Завантаження завдань з Moodle…`.

### 6.2 AssignmentsStatusTabs (toolbar)
- `relative top-[5px] inline-flex min-h-[46px] w-fit items-center gap-0.5 overflow-x-auto rounded-xl bg-surface p-1` → radius **14px**, bg #FFFFFF, padding **4px**, gap **2px**, min-h **46px**, nudge down 5px; no scrollbar. `role="group" aria-label="Стан завдань"`.
- Tab `<button aria-pressed>`: `min-h-[38px] rounded-[10px] px-[8.5px] text-[13px] font-semibold`
  - **active**: `bg-[var(--accent)]` **#079B98** + `text-on-accent` **#FFFFFF**; hover `bg-[var(--accent-hover)]` #078582.
  - **inactive**: transparent + `text-[var(--text-secondary)]` #657A83; hover `bg-[var(--background)]` #EEF7F6 + `hover:text-primary` #01253B.
  - Focus: 3px outline #0B8580, offset 3.
- Labels order: **`Всі`** · **`Виконані`** · **`Актуальні`** · **`Прострочені`**. (≤760: min-h 43/35, 10px.)

### 6.3 Main grid (`AssignmentsContent` body div)
- `relative top-px grid flex-1 grid-cols-[minmax(0,2.265fr)_minmax(380px,1fr)] [grid-template-areas:'feed_filters'] items-start gap-[26px]`
  - columns **2.265fr | minmax(380px,1fr)**, gap **26px**, top offset 1px, grid areas `feed` (left) + `filters` (right).
  - ≤1250: `minmax(0,1fr)_minmax(260px,0.42fr)`, gap 16. ≤760: 1 col, areas `filters` then `feed`, gap 12, top 0.

### 6.4 AssignmentsList / AssignmentsGrid — feed
- `<section class="flex flex-col overflow-y-auto max-h-full pr-1 [grid-area:feed]">` (scrollbar hidden).
- List `ul`: `flex flex-col gap-[13px]` → row gap **13px**.
- **Empty state** (`AssignmentsGrid.tsx`): `flex min-h-[245px] flex-col items-center justify-center rounded-[18px] border border-dashed border-[var(--border)] bg-surface/55 px-5 py-7 text-center`
  - **min-h 245px, radius 18px, 1px dashed #DFEAE8, bg rgba(255,255,255,0.55), px 20, py 28**.
  - Badge: `grid h-[42px] w-[42px] place-items-center rounded-full bg-[var(--success-soft)] text-lg text-[var(--accent)]` → **42×42 circle, bg #DFF0EB, glyph `✓` 18px #079B98**.
  - `h2`: `mt-3 text-[15px] font-normal text-primary` → **`Тут поки немає завдань`**.
  - `p`: `mt-[5px] max-w-[260px] text-[11px] leading-[1.5] text-secondary` → **`Спробуйте вибрати іншу вкладку або змінити фільтри.`**
  - Button: `mt-[7px] inline-flex min-h-[34px] rounded-lg bg-transparent font-bold text-[var(--accent)] hover:underline` — **no text-size class → inherits 16px body**, #079B98 → **`Скинути фільтри`**.

### 6.5 AssignmentCard
- `<article class="relative min-w-0 min-h-[142px] rounded-[18px] border border-border py-[14px] pr-[160px] pb-[13px] pl-4 transition-shadow hover:shadow-[0_3px_12px_var(--shadow-subtle-color)]">`
  - **min-h 142px, radius 18px, border 1px #DFEAE8, padding top 14 / right 160 / bottom 13 / left 16**. Hover shadow `0 3px 12px rgba(1,37,59,.035)`. (≤1250 pr 150; ≤760 radius 15, pr 128, pl 13; ≤380 pr 13/static button.)
  - **Card bg by state** (no colored outline):
    | state | bg |
    |---|---|
    | completed | `bg-[var(--lesson-background)]` **#E4F6F5** |
    | approaching (≤3 days) | `bg-[var(--current-lesson-soft)]` **#FFF6DC** |
    | overdue | `bg-[var(--danger-soft)]` **#FBD5D7** |
    | normal / no deadline | `bg-surface` **#FFFFFF** |
- **Status button** (top-right, toggles done): `absolute top-[15px] right-[15px] inline-flex min-h-[41px] w-[136px] rounded-xl px-[7px] text-[10px] font-semibold`
  - **136×41, radius 14px, 10px/600**, hover `brightness-95`; disabled (SYSTEM) `cursor-default`, `title="Відмічено системою, змінити не можна"`.
  - Label/tone:
    | condition | label | bg | text |
    |---|---|---|---|
    | completed | `Виконано` | `bg-[var(--success)]` **#087977** | white |
    | overdue | `Прострочено` | `bg-[var(--danger)]` **#D94A52** | white |
    | approaching | `Наближається дедлайн` | `bg-[var(--warning)]` **#9A6500** | white |
    | otherwise | `Не виконано` | `bg-info-soft` **#E0F2FE** | `text-primary` #01253B |
- Title `h2`: `line-clamp-2 break-words text-base font-bold leading-[1.35] tracking-[-0.015em] text-primary` → **16px/700 #01253B** (completed → `text-secondary` #657A83).
- Course `p`: `mt-[13px] text-[13px] font-semibold leading-[1.3] text-accent truncate` → **13px/600 #079B98**.
- Description `p`: `mt-[9px] text-xs leading-[1.4] text-secondary` → 12px #657A83.
- Meta row: `mt-[6px] flex flex-wrap items-center gap-x-3 gap-y-[7px]`:
  - Due `p`: `text-xs leading-[1.4]`; overdue → `font-semibold text-danger` **#D94A52**, else `text-secondary`. Text **`Дедлайн: {dd.MM.yyyy[, HH:mm] | Без дедлайну}`**.
  - Source `p`: `text-[10px] text-muted` → `{task.source} · Додано {addedAt}`, 10px #82969F.
  - Badge (if marked): `rounded-md bg-surface px-2 py-[3px] text-[10px] font-semibold text-secondary` → **`Відмічено системою`** | **`Відмічено вами`** (white pill, 10px/600).
  - Moodle link: `inline-flex min-h-7 rounded-[9px] bg-accent px-[9px] text-[10px] font-semibold text-on-accent hover:bg-accent-hover` → **`Перейти в Moodle`** (#079B98/#FFFFFF, 28px high).
  - Else `<span class="... bg-surface-muted px-[9px] text-muted">` → **`Посилання відсутнє`** (#F5FAF9/#82969F).

### 6.6 AssignmentsFiltersPanel (right column, `[grid-area:filters]`)
- `<aside class="flex min-h-[306px] flex-col items-start gap-4 rounded-[19px] bg-surface px-[22px] py-[21px]">`
  - **min-h 306px, radius 19px, bg #FFFFFF, px 22, py 21, gap 16px**, no border/shadow.
- `h2`: `text-[19px] font-bold leading-[1.3] tracking-[-0.025em] text-primary` → **`Фільтри`** 19px/700.
- Each field `<label>`: `flex flex-col gap-[10px] text-[13px] font-semibold text-primary` (13px/600 label).
  - Label texts: **`Сортування за дедлайном`**, **`Дисципліна`**, **`Відмітка`**.
  - `select`: `min-h-[46px] rounded-[11px] border-0 bg-[var(--input-background)] px-3 text-[13px] font-normal text-primary` → **min-h 46px, radius 11px, bg #F7F7F7, 13px/400**, native appearance. Widths: sort `w-max`, discipline **w-[137px]**, mark `w-max`.
  - Options: sort = `Спочатку найближчі` | `Спочатку найпізніші` | `За назвою`; discipline = `Усі дисципліни` + course names; mark = `Усі` | `Відмічені системою` | `Відмічені вами`.
- Reset button: `ml-[10px] inline-flex min-h-[34px] rounded-lg bg-transparent font-bold text-[13px] text-[var(--accent)] hover:underline hover:underline-offset-[3px]` → **`Скинути фільтри`** #079B98, margin-left 10px.
- Focus: 3px outline #0B8580, offset 3.

---

## 7. EventPage (Події) — `pages/EventPage.tsx`, `features/events/components/*`

### 7.1 Container + EventHeader
- Page wrapper: `flex w-full h-full flex-col overflow-hidden` (bg #EEF7F6, inside Header column). No padding at wrapper level.
- Header outer: `w-full px-[30px] pt-[29px] pb-5` → **px 30, pt 29, pb 20**. (≤760 px 16 pt 16.)
- Filter bar: `flex flex-wrap items-center bg-surface py-[17px] px-[22px] gap-[16px] rounded-[18px] shadow-sm relative z-30`
  - bg **#FFFFFF**, radius **18px**, px **22px**, py **17px**, gap **16px**, `shadow-sm` 0 1px 2px rgba(1,37,59,.05).
- Three dropdown triggers (`div`, not native selects): column `flex flex-col gap-1`, each:
  - Label: `text-[12px] font-medium text-gray-400` → **`Період`** | **`Статус`** | **`Сортування`**, **12px/500 #82969F**.
  - Control: `flex items-center justify-between px-3 w-[205px] h-[38px] bg-gray-50 hover:bg-gray-100/80 border border-gray-200/80 rounded-[10px] text-sm`
    - **205×38, radius 10px**, bg `gray-50` = **#F5FAF9**, border 1px `gray-200/80` = rgba(223,234,232,0.8), text 14px **#01253B** (`text-black` inherited), px 12. Hover bg `gray-100/80` = rgba(223,234,232,0.8).
    - Chevron SVG `w-4 h-4 text-gray-500` → **16×16, stroke #657A83**, rotates 180° when open.
  - Menu (when open): `absolute top-[calc(100%+6px)] left-0 w-[205px] bg-surface border border-gray-100 rounded-[14px] shadow-xl py-2 z-40 flex flex-col gap-1` → bg #FFFFFF, radius **14px**, 1px border #DFEAE8, `shadow-xl`, py **8px**, gap 4px, width 205.
    - Item: `px-3 py-2 mx-2 rounded-[10px] text-sm`
      - **selected**: `bg-[var(--accent-soft)]` **#E6F5F2** + `text-[var(--accent)]` **#079B98** + `font-medium`;
      - unselected: `text-gray-700` **#01253B** + `hover:bg-gray-50` **#F5FAF9**.
  - Options: Period `Усі дати` | `Цей тиждень` | `Цей місяць` | `Минулі`; Status `Усі статуси` | `Заплановано` | `Перенесено` | `Завершено`; Sort `Спочатку найближчі` | `Спочатку найдальші` | `За назвою`.
- Reset: `<button class="text-teal-600 text-sm font-medium hover:underline self-center mt-5">` → **`Скинути фільтри`** 14px/500 **#079B98**, `mt-5` (20px) to align with controls.

### 7.2 EventList
- List container: `flex flex-col gap-3 px-[30px] pb-5 w-full overflow-y-auto flex-1` → **gap 12px, px 30, pb 20**.
- **Empty**: `flex flex-1 flex-col items-center justify-center py-16 text-gray-400 text-sm` → **`За обраними критеріями подій не знайдено.`** 14px **#82969F**, py **64px**.
- **Event card**: `flex flex-col justify-between h-[180px] max-h-[180px] bg-surface border rounded-[16px] px-5 py-3.5 shadow-sm transition-all hover:shadow-md overflow-hidden shrink-0`
  - **fixed height 180px**, radius **16px**, px **20**, py **14**, bg **#FFFFFF**, `shadow-sm` → `hover:shadow-md` (0 4px 8px -1px / 0 2px 4px -1px rgba(1,37,59,.05)).
  - Border by status: `Заплановано` → `border-[var(--info-soft)]` **#E0F2FE**; `Перенесено` and `Завершено` (and default) → `border-gray-200/80` **rgba(223,234,232,0.8)**.
  - Row 1: `flex items-start justify-between gap-4`
    - Title `h3`: `text-base font-bold text-gray-900 truncate` → 16px/700 **#01253B**.
    - Status pill: `px-3 py-0.5 rounded-full text-xs font-medium`
      - `Заплановано` → `bg-[var(--info-soft)] text-[var(--info)]` **#E0F2FE / #0369A1**
      - `Перенесено` → `bg-[var(--warning-soft)] text-[var(--warning)]` **#FFF6DD / #9A6500**
      - `Завершено`/default → `bg-gray-100 text-gray-600` **#DFEAE8 / #657A83**
  - Row 2 (date · place): `flex flex-row items-center gap-6 text-sm text-teal-700`; at viewport height ≥800px becomes `flex-col items-start gap-1`.
    - Clock icon SVG **16×16** (`w-4 h-4`), `stroke currentColor` = #079B98, stroke-width 2 (circle clock path).
    - Text: `{dd.MM.yyyy} · {time}` (e.g. `30.09.2026 · 14:00`).
    - Place icon SVG **16×16**, `stroke var(--text-primary)` **#01253B** (pin path).
    - Place text: `truncate text-[var(--text-primary)]`.
  - Row 3 description `p`: `text-xs text-gray-600 truncate` → 12px **#657A83**.
  - Row 4 meta (only when organizer or detailsUrl): `flex items-center justify-between gap-2 text-xs text-gray-400 pt-2 border-t border-gray-100` → 12px **#82969F**, top border 1px **#DFEAE8**, pt 8.
    - Left: `Організатор: {organizer}` (or empty span).
    - Right link: `text-link font-semibold no-underline hover:underline` **#079B98** → **`Детальніше →`**.

---

## 8. ManagementPage (Керування) — `pages/ManagementPage.tsx`, `features/management/components/*`

### 8.1 Container
- `<main class="flex flex-1 flex-col gap-4 overflow-auto px-[30px] pt-2 pr-[40px] pb-5">` → bg #EEF7F6, **pl 30, pr 40, pt 8, pb 20, gap 16**; thin scrollbar. (≤760: px 16, pb 96.)
- Role split: admin → title `Керування коледжем`, subtitle `Роль: Адміністратор`, 4 tabs, + GroupPicker. Starosta → title **`Моя група`**, subtitle `{groupName | "Група не закріплена"} · {Роль: Староста}`, 3 tabs (no events, no picker). `ROLE_LABELS` = `Студент` / `Староста` / `Адміністратор`.
- `<Banner>` under header (errors from mutations; renders nothing when no message).

### 8.2 ManageHeader (ManageUi)
- Wrapper `flex flex-col gap-3` (12px).
- Top row `flex flex-wrap items-center justify-between gap-3`:
  - `h1`: `text-[26px] font-bold text-primary` → **26px/700 #01253B**.
  - `p` subtitle: `text-sm text-secondary` → **14px #657A83**.
  - Right slot (admin): **GroupPicker** → `label.flex.items-center.gap-2.text-sm.text-secondary` text **`Група`** + `select.rounded-lg.border.border-border.bg-input-background.px-3.py-2.text-primary` (radius 10px, 1px #DFEAE8, bg **#F7F7F7**, px 12, py 8, 14px). First option **`Усі групи`** (value ""), then group names.
- Tab bar `nav`: `flex gap-4 overflow-x-auto border-b border-border` → gap **16px**, 1px bottom border **#DFEAE8**.
- Tab `<button role="tab" aria-selected>`: `-mb-px border-b-2 bg-transparent px-1 pb-2 text-sm font-semibold transition-colors`
  - **active**: `border-accent` **#079B98** 2px underline + `text-accent` **#079B98**
  - inactive: `border-transparent` + `text-secondary` #657A83; hover `hover:text-primary` #01253B.
  - Labels: **`Розклад`** · **`Завдання`** · **`Студенти`** · **`Події`** (Події admin-only). 14px/600.
- Warning (tab ≠ events and no group): `rounded-xl bg-[var(--warning-soft)] px-4 py-2 text-sm text-[var(--warning)]` → bg **#FFF6DD**, text **#9A6500**, radius 14, px 16 py 8 → **`Оберіть групу, щоб керувати розкладом і завданнями.`**
- Loading/error (schedule tab): `p.text-sm.text-muted` **`Завантаження розкладу…`**; error `p.text-sm.text-[var(--danger)]`.

### 8.3 Shared styles (`styles.ts`)
- `fieldClass`: `w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-2 focus:outline-focus` → radius **10px**, 1px **#DFEAE8**, bg **#F7F7F7**, px 12 py 8, **14px**, focus 2px outline **#0B8580**.
- `primaryButtonClass`: `inline-flex min-h-[38px] gap-1 rounded-[10px] border-0 bg-accent px-4 text-sm font-semibold text-on-accent hover:bg-accent-hover disabled:opacity-50` → **min-h 38**, radius 10, **#079B98/#FFFFFF**, px 16; hover **#078582**. Used by `+ Створити завдання`, `+ Створити групу`, `Зберегти`, `Створити подію`, `Зберегти зміни`.
- `secondaryButtonClass`: `inline-flex min-h-[34px] gap-1 rounded-[10px] border border-border bg-surface px-3 text-sm font-semibold text-secondary hover:bg-[var(--surface-hover)] hover:text-primary disabled:opacity-50` → **min-h 34**, 1px #DFEAE8, bg #FFFFFF, text #657A83, px 12.
- `dangerButtonClass`: `inline-flex min-h-[34px] rounded-[10px] border-0 bg-[var(--danger-soft)] px-3 text-sm font-semibold text-[var(--danger)] hover:bg-[var(--danger)] hover:text-on-accent disabled:opacity-50` → **bg #FBD5D7 / text #D94A52**, hover **#D94A52 / #FFFFFF**.

### 8.4 Banner & Modal
- `Banner`: `rounded-xl px-4 py-2 text-sm` — error `bg-[var(--danger-soft)] text-[var(--danger)]` (**#FBD5D7 / #D94A52**), success `bg-[var(--success-soft)] text-[var(--success)]` (**#DFF0EB / #087977**).
- `Modal`: overlay `fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(0,0,0,0.45)] p-4`; panel `w-full max-w-[560px] rounded-[22px] border border-border bg-surface p-6 shadow-[0_12px_24px_var(--shadow-color)]` (radius 22, padding 24, shadow rgba(1,37,59,.11)); title `text-xl font-bold`; close button `rounded-full p-1 text-secondary hover:text-primary` glyph **`✕`**; footer `mt-5 flex justify-end gap-2`.

### 8.5 ScheduleEditor tab («Розклад»)
- Wrapper `flex flex-col gap-3`.
- Week toggle container: `flex rounded-[10px] bg-surface p-1 shadow-[0_1px_3px_var(--shadow-soft-color)]` (role=tablist), radius 10, white, padding 4.
  - Button: `rounded-lg px-4 py-1.5 text-sm font-semibold`
    - active: `bg-accent text-on-accent` **#079B98 / #FFFFFF**; inactive: `bg-transparent text-secondary hover:text-primary` **#657A83**.
  - Labels **`Чисельник`** | **`Знаменник`** (default numerator; local, not URL).
- Desktop table wrapper: `overflow-auto rounded-[18px] border border-border bg-surface` (radius 18, 1px #DFEAE8, white) with `table.w-full.min-w-[720px].table-fixed.text-sm`, `<colgroup>` first col **w-[84px]**, rest equal. Hidden ≤760 (replaced by mobile day-picker + slot list).
  - `thead th`: `border-b border-border p-2 text-left font-semibold text-secondary` → 14px/600 #657A83; first header **`Час`**, then day names.
  - Time cell `td`: `border-b border-border p-2 text-xs text-muted` — slot split on `-`/`–` into `block` lines (e.g. `09:35` / `10:55`).
  - Lesson cell `td`: `border-b border-border p-1 align-top`; button `min-h-[54px] w-full rounded-lg p-2 text-left`
    - filled: `bg-[var(--lesson-background)]` **#E4F6F5**, hover `brightness-95`; content: name `text-[13px] font-semibold text-primary`, teacher `text-[11px] text-secondary`, place `text-[11px] text-muted` (`Онлайн` / `{location|"Аудиторію не вказано"} · онлайн` for HYBRID / location).
    - empty: `border border-dashed border-border bg-transparent text-muted` + `text-xs` **`+ додати`** (hover `bg-[var(--surface-hover)]`).
- Mobile (≤760): day chips `rounded-full border px-3 py-1.5 text-xs font-semibold` (active `border-accent bg-accent text-on-accent`, else `border-border bg-surface text-secondary`); slot buttons `min-h-[58px] rounded-[14px] border p-3` — lesson `border-transparent bg-[var(--lesson-background)]`, empty `border-dashed border-border bg-surface text-muted` with `+ додати`.
- Inline edit form (opens on cell click): `rounded-[18px] border border-border bg-surface p-4`; `h3` `mb-3 text-base font-semibold` = `{DayName} · {timeSlot}`; grid `sm:grid-cols-2 gap-3`; labels `text-xs font-semibold text-secondary` gap-1: **`Дисципліна`**, **`Викладач`**, **`Аудиторія`** (placeholder `напр. 214`), **`Формат`** (select: `Офлайн`/`Онлайн`/`Гібрид`), **`Посилання на зустріч`** (full-width, placeholder `https://meet.google.com/…`).
  - Actions right-aligned: **`Скасувати`** (secondary), **`Зберегти`** (primary; `Збереження…` while saving), **`Видалити пару`** (`min-h-[38px] rounded-[10px] bg-[var(--danger-soft)] px-4 text-[var(--danger)]`, hover `bg-[var(--danger)] text-on-accent`).
  - Validation: missing name/teacher → error banner **`Заповніть назву дисципліни та викладача`**; success **`Пару збережено`** / **`Пару видалено`**.

### 8.6 TaskManager tab («Завдання»)
- Wrapper `flex flex-col gap-3`.
- Filter row `flex flex-wrap items-center justify-between gap-2`:
  - `label.flex.items-center.gap-2.text-sm.text-secondary` **`Дисципліна`** + select `max-w-[280px] flex-1 rounded-lg border border-border bg-input-background px-3 py-2` — options `Усі` + names.
  - Button **`+ Створити завдання`** (primary).
- Create form (when open): `rounded-[18px] border border-border bg-surface p-4`, grid `sm:grid-cols-2 gap-3`; fields: **`Дисципліна`** (select, `Оберіть дисципліну`), **`Назва`** (input), **`Опис`** (`textarea.min-h-[70px]`, full width), **`Дедлайн`** (`datetime-local`). Actions: **`Скасувати`** (secondary), **`Зберегти`** (primary).
- Table wrapper: `overflow-auto rounded-[18px] border border-border bg-surface`, `table.w-full.min-w-[680px].table-fixed.text-sm`; cols **40% / 24% / 18% / 118px** (last only when canEdit).
  - `thead tr`: `text-left text-secondary`; `th`: `border-b border-border p-3 font-semibold` — **`Завдання`**, **`Дисципліна`**, **`Дедлайн`**, (empty 4th).
  - Rows: name `font-semibold text-primary`; description `mt-1 line-clamp-2 text-xs text-muted`; discipline/deadline `text-secondary`; delete **`Видалити`** (danger button) right-aligned.
  - Empty: `td.p-4.text-muted` colSpan → **`Завдань ще немає`**.
- Mobile (≤760): cards `rounded-[14px] border border-border bg-surface p-3`; empty `Завдань ще немає`.

### 8.7 EventManager tab («Події», admin only)
- Wrapper `flex flex-col gap-3`; Banner first.
- Create/edit form: `rounded-[18px] border border-border bg-surface p-4`; `h3` `mb-3 text-base font-semibold` = **`Нова подія`** | **`Редагування події`**; grid `sm:grid-cols-2 gap-3`; labels `text-xs font-semibold text-secondary`, required mark `<span class="text-[var(--danger)]">*</span>`:
  - **`Назва *`**, **`Дата й час *`** (datetime-local), **`Місце *`**, **`Організатор (необов’язково)`**, **`Посилання на деталі або реєстрацію (необов’язково)`** (placeholder `https://`, full width), **`Опис *`** (textarea min-h 70, full width). Optional suffix `font-normal text-muted`.
  - Invalid field style: `border-[var(--danger)] ring-1 ring-[var(--danger)]`.
  - Actions: `Скасувати` (only when editing), primary **`Створити подію`** | **`Зберегти зміни`**.
- Filter bar: `flex flex-wrap items-end gap-3 rounded-[16px] border border-border bg-surface p-3` — **`Пошук`** (label xs/600; input placeholder `Назва, місце, організатор, опис`, `min-w-[200px] flex-1`), **`Період`** select `w-[180px]` (`Усі`/`Майбутні`/`Минулі`), button **`Скинути`** (secondary; shown only when filters active).
- List `flex flex-col gap-2`:
  - Empty all: `text-sm text-muted` **`Подій ще немає`**.
  - Empty filtered: `text-sm text-muted` **`За цими фільтрами подій немає`**.
  - Event card: `rounded-[16px] border border-border bg-surface p-4`; `h4` `text-base font-semibold text-primary`; meta `text-xs text-secondary` = `{dd month yyyy, HH:mm} · {place}`; description `mt-2 text-sm text-secondary`; actions **`Редагувати`** (secondary) + **`Видалити`** (danger).

### 8.8 StudentsManager tab («Студенти»)
- Wrapper `flex flex-col gap-4`; two Banners (local + action error).
- **Групи block** (admin only): `rounded-[18px] border border-border bg-surface p-4`;
  - `h2` `mb-3 text-base font-semibold` **`Групи`**.
  - Create row `mb-3 flex flex-wrap items-end gap-2`: label `text-xs font-semibold text-secondary` **`Нова група`** (input placeholder `напр. ІПЗ-21`) + primary **`+ Створити групу`** (disabled when empty).
  - Group chips `ul.flex.flex-wrap.gap-2`: `li.flex.items-center.gap-2.rounded-xl.border.border-border.bg-[var(--surface-muted)].px-3.py-2` → bg **#F5FAF9**, radius **14px**, px 12 py 8, 1px #DFEAE8.
    - Group name button `text-sm font-semibold` — active filter `text-accent` #079B98, else `text-primary`.
    - Rename button glyph **`✎`** `text-xs text-secondary hover:text-primary`; delete button glyph **`✕`** `text-xs text-[var(--danger)]`.
    - Count `text-xs text-muted` = `{n} студ.`
    - Rename mode: input `h-8 w-40` + **`Зберегти`** (`text-xs font-semibold text-accent`) + **`Скасувати`** (`text-xs text-secondary`).
- **Students block**: `overflow-auto rounded-[18px] border border-border bg-surface` (radius 18, 1px #DFEAE8, white).
  - Toolbar `flex flex-wrap items-center gap-2 border-b border-border p-3`: `span.text-sm.font-semibold.text-primary` **`Студенти`**; refresh icon button `ml-auto rounded-full p-1.5 text-secondary hover:bg-[var(--surface-hover)]` with SVG **16×16** (circular refresh arrow, stroke-width 2); optional link **`Показати всіх`** `text-xs text-accent underline`.
  - Table `min-w-[640px]`, headers `border-b border-border p-3 font-semibold` **`Студент`**, **`Група`**, **`Moodle`**, **`Остання синхронізація`**, **`Дії`** (admin).
  - Row cells `border-b border-border p-3`: name `font-semibold text-primary` + email `text-xs text-muted`; group select (`max-w-[220px]`, option `Без групи`) or `text-secondary` group name/`Без групи`; Moodle **`Прив’язано`** / **`Не прив’язано`**; sync time or **`Ще не синхронізовано`**; action **`Синхронізувати`** (button `min-h-[34px] rounded-[10px] border border-border bg-surface px-3 text-sm font-semibold text-secondary`, disabled when Moodle not linked, title `Синхронізувати з Moodle` / `Студент ще не підключив Moodle`).
  - Loading row: **`Завантаження студентів…`**; empty: **`Студентів не знайдено`** (`p-4 text-muted`).
  - Mobile (≤760): cards `rounded-[14px] border border-border bg-[var(--surface-muted)] p-3`, Meta line `Moodle: прив’язано|не прив’язано · {sync}`.

---

## 9. Shared async / error states (`ApiQueryStatus.tsx`)
- Signed out: `<p role="alert">` **`Увійдіть, щоб переглянути дані.`**
- Loading: `<p role="status" class="p-4 text-secondary">` — text per page: `Завантаження даних…` (default/Home), `Завантаження розкладу…`, `Завантаження календаря…`, `Завантаження дисциплін з Moodle…`, `Завантаження завдань з Moodle…`, `Завантаження подій…`.
- Error: `div.rounded-xl.bg-surface.p-4.text-primary` (radius 14, white, padding 16) — `Сесію не підтверджено. Увійдіть знову та повторіть спробу.` (401) or `Не вдалося завантажити дані. Спробуйте ще раз.` + button `mt-2 text-link hover:underline` **`Спробувати ще раз`**.

## 10. Gaps / not specified
- Breakpoints used: `max-[380px]`, `max-[420px]`, `max-[760px]`, `[761px]`, `max-[960px]`, `max-[1200px]`, `max-[1250px]`, `[@media(max-height:700px)]`, `[@media(min-height:800px)]`, plus Tailwind `sm` (640) `xl` (1280) `2xl` (1536) on Disciplines grid.
- Sidebar nav labels are **not visible text** — icons only, with `aria-label`/`title`.
- Schedule page has **no visible `h1`**; its 75px row holds only the toggle.
- No hover/pressed styling exists for: Home hero cards, FocusCard metrics (only `brightness-0.97`), Deadline chips, Event rows, day cells (only translateY).
- No transitions defined on Sidebar nav items beyond `transition-colors`; Header sync button has none.
