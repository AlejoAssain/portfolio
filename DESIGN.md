---
name: Alejo Assain — Portfolio
description: A warm, friendly coder/hacker portfolio on a dark green-tinted ground — not the movie-hacker cliché.
colors:
  paper: "#151A14"
  surface: "#1D231B"
  ink: "#EAEDE4"
  ink-soft: "#9BA394"
  code: "#6BA5FF"
  signal: "#FF6B4A"
  line: "#2C332A"
typography:
  display:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "normal"
  h1:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.1
  h2:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 500
    lineHeight: 1.15
  h3:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 500
    lineHeight: 1.2
  h4:
    fontFamily: "Familjen Grotesk, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.25
  body-lg:
    fontFamily: "General Sans, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.01em"
  body:
    fontFamily: "General Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0.01em"
  body-sm:
    fontFamily: "General Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.01em"
  mono-xs:
    fontFamily: "Commit Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  sharp: "0px"
  sm: "6px"
  md: "20px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"
  3xl: "96px"
  4xl: "144px"
---

# Design System: Alejo Assain — Portfolio

## Overview

**Creative North Star: "The Warm Terminal at Night"**

A developer portfolio in coder/hacker visual language, run on a dark,
green-tinted ground — but warm and habitable, not the "hacker movie"
cliché of Matrix green, glows, scanlines, and decorative terminal chrome.
The dark background is a deliberate tone choice, not an alternate theme:
there is no light/dark toggle.

The accent blue is derived directly from the illustrated character: his
hoodie is `#6787B8` (258.7° in OKLCH — the project's operative color
space, since `index.css` and Tailwind v4 both work in OKLCH). The
system's primary accent, Código (`#6BA5FF`, 258.9° OKLCH), sits 0.2°
from the hoodie — the same hue, lifted in luminosity and chroma so it
reads as legible UI color while still belonging to the character's
world. A discarded violet-blue (`#7B8CFF`, 274.7° OKLCH) marks the line
not to cross: at that hue distance it reads as a coordination error, not
intentional contrast. Author every color token in OKLCH, not HSL —
these hues were originally quoted in HSL (~217°/~232°), and a raw `217`
interpreted as an OKLCH hue lands on cyan, not this blue. The warm
secondary accent, Señal (`#FF6B4A`, 34.1° OKLCH), sits roughly opposite
both on the wheel.

The system spends its audacity in exactly one place — the character's
hood dropping over his head, played as a scrubbed video tied to scroll
position — and stays disciplined everywhere else: section reveals, hover
states, and page transitions all run the same restrained snap-ease, no
surprises, no bounce or elastic in any role.

**Implementation status:** the tokens below are wired into `src/index.css`
as Tailwind v4 `@theme` custom properties (colors, radii, spacing, the 9
type scales, easings/durations), with shadcn's semantic variables
(`--background`, `--primary`, `--border`, etc.) aliased to the new
palette so existing components inherit it without per-file edits.
Familjen Grotesk, General Sans, and Commit Mono are self-hosted via
`@font-face` (`public/fonts/`). What's still open: individual components
largely use their original ad-hoc Tailwind classes rather than the new
`text-display` / `font-display` / `text-h1`-style utilities, so most
copy still renders in the fallback sans rather than Familjen Grotesk —
and the character/hero (`Hero.tsx`, `useHeroAnimation.ts`,
`public/character/alejo-hood-transition.mp4`) hasn't been re-themed
component-by-component yet. Re-run `/impeccable document` once that
pass lands to confirm no drift.

**Key Characteristics:**
- Dark, green-tinted ground — never neutral gray, never blue-charcoal, never pure black.
- One accent color at a time: terminal blue by default, warm orange-red only for sparse emphasis, never both on one element.
- No glows, ever — on dark backgrounds glow is the number-one movie-hacker tell.
- Elevation by value shift and hairline border, never by shadow — shadows don't read on a dark ground.
- One animated signature moment (the hood-drop video, scroll-scrubbed); everything else is quiet, deliberate motion.

## Colors

A near-black, green-tinted ground with a lifted terminal blue as the confident single accent; warmth is rationed to one secondary color used sparingly, and elevation reads through value, not shadow.

### Primary
- **Terminal Blue** (`#6BA5FF`, 258.9° OKLCH): The default accent — links, primary CTAs, focus, highlights. Sits 0.2° from the character hoodie's hue (`#6787B8`, 258.7° OKLCH) in OKLCH, lifted in luminosity/chroma to read on dark and stay legible as UI color.

### Secondary
- **Signal Orange-Red** (`#FF6B4A`): Used sparingly for hover states, warnings, and micro-emphasis only — never alongside Terminal Blue on the same element. If it shows up in more than two spots per viewport, it's overused.

