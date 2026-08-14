"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type CompanionMarkdownProps = {
  content: string;
};

export const CompanionMarkdown = memo(function CompanionMarkdown({
  content,
}: CompanionMarkdownProps) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
});
