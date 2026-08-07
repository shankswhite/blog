import Image from "next/image";
import Link from "next/link";
import {
  IconArchive,
  IconArrowUpRight,
  IconBrandGithub,
  IconCpu,
  IconFileText,
  IconMessage2,
  IconRoute,
} from "@tabler/icons-react";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { legacyProducts } from "@/constants/products";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Legacy Blog Archive",
  description:
    "A complete, clearly labeled migration of Levon Zhao's previous portfolio, including preserved content, projects, interactions, and migration exceptions.",
  path: "/legacy",
});

const archiveSections = [
  {
    href: "/legacy/projects/yolo-kan",
    title: "YOLO-KAN",
    detail: "Research poster, results, and project record",
    icon: IconFileText,
  },
  {
    href: "/legacy/computer-graphics",
    title: "Computer Graphics",
    detail: "Beier-Neely morphing and the Ray Tracing archive record",
    icon: IconCpu,
  },
  {
    href: "/legacy/ai-chatbot",
    title: "AI Chatbot",
    detail: "A safe public replacement for the original login-gated assistant",
    icon: IconMessage2,
  },
  {
    href: "/legacy/pathfinding",
    title: "Pathfinding",
    detail: "Dijkstra, A*, and a documented legacy JPS compatibility mode",
    icon: IconRoute,
  },
];

const legacyTimeline = [
  {
    company: "IM30 / Tap4fun, Beijing, China",
    title: "Senior Game Designer",
    date: "Jul 2019 – Oct 2022",
    description:
      "Contributed to a top-50 global game-revenue company and helped design level gameplay for a project generating more than $20M in monthly revenue.",
  },
  {
    company: "Georgia Institute of Technology, Remote",
    title: "Student",
    date: "Fall 2023 – listed as Present",
    description:
      "Operating Systems, Software Development Process, Machine Learning for Trading, and Video Game Design & Development—as listed on the old homepage.",
  },
  {
    company: "Northeastern University, San Jose, CA",
    title: "Student / Research Assistant",
    date: "Fall 2023 – listed as Present",
    description:
      "Discrete Mathematics, Object-Oriented Programming, Data Structures & Algorithms, and Algorithms—as listed on the old homepage.",
  },
];

const compatibilityRoutes = [
  {
    old: "/yolo-kan · /yolo",
    href: "/legacy/projects/yolo-kan",
    label: "YOLO-KAN record",
  },
  {
    old: "/Research/Levon_Poster.pdf",
    href: "/media/research/levon-yolo-kan-poster.pdf",
    label: "Preserved poster PDF",
  },
  {
    old: "/cg",
    href: "/legacy/computer-graphics",
    label: "Computer Graphics archive",
  },
  {
    old: "/cg/Morphing · /morphing.html · /CG/BeierNeely/*",
    href: "/legacy/projects/beier-neely-morphing",
    label: "Beier-Neely record",
  },
  {
    old: "/cg/RayTracing",
    href: "/legacy/computer-graphics#ray-tracing",
    label: "Ray Tracing archive note",
  },
  {
    old: "/chatbot",
    href: "/legacy/ai-chatbot",
    label: "AI Chatbot replacement",
  },
  {
    old: "/pathfinding",
    href: "/legacy/pathfinding",
    label: "Pathfinding lab",
  },
  {
    old: "/ml4t",
    href: "/legacy/projects/ml-trading",
    label: "ML Trading record",
  },
  {
    old: "/unity",
    href: "/legacy/projects/climbing-game",
    label: "Unity game record",
  },
  {
    old: "/recipe",
    href: "/legacy/projects/recipe-app",
    label: "Recipe platform record",
  },
  {
    old: "/mahjong",
    href: "/legacy/projects/mahjong",
    label: "Mahjong record",
  },
  {
    old: "/qa",
    href: "/legacy/projects/job-comparator",
    label: "Job Comparator record",
  },
  {
    old: "/os",
    href: "/legacy/projects/distributed-file-system",
    label: "Distributed File System record",
  },
  {
    old: "/cgame",
    href: "/legacy/projects/opengl-pathfinding-game",
    label: "OpenGL game record",
  },
];

