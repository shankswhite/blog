# SIGNAL DECK — interactive portfolio direction

## Decision summary

The future homepage should feel like an original game interface without turning the portfolio into a game-engine export.

- Keep Next.js as the semantic, indexable application shell.
- Use Framer Motion and CSS for navigation, panel choreography, and the first 2.5D character system.
- Keep all routes, links, headings, project evidence, and long-form content as HTML.
- Add a decorative PixiJS layer only if the design later needs richer masks, trails, or particles.
- Consider React Three Fiber only if the final art direction specifically requires a real-time cel-shaded 3D character.
- Reserve Unity or Godot for an isolated playable project page, not the portfolio navigation shell.
- Build an original visual language and original character. Persona 5 and Arknights: Endfield are references for rhythm and staging, not assets or a style to reproduce.

This direction needs no new service subscription for the prototype. Any paid art commission, model runtime, asset license, or cloud feature requires a separate decision before purchase or activation.

## Creative premise

Working title: **SIGNAL DECK / 信号中枢**

The homepage is a personal archive command deck. An original system navigator presents Levon's work while signals, timelines, and modular panels reorganize around the selected section. The character is part of the spatial continuity of the interface, but never blocks access to the content.

The visual vocabulary is intentionally distinct from the reference games:

- deep indigo and near-black foundations;
- warm ivory reading surfaces;
- neon mint, ion blue, and small signal-yellow accents;
- 14-degree cuts, orbital paths, coordinates, and offset panels;
- strong typographic scale, but no copied typeface, collage treatment, HUD, insignia, uniform, icon, or character composition.

The current abstract signal console is the first placeholder for this system. It can later be replaced by the character without changing the surrounding content hierarchy.

## Information architecture

The interface can use game-like labels, but every destination should also have an immediately understandable name.

| Primary route | Interface label | Purpose |
| --- | --- | --- |
| `/projects` | Projects / Case Files | Case studies, role, process, technology, evidence, and outcomes |
| `/skills` | Skills / Capability Grid | Skills grouped by engineering, AI, games, and graphics, each linked to proof |
| `/resume` | Resume / Timeline | Work, education, certifications, and a downloadable resume |
| `/research` | Research & Posters / Research Archive | Papers, posters, theses, reports, and talks with an explicit publication status |
| `/blog` | Writing / Field Notes | Blog posts and technical notes |
| `/legacy` | Legacy / Archive Vault | The complete migrated copy of the previous Blog |
| `/chat` | AI Companion / Comms | The current account-free companion and any future, separately approved model integration |

`About` can remain reachable from the persistent identity block rather than competing for a primary menu slot. `Contact` can remain a global “Open Channel” action.

Until there are verified peer-reviewed publications, the public label should be **Research & Posters**, not “Published Papers.” Each entry should use a truthful content type (`paper`, `poster`, `thesis`, `report`, or `talk`) and status (`published`, `accepted`, `submitted`, `coursework`, or `in progress`).

## Desktop composition

The eventual home scene uses three stable regions:

1. **Section rail** — a compact list of primary destinations with a number, label, and one-line description.
2. **Navigator stage** — the original character or the current Signal Map, treated as the persistent visual anchor.
3. **Evidence preview** — a live preview of the selected section, one representative artifact, and a clear primary action.

The top-left identity block retains the only photograph of Levon. The large stage is for the fictional navigator or abstract system art, not another portrait.

The page must be usable before any entrance animation completes. There is no mandatory splash screen, and opening a deep link never redirects through the homepage.

## Transition language

All route changes should reuse one coherent spatial grammar. Direction comes from the route order instead of inventing an unrelated effect for every page.

### Home to a primary section

| Time | Motion | Product behavior |
| --- | --- | --- |
| 0–100 ms | The selected label expands and reveals its index and descriptor. | Navigation starts immediately; animation never delays the link. |
| 80–280 ms | A diagonal signal panel grows from the selected item and occludes about 70% of the stage. | The panel supplies a safe cut for character-pose and page-content changes. |
| 220–480 ms | Old panels exit along the route direction; the new heading enters behind the navigator. | The persistent navigator moves only 3–5%, preserving continuity. |
| 480–650 ms | The signal panel settles into the destination accent rail. | Focus moves to the new `h1`, and the route title is announced. |

Moving forward in the menu pushes toward the upper right; moving backward reverses the motion. Reduced-motion mode uses a direct switch or a 100–150 ms opacity change with no parallax, rotation, scale, or looping character movement.

### Project detail

A selected project card may use a shared-layout expansion into the detail hero. Browser back reverses the relationship. The URL and page content change normally, and the page remains usable if shared-layout animation is unavailable.

### Section-specific staging

- Projects: modular evidence blocks assemble into the grid.
- Skills: capability nodes reveal their supporting projects.
- Resume: a year scale unfolds into the timeline.
- Research: document panels align from a scattered archive state.
- Writing: field-note headers enter as sequential signal records.
- Legacy: color saturation falls slightly and an archive timestamp appears.
- Companion: the navigator moves to the foreground while Comms opens beside it.

