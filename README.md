Coverage Page (Frontend)

A Vue 3 single-page app that displays Rollee datasources with tabs, search, filters, and sorting. Built as part of the Frontend Intern assignment.

## Tech Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Vite** – dev server & build tool
- **Vitest** – unit testing
- Plain CSS (no UI libraries)

## Features

- **Tabs** – filter by category (All Platforms, Gig Economy, Payments, Payroll & HRIS, Tax Portals, Utilities), each showing a live item count
- **Search** – filter platforms by name within the active tab
- **Status chips** – toggle filter for `Working` and `Coming soon`
- **Sortable columns** – click Platform, Type, or Status headers; stable client-side sort
- **Loading / Error / Empty** states
- **URL state sync** (bonus) – active tab, search term, sort column/direction, and status filters are persisted in the query string so the page is shareable/bookmarkable
- **Accessibility** – ARIA roles, `aria-sort`, `aria-pressed`, `aria-label`, keyboard focus styles throughout

## Project Structure

```
Coverage Page/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.js
    ├── style.css
    ├── App.vue                     # Root: state, filtering, URL sync
    ├── components/
    │   ├── TabBar.vue              # Category tabs with counts
    │   └── DataTable.vue          # Sortable table with logo + status icons
    ├── composables/
    │   └── useDatasources.js      # Fetch, normalize, error/loading state
    └── utils/
        ├── sort.js                 # Stable sort helper
        └── sort.test.js           # Vitest unit tests
```

## Getting Started

### Prerequisites

- [Node.js LTS](https://nodejs.org/) (v18+)

On Windows with winget:
```powershell
winget install OpenJS.NodeJS.LTS
```

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

### Run Unit Tests

```bash
npm test
```

Tests cover the `stableSort` utility: ascending/descending order, stability guarantee, no mutation of original array, and edge cases.

## Data

Fetched once on mount from:

```
https://api.getrollee.com/api/dashboard/v0.1/documentation/datasources
```

Each item is normalized to:

```js
{ id, name, category, type, status, logoUrl }
```

`status` is normalized to either `"Working"` or `"Coming soon"` regardless of the raw API value.

## URL Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `tab` | Active category tab | `?tab=Gig+Economy` |
| `search` | Search query | `?search=amazon` |
| `sortKey` | Column to sort by | `?sortKey=status` |
| `sortDir` | Sort direction | `?sortDir=desc` |
| `statuses` | Active status filters | `?statuses=Working` |
