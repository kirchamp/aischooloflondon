// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// Site URL is fixed to the custom domain (see public/CNAME) so canonical
// links / sitemap / RSS are correct regardless of which host (GitHub Pages
// today, Azure Static Web Apps later) is actually serving the build.
// output: 'static' produces a pure static `dist/` folder with no host-specific
// assumptions, so the same build artifact can be deployed to GitHub Pages,
// Azure Static Web Apps, Azure Blob Storage + CDN, etc. without code changes.
export default defineConfig({
  site: 'https://aischooloflondon.co.uk',
  output: 'static',
  integrations: [sitemap()]
});