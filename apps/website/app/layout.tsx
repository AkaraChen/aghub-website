import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aghub.akr.moe"),
  title: "aghub - One hub for every AI coding agent",
  description:
    "One hub for every AI coding agent. Unified configuration management for 22+ AI coding assistants. Manage MCP servers, portable skills, and project configs from a single desktop app.",
  keywords: [
    "MCP",
    "AI coding agent",
    "Claude Code",
    "Cursor",
    "Windsurf",
    "AI assistant configuration",
    "MCP server management",
    "skills registry",
  ],
  authors: [{ name: "AGHub" }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://aghub.akr.moe/",
    siteName: "AGHub",
    locale: "en_US",
    title: "AGHub - Unified MCP & Skills Management for AI Coding Agents",
    description:
      "One hub for every AI coding agent. Unified configuration management for 22+ AI coding assistants. Manage MCP servers, portable skills, and project configs from a single desktop app.",
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
    title: "AGHub - Unified MCP & Skills Management for AI Coding Agents",
    description:
      "One hub for every AI coding agent. Unified configuration management for 22+ AI coding assistants. Manage MCP servers, portable skills, and project configs from a single desktop app.",
    images: ["/og-banner.png"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
