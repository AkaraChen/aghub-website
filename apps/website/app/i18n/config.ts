export const supportedLngs = ["en", "zh-CN"] as const;

export type AppLanguage = (typeof supportedLngs)[number];

export const fallbackLng: AppLanguage = "en";
export const defaultNS = "common";
