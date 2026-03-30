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
}: {
  label: string;
  title: string;
  description: string;
  bullets: string[];
  imageSide: "left" | "right";
  imageSrc?: string;
}) {
  const { ref, inView } = useInView();

  const textContent = (
    <div className="flex-1 flex flex-col gap-5 justify-center">
      <span className="self-start text-[#FF8400] text-xs font-semibold tracking-[2px]">
        {label}
      </span>
      <h3 className="text-[36px] font-normal font-['Instrument_Serif',serif] text-[#111111] m-0 leading-tight">
        {title}
      </h3>
      <p className="text-[#666666] text-base leading-[1.6] m-0">{description}</p>
      <ul className="list-none p-0 m-0 flex flex-col gap-3">
        {bullets.map((b) => (
          <li key={b} className="flex items-center gap-3 text-[#111111] text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF8400] shrink-0" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );

  const imagePlaceholder = imageSrc ? (
    <div className="flex-1 flex items-center justify-center">
      <img src={imageSrc} alt={`${label} screenshot`} className="w-full h-auto" />
    </div>
  ) : (
    <div className="flex-1 bg-[#E7E8E5] border border-[#CBCCC9] rounded-2xl h-[360px] flex items-center justify-center">
      <span className="text-[#666666] text-sm tracking-[2px]">SCREENSHOT</span>
    </div>
  );

  return (
    <div
      ref={ref}
      className={`flex gap-16 items-center py-24 transition-all duration-700 ease-out ${
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

function App() {
  return (
    <div className="min-h-screen flex flex-col font-['Inter',sans-serif] text-base bg-[#F2F3F0]">
      {/* Announcement Bar */}
      <div className="bg-[#0C0C0C] text-[#B8B9B6] text-xs font-medium tracking-[2px] text-center py-2 px-[120px]">
        AGHUB V0.1.1 IS NOW AVAILABLE — ONE HUB FOR EVERY AI CODING AGENT
      </div>

      {/* Navbar */}
      <nav className="bg-[#111111] flex items-center justify-between px-[120px] py-5">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="AGHub" className="h-7 w-7" />
          <span className="text-white text-xl italic font-normal font-['Instrument_Serif',serif]">
            aghub
          </span>
        </div>
        <div className="flex items-center gap-8">
          {["FEATURES", "DOCS", "SKILLS", "GITHUB"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[#B8B9B6] text-xs font-medium tracking-[2px] hover:text-white transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
        <a
          href="#"
          className="text-white text-xs font-semibold tracking-[1px] border border-[#FF8400] px-4 py-2 rounded-full hover:bg-[#FF8400]/10 transition-colors"
        >
          DOWNLOAD
        </a>
      </nav>

      {/* Hero */}
      <section className="bg-[#111111] relative overflow-hidden h-[640px] flex-shrink-0">
        <div className="relative z-10 px-[120px] py-[60px] flex flex-col gap-6">
          <span className="self-start border border-[#FF8400]/30 text-[#FF8400] text-xs font-medium tracking-[2px] px-4 py-1.5">
            SKILL & MCP MANAGEMENT
          </span>
          <h1 className="text-white text-[80px] font-normal font-['Instrument_Serif',serif] leading-[0.95] m-0">
            One hub,
            <br />
            every agent.
          </h1>
          <p className="text-[#B8B9B6] text-base leading-[1.5] max-w-[450px] m-0">
            Unified configuration management for 22+ AI coding assistants. Manage MCP servers,
            portable skills, and project configs from a single desktop app built with Tauri 2.
          </p>
          <a
            href="https://github.com/AkaraChen/aghub/releases"
            className="self-start bg-[#FF8400] text-[#111111] text-xs font-semibold tracking-[1px] px-6 py-3 rounded-full hover:bg-[#FF8400]/90 transition-colors"
          >
            GET STARTED
          </a>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-[120px] w-[400px] h-[400px] pointer-events-none drop-shadow-2xl rotate-12 transform-gpu">
          <img src="/logo.png" alt="AGHub Logo" className="w-full h-full object-contain" />
        </div>
      </section>

      {/* Logo Bar */}
      <section className="flex items-center justify-around px-[120px] h-20 border-t border-[#CBCCC9] bg-[#F2F3F0]">
        {["Claude Code", "Cursor", "Windsurf", "Gemini CLI", "OpenCode", "Amp"].map((logo) => (
          <span key={logo} className="text-[#666666] text-sm font-medium">
            {logo}
          </span>
        ))}
      </section>

      {/* Product Features */}
      <section className="px-[120px] bg-[#F2F3F0]">
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
          imageSrc="/market_screenshot.png"
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
        />
      </section>

      {/* Supported Agents */}
      <section className="px-[120px] py-20 bg-[#F2F3F0]">
        <h2 className="text-[40px] font-normal font-['Instrument_Serif',serif] text-[#111111] mb-4">
          Supported Agents
        </h2>
        <p className="text-[#666666] text-base mb-10">
          23 agents and counting. One config to rule them all.
        </p>
        <div className="grid grid-cols-4 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.name} {...agent} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] px-[120px] py-20">
        <div className="flex gap-20 mb-12">
          {/* Brand Column */}
          <div className="w-[280px] flex flex-col gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="AGHub" className="h-7 w-7" />
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
          <div className="flex flex-1 justify-end gap-12">
            <FooterColumn
              title="FEATURES"
              links={["MCP Servers", "Skills Registry", "Project Config", "CLI Integration"]}
            />
            <FooterColumn
              title="RESOURCES"
              links={["Documentation", "GitHub", "Releases", "Changelog"]}
            />
            <FooterColumn
              title="COMMUNITY"
              links={["Twitter / X", "Discord", "GitHub Issues", "Contributing"]}
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

function AgentCard({
  name,
  type,
  stdio,
  remote,
}: {
  name: string;
  type: "CLI" | "IDE" | "Desktop";
  stdio: boolean;
  remote: boolean;
}) {
  const { ref, inView } = useInView(0.1);
  const typeColor =
    type === "CLI"
      ? "bg-[#FF8400]/15 text-[#FF8400]"
      : type === "IDE"
        ? "bg-[#111111]/10 text-[#111111]"
        : "bg-[#666666]/15 text-[#666666]";

  return (
    <div
      ref={ref}
      className={`border border-[#CBCCC9] bg-white p-5 flex flex-col gap-3 rounded-2xl transition-all duration-500 ease-out hover:border-[#FF8400]/40 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[#111111] text-sm font-semibold">{name}</span>
        <span
          className={`text-[10px] font-semibold tracking-[1px] px-2 py-0.5 rounded-full ${typeColor}`}
        >
          {type}
        </span>
      </div>
      <div className="flex gap-1.5">
        {stdio && (
          <span className="bg-[#E7E8E5] text-[#111111] text-[11px] font-medium px-2 py-0.5 rounded-full">
            Stdio
          </span>
        )}
        {remote && (
          <span className="bg-[#E7E8E5] text-[#111111] text-[11px] font-medium px-2 py-0.5 rounded-full">
            Remote
          </span>
        )}
        {!stdio && !remote && <span className="text-[#666666] text-[11px]">Config only</span>}
      </div>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-[#666666] text-xs font-semibold tracking-[2px]">{title}</span>
      {links.map((link) => (
        <a
          key={link}
          href="#"
          className="text-[#B8B9B6] text-sm hover:text-white transition-colors"
        >
          {link}
        </a>
      ))}
    </div>
  );
}

const agents: { name: string; type: "CLI" | "IDE" | "Desktop"; stdio: boolean; remote: boolean }[] =
  [
    { name: "Claude Code", type: "CLI", stdio: true, remote: true },
    { name: "Cursor", type: "IDE", stdio: true, remote: true },
    { name: "Windsurf", type: "IDE", stdio: true, remote: true },
    { name: "Gemini CLI", type: "CLI", stdio: true, remote: true },
    { name: "OpenCode", type: "CLI", stdio: true, remote: true },
    { name: "Amp", type: "CLI", stdio: true, remote: true },
    { name: "GitHub Copilot", type: "IDE", stdio: true, remote: true },
    { name: "Cline", type: "IDE", stdio: true, remote: true },
    { name: "RooCode", type: "IDE", stdio: true, remote: true },
    { name: "Kiro", type: "IDE", stdio: true, remote: true },
    { name: "JetBrains AI", type: "IDE", stdio: true, remote: true },
    { name: "Zed", type: "IDE", stdio: true, remote: true },
    { name: "Trae", type: "IDE", stdio: true, remote: true },
    { name: "AugmentCode", type: "IDE", stdio: true, remote: true },
    { name: "KiloCode", type: "IDE", stdio: true, remote: true },
    { name: "Warp", type: "Desktop", stdio: true, remote: true },
    { name: "Factory", type: "CLI", stdio: true, remote: true },
    { name: "Kimi Code CLI", type: "CLI", stdio: true, remote: true },
    { name: "Mistral Le Chat", type: "CLI", stdio: true, remote: true },
    { name: "OpenClaw", type: "CLI", stdio: true, remote: true },
    { name: "OpenAI Codex", type: "CLI", stdio: true, remote: false },
    { name: "Antigravity", type: "CLI", stdio: true, remote: false },
    { name: "Pi Coding Agent", type: "CLI", stdio: false, remote: false },
  ];

export default App;
