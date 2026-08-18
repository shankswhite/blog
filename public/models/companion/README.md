# Companion model boundary

Licensed avatar binaries and their source packages are intentionally excluded
from Git. Production loads only an optimized, web-display derivative from the
configured HTTPS CDN URL.

- Keep `NEXT_PUBLIC_COMPANION_3D_ENABLED=false` unless a tested model URL is
  available. The 2D launcher remains the fail-closed default.
- `NEXT_PUBLIC_COMPANION_AVATAR_URL` is public by design: anything a browser can
  render can also be downloaded by a visitor.
- Never commit purchased VRM, FBX, UnityPackage, textures, license archives, or
  conversion workspaces to this directory.
- Use immutable, content-hashed filenames and retain the 2D fallback for model,
  WebGL, CORS, or network failures.
