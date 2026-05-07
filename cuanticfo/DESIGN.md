---
title: CuantiCFO Design System
version: 1.0.0
generated: 2026-05-07
register: product
north_star: "The Report"
elevation: minimal-shadow
component_tone: measured
---

## 1. Overview

**Creative North Star:** The Report. Not a dashboard — a McKinsey exhibit. Each page answers exactly one question. Sections are structured, labels are precise, every chart earns its position. The interface feels like a document that happens to be interactive, not an app trying to look like a report.

**Mood:** Precise. Confident. Unhurried. The user is an intelligent business owner who opens this monthly and needs answers in under 30 seconds. The design respects that intelligence — no onboarding tooltips, no decorative motion, no filler.

**Visual keywords:** Tabular. Structured. Legible. Reserved.

**What this is not:** Not a consumer fintech app (no gradients, no gamification). Not generic B2B SaaS (no navy-blue icon-card grids). Not an AI-generated dashboard (no five identical KPI cards in a row).

---

## 2. Color System

All colors are defined as CSS custom properties in `src/app/globals.css` under `@theme inline`.

### Semantic roles

| Token | Value | Role |
|---|---|---|
| `--color-accent` | `#2563eb` | Primary interactive: links, active states, focus rings, primary CTA |
| `--color-accent-dark` | `#1d4ed8` | Accent hover / pressed |
| `--color-accent-light` | `#eff6ff` | Accent surface tint (icon backgrounds, hover bg) |
| `--color-accent-tint` | `#dbeafe` | Accent badge background |
| `--color-income` | `#16a34a` | Positive financial signal: profit, ingresos, upward trend |
| `--color-income-dark` | `#15803d` | Income hover / badge text |
| `--color-income-light` | `#f0fdf4` | Income surface tint |
| `--color-income-tint` | `#dcfce7` | Income badge background |
| `--color-expense` | `#dc2626` | Negative financial signal: loss, gastos, downward trend |
| `--color-expense-dark` | `#b91c1c` | Expense hover / badge text |
| `--color-expense-light` | `#fef2f2` | Expense surface tint |
| `--color-expense-tint` | `#fee2e2` | Expense badge background |
| `--color-alert-high` | `#dc2626` | Critical alert (reuses expense red — severity matches urgency) |
| `--color-alert-medium` | `#ea580c` | Warning alert: IVA due, cierre approaching |
| `--color-alert-medium-dark` | `#c2410c` | Warning badge text |
| `--color-warning` | `#d97706` | Amber: advisory, non-critical |
| `--color-warning-light` | `#fffbeb` | Warning surface tint |
| `--color-warning-tint` | `#ffedd5` | Warning badge background |
| `--color-cobrar` | `#7c3aed` | Accounts receivable — purple distinguishes from income green |
| `--color-cobrar-dark` | `#6d28d9` | Cobrar hover |
| `--color-cobrar-light` | `#faf5ff` | Cobrar surface tint |
| `--color-sidebar` | `#0f1729` | Sidebar background: deep navy, near-black |
| `--color-sidebar-hover` | `#1e2d4a` | Sidebar item hover |
| `--color-sidebar-active` | `#2563eb` | Sidebar active item indicator |
| `--color-sidebar-text` | `#ffffff` | Sidebar text and icons |
| `--color-app-bg` | `#f1f5f9` | Page background (slate-100) |
| `--color-card` | `#ffffff` | Card surface |
| `--color-border` | `#e2e8f0` | Borders, dividers (slate-200) |
| `--color-text-primary` | `#0f172a` | Headings, numbers, high-emphasis text |
| `--color-text-secondary` | `#64748b` | Body text, descriptions |
| `--color-text-muted` | `#94a3b8` | Labels, metadata, chart axes |
| `--color-text-contrast` | `#475569` | Medium-emphasis text (between secondary and primary) |
| `--color-scrollbar-thumb` | `#cbd5e1` | Scrollbar |

### Color strategy

**Restrained** — tinted neutrals with a single blue accent covering ≤10% of any surface. Financial semantic colors (income green, expense red, cobrar purple) are functional signals, not decoration. They appear only on numbers, badges, and trend indicators — never on backgrounds or card frames.

