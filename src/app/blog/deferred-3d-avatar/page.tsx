import Link from "next/link";
import { BlogLayout } from "@/components/BlogLayout";
import { createPageMetadata } from "@/lib/siteMetadata";

const meta = {
  date: "2026-09-13",
  title: "Deferring KIRA’s 3D Avatar Until the First Conversation",
  description:
    "How two React states defer KIRA’s WebGL avatar until first use, preserve it after closing, and make its lifecycle observable in the browser.",
  image: "/images/ai-companion/ai-companion-og.jpg",
  imageFit: "contain" as const,
  tags: ["React", "Next.js", "WebGL", "Performance"],
};

const sourceRoot =
  "https://github.com/shankswhite/blog/blob/1d86ec56b24840cd986b3bbc41caf7fcd8a6e954";

const activationExample = `const [isOpen, setIsOpen] = useState(false);
const [hasActivatedAvatar, setHasActivatedAvatar] = useState(false);

const openConversation = useCallback(() => {
  setHasActivatedAvatar(true);
  setIsOpen(true);
}, []);`;

const inspectionExample = `(() => {
  const host = document.querySelector(
    '[data-persistent-avatar-host="true"]'
  );
  const stage = host?.querySelector('[data-avatar-runtime="three"]');
  return {
    state: host?.getAttribute('data-avatar-load-state'),
    canvasCount: host?.querySelectorAll('canvas').length ?? 0,
    mountId: stage?.getAttribute('data-avatar-mount-id'),
  };
})()`;

export const metadata = createPageMetadata({
  title: meta.title,
  description: meta.description,
  path: "/blog/deferred-3d-avatar",
  type: "article",
  publishedTime: meta.date,
  image: meta.image,
  tags: meta.tags,
});

