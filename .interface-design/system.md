# MedTupa — design system

Extracted from `style.css` and the four HTML pages on 2026-05-12. This documents the system the code is *already trying to follow* so future work can audit against it. Items marked **drift** are inconsistencies the current code shows.

## Foundations

### Spacing

Base: **4px** grid (the system the code is reaching for, not strictly enforced).

Canonical scale (rem, with px equivalents at 16px base):

| token | rem    | px   | typical use                              |
|-------|--------|------|------------------------------------------|
| 1     | 0.25   | 4    | tight icon gap, pill inner gap           |
| 2     | 0.5    | 8    | row gaps, small inner padding            |
| 3     | 0.75   | 12   | card inner gaps, section sub-spacing     |
| 4     | 1      | 16   | default block gap                        |
| 5     | 1.25   | 20   | card padding, page horizontal padding    |
| 6     | 1.5    | 24   | section vertical rhythm, page title pad  |
| 8     | 2      | 32   | desktop horizontal padding               |

**Drift:** the codebase uses ~23 distinct rem values, many off-grid (`0.35, 0.45, 0.55, 0.65, 0.85, 0.92, 1.05, 1.15`). Audit should consolidate to the 7 above.

### Radius

| token            | value  | use                                  |
|------------------|--------|--------------------------------------|
| `--radius-sm`    | 10px   | inputs, buttons, small surfaces      |
| `--radius`       | 16px   | cards, indications, pharmacy panels  |
| `--radius-lg`    | 20px   | reserved (currently unused)          |
| (pill)           | 999px  | badges, tags, status chips           |
| (icon tile)      | 12px   | icon-tile squares, nav icon wrap     |

**Drift:** raw `10px` and `12px` are inline rather than tokenized. Promote `12px` to `--radius-tile` and replace inline literals with the tokens.

### Color

Tokens (canonical — keep these, replace inline literals with them):

```
Surface        --bg          #f4f3ee
               --surface     #ffffff

Text           --ink         #0f172a   primary
               --ink-2       #1e293b   secondary heading
               --muted       #64748b   meta, captions
               --muted-2     #94a3b8   placeholder, footer

Borders        --border      #e5e7eb
               --border-soft #eef0f2

Blue           --blue           #1e4d8b   primary brand
               --blue-dark      #143769
               --blue-darker    #0d2a52   (== nav bg, see drift)
               --blue-light     #e8f0fb

Green          --green       #2d7a4f
               --green-dark  #1f5e3a
               --green-mint  #b8e6c8

Red            --red         #dc2626
               --red-soft    #fde2e2

Purple         --purple      #7c3aed
               --purple-soft #ede4f6

Warn / amber   --warn        #b45309
               --warn-bg     #fef3c7
```

**Drift to fix in audit:**
- `#fbbf24` / `#f59e0b` (btn-primary) → add `--amber` / `--amber-hover` tokens
- `#0f2a52` (bottom nav bg) → use `--blue-darker` (same hue family, 1-digit shift)
- `#fbd0d0` (emergency hover) → add `--red-soft-hover` or derive from `--red`
- `#f3f6f4` (btn-white hover) → add `--surface-hover`
- `#eef0f2` (status-closed bg) → use `--border-soft` (same value)
- `rgba(220, 38, 38, 0.14)` emergency border → derive from `--red`

### Typography

