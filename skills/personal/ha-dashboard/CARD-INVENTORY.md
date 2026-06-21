# HA Card Inventory

Live-registered HACS frontend resources for this HA instance (46 total),
organised by category. All are loaded as ES modules unless noted.

---

## Layout & Navigation

| Card | Tag | Notes |
|------|-----|-------|
| Card Mod | `custom:card-mod` | Per-card CSS — the go-to for style overrides |
| Navbar Card | `custom:navbar-card` | Bottom nav bar; ideal for mobile primary nav |
| Simple Swipe Card | `custom:simple-swipe-card` | Horizontal swipe container — great for mobile groups |
| Tabbed Card | `custom:tabbed-card` | Inline tab switcher within a view |
| Streamline Card | `custom:streamline-card` | Template system to DRY repeated card patterns |
| HA Floorplan | `custom:floorplan-card` | SVG-based interactive floor plan |

## Mushroom Suite

All cards from `lovelace-mushroom` are available:

`mushroom-template-card` · `mushroom-entity-card` · `mushroom-light-card` ·
`mushroom-climate-card` · `mushroom-media-player-card` · `mushroom-chips-card` ·
`mushroom-fan-card` · `mushroom-cover-card` · `mushroom-person-card` ·
`mushroom-vacuum-card` · `mushroom-number-card` · `mushroom-select-card` ·
`mushroom-alarm-control-panel-card` · `mushroom-lock-card`

## Charts & Data Visualisation

| Card | Tag | Best for |
|------|-----|----------|
| ApexCharts | `custom:apexcharts-card` | Time-series, bar, radial — primary chart choice |
| Mini Graph | `custom:mini-graph-card` | Inline sparklines on entity rows |
| Plotly Graph | `custom:plotly-graph-card` | Interactive/zoomable charts |
| Statistics Graph Chart | `custom:statistics-graph-chart-card` | Long-range HA statistics |
| Modern Circular Gauge | `custom:modern-circular-gauge` | KPI dials and circular progress |
| Swiss Army Knife | `custom:swiss-army-knife-card` | SVG-based fully custom cards |
| Background Graph Entities | `custom:background-graph-entities` | History graph watermark behind entity list |
| Temperature Heatmap | `custom:temperature-heatmap-card` | Room-over-time heat maps |
| TimeFlow Card | `custom:timeflow-card` | Timeline / schedule visualisation |

## Weather & Environment

| Card | Tag |
|------|-----|
| Weather Forecast | `custom:weather-forecast-card` |
| Hourly Weather | `custom:hourly-weather` |
| Clock Weather | `custom:clock-weather-card-hui-icons` |
| Lunar Phase | `custom:lunar-phase-card` |

## Lighting

| Card | Tag |
|------|-----|
| Light Entity Card | `custom:light-entity-card` |
| Light Card Hue Feature | `custom:light-card-hue-feature` |
| Slider Button Card | `custom:slider-button-card` |
| Better Thermostat UI | `custom:better-thermostat-ui` |
| Mini Climate Card | `custom:mini-climate-card` |

**Icon sets available**: `hue:` (hass-hue-icons), `custom:` (custom-icons)

## Vehicle & Tracking

| Card | Tag |
|------|-----|
| Ultra Vehicle Card | `custom:ultra-vehicle-card` |
| Vehicle Status Card | `custom:vehicle-status-card` |
| Google Map Card | `custom:google-map-card` |
| HA Map Card | `custom:map-card` |

## Aviation (Jets subsystem)

| Card | Tag |
|------|-----|
| FlightRadar Flight Card | `custom:flightradar-flight-card` |
| Avinor Flight Card | `custom:avinor-flight-card` |
| FR24 Card | `custom:fr24-card` |

## Media & Calendar

| Card | Tag |
|------|-----|
| Upcoming Media Card | `custom:upcoming-media-card` |
| Calendar Card Pro | `custom:calendar-card-pro` |

## Cameras & Security

| Card | Tag |
|------|-----|
| Advanced Camera Card | `custom:advanced-camera-card` |

## Scheduling & Automation

| Card | Tag |
|------|-----|
| Scheduler Card | `custom:scheduler-card` |

## HTML / Template Cards

| Card | Tag | Notes |
|------|-----|-------|
| Tailwind CSS Template | `custom:tailwindcss-template-card` | Full Tailwind + Jinja2 in HTML |
| HTML Template Card | `custom:html-template-card` | Jinja2 rendered HTML |
| HTML Card | `custom:html-card` | Raw HTML (loaded as CSS resource) |
| AC Monitor Card | `custom:ac-monitor-card` | Local custom — ApexCharts AC monitoring |

## Miscellaneous

| Card | Tag |
|------|-----|
| Summary Card | `custom:summary-card` |
| Vacuum Card | `custom:vacuum-card` |
| Ultra Card | `custom:ultra-card` |

---

## Recommended — Not Yet Installed

These are high-impact additions worth suggesting to the user when they'd
meaningfully improve a dashboard design.

### High priority

| Name | HACS ID | Why it matters |
|------|---------|---------------|
| **Browser Mod** | `browser_mod` | Creates `sensor.browser_<id>_width` and `height` entities — unlocks true responsive conditional cards (show card A on mobile, card B on desktop) |
| **Layout Card** | `lovelace-layout-card` | CSS Grid / horizontal / vertical layouts with explicit responsive breakpoints — the most powerful layout primitive available |
| **Button Card** | `lovelace-button-card` | The gold standard for custom-styled entity buttons; template inheritance, state-based icons/colours, action handlers |
| **Auto Entities** | `lovelace-auto-entities` | Dynamically populates card lists from entity filters — eliminates manual entity maintenance |
| **Stack in Card** | `lovelace-stack-in-card` | Groups cards visually without borders/gaps — essential for clean composition |

### Medium priority

| Name | HACS ID | Why it matters |
|------|---------|---------------|
| **Config Template Card** | `lovelace-config-template-card` | Template expressions inside card config properties (not just display values) |
| **Fold Entity Row** | `lovelace-fold-entity-row` | Collapsible entity groups in an entities card |
| **Multiple Entity Row** | `lovelace-multiple-entity-row` | Inline secondary entities on an entities card row |
| **Swipe Navigation** | `lovelace-swipe-navigation` | Swipe left/right between dashboard views on mobile |
| **Expander Card** | `lovelace-expander-card` | Accordion-style expandable card sections |

### Aesthetic / brand

| Name | HACS ID | Why it matters |
|------|---------|---------------|
| **Bubble Card** | `bubble-card` | iOS-native-feeling popup controls, chips, and separators — stunning on mobile |
| **Mushroom Themes** | `mushroom-themes` | Theme pack tuned for the mushroom suite |
| **Animated Background** | `lovelace-animated-background` | Time-of-day or weather-reactive backgrounds |