export default function Page() {
  return (
    <BlogLayout meta={meta} path="/blog/deferred-3d-avatar">
      <p>
        KIRA is the floating companion on Levon Blog. Its 3D avatar can remain
        available while a visitor browses. The previous implementation also
        started the avatar before the conversation was opened.{" "}
        <Link href="https://github.com/shankswhite/blog/commit/1d86ec56b24840cd986b3bbc41caf7fcd8a6e954">
          Commit 1d86ec5
        </Link>{" "}
        changes that lifecycle: show the existing portrait first, activate 3D
        when the conversation is first opened, and retain the activated avatar
        when the panel closes.
      </p>

      <h2>What was starting on the homepage</h2>
      <p>
        The September 13, 2026 production inspection found a canvas marked{" "}
        <code>three.js r185</code> and an avatar state of <code>ready</code> without
        opening KIRA. The public model response advertised a{" "}
        <code>Content-Length</code> of <strong>5,118,216 bytes</strong>, about
        <strong> 4.88 MiB</strong>. Five additional 3D JavaScript chunks returned
        <strong> 199,498 bytes</strong> of gzip response bodies, about 195 KiB. The{" "}
        <Link href={`${sourceRoot}/docs/SEO_COMPETITOR_AUDIT_2026-09-13.md?plain=1#L112-L137`}>
          recorded resource checks
        </Link>{" "}
        distinguish these measurements: the model size came from HTTP headers;
        the script figure came from compressed responses. Neither is a complete
        browser transfer total or a measured load-time saving.
      </p>
      <p>
        The avatar already used{" "}
        <Link href={`${sourceRoot}/src/components/FloatingAvatarChat.tsx#L28-L34`}>
          next/dynamic with ssr: false
        </Link>
        . Its render condition was simply <code>!avatarFailed</code>, which was
        true on the initial client render. The component therefore still
        mounted immediately, creating a WebGL renderer and starting the{" "}
        <Link href={`${sourceRoot}/src/components/companion-3d/AvatarStage.tsx#L1016-L1020`}>
          model loader
        </Link>
        . Splitting the code into a separate chunk had not tied its startup to
        visitor intent.
      </p>

      <h2>Two states with different lifetimes</h2>
      <p>
        <code>isOpen</code> controls the panel. <code>hasActivatedAvatar</code>{" "}
        records whether this mounted component has been activated at least
        once. Opening KIRA sets both:
      </p>
      <pre><code>{activationExample}</code></pre>
      <p>
        The{" "}
        <Link href={`${sourceRoot}/src/components/FloatingAvatarChat.tsx#L535-L547`}>
          avatar render condition
        </Link>{" "}
        becomes <code>hasActivatedAvatar &amp;&amp; !avatarFailed</code>. The{" "}
        <Link href={`${sourceRoot}/src/components/FloatingAvatarChat.tsx#L111-L119`}>
          close handler
        </Link>{" "}
        clears <code>isOpen</code> and calls the existing microphone-disable
        handler, leaving the activation flag unchanged. Closing the panel
        therefore does not itself destroy the avatar. Before activation, the
        host exposes <code>data-avatar-load-state=&quot;deferred&quot;</code>; afterward,
        it exposes the actual loading, ready, or failure state. The portrait
        remains available while 3D is loading or unavailable.
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th scope="col">Action</th>
              <th scope="col">Before</th>
              <th scope="col">After</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Visit homepage</th>
              <td>Avatar starts immediately</td>
              <td>Portrait; avatar deferred</td>
            </tr>
            <tr>
              <th scope="row">First open</th>
              <td>Avatar startup already underway</td>
              <td>Open panel and start avatar</td>
            </tr>
            <tr>
              <th scope="row">Close panel</th>
              <td>Avatar remains mounted</td>
              <td>Activated avatar remains mounted</td>
            </tr>
            <tr>
              <th scope="row">Reload document</th>
              <td>Avatar starts again</td>
              <td>Activation resets</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Persistence has a boundary</h2>
      <p>
        The floating companion lives in the{" "}
        <Link href={`${sourceRoot}/src/app/layout.tsx#L59-L81`}>root layout</Link>,
        outside the page content. Production checks preserved the same mount
        identifier after closing the conversation and following the home
        page’s View all articles link to the blog. The dedicated <code>/chat</code>{" "}
        and <code>/ai-companion</code>{" "}
        routes are exceptions: the floating component{" "}
        <Link href={`${sourceRoot}/src/components/FloatingAvatarChat.tsx#L434`}>
          returns null
        </Link>{" "}
        and removes its stage. Returning to an ordinary page can recreate the
        stage because the activation flag survives within the root layout.
        A full document reload resets that flag.
      </p>
      <p>
        Keeping the renderer after activation is a resource trade-off. Closing
        the panel does not suspend its rendering loop. This change postpones
        initial avatar work; it does not implement an idle-resource policy.
      </p>

      <h2>Repeat the browser check</h2>
      <p>
        On the production homepage with 3D enabled, open DevTools, enable
        Disable cache in Network, and reload before touching KIRA. This
        read-only console expression reports the floating host and its{" "}
        <Link href={`${sourceRoot}/src/components/companion-3d/AvatarStage.tsx#L1100-L1113`}>
          mount identifier
        </Link>
        :
      </p>
      <pre><code>{inspectionExample}</code></pre>
      <ol>
        <li>
          Before opening KIRA, expect <code>deferred</code> and zero avatar
          canvases. Check Network for model requests and their initiators.
        </li>
        <li>
          Open KIRA. After a successful model load, expect <code>ready</code>{" "}
          and one canvas. Record the mount identifier.
        </li>
        <li>
          Close the panel, follow the site’s Blog link, and inspect again.
          Compare the identifier to check for remounting; canvas presence alone
          does not prove that the same instance survived.
        </li>
      </ol>

      <h2>What the verification establishes</h2>
      <p>
        Production reached a ready Three.js r185 canvas after first opening
        KIRA. Local verification at <code>http://127.0.0.1:3007</code> encountered
        a CORS failure: the model response allowed the origin{" "}
        <code>https://www.levon.blog</code>. Verify successful model loading on
        the allowed origin, or explicitly configure a development asset origin.
        The production check covered opening, closing, and home-to-blog
        navigation; it did not exercise message delivery or voice end to end.
      </p>
      <p>
        A post-change browser transfer waterfall was not captured. The PageSpeed
        API returned 429, and the public real-user section showed No Data;
        no usable Lighthouse score or Core Web Vitals improvement was obtained.
        The asset sizes cannot establish transfer savings, latency percentages,
        or ranking gains. The verified result is the lifecycle change: the
        homepage no longer starts KIRA’s 3D renderer before the conversation
        is opened.
      </p>
      <p>
        <Link href="/projects/portfolio-companion">
          Explore the companion’s project page
        </Link>{" "}
        for the wider product and architecture context.
      </p>
    </BlogLayout>
  );
}
