import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Play, X, Maximize2, 
  Minimize2, Shield, Terminal as TerminalIcon
} from 'lucide-react';

export interface SecurityCommandContext {
  id: string;
  title: string;
  description: string;
  command: string;
  expectedOutput?: string;
}

interface CyberTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCommand?: SecurityCommandContext | null;
}

const COMMAND_DATABASE: Record<string, string> = {
  'help': `[+] DO PILOT Cyber Security Command Lab v2.4 (Defensive & Offensive Toolkit)
Available Commands:
  nmap -sS <ip>       : Perform TCP SYN stealth port scan
  nmap -A <target>    : Enable OS detection, version scanning, and script scan
  wireshark --summary : Analyze captured packet flow and protocol statistics
  hashcat -m 0 <hash> : Run MD5 hash recovery attack with wordlist
  openssl enc -aes-256: Test symmetric AES-256-CBC encryption cipher
  snort -A console    : Launch Intrusion Detection System alert engine
  sqlmap -u <url>     : Test database endpoints for SQL injection vulnerabilities
  iptables -L         : Inspect Linux kernel firewall packet filtering rules
  netstat -tulnp      : Display active listening TCP/UDP ports and service daemons
  cat /etc/passwd     : Audit system user account configurations
  whoami              : Print current shell effective user identity
  id                  : Display UID, GID, and security group memberships
  clear               : Clear terminal screen
  help                : Display this toolkit instruction manual`,

  'whoami': `root`,

  'id': `uid=0(root) gid=0(root) groups=0(root) context=system_u:system_r:secadmin_t:s0`,

  'cat /etc/passwd': `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
security_auditor:x:1001:1001:Security Auditor:/home/auditor:/bin/bash
snort:x:1002:1002:Snort IDS Service:/var/log/snort:/bin/false`,

  'iptables -l': `Chain INPUT (policy DROP)
target     prot opt source               destination         
ACCEPT     all  --  anywhere             anywhere             state RELATED,ESTABLISHED
ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:ssh state NEW
ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:https state NEW
DROP       all  --  anywhere             anywhere             /* Log & Drop Unauthorized */

Chain FORWARD (policy DROP)
Chain OUTPUT (policy ACCEPT)`,

  'netstat -tulnp': `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      892/sshd            
tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN      1420/nginx: master  
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN      2105/mysqld         
tcp        0      0 0.0.0.0:8080            0.0.0.0:*               LISTEN      3341/api-gateway    
udp        0      0 0.0.0.0:53              0.0.0.0:*                           745/named`,

  'nmap -ss 192.168.1.1': `Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-14 16:30 IST
Nmap scan report for gateway.sec.internal (192.168.1.1)
Host is up (0.00042s latency).
Not shown: 995 closed tcp ports (reset)
PORT     STATE SERVICE
22/tcp   open  ssh
53/tcp   open  domain
80/tcp   open  http
443/tcp  open  https
8080/tcp open  http-proxy

Nmap done: 1 IP address (1 host up) scanned in 0.88 seconds`,

  'nmap -a target.org': `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for target.org (198.51.100.42)
Host is up (0.012s latency).
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 9.3p1 Ubuntu 1ubuntu3.2 (Ubuntu Linux; protocol 2.0)
80/tcp  open  http     nginx 1.24.0
|_http-server-header: nginx/1.24.0
|_http-title: Enterprise Defense Portal
443/tcp open  ssl/http nginx 1.24.0
|_ssl-cert: Subject: commonName=target.org/organizationName=Secure Corp
| ssl-enum-ciphers: 
|   TLSv1.3: 
|     TLS_AES_256_GCM_SHA384 (ecdh_x25519) - A
OS details: Linux 5.15 - 6.2 (Ubuntu / Debian)
Network Distance: 4 hops

OS and Service detection performed. Please report any incorrect results.`,

  'wireshark --summary': `[+] Wireshark Packet Analyzer Engine Capture Summary:
  Interface: eth0 (Promiscuous Mode Enabled)
  Total Packets Captured: 14,820 (Duration: 60.0s)
  
Protocol Breakdown:
  - TCP (Transmission Control Protocol) : 10,214 pkts (68.9%)
  - TLS/HTTPS (Encrypted Application)    :  3,140 pkts (21.2%)
  - DNS (Domain Name System Queries)    :    890 pkts ( 6.0%)
  - ARP (Address Resolution Protocol)   :    412 pkts ( 2.8%)
  - ICMP (Echo Requests & Replies)      :    164 pkts ( 1.1%)

Security Analysis:
  [*] 0 SYN Flood anomalies detected.
  [*] TLS 1.3 cryptographic session negotiations verified.
  [*] Zero unencrypted plain-text credentials found in HTTP streams.`,

  'hashcat -m 0 5d41402abc4b2a76b9719d911017c592': `hashcat (v6.2.6) starting...

Dictionary cache built:
* Filename..: rockyou.txt
* Passwords.: 14344384
* Bytes.....: 139921507

5d41402abc4b2a76b9719d911017c592:hello

Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 0 (MD5)
Hash.Target......: 5d41402abc4b2a76b9719d911017c592
Time.Started.....: Wed Oct 14 16:32:01 2026 (0 secs)
Speed.#1.........:  1182.4 MH/s (3.12ms)
Recovered........: 1/1 (100.00%) Digests, 1/1 (100.00%) Salts
Progress.........: 14344384/14344384 (100.00%)
Candidates.#1....: 123456 -> zzzzzzz

[+] Result: MD5(hello) = 5d41402abc4b2a76b9719d911017c592`,

  'openssl enc -aes-256': `[+] Generating 256-bit Key and IV from passphrase...
Cipher: AES-256-CBC
Key:  A872BF19E50B2C9177D4380E62198031FECA882194DFBA7032190A8719EEB012
IV:   9B2104E98711AA3C00281FCD8910482B
Encrypted Payload (Base64):
U2FsdGVkX18mZ2Gk0+mX7uF9P+kF1eN/3w8zF1d4TqL2+mO9Pq8vY1b...
[+] Verification: Ciphertext integrity preserved with PKCS#7 padding.`,

  'snort -a console': `Initializing Snort v2.9.20 GRE (Build 98)
Loading dynamic preprocessor libraries...
Reading network traffic signatures from /etc/snort/rules/snort.rules...
12,842 rules loaded successfully.

[**] [1:1000001:2] COMMUNITY WEB-ATTACK SQL Injection Attempt Detected [**]
[Priority: 1] 10/14-16:35:12.802194 198.51.100.88:49210 -> 192.168.1.1:80
TCP TTL:64 TOS:0x0 ID:34120 IpLen:20 DgmLen:240 DF
[Payload]: GET /login.php?user=admin%27%20OR%20%271%27=%271 HTTP/1.1
[Action]: Alert generated & forwarded to SIEM / IP blocked.`,

  'sqlmap -u': `[*] starting at 16:36:00

[INFO] testing connection to the target URL
[INFO] checking if the target is protected by some WAF/IPS
[INFO] testing if GET parameter 'id' is dynamic
[INFO] confirming parameter 'id' is injectable
[+] Parameter: id (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: id=1 AND 8821=8821
[INFO] fetching database names
available databases [2]:
[*] information_schema
[*] enterprise_defense_db

sqlmap identified the vulnerability. Defense recommendation: Use Parameterized Queries / Prepared Statements.`
};

