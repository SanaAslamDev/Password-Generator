<div align="center">

<br/>

# KeyVault

### A clean, dark-themed password manager built with HTML, CSS &amp; JavaScript

<br/>

[![Live Demo](https://img.shields.io/badge/demo-live-6c63ff?style=for-the-badge)](https://password-generator-save.netlify.app/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)

[![License: MIT](https://img.shields.io/badge/license-MIT-444?style=flat-square)](#license)
![No dependencies](https://img.shields.io/badge/dependencies-none-2E8B57?style=flat-square)
![Status](https://img.shields.io/badge/status-active-2E8B57?style=flat-square)

<br/>

**[View Live Demo](https://password-generator-save.netlify.app/)** &nbsp;·&nbsp; **[Report a Bug](https://github.com/SanaAslamDev/Password-Generator/issues)** &nbsp;·&nbsp; **[Request a Feature](https://github.com/SanaAslamDev/Password-Generator/issues)**

<br/>

</div>

<p align="center">
Generate strong passwords, watch their strength scored in real time, and save them to a personal vault — built with clean, separated HTML, CSS, and JavaScript files and no external frameworks.
</p>

<br/>

<div align="center">
<img src="https://img.shields.io/badge/-Generate-181c29?style=flat-square&labelColor=6c63ff" height="26"/>
&nbsp;→&nbsp;
<img src="https://img.shields.io/badge/-Save-181c29?style=flat-square&labelColor=6c63ff" height="26"/>
&nbsp;→&nbsp;
<img src="https://img.shields.io/badge/-Vault-181c29?style=flat-square&labelColor=6c63ff" height="26"/>
</div>

<br/>

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [How it works](#how-it-works)
- [Security notes](#security-notes)
- [Author](#author)
- [License](#license)

---

## Features

<table>
<tr>
<td width="50%" valign="top">

**Password generator**
Adjustable length from 6 to 32 characters via a slider, with four toggleable character sets — uppercase, lowercase, numbers, and symbols. The result types itself onto the screen with a short animation.

**Live strength meter**
Every password is scored against five criteria and displayed as a color-coded bar with five strength dots, ranging from *Very Weak* to *Excellent*.

**One-click copy**
Copy any generated or saved password instantly. The button briefly confirms the action before resetting.

</td>
<td width="50%" valign="top">

**Personal vault**
Save passwords alongside a site name and username. Entries persist in the browser, so they're still there on your next visit.

**Vault management**
Saved entries appear as cards with an auto-generated initials avatar, masked password dots, and quick copy or delete actions. A live counter on the Vault tab shows how many entries are stored.

**Password visibility toggle**
Reveal or mask the password you're typing with a single click of the eye icon.

</td>
</tr>
</table>

---

## Tech stack

<div align="center">

| Layer | Technology | Notes |
|:---|:---|:---|
| Structure | HTML5 | Semantic markup in `index.html` |
| Styling | CSS3 | Custom properties, flexbox, keyframe animations in `style.css` |
| Logic | Vanilla JavaScript (ES6) | No frameworks, no build step, in `script.js` |
| Storage | `localStorage` | Client-side persistence, no server |
| Icons | Inline SVG | No external icon font or CDN dependency |

</div>

<p align="center"><sub>No npm packages. No build tools. No backend. Plain HTML, CSS, and JS.</sub></p>

---

## Getting started

**Option 1 — Try it instantly**

Open the live demo: [password-generator-save.netlify.app](https://password-generator-save.netlify.app/)

**Option 2 — Run it locally**

```bash
git clone https://github.com/SanaAslamDev/Password-Generator.git
cd Password-Generator
```

Then open `index.html` directly in any modern browser. No server, no build command, and no dependencies to install.

---

## Project structure

```
Password-Generator/
├── index.html      page markup — header, tabs, and the three panels
├── style.css        all visual styling, grouped by component
├── script.js         app logic, broken into numbered, commented steps
└── README.md         this file
```

`index.html` links the other two files in the usual way:

```html
<link rel="stylesheet" href="style.css">
...
<script src="script.js"></script>
```

**`style.css`** is organized into clearly commented sections — reset rules, color variables, header/logo, tab bar, cards, form fields, the length slider, option pills, the strength meter, buttons, the saved-password list, and the toast notification.

**`script.js`** is broken into numbered, commented steps covering tab switching, password generation, strength scoring, clipboard actions, saving and deleting vault entries, and rendering the saved list. Data is kept in a single array in memory and synced to `localStorage` on every change.

---

## How it works

| Step | Tab | What happens |
|:---:|:---|:---|
| 1 | **Generate** | Builds a character pool from the selected checkboxes and assembles a random password with `Math.random()`, then scores it for strength. |
| 2 | **Save** | Bundles the password with a site name and username into an object, which is added to an array and persisted as JSON in `localStorage`. |
| 3 | **Vault** | Reads that array back and renders every saved entry as a card, so the UI always reflects current storage. |

A full line-by-line explanation of the code is available in the accompanying project report, `KeyVault-Project-Report.pdf`.

---

## Security notes

Passwords are stored only in the browser's `localStorage` — there is no server, account system, or sync across devices. This project is intended as a learning and personal-use tool rather than a production-grade credential manager. For anything sensitive, a dedicated, audited password manager is recommended.

---

## Author

<div align="center">

**Sana Aslam**

[![GitHub](https://img.shields.io/badge/GitHub-SanaAslamDev-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SanaAslamDev)

</div>

---

## License

This project is open source and available under the MIT License — free to use, modify, and learn from.

<br/>

<div align="center">
<sub>If you found this project useful, consider giving it a star.</sub>
</div>
