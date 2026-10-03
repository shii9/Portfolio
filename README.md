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
| 🎨 **Cybersecurity Dark Theme** | Curated dark aesthetic with warm cyber-orange primary accents and emerald status badges |
| 🌀 **Animated Hero** | Dynamic background grid, headline reveals, and rotating security role badges |
| 🖱️ **Custom Cursor & Interactions** | Glow effect, smooth hover micro-animations, and scroll indicator |
| 📊 **Animated Stats** | CountUp numbers that animate into view upon scrolling |
| 🗂️ **Interactive Investigation Map** | 6-phase expandable SOC attack pipeline with instant narrative breakdowns |
| 📱 **Mobile & Desktop Optimized** | Fully responsive layout across all device viewports |
| ⚡ **Performance** | Code-split chunks with Vite 6, fast load times, and gzip optimization |
| ♿ **Accessible & Secure** | Semantic HTML, respects motion preferences, and configured security headers |

---

## 🗂️ Sections

- **Hero** — Name, rotating role badge (Security Researcher · Bug Hunter · Pen Tester · …), education, location, and social links
- **Skills** — Grouped skill cards: Security tools, programming languages, frameworks, platforms
- **Projects & Simulations** — Flagship threat simulations and security development tools:
  - **Flagship SOC Threat Simulation & DFIR** — End-to-end adversary simulation featuring a 3-node lab architecture, 6-phase investigation pipeline, Splunk SPL detection queries, and original reports (`.pdf` / `.docx`)
  - **Security Tools & Software Applications** — Open-source tools (*EchoMe, DorkNio, UrlShine, Nio AI Assistant, LSB Steganography, ReconNio*)
- **Research & Write-ups** — Numbered academic papers and published technical write-ups:
  - **Research Experience (01 - 02)** — Peer-reviewed/academic papers on Explainable AI (XAI) + NIDS and User Cyber Risk Modeling
  - **Write-ups (01 - 03)** — In-depth lab guides (*Splunk SOC Home Lab*, *curl*, *FFUF*)
- **Experience** — Work history, research positions, and internships in interactive timeline format
- **Achievements** — CTF wins, certifications, and academic milestones
- **Contact** — Interactive contact form with verified social media links

---

## 🔬 Featured SOC Threat Simulation (Projects Section)

### 🛡️ SOC Threat Detection Analysis Simulation: Endpoint Compromise & Log Correlation
* **Simulation Repository:** [shii9/SOC_Simulation (Simulation 1)](https://github.com/shii9/SOC_Simulation/tree/main/SOC_Investigation_Simulation_1)
* **Investigation Reports:** Direct on-site viewing via **PDF** and downloadable **DOCX** format
* **Lab Architecture:**
  - `Kali Linux (192.168.110.141)` — Offense / Attacker Platform (Metasploit C2)
  - `Windows 10 (192.168.110.140)` — Target / Victim Endpoint (Sysmon & Security Audit)
  - `Windows 11 (192.168.110.142)` — Defense / Splunk Enterprise SIEM
* **6-Phase Interactive Attack Lifecycle:**
  1. **Phase 01: Initial Access & Command and Control (C2)** — Meterpreter reverse HTTP callback via `FreeClude.exe` (Sysmon Event 1 & 3)
  2. **Phase 02: System Discovery & Host Fingerprinting** — Reconnaissance commands (`whoami`, `hostname`, `systeminfo`)
  3. **Phase 03: Persistence & Privilege Escalation** — Backdoor user `ClaudeBackdoor` added to local Administrators + elevated Scheduled Task `GetClaudeBackdoor` (Win Event 4698 / 4720)
  4. **Phase 04: Tool Transfer via certutil (LOLBIN)** — Living-off-the-land payload download disguising Mimikatz as `GetClaude.exe`
  5. **Phase 05: Credential Access & Memory Inspection (Mimikatz)** — Enabling `SeDebugPrivilege` targeting LSASS memory handles
  6. **Phase 06: Splunk SIEM Correlation & Sigma Detection Engineering** — Process lineage tracking via Sysmon `ProcessGuid`, SPL hunting queries, and authored Sigma rules

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
| **Theme** | Custom Dark Theme with Tailored Cybersecurity Color Palettes |
| **Deployment** | [GitHub Pages](https://pages.github.com/) via GitHub Actions |

---

## 🎨 Design Highlights

- **Color palette**: Deep cybersecurity dark canvas with tailored cyber-orange (`#FF6B35`) accent and emerald indicator badges
- **Typography**: Editorial serif headings combined with crisp monospace tags and sans-serif body typography
- **Glassmorphism**: Semi-transparent card surfaces with `backdrop-blur` for clean visual hierarchy
- **Interactive Phase Explorer**: Click-to-inspect 6-phase attack reconstruction with dynamic Prev/Next phase walkthroughs
- **Responsive Architecture Flow**: Visual 3-node system architecture diagram with mobile-optimized touch controls

---

<div align="center">

Made with 🛡️ by **Sourov Hossen** · [shii9.github.io/Portfolio](https://shii9.github.io/Portfolio/)

</div>
