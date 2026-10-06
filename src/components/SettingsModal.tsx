import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [sampleRate, setSampleRate] = useState('100%');
  const [otlpEndpoint, setOtlpEndpoint] = useState('otlp-grpc.internal.cluster:4317');
  const [retentionDays, setRetentionDays] = useState('30');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#070b13]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#181b25] border border-[#262a34] w-full max-w-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#262a34] bg-[#0a0e17]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#849495] text-[20px]">
              settings
            </span>
            <span className="font-headline-md text-[14px] text-[#dfe2ef] font-semibold">
              Cluster Observability Settings
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#849495] hover:text-[#dfe2ef] p-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-3 font-code-sm text-[11px]">
          <div className="flex flex-col gap-1">
            <span className="text-[#849495] text-[10px] uppercase">eBPF Probe Sampling Rate</span>
            <select
              value={sampleRate}
              onChange={(e) => setSampleRate(e.target.value)}
              className="bg-[#0a0e17] border border-[#262a34] p-1.5 text-[#dfe2ef] focus:outline-none"
            >
              <option value="100%">100% Full Trace Ingestion (Deterministic)</option>
              <option value="50%">50% Adaptive eBPF Sampling</option>
              <option value="10%">10% Low-Impact Production Sampling</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[#849495] text-[10px] uppercase">OpenTelemetry Collector Endpoint</span>
            <input
              type="text"
              value={otlpEndpoint}
              onChange={(e) => setOtlpEndpoint(e.target.value)}
              className="bg-[#0a0e17] border border-[#262a34] p-1.5 text-[#dfe2ef] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[#849495] text-[10px] uppercase">Telemetry Retention Window</span>
            <select
              value={retentionDays}
              onChange={(e) => setRetentionDays(e.target.value)}
              className="bg-[#0a0e17] border border-[#262a34] p-1.5 text-[#dfe2ef] focus:outline-none"
            >
              <option value="7">7 Days (Hot SSD Cache)</option>
              <option value="30">30 Days (Standard Analytics)</option>
              <option value="90">90 Days (Extended Regulatory Audit)</option>
            </select>
          </div>
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
              onSave();
              onClose();
            }}
            className="px-3 py-1 bg-[#dbfcff] hover:bg-[#7df4ff] text-[#00363a] font-code-sm text-[11px] font-semibold transition-colors cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