export default function LegacyPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Legacy Blog"
        title="The previous site, preserved with context."
        description={
          <p>
            This archive brings the old portfolio into the new site without
            deleting its source or deployment. Content and useful interactions
            are preserved here; the previous Amplify app remains available as
            a rollback copy, and unsafe or unavailable pieces are documented
            rather than silently omitted.
          </p>
        }
        aside={
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
            <IconArchive size={15} />
            In-site archive
          </span>
        }
      />

      <section className="mb-16 grid gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        <div className="rounded-[30px] border border-slate-200 bg-[#f5f1e8] p-6 shadow-sm sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            Original introduction
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.045em] text-slate-950 sm:text-4xl">
            “Hey there, I’m Levon.”
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            The old homepage introduced Levon as a game designer focused on AI
            and game development. Its hero described three years in game design
            and one year in data analysis, alongside AWS Cloud Practitioner and
            CFA Level I achievements. Those statements are retained as a
            historical snapshot—not presented as a live 2026 résumé.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {["Game design", "Data analysis", "AI", "Game development"].map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                >
                  {label}
                </span>
              )
            )}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="mailto:zhao.levon@gmail.com"
              className="rounded-full bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
            >
              zhao.levon@gmail.com
            </Link>
            <Link
              href="https://github.com/shankswhite"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <IconBrandGithub size={15} />
              Original GitHub
            </Link>
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-[30px] border border-slate-800 bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_25%,rgba(56,189,248,.6),transparent_30%),linear-gradient(155deg,#0f172a_28%,#312e81_100%)]" />
          <Image
            src="/images/levon-portrait.png"
            alt="Portrait used in Levon's portfolio"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 310px"
            className="z-10 object-contain object-bottom"
          />
          <div className="absolute inset-x-4 bottom-4 z-20 rounded-2xl border border-white/15 bg-slate-950/75 p-4 text-white backdrop-blur-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300">
              Preserved identity
            </p>
            <p className="mt-1 text-sm text-slate-200">Levon · AI & games</p>
          </div>
        </div>
      </section>

      <section className="mb-16" aria-labelledby="legacy-sections-heading">
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            Original destinations
          </p>
          <h2
            id="legacy-sections-heading"
            className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-3xl"
          >
            The old navigation, rebuilt inside the archive.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {archiveSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group flex items-center gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <section.icon size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold tracking-[-0.02em] text-slate-950">
                  {section.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-600">
                  {section.detail}
                </span>
              </span>
              <IconArrowUpRight
                size={16}
                className="text-slate-400 transition group-hover:text-sky-700"
              />
            </Link>
          ))}
        </div>
      </section>

      <section id="experience" className="mb-16 scroll-mt-8">
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            Original work timeline
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-3xl">
            Experience carried forward.
          </h2>
        </div>
        <div className="grid gap-4">
          {legacyTimeline.map((item) => (
            <article
              key={`${item.company}-${item.title}`}
              className="grid gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[150px_minmax(0,1fr)] sm:p-6"
            >
              <time className="text-xs font-semibold leading-5 text-slate-500">
                {item.date}
              </time>
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.025em] text-slate-950">
                  {item.company}
                </h3>
                <p className="mt-1 text-sm font-medium text-sky-700">{item.title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-16" aria-labelledby="legacy-projects-heading">
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            Project archive
          </p>
          <h2
            id="legacy-projects-heading"
            className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-3xl"
          >
            Every meaningful project record from the old site.
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {legacyProducts.map((project) => (
            <Link
              key={project.slug}
              href={`/legacy/projects/${project.slug}`}
              className="group rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-sky-700">
                  {project.eyebrow}
                </p>
                <span className="text-[10px] font-medium text-slate-500">
                  {project.year}
                </span>
              </div>
              <h3 className="mt-2 font-semibold tracking-[-0.02em] text-slate-950">
                {project.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">
                {project.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-16" aria-labelledby="legacy-routes-heading">
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            URL compatibility
          </p>
          <h2
            id="legacy-routes-heading"
            className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-3xl"
          >
            Old links continue into the archive.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            These mappings preserve bookmarks and search links after the main
            domain points to this portfolio. The previous repository and
            Amplify deployment remain intact at their rollback address.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {compatibilityRoutes.map((route) => (
            <article
              key={route.old}
              className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm"
            >
              <code className="block break-words text-[11px] font-semibold leading-5 text-slate-500">
                {route.old}
              </code>
              <Link
                href={route.href}
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 transition hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                {route.label}
                <IconArrowUpRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-slate-800 bg-slate-950 p-6 text-white sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300">
          Migration exceptions
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
          What was changed—and why.
        </h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[
            [
              "Background music",
              "Removed because the legacy audio is a third-party song with download-site metadata and no publishable license in the repository.",
            ],
            [
              "AI backend & login wall",
              "The public archive is frontend-only and does not call Bedrock, Cognito, or the old API Gateway. Historical backend source stays outside the release build and provisions nothing.",
            ],
            [
              "Character media",
              "The old morphing source credit and publication license were not retained, so the character images and derived video are replaced by an original abstract warp-field visual.",
            ],
            [
              "Ray Tracing demo",
              "The old index named it, but the implementation component is absent from the legacy repository. The archive preserves that fact instead of inventing a demo.",
            ],
            [
              "Private, contact, and template files",
              "The old personal phone number, unlinked course submissions, raw PSD files, starter assets, and Lorem Ipsum sections were not republished as public content.",
            ],
          ].map(([title, copy]) => (
            <article
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
            >
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-300">{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}
