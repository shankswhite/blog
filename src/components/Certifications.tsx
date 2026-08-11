import Image from "next/image";
import Link from "next/link";
import {
  IconArrowUpRight,
  IconBrandDatabricks,
  IconBuildingBank,
  IconContainer,
  IconSparkles,
} from "@tabler/icons-react";

const awsCredentials = [
  {
    name: "AWS Certified Machine Learning — Specialty",
    label: "AWS Certified Machine Learning — Specialty",
    image: "/images/certs/AWS-Certified-Machine-Learning-Specialty_badge.png",
    href: "https://www.credly.com/badges/d58b759d-72e7-4642-a61a-2e46402d5f29/linked_in_profile",
  },
  {
    name: "AWS Certified Cloud Practitioner",
    label: "AWS Certified Cloud Practitioner",
    image: "/images/certs/AWS-Certified-Cloud-Practioner_badge.png",
    href: "https://www.credly.com/badges/03e67f30-f7e2-4259-8b52-19c9292a8800/linked_in_profile",
  },
];

const ckadCredential = {
  name: "Certified Kubernetes Application Developer (CKAD)",
  href: "https://ti-user-certificates.s3.amazonaws.com/e0df7fbf-a057-42af-8a1f-590912be5460/9d43b988-9c02-4b65-adef-da3c5b6d2be5-xiaofeng-zhao-872ae50c-b4ba-4ced-8962-e9ed359d8797-certificate.pdf",
};

const cfaCredential = {
  name: "Passed Level I of the CFA Program",
  href: "https://basno.com/qoqsgm6a",
};

const databricksCredential = {
  name: "Databricks Certified Data Engineer Associate",
  href: "https://credentials.databricks.com/75094d75-fb13-4b63-873d-56cdd4d7a280#acc.0eBGS7AF",
};

const nvidiaCredentials = [
  {
    name: "Building RAG Agents with LLMs",
    label: "Building RAG Agents with LLMs",
    href: "https://learn.nvidia.com/certificates?id=q9aFd4z_ROawYoTXfo01Mw",
  },
  {
    name: "Rapid Application Development with Large Language Models (LLMs)",
    label: "Rapid Application Development with LLMs",
    href: "https://learn.nvidia.com/certificates?id=fIK9ceqGR463S02alIt1pg",
  },
  {
    name: "Building LLM Applications With Prompt Engineering",
    label: "LLM Applications with Prompt Engineering",
    href: "https://learn.nvidia.com/certificates?id=tJiMhDGGQHibQNMatu5YqA",
  },
];

export function Certifications({
  className = "mt-14",
}: {
  className?: string;
} = {}) {
  return (
    <section className={className} aria-labelledby="credentials-title">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2
          id="credentials-title"
          className="text-lg font-semibold tracking-[-0.025em] text-slate-950"
        >
          Professional credentials
        </h2>
        <p className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:block">
          Cloud · Data &amp; AI · Deployment · Finance
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
                <span>{credential.label}</span>
                <IconArrowUpRight
                  size={11}
                  className="shrink-0 text-slate-300 transition group-hover:text-amber-700"
                />
              </Link>
            ))}
          </div>
        </article>

        <article className="bg-white p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            Data &amp; AI
          </p>
          <div className="mt-2.5 space-y-2">
            <Link
              href={databricksCredential.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${databricksCredential.name} — view verified credential`}
              className="group flex items-start gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <IconBrandDatabricks size={15} stroke={1.8} />
              </span>
              <p className="pt-0.5 text-[11px] font-semibold leading-4 text-slate-800 transition group-hover:text-rose-700">
                {databricksCredential.name}
              </p>
              <IconArrowUpRight
                size={11}
                className="mt-1 shrink-0 text-slate-300 transition group-hover:text-rose-600"
              />
            </Link>
            <div className="flex items-start gap-2">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-lime-50 text-lime-700">
                <IconSparkles size={15} stroke={1.8} />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-lime-800">
                  NVIDIA Agentic AI · 3 certificates
                </p>
                <div className="mt-1 space-y-0.5">
                  {nvidiaCredentials.map((credential) => (
                    <Link
                      key={credential.href}
                      href={credential.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={credential.name}
                      aria-label={`${credential.name} — view verified credential`}
                      className="group flex items-start gap-1 text-[10px] font-medium leading-4 text-slate-700 transition hover:text-lime-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-600"
                    >
                      <span>{credential.label}</span>
                      <IconArrowUpRight
                        size={10}
                        className="mt-0.5 shrink-0 text-slate-300 transition group-hover:text-lime-700"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="bg-white p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            Deployment &amp; Finance
          </p>
          <div className="mt-2.5 space-y-2.5">
            <Link
              href={ckadCredential.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${ckadCredential.name} — view verified credential`}
              className="group flex items-start gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                <IconContainer size={15} stroke={1.8} />
              </span>
              <p className="min-w-0 flex-1 pt-0.5 text-[11px] font-semibold leading-4 text-slate-800 transition group-hover:text-sky-800">
                {ckadCredential.name}
              </p>
              <IconArrowUpRight
                size={11}
                className="mt-1 shrink-0 text-slate-300 transition group-hover:text-sky-700"
              />
            </Link>

            <Link
              href={cfaCredential.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${cfaCredential.name} — view verified credential`}
              className="group flex items-start gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <IconBuildingBank size={15} stroke={1.8} />
              </span>
              <p className="min-w-0 flex-1 pt-0.5 text-[11px] font-semibold leading-4 text-slate-800 transition group-hover:text-emerald-800">
                {cfaCredential.name}
              </p>
              <IconArrowUpRight
                size={11}
                className="mt-1 shrink-0 text-slate-300 transition group-hover:text-emerald-700"
              />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
