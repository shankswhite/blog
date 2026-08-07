# Notion CMS runbook

## What this provides

Levon can write and publish both Writing and Projects in one Notion Content data
source. A build compiles only explicitly published rows, retrieves each page as
enhanced Markdown, snapshots temporary media, validates the content, and then
generates static portfolio pages.

```text
Notion Content data source
        │ signed event (optional)
        ▼
/api/notion/webhook
        │ verified server-side
        ▼
existing Amplify incoming webhook
        │
        ▼
prebuild → sync:notion → static Writing / Projects
```

This design keeps the Notion token out of browser JavaScript, preserves the last
successful deployment when Notion is unavailable, and avoids runtime dependence
on one-hour signed media URLs.

## Data source schema

Create one full-page database/data source named `Content` and share it only with
a read-only internal Notion connection.

| Property | Notion type | Required | Values / purpose |
| --- | --- | --- | --- |
| `Title` | Title | Yes | Public title |
| `Type` | Select | Yes | Exact options `Writing`, `Project` |
| `Slug` | Rich text | Yes | Lowercase letters/numbers joined by single hyphens |
| `Description` | Rich text | Yes | Card and SEO summary |
| `Date` | Date | Yes | Publish/project date |
| `Tags` | Multi-select | Yes | Writing tags; shared taxonomy |
| `Published` | Checkbox | One publish field required | Only checked rows publish |
| `Status` | Status or Select | One publish field required | Alternative with exact `Published` option |
| `Cover URL` | URL | No | Cover image; legacy property name `Image` also works |
| `Category` | Select or Rich text | Projects | Example: `Production AI` |
| `Year` | Rich text or Number | Projects | Display year/range |
| `Stack` | Multi-select | Projects | Technologies |
| `Accent` | Select | Projects | `red`, `sky`, `violet`, `amber`, `emerald`, or `slate` |
| `Featured` | Checkbox | Projects | Eligible for the three flagship cards |
| `Order` | Number | Projects | Lower values appear first |
| `External URL` | URL | Projects | Live demo/source/internal root-relative route |
| `Action Label` | Rich text | Projects | CTA copy |

The page body is the article or project case study. Unsupported or inaccessible
Notion blocks fail the build with the affected page ID so content is never
silently dropped.

## Local setup

1. Create a Notion internal connection with only `Read content` capability.
2. Share the `Content` data source with that connection.
3. Copy `env.example` to `.env.local` and set only:

   ```dotenv
   NOTION_API_KEY=secret_...
   NOTION_CONTENT_DATA_SOURCE_ID=...
   ```

4. Run `npm run sync:notion`, then `npm run dev`.

Do not paste a token into source files, a `NEXT_PUBLIC_*` variable, a commit, or
chat. `.env*`, generated JSON, and downloaded Notion media are gitignored.

## Author workflow

1. Keep the row Draft/unpublished while writing.
2. Fill every required property and preview locally or on staging.
3. Set `Published`/`Status` only when the page is ready.
4. The next build updates `/blog/[slug]` or `/projects/[slug]`, metadata, and the
   sitemap together.
5. To edit a live article without triggering repeated builds, return it to Draft,
   edit, then publish once.

Slugs are public API: changing one breaks inbound links. Keep an existing slug
unless a redirect is added deliberately.

## Optional automatic Amplify rebuild

The bridge is present but disabled by default. Enabling it changes external AWS
state and can consume paid build minutes, so do this only after explicit approval.
It does not require Zapier, Make, or another SaaS subscription.

Recommended secret boundary:

- Put the Notion API key and Amplify incoming webhook URL in SSM **SecureString**
  parameters. Reserve a third, unused path for the Notion verification token;
  the one-time setup handler creates that SecureString without logging its value.
- Give the Amplify build role `ssm:GetParameter` only for the Notion API-key
  parameter.
- Give the Amplify SSR compute role `ssm:GetParameter` only for the two webhook
  parameters.
- Only during the short handshake window, give the SSR compute role
  `ssm:PutParameter` for the single unused verification-token path. Remove that
  write permission immediately after setup.
- Configure only the non-secret parameter paths and data-source/scope IDs as
  Amplify environment variables.
- Amplify build variables are not automatically available to SSR compute. The
  build therefore copies only an explicit allowlist of non-secret feature flags,
  scope IDs, and SSM parameter **paths** into `.env.production` for packaging.
- The actual token, API key, and incoming webhook URL are never copied into
  `.env.production`; placing them there could expose secrets in an SSR artifact.

One-time activation sequence:

1. Create an incoming webhook for the staging branch in the existing Amplify app.
2. Choose an unused SSM path, configure it as
   `NOTION_WEBHOOK_VERIFICATION_TOKEN_SSM_PATH`, and temporarily grant the narrow
   `ssm:PutParameter` permission described above.
3. Deploy the code with `NOTION_WEBHOOK_SETUP_MODE=true` and automatic publishing
   still false.
4. In the Notion connection Webhooks tab, create a subscription for
   `https://<staging-host>/api/notion/webhook`.
5. The endpoint stores the token directly as a Standard-tier SecureString. Reveal
   it through the access-controlled SSM console, paste it into Notion to complete
   verification, then immediately disable setup mode and remove `PutParameter`.
   The token is never printed in application logs.
6. Configure `NOTION_WEBHOOK_WORKSPACE_ID` and
   `NOTION_WEBHOOK_SUBSCRIPTION_ID` for strict scope checks.
7. Set `NOTION_AUTO_PUBLISH_ENABLED=true` only after a manual staging test.
8. Choose the build-usage policy before enabling the final flag:
   - Lowest risk: leave `NOTION_ALLOW_BEST_EFFORT_DEDUPLICATION=false` and
     trigger one staging build manually after publishing.
   - Automatic, explicit opt-in: set it to `true`, accepting that the 24-hour
     duplicate-event cache is process-local and separate SSR instances can very
     occasionally trigger duplicate Amplify builds.
   - Strict production control: add an approved persistent coalescing store
     before enabling automation. That changes AWS state and is intentionally not
     provisioned by this repository.

For lowest build usage, subscribe only to publication/property changes, delete,
undelete, and schema changes. Enabling `page.content_updated` means edits to an
already-published page can trigger additional builds. Notion aggregates many
rapid edits, but Amplify billing still follows the account's build-minute plan.
The in-memory event cache is defense in depth, not a cross-instance guarantee.

## Failure behavior

- No configuration: an empty generated cache is created; repository content works.
- Partial configuration: the build fails with a configuration error.
- API/schema/slug/media error: the build fails and the previous deployed site stays
  online.
- Duplicate slug: the build fails before routing.
- Draft/Archived row: it is not included.
- Temporary Notion media: exact HTTPS file hosts only, every redirect is
  revalidated, executable HTML/SVG types are rejected, and downloads have a
  50 MB per-file and 150 MB total cap.
- Webhook disabled: signed events are acknowledged, but no build is triggered.
- Setup storage unavailable or the SecureString path already exists: the
  handshake fails closed and the token is not logged.
- Auto-publish enabled without the explicit deduplication/cost acknowledgement:
  the event is acknowledged without triggering a build, avoiding webhook retries.

AWS Amplify Hosting does not support on-demand ISR, so the bridge triggers a new
static build instead of calling `revalidatePath`/`revalidateTag` at runtime.
