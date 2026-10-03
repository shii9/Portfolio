import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Terminal,
  ExternalLink,
  Download,
  Github,
  FileText,
  Copy,
  Check,
  Radio,
  Layers,
  ChevronRight,
  ShieldCheck,
  Activity,
  Cpu,
} from "lucide-react";

interface SubBranch {
  title: string;
  technique: string;
  telemetry: string;
  detail: string;
  splunk: string;
}

interface TreePhase {
  id: string;
  phaseNum: string;
  title: string;
  category: string;
  description: string;
  subBranches: SubBranch[];
}

const treePhases: TreePhase[] = [
  {
    id: "phase-1",
    phaseNum: "01",
    title: "Initial Execution & C2",
    category: "Execution / C2",
    description:
      "Controlled delivery and execution of a staged Meterpreter reverse_http payload, establishing an outbound beacon from the Windows 10 victim host back to the Kali Linux C2 listener over port 80.",
    subBranches: [
      {
        title: "Meterpreter Payload Execution",
        technique: "T1204.002 (Malicious File Execution)",
        telemetry: "Sysmon Event ID 1 (Process Create: FreeClude.exe), Windows Event 4688",
        detail:
          "User executes FreeClude.exe; Sysmon captures executable hash, parent lineage, and Mark-of-the-Web zone stream.",
        splunk:
          'index=windows (EventCode=1 OR EventCode=4688) Image="*\\\\FreeClude.exe" | table _time host User ParentImage Image ProcessGuid',
      },
      {
        title: "Reverse HTTP Beaconing",
        technique: "T1071.001 (Web Protocols / Port 80)",
        telemetry: "Sysmon Event ID 3 (Network Connection to 192.168.110.141:80)",
        detail:
          "Active outbound connection established to attacker listener, initiating an encrypted interactive command session.",
        splunk:
          'index=windows EventCode=3 DestinationPort=80 DestinationIp="192.168.110.141" | stats count by ProcessGuid Image',
      },
    ],
  },
  {
    id: "phase-2",
    phaseNum: "02",
    title: "Post-Compromise Discovery",
    category: "Internal Reconnaissance",
    description:
      "Immediate situational awareness probing conducted by the operator through an interactive Windows command shell to establish user privileges and operating system build details.",
    subBranches: [
      {
        title: "User & Privilege Context",
        technique: "T1033 (System Owner/User Discovery)",
        telemetry: "Sysmon Event ID 1 (whoami.exe executed under cmd.exe)",
        detail:
          "Attacker identifies active user and group memberships to determine if privilege escalation is required.",
        splunk:
          'index=windows EventCode=1 Image="*\\\\whoami.exe" ParentImage="*\\\\cmd.exe"',
      },
      {
        title: "Host & OS Fingerprinting",
        technique: "T1082 (System Information Discovery)",
        telemetry: "Sysmon Event ID 1 (hostname.exe & systeminfo.exe)",
        detail:
          "Rapid execution of built-in system utilities within a 30-second window to inventory OS version and patch level.",
        splunk:
          'index=windows EventCode=1 Image IN ("*\\\\hostname.exe", "*\\\\systeminfo.exe")',
      },
    ],
  },
  {
    id: "phase-3",
    phaseNum: "03",
    title: "Persistence & Privilege Escalation",
    category: "Account & Scheduled Staging",
    description:
      "Creation of an elevated backdoor account and configuration of an automated Scheduled Task configured to run with NT AUTHORITY\\SYSTEM privileges at every user logon.",
    subBranches: [
      {
        title: "Local Administrator Backdoor",
        technique: "T1136.001 (Local Account) / T1098.007 (Local Groups)",
        telemetry: "Windows Security Events 4720 (User Created) & 4732 (Group Member Added)",
        detail:
          "Local user account created via net user and added to the local Administrators group for elevated access.",
        splunk:
          'index=windows (EventCode=4720 OR EventCode=4732) | table _time TargetUserName MemberName GroupName',
      },
      {
        title: "Elevated Scheduled Task",
        technique: "T1053.005 (Scheduled Task / Logon Trigger)",
        telemetry: "Windows Security Event 4698 (Task Created), Sysmon 1 (schtasks.exe)",
        detail:
          "System task registered with highest run-level under SYSTEM context to maintain persistent foothold across reboots.",
        splunk:
          'index=windows EventCode=4698 TaskName="*" | xmlkv | search UserId="*SYSTEM*"',
      },
    ],
  },
  {
    id: "phase-4",
    phaseNum: "04",
    title: "Ingress Tool Staging (LOLBIN)",
    category: "Tool Transfer & Evasion",
    description:
      "Transfer of secondary post-exploitation offensive tooling using legitimate native Windows utility certutil.exe, masquerading the payload as a benign executable.",
    subBranches: [
      {
        title: "certutil Download (LOLBIN)",
        technique: "T1105 (Ingress Tool Transfer)",
        telemetry: "Sysmon Event ID 1 (certutil.exe -urlcache -split -f)",
        detail:
          "Abuse of trusted certificate utility to download remote files, bypassing standard browser-based download controls.",
        splunk:
          'index=windows EventCode=1 Image="*\\\\certutil.exe" CommandLine="*-urlcache*" | table _time User CommandLine',
      },
      {
        title: "Payload Masquerading",
        technique: "T1036.005 (Masquerading: Match Legitimate Name)",
        telemetry: "Sysmon Event ID 11 (File Create: GetClaude.exe)",
        detail:
          "Downloaded Mimikatz 2.2.0 binary saved on disk as GetClaude.exe in user Downloads folder to evade surface suspicion.",
        splunk:
          'index=windows EventCode=11 TargetFilename="*\\\\GetClaude.exe" | table _time Image TargetFilename ProcessGuid',
      },
    ],
  },
  {
    id: "phase-5",
    phaseNum: "05",
    title: "Credential Access Preparation",
    category: "Credential Access",
    description:
      "Execution of the disguised binary and invocation of debug privileges to prepare for process memory access against the Local Security Authority Subsystem Service (LSASS).",
    subBranches: [
      {
        title: "Mimikatz Privilege Debug",
        technique: "T1003 (OS Credential Dumping)",
        telemetry: "Sysmon Event ID 1 (GetClaude.exe with privilege::debug command)",
        detail:
          "Execution returns Privilege 20 OK, successfully enabling SeDebugPrivilege required for memory extraction.",
        splunk:
          'index=windows EventCode=1 (Image="*\\\\GetClaude.exe" OR CommandLine="*privilege::debug*")',
      },
      {
        title: "LSASS Access Hunting",
        technique: "T1003.001 (LSASS Memory Hunting)",
        telemetry: "Sysmon Event ID 10 (Process Access targeting lsass.exe)",
        detail:
          "SOC hunt logic tracking granted access masks (0x1010, 0x1FFFFF) requesting handles to lsass.exe process memory.",
        splunk:
          'index=windows EventCode=10 TargetImage="*\\\\lsass.exe" GrantedAccess="*0x1010*" | table _time SourceImage GrantedAccess',
      },
    ],
  },
  {
    id: "phase-6",
    phaseNum: "06",
    title: "SIEM Correlation & Detection",
    category: "SOC Detection & Response",
    description:
      "Centralized log ingestion and correlation in Splunk Enterprise across Sysmon ProcessGuid and Windows Security audit events, delivering Sigma rules and ATT&CK Navigator mapping.",
    subBranches: [
      {
        title: "Multi-Source Log Correlation",
        technique: "Correlated Telemetry Across ProcessGuid",
        telemetry: "Sysmon (1, 3, 11, 10) + Windows Events (4688, 4720, 4732, 4698)",
        detail:
          "Reconstruction of the entire multi-stage compromise timeline using Splunk transaction searches across ProcessGuid.",
        splunk:
          'index=windows | transaction ProcessGuid maxspan=2h | table _time host Image CommandLine EventCode',
      },
      {
        title: "Sigma Rules & MITRE Layer",
        technique: "SigmaHQ Standard & ATT&CK Navigator JSON",
        telemetry: "Production SPL Detection Alerts",
        detail:
          "Authored detection logic formalizing scheduled task privilege abuse and certutil ingress into actionable SOC alerts.",
        splunk:
          'index=windows (EventCode=1 CommandLine="*privilege*") OR EventCode=4698 | table _time host User CommandLine',
      },
    ],
  },
];

