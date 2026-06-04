# Alejo Assain Portfolio

Personal portfolio built to show the work I care about: practical software,
real operations, and products that solve boring problems with clean systems.

## About

This site is a small, focused portfolio for my work as a software developer.
It highlights:

- Lymbo, a fitness center management and access control platform.
- QA automation experience with Python, Pytest, and Selenium.
- Real-world operations work from building and running fitness businesses.
- Skills across backend, frontend, infrastructure, automation, and product.

The project is intentionally simple at this stage: data lives in one mock file,
sections are split into small components, and the UI is built from a minimal set
of shared components.

The next step is to move the portfolio content into Supabase and add an admin
view to update the displayed data without touching the code.

## Stack

- React
- TypeScript
- Vite
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
  mocks/         Portfolio content
  types/         App types
```

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

## Editing Content

For now, portfolio content lives here:

```txt
src/mocks/portfolio.ts
```

Update that file to change projects, experience, skills, social links, and
personal info.

## Roadmap

This portfolio is intentionally lean today: no CMS, no database, and no
unnecessary abstractions while the content is still mocked in
`src/mocks/portfolio.ts`.

The planned next step is to connect the content to Supabase and add a small
admin view so projects, experience, skills, social links, and personal info can
be updated without editing code.
