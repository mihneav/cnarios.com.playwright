# cnarios.com.playwright

Automated end-to-end tests for [cnarios.com](https://cnarios.com) using **Playwright** and **TypeScript**.

---

## 📘 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Configuration](#configuration)
- [Folder Structure](#folder-structure)

---

## 🧭 Overview

This project provides automated UI tests for the [cnarios.com](https://cnarios.com) website, built using Playwright + TypeScript.  
The goal is to ensure website quality by validating key flows, page functionality, and UI stability.

---

## ✨ Features

- ✅ End-to-end tests using **Playwright Test Runner**
- 🧩 TypeScript support
- 🌐 Multi-browser testing (Chromium, Firefox, WebKit)
- 📸 Automatic screenshots and trace captures on failures
- ⚙️ Configurable test settings via `playwright.config.ts`
- 🧱 Page Object Model (POM) structure for maintainability
- 💡 Easy CI/CD integration (via GitHub Actions)

---

## 🧰 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm or yarn
- A modern browser (Playwright can also install them automatically)

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/mihneav/cnarios.com.playwright.git
cd cnarios.com.playwright

# Install dependencies
npm install
# or
yarn install

# (Optional) Install Playwright browsers
npx playwright install
```

---

## 🚀 Running Tests

Run all tests:
```bash
npx playwright test
```

Run tests in a specific browser (e.g., Chromium):
```bash
npx playwright test --project=chromium
```

Run a single test file:
```bash
npx playwright test tests/example.spec.ts
```

Run tests in headed mode (visible browser window):
```bash
npx playwright test --headed
```

Record a trace for debugging:
```bash
npx playwright test --trace on
```

Generate an HTML report:
```bash
npx playwright show-report
```

---

## ⚙️ Configuration

Main configuration file: **`playwright.config.ts`**

You can customize:
- Test directories and timeouts
- Browser projects
- Reporters (HTML, list, JSON, etc.)
- Screenshot and trace settings
- Environment variables

---

## 🗂 Folder Structure

```
.
├── .github/workflows/       # CI/CD workflows
├── .vscode/                 # VSCode settings
├── lib/                     # Page objects and helper classes
├── tests/                   # Test suites (.spec.ts)
├── utils/                   # Shared utilities
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```