export const CyberTerminalModal: React.FC<CyberTerminalModalProps> = ({
  isOpen,
  onClose,
  activeCommand
}) => {
  const [commandInput, setCommandInput] = useState<string>('');
  const [history, setHistory] = useState<Array<{ cmd: string; output: string }>>([
    {
      cmd: 'help',
      output: COMMAND_DATABASE['help']
    }
  ]);
  const [isMaximized, setIsMaximized] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeCommand?.command) {
      setCommandInput(activeCommand.command);
    }
  }, [activeCommand]);

  useEffect(() => {
    if (isOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen]);

  if (!isOpen) return null;

  const handleExecute = (cmdToRun?: string) => {
    const raw = (cmdToRun !== undefined ? cmdToRun : commandInput).trim();
    if (!raw) return;

    if (raw.toLowerCase() === 'clear') {
      setHistory([]);
      setCommandInput('');
      return;
    }

    // Match command against DB
    const lower = raw.toLowerCase();
    let response = '';

    for (const [key, out] of Object.entries(COMMAND_DATABASE)) {
      if (lower.startsWith(key) || key.startsWith(lower)) {
        response = out;
        break;
      }
    }

    if (!response) {
      if (lower.startsWith('ping')) {
        response = `PING ${raw.split(' ')[1] || '8.8.8.8'} (56 bytes of data):
64 bytes: icmp_seq=1 ttl=118 time=14.2 ms
64 bytes: icmp_seq=2 ttl=118 time=13.8 ms
64 bytes: icmp_seq=3 ttl=118 time=14.1 ms
--- ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, rtt min/avg/max = 13.8/14.0/14.2 ms`;
      } else if (lower.startsWith('traceroute')) {
        response = `traceroute to ${raw.split(' ')[1] || 'target.com'}, 30 hops max
 1  192.168.1.1 (192.168.1.1)  0.812 ms  0.640 ms  0.512 ms
 2  10.240.0.1 (10.240.0.1)  4.218 ms  3.890 ms  4.112 ms
 3  172.16.8.1 (172.16.8.1)  12.441 ms  11.890 ms  12.110 ms
 4  target.com (198.51.100.42)  14.210 ms  14.102 ms  14.080 ms`;
      } else {
        response = `bash: ${raw.split(' ')[0]}: command executed in simulated sandbox. Run 'help' to inspect authorized security utilities.`;
      }
    }

    setHistory(prev => [...prev, { cmd: raw, output: response }]);
    setCommandInput('');
  };

  const quickPills = [
    'nmap -sS 192.168.1.1',
    'wireshark --summary',
    'hashcat -m 0 5d41402abc4b2a76b9719d911017c592',
    'snort -A console',
    'iptables -L',
    'netstat -tulnp'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`relative w-full ${isMaximized ? 'h-[95vh]' : 'max-w-4xl h-[78vh]'} bg-[#0a0d12] border border-cyan-500/30 rounded-2xl flex flex-col shadow-2xl overflow-hidden font-mono`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d121a] border-b border-white/10 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer hover:opacity-80" onClick={onClose} />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-cyan-400 font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                root@dopilot-sec-lab:~#
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline font-mono text-[10px] text-slate/80 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                Linux Kali / Defensive Shell
              </span>
              <button
                type="button"
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1.5 rounded-lg text-slate hover:text-paper hover:bg-white/10 transition-colors"
                title={isMaximized ? 'Restore' : 'Maximize'}
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate hover:text-paper hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick-run Command Bar */}
          <div className="px-4 py-2 bg-[#090d14] border-b border-white/5 flex items-center gap-2 overflow-x-auto select-none scrollbar-none">
            <span className="text-[10px] text-slate shrink-0 uppercase tracking-wider font-bold">Quick Exec:</span>
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleExecute(pill)}
                className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-cyan-500/20 text-slate hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 text-[11px] font-mono shrink-0 transition-colors cursor-pointer flex items-center gap-1"
              >
                <TerminalIcon className="w-2.5 h-2.5 text-cyan-400" />
                <span>{pill.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Terminal Screen Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-mono select-text bg-[#070a0f]">
            <div className="text-cyan-400/90 leading-relaxed border-b border-white/5 pb-3">
              ============================================================<br />
              &nbsp;DO PILOT CYBER SECURITY INTERACTIVE COMMAND LAB<br />
              &nbsp;Environment: Defensive Linux Hardened Sandbox (ISO 27001 / NIST)<br />
              &nbsp;Type 'help' to review certified security tools and syntaxes.<br />
              ============================================================
            </div>

            {history.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <span className="text-cyan-400">root@dopilot-sec:~$</span>
                  <span className="text-paper">{item.cmd}</span>
                </div>
                <div className="text-slate/90 whitespace-pre-wrap pl-4 leading-relaxed font-mono bg-black/30 p-2.5 rounded border border-white/5">
                  {item.output}
                </div>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Command Prompt Input */}
          <div className="p-3 bg-[#0d121a] border-t border-white/10 flex items-center gap-2">
            <span className="text-cyan-400 text-xs font-bold shrink-0">root@sec:~$</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleExecute();
                }
              }}
              placeholder="Type security command (e.g., nmap -sS target, wireshark, snort, help)..."
              className="flex-1 bg-transparent text-paper placeholder-slate/50 font-mono text-xs focus:outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={() => handleExecute()}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500 text-ink font-bold text-xs hover:bg-white transition-colors cursor-pointer flex items-center gap-1 shadow-md shadow-cyan-500/20"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Run</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const CyberTerminalLauncherButton: React.FC<{
  command?: string;
  label?: string;
  className?: string;
}> = ({ command, label = 'Launch Cyber Terminal', className = '' }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={`px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${className}`}
        title="Open Interactive Cyber Security Lab Terminal"
      >
        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
        <span>{label}</span>
      </button>

      <CyberTerminalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        activeCommand={command ? { id: 'cmd', title: label, description: '', command } : null}
      />
    </>
  );
};
