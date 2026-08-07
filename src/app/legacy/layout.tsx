import { LegacyClassicShell } from "@/components/legacy-classic/LegacyClassicShell";

export default function LegacyLayout({ children }: { children: React.ReactNode }) {
  return <LegacyClassicShell>{children}</LegacyClassicShell>;
}