### Neutral
- **Deep Green-Black** (`#151A14`): Base background. Near-black tinted cool-green — never neutral gray, never blue-charcoal, never pure `#000`.
- **Raised Green Surface** (`#1D231B`): Cards, panels, alternating sections. Used with restraint — if everything is elevated, nothing is.
- **Broken White Ink** (`#EAEDE4`): Primary text. Broken white, never pure `#FFF`.
- **Soft Sage Ink** (`#9BA394`): Secondary text, captions, metadata, inactive states.
- **Faint Green Line** (`#2C332A`): Borders, dividers, hairlines — the primary tool for separating surfaces instead of shadow.

### Named Rules
**The One Accent Rule.** Terminal Blue and Signal Orange-Red never compete on the same element. Terminal Blue is the default; Signal Orange-Red appears only in isolated moments of emphasis.

**The No-Glow Rule.** No text or border ever carries a color halo (`text-shadow`, glow, or blur-based emphasis). It's the single biggest tell of the "hacker movie" look this system explicitly rejects.

**The Elevation-by-Value Rule.** Shadows don't read on a dark ground — `box-shadow` is banned as a hierarchy tool. A panel separates by rising to Raised Green Surface and/or a 1px Faint Green Line border, never by shadow.

**The OKLCH-Only Rule.** Author every color token in OKLCH, never HSL — it's the project's operative color space (`index.css` and Tailwind v4 both work in OKLCH). These hues were originally quoted in HSL; a raw `217` written as an OKLCH hue lands on cyan, not Terminal Blue.

## Typography

**Display Font:** Familjen Grotesk (with system-ui, sans-serif fallback)
**Body Font:** General Sans (with system-ui, sans-serif fallback)
**Label/Mono Font:** Commit Mono (with ui-monospace, monospace fallback)

**Character:** A geometric display face with rounded terminals — technical but not the generic portfolio-tech grotesk — paired with a humanist body face chosen for long-form bio readability over the reflexive Inter default. Commit Mono, a face designed specifically for code, marks anything terminal-flavored: timestamps, experience periods, skill tags. On dark, mono stays strictly in that narrow role — monospacing more than that is exactly what tips "friendly coder" into "90s hacker movie."

**Dark-ground weight compensation (halation).** Light text on dark reads heavier than the same weight on light. Compensate: drop one weight step versus a light-mode equivalent (600 becomes 500), body text stays at 400 and never goes to 500, and add `letter-spacing` — `0.01em` on body sizes, `0.02em` on mono-xs. Display weights (500–700) are exempt: at large sizes halation doesn't hurt and the character needs the weight.

### Hierarchy
- **Display** (600, `clamp(2.5rem, 6vw, 5.5rem)` / 88px desktop, 1.05 line-height): Hero headline only.
- **H1** (600, `clamp(2.5rem, 5vw, 3.75rem)` / 60px desktop, ~40px mobile): Page title.
- **H2** (500, 44px): Section titles.
- **H3** (500, 32px): Card titles.
- **H4** (500, 24px): Subtitles.
- **Body Large** (400, 19px, `0.01em` tracking): Lead paragraphs, section intros.
- **Body** (400, 16px, `0.01em` tracking): Base paragraph text.
- **Body Small** (400, 14px, `0.01em` tracking): Auxiliary text, captions.
- **Mono XS** (400, 13px, mono, `0.02em` tracking): Mono labels, timestamps — experience periods, skill tags when set in mono.

Scale runs on a 1.25 ratio from a 16px base, fluid via `clamp()` between mobile and desktop.

### Named Rules
**The No-Inter Rule.** Body copy runs on General Sans, not the reflexive Inter default most AI-generated portfolios reach for.

**The One Weight Step Down Rule.** Any body-range weight that would be 600 on a light background drops to 500 on this dark one; paragraph text never exceeds 400.

## Layout

No column-grid system — a fixed container and gutter set the frame, and content inside arranges with flex/grid per section. Spacing runs on the strict 4px base scale (xs 4px → 4xl 144px; see frontmatter `spacing`), and both gutter and section rhythm are drawn directly from it.

- **Container** (`1200px` max): `max-width: 1200px; margin-inline: auto;` plus the gutter as `padding-inline`. Everything lives inside this except the one full-bleed exception below.
- **Prose measure** (`68ch` max): Applies to paragraphs and long-form text blocks only — bio, project descriptions. Never card grids, never the hero. Measured in `ch`, not px, so it self-adjusts if the typeface changes.
- **Gutter** (`md` → `xl` → `2xl`, i.e. 16px mobile → 40px tablet → 64px desktop): Minimum lateral breathing room, scaling by breakpoint.
- **Section rhythm** (`3xl` → `4xl`, i.e. 96px mobile → 144px desktop): Vertical separation between sections.

Typography and spacing both lean on `clamp()`-driven fluid scaling between mobile and desktop rather than hard breakpoint jumps, except where the gutter/rhythm table above steps discretely.

