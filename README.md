# Levon Zhao — Portfolio and Legacy Blog

This repository contains the current Next.js portfolio, its curated AI Companion, and an in-site migration of the previous portfolio under `/legacy`.

## Local development

```bash
npm ci
npm run dev
```

Before releasing a change, run:

```bash
npm run lint
npm run build
npm audit --omit=dev
```

The project is pinned to the latest supported Next.js 15 release for AWS Amplify Hosting. Patched PostCSS and Sharp versions are locked through npm overrides.

## Hosting boundary

`amplify.yml` is deliberately frontend-only. It installs dependencies and builds the Next.js app; it does not run `ampx pipeline-deploy` or provision Cognito, AppSync, DynamoDB, API Gateway, or Bedrock resources.

The public AI Companion and Pathfinding Lab run locally in the browser. The contact form sends only after a visitor explicitly submits it to the existing Formspree endpoint.

The production build command sets `NEXT_PUBLIC_SITE_URL=https://www.levon.blog` so canonical metadata, `robots.txt`, and `sitemap.xml` use the public HTTPS domain. `env.example` documents the same value for other environments.

See [MIGRATION.md](MIGRATION.md) for the Legacy URL map, release checklist, exceptions, and rollback plan.

## Content and media

Portfolio text, project material, and original visuals remain the property of their respective owners. No blanket open-source license is granted for personal content or media by this repository. Third-party music and character imagery without a retained publication license are excluded from the public build.
