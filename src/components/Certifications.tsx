import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight, IconCertificate2 } from "@tabler/icons-react";

const credentials = [
  {
    name: "AWS Certified Machine Learning — Specialty",
    short: "Machine Learning — Specialty",
    image: "/images/certs/AWS-Certified-Machine-Learning-Specialty_badge.png",
    href: "https://www.credly.com/badges/d58b759d-72e7-4642-a61a-2e46402d5f29/linked_in_profile",
  },
  {
    name: "AWS Certified Cloud Practitioner",
    short: "Cloud Practitioner",
    image: "/images/certs/AWS-Certified-Cloud-Practioner_badge.png",
    href: "https://www.credly.com/badges/03e67f30-f7e2-4259-8b52-19c9292a8800/linked_in_profile",
  },
];

const tools = [
  "C/C++",
  "Python",
  "Java",
  "TypeScript",
  "PyTorch",
  "React / Next.js",
  "Unity",
  "AWS",
];

export function Certifications() {
  return (
    <section className="mt-16 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
              Verified credentials
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950">
              AWS certified in ML and cloud
            </h2>
          </div>
          <IconCertificate2 size={24} className="text-sky-600" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {credentials.map((credential) => (
            <Link
              key={credential.name}
              href={credential.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#fbfaf6] p-3 transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <Image
                src={credential.image}
                alt={credential.name}
                width={58}
                height={58}
                className="h-14 w-14 object-contain"
              />
              <span className="min-w-0 flex-1 text-xs font-medium leading-5 text-slate-700">
                {credential.short}
              </span>
              <IconArrowUpRight
                size={14}
                className="text-slate-300 transition group-hover:text-sky-600"
              />
            </Link>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Additional background
            </p>
            <p className="mt-1 text-xs font-medium text-slate-700">
              CFA Level I exam passed
            </p>
          </div>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-800">
            Finance
          </span>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-800 bg-slate-950 p-5 text-white shadow-sm sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300">
          Working stack
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
          Tools follow the problem.
        </h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {tools.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs text-slate-300"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
