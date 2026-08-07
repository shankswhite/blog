import Image from "next/image";
import Link from "next/link";
import {
  IconArrowUpRight,
  IconBrandDatabricks,
  IconCloudComputing,
  IconContainer,
} from "@tabler/icons-react";

const awsCredentials = [
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

export function Certifications({
  showAdditionalBackground = false,
}: {
  showAdditionalBackground?: boolean;
} = {}) {
  return (
    <section className="mt-16" aria-labelledby="credentials-title">
      <div className="mb-6 max-w-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-700">
          Credentials
        </p>
        <h2
          id="credentials-title"
          className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-4xl"
        >
          Certified across the AI delivery stack.
        </h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-500">
                01 · Cloud Computing
              </p>
              <h3 className="mt-1 text-lg font-semibold tracking-[-0.025em] text-slate-950">
                Amazon Web Services
              </h3>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <IconCloudComputing size={20} stroke={1.7} />
            </span>
          </div>

          <div className="mt-5 space-y-2.5">
            {awsCredentials.map((credential) => (
              <Link
                key={credential.name}
                href={credential.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${credential.name} — view verified credential`}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#fbfaf6] p-2.5 transition hover:border-amber-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <Image
                  src={credential.image}
                  alt=""
                  width={46}
                  height={46}
                  className="h-11 w-11 shrink-0 object-contain"
                />
                <span className="min-w-0 flex-1 text-xs font-medium leading-5 text-slate-700">
                  {credential.short}
                </span>
                <IconArrowUpRight
                  size={14}
                  className="shrink-0 text-slate-300 transition group-hover:text-amber-700"
                />
              </Link>
            ))}
          </div>
        </article>

        <article className="flex flex-col rounded-[24px] border border-slate-200 bg-[#fbfaf6] p-5 shadow-sm xl:min-h-[230px]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-500">
              02 · Data
            </p>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <IconBrandDatabricks size={20} stroke={1.7} />
            </span>
          </div>
          <div className="mt-auto pt-10">
            <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-rose-700">
              Data engineering
            </span>
            <h3 className="mt-3 max-w-[15rem] text-xl font-semibold leading-7 tracking-[-0.035em] text-slate-950">
              Databricks Certified Data Engineer Associate
            </h3>
          </div>
        </article>

        <article className="flex flex-col rounded-[24px] border border-slate-800 bg-slate-950 p-5 text-white shadow-sm xl:min-h-[230px]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-400">
              03 · Deployment
            </p>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
              <IconContainer size={20} stroke={1.7} />
            </span>
          </div>
          <div className="mt-auto pt-10">
            <span className="inline-flex rounded-full border border-sky-300/20 bg-sky-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-300">
              CKAD
            </span>
            <h3 className="mt-3 max-w-[16rem] text-xl font-semibold leading-7 tracking-[-0.035em]">
              Certified Kubernetes Application Developer
            </h3>
          </div>
        </article>
      </div>

      {showAdditionalBackground && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
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
      )}
    </section>
  );
}