export default function AttackTreeMap() {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>("phase-1");
  const [selectedBranchIdx, setSelectedBranchIdx] = useState<number>(0);
  const [copiedQuery, setCopiedQuery] = useState<boolean>(false);

  const currentPhase =
    treePhases.find((p) => p.id === selectedPhaseId) || treePhases[0];
  const currentBranch =
    currentPhase.subBranches[selectedBranchIdx] || currentPhase.subBranches[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  return (
    <div className="bg-card/60 border border-primary/25 rounded-2xl p-5 md:p-7 relative overflow-hidden backdrop-blur-md shadow-[0_0_40px_rgba(255,107,53,0.06)]">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -ml-20 -mb-20" />

      {/* Top Header & Overview */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-6 border-b border-foreground/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/25 inline-flex items-center gap-1.5">
              <ShieldAlert size={13} />
              Featured Threat Simulation
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Simulation 1 Completed
            </span>
            <span className="text-xs text-muted-foreground bg-foreground/5 px-2.5 py-0.5 rounded-full border border-foreground/10">
              Splunk Enterprise 10.x · Sysmon · MITRE ATT&CK
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-foreground tracking-tight leading-snug">
            SOC Threat Detection Analysis Simulation: Endpoint Compromise & Log Correlation
          </h3>

          <p className="text-xs sm:text-sm text-primary/80 font-medium mt-1.5">
            Kali Linux (Attacker) <span className="text-muted-foreground/50">→</span> Windows 10 (Sysmon Endpoint) <span className="text-muted-foreground/50">→</span> Windows 11 (Splunk SIEM)
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

      {/* Narrative Scope */}
      <div className="py-4 text-xs sm:text-sm text-muted-foreground leading-relaxed relative z-10 border-b border-foreground/8">
        <p className="text-left sm:text-justify">
          An end-to-end hands-on Security Operations Center (SOC) threat detection simulation and digital forensics &
          incident response (DFIR) investigation. Reconstructs a controlled multi-stage Windows endpoint intrusion from
          initial payload delivery and reverse HTTP Meterpreter C2 through local reconnaissance, privilege escalation,
          elevated scheduled-task persistence, ingress tool transfer via certutil, and Mimikatz credential-access
          preparation. Endpoint telemetry was ingested and correlated in Splunk Enterprise across Sysmon events and
          Windows Security logs, mapped against the MITRE ATT&CK framework, and formalized into actionable Sigma detection
          rules and Splunk SPL hunt alerts.
        </p>
      </div>

      {/* Cyber Kill Chain Tree Map Section */}
      <div className="pt-6 relative z-10">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <Terminal size={14} />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">
                Attack & Investigation Tree Map
              </span>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Select a stage node to inspect its branching techniques, telemetry, and hunt logic
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
            Interactive Tree
          </span>
        </div>

        {/* Tree Layout: Left Branches & Right Detail Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Visual Branch Nodes (like the mind map screenshot) */}
          <div className="lg:col-span-6 bg-background/50 border border-foreground/8 rounded-xl p-3.5 sm:p-4 space-y-3">
            {treePhases.map((phase) => {
              const isPhaseSelected = selectedPhaseId === phase.id;

              return (
                <div key={phase.id} className="relative">
                  {/* Parent Phase Node */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPhaseId(phase.id);
                      setSelectedBranchIdx(0);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all duration-200 group ${
                      isPhaseSelected
                        ? "bg-primary/15 border-primary/60 text-primary shadow-[0_0_15px_rgba(255,107,53,0.15)]"
                        : "bg-foreground/[0.02] border-foreground/8 hover:border-primary/30 hover:bg-foreground/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Circle port node like mind map */}
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isPhaseSelected
                            ? "border-primary bg-primary/30 shadow-[0_0_8px_rgba(255,107,53,0.6)]"
                            : "border-foreground/30 bg-background group-hover:border-primary/50"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isPhaseSelected ? "bg-primary" : "bg-transparent"
                          }`}
                        />
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                              isPhaseSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-foreground/10 text-muted-foreground"
                            }`}
                          >
                            Phase {phase.phaseNum}
                          </span>
                          <span className="text-xs font-bold truncate text-foreground group-hover:text-primary transition-colors">
                            {phase.title}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      size={14}
                      className={`shrink-0 transition-transform duration-200 ${
                        isPhaseSelected
                          ? "text-primary rotate-90"
                          : "text-muted-foreground/50 group-hover:text-primary"
                      }`}
                    />
                  </button>

                  {/* Sub-branches with curved connecting lines */}
                  {isPhaseSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-5 pl-4 sm:pl-5 my-2 space-y-2 relative"
                    >
                      {/* SVG Curved Branch Lines */}
                      <svg
                        className="absolute left-0 top-0 h-full w-5 pointer-events-none stroke-primary/40 fill-none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d={`M 0 0 C 0 20, 8 20, 16 20`}
                          strokeWidth="1.5"
                        />
                        {phase.subBranches.length > 1 && (
                          <path
                            d={`M 0 0 C 0 55, 8 55, 16 55`}
                            strokeWidth="1.5"
                          />
                        )}
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2={phase.subBranches.length > 1 ? 55 : 20}
                          strokeWidth="1.5"
                        />
                      </svg>

                      {phase.subBranches.map((branch, bIdx) => {
                        const isBranchSelected = selectedBranchIdx === bIdx;

                        return (
                          <button
                            key={bIdx}
                            type="button"
                            onClick={() => setSelectedBranchIdx(bIdx)}
                            className={`w-full flex items-center justify-between p-2 rounded-lg border text-left text-xs transition-all duration-150 ${
                              isBranchSelected
                                ? "bg-primary/20 border-primary/70 text-foreground font-semibold shadow-sm"
                                : "bg-foreground/[0.03] border-foreground/6 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {/* Sub-node circle dot */}
                              <span
                                className={`w-3 h-3 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  isBranchSelected
                                    ? "border-primary bg-primary/40 shadow-[0_0_6px_rgba(255,107,53,0.5)]"
                                    : "border-foreground/30 bg-background"
                                }`}
                              >
                                <span
                                  className={`w-1 h-1 rounded-full ${
                                    isBranchSelected ? "bg-primary" : "bg-transparent"
                                  }`}
                                />
                              </span>
                              <span className="truncate">{branch.title}</span>
                            </div>
                            <span className="text-[10px] font-mono text-primary/80 shrink-0 ml-2 hidden sm:inline">
                              {branch.technique.split(" ")[0]}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Structured, Organized Detailed Breakdown */}
          <div className="lg:col-span-6 bg-background/70 border border-primary/25 rounded-xl p-4 sm:p-5 relative shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-foreground/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/25 px-2 py-0.5 rounded">
                  Phase {currentPhase.phaseNum}
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {currentBranch.title}
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                {currentPhase.category}
              </span>
            </div>

            {/* Objective & Action */}
            <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground block mb-1">
                  Adversary Action & Objective
                </span>
                <p className="bg-foreground/[0.02] p-2.5 rounded-lg border border-foreground/6 text-foreground/90 font-mono text-xs">
                  {currentBranch.detail}
                </p>
              </div>

              {/* MITRE ATT&CK Technique */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="bg-primary/5 p-2.5 rounded-lg border border-primary/15">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-1">
                    MITRE ATT&CK Technique
                  </span>
                  <span className="font-mono text-xs text-foreground font-semibold">
                    {currentBranch.technique}
                  </span>
                </div>

                <div className="bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/15">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    Observed Telemetry Sources
                  </span>
                  <span className="font-mono text-[11px] text-foreground/90 block leading-tight">
                    {currentBranch.telemetry}
                  </span>
                </div>
              </div>

              {/* Splunk Hunt Query */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal size={12} />
                    Splunk SPL Threat Hunt Query
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(currentBranch.splunk)}
                    className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 px-2 py-0.5 rounded bg-foreground/5 hover:bg-foreground/10 border border-foreground/10"
                  >
                    {copiedQuery ? (
                      <>
                        <Check size={11} className="text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy Query</span>
                      </>
                    )}
                  </button>
                </div>
                <code className="block font-mono text-[11px] text-primary/95 bg-black/60 p-2.5 rounded-lg border border-primary/20 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {currentBranch.splunk}
                </code>
              </div>
            </div>

            {/* Bottom mini-summary */}
            <div className="mt-4 pt-3 border-t border-foreground/8 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Investigation Stage: {currentPhase.phaseNum} of 06</span>
              <span className="text-primary font-medium">Splunk SIEM Correlation</span>
            </div>
          </div>
        </div>

        {/* Tags */}
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
            "LSASS Access",
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
