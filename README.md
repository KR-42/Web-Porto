# Rafly Portofolio

Production-oriented portfolio for Rafly Athallah Khansa Putra, a Bina Nusantara University Computer Science student specializing in Network Security. The site uses Next.js App Router, strict TypeScript, Tailwind CSS, React Hook Form, Zod, Resend, Lucide, `next/font`, Vitest, and Testing Library. npm is used through `package-lock.json`.

## Local setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

Quality commands:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Set optional `NEXT_PUBLIC_SITE_URL` to the production origin for canonical URLs and sitemap entries.

## Resend contact form

1. Create a Resend account.
2. Add and verify a sending domain.
3. Create a Resend API key with sending permission.
4. Copy `.env.example` to `.env.local`.
5. Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `CONTACT_TO_EMAIL`.
6. Restart the development server.
7. Submit a test message.
8. Verify delivery and that replies go to the visitor's submitted address.
9. Add the same server-side environment variables to Vercel.

`RESEND_FROM_EMAIL` must be an address on the verified Resend domain, such as `Rafly Portofolio <contact@your-verified-domain.com>`. The visitor's email is assigned to `replyTo`; the destination remains `rafly.athallah.putra@gmail.com`. Never prefix `RESEND_API_KEY` with `NEXT_PUBLIC` or expose it to client code.

The form includes client and server validation, field-size limits, request-size limits, consent validation, a honeypot, duplicate-submit prevention, and controlled provider errors. Stronger production protection such as CAPTCHA or durable distributed rate limiting can be added later.

## Content and assets

Identity and contact data are centralized in `src/data/profile.ts`; projects, skills, experience, and education are in adjacent data files. Organization logos are stored losslessly under `public/images/organizations/` and reference their unmodified sources under `references/`.

The private source `references/CV_2026.pdf` is never served directly. The downloadable file is `public/documents/Rafly-Athallah-CV-2026-v2.pdf`, generated with PyMuPDF redaction. Its phone text was removed from the PDF content stream, it was cleaned and garbage-collected, and its extracted text and rendered first page were verified. The unique v2 URL avoids stale browser/CDN copies and is served with a must-revalidate cache policy.

The supplied portrait remains at `public/images/profile/rafly-profile-2026.webp`. YouTube demos retain their privacy-enhanced, viewport-controlled behavior.

## Deployment

Import the repository into Vercel, use the detected Next.js preset, configure `NEXT_PUBLIC_SITE_URL` and all Resend variables, then deploy. Do not commit `.env.local` or real API keys.
