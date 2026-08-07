import { Contact } from "@/components/Contact";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import Link from "next/link";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
} from "@tabler/icons-react";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Get in touch with Levon Zhao - software engineer, game designer, and ML enthusiast.",
  path: "/contact",
});

export default function ContactPage() {
  const contactMethods = [
    {
      href: "mailto:zhao.levon@gmail.com",
      label: "Email",
      value: "zhao.levon@gmail.com",
      icon: IconMail,
    },
    {
      href: "https://linkedin.com/in/levonzhao",
      label: "LinkedIn",
      value: "/in/levonzhao",
      icon: IconBrandLinkedin,
    },
    {
      href: "https://github.com/shankswhite",
      label: "GitHub",
      value: "@shankswhite",
      icon: IconBrandGithub,
    },
  ];

  return (
    <Container>
      <PageHeader
        eyebrow="Contact"
        title="Let’s make the first message useful."
        description={
          <p>
            For product, engineering, research, or game-development
            conversations, share the goal and the part you would like me to
            help own.
          </p>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-slate-800 bg-slate-950 p-5 text-white shadow-[0_24px_70px_-42px_rgba(15,23,42,0.9)] sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300">
            Direct channels
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">
            Choose what fits.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Email is best for context. LinkedIn and GitHub are useful for a
            quick look at current professional and technical work.
          </p>

          <div className="mt-7 space-y-2">
            {contactMethods.map((method) => {
              const external = method.href.startsWith("http");
              return (
                <Link
                  key={method.label}
                  href={method.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3 transition hover:border-sky-400/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-300">
                    <method.icon size={17} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {method.label}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-white">
                      {method.value}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </aside>
        <Contact />
      </div>
    </Container>
  );
}
