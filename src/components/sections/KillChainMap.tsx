import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Terminal,
  ExternalLink,
  Download,
  Github,
  FileText,
  ChevronDown,
  Layers,
  CheckCircle2,
  Copy,
  Check,
  Radio,
  ArrowRight,
} from "lucide-react";

export interface KillChainStage {
  id: string;
  stepNumber: string;
  phaseName: string;
  shortName: string;
  tactic: string;
  adversaryAction: string;
  mitreAttack: { id: string; name: string }[];
  telemetry: {
    source: string;
    events: string[];
    description: string;
  };
  splunkQuery: string;
  confidence: "Confirmed" | "Observed" | "Detection";
}

export const killChainStages: KillChainStage[] = [
  {
    id: "stage-1",
    stepNumber: "01",
    phaseName: "Initial Access & Payload Delivery",
    shortName: "Delivery & Staging",
    tactic: "Initial Access / Execution",
    adversaryAction:
      "Staged reverse HTTP Meterpreter payload (windows/x64/meterpreter/reverse_http) on Kali Linux C2 (192.168.110.141) and delivered to target Windows 10 host disguised as FreeClude.exe.",
    mitreAttack: [
      { id: "T1566", name: "Phishing" },
      { id: "T1204.002", name: "User Execution: Malicious File" },
    ],
    telemetry: {
      source: "Sysmon & Windows Security",
      events: ["Sysmon Event ID 1 (Process Create)", "Windows Security Event 4688", "Sysmon Event ID 15 (MOTW)"],
      description:
        "Captured creation of FreeClude.exe with parent process lineage and Alternate Data Stream / Zone.Identifier Mark-of-the-Web metadata.",
    },
    splunkQuery:
      'index=windows (EventCode=1 OR EventCode=4688) Image="*\\\\FreeClude.exe" | table _time host User ParentImage Image CommandLine ProcessGuid',
    confidence: "Confirmed",
  },
  {
    id: "stage-2",
    stepNumber: "02",
    phaseName: "Command & Control (C2) Establishment",
    shortName: "Reverse HTTP C2",
    tactic: "Command & Control",
    adversaryAction:
      "Victim user executes FreeClude.exe, initiating an outbound reverse HTTP connection back to Kali Linux port 80/tcp, establishing an interactive Meterpreter session.",
    mitreAttack: [
      { id: "T1071.001", name: "Web Protocols (HTTP)" },
      { id: "T1059.003", name: "Windows Command Shell" },
    ],
    telemetry: {
      source: "Sysmon Network Telemetry",
      events: ["Sysmon Event ID 3 (Network Connection)", "Sysmon Event ID 7 (Image Loaded)"],
      description:
        "Outbound socket established from FreeClude.exe ProcessGuid to destination IP 192.168.110.141 on port 80/tcp.",
    },
    splunkQuery:
      'index=windows EventCode=3 DestinationPort=80 Protocol=tcp | stats count by ProcessGuid Image SourceIp DestinationIp DestinationPort',
    confidence: "Confirmed",
  },
  {
    id: "stage-3",
    stepNumber: "03",
    phaseName: "Post-Compromise Situational Discovery",
    shortName: "Host Discovery",
    tactic: "Discovery",
    adversaryAction:
      "Attacker spawns Windows command shell via Meterpreter session and runs situational discovery binaries: whoami, hostname, and systeminfo within a rapid burst window.",
    mitreAttack: [
      { id: "T1033", name: "System Owner/User Discovery" },
      { id: "T1082", name: "System Information Discovery" },
    ],
    telemetry: {
      source: "Sysmon Process Lineage",
      events: ["Sysmon Event ID 1 (Discovery Executions)", "Windows Event 4688"],
      description:
        "Execution of whoami.exe, hostname.exe, and systeminfo.exe with parent image cmd.exe and identical ProcessGuid context.",
    },
    splunkQuery:
      'index=windows EventCode=1 Image IN ("*\\\\whoami.exe", "*\\\\hostname.exe", "*\\\\systeminfo.exe") ParentImage="*\\\\cmd.exe" | table _time host User CommandLine ParentProcessId',
    confidence: "Confirmed",
  },
  {
    id: "stage-4",
    stepNumber: "04",
    phaseName: "Persistence & Privilege Escalation (Account Creation)",
    shortName: "Account PrivEsc",
    tactic: "Persistence / PrivEsc",
    adversaryAction:
      "Attacker creates a local backdoor user account via net user and elevates it by appending the user to the local Administrators security group.",
    mitreAttack: [
      { id: "T1136.001", name: "Create Account: Local Account" },
      { id: "T1098.007", name: "Account Manipulation: Additional Local Groups" },
    ],
    telemetry: {
      source: "Windows Security & SAM",
      events: ["Windows Event 4720 (User Created)", "Windows Event 4732 (Group Member Added)", "Sysmon Event ID 1 (net.exe)"],
      description:
        "SAM account creation audited under Event 4720, followed immediately by Event 4732 confirming membership escalation to local Administrators.",
    },
    splunkQuery:
      'index=windows (EventCode=4720 OR EventCode=4732) | table _time TargetUserName MemberName SubjectUserName GroupName',
    confidence: "Confirmed",
  },
  {
    id: "stage-5",
    stepNumber: "05",
    phaseName: "High-Privilege Persistence (Scheduled Task)",
    shortName: "SYSTEM Persistence",
    tactic: "Persistence / Privilege Escalation",
    adversaryAction:
      "Operator installs a scheduled task via schtasks.exe configured to execute the payload at user logon with elevated NT AUTHORITY\\SYSTEM privileges, then removes the temporary local user.",
    mitreAttack: [{ id: "T1053.005", name: "Scheduled Task/Job: Scheduled Task" }],
    telemetry: {
      source: "Task Scheduler & Security",
      events: ["Windows Security Event 4698 (Scheduled Task Created)", "Sysmon Event ID 1 (schtasks.exe)"],
      description:
        "Audited creation of XML task definition with LogonTrigger and Principal RunLevel=HighestAvailable running as SYSTEM.",
    },
    splunkQuery:
      'index=windows EventCode=4698 TaskName="*" | xmlkv | search UserId="*SYSTEM*" OR Author="*SYSTEM*" | table _time host TaskName UserId',
    confidence: "Confirmed",
  },
  {
    id: "stage-6",
    stepNumber: "06",
    phaseName: "Ingress Tool Transfer (LOLBIN Masquerading)",
    shortName: "Tool Staging (certutil)",
    tactic: "Command and Control / Defense Evasion",
    adversaryAction:
      "Attacker uses native Windows binary certutil.exe with arguments -urlcache -split -f to pull mimikatz.exe from Kali web server, masquerading it on disk as GetClaude.exe.",
    mitreAttack: [
      { id: "T1105", name: "Ingress Tool Transfer" },
      { id: "T1036.005", name: "Masquerading: Match Legitimate Name" },
    ],
    telemetry: {
      source: "Sysmon Process & File Telemetry",
      events: [
        "Sysmon Event ID 1 (certutil execution)",
        "Sysmon Event ID 3 (certutil outbound HTTP)",
        "Sysmon Event ID 11 (File Create: GetClaude.exe)",
      ],
      description:
        "certutil.exe network connection to remote staging server and immediate write of executable file in user Downloads directory.",
    },
    splunkQuery:
      'index=windows EventCode=1 Image="*\\\\certutil.exe" CommandLine="*-urlcache*" | table _time host User CommandLine ProcessGuid TargetFilename',
    confidence: "Confirmed",
  },
  {
    id: "stage-7",
    stepNumber: "07",
    phaseName: "Credential-Access Preparation & Debug Privilege",
    shortName: "Credential Access Prep",
    tactic: "Credential Access",
    adversaryAction:
      "Operator executes GetClaude.exe (Mimikatz 2.2.0 x64) and executes command privilege::debug, successfully returning Privilege 20 OK to enable SeDebugPrivilege for LSASS targeting.",
    mitreAttack: [
      { id: "T1003", name: "OS Credential Dumping" },
      { id: "T1003.001", name: "LSASS Memory Hunting" },
    ],
    telemetry: {
      source: "Sysmon Process & Access Telemetry",
      events: ["Sysmon Event ID 1 (Process Create)", "Sysmon Event ID 10 (Process Access targeting lsass.exe)"],
      description:
        "Execution of GetClaude.exe with High Integrity level. Hunt query checks for granted access rights to lsass.exe process handle.",
    },
    splunkQuery:
      'index=windows (EventCode=1 OR EventCode=10) (Image="*\\\\GetClaude.exe" OR CommandLine="*privilege::debug*" OR TargetImage="*\\\\lsass.exe") | table _time host User CommandLine IntegrityLevel GrantedAccess',
    confidence: "Confirmed",
  },
  {
    id: "stage-8",
    stepNumber: "08",
    phaseName: "SIEM Correlation, Sigma Engineering & ATT&CK Mapping",
    shortName: "Splunk Correlation & Sigma",
    tactic: "SOC Detection & Response",
    adversaryAction:
      "Correlated all multi-stage attack artifacts in Splunk Enterprise across Sysmon ProcessGuid and Windows Event IDs. Authored custom Sigma rules and mapped all behaviors to an interactive MITRE ATT&CK Navigator layer.",
    mitreAttack: [
      { id: "Unified Layer", name: "MITRE ATT&CK Enterprise Matrix" },
      { id: "Detection", name: "SigmaHQ Standard Rules" },
    ],
    telemetry: {
      source: "Splunk Enterprise SIEM",
      events: [
        "Sysmon 1, 3, 7, 10, 11, 15",
        "Windows Security 4688, 4720, 4732, 4698",
        "ATT&CK Navigator JSON Layer",
      ],
      description:
        "Unified cross-event timeline reconstruction proving complete adversary kill chain and delivering production-ready SPL alert queries.",
    },
    splunkQuery:
      'index=windows (host="Sh-Win10" OR host="SH-WIN10") | transaction ProcessGuid maxspan=2h | table _time host Image CommandLine EventCode',
    confidence: "Detection",
  },
];

