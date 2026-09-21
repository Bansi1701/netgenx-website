# Partner logos

The trust bar on `index.html` shows each brand as a **monochrome symbol + wordmark**.
All six brands carry their real symbol, inlined as SVG in `index.html`.

| Layer | Where it lives | Wins over |
|-------|----------------|-----------|
| Wordmark | the `.partner-name` span in `index.html` | n/a |
| Monochrome symbol | inline `<svg class="partner-mark">` in `index.html` | n/a (sits beside the wordmark) |
| Official full logo | `assets/img/partners/<slug>.svg` (or `.png`) | replaces **both** of the above |

## Where each symbol came from

| Brand | Source | Extraction |
|-------|--------|------------|
| Cisco | [Simple Icons](https://simpleicons.org) (icon file CC0) | cropped to the standalone bridge bars; the wordmark half dropped |
| Microsoft | Simple Icons (CC0) | as-is |
| Palo Alto Networks | Simple Icons (CC0) | as-is |
| CrowdStrike | `assets.crowdstrike.com` → `CS_Logo_Falcon` | falcon paths kept, full-coverage luminance mask dropped |
| SentinelOne | their site header → `header-logo-dark.svg` | the S mark kept, "SentinelOne" wordmark paths dropped |
| BeyondTrust | `docs.beyondtrust.com` header logo | symbol subpaths kept, wordmark + "Documentation" dropped |

Each was recoloured to `fill="currentColor"`, so a symbol takes the wordmark's exact colour
and follows it to blue on hover. Heights are set **per brand** in `main.css`, not uniformly:
equal height is not equal weight, so sparse or wide marks are trimmed against square ones.

## Two things to know

**These are modified marks.** Recoloured to monochrome and cropped to the symbol. Most brand
guidelines ask that logos not be altered, so treat these as a good-looking stand-in, not as
compliant artwork. The vendor's own logo kit is the artwork you actually want.

**These are registered trademarks**, and CC0 covers an icon file, not the mark. Most vendor
partner programs supply a logo kit and require an active partnership to display their marks.
Use only logos NetGenX is authorized to display.

## Swapping in official artwork

Drop the vendor's file at `assets/img/partners/<slug>.svg`, using `cisco` · `microsoft` ·
`crowdstrike` · `paloaltonetworks` · `sentinelone` · `beyondtrust`. It takes over
automatically, hiding both the symbol and the wordmark. No code change: the
`<img class="partner-logo">` already points there and reveals itself on load. Full logos are
normalized to 28px tall, grayscale at rest, true colour on hover.
