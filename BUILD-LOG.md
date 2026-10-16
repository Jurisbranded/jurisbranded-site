# jurisbranded.com: Astro build log (JurisBranded, CLID JB)

Repo `Jurisbranded/jurisbranded-site`, branch `main`. Cloudflare Pages project `jurisbranded`, git-connected: every push to `main` deploys.

## Status (2026-10-16)

**Blank stage.** Scaffold only: one placeholder home page, 404, RSS, sitemap, redirects builder, worker builder, shared contact handler (`functions/api/contact.js`, SITE key `jurisbranded.com`, not yet in the n8n SITES table).
Preview host `*.jurisbranded.pages.dev` sends `X-Robots-Tag: noindex`. The live jurisbranded.com (PHP/Tailwind container on YGGY) is untouched. DNS untouched.

## Inputs ready for the build

- Approved homepage hero (2026-10-16): penthouse corner office at night (looping video) + animated Tanngrisnir (turn, one-eyed wink, holds the stare). Mockup: https://claude.ai/artifact/6hGycjptjBf7Byb96rULu3. Notes: Astro project doc `clients/jb-storm-hero.md`. Goat files: NAS `hof/work/wan-goat/` (`tg_final_alpha.webm` is the approved take).

## Decisions

- Scaffold is a clean start, not a fork of a client site; reusable tools copied from `floorcleaningexperts-site` (make-redirects, make-worker, screenshots, shared contact handler).
