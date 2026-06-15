# NetGenX — Cinematic Website Build Prompt

## 🎯 Project Overview
Build a world-class, cinematic enterprise IT website for **NetGenX** — a next-generation technology company specializing in **Network Infrastructure, Cybersecurity, Privileged Access Management (PAM), Identity & Access Management (IDAM), Service Desk, and Cloud Solutions**. The site should feel like a premium SaaS product landing page — not a typical IT services company. Think **CrowdStrike × Linear × Stripe** in terms of motion, design, and trust signals.

---

## 🏢 Company Context
- **Company:** NetGenX
- **Tagline:** *Securing the Next Generation of Enterprise IT*
- **Services:** Network Infrastructure · Cybersecurity · PAM · IDAM · Service Desk · Cloud Solutions
- **Target Clients:** Mid to large enterprise, Canadian & global market
- **Competitor Reference:** teqtivesolutions.com (surpass this significantly)
- **Tone:** Authoritative, cutting-edge, trustworthy, premium

---

## 🎬 Cinematic Design Direction

### Visual Language
- **Background:** Deep navy `#040D1A` to black — like looking into a secure data center at night
- **Primary accent:** Electric blue `#0066FF` to cyan `#00C2FF` gradient
- **Secondary accent:** Subtle teal `#00FFCC` for success/trust states
- **Text:** White `#FFFFFF` primary, `#94A3B8` secondary, `#0066FF` highlights
- **Surfaces:** Frosted glass cards `rgba(255,255,255,0.04)` with `1px solid rgba(255,255,255,0.08)` borders

### Motion & Animation Philosophy
- **Scroll-triggered animations:** Every section fades/slides into view on scroll using GSAP ScrollTrigger or Framer Motion
- **Particle network background:** Animated, slow-moving connected node graph on hero — represents live network monitoring
- **Glowing line traces:** SVG path animations that draw themselves, like data traveling through circuits
- **Text reveals:** Words/characters animate in with stagger — not all at once
- **Counter animations:** Numbers count up when scrolled into view (e.g., "500+ clients secured", "99.9% uptime")
- **Parallax layers:** Multiple depth layers on hero (foreground text, midground glow, background particles)
- **Hover micro-interactions:** Cards lift with glow, buttons pulse subtly, nav items underline animates
- **Cursor:** Custom glowing dot cursor that reacts to hoverable elements
- **Page transitions:** Smooth fade with logo flash between pages

---

## 📐 Site Structure & Pages

### Page 1: Home
**Hero Section**
- Full viewport, dark background
- Animated particle network (canvas or Three.js) — nodes connecting like a live network map
- Headline (character-by-character animation):
  > "Next-Generation IT.  
  > Built to Protect, Scale, and Perform."
- Subtext fade-in: "NetGenX delivers enterprise-grade Cybersecurity, Network, PAM, IDAM, and Cloud solutions across Canada and globally."
- Two CTAs: `[Get a Free Assessment]` (primary electric blue) · `[Explore Services]` (ghost)
- Floating 3D shield/network icon rotating slowly in the background
- Scroll indicator: animated chevron bouncing gently

**Trust Bar** (scrolls into view)
- Animated logos of tech partners: Cisco, Microsoft, CrowdStrike, Palo Alto, SentinelOne, BeyondTrust
- Stat counters: `500+ Enterprise Clients` · `99.9% SLA Uptime` · `24/7 SOC Coverage` · `15+ Years Experience`

**Services Grid** (6 cards, staggered entrance)
Each card has:
- Glowing icon (SVG animation on hover)
- Service name
- 1-line description
- Arrow that animates right on hover

| Service | Icon Style |
|---------|-----------|
| Network Infrastructure | Animated network nodes |
| Cybersecurity | Shield with pulse |
| PAM (Privileged Access Management) | Key with lock rotation |
| IDAM (Identity & Access Management) | Person with shield orbit |
| Service Desk | Headset with signal rings |
| Cloud Solutions | Cloud with upload pulse |

**"Why NetGenX" Section**
- Split layout: Left = bold statement, Right = 4 feature points with icons
- Background: faint circuit board texture at low opacity
- Feature points animate in with left-to-right slide

**Case Study / Proof Section**
- Dark card carousel with blurred background screenshot
- Client logos, industry, challenge → solution → result format
- Horizontal scroll on mobile

**CTA Banner**
- Full-width section with electric blue gradient overlay
- "Ready to secure your enterprise?" headline
- `[Schedule a Free Consultation]` button with glow pulse

---

### Page 2: Services (Individual Pages for Each)

**Template for each service page:**
- Hero with cinematic service-specific animation:
  - **Cybersecurity:** Animated shield deflecting threat pulses
  - **PAM:** Animated key unlocking a network vault
  - **IDAM:** Identity graph showing access pathways
  - **Network:** Live topology map animation
  - **Cloud:** Data flowing into cloud nodes
  - **Service Desk:** Ticket resolution flow animation
