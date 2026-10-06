import React, { useState } from 'react';

interface AgentConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (policy: string) => void;
}

export const AgentConfigModal: React.FC<AgentConfigModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [selectedPolicy, setSelectedPolicy] = useState('AUTO-THROTTLE-L4');
  const [circuitBreakerThreshold, setCircuitBreakerThreshold] = useState(2.0);
  const [autoRollback, setAutoRollback] = useState(true);

  if (!isOpen) return null;

  const policies = [
    { id: 'AUTO-THROTTLE-L1', desc: 'Passive Logging & Shadow Testing (Zero active intervention)' },
    { id: 'AUTO-THROTTLE-L2', desc: 'Canary Rerouting (Redirect up to 10% degrading traffic)' },
    { id: 'AUTO-THROTTLE-L3', desc: 'Aggressive Rate-Shaping (Auto-shed lowest priority queues)' },
    { id: 'AUTO-THROTTLE-L4', desc: 'Full Mesh Autonomous Balancing (Circuit breakers + failover replicas)' },
    { id: 'AUTO-THROTTLE-L5', desc: 'Emergency Hard Isolation (Isolate suspicious nodes instantly)' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#070b13]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#181b25] border border-[#262a34] w-full max-w-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#262a34] bg-[#0a0e17]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
              tune
            </span>
            <div className="flex flex-col">
              <span className="font-headline-md text-[14px] text-[#dfe2ef] font-semibold">
                TraceMind Autonomous Agent Configuration
              </span>
              <span className="font-code-sm text-[10px] text-[#849495]">
                Real-Time Traffic Optimization & Self-Healing Policies
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#849495] hover:text-[#dfe2ef] p-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 flex flex-col gap-4 font-code-sm text-[11px]">
          {/* Policy Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="font-label-caps text-[9px] uppercase text-[#849495]">
              ACTIVE MITIGATION TIER
            </span>
            <div className="flex flex-col gap-1">
              {policies.map((p) => (
                <label
                  key={p.id}
                  onClick={() => setSelectedPolicy(p.id)}
                  className={`flex items-start gap-2.5 p-2 border cursor-pointer transition-colors ${
                    selectedPolicy === p.id
                      ? 'bg-[#1c1f29] border-[#00f0ff]'
                      : 'bg-[#0a0e17] border-[#262a34] hover:bg-[#181b25]'
                  }`}
                >
                  <input
                    type="radio"
                    name="policy"
                    checked={selectedPolicy === p.id}
                    onChange={() => setSelectedPolicy(p.id)}
                    className="mt-0.5 accent-[#00f0ff]"
                  />
                  <div className="flex flex-col">
                    <span className={`font-semibold ${selectedPolicy === p.id ? 'text-[#00f0ff]' : 'text-[#dfe2ef]'}`}>
                      {p.id}
                    </span>
                    <span className="text-[#849495] text-[10px]">{p.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Slider */}
          <div className="flex flex-col gap-1.5 bg-[#0a0e17] p-2.5 border border-[#262a34]">
            <div className="flex items-center justify-between text-[#dfe2ef]">
              <span>Circuit Breaker Error Threshold</span>
              <span className="text-[#00f0ff] font-semibold">{circuitBreakerThreshold}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.5"
              value={circuitBreakerThreshold}
              onChange={(e) => setCircuitBreakerThreshold(parseFloat(e.target.value))}
              className="accent-[#00f0ff] cursor-pointer"
            />
            <span className="text-[9px] text-[#849495]">
              Threshold at which upstream traffic begins progressive shed to standby regional clusters.
            </span>
          </div>

          {/* Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer text-[#dfe2ef]">
            <input
              type="checkbox"
              checked={autoRollback}
              onChange={(e) => setAutoRollback(e.target.checked)}
              className="accent-[#00f0ff] w-3.5 h-3.5"
            />
            <span>Autonomous Canary Rollback on Regression Detection (&gt;10% P99 variance)</span>
          </label>
        </div>

        {/* Footer */}
        <div className="bg-[#0a0e17] p-3 border-t border-[#262a34] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#181b25] hover:bg-[#262a34] text-[#849495] hover:text-[#dfe2ef] font-code-sm text-[11px] transition-colors border border-[#262a34] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(selectedPolicy);
              onClose();
            }}
            className="px-3 py-1 bg-[#dbfcff] hover:bg-[#7df4ff] text-[#00363a] font-code-sm text-[11px] font-semibold transition-colors cursor-pointer"
          >
            Apply Policy
          </button>
        </div>
      </div>
    </div>
  );
};
