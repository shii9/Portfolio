<div align="center">

<img src="public/favicon.svg" alt="Logo" width="64" height="64" />

# Sourov Hossen — Cybersecurity Portfolio

**Security Researcher · Penetration Tester · CSE Student @ Daffodil International University**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-shii9.github.io%2FPortfolio-0ea5e9?style=for-the-badge&logo=github)](https://shii9.github.io/Portfolio/)
[![GitHub](https://img.shields.io/badge/GitHub-shii9-181717?style=for-the-badge&logo=github)](https://github.com/shii9)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sourov_Hossen-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/sourov-hossen-307655351/)
[![Twitter](https://img.shields.io/badge/Twitter-@Shiii999999-1DA1F2?style=for-the-badge&logo=twitter)](https://x.com/Shiii999999)

</div>

---

## 🔗 Live Site

> **https://shii9.github.io/Portfolio/**

---

## 📋 Overview

A fully responsive, dark-themed personal portfolio built with **React + TypeScript + Vite** and deployed on **GitHub Pages**. It showcases my journey as a cybersecurity researcher — featuring real projects, security research, CTF achievements, skills, and a contact form.

The site features a cyberpunk-inspired aesthetic with animated 3D elements, a custom cursor glow effect, smooth scroll-driven transitions, and a scroll progress indicator — all built without any heavy UI framework.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎨 **Cyberpunk Dark Theme** | Custom design system with neon-green primary accent, glassmorphism cards |
| 🌀 **Animated Hero** | 3D CyberShield, hex grid background, word-by-word headline reveal |
| 🖱️ **Custom Cursor** | Glow effect + crack particle trail on click |
| 📊 **Animated Stats** | CountUp numbers that animate on scroll into view |
| 🗂️ **Sections** | Hero · Skills · Projects · Research · Experience · Achievements · Contact |
| 📱 **Fully Responsive** | Mobile-first layout, works on all screen sizes |
| ⚡ **Performance** | Code-split chunks, gzip <100 kB per bundle, 2051 modules in 4.4s build |
| ♿ **Accessible** | Respects `prefers-reduced-motion`, semantic HTML |
| 🔒 **Security Headers** | `public/_headers` with CSP, HSTS, X-Frame-Options |

---

## 🗂️ Sections

- **Hero** — Name, rotating role badge (Security Researcher · Bug Hunter · Pen Tester · …), education, location, and social links
- **Skills** — Grouped skill cards: Security tools, programming languages, frameworks, platforms
- **Projects** — Featured security and development projects with tech stack tags and links
- **Research** — AI-integrated cybersecurity research, papers, and publications
- **Experience** — Work history and internships in timeline format
- **Achievements** — CTF wins, certifications, and academic milestones
- **Contact** — Contact form with social media links

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + custom CSS variables |
| **Animations** | [Framer Motion](https://www.framer-motion.com/) |
| **Routing** | [Wouter](https://github.com/molefrog/wouter) (lightweight React router) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) primitives |
| **Icons** | [Lucide React](https://lucide.dev/) + [React Icons](https://react-icons.github.io/react-icons/) |
| **Theme** | [next-themes](https://github.com/pacocoursey/next-themes) (dark mode) |
| **Deployment** | [GitHub Pages](https://pages.github.com/) via [gh-pages](https://github.com/tschaub/gh-pages) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/shii9/Portfolio.git
cd Portfolio

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The dev server starts at **http://localhost:5174**

### Build for Production

```bash
npm run build
```

Output is placed in the `dist/` directory.

### Deploy to GitHub Pages

```bash
npm run deploy
```

This runs `predeploy` (production build) then pushes `dist/` to the `gh-pages` branch automatically.

---

## 📁 Project Structure

```
Portfolio/
├── public/                 # Static assets
│   ├── favicon.svg
│   ├── hero-custom.png
│   ├── opengraph.jpg
│   ├── resume.pdf
│   ├── robots.txt
│   └── _headers            # Security headers (CSP, HSTS)
├── src/
│   ├── components/
│   │   ├── layout/         # Navbar, Footer, Section wrapper
│   │   ├── sections/       # Hero, Skills, Projects, Research,
│   │   │                   # Experience, Achievements, Contact
│   │   └── ui/             # Reusable UI primitives + custom effects
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Animation presets, utilities
│   ├── pages/              # Route-level pages (404)
│   ├── App.tsx             # Root component + routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles + design tokens
├── vite.config.ts          # Vite configuration (base: /Portfolio/)
├── tsconfig.json           # TypeScript configuration
├── package.json            # Scripts & dependencies
└── components.json         # shadcn/ui component config
```

---

## 🎨 Design Highlights

- **Color palette**: Deep dark background (`#0a0a0f`) with a neon cyan-green primary (`hsl(165 80% 45%)`)
- **Typography**: Serif headings (Playfair Display) + sans-serif body (Inter)
- **Glassmorphism**: Semi-transparent cards with `backdrop-blur` for depth
- **3D Elements**: SVG-based animated CyberShield and hex grid patterns
- **Micro-animations**: Every section uses staggered Framer Motion reveals

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with 🛡️ by **Sourov Hossen** · [shii9.github.io/Portfolio](https://shii9.github.io/Portfolio/)

</div>
