"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function FeatureSection({
  label,
  title,
  description,
  bullets,
  imageSide,
  imageSrc,
  customVisual,
}: {
  label: string;
  title: string;
  description: string;
  bullets: string[];
  imageSide: "left" | "right";
  imageSrc?: string;
  customVisual?: ReactNode;
}) {
  const { ref, inView } = useInView();

  const textContent = (
    <div className="flex flex-1 flex-col justify-center gap-5">
      <span className="self-start text-xs font-semibold tracking-[2px] text-[#FF8400]">
        {label}
      </span>
      <h3 className="font-serif-brand m-0 text-2xl leading-tight font-normal text-[#111111] lg:text-[36px]">
        {title}
      </h3>
      <p className="m-0 text-base leading-[1.6] text-[#666666]">{description}</p>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-center gap-3 text-sm text-[#111111]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF8400]" />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );

  const imagePlaceholder = customVisual ? (
    <div className="flex flex-1 items-center justify-center">{customVisual}</div>
  ) : imageSrc ? (
    <div className="flex flex-1 items-center justify-center">
      <img src={imageSrc} alt={`${label} screenshot`} className="h-auto w-full drop-shadow-xl" />
    </div>
  ) : (
    <div className="flex h-[240px] flex-1 items-center justify-center rounded-2xl border border-[#CBCCC9] bg-[#E7E8E5] lg:h-[360px]">
      <span className="text-sm tracking-[2px] text-[#666666]">SCREENSHOT</span>
    </div>
  );

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center gap-8 py-12 transition-all duration-700 ease-out lg:flex-row lg:gap-16 lg:py-24 ${
        inView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
    >
      {imageSide === "left" ? (
        <>
          {imagePlaceholder}
          {textContent}
        </>
      ) : (
        <>
          {textContent}
          {imagePlaceholder}
        </>
      )}
    </div>
  );
}

function PlatformScreenshots() {
  return (
    <div className="relative flex w-full aspect-[4/3] items-center justify-center lg:-ml-6 lg:my-0">
      <div className="pointer-events-none absolute top-0 left-[-5%] z-10 w-[95%] brightness-[0.85] mix-blend-multiply">
        <img
          src="/skill_screenshot.png"
          alt="macOS screenshot"
          className="h-auto w-full object-contain"
        />
      </div>

      <div className="absolute top-[32%] left-[15%] z-20 w-[85%] overflow-hidden rounded-[14px] border border-white/10 bg-[#111] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.5)]">
        <div className="relative h-0 w-full overflow-hidden rounded-[14px] bg-[#111] pb-[64%]">
          <img
            src="/windows_screenshot.png"
            alt="Windows screenshot"
            className="absolute top-0 left-0 h-[105%] w-full object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}

type Platform = "mac-arm" | "mac-intel" | "windows" | "linux" | "unknown";

function detectPlatform(): Platform {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (/android|iphone|ipad|ipod|mobile/i.test(userAgent)) return "unknown";
  if (userAgent.includes("win")) return "windows";
  if (userAgent.includes("linux")) return "linux";
  if (userAgent.includes("mac")) return "mac-arm";
  return "unknown";
}

const platformLabels: Record<Platform, string> = {
  "mac-arm": "DOWNLOAD FOR MAC",
  "mac-intel": "DOWNLOAD FOR MAC",
  windows: "DOWNLOAD FOR WINDOWS",
  linux: "DOWNLOAD FOR LINUX",
  unknown: "DOWNLOAD",
};

function useLatestRelease() {
  const [release, setRelease] = useState({
    url: "https://github.com/AkaraChen/aghub/releases/latest",
    version: "",
    label: platformLabels.unknown,
  });

  useEffect(() => {
    const platform = detectPlatform();

    fetch("https://api.github.com/repos/AkaraChen/aghub/releases/latest")
      .then((response) => response.json())
      .then((data) => {
        const assets: { name: string; browser_download_url: string }[] = data.assets ?? [];
        const findAsset = (pattern: RegExp) =>
          assets.find((asset) => pattern.test(asset.name))?.browser_download_url;

        const platformUrls: Record<Platform, string | undefined> = {
          "mac-arm": findAsset(/aarch64\.dmg$/),
          "mac-intel": findAsset(/x64\.dmg$/),
          windows: findAsset(/x64-setup\.exe$/),
          linux: findAsset(/amd64\.AppImage$/),
          unknown: undefined,
        };

        setRelease({
          url: platformUrls[platform] ?? "https://github.com/AkaraChen/aghub/releases/latest",
          version: data.tag_name ?? "",
          label: platformLabels[platform],
        });
      })
      .catch(() => {
        setRelease((current) => ({
          ...current,
          label: platformLabels[platform],
        }));
      });
  }, []);

  return release;
}

const navLinks = [
  { label: "FEATURES", href: "#features" },
  { label: "DOCS", href: "https://docs.aghub.akr.moe" },
  { label: "GITHUB", href: "https://github.com/AkaraChen/aghub" },
];

const agents: { name: string; logo: string }[] = [
  { name: "Claude Code", logo: "/agents/claude.svg" },
  { name: "Cursor", logo: "/agents/cursor.svg" },
  { name: "Windsurf", logo: "/agents/windsurf.svg" },
  { name: "Gemini CLI", logo: "/agents/gemini.svg" },
  { name: "OpenCode", logo: "/agents/opencode.svg" },
  { name: "Amp", logo: "/agents/amp.svg" },
  { name: "GitHub Copilot", logo: "/agents/copilot.svg" },
  { name: "Cline", logo: "/agents/cline.svg" },
  { name: "RooCode", logo: "/agents/roocode.svg" },
  { name: "Kiro", logo: "/agents/kiro.svg" },
  { name: "JetBrains AI", logo: "/agents/jetbrains_ai.svg" },
  { name: "Zed", logo: "/agents/zed.svg" },
  { name: "Trae", logo: "/agents/trae.svg" },
  { name: "AugmentCode", logo: "/agents/augmentcode.svg" },
  { name: "KiloCode", logo: "/agents/kilocode.svg" },
  { name: "Warp", logo: "/agents/warp.svg" },
  { name: "Factory", logo: "/agents/factory.svg" },
  { name: "Kimi Code CLI", logo: "/agents/kimi.svg" },
  { name: "Mistral Le Chat", logo: "/agents/mistral.svg" },
  { name: "OpenClaw", logo: "/agents/openclaw.svg" },
  { name: "OpenAI Codex", logo: "/agents/codex.svg" },
  { name: "Antigravity", logo: "/agents/antigravity.svg" },
  { name: "Pi Coding Agent", logo: "/agents/pi.svg" },
];

function FooterColumn({
  title,
  links,
  hrefs,
}: {
  title: string;
  links: string[];
  hrefs: string[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-xs font-semibold tracking-[2px] text-[#666666]">{title}</span>
      {links.map((link, index) => (
        <a
          key={link}
          href={hrefs[index]}
          className="text-sm text-[#B8B9B6] transition-colors hover:text-white"
        >
          {link}
        </a>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { url: downloadUrl, label: downloadLabel, version } = useLatestRelease();
  const doubledAgents = useMemo(() => [...agents, ...agents], []);

  return (
    <div className="font-sans-site flex min-h-screen flex-col bg-[#F2F3F0] text-base text-[#111111]">
      <div className="px-6 py-2 text-center text-[10px] font-medium tracking-[2px] text-[#B8B9B6] bg-[#0C0C0C] lg:px-[120px] lg:text-xs">
        AGHUB {version ? version.toUpperCase() : ""} IS NOW AVAILABLE - ONE HUB FOR EVERY AI CODING
        AGENT
      </div>

      <nav className="relative flex items-center justify-between bg-[#111111] px-6 py-4 lg:px-[120px] lg:py-5">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="AGHub logo" className="h-7 w-7" />
          <span className="font-serif-brand text-xl italic font-normal text-white">aghub</span>
        </div>
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={link.href.startsWith("#") ? "page" : undefined}
              className="text-xs font-medium tracking-[2px] text-[#B8B9B6] transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/AkaraChen/aghub?tab=readme-ov-file#download"
            className="rounded-full border border-[#FF8400] px-4 py-2 text-xs font-semibold tracking-[1px] text-white transition-colors hover:bg-[#FF8400]/10"
          >
            DOWNLOAD
          </a>
        </div>
        <button
          type="button"
          className="-mr-2 flex flex-col gap-1.5 p-2 lg:hidden"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`block h-0.5 w-5 bg-white transition-all duration-200 ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-white transition-all duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-white transition-all duration-200 ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {menuOpen && (
        <div className="flex flex-col gap-5 border-t border-[#333] bg-[#111111] px-6 py-6 lg:hidden">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium tracking-[2px] text-[#B8B9B6] transition-colors hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/AkaraChen/aghub?tab=readme-ov-file#download"
            className="self-start rounded-full border border-[#FF8400] px-4 py-2 text-xs font-semibold tracking-[1px] text-white transition-colors hover:bg-[#FF8400]/10"
            onClick={() => setMenuOpen(false)}
          >
            DOWNLOAD
          </a>
        </div>
      )}

      <section className="relative flex min-h-[400px] flex-shrink-0 overflow-hidden bg-[#111111] lg:h-[640px]">
        <div className="relative z-10 flex flex-col gap-6 px-6 py-10 lg:px-[120px] lg:py-[60px]">
          <span className="self-start border border-[#FF8400]/30 px-4 py-1.5 text-xs font-medium tracking-[2px] text-[#FF8400]">
            SKILL & MCP MANAGEMENT
          </span>
          <h1 className="font-serif-brand m-0 text-[40px] leading-[0.95] font-normal text-white lg:text-[80px]">
            One hub,
            <br />
            every agent.
          </h1>
          <p className="m-0 max-w-[450px] text-base leading-[1.5] text-[#B8B9B6]">
            Unified configuration management for 22+ AI coding assistants. Manage MCP servers,
            portable skills, and project configs from a single desktop app built with Tauri 2.
          </p>
          <a
            href={downloadUrl}
            className="self-start rounded-full bg-[#FF8400] px-6 py-3 text-xs font-semibold tracking-[1px] text-[#111111] transition-colors hover:bg-[#FF8400]/90"
          >
            {downloadLabel}
          </a>
        </div>
        <div className="pointer-events-none absolute top-1/2 right-[120px] hidden h-[400px] w-[400px] -translate-y-1/2 rotate-12 transform-gpu drop-shadow-2xl lg:block">
          <img src="/logo.png" alt="AGHub Logo" className="h-full w-full object-contain" />
        </div>
      </section>

      <section id="features" className="bg-[#F2F3F0] px-6 lg:px-[120px]">
        <FeatureSection
          label="UNIFIED MCP MANAGEMENT"
          title="One config for every agent."
          description="Deploy MCP server configurations across all your AI coding agents from a single interface. No more editing JSON files for each tool separately."
          bullets={[
            "Supports Stdio, SSE, and StreamableHttp transports",
            "Toggle servers on/off without deleting them",
            "View and audit servers across all 22+ agents at once",
          ]}
          imageSide="right"
          imageSrc="/mcp_screenshot.png"
        />
        <FeatureSection
          label="PORTABLE SKILLS"
          title="Share skills across agents."
          description="Import .skill packages that work everywhere. Skills are verified, tracked, and portable - install once, use in any supported agent."
          bullets={[
            "SKILL.md frontmatter for rich metadata",
            "SHA-256 verification and source tracking",
            "Integration with the skills.sh marketplace",
          ]}
          imageSide="left"
          imageSrc="/skill_screenshot.png"
        />
        <FeatureSection
          label="FLEXIBLE SCOPING"
          title="Global, project, or both."
          description="Set configurations at any level. Global defaults apply everywhere, project overrides stay local, and merged views show the full picture."
          bullets={[
            "Global, project, or merged configuration views",
            "Per-agent filtering for precise control",
            "Complete audit trails for every resource",
          ]}
          imageSide="right"
          imageSrc="/project_screenshot.png"
        />
        <FeatureSection
          label="CROSS-PLATFORM"
          title="Native on every desktop."
          description="Built with Tauri 2 for native performance and a small footprint. Runs on Windows, macOS, and Linux without Electron's overhead."
          bullets={[
            "Windows 10+, macOS 12+, major Linux distros",
            "Built with Rust and TypeScript",
            "Lightweight - no bundled Chromium",
          ]}
          imageSide="left"
          customVisual={<PlatformScreenshots />}
        />
      </section>

      <section
        className="overflow-hidden bg-[#F2F3F0] py-12 lg:py-20"
        role="region"
        aria-label="Supported agents carousel"
      >
        <div className="mb-10 px-6 lg:px-[120px]">
          <h2 className="font-serif-brand mb-4 text-[28px] font-normal text-[#111111] lg:text-[40px]">
            Supported Agents
          </h2>
          <p className="text-base text-[#666666]">
            {agents.length} agents and counting. One config to rule them all.
          </p>
        </div>
        <div className="relative">
          <div className="animate-scroll flex gap-8">
            {doubledAgents.map((agent, index) => (
              <div
                key={`${agent.name}-${index}`}
                className="flex w-[100px] shrink-0 flex-col items-center gap-3"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#CBCCC9] bg-white p-3 transition-colors hover:border-[#FF8400]/40">
                  <img src={agent.logo} alt={agent.name} className="h-full w-full object-contain" />
                </div>
                <span className="whitespace-nowrap text-center text-xs font-medium text-[#111111]">
                  {agent.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#111111] px-6 py-12 lg:px-[120px] lg:py-20">
        <div className="mb-12 flex flex-col gap-10 lg:flex-row lg:gap-20">
          <div className="flex shrink-0 flex-col gap-4 lg:w-[280px]">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="AGHub logo" className="h-7 w-7" />
              <span className="font-serif-brand text-[28px] font-normal text-white">aghub</span>
            </div>
            <p className="max-w-[260px] text-sm leading-[1.6] text-[#B8B9B6]">
              One hub for every AI coding agent. Unified
              <br />
              configuration for 22+ assistants.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:flex lg:flex-1 lg:justify-end lg:gap-12">
            <FooterColumn
              title="FEATURES"
              links={["MCP Servers", "Skills Registry", "Project Config", "CLI Integration"]}
              hrefs={[
                "#features",
                "https://skills.sh",
                "#features",
                "https://github.com/AkaraChen/aghub#cli-usage",
              ]}
            />
            <FooterColumn
              title="RESOURCES"
              links={["Documentation", "GitHub", "Releases"]}
              hrefs={[
                "https://docs.aghub.akr.moe",
                "https://github.com/AkaraChen/aghub",
                "https://github.com/AkaraChen/aghub?tab=readme-ov-file#download",
              ]}
            />
            <FooterColumn
              title="COMMUNITY"
              links={["Discord", "GitHub Issues", "Contributing"]}
              hrefs={[
                "#",
                "https://github.com/AkaraChen/aghub/issues",
                "https://github.com/AkaraChen/aghub/blob/main/CONTRIBUTING.md",
              ]}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs tracking-[0.5px] text-[#666666]">
            © 2025 AGHUB - MIT LICENSE
          </span>
          <span className="text-[11px] text-[#666666]">Built with Tauri 2</span>
        </div>
      </footer>
    </div>
  );
}
