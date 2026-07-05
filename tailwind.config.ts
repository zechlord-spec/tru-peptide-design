import type { Config } from 'tailwindcss'

// ---------------------------------------------------------------------------
// Tailwind CSS v4 — configuration note
// ---------------------------------------------------------------------------
// This project uses Tailwind v4, which is CSS-first: the real theme (colors,
// fonts, radii, custom variants) is defined with `@theme` / `@custom-variant`
// in `styles/globals.css`, and content detection is automatic.
//
// This file exists only for tooling compatibility (editors, plugins, and
// scripts that still expect a `tailwind.config.*`). The `content` globs below
// mirror what v4 auto-detects. Add theme tokens in `styles/globals.css`, not
// here.
// ---------------------------------------------------------------------------

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
}

export default config
