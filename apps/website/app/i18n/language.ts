import { fallbackLng, supportedLngs, type AppLanguage } from "./config";

const zhPrefixes = ["zh", "zh-cn", "zh-hans", "zh-sg"];

function normalizeLanguageTag(value: string) {
  return value.trim().toLowerCase();
}

export function resolveLanguage(
  candidates: readonly string[] | undefined,
  fallback: AppLanguage = fallbackLng,
): AppLanguage {
  if (!candidates || candidates.length === 0) {
    return fallback;
  }

  for (const candidate of candidates) {
    const normalized = normalizeLanguageTag(candidate);

    if (supportedLngs.some((language) => normalizeLanguageTag(language) === normalized)) {
      return (
        supportedLngs.find((language) => normalizeLanguageTag(language) === normalized) ?? fallback
      );
    }

    if (zhPrefixes.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}-`))) {
      return "zh-CN";
    }

    if (normalized === "en" || normalized.startsWith("en-")) {
      return "en";
    }
  }

  return fallback;
}
