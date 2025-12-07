# Ajith K - Portfolio

A modern, static developer portfolio featuring:

- **Light theme** with 3D-ish depth and layered shadows
- **Interactive 3D monogram** using Three.js with cursor-reactive spring motion
- **Physics-based animations** using GSAP (spring/inertia easing)
- **Fluid typography** with `clamp()` for responsive scaling
- **Accessibility-first** with `prefers-reduced-motion` support
- **100% static** - deployable to GitHub Pages

## 🚀 Quick Start

### Local Development

No build step required! Simply serve the files locally:

```bash
# Using npx (Node.js required)
npx serve .

# Or using Python
python -m http.server 8000

# Or open index.html directly in your browser
```

Visit `http://localhost:3000` (or `http://localhost:8000` for Python).

### Live Server (VS Code)

1. Install the "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure & semantics |
| Tailwind CSS (CDN) | Utility-first styling |
| CSS Custom Properties | Design tokens |
| Three.js | 3D monogram/canvas |
| GSAP + ScrollTrigger | Physics-based animations |
| Font Awesome | Icons |
| Inter (Google Fonts) | Typography |

## 🎨 Design Tokens

The design system is defined in `assets/css/tokens.css`:

```css
/* Colors */
--color-base: #FAFAFA;           /* Background */
--color-accent-primary: #0066FF;  /* Primary accent */
--color-text-primary: #1A1A2E;    /* Headings */

/* Typography (fluid) */
--font-h1: clamp(2.5rem, 5vw + 1rem, 4.5rem);

/* Shadows (3D depth) */
--shadow-3d: 0 20px 40px rgba(0, 0, 0, 0.08), 
             0 0 80px rgba(0, 102, 255, 0.04);

/* Animation (spring physics) */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

## 🌐 Deploy to GitHub Pages

### Option 1: Push to `main` (simplest)

1. Push all files to the `main` branch
2. Go to **Repository Settings** → **Pages**
3. Source: Deploy from a branch
4. Branch: `main` / Root `/`
5. Save

Your site will be live at: `https://[username].github.io/[repo-name]/`

### Option 2: Using GitHub Actions (automatic)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Option 3: Using gh-pages branch

```bash
# Install gh-pages tool
npm install -g gh-pages

# Deploy (from project root)
npx gh-pages -d . -b gh-pages
```

Then in repo settings, set Pages source to `gh-pages` branch.

## 📁 Project Structure

```
portfolio/
├── index.html              # Main HTML file
├── .nojekyll               # Disable Jekyll processing
├── README.md               # This file
├── assets/
│   ├── css/
│   │   ├── tokens.css      # Design system tokens
│   │   └── styles.css      # Component styles
│   ├── img/
│   │   └── ...             # Project images
│   └── js/
│       ├── main.js         # Core functionality
│       ├── three-scene.js  # 3D monogram
│       └── animations.js   # GSAP animations
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions (optional)
```

## ✅ QA Checklist

| Requirement | Status | Notes |
|-------------|--------|-------|
| Static site (no server runtime) | ✅ | Pure HTML/CSS/JS |
| Hero H1 uses `clamp()` | ✅ | `clamp(2.5rem, 5vw + 1rem, 4.5rem)` |
| Interactive 3D canvas | ✅ | Three.js with spring motion |
| Spring/inertia animations | ✅ | GSAP with custom easing |
| `prefers-reduced-motion` respected | ✅ | CSS + JS checks |
| Keyboard navigation | ✅ | Focus states, skip link |
| Images lazy loaded | ✅ | `loading="lazy"` attribute |
| Scripts deferred | ✅ | Three.js/GSAP load async |
| Lighthouse Performance | 🎯 85+ | Target score |
| Lighthouse Accessibility | 🎯 90+ | Target score |

## 🔧 Customization

### Change Accent Color

In `assets/css/tokens.css`:

```css
:root {
  /* Blue (default) */
  --color-accent-primary: #0066FF;
  
  /* Or warm coral */
  /* --color-accent-primary: #FF6B5C; */
}
```

### Add Projects

Edit the Work section in `index.html`:

```html
<div class="project-card fade-in" tabindex="0">
  <div class="project-card-image">
    <img src="./assets/img/your-image.jpg" alt="Project Name" loading="lazy">
    <!-- ... -->
  </div>
  <div class="project-card-content">
    <h3 class="project-card-title">Your Project</h3>
    <!-- ... -->
  </div>
</div>
```

### Update Personal Info

Search and replace in `index.html`:
- Name: "Ajith" → "Your Name"
- Email: "ajithkalidasan@outlook.com" → your email
- Social links: Update all href attributes

## 🎭 Features

### 3D Monogram
- Low-poly geometric shapes (octahedron + orbiting tetrahedrons)
- Cursor-reactive rotation with spring physics
- Gentle floating animation
- Respects reduced motion preferences

### Spring Animations
- Card hover effects with elastic easing
- Scroll-triggered fade-in animations
- Expandable project cards with smooth height animation
- Skill node tooltips with spring motion

### Accessibility
- Skip navigation link
- Proper heading hierarchy
- ARIA labels on interactive elements
- Keyboard-navigable skill nodes and cards
- Visible focus states
- Reduced motion support

## 📜 License

MIT License - feel free to use this as a template for your own portfolio.

## 🙏 Credits

- [Three.js](https://threejs.org/) - 3D rendering
- [GSAP](https://greensock.com/gsap/) - Animations
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Font Awesome](https://fontawesome.com/) - Icons
- [Inter](https://rsms.me/inter/) - Typography
