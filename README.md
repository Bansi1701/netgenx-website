# NetGenX — Cinematic Enterprise IT Website

A world-class, cinematic marketing site for **NetGenX** — *Securing the Next Generation of Enterprise IT*.
Built to the spec in [netgenx_website_prompt.md](netgenx_website_prompt.md), in the spirit of CrowdStrike × Linear × Stripe.

## ✨ What's inside

A **dependency-free static site** (vanilla HTML/CSS/JS) — no build step, no `npm install`, opens instantly, works offline.
This was chosen over the prompt's Next.js/Framer options so the site runs anywhere immediately while still delivering the full cinematic experience.

### Pages (10)
| File | Page |
|------|------|
| `index.html` | Home — particle-network hero, trust bar, services grid, "Why NetGenX", case studies, CTA |
| `services.html` | Services overview + Solutions + engagement process |
| `service-cybersecurity.html` | Cybersecurity (24/7 SOC, EDR/XDR, IR) |
| `service-network.html` | Network Infrastructure (SD-WAN, segmentation) |
| `service-pam.html` | Privileged Access Management |
| `service-idam.html` | Identity & Access Management |
| `service-servicedesk.html` | Service Desk (24/7 managed support) |
| `service-cloud.html` | Cloud Solutions (migration, CSPM, FinOps) |
| `about.html` | Mission, milestone timeline, values, leadership |
| `contact.html` | Contact form + info + animated globe |

### Cinematic features implemented
- **Canvas particle network** hero — slow drifting connected nodes that react to the cursor (`assets/js/particles.js`); self-throttles, pauses off-screen and on hidden tabs, DPR-aware.
- **Scroll-triggered reveals** via `IntersectionObserver` — fade/slide/scale + staggered children (`.reveal`, `.reveal-l/-r`, `.reveal-scale`, `data-stagger`).
- **Count-up stat counters** that animate when scrolled into view (`data-count`, `data-suffix`, `data-prefix`).
- **Self-drawing SVG paths** (`.draw-path`) for the service-specific hero animations (shield, topology, vault key, identity graph, ticket flow, cloud streams).
- **Hero word reveal** — headline animates in word-by-word (`data-words`).
- **Custom glowing cursor** that grows over interactive elements (disabled on touch).
- **Glassmorphic frosted cards**, glowing nav with backdrop-blur + dropdowns, full-screen mobile menu with staggered links, animated CTA glow pulse, page-load veil.

### Accessibility & performance
- Respects `prefers-reduced-motion` (animations collapse, particles paint once).
- Skip-to-content link, `aria-label`/`aria-hidden`, keyboard-navigable, one `<h1>` per page, WCAG-minded contrast.
- No runtime JS dependencies; only Google Fonts loaded over the network (with system-font fallback).
- `Organization` structured data on the home page.

## 🎨 Customizing

All design tokens live in [assets/css/tokens.css](assets/css/tokens.css) — change colors, fonts, spacing, and glow there and the whole site follows. Components are in [assets/css/main.css](assets/css/main.css).

**Logo:** the original `WhatsApp Image…jpeg` had a cream background that doesn't suit a dark site, so it was redrawn as a crisp, scalable SVG in [assets/img/logo-mark.svg](assets/img/logo-mark.svg) (and `favicon.svg`). The original is preserved at `assets/img/netgenx-logo-original.jpeg`.

**Contact form** is a front-end demo (shows a success state, no backend). Wire the `<form data-demo-form>` in `contact.html` to your email/CRM endpoint to go live.

## ▶️ Running locally

It's static — just open `index.html`, or serve it (recommended, so relative paths and fonts behave):

```bash
cd /Users/bansipatel/NetGenX
python3 -m http.server 8080
# then open http://localhost:8080
```

## 📁 Structure
```
NetGenX/
├── index.html, services.html, service-*.html, about.html, contact.html
├── favicon.svg
├── assets/
│   ├── css/   tokens.css · main.css
│   ├── js/    particles.js · main.js
│   └── img/   logo-mark.svg · netgenx-logo-original.jpeg
└── netgenx_website_prompt.md   (original brief)
```
