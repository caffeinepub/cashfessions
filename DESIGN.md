# Design Brief

## Direction

Cashfessions — A premium, editorial platform for sharing anonymous investment mistakes within investor communities.

## Tone

Editorial and sophisticated, treating confessions as respectable artifacts worthy of curation and sharing, not ephemeral gossip.

## Differentiation

Confessions rendered as discrete, shareable cards with metadata (tags, timestamps, controls) that elevate vulnerability to collective wisdom.

## Color Palette

| Token           | OKLCH           | Role                              |
| --------------- | --------------- | --------------------------------- |
| background      | 0.14 0.015 50   | Deep warm charcoal, primary base  |
| foreground      | 0.92 0.01 60    | Warm cream text, readable         |
| card            | 0.18 0.018 50   | Elevated surface, slightly lighter |
| primary         | 0.72 0.17 70    | Gold/amber, CTAs and highlights   |
| accent          | 0.62 0.16 200   | Teal, tags and secondary emphasis |
| muted           | 0.22 0.02 50    | Secondary backgrounds and borders |
| destructive     | 0.55 0.22 25    | Red, delete/flag actions          |

## Typography

- Display: Lora — Headings, hero text, editorial weight
- Body: Satoshi — Body copy, UI labels, readable warmth
- Mono: JetBrains Mono — Code, timestamps, system text
- Scale: Hero `text-4xl font-bold tracking-tight`, H2 `text-2xl font-semibold`, Label `text-xs font-semibold uppercase`, Body `text-base leading-relaxed`

## Elevation & Depth

Cards elevated with soft shadows (0 4px 6px) and subtle borders; minimal ambient light, focused on readable card hierarchy.

## Structural Zones

| Zone    | Background        | Border              | Notes                                      |
| ------- | ----------------- | ------------------- | ------------------------------------------ |
| Header  | `bg-card`         | `border-b border-border` | Sticky, minimal accent stripe above       |
| Content | `bg-background`   | —                   | Alternating card sections with 3rem gaps  |
| Footer  | `bg-muted/10`     | `border-t border-border` | Muted surface, acknowledges page boundary |

## Spacing & Rhythm

Generous 3rem gaps between section cards; 1.5rem internal padding on cards; micro-spacing via `gap-2` for tag groupings and metadata. Spacious, unrushed layout respects confession content.

## Component Patterns

- Buttons: Gold primary (`bg-primary text-primary-foreground`), teal secondary (`bg-accent text-accent-foreground`), subtle hover lift
- Cards: 6px radius, `bg-card` with `border border-border`, `shadow-md` on hover
- Badges (tags): Teal outline with `/10` background (`bg-accent/10 text-accent border border-accent/30`), 6px radius

## Motion

- Entrance: Fade-in over 300ms (staggered for card streams)
- Hover: Lift shadow and slight scale on cards (`transition-smooth`)
- Decorative: Timestamp "2 days ago" updates smoothly; no bouncy effects

## Constraints

- No raw colors; all tokens via CSS variables
- Cards always include metadata (tags, timestamp, controls) — never bare text
- Public feed uses card grid; owner dashboard uses same card system with delete/flag affordances
- Delete action uses destructive red only — no warning modals, direct UI

## Signature Detail

Gold accent on primary interactive elements within a warm charcoal aesthetic creates premium, financial authority while maintaining warmth and accessibility.
