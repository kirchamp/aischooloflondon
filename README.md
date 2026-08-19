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
| `npm run cms` | Local backend for the content admin UI (run alongside `npm run dev`) |

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

## Content admin UI (Decap CMS)

Adding/editing blog posts and courses doesn't require touching markdown or
code. There's an admin UI at `/admin` (backed by [Decap CMS](https://decapcms.org),
configured in `public/admin/config.yml`) that edits the exact same files in
`src/content/blog/` and `src/content/courses/`.

**Local editing (works today, no setup):**

1. In one terminal: `npm run dev`
2. In another terminal: `npm run cms`
3. Open `http://localhost:4321/admin/` — edit/create posts and courses through
   the UI. Changes write straight to the files on disk.
4. Review with `git diff`, then commit and push as normal.

**Editing from the live site (not set up yet):** the `admin/config.yml`
backend is configured for the real `kirchamp/aischooloflondon` GitHub repo,
but logging in from the deployed site requires a GitHub OAuth proxy server,
which isn't deployed anywhere yet — visiting `/admin` on the live site will
show a login screen that doesn't work until one exists. When migrating to
Azure Static Web Apps, an Azure Function is a natural place to host that
proxy (see [Decap CMS's GitHub backend docs](https://decapcms.org/docs/github-backend/)
for the exact OAuth app + proxy setup); until then, use the local workflow
above.

## Site search

Search (`/search/`) is powered by [Pagefind](https://pagefind.app) — it
indexes the built HTML at build time and runs entirely in the browser, no
server needed. `npm run build` runs the indexer right after the Astro build
(chained in the `build` script, since npm lifecycle hooks like `postbuild`
are skipped if `ignore-scripts` is set), writing to `dist/pagefind/`.

**This means search only works against a build, not `astro dev`.** To test it
locally: `npm run build && npm run preview`, then visit `/search/`. Only
content inside `<main data-pagefind-body>` (i.e. actual page content, not the
header/nav/footer) gets indexed — see `src/layouts/BaseLayout.astro`.

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

### Optional: Cloudflare free tier (CDN / DNS / edge protection)

Cloudflare's free plan sits in front of GitHub Pages and adds a CDN, DNS
management, and basic WAF/DDoS protection at no cost — a good fit for a
static site with no backend. This is an account-level change only you can
make (I can't create accounts or move nameservers on your behalf):

1. Sign up free at [cloudflare.com](https://www.cloudflare.com) and add
   `aischooloflondon.co.uk` as a site.
2. Cloudflare scans your existing DNS records and shows you the nameservers
   to switch to at your registrar (replacing whatever nameservers you use
   today). Update them there.
3. In Cloudflare's DNS tab, keep the same records as above (the `A` records
   pointing at GitHub Pages' IPs, `CNAME` for `www`) — Cloudflare will
   auto-import them during setup. Leave them **proxied** (orange cloud) to
   get the CDN/WAF benefit.
4. Nothing in this repo needs to change — GitHub Pages keeps serving the
   site, Cloudflare just sits in front of it.

See [docs/target-architecture.md](docs/target-architecture.md) for how this
and other infrastructure pieces (API gateway, observability, etc.) map to
Azure equivalents once there's an actual backend to justify them.

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
