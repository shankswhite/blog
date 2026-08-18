# KIRA AI Companion operations

KIRA is a single persistent browser session shared across portfolio routes. Text
and voice use the same named LiveKit AgentSession; the browser does not call a
second LLM endpoint for typed messages.

## Runtime flow

1. The visitor opens the global KIRA panel. Browsing alone does not connect to
   LiveKit or write engagement records.
2. A typed message creates a text-only LiveKit connection. The microphone is not
   requested or published.
3. Pressing the microphone button explicitly publishes a microphone track.
4. The named `kira-portfolio` worker runs Silero VAD, Deepgram Nova-3 through
   LiveKit Inference, Gemini 2.5 Flash Lite, and ElevenLabs TTS.
5. Final text/voice messages and page context are queued to the engagement API
   only after the visitor first interacts. Raw audio is not persisted.
6. A contact submission is stored first and then sent to Formspree as a
   notification. If Formspree fails, the UI reports that storage succeeded but
   notification could not be confirmed.

## Local development

The Next app reads the server-only LiveKit values from `.env.local`. The worker
reads `voice-agent/.env.local`. Both must target the same LiveKit project and use
the same non-secret agent name:

```text
LIVEKIT_AGENT_NAME=kira-portfolio
```

Run the web app on its normal development port. Run the persistent worker from
`voice-agent/` after installing `requirements.txt`:

```bash
python main.py download-files
python main.py dev
```

When `COMPANION_ENGAGEMENT_TABLE` is absent in development, interaction and lead
records are appended to `.local-data/companion-events.ndjson`. This file is
gitignored, mode `0600`, can contain personal data, and should be deleted when no
longer needed. The development fallback does not run automatic expiry cleanup;
the 90/365-day TTL policy applies only after the production DynamoDB table has
TTL enabled.

## Production LiveKit and worker

Configure the Amplify SSR runtime with the LiveKit URL/key/secret SSM paths and
`LIVEKIT_AGENT_NAME=kira-portfolio`. Configure the long-running Railway worker
with the matching LiveKit values plus Google and ElevenLabs values documented in
`voice-agent/env.example`.

The named agent is intentional. It prevents an older/default worker in the same
LiveKit project from randomly accepting a KIRA room. The token route dispatches
only the configured name, so the worker and token issuer must match exactly.

The worker is persistent and must not be moved into an on-request Amplify/Next
route. Railway's production command remains `python main.py start`.

## Avatar delivery

The 3D launcher is fail-closed and requires both public build variables:

```text
NEXT_PUBLIC_COMPANION_3D_ENABLED=true
NEXT_PUBLIC_COMPANION_AVATAR_URL=https://<cdn>/<versioned-model>.glb
```

When either value is absent, invalid, or the browser cannot load WebGL/model
data, the same button and conversation state remain available through the
tracked 2D KIRA artwork. The model URL is deliberately public because a browser
must download the model to render it.

Only the optimized web-display derivative belongs on the CDN. Purchased model
files, source VRMs, FBX/Unity packages, textures, licenses, and conversion
workspaces remain local and gitignored. The current asset is stored behind a
private S3 origin and served through CloudFront with a content-hashed immutable
key; CloudFront origin access prevents direct S3 reads but cannot prevent a
visitor from saving the browser-delivered derivative.

## DynamoDB setup

S3 is not the primary interaction database. One-object-per-event S3 writes are
hard to query and offer no conditional idempotency or native item TTL. S3 can be
added later for batch archive exports.

Create one DynamoDB **Standard**, **On-demand** table in the same AWS region as
the Amplify SSR app:

- partition key: `PK` (String)
- sort key: `SK` (String)
- TTL attribute: `expiresAt`
- no GSI, Streams, PITR, or customer-managed KMS key for the initial low-volume
  version

Set these Amplify runtime variables:

```text
COMPANION_ENGAGEMENT_TABLE=<table-name>
AWS_REGION=<table-region>
COMPANION_LEAD_FORMSPREE_ID=mpqqwdgr
```

Attach an Amplify SSR Compute role to the production branch and allow only
conditional item creation on this exact table. Replace the placeholders:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "WriteKiraEngagement",
      "Effect": "Allow",
      "Action": "dynamodb:PutItem",
      "Resource": "arn:aws:dynamodb:<region>:<account-id>:table/<table-name>"
    }
  ]
}
```

Do not give the browser AWS credentials and do not grant the web runtime Scan,
DeleteTable, or wildcard DynamoDB access. Records are conditionally inserted for
idempotency. Interaction items receive a 90-day expiry timestamp; lead items
receive a 365-day timestamp. DynamoDB TTL deletion is asynchronous, so privacy
copy says they are *scheduled* to expire rather than promising deletion at an
exact second.

## Data and notification caveats

- Contact details share the session partition with that visitor's KIRA messages
  and page context so Levon can understand the inquiry. The form discloses this
  linkage and Formspree delivery.
- Formspree notification currently has no persistent outbox. A failed
  notification remains stored in DynamoDB and is reported accurately to the
  visitor as unconfirmed; it is not guaranteed to be delivered later. Production
  should add an outbox/retry worker if notification delivery must be guaranteed.
- The 365-day TTL covers the site's DynamoDB copy only. Formspree processes and
  retains its copy under its own privacy and retention policy:
  <https://formspree.io/legal/privacy-policy/>.
- The current page snapshot is bounded and treated as untrusted reference data.
  It contains no URL query/hash and excludes KIRA conversation UI. The Agent has
  no tools that can execute page content.
- No raw microphone audio, IP address, user-agent string, or URL query is stored.
- Unsent engagement batches are retried from per-tab `sessionStorage` after a
  refresh and removed after the API accepts them. They are not placed in
  cross-session `localStorage`; abrupt tab/process loss before delivery remains
  a best-effort boundary rather than a transactional guarantee.

## Release checks

Before production, verify:

- the named worker registers as `kira-portfolio` and a text-only first message
  reaches it;
- microphone permission appears only after pressing the microphone button and
  the browser capture indicator clears when it is turned off;
- route changes update the page highlight and KIRA answers from the new page;
- with the 3D flag disabled, no Three.js or model request is made;
- with it enabled, the hashed CDN model loads once, direct S3 access is denied,
  and a blocked/failed model request leaves the 2D launcher usable;
- dragging closes the panel, waits one second after release, returns without
  opening the panel, and never places the launcher outside the visual viewport;
- DynamoDB writes succeed and TTL is enabled on `expiresAt`;
- Formspree success and failure return distinct UI messages;
- the privacy/retention wording matches the deployed backup and retention policy.
