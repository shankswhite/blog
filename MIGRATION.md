# Legacy Blog migration and deployment runbook

## Current topology

- The original repository and Amplify app remain intact as the rollback copy.
- This repository is the new portfolio and is connected to a separate Amplify app/staging environment.
- The migrated copy lives inside this site under `/legacy`; it is not an external-link-only archive.
- Duplicate Legacy project-detail pages remain browsable but use the main project URL as canonical and are excluded from the sitemap.
- The new app must pass staging checks at its Amplify URL before `levon.blog` is detached from the old app.
- This migration does not add or subscribe to a new service. Existing Amplify Hosting usage still follows the account's current billing plan.

## Amplify deployment boundary

`amplify.yml` is intentionally frontend-only. It runs:

1. `npm ci`
2. `npm run build`

It does not run `ampx pipeline-deploy`. The existing `amplify/` directory contains auth, data, and Bedrock-related configuration, but the public portfolio build neither deploys nor calls those resources. Keep those files out of the frontend release commit.

The AI Companion is curated and runs locally in the browser. Publishing the portfolio therefore requires no Cognito, AppSync, DynamoDB, or Bedrock provisioning.

Do not connect or transfer `levon.blog` during staging. The frontend build command sets `NEXT_PUBLIC_SITE_URL=https://www.levon.blog` so canonical metadata, sitemap, and social links use the final HTTPS hostname.

## Legacy URL compatibility

| Previous URL | Migrated destination |
| --- | --- |
| `/yolo-kan`, `/yolo` | `/legacy/projects/yolo-kan` |
| `/Research/Levon_Poster.pdf` | `/media/research/levon-yolo-kan-poster.pdf` |
| `/cg` | `/legacy/computer-graphics` |
| `/cg/Morphing`, `/morphing.html`, `/CG/BeierNeely/*` | `/legacy/projects/beier-neely-morphing` |
| `/cg/RayTracing` | `/legacy/computer-graphics#ray-tracing` |
| `/chatbot` | `/legacy/ai-chatbot` |
| `/pathfinding` | `/legacy/pathfinding` |
| `/ml4t` | `/legacy/projects/ml-trading` |
| `/unity` | `/legacy/projects/climbing-game` |
| `/recipe` | `/legacy/projects/recipe-app` |
| `/mahjong` | `/legacy/projects/mahjong` |
| `/qa` | `/legacy/projects/job-comparator` |
| `/os` | `/legacy/projects/distributed-file-system` |
| `/cgame` | `/legacy/projects/opengl-pathfinding-game` |

## Explicit migration exceptions

- The background track was removed because the repository contains no publishable license for the third-party recording.
- The old login-gated Bedrock interaction is represented by a curated, account-free public companion. Existing backend configuration is outside this frontend deployment.
- The old Computer Graphics index named a Ray Tracing demo, but the implementation is absent from the source repository. The archive records the missing implementation instead of inventing one.
- Personal phone data, unlinked course submissions, raw PSD files, starter assets, inactive template sections, and Lorem Ipsum testimonials are not republished.
- The old character source images and derived character video are not republished because their credit and publication license were not retained. An original abstract warp-field visual replaces them; four geometric transformation videos preserve the implementation record.

## Release and rollback checklist

- Keep `amplify/backend.ts`, `amplify/data/resource.ts`, and `amplify/data/bedrock.js` out of the release commit.
- Run `npm ci`, `npm run lint`, `npm run build`, `npm audit --omit=dev`, and route checks from a clean checkout.
- Preview `/`, `/legacy`, `/legacy/pathfinding`, and `/legacy/ai-chatbot` on desktop and mobile.
- Push the frontend-only release to the new Amplify app and verify its default domain before changing DNS.
- During the approved cutover window, detach the custom domain from the old app, attach it to the new app, and make the apex permanently redirect to `https://www.levon.blog`.
- Verify HTTPS, apex and `www`, Legacy redirects, `robots.txt`, and `sitemap.xml` after cutover.
- Do not delete the old repository or Amplify app. Its default Amplify domain is the rollback target if the cutover fails.
