# User Management Dashboard

A responsive React frontend for role-based user management. It connects to the JWT-secured [mpatel-backend](https://github.com/a2rp/mpatel-backend) API for authentication and user CRUD operations.

![User Management Dashboard preview](screenshot.png)

## Features

- Login flow with tab-scoped session storage and bearer tokens
- Role-aware add, edit, delete and view actions
- Searchable user directory
- Responsive fixed header with mobile navigation
- Icon-only links and support footer
- Accessible forms, loading states and clear service errors

## Tech stack

React, Vite, Chakra UI, Sass modules, Axios, React Router and React Icons.

## Run locally

The frontend expects the API at `http://localhost:1198/api/v1` by default. Copy `.env.example` to `.env.local` and set `VITE_API_URL` when the API uses another address. The backend must allow the frontend origin with its `CORS_ORIGIN` setting.

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
```

Set up the backend and create the initial administrator using the instructions in the backend repository before signing in. The server checks permissions on every protected request; hiding dashboard actions in the browser is only a convenience.

Collection source: [User Management Dashboard](https://github.com/a2rp/react_projects/tree/main/projects/mpatel-frontend)

## Links

- Portfolio: [https://www.ashishranjan.net/](https://www.ashishranjan.net/)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/a2rp](https://buymeacoffee.com/a2rp)
- Patreon: [https://patreon.com/a2rp](https://patreon.com/a2rp)
