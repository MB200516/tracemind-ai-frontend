import React, { useState } from 'react';
import { Threat } from '../types';
import { THREATS_DATA } from '../data/mockData';

interface ThreatsViewProps {
  onShowToast: (message: string) => void;
}

export const ThreatsView: React.FC<ThreatsViewProps> = ({ onShowToast }) => {
  const [threats, setThreats] = useState<Threat[]>(THREATS_DATA);
  const [selectedThreatId, setSelectedThreatId] = useState<string>('THR-102');

  const selectedThreat: Threat =
    threats.find((t) => t.id === selectedThreatId) || threats[0];

  const handleExecuteCountermeasure = (actionName: string) => {
    onShowToast(`${actionName} - Action committed to firewall sync.`);
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Telemetry & Status Anchor */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6 pb-4 border-b border-[#1c1f29]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#849495]">
            <span className="material-symbols-outlined text-[16px] text-[#00f0ff]">
              shield_with_heart
            </span>
            <span className="font-label-caps text-[9px] uppercase tracking-wider text-[#849495]">
              SURVEILLANCE SUBSYSTEM // LIVE VECTOR WATCH
            </span>
          </div>
          <h1 className="font-headline-xl text-[28px] md:text-[32px] text-[#dfe2ef] tracking-tight font-semibold">
            Threat Detection & Security Telemetry
          </h1>
          <p className="font-body-md text-[13px] text-[#b9cacb] max-w-2xl">
            Deterministic anomaly isolation across distributed trace contexts and internal RPC
            boundaries.
          </p>
        </div>

        {/* Key Health Indicators */}
        <div className="flex items-stretch gap-2">
          <div className="bg-[#181b25] px-3.5 py-2 flex flex-col justify-between min-w-[120px] border border-[#262a34]">
            <span className="font-label-caps text-[9px] uppercase text-[#849495]">
              Active Threats
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-code-lg text-[18px] text-[#ffb4ab] font-semibold">01</span>
              <span className="w-1.5 h-1.5 bg-[#ffb4ab] rounded-full animate-ping"></span>
            </div>
          </div>
          <div className="bg-[#181b25] px-3.5 py-2 flex flex-col justify-between min-w-[120px] border border-[#262a34]">
            <span className="font-label-caps text-[9px] uppercase text-[#849495]">
              Blocked (24h)
            </span>
            <span className="font-code-lg text-[18px] text-[#4edea3] font-semibold mt-1">142</span>
          </div>
          <div className="bg-[#262a34] px-3.5 py-2 flex flex-col justify-between min-w-[130px] border border-[#353943]">
            <span className="font-label-caps text-[9px] uppercase text-[#849495]">
              Threat Level
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="material-symbols-outlined text-[16px] text-[#ffb2b7]">warning</span>
              <span className="font-code-sm text-[11px] text-[#fff3f2] font-semibold uppercase">
                Elevated
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Threat Surface Split: Feed & Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Vector Stream: Monitored Incidents List (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#849495]">radar</span>
              <span className="font-label-caps text-[9px] uppercase text-[#849495] tracking-wider">
                Monitored Vector Points (Recent 3)
              </span>
            </div>
            <span className="font-code-sm text-[#849495] text-[10px]">AUTO-REFRESH: 5s</span>
          </div>

          {/* Threat Items */}
          {threats.map((threat) => {
            const isSelected = selectedThreat.id === threat.id;
            return (
              <div
                key={threat.id}
                onClick={() => setSelectedThreatId(threat.id)}
                className={`cursor-pointer p-4 flex flex-col gap-2 transition-all border ${
                  isSelected
                    ? 'bg-[#181b25] border-[#00dbe9]'
                    : 'bg-[#0a0e17] hover:bg-[#181b25] border-[#1c1f29]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 font-code-sm text-[10px] ${
                        threat.status === 'ACTIVE'
                          ? 'bg-[#93000a] text-[#ffb4ab]'
                          : 'bg-[#262a34] text-[#849495]'
                      }`}
                    >
                      {threat.id}
                    </span>
                    <span className="font-code-md text-[13px] text-[#dfe2ef] font-semibold">
                      {threat.title}
                    </span>
                  </div>
                  <span
                    className={`font-code-sm text-[9px] px-1.5 py-0.5 ${
                      threat.status === 'ACTIVE'
                        ? 'bg-[#ffb4ab]/10 text-[#ffb4ab]'
                        : threat.status === 'BLOCKED'
                        ? 'bg-[#4edea3]/10 text-[#4edea3]'
                        : 'bg-[#262a34] text-[#849495]'
                    }`}
                  >
                    {threat.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-1 font-code-sm text-[11px]">
                  <div className="flex flex-col">
                    <span className="text-[#849495] uppercase text-[9px]">Endpoint Target</span>
                    <span className="text-[#00f0ff] truncate">{threat.endpoint}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#849495] uppercase text-[9px]">
                      {threat.origin ? 'IP Origin' : 'Mechanism'}
                    </span>
                    <span className="text-[#b9cacb] truncate">
                      {threat.origin} <span className="text-[#ffb4ab]">{threat.originType}</span>
                    </span>
                  </div>
                  <div className="flex flex-col col-span-2 md:col-span-1">
                    <span className="text-[#849495] uppercase text-[9px]">
                      {threat.anomalyScore ? 'Anomaly Score' : 'Trace Impact'}
                    </span>
                    <span
                      className={`font-semibold ${
                        threat.anomalyScore ? 'text-[#ffb4ab]' : 'text-[#dfe2ef]'
                      }`}
                    >
                      {threat.anomalyScore || threat.traceImpact}
                    </span>
                  </div>
                </div>

                {threat.status === 'ACTIVE' && (
                  <div className="bg-[#0a0e17] px-2.5 py-1.5 flex items-center justify-between mt-1 font-code-sm text-[10px] border border-[#1c1f29]">
                    <div className="flex items-center gap-1.5 text-[#849495]">
                      <span className="material-symbols-outlined text-[14px] text-[#00dbe9]">
                        verified_user
                      </span>
                      <span>Action: Rate-throttled & IP quarantined</span>
                    </div>
                    <span className="text-[#00f0ff] font-medium">Inspecting</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Latency Correlation Waveform */}
          <div className="bg-[#0a0e17] p-3 flex flex-col gap-2 mt-1 border border-[#1c1f29]">
            <div className="flex items-center justify-between font-label-caps text-[9px] text-[#849495]">
              <span>BURST FREQUENCY CORRELATION (TRACE-ID: 7a92-ef01)</span>
              <span className="text-[#ffb4ab] font-bold">98.4% CONFIDENCE</span>
            </div>
            <svg
              className="w-full h-12 text-[#ffb4ab]"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 500 50"
            >
              <path
                d="M0,45 L40,44 L80,45 L120,43 L160,44 L200,38 L240,42 L280,39 L310,41 L330,12 L340,3 L350,28 L360,6 L375,34 L390,44 L430,44 L470,45 L500,45"
                stroke="currentColor"
                strokeLinecap="square"
                strokeWidth="1.5"
              />
              <path
                d="M0,45 L40,44 L80,45 L120,43 L160,44 L200,38 L240,42 L280,39 L310,41 L330,12 L340,3 L350,28 L360,6 L375,34 L390,44 L430,44 L470,45 L500,45 L500,50 L0,50 Z"
                fill="currentColor"
                fillOpacity="0.08"
              />
            </svg>
          </div>
        </div>

        {/* Threat Inspection Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="bg-[#181b25] p-4 flex flex-col gap-3 border border-[#262a34]">
            {/* Inspector Header */}
            <div className="flex items-center justify-between pb-1 border-b border-[#262a34]">
              <div className="flex flex-col">
                <span className="font-label-caps text-[9px] uppercase text-[#849495]">
                  TELEMETRY DIAGNOSTIC
                </span>
                <span className="font-code-md text-[13px] text-[#dfe2ef] font-semibold">
                  {selectedThreat.id}: Deep Payload Audit
                </span>
              </div>
              <span className="material-symbols-outlined text-[#849495] text-[18px]">terminal</span>
            </div>

            {/* Decoded Trace Signature Snippet */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between font-label-caps text-[9px] text-[#849495]">
                <span>DECODED TRACE SIGNATURE</span>
                <span>JSON-RPC</span>
              </div>
              <pre className="bg-[#0a0e17] p-2.5 font-code-sm text-[10px] text-[#dfe2ef] overflow-x-auto leading-relaxed border border-[#1c1f29]">
                <code>
                  {`{\n`}
                  {`  "trace_id": `}
                  <span className="text-[#00f0ff]">"{selectedThreat.decodedSignature.trace_id}"</span>
                  {`,\n  "vector": `}
                  <span className="text-[#ffb4ab]">"{selectedThreat.decodedSignature.vector}"</span>
                  {`,\n  "target": `}
                  <span className="text-[#4edea3]">"{selectedThreat.decodedSignature.target}"</span>
                  {`,\n  "entropy_variance": `}
                  <span className="text-[#fff3f2]">
                    {selectedThreat.decodedSignature.entropy_variance}
                  </span>
                  {`,\n  "payload_probe": {\n`}
                  {`    "tokens_requested": `}
                  <span className="text-[#dfe2ef]">
                    {selectedThreat.decodedSignature.payload_probe.tokens_requested}
                  </span>
                  {`,\n    "concurrency": `}
                  <span className="text-[#dfe2ef]">
                    {selectedThreat.decodedSignature.payload_probe.concurrency}
                  </span>
                  {`,\n    "auth_context": `}
                  <span className="text-[#ffb4ab]">
                    "{selectedThreat.decodedSignature.payload_probe.auth_context}"
                  </span>
                  {`\n  }\n}`}
                </code>
              </pre>
            </div>

            {/* Blast Radius / Service Impact Indicator */}
            <div className="flex flex-col gap-1">
              <span className="font-label-caps text-[9px] uppercase text-[#849495]">
                Blast Radius Isolation
              </span>
              <div className="bg-[#0a0e17] p-2.5 flex flex-col gap-2 border border-[#1c1f29]">
                <div className="flex items-center justify-between font-code-sm text-[10px]">
                  <span className="text-[#dfe2ef]">
                    Upstream: {selectedThreat.upstreamQuarantined}
                  </span>
                  <span className="text-[#ffb4ab] font-medium">QUARANTINED</span>
                </div>
                {/* 3-segment Topology Bar */}
                <div className="w-full h-1.5 bg-[#262a34] flex overflow-hidden">
                  <div className="bg-[#ffb4ab] w-1/3" title="Edge Layer Quarantined"></div>
                  <div className="bg-[#4edea3] w-1/3" title="LLM Gateway Healthy"></div>
                  <div className="bg-[#4edea3] w-1/3" title="Internal Vector DB Secure"></div>
                </div>
                <div className="flex items-center justify-between font-code-sm text-[9px] text-[#849495] pt-0.5">
                  <span>
                    Core LLM Gateway: <b className="text-[#dfe2ef]">Intact</b>
                  </span>
                  <span>
                    DB: <b className="text-[#dfe2ef]">No Spillage</b>
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Mitigation Actions */}
            <div className="flex flex-col gap-1 pt-1 border-t border-[#262a34]">
              <span className="font-label-caps text-[9px] uppercase text-[#849495]">
                Execute Countermeasure
              </span>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => handleExecuteCountermeasure('IP Range 194.26.29.0/24 Blocked')}
                  className="w-full bg-[#dbfcff] hover:bg-[#7df4ff] text-[#00363a] font-code-md text-[11px] font-semibold py-2 px-3 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">block</span>
                  <span>Block IP Range (194.26.29.0/24)</span>
                </button>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleExecuteCountermeasure('Session Auth Revoked')}
                    className="bg-[#262a34] hover:bg-[#353943] text-[#dfe2ef] font-code-sm text-[10px] py-1.5 px-2 flex items-center justify-center gap-1 transition-colors border border-[#3b494b] cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[13px] text-[#ffb4ab]">
                      key_off
                    </span>
                    <span>Revoke Token</span>
                  </button>
                  <button
                    onClick={() => handleExecuteCountermeasure('Marked as False Positive')}
                    className="bg-[#262a34] hover:bg-[#353943] text-[#849495] hover:text-[#dfe2ef] font-code-sm text-[10px] py-1.5 px-2 flex items-center justify-center gap-1 transition-colors border border-[#3b494b] cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    <span>Dismiss Anomaly</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