export default function KillChainMap() {
  const [expandedStage, setExpandedStage] = useState<string | null>("stage-1");
  const [copiedQueryId, setCopiedQueryId] = useState<string | null>(null);

  const toggleStage = (id: string) => {
    setExpandedStage((prev) => (prev === id ? null : id));
  };

  const expandAll = () => {
    setExpandedStage("ALL");
  };

  const collapseAll = () => {
    setExpandedStage(null);
  };

  const isStageExpanded = (id: string) => {
    return expandedStage === "ALL" || expandedStage === id;
  };

  const copyQuery = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQueryId(id);
    setTimeout(() => setCopiedQueryId(null), 2000);
  };

  return (
    <div className="bg-card/70 border border-primary/25 rounded-2xl p-5 sm:p-7 relative overflow-hidden backdrop-blur-md shadow-[0_0_40px_rgba(255,107,53,0.06)]">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -ml-20 -mb-20" />

      {/* Top Header Badge & Meta */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-foreground/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/25 inline-flex items-center gap-1.5">
              <ShieldAlert size={13} />
              Flagship SOC Simulation & DFIR
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Simulation 1 Completed
            </span>
            <span className="text-xs text-muted-foreground bg-foreground/5 px-2.5 py-0.5 rounded-full border border-foreground/10">
              Splunk Enterprise 10.x · Sysmon · ATT&CK
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
            SOC Threat Detection Analysis Simulation: Endpoint Compromise & Splunk Log Correlation
          </h3>
          <p className="text-sm text-primary/80 font-medium mt-1">
            Kali Linux (Attacker) <span className="text-muted-foreground/60">→</span> Windows 10 (Sysmon Endpoint) <span className="text-muted-foreground/60">→</span> Windows 11 (Splunk Enterprise SIEM)
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

      {/* Narrative Description */}
      <div className="py-5 text-sm text-muted-foreground leading-relaxed relative z-10 border-b border-foreground/8">
        <p className="text-left sm:text-justify">
          An end-to-end hands-on Security Operations Center (SOC) threat detection simulation and digital forensics &
          incident response (DFIR) investigation. Reconstructs a controlled multi-stage Windows endpoint intrusion from
          initial payload delivery and reverse HTTP Meterpreter C2 through local reconnaissance, privilege escalation,
          elevated scheduled-task persistence, ingress tool transfer via certutil, and Mimikatz credential dumping
          preparation. Endpoint telemetry was ingested and correlated in Splunk Enterprise across Sysmon events (Process
          Creation, Network Connections, Process Access) and Windows Security event logs, mapped against the MITRE ATT&CK
          framework, and formalized into actionable Sigma detection rules and Splunk SPL hunt alerts.
        </p>
      </div>

      {/* Cyber Kill Chain Interactive Map Header */}
      <div className="pt-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <Layers size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Cyber Kill Chain & Attack Lifecycle Map
                </span>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                  Interactive
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Click any stage node to expand telemetry, adversary actions, MITRE ATT&CK techniques, and Splunk queries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={expandAll}
              className="text-xs font-medium text-foreground/80 hover:text-primary bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="text-xs font-medium text-muted-foreground hover:text-foreground bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Step-by-Step Horizontal Visual Pipeline Map */}
        <div className="mb-6 p-3 sm:p-4 rounded-xl bg-background/60 border border-foreground/8 overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-[720px]">
            {killChainStages.map((stage, idx) => {
              const active = isStageExpanded(stage.id);
              return (
                <div key={stage.id} className="flex items-center gap-1.5 sm:gap-2 flex-1">
                  <button
                    onClick={() => toggleStage(stage.id)}
                    className={`flex-1 flex flex-col items-start p-2.5 rounded-xl border text-left transition-all duration-200 group ${
                      active
                        ? "bg-primary/15 border-primary/60 shadow-[0_0_15px_rgba(255,107,53,0.2)]"
                        : "bg-foreground/[0.02] border-foreground/8 hover:border-primary/30 hover:bg-foreground/[0.04]"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          active ? "bg-primary text-primary-foreground" : "bg-foreground/10 text-muted-foreground"
                        }`}
                      >
                        {stage.stepNumber}
                      </span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />}
                    </div>
                    <span
                      className={`text-xs font-bold truncate w-full ${
                        active ? "text-primary" : "text-foreground group-hover:text-primary transition-colors"
                      }`}
                    >
                      {stage.shortName}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate w-full mt-0.5">
                      {stage.tactic.split("/")[0]}
                    </span>
                  </button>

                  {idx < killChainStages.length - 1 && (
                    <ArrowRight size={14} className="text-foreground/20 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Expandable Kill Chain Cards in Chronological Order */}
        <div className="space-y-3">
          {killChainStages.map((stage) => {
            const expanded = isStageExpanded(stage.id);
            return (
              <div
                key={stage.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  expanded
                    ? "bg-background/80 border-primary/40 shadow-sm"
                    : "bg-background/40 border-foreground/8 hover:border-foreground/20"
                }`}
              >
                {/* Stage Header Button */}
                <button
                  onClick={() => toggleStage(stage.id)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left gap-3 select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-md shrink-0">
                      Phase {stage.stepNumber}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-bold text-foreground truncate">
                        {stage.phaseName}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate mt-0.5 sm:hidden">
                        {stage.tactic}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="hidden sm:flex items-center gap-1.5">
                      {stage.mitreAttack.map((technique) => (
                        <span
                          key={technique.id}
                          className="text-[10px] font-mono font-medium text-primary/90 bg-primary/10 px-2 py-0.5 rounded border border-primary/20"
                        >
                          {technique.id}
                        </span>
                      ))}
                    </div>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all duration-200 ${
                        expanded
                          ? "bg-primary text-primary-foreground border-primary rotate-180"
                          : "bg-foreground/5 text-muted-foreground border-foreground/10"
                      }`}
                    >
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </button>

                {/* Expanded Details Body */}
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 border-t border-foreground/8 space-y-3.5">
                        {/* Adversary Activity */}
                        <div className="bg-foreground/[0.02] p-3 rounded-xl border border-foreground/6">
                          <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold uppercase tracking-wider text-rose-400">
                            <Radio size={13} />
                            <span>Adversary Action</span>
                          </div>
                          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-mono bg-black/30 p-2.5 rounded-lg border border-foreground/5">
                            {stage.adversaryAction}
                          </p>
                        </div>

                        {/* MITRE ATT&CK & Telemetry Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {/* MITRE ATT&CK Techniques */}
                          <div className="bg-foreground/[0.02] p-3 rounded-xl border border-foreground/6">
                            <div className="flex items-center gap-1.5 mb-2 font-semibold text-primary uppercase tracking-wider text-[11px]">
                              <CheckCircle2 size={13} />
                              <span>MITRE ATT&CK Mapping</span>
                            </div>
                            <div className="space-y-1.5">
                              {stage.mitreAttack.map((tech) => (
                                <div
                                  key={tech.id}
                                  className="flex items-center justify-between bg-primary/5 p-2 rounded-lg border border-primary/15"
                                >
                                  <span className="font-bold text-primary font-mono text-xs">{tech.id}</span>
                                  <span className="text-muted-foreground text-xs">{tech.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Telemetry & Log Artifacts */}
                          <div className="bg-foreground/[0.02] p-3 rounded-xl border border-foreground/6">
                            <div className="flex items-center gap-1.5 mb-2 font-semibold text-emerald-400 uppercase tracking-wider text-[11px]">
                              <Terminal size={13} />
                              <span>Observed Log Telemetry</span>
                            </div>
                            <div className="space-y-1 text-xs text-muted-foreground">
                              {stage.telemetry.events.map((ev, eIdx) => (
                                <div key={eIdx} className="flex items-start gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                  <span className="font-mono text-foreground/90">{ev}</span>
                                </div>
                              ))}
                              <p className="text-[11px] text-muted-foreground/80 mt-1 pt-1 border-t border-foreground/5">
                                {stage.telemetry.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Splunk Hunt / Detection Query */}
                        <div className="bg-black/50 p-3.5 rounded-xl border border-primary/25">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                              <Terminal size={14} className="text-primary" />
                              <span>Splunk SPL Hunt Query</span>
                            </div>
                            <button
                              onClick={() => copyQuery(stage.id, stage.splunkQuery)}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary bg-foreground/5 hover:bg-foreground/10 px-2.5 py-1 rounded transition-colors"
                              title="Copy query to clipboard"
                            >
                              {copiedQueryId === stage.id ? (
                                <>
                                  <Check size={12} className="text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  <span>Copy Query</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="text-xs font-mono text-primary/95 bg-black/60 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed border border-foreground/10">
                            {stage.splunkQuery}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-foreground/8">
          {[
            "Splunk Enterprise",
            "Sysmon Telemetry",
            "MITRE ATT&CK",
            "Sigma Rules",
            "SPL Threat Hunting",
            "DFIR",
            "Meterpreter C2",
            "LOLBINs (certutil)",
            "Mimikatz",
            "Privilege Escalation",
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
    </div>
  );
}
