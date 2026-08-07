"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  IconArrowUpRight,
  IconBrain,
  IconChartDots3,
  IconDeviceGamepad2,
} from "@tabler/icons-react";

const disciplines = [
  {
    title: "Game systems",
    copy: "Designing loops, progression, and social features that remain legible at live-game scale.",
    icon: IconDeviceGamepad2,
  },
  {
    title: "Evidence loops",
    copy: "Using SQL, Python, playtests, and experiments to turn player behavior into the next design decision.",
    icon: IconChartDots3,
  },
  {
    title: "Intelligent software",
    copy: "Building machine-learning, graphics, and product systems around a clear human interaction.",
    icon: IconBrain,
  },
];

const gallery = [
  {
    src: "/media/research/yolo-kan-poster.jpg",
    alt: "YOLO-KAN research poster",
    label: "Research",
  },
  {
    src: "/media/morphing/warp-study.png",
    alt: "Abstract Beier-Neely warp field study",
    label: "Graphics",
  },
];

export default function About() {
  return (
    <div className="space-y-16">
      <section className="grid items-stretch gap-6 lg:grid-cols-[310px_minmax(0,1fr)]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="relative min-h-[390px] overflow-hidden rounded-[30px] border border-slate-800 bg-slate-950 shadow-[0_26px_70px_-42px_rgba(15,23,42,0.9)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_24%,rgba(56,189,248,.65),transparent_30%),linear-gradient(155deg,#0f172a_28%,#312e81_100%)]" />
          <Image
            src="/images/levon-portrait.png"
            alt="Portrait of Levon Zhao"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 310px"
            className="z-10 object-contain object-bottom"
          />
          <div className="absolute inset-x-4 bottom-4 z-20 rounded-2xl border border-white/15 bg-slate-950/75 p-4 text-white backdrop-blur-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300">
              Levon Zhao
            </p>
            <p className="mt-1 text-sm text-slate-200">
              Game designer → software engineer
            </p>
          </div>
        </motion.div>

        <div className="rounded-[30px] border border-slate-200 bg-[#f5f1e8] p-6 shadow-sm sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            The through-line
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.045em] text-slate-950">
            Designer instincts, engineering discipline.
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
            <p>
              I spent more than three years designing live game systems at
              IM30 / Tap4fun before moving deeper into computer science,
              machine learning, and software engineering. The medium changed;
              the core question did not: how does a system communicate its
              state, reward understanding, and improve through feedback?
            </p>
            <p>
              My game-design work supported a strategy title generating more
              than $20 million in monthly revenue. One featured design increased
              player engagement by 67% and reached a 157% higher participation
              rate than concurrent features. SQL and Python analysis helped the
              team monitor behavior across tens of thousands of players and
              turn the findings into repeatable reporting practices.
            </p>
            <p>
              Graduate work at Northeastern and Georgia Tech broadened that
              foundation across algorithms, systems, AI, graphics, and game
              development. I then built production AI and analytics systems at
              Activision Blizzard and now evaluate frontier models through
              Handshake AI. This portfolio keeps both sides visible: the
              product judgment behind the work and the implementation details
              that make it real.
            </p>
          </div>

          <dl className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
            {[
              ["2019–26", "games → AI"],
              ["2", "CS master's degrees"],
              ["2", "AWS credentials"],
            ].map(([value, label]) => (
              <div key={label} className="bg-white/85 px-4 py-4">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {label}
                </dt>
                <dd className="mt-1 text-xl font-semibold tracking-[-0.04em] text-slate-950">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section>
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            Across disciplines
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-3xl">
            What carries from one project to the next.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {disciplines.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.24, delay: index * 0.05 }}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <item.icon size={19} />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-[-0.025em] text-slate-950">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-slate-800 bg-slate-950 p-6 text-white shadow-[0_28px_75px_-48px_rgba(15,23,42,0.95)] sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300">
              Beyond the résumé
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
              Strategy is a recurring language.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              I&apos;m a certified professional Mahjong player in China, have
              passed the CFA Level I exam, and own an automatic Mahjong table
              that has become a surprisingly effective systems-design lab.
              Probability, incomplete information, and decision quality show
              up in games, finance, and engineering in different clothes.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Start a conversation
            <IconArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
              A few frames
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-950">
              Work in context.
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-slate-950 sm:inline-flex"
          >
            Explore projects
            <IconArrowUpRight size={15} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {gallery.map((image, index) => (
            <motion.figure
              key={image.src}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-[22px] border border-slate-200 bg-slate-100"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              <figcaption className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-slate-950/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                {image.label}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>
    </div>
  );
}
