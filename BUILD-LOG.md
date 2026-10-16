# jurisbranded.com: Astro build log (JurisBranded, CLID JB)

Repo `Jurisbranded/jurisbranded-site`, branch `main`. Cloudflare Pages project `jurisbranded`, git-connected: every push to `main` deploys.

## Status (2026-10-16)

**First pass of the home page + menu is up for Jeff's review.** Built from new, Astro-native (nothing carried from the old site). 404, RSS, sitemap, redirects builder, worker builder, shared contact handler (`functions/api/contact.js`, SITE key `jurisbranded.com`, not yet in the n8n SITES table; Turnstile not set, so the form answers "not connected yet").
Preview host `*.jurisbranded.pages.dev` sends `X-Robots-Tag: noindex`. The live jurisbranded.com (PHP/Tailwind container on YGGY) is untouched. DNS untouched.

## Inputs ready for the build

- Approved homepage hero (2026-10-16): penthouse corner office at night (looping video) + animated Tanngrisnir (turn, one-eyed wink, holds the stare). Mockup: https://claude.ai/artifact/6hGycjptjBf7Byb96rULu3. Notes: Astro project doc `clients/jb-storm-hero.md`. Goat files: NAS `hof/work/wan-goat/` (`tg_final_alpha.webm` is the approved take).

## Decisions

- Scaffold is a clean start, not a fork of a client site; reusable tools copied from `floorcleaningexperts-site` (make-redirects, make-worker, screenshots, shared contact handler).

## Writing style decision (2026-10-16)

Theme from Jeff: **IYKYK.** The inside track, straight talk, no agency nonsense, "we've got this, you don't have to." The smirk and the wink. "There's a secret to being a big beautiful GOAT" (GOAT = greatest of all time, and Tanngrisnir is literally a goat).

- **Structure: AIDA stays.** It is a sequence, not a worldview; it is Jeff's authentic method. Attention = hero (the wink), Interest = the secret said plainly, Desire = where you get found / who we serve / the Code / the founder, Action = the inside track.
- **Interest is a challenger reframe**, not a promise: "The best lawyer in town doesn't get the call. The one they find first does." This is what keeps AIDA from reading Pollyanna.
- **Voice: the insider.** Second person, short declaratives, conspiratorial ("here's the secret"), understatement over hype, humor through restraint. No exclamation marks, no hype adjectives, no em dashes, no "we're passionate", no promises we can't back with a fact Jeff stated. Cocky about the work, never condescending to the lawyer.
- **No audit-led CTA.** Jeff 2026-10-16: every agency leads with a free audit. The CTA is "Get the inside track" (a conversation with Jeff). The audit will be wired up elsewhere later.

## Home page first pass (2026-10-16)

Sections: hero (office video + animated Tanngrisnir, "Every town has one GOAT."), the secret, four places (Search, AI answers, Maps, The feed), the inside track form, who we serve, the Code (six rules), the founder ("Fifty years in. Still early."), close ("Every town has one GOAT. Might as well be you.").
Menu: The secret / Where you get found / Who we serve (practice-area dropdown) / The Code / The founder + "Get the inside track" button. Mobile: full-screen menu.
Facts used, all from Jeff's own statements, to be confirmed by him: 27-year client who left to retire; one bundled price, no upsells; bills more than competitors; HotDog documentation; 17 years running HSN retail systems; negotiated with Google over the hsn.com product feed; own servers and automation; nothing published without client approval; competitors not taken on (CONFIRM: this is a new claim).

## To do (Jeff, 2026-10-16)

- **Founder's page**: Jeff Folkersen, full story (expands the home-page founder section).
- **About Tanngrisnir page**: who the GOAT is and why he's JB's mascot (Thor's goat; "there's a secret to being a big beautiful GOAT").
- Repo `Jurisbranded/jurisbranded-site` is Public; other site repos are private. Switch to Private.
- Jeff to confirm the facts used on the home page (see "Home page first pass"), especially "Your competitors are not our clients."
- Forms: Turnstile widget + `TURNSTILE_SECRET`, and add `jurisbranded.com` to the n8n SITES table.