## Character system

The navigator should be a new character, not an anime portrait of Levon and not a derivative of an existing game's cast. A restrained asset set is enough for the first version:

- Neutral — breathing/idle state;
- Present Left — points toward navigation;
- Present Right — presents page evidence;
- Comms — conversational state.

### Art workflow

1. Write a silhouette, role, functional costume, palette, and explicit “do not copy” brief.
2. Produce a front and three-quarter turnaround plus the four poses.
3. Separate body, rear hair, front hair, eyes, arms, coat/device, foreground detail, and shadow layers in the source file.
4. Keep the editable Krita/PSD source, creation notes, artist agreement, and asset licenses with the repository records.
5. Export transparent AVIF/WebP layers plus one flattened static fallback for each page family.
6. Animate only blink, breathing, light hair drift, and 3–5% pointer/parallax response. Hide pose changes behind the transition panel.

Concept-generation tools can be used for exploration, but the final design should receive deliberate structural and costume revisions. The project must record who created each published asset and which rights allow public portfolio use.

## Application architecture

```text
Next.js route and semantic HTML
└── GameShell (client boundary)
    ├── Persistent identity and primary DOM navigation
    ├── TransitionDirector
    │   ├── route order and direction
    │   ├── focus restoration and announcements
    │   └── Full / Calm effects preference
    ├── NavigatorStage
    │   ├── static AVIF/WebP first paint
    │   ├── optional layered 2.5D character
    │   └── optional lazy decorative renderer
    └── Route content (server-rendered headings, links, cards, and articles)
```

Recommended ownership boundaries:

- Server components own content, metadata, route structure, and first paint.
- `GameShell` owns only cross-route visual state and progressive enhancement.
- Normal `<Link>` elements remain the source of navigation truth.
- A route change cannot wait for an animation callback.
- Canvas, if added, is `aria-hidden` and never contains unique labels or controls.
- JavaScript or renderer failure leaves a complete conventional portfolio.

The first transition controller can stay deliberately small:

```text
idle → arming → covered → navigating → revealing → idle
```

A `(portfolio)` route group can hold a persistent shell without changing public URLs. Navigation must preserve normal link behavior—including modifier-click, new tabs, browser back/forward, and no-JavaScript fallback—and the visual state should follow `pathname` rather than becoming a second router.

The repository already uses React 18 and Framer Motion 10. The current `MotionProvider` honors the operating-system reduced-motion preference, so the first prototype can be built without a new dependency.

## Engine and renderer decision

| Option | Best use here | Main tradeoff | Decision |
| --- | --- | --- | --- |
| CSS + Framer Motion | DOM panels, shared-layout movement, 2.5D image layers, route choreography | Not a particle/mesh engine | **Use for the shell and first character prototype** |
| PixiJS v8 | 2D masks, signal trails, particles, displacement, sprite sheets | Canvas accessibility is opt-in; current Pixi React integration expects React 19 while this site uses React 18 | Add later only as a lazy, imperative, decorative layer |
| React Three Fiber v8 | Real-time cel-shaded 3D character and controlled camera staging on React 18 | Larger asset/runtime cost; GPU, battery, and mobile QA become material | Conditional path only after 3D art direction is approved |
| Godot Web | A self-contained playable demo | WebAssembly/WebGL2 payload and mobile/browser constraints; threaded exports need extra headers | Use only inside a dedicated project experience |
| Unity Web | An existing Unity demo with a justified desktop audience | Heavy shell integration and official mobile limitations | Do not use for primary navigation |
| Unreal | High-end native/desktop showcase | No appropriate supported Web portfolio target in the current platform list | Do not use for this site |

Technical references:

