# Levon Zhao — Portfolio, Writing, and Legacy Blog

This repository contains the current Next.js portfolio, a curated AI Companion,
Notion-backed Writing and Projects, and an in-site copy of the previous portfolio
under `/legacy`.

## Local development

```bash
nvm use 22
npm ci
npm run dev
```

`predev` and `prebuild` run the Notion content compiler. Without Notion
configuration it creates an empty generated cache and the built-in articles and
projects remain available. With configuration, an API or schema error fails the
build instead of silently publishing missing content.

Before releasing a change, run:

```bash
npm run test:unit
npm run lint
npx tsc --noEmit
npm run build
npm audit --omit=dev
```

## Content architecture

- Built-in content is the durable fallback and remains in the repository.
- Published Notion pages are compiled once before a build into a normalized,
  gitignored snapshot.
- Writing is published at `/blog/[slug]`; the former `/blog/notion/[slug]`
  implementation route redirects to the canonical URL.
- Notion Projects can add new work or override a built-in project with the same
  slug.
- Expiring Notion-hosted media is downloaded only from exact trusted hosts,
  checked against a safe MIME allowlist, stored in the build artifact, and its
  URL is rewritten before rendering.
- The browser never receives the Notion API token.

See [docs/NOTION_CMS.md](docs/NOTION_CMS.md) for the schema, author workflow,
security boundary, and optional automatic Amplify rebuild setup.

## Hosting boundary

`amplify.yml` is frontend-only. It installs dependencies and builds the Next.js
app; it does not run `ampx pipeline-deploy` or provision Cognito, AppSync,
DynamoDB, API Gateway, or Bedrock resources.

The public AI Companion runs locally in the browser. The Pathfinding Lab calls
the existing public API Gateway and `pathfinding-generator` Lambda retained
from the original site; it stores no visitor data, but its requests remain
subject to the existing AWS usage-based billing. The contact form sends only
after a visitor explicitly submits it to the existing Formspree endpoint.

Preview builds derive their canonical URL from Amplify and are `noindex`. The
production branch must explicitly set
`NEXT_PUBLIC_SITE_URL=https://www.levon.blog` only when the custom domain is
approved for cutover.

No Notion connection, SSM parameter, Amplify incoming webhook, deployment, or
domain change is created by this repository. Automatic publishing is disabled
until both the publishing flag and the explicit best-effort deduplication/cost
acknowledgement are enabled. It uses the existing Notion/AWS accounts rather
than adding a SaaS automation dependency, but each publish—and a rare duplicate
event across server instances—can consume Amplify build minutes. Persistent
coalescing should be approved before production automation if duplicate builds
are unacceptable.

See [MIGRATION.md](MIGRATION.md) for the Legacy URL map, release blockers,
rollback plan, and domain-switch checklist.

## Content and media

Portfolio text, project material, and original visuals remain the property of
their respective owners. No blanket open-source license is granted for personal
content or media by this repository.

The faithful Legacy copy currently includes third-party music, character media,
and a personal phone number from the original experience. They remain an
explicit production-release blocker until publication rights and contact-data
intent are confirmed; the code and documentation must not claim they were
removed while the files are still served.
