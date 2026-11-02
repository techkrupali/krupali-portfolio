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
Everything lives in `lib/content.ts`: email, LinkedIn, projects (add `tech`, `role`, `link`), tech stack, what-I-build.
Experience text is in `components/Screens.tsx` (`case "exp"`).

## Contact form
- Validated client-side and server-side with Zod (`lib/schema.ts`).
- `POST /api/contact` sends email via [Resend](https://resend.com). Set `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`.
- With no API key, the form opens the visitor's email app (mailto) instead.
- WhatsApp: set `NEXT_PUBLIC_WHATSAPP` (digits with country code) and the button appears.

## Deploy
Push to GitHub and import into Vercel; add the env vars there.
