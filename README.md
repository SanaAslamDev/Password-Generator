<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:FF7A00,100:2F8CA5&height=180&section=header&text=KeyVault&fontSize=46&fontColor=0f0f13&fontAlignY=38&desc=Generate.%20Save.%20Protect.&descAlignY=58&descSize=16&descColor=1a1a2e" width="100%" />

<br>

[![View Live Demo](https://img.shields.io/badge/VIEW_LIVE_DEMO-FF7A00?style=for-the-badge&logo=netlify&logoColor=0f0f13)](https://passwordgenerator0112.netlify.app)

<br><br>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![No Build Tools](https://img.shields.io/badge/Build_Tools-None-2EA043?style=flat-square)
![No Frameworks](https://img.shields.io/badge/Frameworks-None-2EA043?style=flat-square)

</div>

<br>

> A clean, warm-themed password generator and personal vault built with **pure HTML, CSS, and JavaScript**. Cryptographically secure password generation, a live strength meter, and local persistence — no frameworks, no build tools, no backend.

<br>

## Contents

<table>
<tr>
<td valign="top" width="50%">

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)

</td>
<td valign="top" width="50%">

- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [Security Notes](#security-notes)
- [Deployment](#deployment)
- [Author](#author)

</td>
</tr>
</table>

<br>

## Overview

KeyVault is a single-page, tab-based password toolkit. It moves between three states — Generate, Save, and Vault — entirely with vanilla JavaScript toggling a shared `active` class, with no page reloads and no routing library. Every password is generated using the Web Crypto API rather than `Math.random()`, scored for strength in real time, and can be stored locally for future reference.

<br>

## Features

<table>
<tr>
<td width="50%">

**Password Generator**
- Adjustable length from 6 to 32 characters via slider
- Four toggleable character sets — uppercase, lowercase, numbers, symbols
- Cryptographically secure randomness (`crypto.getRandomValues`)
- Live regenerate on length change (debounced)

</td>
<td width="50%">

**Strength Meter**
- Real-time scoring across five criteria
- Color-coded progress bar with five strength dots
- Labels ranging from *Very Weak* to *Excellent*
- Penalizes repeated-character patterns

</td>
</tr>
<tr>
<td width="50%">

**Save &amp; Vault**
- Save a password alongside a site name and username
- Show/hide toggle on the password field
- Entries persist in the browser across sessions
- Live entry counter on the Vault tab

</td>
<td width="50%">

**Vault Management**
- Auto-generated initials avatar per entry
- Masked password display with one-click copy
- Confirm-before-delete on every entry
- Empty-state illustration when the vault is empty

</td>
</tr>
</table>

<br>

## Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=html,css,js" />

</div>

<br>

<div align="center">

| Layer | Technology |
|:---:|:---:|
| Structure | HTML5 |
| Styling | CSS3 — custom properties, flexbox, keyframe animations |
| Fonts | Google Fonts — Lilita One, Nunito |
| Logic | Vanilla JavaScript (ES6) |
| Randomness | Web Crypto API (`crypto.getRandomValues`) |
| Persistence | `localStorage` — client-side only, no server |
| Icons | Inline SVG — no external icon font or CDN dependency |

</div>

<br>

## Project Structure

```
KeyVault/
├── index.html      Page markup — header, tabs, and the three panels
├── style.css       All visual styling, grouped by component
├── script.js       App logic, organized by feature
└── README.md       This file
```

<div align="center">

| File | Responsibility |
|:---:|:---|
| `index.html` | Semantic markup for the header, tab navigation, and Generate / Save / Vault panels |
| `style.css` | Theming, layout, responsiveness, and all animations |
| `script.js` | Tab switching, password generation, strength scoring, storage, and rendering |

</div>

<br>

## Architecture

```
Generate Tab ──▶ Save Tab ──▶ Vault Tab
     │                            ▲
     │                            │
     └────── Use to Save ─────────┘
```

The app is a single-page state machine. At any moment exactly one tab panel is visible — JavaScript controls this by adding or removing one shared `active` class, never by navigating to a different page. Vault data is held in a single in-memory array and synced to `localStorage` on every change.

<br>

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/SanaAslamDev/Password-Generator.git
cd Password-Generator
```

**2. Open in your browser**

No build step is required — simply open `index.html` directly, or serve it locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

**Or, try it instantly:** [passwordgenerator0112.netlify.app](https://passwordgenerator0112.netlify.app)

<br>

## How It Works

| Step | Tab | What Happens |
|:---:|:---|:---|
| 1 | **Generate** | Builds a character pool from the selected checkboxes and assembles a random password using the Web Crypto API for cryptographically secure randomness, then scores it for strength. |
| 2 | **Save** | Bundles the password with a site name and username into an object, added to an array and persisted as JSON in `localStorage`. |
| 3 | **Vault** | Reads that array back and renders every saved entry as a card, so the UI always reflects current storage. |

<br>

## Security Notes

Passwords are stored only in the browser's `localStorage` — there is no server, account system, or sync across devices. This project is intended as a learning and personal-use tool rather than a production-grade credential manager. For anything sensitive, a dedicated, audited password manager is recommended.

<br>

## Deployment

This project is a static site and deploys to Netlify with no configuration:

1. Drag the project folder onto [app.netlify.com/drop](https://app.netlify.com/drop), **or**
2. Connect the GitHub repository through **Add new site → Import an existing project**, with no build command and the publish directory set to the project root.

<br>

<div align="center">

## Author

**Sana Aslam**

[![GitHub](https://img.shields.io/badge/GitHub-SanaAslamDev-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SanaAslamDev)
[![Live Project](https://img.shields.io/badge/Live_Project-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://passwordgenerator0112.netlify.app)

<br>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2F8CA5,100:FF7A00&height=100&section=footer" width="100%" />

</div>