The sidebar is the only "color" surface: deep navy (#0f1729) provides structural contrast without competing with data.

### Encoding rule

Income and expense are always encoded with **both color and a directional icon** (TrendingUp / TrendingDown). Color alone is never used for financial directionality — this satisfies WCAG AA and supports color-blind users.

---

## 3. Typography

**Font stack:** `"Inter", system-ui, -apple-system, sans-serif`

Inter is set in `globals.css` and declared via `--font-sans`. Anti-aliasing is applied globally.

### Scale in use

| Use | Size | Weight | Class pattern |
|---|---|---|---|
| KPI hero number | 30–36px | 700 | `text-3xl md:text-4xl font-bold tracking-tight` |
| KPI compact number | 20px | 700 | `text-xl font-bold` |
| Section number | 24px | 700 | `text-2xl font-bold` |
| Card heading | 14px | 600 | `text-sm font-semibold` |
| Body / table row | 14px | 400/500 | `text-sm` |
| Label / metadata | 12px | 400 | `text-xs` |
| KPI label (allcaps) | 11px | 600 | `text-[11px] font-semibold uppercase tracking-[0.09em]` |
| Micro / badge | 10–11px | 500–700 | `text-[10px]` / `text-[11px]` |

### Typographic rules

- KPI labels use `uppercase tracking-[0.09em]` — they read as field identifiers, not headings.
- Financial numbers use `font-bold tracking-tight` at all sizes — tabular figures, no orphaned decimals.
- Body line length caps at ~65ch in the content container.
- Two-level hierarchy minimum per card: the label must be at least 1.5 steps lighter/smaller than its value.

---

## 4. Elevation + Shadow

**Strategy: Minimal shadow** — one active elevation level. Cards sit above the page background. Nothing sits above cards except dropdowns and modals.

| Layer | Shadow | Use |
|---|---|---|
| Page | none | `--color-app-bg` (#f1f5f9) — the base |
| Card | `0 1px 3px rgba(0,0,0,0.04)` + `border: 1px solid var(--color-border)` | All `.card` surfaces |
| Card hover | `0 4px 12px rgba(0,0,0,0.08)` + `translateY(-1px)` | `.card-hover` interactive cards only |
| Floating | `0 8px 24px rgba(0,0,0,0.12)` | Dropdowns, popovers |
| Modal | `0 20px 48px rgba(0,0,0,0.18)` | Modals only; include a backdrop |

**Rules:**
- Never nest a card inside a card. Cards contain data, not other cards.
- The 1px border on `.card` is structural — it defines the card in all ambient light conditions, not just when the shadow is visible.
- Do not add elevation to list items, rows, or inline elements. Elevation is for surfaces that contain content, not for the content itself.

---

## 5. Components

### Card

```css
.card {
  background-color: var(--color-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.card-hover {
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card-hover:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}
```

- `border-radius: 12px` — rounded but not playful. Not 4px (too rigid), not 20px (too soft).
- Use `.card-hover` only on navigable / interactive cards, not on static data panels.

### KPI: Featured

Primary metric. The number is the identity of the card.

```tsx
<div className="card p-6 flex flex-col">
  <p className="text-[11px] font-semibold uppercase tracking-[0.09em]"
     style={{ color: 'var(--color-text-muted)' }}>
    {label}
  </p>
  <p className="text-3xl md:text-4xl font-bold tracking-tight leading-none mt-3"
     style={{ color: 'var(--color-text-primary)' }}>
    {formatCLP(value)}
  </p>
  <div className="flex items-center gap-2 mt-2">
    <TrendingUp size={13} style={{ color: trendColor }} />
    <span className="text-sm font-semibold" style={{ color: trendColor }}>
      {formatPct(variacion_pct)}
    </span>
    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
      {variacion_label}
    </span>
  </div>
  {/* sparkline at mt-auto pt-5 h-10 opacity-40 */}
</div>
```

No icon circle — the number IS the message. Featured KPIs use `tipo === 'resultado' | 'caja'` (the two primary questions: Am I profitable? Do I have cash?).

### KPI: Compact

Supporting metrics in a strip, no card wrapper — parent provides the surface.

```tsx
<div className="px-5 py-4">
  <p className="text-[11px] mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
    {label}
  </p>
  <p className="text-xl font-bold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
    {formatCLP(value, true)}  {/* abbreviated: $25,4M */}
  </p>
  <div className="flex items-center gap-1 mt-1">
    <TrendingUp size={11} />
    <span className="text-xs font-semibold">{formatPct(variacion_pct)}</span>
    <span className="text-[11px]">{variacion_label}</span>
  </div>
</div>
```

Compact KPIs (ingresos, gastos, IVA) live in a single shared card with `divide-x` borders between them.

### Dashboard KPI section pattern

```tsx
{/* Primary: 2 featured cards, 2-col grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
  {primaryKpis.map(kpi => <KpiCard variant="featured" />)}
</div>
{/* Supporting: 3 compact sections inside one card */}
<div className="card overflow-hidden">
  <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)]">
    {supportingKpis.map(kpi => <KpiCard variant="compact" />)}
  </div>
</div>
```

This pattern is intentional. Five equal KPI cards is the hero-metric template (anti-pattern). Two primary questions at full scale, three supporting metrics in a strip, preserves hierarchy.

### Badge

```tsx
// badge-green, badge-red, badge-orange, badge-blue, badge-gray
<span className="badge-green text-xs font-semibold px-2 py-0.5 rounded-full">
  Pagado
</span>
```

Badges use `tint` background + `dark` text. Never use saturated background on badges — the color communicates category, not urgency.

### Amount display

```tsx
<span className="amount-positive">{formatCLP(value)}</span>  // income green
<span className="amount-negative">{formatCLP(value)}</span>  // expense red
<span className="amount-neutral">{formatCLP(value)}</span>   // text-primary
```

Always pair with a TrendingUp/TrendingDown icon or explicit +/- label when direction matters.

### Sidebar

```css
background: var(--color-sidebar);   /* #0f1729 deep navy */
color: var(--color-sidebar-text);   /* #ffffff */
/* Active item: left accent bar via background-color on the indicator element */
/* Hover item: var(--color-sidebar-hover) #1e2d4a */
```

Sidebar is the only opinionated surface. It is always dark regardless of light/dark mode. Active links use `aria-current="page"`.

### Focus ring

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}
```

Applied globally. Never suppress it with `outline: none` without providing an equivalent visible indicator.

---

## 6. Motion

**Philosophy:** Motion is functional, not decorative. Animation should either communicate state change or reduce perceived latency — nothing else.

| Token | Value | Use |
|---|---|---|
| Page enter | `fadeIn 0.3s ease` | `.animate-fade-in` on route-level wrappers |
| Card hover lift | `transform 0.2s ease` | `.card-hover` translateY(-1px) |
| Sidebar slide | `slideIn` translateX | Mobile drawer entrance only |
| Dropdown open | `0.15s ease-out` | Opacity + scale from origin |

**Rules:**
- Never animate layout properties (width, height, top, left). Animate transform and opacity only.
- Ease-out curves only. No bounce, no elastic, no spring.
- All animations respond to `prefers-reduced-motion: reduce` — global override in globals.css collapses all durations to 0.01ms.
- Page transitions: fade only. No slide, no zoom, no flip.
