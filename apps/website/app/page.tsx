import HomePage from "../components/home-page";

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AGHub",
  url: "https://aghub.akr.moe/",
  image: "https://aghub.akr.moe/og-banner.png",
  description:
    "Unified configuration management for 22+ AI coding assistants. Manage MCP servers, portable skills, and project configs from a single desktop app.",
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

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
      />
      <HomePage />
    </>
  );
}
