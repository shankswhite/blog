import Image from "next/image";
import Link from "next/link";
import {
  IconArrowUpRight,
  IconBrandDatabricks,
  IconContainer,
} from "@tabler/icons-react";

const awsCredentials = [
  {
    name: "AWS Certified Machine Learning — Specialty",
    short: "ML Specialty",
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

export function Certifications({
  showAdditionalBackground = false,
  className = "mt-14",
}: {
  showAdditionalBackground?: boolean;
  className?: string;
} = {}) {
  return (
    <section className={className} aria-labelledby="credentials-title">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="credentials-title"
          className="text-sm font-semibold tracking-[-0.015em] text-slate-950"
        >
          Professional credentials
        </h2>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Cloud · Data · Deployment
        </p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-[18px] border border-slate-200 bg-slate-200 md:grid-cols-[1.35fr_1fr_1fr]">
        <article className="bg-white p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            Cloud Computing
          </p>
          <div className="mt-2.5 space-y-1.5">
            {awsCredentials.map((credential) => (
              <Link
                key={credential.name}
                href={credential.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${credential.name} — view verified credential`}
                className="group flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-slate-700 transition hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <Image
                  src={credential.image}
                  alt=""
                  width={26}
                  height={26}
                  className="h-[26px] w-[26px] shrink-0 object-contain"
                />
                <span>{credential.short}</span>
                <IconArrowUpRight
                  size={11}
                  className="shrink-0 text-slate-300 transition group-hover:text-amber-700"
                />
              </Link>
            ))}
          </div>
        </article>

        <article className="flex items-center gap-3 bg-white p-3.5">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <IconBrandDatabricks size={18} stroke={1.8} />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Data
            </p>
            <h3 className="mt-1 text-xs font-semibold leading-5 text-slate-800">
              Databricks Certified Data Engineer Associate
            </h3>
          </div>
        </article>

        <article className="flex items-center gap-3 bg-white p-3.5">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
            <IconContainer size={18} stroke={1.8} />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Deployment
            </p>
            <h3 className="mt-1 text-xs font-semibold leading-5 text-slate-800">
              Certified Kubernetes Application Developer (CKAD)
            </h3>
          </div>
        </article>
      </div>

      {showAdditionalBackground && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 text-xs text-slate-600">
          <span>
            <span className="font-semibold text-slate-800">Additional:</span>{" "}
            CFA Level I exam passed
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800">
            Finance
          </span>
        </div>
      )}
    </section>
  );
}
