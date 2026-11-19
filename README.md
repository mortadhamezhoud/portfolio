# Mortadha Mazhoud — Portfolio

Personal portfolio of Mortadha Mazhoud, a BI, Data and Full-Stack engineer based in Tunis. It presents projects, experience, skills and certificates, and lets recruiters and clients get in touch.

## Features

- **Interactive 3D background**: a data globe with animated arcs that morphs into different shapes as you scroll (React Three Fiber, custom shaders, post-processing).
- **Bilingual (EN / FR)**: routes `/en` and `/fr` with `next-intl`; all texts live in `messages/` and all content in `data/`.
- **Rich sections**: About, Skills, Projects (scrollytelling with a featured BI/ML case study), Experience, Credentials (redacted certificates) and Contact.
- **Contact form**: validated with React Hook Form and delivered through Formspree, with a honeypot anti-spam field, an "Open to work" status and a WhatsApp number that is only revealed on click.
- **Polished UX**: smooth scrolling, keyboard shortcuts, custom cursor, reduced-motion support and accessible form errors.
- **Static export**: no server needed, deployable on Vercel or any static host.

## Tech stack

Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Three.js / React Three Fiber / drei · Lenis · next-intl · React Hook Form · Formspree · Lucide

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev    # http://localhost:3000 (create .env.local first, see below)
```

### Environment variables

Create a `.env.local` file (it is git-ignored):

```
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

Without it the contact form shows a fallback message with a direct email link.

### Scripts

| Command          | Description                                   |
| ---------------- | --------------------------------------------- |
| `npm run dev`    | Start the development server                  |
| `npm run build`  | Build the static site into `out/`             |
| `npm run lint`   | Run ESLint                                    |
| `npm run images` | Optimize images placed in `public/`           |

## Project structure

```
app/          Routes and layouts (/[locale])
components/   UI sections, 3D scene, layout
data/         Content per language (profile, projects, certificates, globe)
messages/     UI translations (en.json, fr.json)
lib/          Types, scroll/scene logic, hooks
public/       Images, logos, CV, redacted certificates
```

## Deployment

Import the repository on [Vercel](https://vercel.com) and add `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in the project's environment variables (the value is embedded at build time, so redeploy after changing it).

## Contact

[LinkedIn](https://www.linkedin.com/in/mortadha-mazhoud-6440a0311) · [GitHub](https://github.com/mortadhamezhoud)
