# AI School of London — aischooloflondon.co.uk

Marketing/content site built with [Astro](https://astro.build) (static output).
Currently hosted on **GitHub Pages**; architected to migrate to **Azure Static
Web Apps + Azure DNS** later with minimal changes (see [Azure migration](#azure-migration-later) below).

## Project structure

```
src/
  components/     Reusable UI pieces (Header, Footer, Hero, CourseCard, ...)
  layouts/         BaseLayout.astro — shared <head>, header, footer
  content/
    blog/          One Markdown file per blog post
    courses/       One Markdown file per course
  content.config.ts  Schema for the blog/courses collections
  data/site.ts       Central config: brand name, nav links, social links, contact email, env-driven values
  pages/           Route files (index, about, courses/, blog/, contact)
  styles/global.css Shared design tokens & base styles
public/            Static files served as-is (favicon, robots.txt, CNAME)
.github/workflows/deploy.yml  CI: build + deploy to GitHub Pages on push to main
```

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview the production build locally |

## Content checklist (placeholder content to replace)

Everything marked `TODO` needs real content before launch. Search the repo
for `TODO` to find every spot, or check these files directly:

- [ ] `src/data/site.ts` — brand name, tagline, meta description, contact email, social links
- [ ] `src/pages/index.astro` — hero headline/lede, stats, closing CTA copy
- [ ] `src/pages/about.astro` — real bio, experience, credentials
- [ ] `src/pages/courses/index.astro` + `src/content/courses/*.md` — real courses (add one `.md` file per course)
- [ ] `src/content/blog/*.md` — real posts (add one `.md` file per post)
- [ ] `src/pages/contact.astro` — set `PUBLIC_CONTACT_FORM_ENDPOINT` in `.env` (see `.env.example`) once you have a form backend, otherwise it falls back to a `mailto:` link
- [ ] `public/favicon.svg` / `favicon.ico` — replace with real branding
- [ ] Open Graph / social preview image (add and reference in `BaseLayout.astro`)

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. In the repo settings → **Pages**, set the source to **GitHub Actions**.
3. Push to `main` — `.github/workflows/deploy.yml` builds and deploys automatically.
4. Point your domain's DNS at GitHub Pages (see below). The `public/CNAME`
   file already declares `aischooloflondon.co.uk` as the custom domain.

### DNS for the custom domain (current: registrar DNS)

At your current DNS provider, add:

- `A` records for the apex domain (`aischooloflondon.co.uk`) pointing to GitHub Pages' IPs:
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `CNAME` record for `www` → `<your-github-username>.github.io`

## Azure migration (later)

The app code itself doesn't need to change — Astro's static `dist/` output
works the same on any static host. When you're ready to move:

1. **Hosting**: Create an Azure Static Web App (or Blob Storage + Front Door/CDN)
   and point it at this repo — Azure can build directly from GitHub via its
   own Actions workflow (`Azure/static-web-apps-deploy`), or you can keep
   building here and just change the deploy step in `deploy.yml`.
2. **DNS**: Create an Azure DNS zone for `aischooloflondon.co.uk`, update your
   registrar's nameservers to Azure's, then re-point the `A`/`CNAME` records
   at the Azure Static Web App instead of GitHub Pages.
3. **Contact form / server logic**: Anything that needs a backend (contact
   form, newsletter signup, auth) can become an Azure Function — Static Web
   Apps supports managed Functions out of the box. Update
   `PUBLIC_CONTACT_FORM_ENDPOINT` in `.env` to point at it; no component code
   changes needed since `src/data/site.ts` centralizes that value.
4. **Config/secrets**: Anything env-driven today (`.env` /
   `PUBLIC_*` vars) maps directly to Azure Static Web Apps' application
   settings / Azure App Configuration later.
