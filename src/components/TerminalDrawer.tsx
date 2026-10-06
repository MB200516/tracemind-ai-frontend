import React, { useState, useRef, useEffect } from 'react';

interface TerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cluster: string;
}

interface CommandLog {
  id: number;
  type: 'input' | 'output' | 'error' | 'success';
  text: string;
}

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({
  isOpen,
  onClose,
  cluster
}) => {
  const [logs, setLogs] = useState<CommandLog[]>([
    { id: 1, type: 'output', text: `Connected to TraceMind SRE Autonomous Daemon (v2.8.4)` },
    { id: 2, type: 'output', text: `Context: ${cluster} | eBPF probes: ACTIVE [64/64 nodes synchronized]` },
    { id: 3, type: 'output', text: `Type 'help' to view available diagnostic commands.` }
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const newLogs: CommandLog[] = [
      ...logs,
      { id: Date.now(), type: 'input', text: `sre@${cluster}:~$ ${cmd}` }
    ];

    const lower = cmd.toLowerCase();

    if (lower === 'clear') {
      setLogs([]);
      setInputVal('');
      return;
    }

    if (lower === 'help') {
      newLogs.push({
        id: Date.now() + 1,
        type: 'output',
        text: `Available commands:
  kubectl get pods -n prod    List active kubernetes pods and eBPF hook status
  agent status                Check TraceMind Autonomous Agent throttle policy
  remediate shard-02          Trigger eviction thread lock bypass for redis-cache-tier
  threats list                List active suspicious signatures and IP origins
  traces tail                 Tail live OTLP span stream from ring buffer
  clear                       Clear the console screen
  exit                        Close the terminal console`
      });
    } else if (lower.includes('kubectl get pods')) {
      newLogs.push({
        id: Date.now() + 1,
        type: 'output',
        text: `NAME                                READY   STATUS    RESTARTS   AGE     HOOK
auth-gateway-7b9c9f4d8-21x          1/1     Running   0          42d     eBPF-OK
ingest-router-56fc87d4a-9lp         1/1     Running   0          19d     eBPF-OK
ml-inference-vllm-0                 1/1     Running   0          4d      eBPF-OK
trace-store-clickhouse-shard0       1/1     Running   0          12d     eBPF-OK
redis-cache-tier-shard02            1/1     Running   1 (12m)    8d      DEGRADED`
      });
    } else if (lower.includes('agent status')) {
      newLogs.push({
        id: Date.now() + 1,
        type: 'output',
        text: `TraceMind Autonomous Agent: ONLINE
Policy: AUTO-THROTTLE-L4
Active Regressions: 0 critical
Applied Actions: 1 routing optimization (canary weighted 10% shift)
SLO Target: 99.95% | Current SLO: 99.99%`
      });
    } else if (lower.includes('remediate shard-02')) {
      newLogs.push({
        id: Date.now() + 1,
        type: 'success',
        text: `[OK] Initiating eviction thread lock bypass on redis-cache-tier / shard-02...
[OK] Read threads released. Latency normalized to 0.8ms.
[OK] Shard replica sync offset acknowledged.`
      });
    } else if (lower.includes('threats list')) {
      newLogs.push({
        id: Date.now() + 1,
        type: 'output',
        text: `THR-102: Anomalous Token Extraction Burst [ACTIVE] -> 194.26.29.x (Tor Exit) -> Rate-throttled
THR-098: SQL Injection Pattern [BLOCKED] -> WAF Policy #402 applied
THR-094: Unauthorized gRPC Reflection Probe [DROPPED] -> mTLS rejected`
      });
    } else if (lower.includes('traces tail')) {
      newLogs.push({
        id: Date.now() + 1,
        type: 'output',
        text: `14:23:01.012 [200] POST /api/v2/inference/rag-completion 38.4ms
14:23:01.042 [200] GET  /v1/tokens/validate 1.8ms
14:23:01.110 [504] POST /vectors/knn-search 120.4ms (TIMEOUT)
14:23:01.144 [200] GET  /telemetry/probes/healthz 0.4ms`
      });
    } else if (lower === 'exit') {
      onClose();
      return;
    } else {
      newLogs.push({
        id: Date.now() + 1,
        type: 'error',
        text: `Command not recognized: '${cmd}'. Type 'help' for available commands.`
      });
    }

    setLogs(newLogs);
    setInputVal('');
  };

  return (
    <div className="fixed bottom-0 left-64 right-0 h-80 z-50 bg-[#0a0e17] border-t-2 border-[#00f0ff] shadow-2xl flex flex-col font-mono select-none">
      {/* Console Top Toolbar */}
      <div className="h-8 bg-[#181b25] px-3 flex items-center justify-between border-b border-[#262a34]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#00f0ff]">terminal</span>
          <span className="font-code-sm text-[11px] text-[#dfe2ef]">
            TraceMind SRE Debug Console — <span className="text-[#00dbe9]">{cluster}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLogs([])}
            className="font-code-sm text-[10px] text-[#849495] hover:text-[#dfe2ef] px-1.5 py-0.5"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="text-[#849495] hover:text-[#dfe2ef] transition-colors p-0.5"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      </div>

      {/* Console Log Output */}
      <div className="flex-1 p-3 overflow-y-auto font-code-sm text-[11px] leading-relaxed flex flex-col gap-1 text-[#dfe2ef]">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`whitespace-pre-wrap ${
              log.type === 'input'
                ? 'text-[#00f0ff] font-semibold'
                : log.type === 'error'
                ? 'text-[#ffb4ab]'
                : log.type === 'success'
                ? 'text-[#4edea3]'
                : 'text-[#b9cacb]'
            }`}
          >
            {log.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Command Input Prompt Form */}
      <form onSubmit={handleCommand} className="h-9 bg-[#181b25] px-3 flex items-center gap-2 border-t border-[#262a34]">
        <span className="text-[#4edea3] font-code-sm text-[11px]">sre@{cluster}:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type a command (try 'help', 'kubectl get pods', 'remediate shard-02')..."
          className="flex-1 bg-transparent font-code-sm text-[11px] text-[#dfe2ef] focus:outline-none placeholder-[#849495]"
        />
        <button type="submit" className="font-code-sm text-[10px] bg-[#262a34] px-2 py-0.5 text-[#00f0ff]">
          Run
        </button>
      </form>
    </div>
  );
};
