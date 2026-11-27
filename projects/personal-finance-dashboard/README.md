# Personal Finance Dashboard

A responsive, client-side finance dashboard for tracking transactions, accounts, and envelope budgets, reviewing monthly charts and KPIs, and exporting transactions to CSV.

![Personal Finance Dashboard preview](screenshot.png)

## Features

- Monthly overview with balance, income, expense, net cash flow, and budget KPIs
- Income and expense charts with month navigation
- Transaction search, filters, sorting, totals, delete undo, and CSV export
- Account and envelope management with local persistence
- Responsive header, navigation panel, and icon-only footer links

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm. From this project folder:

```bash
npm ci
npm run dev
```

Run these checks before building:

```bash
npm run lint
npm run build
```

This project is maintained in the [React Projects collection](https://github.com/a2rp/react_projects/tree/main/projects/personal-finance-dashboard).

## Data and privacy

The dashboard has no backend or account system. Finance data is stored in this browser's LocalStorage, which is not encrypted by this app and can be read by someone with access to the browser profile. Avoid entering bank credentials or other highly sensitive information, and treat downloaded CSV files as private. If browser storage is blocked or full, the app keeps changes in memory for the current session and shows a warning; those changes will not survive a refresh.

## Links

- Portfolio: [ashishranjan.net](https://www.ashishranjan.net/)
- GitHub: [a2rp](https://github.com/a2rp)
- CodePen: [ash1198](https://codepen.io/ash1198)
- LinkedIn: [aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [theash.ashish](https://www.facebook.com/theash.ashish/)
- YouTube: [Ashish Ranjan](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)
- Support: [Donation page](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [a2rp](https://buymeacoffee.com/a2rp)
- Patreon: [a2rp](https://patreon.com/a2rp)