- [PixiJS v8 introduction](https://pixijs.com/8.x/guides/getting-started/intro), [renderers](https://pixijs.com/8.x/guides/components/renderers), [accessibility](https://pixijs.com/8.x/guides/components/accessibility), and [React ecosystem notes](https://pixijs.com/8.x/guides/getting-started/ecosystem)
- [React Three Fiber introduction and version pairing](https://r3f.docs.pmnd.rs/getting-started/introduction) and [performance scaling](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [Motion reduced-motion configuration](https://www.motion.dev/docs/react-motion-config) and [shared-layout animation](https://motion.dev/examples/react-shared-layout-animation)
- [Godot 4.5 Web export](https://docs.godotengine.org/en/4.5/tutorials/export/exporting_for_web.html)
- [Unity Web technical limitations](https://docs.unity3d.com/cn/current/Manual/webgl-technical-overview.html) and [browser compatibility](https://docs.unity3d.com/cn/6000.0/Manual/webgl-browsercompatibility.html)
- [Unreal supported project platforms](https://dev.epicgames.com/documentation/unreal-engine/project-section-of-the-unreal-engine-project-settings?lang=en-US)

Spine, Live2D, Rive, commissioned art, paid models, and asset-marketplace purchases are separate licensing/cost decisions. None is required for the first two phases, and none should be subscribed to or purchased without approval.

## Optional 3D path

If a later visual test proves that 2.5D art cannot deliver the desired staging, use React Three Fiber v8 with the existing React 18 application:

- author and rig a low-complexity character in Blender;
- export a compressed GLB with a static WebP poster;
- dynamically import the 3D stage only after the semantic homepage is interactive;
- use on-demand rendering when the character is idle;
- cap device pixel ratio and reduce shadow/particle quality by device capability;
- pause rendering when the tab or stage is not visible;
- replace the 3D stage with the poster in Calm mode, on constrained devices, or after renderer failure.

This is a deliberate second art direction, not a hidden upgrade to the 2.5D implementation.

## Mobile behavior

- Keep the top identity row compact; use a Menu control instead of the desktop rail.
- Give the navigator or Signal Map about 38–45vh on the home scene.
- Place destinations in a horizontally scrollable bottom deck with at least 44px targets; swipe is optional and every item remains directly clickable.
- On inner routes, reduce the navigator to a shallow top band so the page heading and evidence appear in the first viewport.
- Hide the character in low-height landscape mode and retain only the section accent and title.
- Target 280–360 ms mobile transitions with transform and opacity only; disable broad blur, particles, and pointer parallax.

## Accessibility and failure modes

- Maintain a predictable Tab sequence: destinations, preview, primary action, then content.
- Optional arrow or J/K navigation operates only when the destination deck is focused; Enter/Space activates and Escape closes a panel.
- Global shortcuts are disabled while an input or editable element has focus.
- Route completion moves focus to the destination `h1` without stealing focus during ordinary in-page updates.
- Visible focus rings are part of the visual system, not a browser afterthought.
- The Full / Calm preference is local to the browser and does not require an account.
- No autoplay audio. Future effects use only original or explicitly licensed sound.
- First paint always has a flattened static asset. Advanced layers enhance it after idle/loading time.
- WebGL or character-layer failure falls back to the static asset; JavaScript failure falls back to ordinary pages and links.

## Performance targets

Targets are acceptance gates rather than promises tied to a particular tool:

- The semantic home page becomes interactive without waiting for character animation assets.
- The first visual is a compressed static image or the current CSS Signal Map.
- A 2.5D character's initial web assets should aim to remain below 1 MB at the primary desktop crop and substantially smaller on mobile.
- Any decorative Pixi/3D bundle is dynamically imported and absent from pages that do not use it.
- Maintain a steady 60 fps target on a representative desktop and 30–60 fps on supported mobile devices; automatically choose Calm behavior when the effect budget cannot be sustained.
- Avoid cumulative layout shift by reserving the navigator stage aspect ratio before assets load.
- Test slow network, low-power mobile, keyboard-only, reduced motion, browser back/forward, deep links, and renderer failure before release.

## Implementation phases

### Phase 1 — visual placeholder (complete locally)

- Remove the large personal photograph from the homepage.
- Keep the small identity avatar.
- Add a responsive CSS Signal Map that represents Research, Systems, Games, Projects, Skills, and Papers.

### Phase 2 — interaction prototype

- Define the route/deck data model.
- Add `GameShell` and `TransitionDirector` with a geometric navigator placeholder.
- Prototype Home → Projects → Project detail and Home → Legacy before applying the system everywhere.
- Add focus restoration, route announcements, Calm mode, mobile layout, and failure fallback at the same time as the animation.

### Phase 3 — original character

- Approve a character brief and rights workflow before producing final assets.
- Implement four poses as layered 2.5D images and a flattened fallback.
- Measure loading and motion on representative desktop and mobile devices.
- Decide whether a small decorative Pixi layer is justified by a concrete missing effect.

### Phase 4 — content completeness

- Build Skills with project evidence links.
- Build Research & Posters with truthful types and publication states.
- Normalize project case studies and resume evidence.
- Integrate Writing, Legacy, and Companion into the deck without changing their stable URLs.

### Phase 5 — release audit

- Validate visual originality and every art/audio license.
- Run build, route, responsive, performance, keyboard, reduced-motion, and fallback tests.
- Review Amplify frontend-only versus full-stack behavior separately.
- Obtain explicit approval before any commit/push/deployment/domain action that the owner wants Codex to perform.

## Next decision gate

Prototype Phase 2 with the geometric Signal Map first. In parallel, choose one art direction:

1. **Illustrated 2.5D navigator — recommended.** Faster, lighter, visually authored, and aligned with the reference feeling without turning the site into a renderer-heavy application.
2. **Cel-shaded 3D navigator.** More camera freedom and continuous pose interpolation, but materially higher modeling, rigging, rendering, performance, and fallback cost.

No purchase or service activation is needed to evaluate either direction with local placeholder assets.
