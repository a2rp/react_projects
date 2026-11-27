# Password Strength Checker

Get a quick local estimate of password strength and suggestions for improving it. The checker evaluates the text in the current browser tab and does not send it to an account or server.

![Password Strength Checker preview](./screenshot.png)

## Features

- Estimates strength using length, character variety, repeated characters, common fragments, and simple sequences
- Gives specific improvement suggestions and a five-level visual meter
- Lets you reveal or hide the current input and clear it from the page
- Keeps the password in transient page state only; no project storage or password endpoint is used
- Responsive layout, keyboard-accessible controls, and reduced-motion support

## Use the checker

1. Enter a password in the private input field.
2. Review the strength estimate and suggestions.
3. Use the eye control to reveal or hide the text if needed.
4. Clear the field when finished, especially on a shared device.

## Privacy and limits

The check runs in this browser tab. This project does not upload or persist the password. The value is removed from the page when you clear it or refresh the page.

This is a lightweight heuristic, not a cryptographic entropy calculation or a check against breached-password lists. It cannot guarantee account security. Use long, unique passwords and a trusted password manager.

## Development

From this project folder:

```bash
npm ci
npm run dev
```

Run tests and build checks with:

```bash
npm test
npm run lint
npm run build
```

This project is maintained in the [React Projects collection](https://github.com/a2rp/react_projects/tree/main/projects/password-strength-checker).

## Links

- Portfolio: [ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [a2rp](https://github.com/a2rp)
- CodePen: [ash1198](https://codepen.io/ash1198)
- LinkedIn: [aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [theash.ashish](https://www.facebook.com/theash.ashish/)
- YouTube: [Ashish Ranjan](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)
- Support: [Donation page](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [a2rp](https://buymeacoffee.com/a2rp)
- Patreon: [a2rp](https://patreon.com/a2rp)