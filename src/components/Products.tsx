"use client";

import { motion } from "framer-motion";
import { IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import { products } from "@/constants/products";
import type { Product } from "@/types/products";
import { ProjectVisual } from "./ProjectVisual";

export const Products = ({ limit }: { limit?: number }) => {
  const visibleProducts = typeof limit === "number" ? products.slice(0, limit) : products;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {visibleProducts.map((product: Product, index: number) => (
        <motion.article
          key={product.slug}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.28, delay: Math.min(index * 0.05, 0.2) }}
          className={index < 2 ? "md:col-span-1" : ""}
        >
          <Link
            href={`/projects/${product.slug}`}
            className="group flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-2 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_22px_55px_-32px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <ProjectVisual
              slug={product.slug}
              accent={product.accent}
              className="transition duration-300 group-hover:scale-[0.995]"
            />
            <div className="flex flex-1 flex-col p-4 pb-3">
              <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                <span>{product.eyebrow}</span>
                <span>{product.year}</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                {product.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                {product.description}
              </p>
              <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="flex flex-wrap gap-1.5">
                  {product.stack.slice(0, 3).map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition group-hover:border-slate-950 group-hover:bg-slate-950 group-hover:text-white">
                  <IconArrowUpRight size={16} />
                </span>
              </div>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  );
};
