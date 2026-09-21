# Partner logos

The trust bar on `index.html` carries twelve brands. Each is monochrome, inlined as SVG in
`index.html` with `fill="currentColor"`, so every mark takes the wordmark's colour and
follows it to blue on hover.

## The roster

| Brand | Mark | Source |
|-------|------|--------|
| Cisco | symbol + wordmark | [Simple Icons](https://simpleicons.org), cropped to the bridge bars |
| Microsoft | symbol + wordmark | Simple Icons |
| CrowdStrike | symbol + wordmark | `assets.crowdstrike.com` → `CS_Logo_Falcon` |
| Palo Alto Networks | symbol + wordmark | Simple Icons |
| Fortinet | symbol + wordmark | Simple Icons |
| Zoho | symbol + wordmark | Simple Icons, cropped to the four squares |
| ManageEngine | symbol + wordmark | their site header logo, arcs kept, wordmark dropped |
| Dell | **lockup** | Simple Icons |
| Lenovo | **lockup** | Simple Icons |
| HPE | wordmark only | no freely licensed mark found |
| Veeam | **lockup** | Simple Icons |
| Commvault | symbol + wordmark | their site header logo, hexagon kept, wordmark dropped |

**Lockup** means the brand's logo is the wordmark (Dell's circle, Lenovo's box, the Veeam
wordmark), so there is no symbol to separate. Those carry `.partner--lockup`, which hides
the text name visually while keeping it in the DOM, so screen readers and crawlers still
read the brand name.

Heights are set **per brand** in `main.css`, not uniformly: equal height is not equal
weight, so sparse or wide marks are trimmed and fine line art is lifted.

## Adding an official logo

Drop the vendor's file at `assets/img/partners/<slug>.svg` using these names: `cisco` ·
`microsoft` · `crowdstrike` · `paloaltonetworks` · `fortinet` · `zoho` · `manageengine` ·
`dell` · `lenovo` · `hpe` · `veeam` · `commvault`. It takes over automatically, hiding both
the symbol and the wordmark. No code change is needed: the `<img class="partner-logo">` in
each entry already points there and reveals itself on load. Full logos are normalized to
28px tall, grayscale at rest and true colour on hover.

## Two things to know

**These are modified marks.** Recoloured to monochrome and, in several cases, cropped to the
symbol. Most brand guidelines ask that logos not be altered, so treat them as a good-looking
stand-in rather than compliant artwork. The vendor's own logo kit is what you actually want.

**These are registered trademarks**, and CC0 covers an icon file, not the mark. Most vendor
partner programs supply a logo kit and require an active partnership to display their marks.
Use only logos NetGenX is authorized to display.