### Named Rules
**The One Full-Bleed Rule.** Only the hero with the character breaks the container by default, spanning the full viewport width. Any other full-bleed section is an explicit decision, not a free-for-all.

## Elevation & Depth

Flat by design, not by omission: `design/direction.md` explicitly bans `box-shadow` as a hierarchy tool because shadows don't read against a dark ground. Depth comes from two tools only — rising from Deep Green-Black to Raised Green Surface, and a 1px Faint Green Line hairline border. Large surfaces stay on the base Deep Green-Black; Raised Green Surface is used with restraint so elevation stays meaningful.

## Shapes

Radii are deliberately non-uniform, chosen per element role rather than applied as one global default:

- **Sharp** (`0px`): Code blocks and other technical elements — the one place corners stay literally square.
- **Small** (`6px`): Buttons, inputs, badges.
- **Medium** (`20px`): Cards, panels.
- **Pill** (`999px`): Toggles, tags, pills.

## Components

Component-level color/shape rules below follow directly from the tokens above; no component has been restyled to this system in code yet (see Overview → Implementation status), so treat states beyond what's listed as open during implementation.

### Buttons
- **Shape:** Small radius (`6px`).
- **Primary:** Terminal Blue background, Deep Green-Black text — the default CTA color.
- **Secondary / emphasis moments:** Signal Orange-Red, used in isolation per the One Accent Rule — never combined with a Terminal Blue element in the same view. No glow on focus or hover.

### Chips / Tags
- **Shape:** Pill radius (`999px`).
- Skill tags and similar labels may use Mono XS type per the mono-for-terminal-flavored-copy rule.

### Cards / Containers
- **Corner Style:** Medium radius (`20px`).
- **Background:** Raised Green Surface (`#1D231B`) against the Deep Green-Black page background.
- **Border:** Faint Green Line hairline where separation is needed, in place of shadow.
- **Elevation:** Value shift only — never `box-shadow`.

### Signature Component: Hero Hood-Drop Video
The site's one signature, animation-driven element. Asset: `public/character/alejo-hood-transition.mp4` — H.264, 1220×1186, 24fps, 5.56s, 134 frames (all-intra encoded, so it scrubs without re-encoding), 4.2MB, pure black `#000000` background, no alpha channel.

- **Playback:** never autoplay. `currentTime` is bound directly to ScrollTrigger's scroll progress with `scrub` — the user drives the gesture in both directions.
- **Compositing:** the video's black background is removed with `mix-blend-mode: screen`, not an alpha channel — screen-against-black returns whatever sits behind it, so the video's background disappears without cropping, WebM, or an HEVC fallback for Safari. This requires a very dark surface directly behind the video; it works against Deep Green-Black (`#151A14`) and fails against any light surface.
- **iOS Safari risk:** `mix-blend-mode` on `<video>` has had bugs there — verify explicitly. Fallback: extract the 134 frames to WebP with a lumakey and scrub over `<canvas>` instead.
- **Dark zones of the character:** hair and glasses render near-black and may blend into the background on Deep Green-Black. This is acceptable, even desired, as a "character emerging from darkness" effect — but it's a decision, not an oversight. If a legible silhouette is wanted instead, resolve it with rim light baked into the asset, or place the character over Raised Green Surface (`#1D231B`). Adding a glow is not an option (see No-Glow Rule).

A second flashy mechanism (e.g., a light/dark or duotone toggle, echoing ref1's "GOLD" toggle) was explicitly considered and rejected to keep the hood-drop as the system's one memorable moment.

## Do's and Don'ts

### Do:
- **Do** default to Terminal Blue (`#6BA5FF`) for links, CTAs, and focus states.
- **Do** separate surfaces with a value shift to Raised Green Surface and/or a Faint Green Line hairline — never a shadow.
- **Do** keep the hood-drop scroll-scrubbed video as the system's only "loud" mechanism — everything else uses the same restrained snap-ease, no bounce or elastic.
- **Do** vary corner radius by element role per the Shapes section, not uniformly.

### Don't:
- **Don't** use Terminal Blue and Signal Orange-Red on the same element — pick one per the One Accent Rule.
- **Don't** default to Matrix green, scanlines, CRT noise, a blinking decorative cursor, a terminal-window frame, or any color `text-shadow` / glow — the "hacker movie" tells this brief explicitly rejects.
- **Don't** use `box-shadow` for hierarchy; it doesn't read on this dark ground.
- **Don't** add a second flashy signature mechanism (e.g., a theme toggle) — it dilutes the hood-drop as the one memorable moment, and there is no light/dark toggle by design.
- **Don't** use real photography of the person; the illustrated character is the standing substitute.
- **Don't** reach for uniform `border-radius` or violet→pink gradients — repo-wide bans, see [AGENTS.md](AGENTS.md).
