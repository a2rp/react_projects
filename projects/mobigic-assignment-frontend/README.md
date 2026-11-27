# Mobigic Assignment Frontend

A responsive React client for private file uploads, account access, and shareable downloads. Each signed-in user sees and manages only their own files.

## Features

- Registration and sign-in with a short-lived bearer token.
- Token storage scoped to the current browser tab.
- Private file list, upload, download, share-link copy, and delete actions.
- Mobile-friendly navigation and Sass module styling.

## Tech stack

React, React Router, Sass modules, Axios, React Icons, Vite, and Vitest.

## Requirements

- Node.js 22.12 or later
- The Mobigic Assignment Backend

## Run locally

1. Start the [Mobigic Assignment Backend](https://github.com/a2rp/mobigic-assignment-backend) on port `1198`.
2. Copy `.env.example` to `.env.local`.
3. Install dependencies with `npm install`.
4. Start this app with `npm start`.

The development proxy forwards `/api` requests to `http://localhost:1198`. Vite uses the `VITE_API_URL` environment variable; the local example uses `/api`.

## Deploy

Set `VITE_API_URL` to the full API URL, including `/api`, before building. For example:

```bash
VITE_API_URL=https://api.example.com/api npm run build
```

In PowerShell, set `$env:VITE_API_URL = 'https://api.example.com/api'` before `npm run build`. Configure the backend's `CORS_ORIGIN` to the deployed frontend's origin. The full download link is a bearer link: anyone with the link can download that file, and deleting the file disables the link.

```bash
npm run deploy
```

Routes use the URL hash so GitHub Pages can serve nested screens without a server-side rewrite.

## Preview

![File gallery preview](public/preview.png)

## Links

- Portfolio: [ashishranjan.net](https://www.ashishranjan.net/)
- GitHub: [a2rp](https://github.com/a2rp)
- CodePen: [ash1198](https://codepen.io/ash1198)
- LinkedIn: [Ashish Ranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [The Ash](https://www.facebook.com/theash.ashish/)
- YouTube: [Ashish Ranjan](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- [Support](https://a2rp-donation-page.netlify.app/)
- [Buy Me a Coffee](https://buymeacoffee.com/a2rp)
- [Patreon](https://patreon.com/a2rp)
