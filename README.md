# Krupali Vekariya: Retro Console Portfolio

Next.js 14 (App Router) · React · TypeScript · Tailwind CSS · Framer Motion · Lucide · Zod

## Run
```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Edit your content
`lib/content.ts`: email, LinkedIn, tech stack, what-I-build, about and experience.
`lib/projects.ts`: every project (websites, apps, the MillerStorm case study). Fill in `contribution` with what you did on each project; empty fields stay hidden.
Screenshots and app images are in `public/projects/` (captured November 2026 from the live sites and the App Store / Google Play listings). Replace a file with a newer image of the same name to update it.
The desk page text (header, footer) is in `components/Portfolio.tsx`. Colors are the variables at the top of `app/globals.css`.

## Pages
- **Desk** (default): "Pick up & play" uses the console, the cartridge / "Browse projects" opens the Collection, and "Put on a record" plays your spoken intro with captions.

## Spoken intro
- The words are `INTRO` in `lib/content.ts`. The visitor's browser reads them aloud (`lib/intro.ts`), choosing the most natural female English voice on their device (e.g. Microsoft Ava/Jenny Natural in Edge, Google US English in Chrome, Samantha on Apple devices).
- Pronunciation fixes for technical words are in the `SAY` list in `lib/intro.ts`.
- For the exact same voice on every device, add a recording at `public/intro.mp3` (your own voice, or a voice service whose terms allow public use) and set `INTRO_AUDIO = "/intro.mp3"` in `lib/content.ts`. Captions keep working.
- **Collection** (projects): `/?view=projects`, or straight to a category with `&cat=apps` or `&cat=crm`.
- **Simple view**: every section on one plain page: `/?view=simple`.

## Contact form
- Validated client-side and server-side with Zod (`lib/schema.ts`).
- `POST /api/contact` sends email via [Resend](https://resend.com). Set `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`.
- With no API key, the form opens the visitor's email app (mailto) instead.
- WhatsApp: set `NEXT_PUBLIC_WHATSAPP` (digits with country code) and the button appears.

## Deploy
Push to GitHub and import into Vercel; add the env vars there.