- Problem → Solution → How We Do It → Tools We Use → Results
- Tech stack logos (vendor partnerships)
- Related services links

---

### Page 3: About Us
- Cinematic text reveal: Company mission statement word by word
- Timeline of milestones (animated line drawing itself)
- Team section with subtle parallax on photos
- Values: Security-first · Client-first · Innovation · Reliability

---

### Page 4: Contact
- Split: Left = contact form, Right = animated globe/map showing Canada presence
- Form fields with glowing focus states
- Floating office address card
- CTA: "Talk to an expert in 24 hours"

---

## 🧩 Component Specifications

### Navigation
```
[NetGenX Logo]    [Services ▾]  [Solutions ▾]  [About]  [Blog]  [Contact]    [Get Started →]
```
- Sticky with backdrop-blur on scroll
- Mobile: full-screen overlay menu with staggered link animations
- Active page indicator: glowing underline

### Footer
- Dark with subtle grid pattern
- 4 column layout: Logo+tagline · Services · Company · Contact
- Social icons with hover glow
- Bottom bar: copyright + "Securing Enterprise IT Across Canada"

---

## ⚙️ Tech Stack Recommendation

### Option A — Framer (No-code, fastest to ship)
- Best for: Stunning animations out of the box, CMS for blog
- Motion: Framer's built-in scroll animations, variants, gestures
- Hosting: Framer native CDN
- Timeline: 1–2 weeks

### Option B — Next.js 14 + Framer Motion + Three.js
- Best for: Full control, SEO, CMS integration, scalability
- Animations: `framer-motion` for UI, `three.js`/`@react-three/fiber` for 3D background
- Particle network: `tsparticles` or custom canvas
- Smooth scroll: `Lenis`
- Hosting: Vercel
- Timeline: 3–4 weeks

### Option C — Webflow
- Best for: Non-developer team, CMS blog, fast edits
- Motion: Webflow Interactions 2.0 + GSAP via embed
- Hosting: Webflow CDN
- Timeline: 1–2 weeks

---

## 🎨 Design Tokens

```css
/* Colors */
--bg-primary: #040D1A;
--bg-surface: rgba(255,255,255,0.04);
--bg-surface-hover: rgba(255,255,255,0.07);
--accent-blue: #0066FF;
--accent-cyan: #00C2FF;
--accent-glow: rgba(0,102,255,0.25);
--text-primary: #FFFFFF;
--text-secondary: #94A3B8;
--text-muted: #475569;
--border: rgba(255,255,255,0.08);
--border-accent: rgba(0,102,255,0.4);

/* Typography */
--font-display: 'Inter', 'SF Pro Display', sans-serif;
--font-mono: 'JetBrains Mono', monospace; /* for code/tech accents */

/* Font Scale */
--text-hero: clamp(48px, 6vw, 88px);
--text-h1: clamp(36px, 4vw, 60px);
--text-h2: clamp(28px, 3vw, 44px);
--text-body: 18px;
--text-small: 14px;

/* Spacing */
--section-gap: clamp(80px, 10vw, 140px);

/* Shadows */
--glow-blue: 0 0 40px rgba(0,102,255,0.3);
--glow-card: 0 0 60px rgba(0,102,255,0.1);
--shadow-card: 0 25px 50px rgba(0,0,0,0.5);
```

---

## 🔥 Cinematic Reference Sites (Study These)

| Site | What to Steal |
|------|--------------|
| linear.app | Scroll storytelling, dark precision |
| stripe.com | Trust + motion balance, gradient use |
| crowdstrike.com | Cybersecurity brand authority |
| vercel.com | Hero simplicity, deploy animations |
| framer.com | Interactive components |
| resend.com | Minimal dark with glowing accents |
| clerk.com | Identity/auth brand — great for IDAM page |
| tailwindcss.com | Particle hero inspiration |

---

## 📱 Responsive Breakpoints
- Mobile: 375px — single column, simplified animations (respect `prefers-reduced-motion`)
- Tablet: 768px — 2-column grid
- Desktop: 1280px — full experience
- Wide: 1920px — constrained to 1400px max-width container

---

## ♿ Accessibility
- All animations respect `prefers-reduced-motion`
- WCAG AA contrast ratios
- Keyboard navigation for all interactive elements
- ARIA labels on icons and CTAs
- Skip-to-content link

---

## 📊 SEO & Performance
- Target Lighthouse score: 95+
- Core Web Vitals: LCP < 2.5s, CLS < 0.1
- OG images for each service page
- Structured data: Organization, LocalBusiness, Service schemas
- Target keywords: "cybersecurity managed services Canada", "PAM solutions enterprise", "IDAM solutions Canada", "IT managed services Ontario"

---

*NetGenX — Securing the Next Generation of Enterprise IT*
