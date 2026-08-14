# Workout Tracker PWA

This is a private, iPhone-first workout tracking app built as a Progressive Web App.

## What is included

- PIN-protected access
- local workout logging with sets, reps, weight, and notes
- local storage persistence in the browser
- mobile-optimized layout for Safari on iPhone
- installable as a PWA home screen app

## Local development

```bash
npm install
npm run dev -- --host
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Update the `base` path in `vite.config.js` to match your repo name, if needed.
3. Run:

```bash
npm run deploy
```

4. In GitHub, open Settings → Pages and publish from the `gh-pages` branch.

## iPhone install

Open the GitHub Pages URL in Safari on iPhone and use the Share button to choose “Add to Home Screen.”

## Personal access note

This app stores data in the browser and locks access with a PIN. It is a practical personal-only setup, but GitHub Pages itself is still public hosting and not a true private auth system.
