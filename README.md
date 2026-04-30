# English A1 Trainer MVP

A static Duolingo-like MVP for Ukrainian speakers learning English A1. It uses Vite, React, TypeScript, React Router HashRouter, static JSON content, and localStorage.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production output is generated in `dist`.

## GitHub Pages

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

In GitHub, open `Settings` -> `Pages` and set `Source` to `GitHub Actions`.

On every push to `main`, the workflow runs:

```bash
npm install
npm run build
```

The `dist` folder is deployed to GitHub Pages. The app uses `HashRouter`, so routes such as `#/course/english-a1` work on static hosting without server rewrites.
