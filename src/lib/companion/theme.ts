export const COMPANION_THEME_IDS = ["rift", "operator", "dual"] as const;

export type CompanionThemeId = (typeof COMPANION_THEME_IDS)[number];

export function resolveCompanionTheme(
  value: string | string[] | null | undefined
): CompanionThemeId {
  const candidate = Array.isArray(value) ? value[0] : value;

  return COMPANION_THEME_IDS.includes(candidate as CompanionThemeId)
    ? (candidate as CompanionThemeId)
    : "rift";
}
