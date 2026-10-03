import { useState } from "react";
import {
  ShieldAlert,
  ExternalLink,
  Download,
  Github,
  FileText,
  ShieldCheck,
  Search,
  KeyRound,
  Network,
  UserCheck,
  Cpu,
  ArrowRight,
  ArrowLeft,
  Activity,
  Terminal,
  ChevronDown,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────────────
   Simulation Phases with Starting Paragraph from Report/PDF
   ────────────────────────────────────────────────────────────────────── */

interface SimulationPhase {
  id: string;
  stepNum: string;
  title: string;
  shortTitle: string;
  icon: any;
  paragraph: string;
}

const simulationPhases: SimulationPhase[] = [
  {
    id: "step-1",
    stepNum: "01",
    title: "Initial Access & Command and Control (C2)",
    shortTitle: "Initial Access & C2",
    icon: Network,
    paragraph:
      "The attack begins when the payload executable is executed on the Windows 10 endpoint. Sysmon Event 1 records FreeClude.exe running from the Downloads directory with explorer.exe as its parent process under high integrity. The process immediately initiates an outbound TCP connection to the Kali Linux listener (192.168.110.141) on port 80, successfully establishing an interactive reverse HTTP Meterpreter command-and-control session.",
  },
  {
    id: "step-2",
    stepNum: "02",
    title: "System Discovery & Host Fingerprinting",
    shortTitle: "System Discovery",
    icon: Search,
    paragraph:
      "Discovery begins after the shell is established, as the operator uses native Windows utilities to identify the current user and gather basic host information. The observed sequence includes whoami.exe, hostname.exe, and systeminfo.exe, with whoami returning SH-WIN10\\saad. These rapid burst commands provide direct telemetry evidence for user and system information discovery originating from the compromised command shell.",
  },
  {
    id: "step-3",
    stepNum: "03",
    title: "Persistence & Privilege Escalation",
    shortTitle: "Persistence & PrivEsc",
    icon: UserCheck,
    paragraph:
      "Persistence becomes visible when the operator creates a new local account and changes its group membership. The observed command sequence shows ClaudeBackdoor being created as a local user and then added to the local Administrators group. To maintain elevated persistence, a Windows scheduled task named GetClaudeBackdoor is registered using schtasks.exe, configured to execute the payload at user logon under the SYSTEM account.",
  },
  {
    id: "step-4",
    stepNum: "04",
    title: "Tool Transfer via certutil (LOLBIN)",
    shortTitle: "certutil LOLBIN Transfer",
    icon: Cpu,
    paragraph:
      "The next phase shows the attacker acquiring a second-stage tool through the native Windows certutil.exe utility. The observed execution used certutil -urlcache -split -f to retrieve an external file from GitHub and save it locally disguised as GetClaude.exe. This leverages Living-off-the-Land binary (LOLBIN) abuse to download malicious tooling directly to the compromised host without triggering standard browser download prompts.",
  },
  {
    id: "step-5",
    stepNum: "05",
    title: "Credential Access & Memory Inspection (Mimikatz)",
    shortTitle: "Credential Access",
    icon: KeyRound,
    paragraph:
      "This phase shows the execution of GetClaude.exe, which identified itself as Mimikatz 2.2.0 x64. The operator executed privilege::debug, returning 'Privilege 20 OK' to enable SeDebugPrivilege within the process. This confirms debug-privilege enablement and indicates preparation for privileged memory access handles targeting the Local Security Authority Subsystem Service (lsass.exe).",
  },
  {
    id: "step-6",
    stepNum: "06",
    title: "Splunk SIEM Correlation & Sigma Detection Engineering",
    shortTitle: "SIEM Correlation & Defense",
    icon: ShieldCheck,
    paragraph:
      "In Splunk Enterprise, endpoint telemetry from Sysmon and Windows Security audit logs was centralized to reconstruct the attack as a continuous timeline. Using Sysmon ProcessGuid correlation, the multi-stage events were linked together chronologically. Custom Sigma detection rules were then authored for LOLBIN downloads, scheduled tasks, and debug privileges, and converted into automated Splunk SPL alert triggers.",
  },
];

/* ──────────────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────────────── */

export default function AttackTreeMap() {
  const [activeStepId, setActiveStepId] = useState<string>("step-1");

  const activeIndex = simulationPhases.findIndex((p) => p.id === activeStepId);
  const activePhase = simulationPhases[activeIndex] || simulationPhases[0];
  const ActiveIcon = activePhase.icon;

  const goToStep = (index: number) => {
    if (index >= 0 && index < simulationPhases.length) {
      setActiveStepId(simulationPhases[index].id);
    }
  };

  return (
    <div className="bg-card/60 border border-primary/25 rounded-2xl p-4 sm:p-6 md:p-8 relative overflow-hidden backdrop-blur-md shadow-[0_0_40px_rgba(255,107,53,0.06)]">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[130px] pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[130px] pointer-events-none -ml-20 -mb-20" />

      {/* ── Top Header ── */}
      <div className="pb-6 border-b border-foreground/10 relative z-10 space-y-4">
        {/* Row 1: Badges on left, Action Buttons on right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/25 inline-flex items-center gap-1.5">
              <ShieldAlert size={13} />
              Hands-on SOC Simulation
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Simulation 1 Completed
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap shrink-0">
            <a
              href={`${import.meta.env.BASE_URL}reports/Splunk-SOC-Investigation-(1)-Report.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-3.5 py-1.5 rounded-full transition-all duration-200 shadow-md hover:shadow-primary/25"
            >
              <FileText size={14} />
              <span>View Report (PDF)</span>
              <ExternalLink size={11} />
            </a>

            <a
              href={`${import.meta.env.BASE_URL}reports/Splunk-SOC-Investigation-(1)-Report.docx`}
              download="Splunk-SOC-Investigation-(1)-Report.docx"
              className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/15 px-3 py-1.5 rounded-full transition-all duration-200"
              title="Download Original Investigation Report (.docx)"
            >
              <Download size={14} />
              <span>Download (.docx)</span>
            </a>

            <a
              href="https://github.com/shii9/SOC_Simulation/tree/main/SOC_Investigation_Simulation_1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/15 px-3 py-1.5 rounded-full transition-all duration-200"
            >
              <Github size={14} />
              <span>GitHub Repo</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Row 2: 3-line Title on Left, 3 Architecture Boxes on Right (Organized Height Match) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
          <div className="flex-1 min-w-0 pr-0 lg:pr-4">
            <h3 className="text-xl sm:text-2xl md:text-[28px] lg:text-3xl font-serif font-bold text-foreground tracking-tight leading-snug">
              <span className="block">SOC Threat Detection</span>
              <span className="block">Analysis Simulation Investigation:</span>
              <span className="block">Endpoint Compromise & Log Correlation</span>
            </h3>
          </div>

          {/* 3 Architecture Boxes (Height matched to the 3 lines of text) */}
          <div className="w-full sm:w-[260px] lg:w-[275px] shrink-0 flex flex-col justify-between self-stretch lg:self-auto py-0.5">
            {/* Box 1: Kali Linux (Attacker) */}
            <div className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border border-red-500/25 bg-red-500/[0.04]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-md bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  <Terminal size={11} />
                </div>
                <span className="text-xs font-bold text-foreground truncate">
                  Kali Linux
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-red-400 bg-red-400/10 border border-red-400/25 px-1.5 py-0.5 rounded shrink-0">
                Attacker
              </span>
            </div>

            {/* Vertical Connector Line 1 */}
            <div className="flex items-center justify-center text-primary/70 -my-0.5">
              <ChevronDown size={11} className="text-primary/70" />
            </div>

            {/* Box 2: Windows 10 (Target) */}
            <div className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border border-amber-500/25 bg-amber-500/[0.04]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Cpu size={11} />
                </div>
                <span className="text-xs font-bold text-foreground truncate">
                  Windows 10
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 border border-amber-400/25 px-1.5 py-0.5 rounded shrink-0">
                Target
              </span>
            </div>

            {/* Vertical Connector Line 2 */}
            <div className="flex items-center justify-center text-primary/70 -my-0.5">
              <ChevronDown size={11} className="text-primary/70" />
            </div>

            {/* Box 3: Windows 11 (Splunk SIEM) */}
            <div className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.04]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck size={11} />
                </div>
                <span className="text-xs font-bold text-foreground truncate">
                  Windows 11
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 px-1.5 py-0.5 rounded shrink-0">
                Splunk SIEM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Narrative Summary ── */}
      <div className="py-4 text-xs sm:text-sm text-muted-foreground leading-relaxed relative z-10 border-b border-foreground/8 space-y-3">
        <p className="text-left sm:text-justify">
          In this hands-on cybersecurity simulation, I designed and executed an end-to-end adversary attack scenario across an isolated enterprise lab consisting of <span className="text-primary font-semibold">Kali Linux</span> as the attacking platform, <span className="text-primary font-semibold">Windows 10</span> as the victim endpoint, and <span className="text-primary font-semibold">Windows 11</span> running <span className="text-primary font-semibold">Splunk Enterprise</span> as the centralized SIEM. The primary objective was to generate realistic adversary activity, collect forensic endpoint logs via the <span className="text-primary font-semibold">Splunk Universal Forwarder</span>, reconstruct the complete intrusion timeline, and engineer high-fidelity threat detection rules mapped directly to the <span className="text-primary font-semibold">MITRE ATT&CK Framework</span>.
        </p>
        <p className="text-left sm:text-justify">
          Throughout the offensive simulation, I walked through the full cyber attack lifecycle: staging a reverse HTTP payload using <span className="text-primary font-semibold">Metasploit (msfvenom & multi/handler)</span> to establish an active <span className="text-primary font-semibold">Meterpreter C2 session</span>, performing rapid host reconnaissance with native Windows utilities (<span className="text-primary font-semibold">whoami</span>, <span className="text-primary font-semibold">hostname</span>, <span className="text-primary font-semibold">systeminfo</span>), establishing administrative persistence through local backdoor accounts (<span className="text-primary font-semibold">net user</span>, <span className="text-primary font-semibold">net localgroup</span>) and elevated <span className="text-primary font-semibold">SYSTEM Task Scheduler (schtasks.exe)</span> entries, abusing <span className="text-primary font-semibold">Living-off-the-Land Binaries (LOLBINs)</span> via <span className="text-primary font-semibold">certutil.exe -urlcache</span> for covert payload transfer, and executing <span className="text-primary font-semibold">Mimikatz (disguised as GetClaude.exe)</span> to inspect privileged <span className="text-primary font-semibold">LSASS process memory</span>.
        </p>
        <p className="text-left sm:text-justify">
          From the SOC defense perspective, I centralized and analyzed deep endpoint telemetry collected by <span className="text-primary font-semibold">Microsoft Sysmon</span> (Process Creation Event 1, Network Sockets Event 3, Process Access Event 10, File Creation Event 11) and <span className="text-primary font-semibold">Windows Security Audit Logs</span> (Events 4688, 4720, 4732, and 4698). By correlating parent-child process lineage, network sockets, and unique Sysmon <span className="text-primary font-semibold">ProcessGuid</span> tokens, I transformed disparate logs into an uninterrupted chronological attack timeline, validated hunt searches using <span className="text-primary font-semibold">Splunk SPL</span>, and authored production-ready <span className="text-primary font-semibold">Sigma Rules</span> to detect and alert on suspicious adversary behaviors in enterprise environments.
        </p>
      </div>

      {/* ── Interactive Phase Selection (Upper Row Only) ── */}
      <div className="pt-6 relative z-10">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <Activity size={14} />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">
                Attack & Investigation Phases (01 To 06)
              </span>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Click any phase to read the investigation summary
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
            Phase {activePhase.stepNum} of 06
          </span>
        </div>

        {/* 6 Phases Across the Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {simulationPhases.map((phase) => {
            const isActive = activeStepId === phase.id;
            const PhaseIcon = phase.icon;

            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => setActiveStepId(phase.id)}
                className={`flex flex-col justify-between min-h-[96px] sm:min-h-[108px] p-4 rounded-xl border text-left transition-all duration-200 relative group overflow-hidden ${
                  isActive
                    ? "bg-primary/15 border-primary shadow-[0_0_18px_rgba(255,107,53,0.2)]"
                    : "bg-foreground/[0.02] border-foreground/8 hover:border-primary/35 hover:bg-foreground/[0.05]"
                }`}
              >
                {/* Active indicator bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-300 ${
                    isActive
                      ? "bg-primary shadow-[0_0_8px_rgba(255,107,53,0.8)]"
                      : "bg-transparent group-hover:bg-primary/25"
                  }`}
                />

                <div className="flex items-center justify-between w-full mb-3">
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/10 text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    Phase {phase.stepNum}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-primary/25 text-primary"
                        : "text-muted-foreground/60 group-hover:text-primary bg-foreground/5"
                    }`}
                  >
                    <PhaseIcon size={15} />
                  </div>
                </div>

                <span
                  className={`text-xs sm:text-[13px] font-bold line-clamp-2 leading-snug transition-colors ${
                    isActive ? "text-primary" : "text-foreground/90 group-hover:text-foreground"
                  }`}
                >
                  {phase.shortTitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Phase Details (Simple Starting Paragraph from Report) ── */}
      <div className="mt-4 relative z-10">
        <div className="rounded-xl border border-primary/35 bg-background/80 backdrop-blur-sm p-4 sm:p-5 pb-3 sm:pb-3.5 shadow-[0_4px_24px_rgba(255,107,53,0.08)] relative overflow-hidden transition-all duration-300">
          {/* Subtle corner glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-primary/8 rounded-full blur-[60px] pointer-events-none" />

          {/* Phase Header */}
          <div className="flex items-center justify-between gap-3 pb-1.5 mb-2 relative z-10">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                <ActiveIcon size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary text-primary-foreground">
                    Phase {activePhase.stepNum}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-foreground truncate">
                    {activePhase.title}
                  </h4>
                </div>
              </div>
            </div>

            <span className="text-[11px] font-mono text-muted-foreground shrink-0 hidden sm:block">
              {activeIndex + 1} of {simulationPhases.length}
            </span>
          </div>

          {/* Simple Short Starting Paragraph from PDF */}
          <div className="relative z-10">
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-foreground/[0.02] p-3.5 rounded-lg border border-foreground/6">
              {activePhase.paragraph}
            </p>
          </div>

          {/* Previous / Next Phase Navigation */}
          <div className="mt-3 sm:mt-3.5 flex items-center justify-between text-xs relative z-10">
            <div>
              {activeIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => goToStep(activeIndex - 1)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={13} />
                  <span>Previous Phase</span>
                </button>
              ) : (
                <span className="text-[11px] text-muted-foreground/40">Start of Investigation</span>
              )}
            </div>

            <span className="text-[11px] text-muted-foreground/60 font-medium">
              Click any phase above or use buttons to navigate
            </span>

            <div>
              {activeIndex < simulationPhases.length - 1 ? (
                <button
                  type="button"
                  onClick={() => goToStep(activeIndex + 1)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"
                >
                  <span>Next Phase</span>
                  <ArrowRight size={13} />
                </button>
              ) : (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  Investigation Complete
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tags Footer ── */}
      <div className="flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-foreground/8 relative z-10">
        {[
          "Splunk Enterprise",
          "Sysmon Logs",
          "Windows Security Events",
          "Reverse HTTP C2",
          "certutil LOLBIN",
          "Mimikatz",
          "Persistence Setup",
          "SIEM Threat Hunting",
        ].map((tag) => (
          <span
            key={tag}
            className="text-xs font-medium text-primary/80 bg-primary/8 px-3 py-1 rounded-full border border-primary/15"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
