// ============================================================================
// CYBER SECURITY PART 1: CYBERSECURITY FOUNDATIONS & COMPUTING ARCHITECTURE
// Sections 1.1 to 1.5, each with exactly 6 compulsory MCQs + 6 reset MCQs
// Passing score strictly > 80% (5 or 6 out of 6 correct)
// ============================================================================

export interface McqOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
  explanationIfWrong?: string;
  wrong?: string;
}

export interface McqQuestion {
  id?: string;
  question: string;
  options: McqOption[];
  correctAnswer: string;
  explanationNote: string;
}

export interface TheoryBlock {
  heading: string;
  text: string;
  codeSnippet?: string;
  terminalOutput?: string;
  tip?: string;
  warning?: string;
  sampleInput?: string;
  mcq?: McqQuestion;
  retestMcq?: McqQuestion;
  questionPool?: McqQuestion[];
}

export interface SectionContent {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  readTime: string;
  objectives: string[];
  theoryBlocks: TheoryBlock[];
}

export const PART_1_SECTIONS: SectionContent[] = [
  {
    "id": "1-1-overview",
    "number": "1.1",
    "title": "Overview of Cyber Security & Threat Landscape",
    "subtitle": "Understand cyberspace domains, modern threat vectors, attacker profiles, and defensive postures.",
    "readTime": "15 min",
    "objectives": [
      "Understand core principles of Overview of Cyber Security & Threat Landscape",
      "Analyze tactical threat vectors and attack surfaces in 1.1",
      "Execute terminal commands and inspection scripts in the security environment",
      "Implement industry standard hardening and defensive controls",
      "Validate security posture through automated testing and logging",
      "Ensure compliance with enterprise policy and risk frameworks"
    ],
    "theoryBlocks": [
      {
        "heading": "Cyberspace & Attack Surfaces",
        "text": "Cyberspace comprises interconnected networks, computational devices, and cloud infrastructure. Any externally exposed interface, misconfigured port, or unauthenticated endpoint expands an organization's attack surface.",
        "codeSnippet": "netstat -tulnp | grep LISTEN",
        "terminalOutput": "tcp 0 0 0.0.0.0:443 LISTEN 1240/nginx\ntcp 0 0 0.0.0.0:22 LISTEN 890/sshd",
        "mcq": {
          "id": "q-1.1-0-compulsory",
          "question": "Which factor directly increases an enterprise's external attack surface?",
          "options": [
            {
              "id": "A",
              "text": "Exposing unauthenticated internal management ports directly to the internet",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Enforcing multi-factor authentication on all administrative accounts",
              "explanationIfWrong": "Incorrect: Exposed public ports provide entry vectors for remote adversaries."
            },
            {
              "id": "C",
              "text": "Disabling unneeded legacy services across border firewalls",
              "explanationIfWrong": "Incorrect: Exposed public ports provide entry vectors for remote adversaries."
            },
            {
              "id": "D",
              "text": "Isolating operational database servers inside private subnets",
              "explanationIfWrong": "Incorrect: Exposed public ports provide entry vectors for remote adversaries."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Exposed public ports provide entry vectors for remote adversaries."
        },
        "retestMcq": {
          "id": "q-1.1-0-reset",
          "question": "When assessing enterprise attack surfaces, what is the primary defensive goal?",
          "options": [
            {
              "id": "A",
              "text": "Deploying public SSH ports with default root credentials",
              "explanationIfWrong": "Incorrect: Reducing exposed services shrinks vulnerable attack vectors."
            },
            {
              "id": "B",
              "text": "Opening all firewall ports to accelerate network throughput",
              "explanationIfWrong": "Incorrect: Reducing exposed services shrinks vulnerable attack vectors."
            },
            {
              "id": "C",
              "text": "Minimizing internet-exposed listening services and unused endpoints",
              "explanationIfWrong": ""
            },
            {
              "id": "D",
              "text": "Disabling endpoint logging to improve server processing speed",
              "explanationIfWrong": "Incorrect: Reducing exposed services shrinks vulnerable attack vectors."
            }
          ],
          "correctAnswer": "C",
          "explanationNote": "Reducing exposed services shrinks vulnerable attack vectors."
        }
      },
      {
        "heading": "Threat Actor Classifications",
        "text": "Threat actors range from opportunistic script kiddies and hacktivists to organized cybercriminal cartels and Advanced Persistent Threats (APTs). APTs operate with state-sponsored backing, stealth, and prolonged operational focus.",
        "codeSnippet": "cat /var/log/auth.log | grep 'Failed password' | head -n 2",
        "terminalOutput": "Oct 14 03:12:01 sshd: Failed password for admin from 198.51.100.24",
        "mcq": {
          "id": "q-1.1-1-compulsory",
          "question": "Which characteristic primarily distinguishes an Advanced Persistent Threat (APT)?",
          "options": [
            {
              "id": "A",
              "text": "Exclusive reliance on publicly available automated scanning scripts",
              "explanationIfWrong": "Incorrect: APTs target high-value assets using custom zero-days and stealth persistence."
            },
            {
              "id": "B",
              "text": "Long-term persistence, high sophistication, and customized evasion capabilities",
              "explanationIfWrong": ""
            },
            {
              "id": "C",
              "text": "Publicly defacing websites for immediate personal bragging rights",
              "explanationIfWrong": "Incorrect: APTs target high-value assets using custom zero-days and stealth persistence."
            },
            {
              "id": "D",
              "text": "Conducting indiscriminate port scans against random IP blocks",
              "explanationIfWrong": "Incorrect: APTs target high-value assets using custom zero-days and stealth persistence."
            }
          ],
          "correctAnswer": "B",
          "explanationNote": "APTs target high-value assets using custom zero-days and stealth persistence."
        },
        "retestMcq": {
          "id": "q-1.1-1-reset",
          "question": "Why do nation-state threat actors typically maintain long-term covert persistence?",
          "options": [
            {
              "id": "A",
              "text": "To immediately shut down client operating systems for disruption",
              "explanationIfWrong": "Incorrect: Strategic persistence allows covert intelligence gathering over months or years."
            },
            {
              "id": "B",
              "text": "To request small cryptocurrency payments via defaced landing pages",
              "explanationIfWrong": "Incorrect: Strategic persistence allows covert intelligence gathering over months or years."
            },
            {
              "id": "C",
              "text": "To benchmark the upload speeds of compromised enterprise routers",
              "explanationIfWrong": "Incorrect: Strategic persistence allows covert intelligence gathering over months or years."
            },
            {
              "id": "D",
              "text": "To conduct ongoing strategic espionage and exfiltrate proprietary intelligence",
              "explanationIfWrong": ""
            }
          ],
          "correctAnswer": "D",
          "explanationNote": "Strategic persistence allows covert intelligence gathering over months or years."
        }
      },
      {
        "heading": "Defense-in-Depth Architecture",
        "text": "Defense-in-depth deploys layered security controls across physical, perimeter, network, host, application, and data tiers. If any single control fails, supplementary layers prevent or delay systemic compromise.",
        "codeSnippet": "iptables -L -n -v --line-numbers",
        "terminalOutput": "1 ACCEPT all state RELATED,ESTABLISHED\n2 DROP tcp tcp dpt:23",
        "mcq": {
          "id": "q-1.1-2-compulsory",
          "question": "What is the foundational principle of a defense-in-depth strategy?",
          "options": [
            {
              "id": "A",
              "text": "Relying exclusively on an enterprise perimeter firewall for all system defense",
              "explanationIfWrong": "Incorrect: Layered controls provide resilience when individual controls fail."
            },
            {
              "id": "B",
              "text": "Consolidating all security mechanisms into a single perimeter gateway",
              "explanationIfWrong": "Incorrect: Layered controls provide resilience when individual controls fail."
            },
            {
              "id": "C",
              "text": "Deploying multiple independent protective layers so no single point of failure compromises the system",
              "explanationIfWrong": ""
            },
            {
              "id": "D",
              "text": "Trusting all internal network traffic once packets pass edge filtering",
              "explanationIfWrong": "Incorrect: Layered controls provide resilience when individual controls fail."
            }
          ],
          "correctAnswer": "C",
          "explanationNote": "Layered controls provide resilience when individual controls fail."
        },
        "retestMcq": {
          "id": "q-1.1-2-reset",
          "question": "Which scenario represents a failure of defense-in-depth?",
          "options": [
            {
              "id": "A",
              "text": "An attacker who bypasses the firewall gains unrestricted access because internal servers lack host firewalls and authentication",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "A perimeter firewall drops unauthorized incoming SYN packets",
              "explanationIfWrong": "Incorrect: Absence of internal controls allows total compromise upon perimeter breach."
            },
            {
              "id": "C",
              "text": "An intrusion detection system flags lateral movement across internal subnets",
              "explanationIfWrong": "Incorrect: Absence of internal controls allows total compromise upon perimeter breach."
            },
            {
              "id": "D",
              "text": "A host endpoint antivirus quarantines a malicious downloaded binary",
              "explanationIfWrong": "Incorrect: Absence of internal controls allows total compromise upon perimeter breach."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Absence of internal controls allows total compromise upon perimeter breach."
        }
      },
      {
        "heading": "Vulnerability, Threat, and Risk Mechanics",
        "text": "Risk is the potential for loss when a threat exploits an underlying vulnerability in an asset. Mathematically, Risk is calculated as a function of Threat Likelihood multiplied by Asset Impact.",
        "codeSnippet": "python3 -c 'threat, vuln, asset = 0.8, 0.7, 100000; print(f\"ALE: ${threat*vuln*asset:,.2f}\")'",
        "terminalOutput": "ALE: $56,000.00",
        "mcq": {
          "id": "q-1.1-3-compulsory",
          "question": "How does security engineering define the relationship between a threat and a vulnerability?",
          "options": [
            {
              "id": "A",
              "text": "Threats and vulnerabilities are identical operational terms with no distinction",
              "explanationIfWrong": "Incorrect: A threat exploits a vulnerability to cause loss to an asset."
            },
            {
              "id": "B",
              "text": "A vulnerability actively attacks systems, while a threat is a passive hardware defect",
              "explanationIfWrong": "Incorrect: A threat exploits a vulnerability to cause loss to an asset."
            },
            {
              "id": "C",
              "text": "Vulnerabilities can only originate from physical human errors, never software bugs",
              "explanationIfWrong": "Incorrect: A threat exploits a vulnerability to cause loss to an asset."
            },
            {
              "id": "D",
              "text": "A threat represents a potential danger, whereas a vulnerability is an exploitable flaw in an asset",
              "explanationIfWrong": ""
            }
          ],
          "correctAnswer": "D",
          "explanationNote": "A threat exploits a vulnerability to cause loss to an asset."
        },
        "retestMcq": {
          "id": "q-1.1-3-reset",
          "question": "If a server has a known zero-day flaw but is completely air-gapped with no physical or network access paths, how is the immediate risk characterized?",
          "options": [
            {
              "id": "A",
              "text": "Critical immediate risk requiring complete physical destruction of the hardware",
              "explanationIfWrong": "Incorrect: Without an accessible threat vector, likelihood drops to near zero."
            },
            {
              "id": "B",
              "text": "Low operational risk due to lack of threat exposure and zero accessible attack vector",
              "explanationIfWrong": ""
            },
            {
              "id": "C",
              "text": "Extreme risk identical to a public internet-facing production web server",
              "explanationIfWrong": "Incorrect: Without an accessible threat vector, likelihood drops to near zero."
            },
            {
              "id": "D",
              "text": "Infinite risk that overrides all network isolation controls",
              "explanationIfWrong": "Incorrect: Without an accessible threat vector, likelihood drops to near zero."
            }
          ],
          "correctAnswer": "B",
          "explanationNote": "Without an accessible threat vector, likelihood drops to near zero."
        }
      },
      {
        "heading": "Security Operations Center (SOC) Functions",
        "text": "A Security Operations Center (SOC) monitors, detects, and responds to cybersecurity events using SIEM platforms and telemetry feeds. SOC analysts triage alerts across Tier 1 (triage), Tier 2 (incident analysis), and Tier 3 (threat hunting).",
        "codeSnippet": "grep -i 'alert' /var/log/suricata/fast.log | tail -n 2",
        "terminalOutput": "10/14-04:22:11 [**] ET ATTACK_RESPONSE Metasploit Meterpreter Reverse TCP [**] [Priority: 1]",
        "mcq": {
          "id": "q-1.1-4-compulsory",
          "question": "What is the primary operational duty of a Tier 1 SOC Analyst?",
          "options": [
            {
              "id": "A",
              "text": "Writing custom firmware kernels for edge networking appliances",
              "explanationIfWrong": "Incorrect: Tier 1 analysts triage incoming telemetry and escalate actionable security incidents."
            },
            {
              "id": "B",
              "text": "Monitoring live SIEM dashboards, validating initial alerts, and escalating verified incidents",
              "explanationIfWrong": ""
            },
            {
              "id": "C",
              "text": "Conducting physical pen-testing against customer server rooms",
              "explanationIfWrong": "Incorrect: Tier 1 analysts triage incoming telemetry and escalate actionable security incidents."
            },
            {
              "id": "D",
              "text": "Negotiating extortion demands directly with criminal ransomware gangs",
              "explanationIfWrong": "Incorrect: Tier 1 analysts triage incoming telemetry and escalate actionable security incidents."
            }
          ],
          "correctAnswer": "B",
          "explanationNote": "Tier 1 analysts triage incoming telemetry and escalate actionable security incidents."
        },
        "retestMcq": {
          "id": "q-1.1-4-reset",
          "question": "Which telemetry source is most critical for detecting lateral movement inside a corporate network?",
          "options": [
            {
              "id": "A",
              "text": "External marketing website visitor counters and public analytics",
              "explanationIfWrong": "Incorrect: Internal authentication and host telemetry reveal unauthorized lateral pivoting."
            },
            {
              "id": "B",
              "text": "Printer spooler toner levels and page counters",
              "explanationIfWrong": "Incorrect: Internal authentication and host telemetry reveal unauthorized lateral pivoting."
            },
            {
              "id": "C",
              "text": "Public DNS registrar whois expiration records",
              "explanationIfWrong": "Incorrect: Internal authentication and host telemetry reveal unauthorized lateral pivoting."
            },
            {
              "id": "D",
              "text": "Internal switch flow logs, Windows event logs (4624/4625), and endpoint EDR telemetry",
              "explanationIfWrong": ""
            }
          ],
          "correctAnswer": "D",
          "explanationNote": "Internal authentication and host telemetry reveal unauthorized lateral pivoting."
        }
      },
      {
        "heading": "Cyber Threat Intelligence (CTI) & Diamond Model",
        "text": "Cyber Threat Intelligence provides structured information about adversarial capabilities, infrastructure, and intent. The Diamond Model frames malicious events across four core vertices: Adversary, Capability, Infrastructure, and Victim.",
        "codeSnippet": "curl -s https://rules.emergingthreats.net/open/suricata/rules/compromised-ips.txt | head -n 3",
        "terminalOutput": "198.51.100.14\n203.0.113.88\n192.0.2.201",
        "mcq": {
          "id": "q-1.1-5-compulsory",
          "question": "What are the four core vertices of the Diamond Model of Intrusion Analysis?",
          "options": [
            {
              "id": "A",
              "text": "Firewall, Antivirus, Intrusion Detection, and Honeypot",
              "explanationIfWrong": "Incorrect: The Diamond Model establishes relationships between adversary, capability, infrastructure, and victim."
            },
            {
              "id": "B",
              "text": "Confidentiality, Integrity, Availability, and Non-Repudiation",
              "explanationIfWrong": "Incorrect: The Diamond Model establishes relationships between adversary, capability, infrastructure, and victim."
            },
            {
              "id": "C",
              "text": "Adversary, Capability, Infrastructure, and Victim",
              "explanationIfWrong": ""
            },
            {
              "id": "D",
              "text": "Source IP, Destination IP, Port, and Protocol",
              "explanationIfWrong": "Incorrect: The Diamond Model establishes relationships between adversary, capability, infrastructure, and victim."
            }
          ],
          "correctAnswer": "C",
          "explanationNote": "The Diamond Model establishes relationships between adversary, capability, infrastructure, and victim."
        },
        "retestMcq": {
          "id": "q-1.1-5-reset",
          "question": "How does Strategic Threat Intelligence differ from Tactical Threat Intelligence?",
          "options": [
            {
              "id": "A",
              "text": "Strategic CTI informs executive decision-makers on geopolitical threat trends, while tactical CTI provides IOCs for security controls",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Strategic CTI contains only raw binary hashes for automated firewalls",
              "explanationIfWrong": "Incorrect: Strategic CTI guides long-term risk strategy, whereas tactical CTI delivers technical IOCs."
            },
            {
              "id": "C",
              "text": "Tactical CTI is exclusively written for corporate board members",
              "explanationIfWrong": "Incorrect: Strategic CTI guides long-term risk strategy, whereas tactical CTI delivers technical IOCs."
            },
            {
              "id": "D",
              "text": "Strategic CTI is strictly generated by automated antivirus software",
              "explanationIfWrong": "Incorrect: Strategic CTI guides long-term risk strategy, whereas tactical CTI delivers technical IOCs."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Strategic CTI guides long-term risk strategy, whereas tactical CTI delivers technical IOCs."
        }
      }
    ]
  },
  {
    "id": "1-2-fundamentals",
    "number": "1.2",
    "title": "Cybersecurity Fundamentals & The CIA Triad",
    "subtitle": "Master the CIA Triad, authenticity, non-repudiation, and foundational security doctrines.",
    "readTime": "15 min",
    "objectives": [
      "Understand core principles of Cybersecurity Fundamentals & The CIA Triad",
      "Analyze tactical threat vectors and attack surfaces in 1.2",
      "Execute terminal commands and inspection scripts in the security environment",
      "Implement industry standard hardening and defensive controls",
      "Validate security posture through automated testing and logging",
      "Ensure compliance with enterprise policy and risk frameworks"
    ],
    "theoryBlocks": [
      {
        "heading": "The CIA Triad Doctrine",
        "text": "The CIA Triad—Confidentiality, Integrity, and Availability—is the cornerstone model for securing information systems. Security controls must maintain balance among all three principles without excessively crippling operational usability.",
        "codeSnippet": "chmod 600 /etc/shadow && sha256sum /etc/shadow",
        "terminalOutput": "600 /etc/shadow\n8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4  /etc/shadow",
        "mcq": {
          "id": "q-1.2-0-compulsory",
          "question": "Which security incident directly violates the Integrity principle of the CIA Triad?",
          "options": [
            {
              "id": "A",
              "text": "An unauthorized attacker modifies payroll account numbers in a financial database",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "A distributed denial of service flood renders a public e-commerce store unreachable",
              "explanationIfWrong": "Incorrect: Unauthorized data modification represents a direct breach of data integrity."
            },
            {
              "id": "C",
              "text": "An unauthorized guest reads sensitive salary documents stored on a file share",
              "explanationIfWrong": "Incorrect: Unauthorized data modification represents a direct breach of data integrity."
            },
            {
              "id": "D",
              "text": "A power outage temporarily shuts down an offline air-gapped backup server",
              "explanationIfWrong": "Incorrect: Unauthorized data modification represents a direct breach of data integrity."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Unauthorized data modification represents a direct breach of data integrity."
        },
        "retestMcq": {
          "id": "q-1.2-0-reset",
          "question": "A ransomware attack encrypts production database drives so users cannot view records. Which CIA principle is primarily impacted?",
          "options": [
            {
              "id": "A",
              "text": "Confidentiality (the attacker publicly leaks all database tables)",
              "explanationIfWrong": "Incorrect: Ransomware encryption disrupts resource availability for authorized business workflows."
            },
            {
              "id": "B",
              "text": "Non-repudiation (users deny sending email transactions)",
              "explanationIfWrong": "Incorrect: Ransomware encryption disrupts resource availability for authorized business workflows."
            },
            {
              "id": "C",
              "text": "Availability (authorized users are prevented from accessing system resources)",
              "explanationIfWrong": ""
            },
            {
              "id": "D",
              "text": "Authenticity (signatures on software drivers are validated)",
              "explanationIfWrong": "Incorrect: Ransomware encryption disrupts resource availability for authorized business workflows."
            }
          ],
          "correctAnswer": "C",
          "explanationNote": "Ransomware encryption disrupts resource availability for authorized business workflows."
        }
      },
      {
        "heading": "Authenticity & Non-Repudiation",
        "text": "Authenticity guarantees that data or communications originate from their claimed source. Non-repudiation ensures that a sender cannot deny having performed a transaction or authored a message, enforced via asymmetric digital signatures.",
        "codeSnippet": "openssl dgst -sha256 -verify pubkey.pem -signature doc.sig document.pdf",
        "terminalOutput": "Verified OK",
        "mcq": {
          "id": "q-1.2-1-compulsory",
          "question": "Which cryptographic mechanism provides undeniable Non-Repudiation for electronic transactions?",
          "options": [
            {
              "id": "A",
              "text": "Symmetric encryption with a shared AES key known to both parties",
              "explanationIfWrong": "Incorrect: Only private key signatures guarantee the sender uniquely generated the signature."
            },
            {
              "id": "B",
              "text": "Asymmetric digital signatures using the sender's private key",
              "explanationIfWrong": ""
            },
            {
              "id": "C",
              "text": "Calculating an unkeyed MD5 checksum of the transaction data",
              "explanationIfWrong": "Incorrect: Only private key signatures guarantee the sender uniquely generated the signature."
            },
            {
              "id": "D",
              "text": "Encoding the transaction message using Base64 ASCII encoding",
              "explanationIfWrong": "Incorrect: Only private key signatures guarantee the sender uniquely generated the signature."
            }
          ],
          "correctAnswer": "B",
          "explanationNote": "Only private key signatures guarantee the sender uniquely generated the signature."
        },
        "retestMcq": {
          "id": "q-1.2-1-reset",
          "question": "Why can shared symmetric encryption NEVER provide non-repudiation between two communicating parties?",
          "options": [
            {
              "id": "A",
              "text": "Because symmetric algorithms are mathematically broken and cannot encrypt data",
              "explanationIfWrong": "Incorrect: Shared secrets prevent determining which of the two keyholders originated the message."
            },
            {
              "id": "B",
              "text": "Because symmetric keys require internet access to compute verification",
              "explanationIfWrong": "Incorrect: Shared secrets prevent determining which of the two keyholders originated the message."
            },
            {
              "id": "C",
              "text": "Because symmetric ciphers only work on audio files, not digital contracts",
              "explanationIfWrong": "Incorrect: Shared secrets prevent determining which of the two keyholders originated the message."
            },
            {
              "id": "D",
              "text": "Because both parties possess the identical secret key, so either party could have created the ciphertext",
              "explanationIfWrong": ""
            }
          ],
          "correctAnswer": "D",
          "explanationNote": "Shared secrets prevent determining which of the two keyholders originated the message."
        }
      },
      {
        "heading": "Principle of Least Privilege (PoLP)",
        "text": "The Principle of Least Privilege dictates that users, processes, and applications receive only the minimum access rights required to perform their explicit job functions. This curtails the blast radius of credential compromise.",
        "codeSnippet": "sudo -l -U auditor",
        "terminalOutput": "User auditor may run the following commands on edge: (ALL) /usr/bin/journalctl -u nginx",
        "mcq": {
          "id": "q-1.2-2-compulsory",
          "question": "Why is granting global Administrator or root rights to everyday user workstations considered poor security hygiene?",
          "options": [
            {
              "id": "A",
              "text": "It causes internet bandwidth to drop significantly on local subnets",
              "explanationIfWrong": "Incorrect: Malware inherits the privilege level of the running user context."
            },
            {
              "id": "B",
              "text": "It forces all installed software to operate in 16-bit compatibility mode",
              "explanationIfWrong": "Incorrect: Malware inherits the privilege level of the running user context."
            },
            {
              "id": "C",
              "text": "Any malware executed in the user's session inherits full administrative control over the entire operating system",
              "explanationIfWrong": ""
            },
            {
              "id": "D",
              "text": "It prevents the operating system from receiving routine security patches",
              "explanationIfWrong": "Incorrect: Malware inherits the privilege level of the running user context."
            }
          ],
          "correctAnswer": "C",
          "explanationNote": "Malware inherits the privilege level of the running user context."
        },
        "retestMcq": {
          "id": "q-1.2-2-reset",
          "question": "Under the Principle of Least Privilege, which permission should an automated web application service account have on its operational database?",
          "options": [
            {
              "id": "A",
              "text": "SELECT and INSERT permissions strictly restricted to required operational tables",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Full DROP DATABASE and ALTER SCHEMA rights across all databases",
              "explanationIfWrong": "Incorrect: Limiting service accounts to explicit CRUD permissions prevents catastrophic database destruction."
            },
            {
              "id": "C",
              "text": "Database superuser administrative rights with unrestricted access",
              "explanationIfWrong": "Incorrect: Limiting service accounts to explicit CRUD permissions prevents catastrophic database destruction."
            },
            {
              "id": "D",
              "text": "Direct root SSH terminal shell access to the underlying database host",
              "explanationIfWrong": "Incorrect: Limiting service accounts to explicit CRUD permissions prevents catastrophic database destruction."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Limiting service accounts to explicit CRUD permissions prevents catastrophic database destruction."
        }
      },
      {
        "heading": "Attack Vectors & Indicators of Compromise (IoC)",
        "text": "An attack vector is the specific path or means by which an adversary gains access to a computer or network. Indicators of Compromise (IoCs) are forensic digital artifacts—such as file hashes, IP addresses, and registry keys—that indicate a system breach.",
        "codeSnippet": "grep -E '(4624|4625)' /var/log/winevent.log | head -n 2",
        "terminalOutput": "EventID: 4625 User: Administrator Status: 0xC000006D SubStatus: 0xC000006A",
        "mcq": {
          "id": "q-1.2-3-compulsory",
          "question": "Which artifact is classified as a network-based Indicator of Compromise (IoC)?",
          "options": [
            {
              "id": "A",
              "text": "A user setting a new personal desktop wallpaper",
              "explanationIfWrong": "Incorrect: Unusual outbound connections to known adversary infrastructure represent network IoCs."
            },
            {
              "id": "B",
              "text": "An authorized developer committing tested code to a local repository",
              "explanationIfWrong": "Incorrect: Unusual outbound connections to known adversary infrastructure represent network IoCs."
            },
            {
              "id": "C",
              "text": "A routine scheduled Windows Update reboot occurring at 03:00 AM",
              "explanationIfWrong": "Incorrect: Unusual outbound connections to known adversary infrastructure represent network IoCs."
            },
            {
              "id": "D",
              "text": "An outbound connection from an internal workstation to a known C2 IP address on port 4444",
              "explanationIfWrong": ""
            }
          ],
          "correctAnswer": "D",
          "explanationNote": "Unusual outbound connections to known adversary infrastructure represent network IoCs."
        },
        "retestMcq": {
          "id": "q-1.2-3-reset",
          "question": "According to David Bianco's 'Pyramid of Pain', which Indicator of Compromise is the most painful and costly for an adversary to change?",
          "options": [
            {
              "id": "A",
              "text": "MD5 / SHA-256 file hashes",
              "explanationIfWrong": "Incorrect: TTPs represent behavioral tradecraft, requiring adversaries to reinvent their entire attack methodology."
            },
            {
              "id": "B",
              "text": "Tactics, Techniques, and Procedures (TTPs)",
              "explanationIfWrong": ""
            },
            {
              "id": "C",
              "text": "IPv4 network addresses",
              "explanationIfWrong": "Incorrect: TTPs represent behavioral tradecraft, requiring adversaries to reinvent their entire attack methodology."
            },
            {
              "id": "D",
              "text": "Domain names and dynamic DNS records",
              "explanationIfWrong": "Incorrect: TTPs represent behavioral tradecraft, requiring adversaries to reinvent their entire attack methodology."
            }
          ],
          "correctAnswer": "B",
          "explanationNote": "TTPs represent behavioral tradecraft, requiring adversaries to reinvent their entire attack methodology."
        }
      },
      {
        "heading": "Security Baselines & Configuration Hardening",
        "text": "Security baselines establish standardized, vetted configuration profiles for operating systems, hypervisors, and applications. Organizations harden systems according to established benchmarks, such as CIS Benchmarks and DISA STIGs.",
        "codeSnippet": "auditctl -l | head -n 2",
        "terminalOutput": "-w /etc/passwd -p wa -k identity\n-w /etc/shadow -p wa -k identity",
        "mcq": {
          "id": "q-1.2-4-compulsory",
          "question": "What is the primary benefit of deploying automated CIS (Center for Internet Security) Benchmarks across an enterprise?",
          "options": [
            {
              "id": "A",
              "text": "Guaranteeing 100% immunity against all future zero-day vulnerabilities",
              "explanationIfWrong": "Incorrect: CIS benchmarks provide systematically vetted configuration hardening to minimize default attack surfaces."
            },
            {
              "id": "B",
              "text": "Establishing a proven, repeatable configuration standard that eliminates common vulnerabilities and default exposures",
              "explanationIfWrong": ""
            },
            {
              "id": "C",
              "text": "Eliminating the need to purchase perimeter firewalls or endpoint antivirus software",
              "explanationIfWrong": "Incorrect: CIS benchmarks provide systematically vetted configuration hardening to minimize default attack surfaces."
            },
            {
              "id": "D",
              "text": "Allowing servers to run without installing operating system security updates",
              "explanationIfWrong": "Incorrect: CIS benchmarks provide systematically vetted configuration hardening to minimize default attack surfaces."
            }
          ],
          "correctAnswer": "B",
          "explanationNote": "CIS benchmarks provide systematically vetted configuration hardening to minimize default attack surfaces."
        },
        "retestMcq": {
          "id": "q-1.2-4-reset",
          "question": "Which setting represents a critical hardening step on a production Linux server?",
          "options": [
            {
              "id": "A",
              "text": "Enabling telnet server daemon on port 23 for administrative convenience",
              "explanationIfWrong": "Incorrect: Disabling remote root login forces accountability through named administrative accounts."
            },
            {
              "id": "B",
              "text": "Setting file permissions on /etc/shadow to world-readable (chmod 777)",
              "explanationIfWrong": "Incorrect: Disabling remote root login forces accountability through named administrative accounts."
            },
            {
              "id": "C",
              "text": "Disabling kernel SELinux / AppArmor enforcement permanently",
              "explanationIfWrong": "Incorrect: Disabling remote root login forces accountability through named administrative accounts."
            },
            {
              "id": "D",
              "text": "Disabling direct SSH root login (PermitRootLogin no) and requiring public key authentication",
              "explanationIfWrong": ""
            }
          ],
          "correctAnswer": "D",
          "explanationNote": "Disabling remote root login forces accountability through named administrative accounts."
        }
      },
      {
        "heading": "Cryptographic Verification & Hashes",
        "text": "A cryptographic hash function computes a deterministic, fixed-size output (digest) from arbitrary-length input data. Hashes possess one-way pre-image resistance and collision resistance, making them ideal for integrity verification.",
        "codeSnippet": "sha256sum setup.iso",
        "terminalOutput": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  setup.iso",
        "mcq": {
          "id": "q-1.2-5-compulsory",
          "question": "Which mathematical property of cryptographic hashes ensures that changing even a single bit of input completely changes the output digest?",
          "options": [
            {
              "id": "A",
              "text": "Symmetric transposition",
              "explanationIfWrong": "Incorrect: The avalanche effect ensures minor input variations produce drastically unpredictable digests."
            },
            {
              "id": "B",
              "text": "Linear cryptanalysis",
              "explanationIfWrong": "Incorrect: The avalanche effect ensures minor input variations produce drastically unpredictable digests."
            },
            {
              "id": "C",
              "text": "The Avalanche Effect",
              "explanationIfWrong": ""
            },
            {
              "id": "D",
              "text": "Homomorphic multiplication",
              "explanationIfWrong": "Incorrect: The avalanche effect ensures minor input variations produce drastically unpredictable digests."
            }
          ],
          "correctAnswer": "C",
          "explanationNote": "The avalanche effect ensures minor input variations produce drastically unpredictable digests."
        },
        "retestMcq": {
          "id": "q-1.2-5-reset",
          "question": "If an attacker tampers with a software installer by injecting a Trojan, how can a network administrator mathematically detect the tampering prior to execution?",
          "options": [
            {
              "id": "A",
              "text": "By comparing the computed SHA-256 hash of the downloaded file against the vendor's published cryptographic digest",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "By renaming the file extension from .exe to .txt and opening it in Notepad",
              "explanationIfWrong": "Incorrect: Cryptographic hash mismatch immediately exposes unauthorized binary modifications."
            },
            {
              "id": "C",
              "text": "By measuring the exact time taken to download the installer over HTTP",
              "explanationIfWrong": "Incorrect: Cryptographic hash mismatch immediately exposes unauthorized binary modifications."
            },
            {
              "id": "D",
              "text": "By checking if the file icon matches standard corporate desktop colors",
              "explanationIfWrong": "Incorrect: Cryptographic hash mismatch immediately exposes unauthorized binary modifications."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Cryptographic hash mismatch immediately exposes unauthorized binary modifications."
        }
      }
    ]
  },
  {
    "id": "1-3-architecture",
    "number": "1.3",
    "title": "Enterprise Security Architecture & Frameworks",
    "subtitle": "Explore operating system security rings, memory protections, file permissions, and kernel hardening.",
    "readTime": "15 min",
    "objectives": [
      "Understand core principles of Enterprise Security Architecture & Frameworks",
      "Analyze tactical threat vectors and attack surfaces in 1.3",
      "Execute terminal commands and inspection scripts in the security environment",
      "Implement industry standard hardening and defensive controls",
      "Validate security posture through automated testing and logging",
      "Ensure compliance with enterprise policy and risk frameworks"
    ],
    "theoryBlocks": [
      {
        "heading": "CPU Protection Rings & Kernel Isolation",
        "text": "x86/x64 processors utilize hardware-enforced protection rings (Ring 0 to Ring 3) to isolate memory. Ring 0 (Kernel Mode) executes privileged core OS instructions, while Ring 3 (User Mode) runs user applications with restricted hardware access.",
        "codeSnippet": "uname -r && dmesg | grep -i 'secureboot'",
        "terminalOutput": "6.8.0-40-generic\n[ 0.000000] secureboot: Secure boot enabled",
        "mcq": {
          "id": "q-1.3-0-compulsory",
          "question": "Why does the CPU hardware architecture separate Kernel Mode (Ring 0) from User Mode (Ring 3)?",
          "options": [
            {
              "id": "A",
              "text": "To prevent unprivileged user applications from directly modifying critical hardware, kernel memory, or crash the OS",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "To allow user applications to run with higher clock frequencies than the kernel",
              "explanationIfWrong": "Incorrect: Hardware protection rings restrict direct memory and hardware access to vetted kernel code."
            },
            {
              "id": "C",
              "text": "To double the physical RAM capacity of the operating system",
              "explanationIfWrong": "Incorrect: Hardware protection rings restrict direct memory and hardware access to vetted kernel code."
            },
            {
              "id": "D",
              "text": "To eliminate the need for device drivers and firmware code",
              "explanationIfWrong": "Incorrect: Hardware protection rings restrict direct memory and hardware access to vetted kernel code."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Hardware protection rings restrict direct memory and hardware access to vetted kernel code."
        },
        "retestMcq": {
          "id": "q-1.3-0-reset",
          "question": "What happens when a Ring 3 user application attempts to execute a privileged CPU instruction reserved for Ring 0?",
          "options": [
            {
              "id": "A",
              "text": "The processor executes the instruction immediately without validation",
              "explanationIfWrong": "Incorrect: CPUs trap unauthorized privileged instructions, transferring control to kernel protection routines."
            },
            {
              "id": "B",
              "text": "The computer motherboard permanently burns out its internal transistors",
              "explanationIfWrong": "Incorrect: CPUs trap unauthorized privileged instructions, transferring control to kernel protection routines."
            },
            {
              "id": "C",
              "text": "The CPU generates a General Protection Fault (GPF) trap and transitions control to the OS kernel handler",
              "explanationIfWrong": ""
            },
            {
              "id": "D",
              "text": "The operating system reboots instantly into safe mode without logging",
              "explanationIfWrong": "Incorrect: CPUs trap unauthorized privileged instructions, transferring control to kernel protection routines."
            }
          ],
          "correctAnswer": "C",
          "explanationNote": "CPUs trap unauthorized privileged instructions, transferring control to kernel protection routines."
        }
      },
      {
        "heading": "Address Space Layout Randomization (ASLR)",
        "text": "ASLR randomizes the memory addresses of key program segments—such as the stack, heap, and shared libraries—upon execution. This complicates buffer overflow exploitation by preventing attackers from jumping to predictable memory addresses.",
        "codeSnippet": "cat /proc/sys/kernel/randomize_va_space",
        "terminalOutput": "2",
        "mcq": {
          "id": "q-1.3-1-compulsory",
          "question": "How does Address Space Layout Randomization (ASLR) mitigate memory corruption exploits?",
          "options": [
            {
              "id": "A",
              "text": "By physically encrypting the system motherboard RAM with hardware AES-256",
              "explanationIfWrong": "Incorrect: Randomizing memory locations breaks hardcoded exploit payload offsets."
            },
            {
              "id": "B",
              "text": "By randomizing memory offsets so attackers cannot reliably jump to hardcoded payload or shellcode addresses",
              "explanationIfWrong": ""
            },
            {
              "id": "C",
              "text": "By permanently deleting all stack variables after each function returns",
              "explanationIfWrong": "Incorrect: Randomizing memory locations breaks hardcoded exploit payload offsets."
            },
            {
              "id": "D",
              "text": "By preventing users from installing software binaries on secondary hard drives",
              "explanationIfWrong": "Incorrect: Randomizing memory locations breaks hardcoded exploit payload offsets."
            }
          ],
          "correctAnswer": "B",
          "explanationNote": "Randomizing memory locations breaks hardcoded exploit payload offsets."
        },
        "retestMcq": {
          "id": "q-1.3-1-reset",
          "question": "What is the primary function of Data Execution Prevention (DEP / NX bit)?",
          "options": [
            {
              "id": "A",
              "text": "Accelerating graphics rendering across dedicated visual processing units",
              "explanationIfWrong": "Incorrect: DEP/NX blocks attackers from executing injected shellcode in data memory."
            },
            {
              "id": "B",
              "text": "Encrypting network packets before transmission over wireless channels",
              "explanationIfWrong": "Incorrect: DEP/NX blocks attackers from executing injected shellcode in data memory."
            },
            {
              "id": "C",
              "text": "Compressing memory allocations to conserve available physical RAM",
              "explanationIfWrong": "Incorrect: DEP/NX blocks attackers from executing injected shellcode in data memory."
            },
            {
              "id": "D",
              "text": "Preventing code execution from memory regions designated strictly for data storage (like the stack)",
              "explanationIfWrong": ""
            }
          ],
          "correctAnswer": "D",
          "explanationNote": "DEP/NX blocks attackers from executing injected shellcode in data memory."
        }
      },
      {
        "heading": "POSIX File Permissions & SUID Hazards",
        "text": "POSIX permissions define read (r=4), write (w=2), and execute (x=1) permissions for User, Group, and Others. The SetUID (SUID) permission bit (chmod u+s) executes a file with the file owner's privileges, creating severe escalation risks if misconfigured.",
        "codeSnippet": "ls -l /usr/bin/passwd",
        "terminalOutput": "-rwsr-xr-x 1 root root 68208 Mar 14 2024 /usr/bin/passwd",
        "mcq": {
          "id": "q-1.3-2-compulsory",
          "question": "What risk does a world-writable binary with the SUID bit set to root represent?",
          "options": [
            {
              "id": "A",
              "text": "The file cannot be read or executed by anyone on the local operating system",
              "explanationIfWrong": "Incorrect: Writable SUID binaries provide direct local privilege escalation paths."
            },
            {
              "id": "B",
              "text": "The server hard drive automatically reformats upon system reboot",
              "explanationIfWrong": "Incorrect: Writable SUID binaries provide direct local privilege escalation paths."
            },
            {
              "id": "C",
              "text": "Any local standard user can modify the binary to execute arbitrary commands with full root privileges",
              "explanationIfWrong": ""
            },
            {
              "id": "D",
              "text": "Network interfaces immediately drop all incoming encrypted TLS packets",
              "explanationIfWrong": "Incorrect: Writable SUID binaries provide direct local privilege escalation paths."
            }
          ],
          "correctAnswer": "C",
          "explanationNote": "Writable SUID binaries provide direct local privilege escalation paths."
        },
        "retestMcq": {
          "id": "q-1.3-2-reset",
          "question": "Which command correctly secures a sensitive configuration file so only the root user can read or write it?",
          "options": [
            {
              "id": "A",
              "text": "chmod 600 /etc/secure.conf && chown root:root /etc/secure.conf",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "chmod 777 /etc/secure.conf",
              "explanationIfWrong": "Incorrect: Permission 600 restricts access exclusively to the owner (root)."
            },
            {
              "id": "C",
              "text": "chmod 444 /etc/secure.conf && chown nobody:nogroup /etc/secure.conf",
              "explanationIfWrong": "Incorrect: Permission 600 restricts access exclusively to the owner (root)."
            },
            {
              "id": "D",
              "text": "chmod u+s /etc/secure.conf",
              "explanationIfWrong": "Incorrect: Permission 600 restricts access exclusively to the owner (root)."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Permission 600 restricts access exclusively to the owner (root)."
        }
      },
      {
        "heading": "Secure Boot & Unified Extensible Firmware (UEFI)",
        "text": "Secure Boot validates cryptographic signatures on bootloaders, kernel images, and drivers against trusted keys embedded in UEFI firmware. This prevents bootkits and rootkits from hijacking the operating system during initial boot sequence.",
        "codeSnippet": "mokutil --sb-state",
        "terminalOutput": "SecureBoot enabled",
        "mcq": {
          "id": "q-1.3-3-compulsory",
          "question": "What threat vector does UEFI Secure Boot specifically prevent?",
          "options": [
            {
              "id": "A",
              "text": "Cross-site scripting attacks targeting client web browsers",
              "explanationIfWrong": "Incorrect: Secure Boot validates cryptographic integrity before executing pre-boot binaries."
            },
            {
              "id": "B",
              "text": "Phishing emails with malicious macro-enabled office attachments",
              "explanationIfWrong": "Incorrect: Secure Boot validates cryptographic integrity before executing pre-boot binaries."
            },
            {
              "id": "C",
              "text": "Man-in-the-middle attacks on public Wi-Fi networks",
              "explanationIfWrong": "Incorrect: Secure Boot validates cryptographic integrity before executing pre-boot binaries."
            },
            {
              "id": "D",
              "text": "Malicious bootkits or modified bootloaders executing before the operating system kernel loads",
              "explanationIfWrong": ""
            }
          ],
          "correctAnswer": "D",
          "explanationNote": "Secure Boot validates cryptographic integrity before executing pre-boot binaries."
        },
        "retestMcq": {
          "id": "q-1.3-3-reset",
          "question": "Where are the authoritative public verification keys stored for UEFI Secure Boot?",
          "options": [
            {
              "id": "A",
              "text": "In an unencrypted text file in the user's desktop folder",
              "explanationIfWrong": "Incorrect: Motherboard firmware NVRAM safeguards authoritative root platform keys."
            },
            {
              "id": "B",
              "text": "Inside tamper-resistant non-volatile NVRAM firmware on the system motherboard",
              "explanationIfWrong": ""
            },
            {
              "id": "C",
              "text": "On an external public FTP server accessible over HTTP",
              "explanationIfWrong": "Incorrect: Motherboard firmware NVRAM safeguards authoritative root platform keys."
            },
            {
              "id": "D",
              "text": "Inside temporary browser cookies cleared upon browser close",
              "explanationIfWrong": "Incorrect: Motherboard firmware NVRAM safeguards authoritative root platform keys."
            }
          ],
          "correctAnswer": "B",
          "explanationNote": "Motherboard firmware NVRAM safeguards authoritative root platform keys."
        }
      },
      {
        "heading": "Hardware Security Modules (HSM) & TPM",
        "text": "A Trusted Platform Module (TPM) is a dedicated microchip that provides hardware-based cryptographic operations, secure key generation, and platform integrity measurements (PCRs) to ensure OS tampering has not occurred.",
        "codeSnippet": "tpm2_pcrread sha256:0,7",
        "terminalOutput": "sha256:\n 0: 0x8F53B782987114A51E6BC0E4589255C8F22A1E4B908B8147E99A6E9B9A6DE0C1",
        "mcq": {
          "id": "q-1.3-4-compulsory",
          "question": "How does a Trusted Platform Module (TPM) protect full-disk encryption keys (e.g., BitLocker/LUKS)?",
          "options": [
            {
              "id": "A",
              "text": "It uploads encryption keys to public web servers for cloud recovery",
              "explanationIfWrong": "Incorrect: PCR measurements ensure keys are only released to uncompromised boot environments."
            },
            {
              "id": "B",
              "text": "It seals the encryption key and only unseals it if system boot measurements match verified baseline PCR values",
              "explanationIfWrong": ""
            },
            {
              "id": "C",
              "text": "It changes user passwords automatically every ten minutes",
              "explanationIfWrong": "Incorrect: PCR measurements ensure keys are only released to uncompromised boot environments."
            },
            {
              "id": "D",
              "text": "It stores disk encryption keys in plaintext in the system swap file",
              "explanationIfWrong": "Incorrect: PCR measurements ensure keys are only released to uncompromised boot environments."
            }
          ],
          "correctAnswer": "B",
          "explanationNote": "PCR measurements ensure keys are only released to uncompromised boot environments."
        },
        "retestMcq": {
          "id": "q-1.3-4-reset",
          "question": "What distinguishes a Hardware Security Module (HSM) from standard software cryptographic libraries?",
          "options": [
            {
              "id": "A",
              "text": "An HSM is an open-source software library written in Python",
              "explanationIfWrong": "Incorrect: HSMs provide certified physical and cryptographic tamper protection."
            },
            {
              "id": "B",
              "text": "An HSM eliminates the need to use cryptographic keys for encryption",
              "explanationIfWrong": "Incorrect: HSMs provide certified physical and cryptographic tamper protection."
            },
            {
              "id": "C",
              "text": "An HSM can only encrypt unformatted floppy disk drives",
              "explanationIfWrong": "Incorrect: HSMs provide certified physical and cryptographic tamper protection."
            },
            {
              "id": "D",
              "text": "An HSM performs cryptographic operations inside tamper-resistant, physically hardened hardware boundaries",
              "explanationIfWrong": ""
            }
          ],
          "correctAnswer": "D",
          "explanationNote": "HSMs provide certified physical and cryptographic tamper protection."
        }
      },
      {
        "heading": "Endpoint Detection & Response (EDR) Architecture",
        "text": "Endpoint Detection and Response (EDR) agents continuously record system events, process spawning, network connections, and memory activity on endpoints. Telemetry is streamed to centralized analytics engines for behavioral anomaly detection.",
        "codeSnippet": "systemctl status osqueryd | grep 'Active:'",
        "terminalOutput": "Active: active (running) since Wed 2026-10-14 01:10:00 IST",
        "mcq": {
          "id": "q-1.3-5-compulsory",
          "question": "Why is behavioral EDR telemetry superior to traditional static signature-based antivirus?",
          "options": [
            {
              "id": "A",
              "text": "It eliminates the need for user passwords and authentication tokens",
              "explanationIfWrong": "Incorrect: Behavioral monitoring identifies malicious activities regardless of binary hash variations."
            },
            {
              "id": "B",
              "text": "It operates without requiring CPU cycles or network connectivity",
              "explanationIfWrong": "Incorrect: Behavioral monitoring identifies malicious activities regardless of binary hash variations."
            },
            {
              "id": "C",
              "text": "It detects novel zero-days and living-off-the-land techniques by analyzing process behavior rather than static file hashes",
              "explanationIfWrong": ""
            },
            {
              "id": "D",
              "text": "It physically blocks hackers from cutting enterprise fiber cables",
              "explanationIfWrong": "Incorrect: Behavioral monitoring identifies malicious activities regardless of binary hash variations."
            }
          ],
          "correctAnswer": "C",
          "explanationNote": "Behavioral monitoring identifies malicious activities regardless of binary hash variations."
        },
        "retestMcq": {
          "id": "q-1.3-5-reset",
          "question": "An attacker runs legitimate Windows 'certutil.exe' to download a remote malicious payload. Which security tool detects this malicious behavior?",
          "options": [
            {
              "id": "A",
              "text": "An EDR agent monitoring suspicious parent-child process execution and unusual external network calls",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "A basic file integrity tool that only checks if certutil.exe was modified",
              "explanationIfWrong": "Incorrect: EDRs monitor behavioral command telemetry to catch living-off-the-land attacks."
            },
            {
              "id": "C",
              "text": "A static signature antivirus that ignores signed Microsoft operating system binaries",
              "explanationIfWrong": "Incorrect: EDRs monitor behavioral command telemetry to catch living-off-the-land attacks."
            },
            {
              "id": "D",
              "text": "An unmanaged network switch without port mirroring or flow logs",
              "explanationIfWrong": "Incorrect: EDRs monitor behavioral command telemetry to catch living-off-the-land attacks."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "EDRs monitor behavioral command telemetry to catch living-off-the-land attacks."
        }
      }
    ]
  },
  {
    "id": "1-4-governance",
    "number": "1.4",
    "title": "Information System Governance & Risk Assessment",
    "subtitle": "Implement ISO/IEC 27001, NIST CSF, PCI-DSS, and regulatory compliance audit mechanisms.",
    "readTime": "15 min",
    "objectives": [
      "Understand core principles of Information System Governance & Risk Assessment",
      "Analyze tactical threat vectors and attack surfaces in 1.4",
      "Execute terminal commands and inspection scripts in the security environment",
      "Implement industry standard hardening and defensive controls",
      "Validate security posture through automated testing and logging",
      "Ensure compliance with enterprise policy and risk frameworks"
    ],
    "theoryBlocks": [
      {
        "heading": "Information Security Governance Frameworks",
        "text": "Security governance aligns information security programs with enterprise business objectives and regulatory mandates. Industry standard frameworks like ISO/IEC 27001, NIST Cybersecurity Framework (CSF), and COBIT define formal control catalogs.",
        "codeSnippet": "cat /etc/security/audit_policy.conf | grep 'FRAMEWORK'",
        "terminalOutput": "FRAMEWORK=NIST_CSF_V2.0\nAUDIT_SCOPE=ENTERPRISE_CORE",
        "mcq": {
          "id": "q-1.4-0-compulsory",
          "question": "What is the primary objective of information security governance?",
          "options": [
            {
              "id": "A",
              "text": "Ensuring security initiatives align strategically with organizational business goals and legal mandates",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Eliminating all technology costs by turning off internet access across all departments",
              "explanationIfWrong": "Incorrect: Governance ensures security controls support business strategy and regulatory compliance."
            },
            {
              "id": "C",
              "text": "Replacing all human system administrators with fully autonomous AI algorithms",
              "explanationIfWrong": "Incorrect: Governance ensures security controls support business strategy and regulatory compliance."
            },
            {
              "id": "D",
              "text": "Allowing each individual employee to define their own personal firewall rules",
              "explanationIfWrong": "Incorrect: Governance ensures security controls support business strategy and regulatory compliance."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Governance ensures security controls support business strategy and regulatory compliance."
        },
        "retestMcq": {
          "id": "q-1.4-0-reset",
          "question": "Which five core functions comprise the NIST Cybersecurity Framework (CSF)?",
          "options": [
            {
              "id": "A",
              "text": "Scan, Exploit, Pivot, Exfiltrate, and Cover Tracks",
              "explanationIfWrong": "Incorrect: NIST CSF organizes cybersecurity activities across Identify, Protect, Detect, Respond, and Recover."
            },
            {
              "id": "B",
              "text": "Confidentiality, Integrity, Availability, Non-Repudiation, and Authorization",
              "explanationIfWrong": "Incorrect: NIST CSF organizes cybersecurity activities across Identify, Protect, Detect, Respond, and Recover."
            },
            {
              "id": "C",
              "text": "Identify, Protect, Detect, Respond, and Recover",
              "explanationIfWrong": ""
            },
            {
              "id": "D",
              "text": "Hardware, Software, Firmware, Middleware, and Cloud",
              "explanationIfWrong": "Incorrect: NIST CSF organizes cybersecurity activities across Identify, Protect, Detect, Respond, and Recover."
            }
          ],
          "correctAnswer": "C",
          "explanationNote": "NIST CSF organizes cybersecurity activities across Identify, Protect, Detect, Respond, and Recover."
        }
      },
      {
        "heading": "Quantitative vs Qualitative Risk Analysis",
        "text": "Quantitative risk analysis assigns objective monetary values to risks using formulas such as Single Loss Expectancy (SLE) and Annualized Loss Expectancy (ALE = SLE * ARO). Qualitative risk analysis evaluates threats using subjective matrices (High, Medium, Low).",
        "codeSnippet": "python3 -c 'AV=500000; EF=0.20; ARO=0.5; SLE=AV*EF; ALE=SLE*ARO; print(f\"SLE: ${SLE:,.0f} | ALE: ${ALE:,.0f}\")'",
        "terminalOutput": "SLE: $100,000 | ALE: $50,000",
        "mcq": {
          "id": "q-1.4-1-compulsory",
          "question": "In quantitative risk assessment, how is the Annualized Loss Expectancy (ALE) calculated?",
          "options": [
            {
              "id": "A",
              "text": "By dividing the Total Asset Value by the annual budget of the IT department",
              "explanationIfWrong": "Incorrect: ALE = SLE * ARO mathematically models expected yearly financial loss."
            },
            {
              "id": "B",
              "text": "By multiplying the Single Loss Expectancy (SLE) by the Annualized Rate of Occurrence (ARO)",
              "explanationIfWrong": ""
            },
            {
              "id": "C",
              "text": "By subtracting the hardware depreciation costs from the annual corporate revenue",
              "explanationIfWrong": "Incorrect: ALE = SLE * ARO mathematically models expected yearly financial loss."
            },
            {
              "id": "D",
              "text": "By adding the number of detected firewall alerts to the employee headcount",
              "explanationIfWrong": "Incorrect: ALE = SLE * ARO mathematically models expected yearly financial loss."
            }
          ],
          "correctAnswer": "B",
          "explanationNote": "ALE = SLE * ARO mathematically models expected yearly financial loss."
        },
        "retestMcq": {
          "id": "q-1.4-1-reset",
          "question": "An asset is valued at $200,000 and has an Exposure Factor (EF) of 25%. What is its Single Loss Expectancy (SLE)?",
          "options": [
            {
              "id": "A",
              "text": "$25,000",
              "explanationIfWrong": "Incorrect: SLE = Asset Value * Exposure Factor ($200,000 * 0.25 = $50,000)."
            },
            {
              "id": "B",
              "text": "$150,000",
              "explanationIfWrong": "Incorrect: SLE = Asset Value * Exposure Factor ($200,000 * 0.25 = $50,000)."
            },
            {
              "id": "C",
              "text": "$5,000",
              "explanationIfWrong": "Incorrect: SLE = Asset Value * Exposure Factor ($200,000 * 0.25 = $50,000)."
            },
            {
              "id": "D",
              "text": "$50,000",
              "explanationIfWrong": ""
            }
          ],
          "correctAnswer": "D",
          "explanationNote": "SLE = Asset Value * Exposure Factor ($200,000 * 0.25 = $50,000)."
        }
      },
      {
        "heading": "STRIDE Threat Modeling Methodology",
        "text": "Microsoft's STRIDE framework identifies threat categories during system architecture: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege.",
        "codeSnippet": "cat threat_model.json | jq '.threats[0]'",
        "terminalOutput": "{\"category\": \"Spoofing\", \"component\": \"AuthService\", \"mitigation\": \"mTLS\"}",
        "mcq": {
          "id": "q-1.4-2-compulsory",
          "question": "Which security control directly mitigates the 'Information Disclosure' threat in STRIDE?",
          "options": [
            {
              "id": "A",
              "text": "Increasing the processor clock speed on the database server",
              "explanationIfWrong": "Incorrect: Encryption protects confidential data against unauthorized reading or disclosure."
            },
            {
              "id": "B",
              "text": "Disabling all user account passwords across the local network",
              "explanationIfWrong": "Incorrect: Encryption protects confidential data against unauthorized reading or disclosure."
            },
            {
              "id": "C",
              "text": "Enforcing strong end-to-end encryption (e.g., TLS 1.3 / AES-256) on sensitive data",
              "explanationIfWrong": ""
            },
            {
              "id": "D",
              "text": "Deploying redundant cooling fans inside the server room",
              "explanationIfWrong": "Incorrect: Encryption protects confidential data against unauthorized reading or disclosure."
            }
          ],
          "correctAnswer": "C",
          "explanationNote": "Encryption protects confidential data against unauthorized reading or disclosure."
        },
        "retestMcq": {
          "id": "q-1.4-2-reset",
          "question": "Under the STRIDE model, an attacker modifying data packets in transit between a client and a database represents which threat?",
          "options": [
            {
              "id": "A",
              "text": "Tampering (violation of integrity)",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Denial of Service (violation of availability)",
              "explanationIfWrong": "Incorrect: Unauthorized modification of data in transit or at rest represents Tampering."
            },
            {
              "id": "C",
              "text": "Information Disclosure (violation of confidentiality)",
              "explanationIfWrong": "Incorrect: Unauthorized modification of data in transit or at rest represents Tampering."
            },
            {
              "id": "D",
              "text": "Elevation of Privilege (unauthorized administrator escalation)",
              "explanationIfWrong": "Incorrect: Unauthorized modification of data in transit or at rest represents Tampering."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Unauthorized modification of data in transit or at rest represents Tampering."
        }
      },
      {
        "heading": "Vulnerability Scanners & Common Weakness Enumeration",
        "text": "Automated vulnerability scanners (OpenVAS, Nessus) probe target networks for known security flaws cataloged in the Common Weakness Enumeration (CWE) and CVE databases. Scan findings must be validated to eliminate false positives.",
        "codeSnippet": "openvas-cli --target 192.168.10.0/24 --scan-config 'Full and fast'",
        "terminalOutput": "Scan ID: 9481b0a2-1921 Target: 192.168.10.0/24 Status: Done Severity: High",
        "mcq": {
          "id": "q-1.4-3-compulsory",
          "question": "What is the difference between a CVE (Common Vulnerabilities and Exposures) and a CWE (Common Weakness Enumeration)?",
          "options": [
            {
              "id": "A",
              "text": "A CVE is a hardware model number, while a CWE is a software license agreement",
              "explanationIfWrong": "Incorrect: CWE categorizes types of software weaknesses, while CVE records specific real-world flaws."
            },
            {
              "id": "B",
              "text": "A CVE is generated exclusively by attackers, while a CWE is written by court judges",
              "explanationIfWrong": "Incorrect: CWE categorizes types of software weaknesses, while CVE records specific real-world flaws."
            },
            {
              "id": "C",
              "text": "CVEs and CWEs are identical terms with no operational distinction",
              "explanationIfWrong": "Incorrect: CWE categorizes types of software weaknesses, while CVE records specific real-world flaws."
            },
            {
              "id": "D",
              "text": "A CVE is a specific instance of a vulnerability in a product, while a CWE is an architectural flaw category",
              "explanationIfWrong": ""
            }
          ],
          "correctAnswer": "D",
          "explanationNote": "CWE categorizes types of software weaknesses, while CVE records specific real-world flaws."
        },
        "retestMcq": {
          "id": "q-1.4-3-reset",
          "question": "Why must security engineers validate vulnerability scan reports before applying remediation?",
          "options": [
            {
              "id": "A",
              "text": "To permanently delete the vulnerability scanner software from the server",
              "explanationIfWrong": "Incorrect: Verification ensures remediation resources target actual exploitable risks."
            },
            {
              "id": "B",
              "text": "To filter out false positives and determine if compensatory controls already mitigate the reported exposure",
              "explanationIfWrong": ""
            },
            {
              "id": "C",
              "text": "To hide critical vulnerabilities from internal compliance auditors",
              "explanationIfWrong": "Incorrect: Verification ensures remediation resources target actual exploitable risks."
            },
            {
              "id": "D",
              "text": "Because vulnerability scanners are strictly designed to infect systems with ransomware",
              "explanationIfWrong": "Incorrect: Verification ensures remediation resources target actual exploitable risks."
            }
          ],
          "correctAnswer": "B",
          "explanationNote": "Verification ensures remediation resources target actual exploitable risks."
        }
      },
      {
        "heading": "Security Policies, Standards & Procedures Hierarchy",
        "text": "Security governance documents follow a formal hierarchy: Policies (mandatory executive directives), Standards (mandatory specific technical requirements), Guidelines (discretionary best practices), and Procedures (step-by-step implementation workflows).",
        "codeSnippet": "ls -l /etc/security/policies/",
        "terminalOutput": "-rw-r--r-- 1 root root Password_Standard_v3.pdf\n-rw-r--r-- 1 root root Access_Control_Policy.pdf",
        "mcq": {
          "id": "q-1.4-4-compulsory",
          "question": "In the security documentation hierarchy, what defines a 'Standard'?",
          "options": [
            {
              "id": "A",
              "text": "An optional recommendation that employees may ignore without consequence",
              "explanationIfWrong": "Incorrect: Standards establish mandatory, measurable technical baseline specifications."
            },
            {
              "id": "B",
              "text": "A mandatory requirement that specifies measurable technical configurations or baseline rules",
              "explanationIfWrong": ""
            },
            {
              "id": "C",
              "text": "A high-level visionary statement written by the board of directors with no technical details",
              "explanationIfWrong": "Incorrect: Standards establish mandatory, measurable technical baseline specifications."
            },
            {
              "id": "D",
              "text": "A step-by-step checklist explaining how to install operating system drivers",
              "explanationIfWrong": "Incorrect: Standards establish mandatory, measurable technical baseline specifications."
            }
          ],
          "correctAnswer": "B",
          "explanationNote": "Standards establish mandatory, measurable technical baseline specifications."
        },
        "retestMcq": {
          "id": "q-1.4-4-reset",
          "question": "Which document type provides step-by-step operational instructions for completing a specific security task?",
          "options": [
            {
              "id": "A",
              "text": "A Policy",
              "explanationIfWrong": "Incorrect: Procedures detail exact sequential steps to execute a policy or operational task."
            },
            {
              "id": "B",
              "text": "A Guideline",
              "explanationIfWrong": "Incorrect: Procedures detail exact sequential steps to execute a policy or operational task."
            },
            {
              "id": "C",
              "text": "A Vision statement",
              "explanationIfWrong": "Incorrect: Procedures detail exact sequential steps to execute a policy or operational task."
            },
            {
              "id": "D",
              "text": "A Procedure (SOP)",
              "explanationIfWrong": ""
            }
          ],
          "correctAnswer": "D",
          "explanationNote": "Procedures detail exact sequential steps to execute a policy or operational task."
        }
      },
      {
        "heading": "ISO/IEC 27001 Certification & Statement of Applicability",
        "text": "ISO/IEC 27001 specifies requirements for establishing an Information Security Management System (ISMS). The Statement of Applicability (SoA) documents which controls from Annex A are selected or excluded, along with detailed justifications.",
        "codeSnippet": "grep -i 'Annex A.9' /var/www/compliance/soa.csv",
        "terminalOutput": "A.9.1.1,Access Control Policy,Selected,Enforced across all active domains",
        "mcq": {
          "id": "q-1.4-5-compulsory",
          "question": "What is the primary role of the Statement of Applicability (SoA) in an ISO/IEC 27001 audit?",
          "options": [
            {
              "id": "A",
              "text": "Listing the names and personal phone numbers of all company employees",
              "explanationIfWrong": "Incorrect: The SoA outlines implemented controls and formally justifies any exclusions."
            },
            {
              "id": "B",
              "text": "Providing the root administrator passwords for all production web servers",
              "explanationIfWrong": "Incorrect: The SoA outlines implemented controls and formally justifies any exclusions."
            },
            {
              "id": "C",
              "text": "Documenting which Annex A controls the organization has implemented and justifying any control exclusions",
              "explanationIfWrong": ""
            },
            {
              "id": "D",
              "text": "Guaranteeing that the organization will never experience a software bug",
              "explanationIfWrong": "Incorrect: The SoA outlines implemented controls and formally justifies any exclusions."
            }
          ],
          "correctAnswer": "C",
          "explanationNote": "The SoA outlines implemented controls and formally justifies any exclusions."
        },
        "retestMcq": {
          "id": "q-1.4-5-reset",
          "question": "What does continuous improvement in an ISMS require according to the Plan-Do-Check-Act (PDCA) model?",
          "options": [
            {
              "id": "A",
              "text": "Regularly auditing controls, measuring performance metrics, and taking corrective actions to address non-conformities",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Changing corporate passwords only once every five years",
              "explanationIfWrong": "Incorrect: The PDCA cycle drives continuous monitoring, audit assessment, and remediation."
            },
            {
              "id": "C",
              "text": "Deleting all security logs whenever an internal audit is announced",
              "explanationIfWrong": "Incorrect: The PDCA cycle drives continuous monitoring, audit assessment, and remediation."
            },
            {
              "id": "D",
              "text": "Purchasing new computer hardware every month regardless of need",
              "explanationIfWrong": "Incorrect: The PDCA cycle drives continuous monitoring, audit assessment, and remediation."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The PDCA cycle drives continuous monitoring, audit assessment, and remediation."
        }
      }
    ]
  },
  {
    "id": "1-5-incident-mgmt",
    "number": "1.5",
    "title": "Incident Management & ISO/IEC 27035 Response",
    "subtitle": "Execute preparation, detection, containment, eradication, and post-incident forensic reviews.",
    "readTime": "15 min",
    "objectives": [
      "Understand core principles of Incident Management & ISO/IEC 27035 Response",
      "Analyze tactical threat vectors and attack surfaces in 1.5",
      "Execute terminal commands and inspection scripts in the security environment",
      "Implement industry standard hardening and defensive controls",
      "Validate security posture through automated testing and logging",
      "Ensure compliance with enterprise policy and risk frameworks"
    ],
    "theoryBlocks": [
      {
        "heading": "The Incident Response Lifecycle (NIST SP 800-61)",
        "text": "NIST SP 800-61 defines four sequential phases of incident handling: Preparation; Detection and Analysis; Containment, Eradication, and Recovery; and Post-Incident Activity (Lessons Learned).",
        "codeSnippet": "cat /opt/csirt/incident_log.txt | tail -n 2",
        "terminalOutput": "PHASE: Containment STATUS: Workstation isolated from VLAN 10 TIMESTAMP: 04:15 UTC",
        "mcq": {
          "id": "q-1.5-0-compulsory",
          "question": "Which phase of the incident response lifecycle focuses on establishing playbooks, toolkits, and team training prior to a breach?",
          "options": [
            {
              "id": "A",
              "text": "Preparation",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Containment",
              "explanationIfWrong": "Incorrect: Preparation establishes communication channels, forensic tools, and procedures before an incident occurs."
            },
            {
              "id": "C",
              "text": "Eradication",
              "explanationIfWrong": "Incorrect: Preparation establishes communication channels, forensic tools, and procedures before an incident occurs."
            },
            {
              "id": "D",
              "text": "Post-Incident Activity",
              "explanationIfWrong": "Incorrect: Preparation establishes communication channels, forensic tools, and procedures before an incident occurs."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Preparation establishes communication channels, forensic tools, and procedures before an incident occurs."
        },
        "retestMcq": {
          "id": "q-1.5-0-reset",
          "question": "During which incident response phase does the security team identify the root cause flaw and purge malware artifacts from infected systems?",
          "options": [
            {
              "id": "A",
              "text": "Detection",
              "explanationIfWrong": "Incorrect: Eradication eliminates malware components, closes entry vectors, and remediates root vulnerabilities."
            },
            {
              "id": "B",
              "text": "Preparation",
              "explanationIfWrong": "Incorrect: Eradication eliminates malware components, closes entry vectors, and remediates root vulnerabilities."
            },
            {
              "id": "C",
              "text": "Eradication",
              "explanationIfWrong": ""
            },
            {
              "id": "D",
              "text": "Lessons Learned",
              "explanationIfWrong": "Incorrect: Eradication eliminates malware components, closes entry vectors, and remediates root vulnerabilities."
            }
          ],
          "correctAnswer": "C",
          "explanationNote": "Eradication eliminates malware components, closes entry vectors, and remediates root vulnerabilities."
        }
      },
      {
        "heading": "Computer Security Incident Response Team (CSIRT)",
        "text": "A CSIRT coordinates incident mitigation across technical engineering, legal counsel, corporate communications, and executive leadership. Clear operational roles ensure rapid, legally compliant containment.",
        "codeSnippet": "cat /etc/csirt/call_tree.conf | head -n 3",
        "terminalOutput": "ROLE=Lead_Analyst CONTACT=555-0192\nROLE=Legal_Counsel CONTACT=555-0144",
        "mcq": {
          "id": "q-1.5-1-compulsory",
          "question": "Why must corporate legal counsel be integrated into the CSIRT during a critical data breach?",
          "options": [
            {
              "id": "A",
              "text": "To reconfigure border firewall routing tables manually",
              "explanationIfWrong": "Incorrect: Legal counsel manages statutory notification timelines and legal liabilities."
            },
            {
              "id": "B",
              "text": "To evaluate regulatory reporting obligations (e.g., GDPR, CERT-In, HIPAA) and preserve attorney-client privilege",
              "explanationIfWrong": ""
            },
            {
              "id": "C",
              "text": "To write low-level C++ drivers for forensic disk duplicators",
              "explanationIfWrong": "Incorrect: Legal counsel manages statutory notification timelines and legal liabilities."
            },
            {
              "id": "D",
              "text": "To negotiate discounts on employee health insurance policies",
              "explanationIfWrong": "Incorrect: Legal counsel manages statutory notification timelines and legal liabilities."
            }
          ],
          "correctAnswer": "B",
          "explanationNote": "Legal counsel manages statutory notification timelines and legal liabilities."
        },
        "retestMcq": {
          "id": "q-1.5-1-reset",
          "question": "What is an Incident Handler's primary ethical duty when interacting with executive management during a crisis?",
          "options": [
            {
              "id": "A",
              "text": "Blaming junior employees to protect the department budget",
              "explanationIfWrong": "Incorrect: Transparent, accurate reporting enables informed risk and remediation decisions."
            },
            {
              "id": "B",
              "text": "Promising that zero data was compromised before conducting forensic investigation",
              "explanationIfWrong": "Incorrect: Transparent, accurate reporting enables informed risk and remediation decisions."
            },
            {
              "id": "C",
              "text": "Falsifying incident timelines to avoid negative press coverage",
              "explanationIfWrong": "Incorrect: Transparent, accurate reporting enables informed risk and remediation decisions."
            },
            {
              "id": "D",
              "text": "Providing objective, verified technical facts and accurate scope assessments without downplaying or exaggerating risks",
              "explanationIfWrong": ""
            }
          ],
          "correctAnswer": "D",
          "explanationNote": "Transparent, accurate reporting enables informed risk and remediation decisions."
        }
      },
      {
        "heading": "Live Triage & Volatile Memory Preservation",
        "text": "Volatile data stored in system RAM—such as running processes, injected code, and open network sockets—is permanently lost upon reboot. Responders must capture volatile memory before powering down or rebooting a compromised system.",
        "codeSnippet": "lime-forensics -o /mnt/forensic/ram.lime -f raw",
        "terminalOutput": "Acquiring live physical RAM to /mnt/forensic/ram.lime... Done. 16,384 MB dumped.",
        "mcq": {
          "id": "q-1.5-2-compulsory",
          "question": "Why should an incident responder NEVER immediately power off or reboot a compromised server before live triage?",
          "options": [
            {
              "id": "A",
              "text": "Powering off the machine permanently destroys the physical CPU hardware",
              "explanationIfWrong": "Incorrect: Powering off purges volatile memory artifacts needed for forensic reconstruction."
            },
            {
              "id": "B",
              "text": "Rebooting automatically transfers company bank funds to the attacker",
              "explanationIfWrong": "Incorrect: Powering off purges volatile memory artifacts needed for forensic reconstruction."
            },
            {
              "id": "C",
              "text": "Rebooting destroys critical volatile evidence in RAM, including active network connections, encryption keys, and injected shellcode",
              "explanationIfWrong": ""
            },
            {
              "id": "D",
              "text": "Rebooting uninstalls the server operating system license permanently",
              "explanationIfWrong": "Incorrect: Powering off purges volatile memory artifacts needed for forensic reconstruction."
            }
          ],
          "correctAnswer": "C",
          "explanationNote": "Powering off purges volatile memory artifacts needed for forensic reconstruction."
        },
        "retestMcq": {
          "id": "q-1.5-2-reset",
          "question": "According to the RFC 3227 Order of Volatility, which data source should be collected first?",
          "options": [
            {
              "id": "A",
              "text": "CPU registers and processor cache memory",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "Secondary backup magnetic tapes stored in offsite vaults",
              "explanationIfWrong": "Incorrect: Registers and cache are the most ephemeral, volatile data components."
            },
            {
              "id": "C",
              "text": "Archived optical DVDs in the storage warehouse",
              "explanationIfWrong": "Incorrect: Registers and cache are the most ephemeral, volatile data components."
            },
            {
              "id": "D",
              "text": "Printed paper network topology diagrams",
              "explanationIfWrong": "Incorrect: Registers and cache are the most ephemeral, volatile data components."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Registers and cache are the most ephemeral, volatile data components."
        }
      },
      {
        "heading": "Containment Strategies: Network Isolation vs Null-Routing",
        "text": "Containment prevents an adversary from moving laterally or exfiltrating data. Short-term containment includes isolating the host VLAN, disabling switch ports via 802.1X, or null-routing external C2 IP addresses at perimeter firewalls.",
        "codeSnippet": "iptables -I INPUT -s 198.51.100.24 -j DROP && iptables -I OUTPUT -d 198.51.100.24 -j DROP",
        "terminalOutput": "Rules applied: 198.51.100.24 traffic dropped in both directions",
        "mcq": {
          "id": "q-1.5-3-compulsory",
          "question": "What is the tactical purpose of placing a compromised workstation into an isolated quarantine VLAN rather than pulling the power plug?",
          "options": [
            {
              "id": "A",
              "text": "It allows the attacker to download larger files at faster speeds",
              "explanationIfWrong": "Incorrect: VLAN quarantine cuts off attack paths while maintaining volatile memory for forensics."
            },
            {
              "id": "B",
              "text": "It gives the user administrator rights to clean up their own desktop files",
              "explanationIfWrong": "Incorrect: VLAN quarantine cuts off attack paths while maintaining volatile memory for forensics."
            },
            {
              "id": "C",
              "text": "It permanently disables the workstation's display screen",
              "explanationIfWrong": "Incorrect: VLAN quarantine cuts off attack paths while maintaining volatile memory for forensics."
            },
            {
              "id": "D",
              "text": "It blocks lateral movement while keeping the system powered for live memory capture and forensic investigation",
              "explanationIfWrong": ""
            }
          ],
          "correctAnswer": "D",
          "explanationNote": "VLAN quarantine cuts off attack paths while maintaining volatile memory for forensics."
        },
        "retestMcq": {
          "id": "q-1.5-3-reset",
          "question": "When an attacker establishes an active Command and Control (C2) connection to an external IP, what perimeter firewall action severs communication immediately?",
          "options": [
            {
              "id": "A",
              "text": "Allowing all outbound traffic on port 443 without inspection",
              "explanationIfWrong": "Incorrect: Dropping C2 packets breaks adversary communication and prevents exfiltration."
            },
            {
              "id": "B",
              "text": "Applying a null-route (blackhole) or immediate DROP rule for all traffic to and from the C2 IP",
              "explanationIfWrong": ""
            },
            {
              "id": "C",
              "text": "Increasing the MTU packet size across internal core switches",
              "explanationIfWrong": "Incorrect: Dropping C2 packets breaks adversary communication and prevents exfiltration."
            },
            {
              "id": "D",
              "text": "Sending a polite email to the owner of the external IP asking them to stop",
              "explanationIfWrong": "Incorrect: Dropping C2 packets breaks adversary communication and prevents exfiltration."
            }
          ],
          "correctAnswer": "B",
          "explanationNote": "Dropping C2 packets breaks adversary communication and prevents exfiltration."
        }
      },
      {
        "heading": "Root Cause Eradication & System Recovery",
        "text": "Eradication removes all malicious components, revokes compromised credentials, and patches exploited vulnerabilities. Recovery restores systems from trusted offline backups, validates services, and closely monitors for reinfection.",
        "codeSnippet": "clamscan -r -i /var/www/html/ && chown -R www-data:www-data /var/www/html/",
        "terminalOutput": "/var/www/html/shell.php: Trojan.PHP.Webshell FOUND\nInfected files: 1 (Quarantined)",
        "mcq": {
          "id": "q-1.5-4-compulsory",
          "question": "Why must all user and service account credentials associated with a compromised system be revoked during eradication?",
          "options": [
            {
              "id": "A",
              "text": "Because resetting passwords improves computer processing speed",
              "explanationIfWrong": "Incorrect: Adversaries rely on harvested credentials to regain access unless accounts are reset."
            },
            {
              "id": "B",
              "text": "Because adversaries frequently harvest cached hashes or Kerberos tickets to maintain persistent unauthorized access",
              "explanationIfWrong": ""
            },
            {
              "id": "C",
              "text": "Because user passwords automatically expire every 60 seconds during an audit",
              "explanationIfWrong": "Incorrect: Adversaries rely on harvested credentials to regain access unless accounts are reset."
            },
            {
              "id": "D",
              "text": "Because revoking credentials deletes all corporate database tables",
              "explanationIfWrong": "Incorrect: Adversaries rely on harvested credentials to regain access unless accounts are reset."
            }
          ],
          "correctAnswer": "B",
          "explanationNote": "Adversaries rely on harvested credentials to regain access unless accounts are reset."
        },
        "retestMcq": {
          "id": "q-1.5-4-reset",
          "question": "What is the safest industry standard practice for restoring a heavily compromised server back to production?",
          "options": [
            {
              "id": "A",
              "text": "Manually deleting visible desktop virus shortcuts and leaving the server online",
              "explanationIfWrong": "Incorrect: Rebuilding from verified golden images guarantees all covert backdoors are eradicated."
            },
            {
              "id": "B",
              "text": "Turning the computer off and on three times in rapid succession",
              "explanationIfWrong": "Incorrect: Rebuilding from verified golden images guarantees all covert backdoors are eradicated."
            },
            {
              "id": "C",
              "text": "Disabling all antivirus scanners so the computer runs faster",
              "explanationIfWrong": "Incorrect: Rebuilding from verified golden images guarantees all covert backdoors are eradicated."
            },
            {
              "id": "D",
              "text": "Rebuilding the server from known-good baseline images and restoring clean data from verified offline backups",
              "explanationIfWrong": ""
            }
          ],
          "correctAnswer": "D",
          "explanationNote": "Rebuilding from verified golden images guarantees all covert backdoors are eradicated."
        }
      },
      {
        "heading": "Post-Incident Review & Lessons Learned",
        "text": "The Lessons Learned meeting analyzes what occurred, evaluates how well the response plan performed, and identifies architectural improvements to prevent recurrence. Findings are compiled into an executive incident report.",
        "codeSnippet": "cat /opt/csirt/report_summary.md | head -n 3",
        "terminalOutput": "# Incident Final Report: INC-2026-1014\nRoot Cause: Unpatched Apache Struts CVE-2023-XXXX\nRemediation: Automated patch pipeline deployed",
        "mcq": {
          "id": "q-1.5-5-compulsory",
          "question": "What is the primary objective of conducting a formal Post-Incident Review (Lessons Learned)?",
          "options": [
            {
              "id": "A",
              "text": "Assigning legal blame to individual junior analysts to fire them publicly",
              "explanationIfWrong": "Incorrect: Lessons learned meetings refine defensive postures and update operational response playbooks."
            },
            {
              "id": "B",
              "text": "Convincing external insurance agencies to cover unrelated office expenses",
              "explanationIfWrong": "Incorrect: Lessons learned meetings refine defensive postures and update operational response playbooks."
            },
            {
              "id": "C",
              "text": "Identifying operational weaknesses in existing defenses and improving incident playbooks to prevent future recurrence",
              "explanationIfWrong": ""
            },
            {
              "id": "D",
              "text": "Deleting all forensic logs to pretend the incident never happened",
              "explanationIfWrong": "Incorrect: Lessons learned meetings refine defensive postures and update operational response playbooks."
            }
          ],
          "correctAnswer": "C",
          "explanationNote": "Lessons learned meetings refine defensive postures and update operational response playbooks."
        },
        "retestMcq": {
          "id": "q-1.5-5-reset",
          "question": "What key deliverable must be finalized at the conclusion of the incident response lifecycle?",
          "options": [
            {
              "id": "A",
              "text": "A Comprehensive Incident Report detailing root cause analysis, timeline, business impact, and corrective action items",
              "explanationIfWrong": ""
            },
            {
              "id": "B",
              "text": "A list of the fastest gaming graphics cards to purchase for the IT team",
              "explanationIfWrong": "Incorrect: The incident report provides an authoritative audit record and mandates corrective remediations."
            },
            {
              "id": "C",
              "text": "A public apology letter printed in the newspaper signed by all employees",
              "explanationIfWrong": "Incorrect: The incident report provides an authoritative audit record and mandates corrective remediations."
            },
            {
              "id": "D",
              "text": "An invoice charging external hackers for electricity consumed during the breach",
              "explanationIfWrong": "Incorrect: The incident report provides an authoritative audit record and mandates corrective remediations."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The incident report provides an authoritative audit record and mandates corrective remediations."
        }
      }
    ]
  }
];

// ============================================================================
// STATE HELPERS & RETEST ATTEMPT LOGIC
// ============================================================================

export const getActiveQuestionsForLevel = (
  section: SectionContent,
  studentId: string,
  forceRetest: boolean = false
): McqQuestion[] => {
  const attemptKey = `dopilot_cyber_attempt_${section.id}_${studentId}`;
  let attemptCount = 1;
  try {
    const saved = localStorage.getItem(attemptKey);
    if (saved) attemptCount = Number(saved) || 1;
  } catch {}

  const isRetestAttempt = forceRetest || attemptCount > 1;

  return section.theoryBlocks.map((block) => {
    if (isRetestAttempt && block.retestMcq) {
      return block.retestMcq;
    }
    return block.mcq || (block.questionPool && block.questionPool[0])!;
  });
};

export const setLevelAttemptCount = (
  sectionId: string,
  studentId: string,
  attemptNumber: number
): void => {
  try {
    localStorage.setItem(`dopilot_cyber_attempt_${sectionId}_${studentId}`, String(attemptNumber));
  } catch {}
};

export const getConsecutiveFailedLevels = (studentId: string): number => {
  try {
    const val = localStorage.getItem(`dopilot_cyber_consecutive_failures_${studentId}`);
    return val ? Math.max(0, parseInt(val, 10) || 0) : 0;
  } catch {
    return 0;
  }
};

export const recordLevelAttemptResult = (
  sectionId: string,
  studentId: string,
  isPassed: boolean
): {
  isPassed: boolean;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  consecutiveFailedLevels: number;
  isLocked: boolean;
} => {
  const attemptKey = `dopilot_cyber_attempt_${sectionId}_${studentId}`;
  let currentAttempt = 1;
  try {
    const saved = localStorage.getItem(attemptKey);
    if (saved) currentAttempt = parseInt(saved, 10) || 1;
  } catch {}

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_cyber_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_cyber_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_cyber_locked_${studentId}`);
    } catch {}

    return {
      isPassed: true,
      attemptCount: currentAttempt,
      isSecondFailureInLevel: false,
      consecutiveFailedLevels: 0,
      isLocked: false
    };
  } else {
    if (currentAttempt === 1) {
      setLevelAttemptCount(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevels(studentId);
      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevels(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_cyber_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_cyber_locked_${studentId}`, 'true');
        }
      } catch {}

      return {
        isPassed: false,
        attemptCount: 2,
        isSecondFailureInLevel: true,
        consecutiveFailedLevels: newStreak,
        isLocked
      };
    }
  }
};

export const resetConsecutiveFailures = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_cyber_consecutive_failures_${studentId}`, '0');
    localStorage.removeItem(`dopilot_cyber_locked_${studentId}`);
  } catch {}
};
