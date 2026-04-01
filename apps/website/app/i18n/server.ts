import type { Metadata } from "next";
import { getT, initServerI18next } from "next-i18next/server";
import { fallbackLng, type AppLanguage } from "./config";

const i18nConfig = {
  supportedLngs: ["en", "zh-CN"],
  fallbackLng,
  defaultNS: "common",
  ns: ["common"],
  localeInPath: false,
  resourceLoader: (language: string, namespace: string) =>
    import(`./locales/${language}/${namespace}.json`),
};

initServerI18next(i18nConfig);

export type NavLink = {
  label: string;
  href: string;
};

export type FeatureContent = {
  label: string;
  title: string;
  description: string;
  bullets: string[];
  imageSide: "left" | "right";
  imageSrc?: string;
  usePlatformVisual?: boolean;
};

export type HomePageContent = {
  language: AppLanguage;
  announcementTemplate: string;
  navLinks: NavLink[];
  navDownloadLabel: string;
  menuLabels: {
    open: string;
    close: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
  };
  downloads: {
    mac: string;
    windows: string;
    linux: string;
    default: string;
  };
  features: FeatureContent[];
  supportedAgents: {
    ariaLabel: string;
    title: string;
    countTemplate: string;
  };
  footer: {
    tagline: string;
    featuresTitle: string;
    featuresLinks: string[];
    resourcesTitle: string;
    resourcesLinks: string[];
    communityTitle: string;
    communityLinks: string[];
    copyright: string;
    builtWith: string;
  };
  images: {
    featureScreenshotSuffix: string;
    macScreenshotAlt: string;
    windowsScreenshotAlt: string;
    logoAlt: string;
    heroLogoAlt: string;
  };
};

function getAlternates(language: AppLanguage) {
  return {
    canonical: language === "zh-CN" ? "/zh-cn" : "/",
    languages: {
      en: "/",
      "zh-CN": "/zh-cn",
    },
  };
}

export async function getPageMetadata(language: AppLanguage): Promise<Metadata> {
  const { t } = await getT("common", { lng: language });
  const description = t("meta.description");

  return {
    title: t("meta.title"),
    description,
    keywords: t("meta.keywords", { returnObjects: true }) as string[],
    alternates: getAlternates(language),
    openGraph: {
      type: "website",
      url: language === "zh-CN" ? "https://aghub.akr.moe/zh-cn" : "https://aghub.akr.moe/",
      siteName: "AGHub",
      locale: t("meta.locale"),
      title: t("meta.openGraphTitle"),
      description,
      images: [
        {
          url: "/og-banner.png",
          width: 1200,
          height: 630,
          alt: "AGHub",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@aghubapp",
      title: t("meta.twitterTitle"),
      description,
      images: ["/og-banner.png"],
    },
  };
}

export async function getStructuredData(language: AppLanguage) {
  const { t } = await getT("common", { lng: language });

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AGHub",
    url: language === "zh-CN" ? "https://aghub.akr.moe/zh-cn" : "https://aghub.akr.moe/",
    image: "https://aghub.akr.moe/og-banner.png",
    description: t("structuredData.description"),
    applicationCategory: "DeveloperApplication",
    operatingSystem: ["Windows 10+", "macOS 12+", "Linux"],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "AGHub",
      url: "https://github.com/AkaraChen/aghub",
    },
    sameAs: ["https://github.com/AkaraChen/aghub", "https://docs.aghub.akr.moe"],
    downloadUrl: "https://github.com/AkaraChen/aghub?tab=readme-ov-file#download",
    softwareVersion: "0.1.1",
  };
}

export async function getHomePageContent(language: AppLanguage): Promise<HomePageContent> {
  const { t } = await getT("common", { lng: language });

  return {
    language,
    announcementTemplate: t("topBar.announcement"),
    navLinks: [
      { label: t("nav.features"), href: "#features" },
      { label: t("nav.docs"), href: "https://docs.aghub.akr.moe" },
      { label: t("nav.github"), href: "https://github.com/AkaraChen/aghub" },
    ],
    navDownloadLabel: t("nav.download"),
    menuLabels: {
      open: t("nav.openMenu"),
      close: t("nav.closeMenu"),
    },
    hero: {
      eyebrow: t("hero.eyebrow"),
      titleLine1: t("hero.titleLine1"),
      titleLine2: t("hero.titleLine2"),
      description: t("hero.description"),
    },
    downloads: {
      mac: t("downloads.mac"),
      windows: t("downloads.windows"),
      linux: t("downloads.linux"),
      default: t("downloads.default"),
    },
    features: [
      {
        label: t("features.mcp.label"),
        title: t("features.mcp.title"),
        description: t("features.mcp.description"),
        bullets: t("features.mcp.bullets", { returnObjects: true }) as string[],
        imageSide: "right",
        imageSrc: "/mcp_screenshot.png",
      },
      {
        label: t("features.skills.label"),
        title: t("features.skills.title"),
        description: t("features.skills.description"),
        bullets: t("features.skills.bullets", { returnObjects: true }) as string[],
        imageSide: "left",
        imageSrc: "/skill_screenshot.png",
      },
      {
        label: t("features.scoping.label"),
        title: t("features.scoping.title"),
        description: t("features.scoping.description"),
        bullets: t("features.scoping.bullets", { returnObjects: true }) as string[],
        imageSide: "right",
        imageSrc: "/project_screenshot.png",
      },
      {
        label: t("features.platform.label"),
        title: t("features.platform.title"),
        description: t("features.platform.description"),
        bullets: t("features.platform.bullets", { returnObjects: true }) as string[],
        imageSide: "left",
        usePlatformVisual: true,
      },
    ],
    supportedAgents: {
      ariaLabel: t("supportedAgents.ariaLabel"),
      title: t("supportedAgents.title"),
      countTemplate: t("supportedAgents.count"),
    },
    footer: {
      tagline: t("footer.tagline"),
      featuresTitle: t("footer.featuresTitle"),
      featuresLinks: t("footer.featuresLinks", { returnObjects: true }) as string[],
      resourcesTitle: t("footer.resourcesTitle"),
      resourcesLinks: t("footer.resourcesLinks", { returnObjects: true }) as string[],
      communityTitle: t("footer.communityTitle"),
      communityLinks: t("footer.communityLinks", { returnObjects: true }) as string[],
      copyright: t("footer.copyright"),
      builtWith: t("footer.builtWith"),
    },
    images: {
      featureScreenshotSuffix: t("images.featureScreenshotSuffix"),
      macScreenshotAlt: t("images.macScreenshotAlt"),
      windowsScreenshotAlt: t("images.windowsScreenshotAlt"),
      logoAlt: t("images.logoAlt"),
      heroLogoAlt: t("images.heroLogoAlt"),
    },
  };
}
