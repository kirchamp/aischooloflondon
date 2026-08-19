// Central site configuration.
//
// Keep every brand string, nav link, and host-dependent value here instead of
// hardcoding it inside components/pages. When this site moves from GitHub
// Pages to Azure (Static Web Apps + Azure DNS), the only things that should
// need to change are the values in this file and in `.env` — not the
// markup/components themselves.

export const SITE = {
  name: "AI School of London",
  shortName: "AISOL",
  tagline: "TODO: one-line tagline — what you teach and who it's for",
  description:
    "TODO: 1-2 sentence meta description for search engines (used in <head> and social previews).",
  url: "https://aischooloflondon.co.uk",
  contactEmail: "TODO@aischooloflondon.co.uk",
  social: {
    youtube: "", // TODO
    linkedin: "", // TODO
    github: "", // TODO
    twitter: "", // TODO
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Courses", href: "/courses/" },
  { label: "Blog", href: "/blog/" },
  { label: "Search", href: "/search/" },
  { label: "Contact", href: "/contact/" },
] as const;

// Contact form submission endpoint.
//
// GitHub Pages serves static files only — there's no server to receive a
// form POST. Until this migrates to Azure (Static Web Apps + an Azure
// Function, or Azure Communication Services for email), point this at a
// third-party form backend (e.g. Formspree, Getform) via an env var, or
// leave blank to fall back to a mailto: link.
//
// Set in `.env` (see `.env.example`): PUBLIC_CONTACT_FORM_ENDPOINT
export const CONTACT_FORM_ENDPOINT: string =
  import.meta.env.PUBLIC_CONTACT_FORM_ENDPOINT ?? "";
