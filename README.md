<h1 align="center">Personal Portfolio</h1>

<p align="center">
  <strong>Author:</strong> Alejo Assain
</p>

<p align="center">
  A focused portfolio for practical software, real operations, and products
  built with clean systems.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61dafb" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-20232a?style=for-the-badge&logo=typescript&logoColor=3178c6" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-20232a?style=for-the-badge&logo=vite&logoColor=646cff" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-20232a?style=for-the-badge&logo=tailwindcss&logoColor=38bdf8" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-20232a?style=for-the-badge&logo=supabase&logoColor=3ecf8e" />
  <img alt="Radix UI" src="https://img.shields.io/badge/Radix_UI-20232a?style=for-the-badge&logo=radixui&logoColor=ffffff" />
</p>

Personal portfolio built to show the work I care about: practical software,
real operations, and products that solve boring problems with clean systems.

## About

This site is a small, focused portfolio for my work as a software developer.
It highlights:

- Lymbo, a fitness center management and access control platform.
- QA automation experience with Python, Pytest, and Selenium.
- Real-world operations work from building and running fitness businesses.
- Skills across backend, frontend, infrastructure, automation, and product.

The project is intentionally simple at this stage: public content is read from
Supabase, sections are split into small components, and the UI is built from a
minimal set of shared components. Local mock data remains as a fallback so the
site can still render if the public content request fails.

The next step is to add an admin view to update the displayed data without
touching the code.

## Stack

- React
- TypeScript
- Vite
- Supabase
- Tailwind CSS
- Radix UI primitives
- Lucide icons

## Project Structure

```txt
src/
  components/
    layout/      Header and footer
    sections/    Page sections
    shared/      Custom reusable portfolio components
    ui/          Minimal UI primitives
  hooks/         Small interaction hooks
  lib/           External clients
  mappers/       Supabase row to app model mappers
  mocks/         Portfolio content
  services/      Supabase data access
  types/         App types
```

## Environment

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-or-anon-key
```

Only public browser-safe Supabase keys belong here. Never put a Supabase
`service_role` key in this frontend app.

## Run Locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Content Source

The public portfolio content is loaded from Supabase:

```txt
projects
project_skills
experiences
experience_skills
skills
personal_info
```

The app reads that data through:

```txt
src/services/portfolio.ts
```

and maps Supabase snake_case rows into app-friendly camelCase models through:

```txt
src/mappers/index.ts
```

Static UI config still lives in code:

```txt
src/mocks/portfolio.ts
```

This includes navigation items and social links. The rest of the mock content is
kept as fallback data only.

## Roadmap

This portfolio is intentionally lean today: public content is read from
Supabase, while editing still happens directly in Supabase.

The planned next step is to add a small admin view so portfolio content can be
updated from the app without editing code or opening Supabase directly.

Planned admin features:

- [ ] Protected admin route with Supabase Auth.
- [ ] CRUD for projects, experiences, skills, and personal info.
- [ ] Manage project-skill and experience-skill relationships.
- [ ] Ordering controls for projects, experiences, and skills.
- [ ] Featured project toggle.
- [ ] Upload a CV/resume to Supabase Storage.
- [ ] Expose a public resume download link in the portfolio.
- [ ] Upload and manage project photos stored in Supabase Storage.
- [ ] Optionally upload and manage a profile picture stored in Supabase Storage.
- [ ] Basic form validation for required fields, URLs, and text length.
- [ ] Loading, success, and error states for admin actions.

Future features:

- [ ] Add a new section -> academic info or smt like that (AWS cert, Ing. en sis. UTN)
- [ ] Draft/visible toggle for content that should be hidden without being deleted.
- [ ] Contact messages inbox for submissions from the contact form.
- [ ] Resume replacement flow that cleans up the previous uploaded file.
- [ ] Storage cleanup for unused project photos or deleted content.
- [ ] Preview changes before publishing.
