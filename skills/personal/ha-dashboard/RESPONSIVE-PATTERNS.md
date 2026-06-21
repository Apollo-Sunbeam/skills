# Responsive Dashboard Patterns

Three proven patterns for making HA dashboards work across
iPhone (≈375 px), iPad (≈768 px), and laptop (≥1280 px).
Choose the pattern that fits the dashboard's purpose.

---

## Pattern A — Separate Views with Navbar

Best for: dashboards with distinct mobile and desktop information hierarchies.

Create two views — one mobile-optimised, one desktop — linked via
`custom:navbar-card` pinned to the bottom on mobile.

```yaml
views:
  - title: Home
    path: home-mobile
    type: masonry
    cards:
      - type: custom:navbar-card
        # ... navbar config
      - type: custom:simple-swipe-card
        cards:
          - # swipe group 1 — primary controls
          - # swipe group 2 — sensors
          - # swipe group 3 — media

  - title: Home Desktop
    path: home-desktop
    type: sections
    max_columns: 4
    sections:
      - # full grid layout
```

On the navbar, link between views using `navigate` tap actions. The mobile
view uses `custom:simple-swipe-card` groups to avoid vertical scrolling.

**Requires**: `custom:navbar-card`, `custom:simple-swipe-card` (both installed).

---

## Pattern B — Single Masonry View, Mobile-First Order

Best for: simpler dashboards where content hierarchy is the same on all devices.

HA's masonry layout auto-reflows: 1 column on phone, 2 on tablet, 3-4 on laptop.
Design with mobile column order in mind; wider screens get the same cards in more columns.

Rules:
- Put the most important card first in the YAML — it renders top-left on all sizes.
- Keep individual cards narrow (avoid full-width cards mid-list unless they're `panel`).
- Use `custom:simple-swipe-card` to group related cards that should swipe on mobile
  but appear side-by-side on desktop.
- Use `custom:tabbed-card` for secondary content that can be collapsed on mobile.

```yaml
views:
  - title: Overview
    type: masonry
    cards:
      - type: custom:mushroom-chips-card   # quick-glance strip, always full-width
        chips: [...]

      - type: custom:simple-swipe-card     # swipeable on phone; on desktop shows side by side
        cards:
          - type: custom:mushroom-template-card
            # ... room 1
          - type: custom:mushroom-template-card
            # ... room 2

      - type: custom:apexcharts-card       # energy / sensor chart
        # ...
```

**No extra requirements** — masonry is the HA default.

---

## Pattern C — Sections Layout (HA 2024.x+)

Best for: precise grid control, pixel-perfect layouts, and dashboards where
columns matter (e.g. a security camera wall or energy overview).

`type: sections` gives you explicit column control per section.

```yaml
views:
  - title: Energy
    type: sections
    max_columns: 3          # laptop default; auto-reduces on narrower screens
    sections:
      - type: grid
        column_span: 2      # takes 2 of 3 columns on desktop, full-width on mobile
        cards:
          - type: custom:apexcharts-card
            # main energy chart

      - type: grid
        column_span: 1
        cards:
          - type: custom:modern-circular-gauge
          - type: tile
            entity: sensor.grid_power
```

`column_span` collapses to full-width automatically on small screens —
no conditional logic needed for basic stacking.

**Note**: Sections layout is a native HA feature (no HACS required).

---

## Pattern D — Browser-Width Conditional Cards

Best for: showing fundamentally different card types per device
(e.g. a Google Map on desktop, a compact entity list on phone).

**Requires**: `browser_mod` integration (not yet installed — high-priority
recommendation). Once installed it creates entities like
`sensor.browser_<device_name>_width`.

With browser_mod:

```yaml
# Show map only on screens wider than 600 px
- type: conditional
  conditions:
    - condition: numeric_state
      entity: sensor.browser_main_width
      above: 600
  card:
    type: custom:google-map-card
    # ...

# Show compact list on phone
- type: conditional
  conditions:
    - condition: numeric_state
      entity: sensor.browser_main_width
      below: 600
  card:
    type: custom:mushroom-template-card
    # compact summary
```

Without browser_mod, use `custom:card-mod` with CSS media queries for
show/hide (visual only, not logical):

```yaml
- type: custom:apexcharts-card
  card_mod:
    style: |
      :host {
        display: none;
      }
      @media (min-width: 768px) {
        :host {
          display: block;
        }
      }
```

---

## Quick-reference: mobile UX checklist

- [ ] No horizontal scrolling — all cards fit within the viewport width
- [ ] Tap targets are at least 44 px tall (mushroom and tile cards pass; tiny entity rows may not)
- [ ] Primary action (most-used control) reachable without scrolling on iPhone
- [ ] Chart time ranges are short enough to read on a 375 px screen (1h or 24h max for mobile)
- [ ] Navigation between views is visible and thumb-reachable (navbar at bottom, not header only)
- [ ] Camera feeds use `custom:advanced-camera-card` lazy-load mode to avoid slow loads on LTE