Stack: system fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...`).

Scale (rem):

| role                | size    | weight | line-height |
|---------------------|---------|--------|-------------|
| nav label           | 0.72    | 600    | 1.2         |
| caption / footer    | 0.75    | 500    | 1.5         |
| pill / tag          | 0.78    | 600    | 1           |
| status              | 0.82    | 600    | 1           |
| body small          | 0.88    | 400    | 1.45        |
| body                | 0.95    | 400    | 1.5         |
| section heading     | 1.05    | 700    | 1.2         |
| page title          | 1.4     | 700    | 1.2         |
| greeting (mobile)   | 1.55    | 700    | 1.2         |
| greeting (desktop)  | 1.95    | 700    | 1.2         |

Letter-spacing `-0.01em` on the two largest headings.

**Drift:** body/heading sizes include four near-duplicates (`0.85, 0.88, 0.9, 0.92, 0.95`). Pick three rungs (e.g. `0.82` / `0.88` / `0.95`) and collapse the rest.

## Depth

**Strategy: subtle elevation + soft borders.** The system uses shadows for "raised" surfaces (cards) and borders for "framed" surfaces (inputs, empty states).

| token         | value                                      | use                                    |
|---------------|--------------------------------------------|----------------------------------------|
| `--shadow-sm` | `0 1px 2px rgba(15, 23, 42, 0.04)`         | every card, indication, pharmacy panel |
| `--shadow-md` | `0 4px 16px rgba(15, 23, 42, 0.06)`        | reserved (currently unused)            |
| border        | `1px solid var(--border)`                  | search inputs, empty-state panels      |
| border-soft   | `1px solid var(--border-soft)`             | header dividers                        |
| nav lift      | `0 -6px 20px rgba(15, 23, 42, 0.15)`       | fixed bottom nav (one-off)             |

Rule: cards never carry both a visible border and a shadow. Pick one per surface tier.

**Drift:** `--shadow-md` is declared but never used — either adopt it for a "raised hover" state or delete it.

## Patterns

### Card (`.card`)

```
background: var(--surface)        (or --blue / --green / --blue-darker for colored variants)
border-radius: var(--radius)      16px
padding: 1.25rem                  (= spacing-5)
box-shadow: var(--shadow-sm)
```

Variants: default white, `.card-blue`, `.card-green`, `.card-navy`. Colored variants use white text and pair with `.btn-white`.

### Info card (`.info-card`)

Centered icon (48px tile, 56px on desktop) → title (1.05rem, 700) → paragraph (0.88rem, 0.92 opacity). Sits inside a colored `.card` variant. Vertical, marketing-style.

### Feature card (`.feature-card`)

Horizontal: icon tile (42px, 12px radius, tinted bg) + body (title 0.95rem/700, paragraph 0.85rem muted, optional "more" link 0.85rem blue/600).

Compact variant (`.feature-card.compact`): 34px tile, smaller text, single-row link with a chevron trailing icon.

### Button (`.btn`)

```
padding: 0.85rem 1.25rem
border-radius: 10px               (= --radius-sm)
font-size: 0.95rem
font-weight: 600
width: 100%
```

Variants:
- `.btn-primary` — amber (`#fbbf24` → hover `#f59e0b`), ink text. Used on the search card.
- `.btn-white` — white on colored cards; ink color matches the parent variant.

### Pill / tag / badge / status

All share `border-radius: 999px`, inline-flex, 600 weight. Differences are size and color pairing:

- `.badge` — green-mint bg, green-dark text, has a 6px dot via `::before`
- `.tag` — blue-light bg, blue text, small (0.75rem)
- `.status` — bg+text from open/closed state, 6px dot via `::before`

Always pair a soft tinted background with the saturated version of the same hue for text.

### Icon tile

42px square (34px compact), 12px radius, tinted background (`*-soft` or `*-mint` or `*-light`) with matching saturated ink (`--red`, `--purple`, `--green-dark`, `--warn`, `--blue`). Used in feature cards and program headers (40px in program headers).

### Inputs (`.search-input`)

White surface, 1px `--border`, `--radius-sm` (10px), `0.65–0.7rem` × `0.9rem` padding, leading icon in `--muted`. Focus ring: `--blue` border + `0 0 0 3px var(--blue-light)`.

## Layout

Single-column mobile shell with a fixed bottom nav; widens to a grid on desktop.

| breakpoint | `.app` max-width | landing grid              | lists                  |
|------------|------------------|---------------------------|------------------------|
| < 760      | 460px            | single column             | single column          |
| ≥ 760      | 1200px           | 2 columns (`.wide` spans) | 2 columns              |
| ≥ 960      | 1200px           | 3 columns                 | 2 columns              |
| ≥ 1100     | 1200px           | 3 columns                 | 3 columns              |
| ≥ 1280     | 1320px           | 3 columns                 | 4 columns              |

Bottom nav matches `.app` width and rounds its top corners on desktop. Page horizontal padding: `1.25rem` mobile, `2rem` desktop (header/emergency strip), `1rem` content sections on desktop.

## Open questions for next steps

1. **Spacing scale enforcement** — codebase uses many off-grid values. Audit pass should collapse to the 7-rung scale above.
2. **Amber as a token** — primary CTA is amber, declared inline. Promote to `--amber` / `--amber-hover` (or rename to a semantic `--accent`).
3. **Shadow-md adoption** — unused; either delete or use for a hover state on cards.
4. **Typography rungs** — collapse near-duplicates (0.85 / 0.88 / 0.9 / 0.92).
