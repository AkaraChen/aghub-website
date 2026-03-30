import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
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
  customVisual?: React.ReactNode;
}) {
  const { ref, inView } = useInView();

  const textContent = (
    <div className="flex-1 flex flex-col gap-5 justify-center">
      <span className="self-start text-[#FF8400] text-xs font-semibold tracking-[2px]">
        {label}
      </span>
      <h3 className="text-2xl lg:text-[36px] font-normal font-['Instrument_Serif',serif] text-[#111111] m-0 leading-tight">
        {title}
      </h3>
      <p className="text-[#666666] text-base leading-[1.6] m-0">
        {description}
      </p>
      <ul className="list-none p-0 m-0 flex flex-col gap-3">
        {bullets.map((b) => (
          <li
            key={b}
            className="flex items-center gap-3 text-[#111111] text-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF8400] shrink-0" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );

  const imagePlaceholder = customVisual ? (
    <div className="flex-1 flex items-center justify-center">{customVisual}</div>
  ) : imageSrc ? (
    <div className="flex-1 flex items-center justify-center">
      <img src={imageSrc} alt={`${label} screenshot`} className="w-full h-auto drop-shadow-xl" />
    </div>
  ) : (
    <div className="flex-1 bg-[#E7E8E5] border border-[#CBCCC9] rounded-2xl h-[240px] lg:h-[360px] flex items-center justify-center">
      <span className="text-[#666666] text-sm tracking-[2px]">SCREENSHOT</span>
    </div>
  );

  return (
    <div
      ref={ref}
      className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center py-12 lg:py-24 transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
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

const PlatformScreenshots = () => {
  return (
    <div className="relative w-full aspect-[4/3] flex items-center justify-center lg:my-0 lg:-ml-6">
      {/* Mac (Back layer) - Since the source image has baked-in padding and shadows on a white bg,
          simply applying mix-blend-multiply makes the white perfectly transparent while preserving the native macOS shadow. */}
      <div className="absolute top-0 left-[-5%] w-[95%] z-10 brightness-[0.85] mix-blend-multiply pointer-events-none">
        <img
          src="/skill_screenshot.png"
          alt="macOS screenshot"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Windows (Front layer) - Raw rectangle Needs CSS styling to simulate a window */}
      <div className="absolute top-[32%] left-[15%] w-[85%] rounded-[14px] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.5)] border border-white/10 z-20 overflow-hidden bg-[#111]">
        <div className="relative w-full pb-[64%] h-0 overflow-hidden rounded-[14px] bg-[#111]">
          <img
            src="/windows_screenshot.png"
            alt="Windows screenshot"
            className="absolute top-0 left-0 w-full h-[105%] object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
};

const navLinks = [
  { label: "FEATURES", href: "#features" },
  { label: "DOCS", href: "https://docs.aghub.akr.moe" },
  { label: "GITHUB", href: "https://github.com/AkaraChen/aghub" },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-['Inter',sans-serif] text-base bg-[#F2F3F0]">
      {/* Announcement Bar */}
      <div className="bg-[#0C0C0C] text-[#B8B9B6] text-[10px] lg:text-xs font-medium tracking-[2px] text-center py-2 px-6 lg:px-[120px]">
        AGHUB V0.1.1 IS NOW AVAILABLE — ONE HUB FOR EVERY AI CODING AGENT
      </div>

      {/* Navbar */}
      <nav className="bg-[#111111] flex items-center justify-between px-6 lg:px-[120px] py-4 lg:py-5 relative">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="AGHub logo" className="h-7 w-7" />
          <span className="text-white text-xl italic font-normal font-['Instrument_Serif',serif]">
            aghub
          </span>
        </div>
        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#B8B9B6] text-xs font-medium tracking-[2px] hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/AkaraChen/aghub/releases"
            className="text-white text-xs font-semibold tracking-[1px] border border-[#FF8400] px-4 py-2 rounded-full hover:bg-[#FF8400]/10 transition-colors"
          >
            DOWNLOAD
          </a>
        </div>
        {/* Mobile hamburger */}
        <button
          type="button"
          className="lg:hidden flex flex-col gap-1.5 p-2 -mr-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#111111] border-t border-[#333] px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#B8B9B6] text-sm font-medium tracking-[2px] hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/AkaraChen/aghub/releases"
            className="self-start text-white text-xs font-semibold tracking-[1px] border border-[#FF8400] px-4 py-2 rounded-full hover:bg-[#FF8400]/10 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            DOWNLOAD
          </a>
        </div>
      )}

      {/* Hero */}
      <section className="bg-[#111111] relative overflow-hidden min-h-[400px] lg:h-[640px] flex-shrink-0">
        <div className="relative z-10 px-6 lg:px-[120px] py-10 lg:py-[60px] flex flex-col gap-6">
          <span className="self-start border border-[#FF8400]/30 text-[#FF8400] text-xs font-medium tracking-[2px] px-4 py-1.5">
            SKILL & MCP MANAGEMENT
          </span>
          <h1 className="text-white text-[40px] lg:text-[80px] font-normal font-['Instrument_Serif',serif] leading-[0.95] m-0">
            One hub,
            <br />
            every agent.
          </h1>
          <p className="text-[#B8B9B6] text-base leading-[1.5] max-w-[450px] m-0">
            Unified configuration management for 22+ AI coding assistants.
            Manage MCP servers, portable skills, and project configs from a
            single desktop app built with Tauri 2.
          </p>
          <a
            href="https://github.com/AkaraChen/aghub/releases"
            className="self-start bg-[#FF8400] text-[#111111] text-xs font-semibold tracking-[1px] px-6 py-3 rounded-full hover:bg-[#FF8400]/90 transition-colors"
          >
            GET STARTED
          </a>
        </div>
        <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-[120px] w-[400px] h-[400px] pointer-events-none drop-shadow-2xl rotate-12 transform-gpu">
          <img
            src="/logo.png"
            alt="AGHub Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </section>

      {/* Product Features */}
      <section id="features" className="px-6 lg:px-[120px] bg-[#F2F3F0]">
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
          description="Import .skill packages that work everywhere. Skills are verified, tracked, and portable — install once, use in any supported agent."
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
            "Lightweight — no bundled Chromium",
          ]}
          imageSide="left"
          customVisual={<PlatformScreenshots />}
        />
      </section>

      {/* Supported Agents */}
      <section className="py-12 lg:py-20 bg-[#F2F3F0] overflow-hidden">
        <div className="px-6 lg:px-[120px] mb-10">
          <h2 className="text-[28px] lg:text-[40px] font-normal font-['Instrument_Serif',serif] text-[#111111] mb-4">
            Supported Agents
          </h2>
          <p className="text-[#666666] text-base">
            {agents.length} agents and counting. One config to rule them all.
          </p>
        </div>
        <div className="relative">
          <div className="flex animate-scroll gap-8">
            {[...agents, ...agents].map((agent, i) => (
              <div
                key={`${agent.name}-${i}`}
                className="flex flex-col items-center gap-3 shrink-0 w-[100px]"
              >
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#CBCCC9] flex items-center justify-center p-3 hover:border-[#FF8400]/40 transition-colors">
                  <img
                    src={agent.logo}
                    alt={agent.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[#111111] text-xs font-medium text-center whitespace-nowrap">
                  {agent.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] px-6 lg:px-[120px] py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 mb-12">
          {/* Brand Column */}
          <div className="lg:w-[280px] flex flex-col gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="AGHub logo" className="h-7 w-7" />
              <span className="text-white text-[28px] font-normal font-['Instrument_Serif',serif]">
                aghub
              </span>
            </div>
            <p className="text-[#B8B9B6] text-sm leading-[1.6] max-w-[260px]">
              One hub for every AI coding agent. Unified
              <br />
              configuration for 22+ assistants.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:flex lg:flex-1 lg:justify-end lg:gap-12">
            <FooterColumn
              title="FEATURES"
              links={[
                "MCP Servers",
                "Skills Registry",
                "Project Config",
                "CLI Integration",
              ]}
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
                "https://github.com/AkaraChen/aghub/releases",
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
          <span className="text-[#666666] text-xs tracking-[0.5px]">
            © 2025 AGHUB — MIT LICENSE
          </span>
          <span className="text-[#666666] text-[11px]">Built with Tauri 2</span>
        </div>
      </footer>
    </div>
  );
}

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
      <span className="text-[#666666] text-xs font-semibold tracking-[2px]">
        {title}
      </span>
      {links.map((link, i) => (
        <a
          key={link}
          href={hrefs[i]}
          className="text-[#B8B9B6] text-sm hover:text-white transition-colors"
        >
          {link}
        </a>
      ))}
    </div>
  );
}

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

export default App;
