# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are recruiters and hiring managers screening Alejo Assain as a
candidate for full-time software developer roles. They land on the site to
decide, quickly, whether he's worth moving forward on: skills, real
experience, and evidence of shipped work.

## Product Purpose

A personal portfolio for Alejo Assain, a software developer. It exists to get
him hired: it shows practical software work, real business/operations
experience, and the skills backing both, so a recruiter can evaluate fit fast.

## Positioning

Most dev portfolios show tutorial projects or isolated freelance gigs. Alejo
co-founded and operates real fitness businesses (WALD Gym Zone, Fox Ladies
Gym) and is building Lymbo, a gym management/access-control platform, directly
from the operational pain he lived running those businesses. The mechanism a
neighboring portfolio can't truthfully copy: hands-on business ownership
feeding directly into the software he builds, not software built speculatively
and then pitched at a business.

## Operating Context

- Public content (projects, experience, skills, personal info) is read from
  Supabase at `src/services/portfolio.ts`, mapped via `src/mappers/index.ts`.
  Local mock data (`src/mocks/portfolio.ts`) is fallback only if the request
  fails.
- A protected admin area (Supabase Auth) manages that content: projects,
  experiences, skills, personal info, and ordering/featured toggles.
- The contact form submits through a Supabase Edge Function
  (`supabase/functions/submit-contact-message`) that validates Cloudflare
  Turnstile and a honeypot before writing to `contact_messages`. The browser
  only ever holds the public Turnstile site key.
- An admin messages inbox reviews contact form submissions.

## Capabilities and Constraints

- Stack (existing, not open for reconsideration): React 19, TypeScript, Vite,
  Tailwind CSS 4, Radix UI primitives, Supabase (Postgres + Auth + Edge
  Functions + Storage), GSAP/Lenis for animation. See [AGENTS.md](AGENTS.md)
  for the enforced animation stack and code-structure rules.
- Near-term, planned capability: CV/resume upload to Supabase Storage with a
  public download link on the portfolio. Not built yet — treat as a
  constraint future work should leave room for, not as shipped.
- Other roadmap items (project/profile photo uploads, draft/visible content
  toggle, preview-before-publish) are unconfirmed "maybe" ideas from
  [README.md](README.md), not commitments.
- Never a Supabase `service_role` key or the Turnstile secret in
  browser-exposed code or `VITE_*` env vars.

## Brand Commitments

- Name: Alejo Assain. Title: Software Developer. Contact: alejoassain00@gmail.com.
- Tagline: "Building real solutions, automating repetitive work."
- Status badge: "Available for work."
- An illustrated character (hoodie on/off, neutral/relaxed expressions) is an
  established brand asset at `design/character/`, already wired into the
  visual world documented in `design/direction.md` (coder/hacker aesthetic in
  a bright, friendly key; the hood-drop on scroll is the site's one signature
  motion moment). That document is the standing visual authority — this file
  records product truth, not the visual world itself.

## Evidence on Hand

- Real, named projects: Lymbo (gym management + access control platform,
  co-founded, in production prep) and ia-todos (AI task planning app, open
  source on GitHub).
- Real work history: Lymbo (Co-Founder & Product Developer), Vates (QA
  Automation Engineer), WALD Gym Zone and Fox Ladies Gym (Co-Founder /
  Operations), with real dates, locations, and companies — see
  `src/mocks/portfolio.ts`.
- Real social links: GitHub, LinkedIn, X (`AlejoAssain`).
- No testimonials, press, case studies, or client logos exist. Do not
  fabricate any.
- No resume/CV file exists yet on the site (see Capabilities and Constraints).

## Product Principles

1. Evidence over claims — every credential on the page traces to a real
   project, role, or dated experience; nothing is invented to look more
   impressive.
2. Operations experience is a feature, not a footnote — the business-ownership
   background is what makes this portfolio different and should stay visible,
   not buried under a generic skills list.
3. Fast to scan, credible on inspection — a recruiter should get the pitch in
   seconds, with the depth (Lymbo's architecture, the real timelines) there
   for whoever looks closer.
4. Content stays editable without a redeploy — portfolio data lives in
   Supabase and goes through the admin area, not hardcoded page edits.
