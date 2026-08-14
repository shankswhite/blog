# KIRA voice agent

This long-running worker joins LiveKit rooms and runs the realtime portfolio
pipeline:

`Silero VAD -> Deepgram Nova-3 STT -> Gemini -> ElevenLabs TTS -> LiveKit`

STT defaults to Deepgram Nova-3 through LiveKit Inference, so it uses the
LiveKit Cloud credentials and needs no separate Deepgram key. Set
`STT_PROVIDER=deepgram` only when you want direct Deepgram billing and have a
valid `DEEPGRAM_API_KEY`.

## Local development

Use Python 3.12-3.14, create a virtual environment, install
`requirements.txt`, copy `env.example` to `.env.local`, and run:

```bash
python main.py download-files
python main.py dev
```

The browser and this worker must use the same LiveKit project. The worker is a
persistent process and should be deployed separately from Amplify's Next.js
runtime, for example on Railway with the included `railway.toml`.

The committed `portfolio_context.md` is the public, non-executable source of
truth for KIRA. For a private deployment override, create
`companion_context.md`; it is ignored by Git. `COMPANION_CONTEXT` remains an
environment-based override for hosts that inject the context at runtime.
