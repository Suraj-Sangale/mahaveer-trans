# HTML → Next.js Converter — Usage Guide

> **Script:** [`scripts/html-to-nextjs.js`](./scripts/html-to-nextjs.js)
> Converts any vanilla HTML/CSS/JS page into a fully dynamic Next.js App Router page component.

---

## Quick Start

```bash
# Basic usage — route name is auto-derived from the filename
npm run convert -- components/about.html

# With an explicit route name
npm run convert -- components/service.html services
```

---

## Full Command Reference

```bash
# Syntax
npm run convert -- <path-to-html> [optional-route-name]

# Examples
npm run convert -- components/about.html
npm run convert -- components/contact.html
npm run convert -- components/service.html
npm run convert -- components/faq.html faq
npm run convert -- components/pricing.html pricing
```

> You can also run the script directly with Node:
> ```bash
> node scripts/html-to-nextjs.js components/about.html about
> ```

---

## What the Script Does (Step by Step)

| Step | What happens | Output |
|------|-------------|--------|
| **1** | Extracts the `<style>` block from the HTML | `app/<name>.css` |
| **2** | Parses the `SITE_DATA = { ... }` object from `<script>` | `app/<route>/data.ts` |
| **3** | Detects interactive features (theme, drawer, fonts, counters…) | Used in Step 5 |
| **4** | Converts the `<body>` HTML structure to JSX | Used in Step 5 |
| **5** | Generates a complete React page with the right hooks | `app/<route>/page.tsx` |
| **6** | Adds the new CSS import to `app/layout.tsx` automatically | Updates `layout.tsx` |

---

## Auto-Detected Interactive Features

The script scans the original JavaScript and automatically adds the correct React hooks for any feature it finds:

| Feature | React hook generated |
|---------|---------------------|
| Dark / Light theme toggle | `useState` + `useEffect` + `localStorage` |
| Mobile hamburger drawer | `useState` (open/close + body overflow lock) |
| Font customization panel | `useState` for display & body font, `useEffect` to set CSS vars |
| Accent color picker | `useState` + `useEffect` to set `--accent` CSS variable |
| Scroll-reveal animations | `useEffect` with `IntersectionObserver` |
| Animated number counters | `useRef` + `IntersectionObserver` + `setInterval` count-up |
| Navbar scroll shadow | `useState` + scroll `addEventListener` |
| Tracking / search form | `useState` for value, found, and error states |

---

## HTML → JSX Conversions Applied

The script automatically rewrites every HTML attribute to be JSX-compatible:

| HTML | JSX |
|------|-----|
| `class="..."` | `className="..."` |
| `for="..."` | `htmlFor="..."` |
| `tabindex="..."` | `tabIndex="..."` |
| `style="color:red"` | `style={{ color: "red" }}` |
| `onclick="fn()"` | `{/* TODO: onclick="fn()" */}` _(flagged for manual fix)_ |
| `href="page.html"` | `href="/page"` _(Next.js friendly)_ |
| `<img ...>` | `<img ... />` _(self-closing)_ |
| `<input ...>` | `<input ... />` _(self-closing)_ |
| `disabled` | `disabled={true}` |

---

## After Running the Script — What to Do Next

### 1. Wire up dynamic data

Open the generated `app/<route>/page.tsx` and search for **`TODO`**.

These comments mark HTML elements that were empty in the source (originally filled by JS DOM manipulation). Replace them with data from `SITE_DATA`:

```tsx
// Before (auto-generated)
<h1 className="hero-h1" id="heroTitle" {/* TODO: dynamic */}></h1>

// After (you fix it)
<h1 className="hero-h1">{d.hero.title}</h1>
```

### 2. Update your content in `data.ts`

Open `app/<route>/data.ts` — this contains all the page content extracted from the original JS. Edit it to match your real content:

```ts
export const SITE_DATA = {
  hero: {
    title: "About MahaveerTrans",
    description: "Your trusted logistics partner since 1999.",
    // ...
  },
  // ...
} as const;
```

### 3. Fix any remaining `TODO` event handlers

Search for `{/* TODO: onclick */}` in `page.tsx` and replace with proper React handlers:

```tsx
// Before
{/* TODO: onclick="openModal()" */}

// After
onClick={() => setModalOpen(true)}
```

### 4. Start the dev server

```bash
npm run dev
```

Visit `http://localhost:3000/<route>` to see your new page.

---

## File Structure After Conversion

```
app/
├── layout.tsx          ← auto-updated with CSS import
├── landing.css         ← CSS for the home page
├── <route>.css         ← CSS extracted from your HTML
└── <route>/
    ├── page.tsx        ← React component (edit TODOs here)
    └── data.ts         ← All page content (edit this for copy changes)
```

---

## Tips & Best Practices

- **One HTML file = one route.** Keep a `components/*.html` source file for each page you want to convert.
- **Edit `data.ts` for content**, `page.tsx` for layout/logic. This keeps concerns separated.
- **CSS is global** — if two pages share the same design system (same CSS variables, fonts, etc.), you only need one CSS file. Import it once in `layout.tsx`.
- **The script is safe to re-run** — it won't overwrite `layout.tsx` if the import already exists.
- **Images** — the script keeps `<img src="...">` as-is. If you want to use Next.js `<Image>` for optimization, replace them manually.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Page styles are broken | Check that `app/<name>.css` was imported in `layout.tsx` |
| Dynamic content is missing | Search for `TODO` in `page.tsx` and wire up data |
| TypeScript errors | Run `npm run build` to see all errors, fix missing types in `data.ts` |
| Fonts not loading | Ensure the Google Fonts `<link>` is in `app/layout.tsx` `<head>` |
| Links go to 404 | The script converts `.html` links to `/route` — make sure the route folder exists |
