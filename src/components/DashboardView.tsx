import React, { useState, useEffect } from 'react';
import { MicroserviceStatus, ActiveTab } from '../types';
import { MICROSERVICES } from '../data/mockData';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAgentConfig: () => void;
  onInspectTrace: (spanId: string) => void;
  cluster: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onOpenAgentConfig,
  onInspectTrace,
  cluster
}) => {
  const [services, setServices] = useState<MicroserviceStatus[]>(MICROSERVICES);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  // Micro-telemetry refresh pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setServices((prev) =>
        prev.map((svc) => {
          if (svc.id === 'ml-inference') {
            const delta = (Math.random() * 0.8 - 0.4).toFixed(1);
            const newLat = (28.9 + parseFloat(delta)).toFixed(1);
            return { ...svc, latencyP99: `${newLat}ms` };
          }
          return svc;
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full pb-6 gap-5">
      {/* Top Sub-Header & Agent Notification Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-[#181b25] px-3 py-2 border border-[#262a34] shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 bg-[#4edea3] animate-pulse shrink-0"></span>
          <span className="font-label-caps text-[#4edea3] tracking-wider uppercase text-[10px]">
            TraceMind Autonomous Agent
          </span>
          <span className="text-[#3b494b] font-code-sm">/</span>
          <span className="font-code-sm text-[#b9cacb] truncate text-[11px]">
            0 critical regressions in the last 24h. 1 routing optimization applied.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-code-sm text-[#849495] text-[10px]">
            POLICY: AUTO-THROTTLE-L4
          </span>
          <button
            onClick={onOpenAgentConfig}
            className="bg-[#262a34] hover:bg-[#353943] text-[#dfe2ef] px-2 py-1 font-code-sm text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">tune</span>
            <span>Config</span>
          </button>
        </div>
      </div>

      {/* 4 High-Level Key Performance Telemetry Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Cluster Health */}
        <div className="bg-[#181b25] p-4 flex flex-col justify-between border border-[#262a34] hover:bg-[#1c1f29] transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[#849495] uppercase tracking-wider text-[10px]">
              Cluster Health
            </span>
            <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
              check_circle
            </span>
          </div>
          <div className="mt-3">
            <div className="font-headline-lg text-[#4edea3] tracking-tight text-[22px] font-semibold">
              Nominal
            </div>
            <div className="font-code-sm text-[#849495] mt-1 flex items-center gap-1 text-[11px]">
              <span>64/64 Nodes Synchronized</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Global Throughput */}
        <div className="bg-[#181b25] p-4 flex flex-col justify-between border border-[#262a34] hover:bg-[#1c1f29] transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[#849495] uppercase tracking-wider text-[10px]">
              Global Throughput
            </span>
            <span className="material-symbols-outlined text-[#00dbe9] text-[20px]">
              speed
            </span>
          </div>
          <div className="mt-3">
            <div className="font-headline-lg text-[#dfe2ef] tracking-tight text-[22px] font-semibold">
              42.8k <span className="font-body-sm text-[#849495] text-[12px] font-normal">req/s</span>
            </div>
            <div className="font-code-sm text-[#4edea3] mt-1 flex items-center gap-1 text-[11px]">
              <span className="material-symbols-outlined text-[13px]">trending_up</span>
              <span>+3.2% vs previous hour</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Avg Latency */}
        <div className="bg-[#181b25] p-4 flex flex-col justify-between border border-[#262a34] hover:bg-[#1c1f29] transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[#849495] uppercase tracking-wider text-[10px]">
              Avg Latency (p95)
            </span>
            <span className="material-symbols-outlined text-[#849495] text-[20px]">
              timer
            </span>
          </div>
          <div className="mt-3">
            <div className="font-headline-lg text-[#dfe2ef] tracking-tight text-[22px] font-semibold">
              14.2 <span className="font-body-sm text-[#849495] text-[12px] font-normal">ms</span>
            </div>
            <div className="font-code-sm text-[#849495] mt-1 flex items-center gap-1 text-[11px]">
              <span>Target threshold &lt; 25.0ms</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Active Anomaly */}
        <div className="bg-[#181b25] p-4 flex flex-col justify-between border border-[#262a34] hover:bg-[#1c1f29] transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[#849495] uppercase tracking-wider text-[10px]">
              Active Anomaly
            </span>
            <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
              verified_user
            </span>
          </div>
          <div className="mt-3">
            <div className="font-headline-lg text-[#dfe2ef] tracking-tight text-[22px] font-semibold">
              None
            </div>
            <div className="font-code-sm text-[#4edea3] mt-1 flex items-center gap-1 text-[11px]">
              <span>Deterministic state verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Overview Grid: Service Health & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Microservice Telemetry Status List (5 Key Services) */}
        <div className="lg:col-span-7 bg-[#181b25] p-4 border border-[#262a34] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-label-caps text-[#849495] uppercase tracking-wider text-[10px]">
                  Microservice Health Status
                </span>
                <span className="bg-[#31353f] font-code-sm text-[#b9cacb] px-1.5 py-0.5 text-[9px]">
                  5 ONLINE
                </span>
              </div>
              <span className="font-code-sm text-[#849495] text-[10px]">AUTO-REFRESH: 1s</span>
            </div>

            {/* Microservice Table Headers */}
            <div className="grid grid-cols-12 font-code-sm text-[#849495] pb-1.5 mb-1.5 border-b border-[#262a34] text-[10px]">
              <div className="col-span-5 uppercase">Service Identifier</div>
              <div className="col-span-3 text-right uppercase">Latency (p99)</div>
              <div className="col-span-2 text-right uppercase">Error Rate</div>
              <div className="col-span-2 text-right uppercase">State</div>
            </div>

            {/* Service Rows */}
            <div className="flex flex-col gap-1">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  onClick={() => setActiveTab('traces')}
                  className="grid grid-cols-12 items-center bg-[#0a0e17] px-2.5 py-2 hover:bg-[#1c1f29] transition-colors cursor-pointer border border-transparent hover:border-[#353943]"
                  title="Click to view distributed topology for this service"
                >
                  <div className="col-span-5 flex items-center gap-2 min-w-0">
                    <span
                      className={`w-1.5 h-1.5 shrink-0 ${
                        svc.state === 'OPTIMIZED' ? 'bg-[#00f0ff]' : 'bg-[#4edea3]'
                      }`}
                    ></span>
                    <span className="font-code-md text-[#dfe2ef] truncate text-[11px]">
                      {svc.name}
                    </span>
                  </div>
                  <div
                    className={`col-span-3 font-code-md text-right text-[11px] ${
                      svc.state === 'OPTIMIZED' ? 'text-[#00dbe9]' : 'text-[#dfe2ef]'
                    }`}
                  >
                    {svc.latencyP99}
                  </div>
                  <div className="col-span-2 font-code-md text-right text-[#4edea3] text-[11px]">
                    {svc.errorRate}
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <span
                      className={`px-1.5 py-0.5 font-code-sm text-[9px] ${
                        svc.state === 'OPTIMIZED'
                          ? 'bg-[#262a34] text-[#00dbe9]'
                          : 'bg-[#262a34] text-[#4edea3]'
                      }`}
                    >
                      {svc.state}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footnote Status */}
          <div className="mt-3 pt-2 border-t border-[#262a34] flex items-center justify-between font-code-sm text-[#849495] text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">format_image_left</span>
              <span>All upstream ingress verified via eBPF probes</span>
            </div>
            <span className="text-[#dfe2ef]">SLO: 99.95%</span>
          </div>
        </div>

        {/* Live Minimal Activity Timeline / Throughput Curve */}
        <div className="lg:col-span-5 bg-[#181b25] p-4 border border-[#262a34] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-label-caps text-[#849495] uppercase tracking-wider text-[10px]">
                Trace Throughput Curve
              </span>
              <div className="flex items-center gap-1 font-code-sm text-[10px]">
                <span className="w-2 h-0.5 bg-[#00dbe9]"></span>
                <span className="text-[#b9cacb]">60-MIN WINDOW</span>
              </div>
            </div>

            {/* Minimalist Vector Chart */}
            <div className="w-full h-44 bg-[#0a0e17] p-2 flex flex-col justify-between relative overflow-hidden border border-[#262a34]">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
                <div className="w-full h-[1px] bg-[#849495]"></div>
                <div className="w-full h-[1px] bg-[#849495]"></div>
                <div className="w-full h-[1px] bg-[#849495]"></div>
                <div className="w-full h-[1px] bg-[#849495]"></div>
              </div>

              {/* SVG Vector Data Line */}
              <div className="relative w-full h-full flex items-end">
                <svg
                  className="w-full h-full text-[#00dbe9]"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 400 120"
                >
                  {/* Trace Area Fill */}
                  <path
                    d="M0,85 L30,82 L65,70 L100,75 L140,55 L175,62 L210,40 L245,46 L280,30 L315,34 L350,22 L385,25 L400,20 L400,120 L0,120 Z"
                    fill="currentColor"
                    fillOpacity="0.08"
                  />
                  {/* Primary Trace Stroke */}
                  <path
                    d="M0,85 L30,82 L65,70 L100,75 L140,55 L175,62 L210,40 L245,46 L280,30 L315,34 L350,22 L385,25 L400,20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Current Point Indicator with subtle pulse */}
                  <circle cx="400" cy="20" fill="#00F0FF" r="3.5" />
                  <circle cx="400" cy="20" fill="#00F0FF" r="6" opacity="0.3" className="animate-ping" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between font-code-sm text-[#849495] mt-2 px-1 text-[10px]">
              <span>T-60m</span>
              <span>T-30m</span>
              <span>T-15m</span>
              <span className="text-[#4edea3] font-semibold">NOW (42.8k)</span>
            </div>
          </div>

          {/* Metrics Strip under chart */}
          <div className="mt-3 grid grid-cols-3 gap-2 pt-2 border-t border-[#262a34]">
            <div className="bg-[#0a0e17] p-2 flex flex-col border border-[#1c1f29]">
              <span className="font-code-sm text-[#849495] text-[9px]">PEAK</span>
              <span className="font-code-md text-[#dfe2ef] font-semibold text-[12px]">46.1k/s</span>
            </div>
            <div className="bg-[#0a0e17] p-2 flex flex-col border border-[#1c1f29]">
              <span className="font-code-sm text-[#849495] text-[9px]">VALLEY</span>
              <span className="font-code-md text-[#dfe2ef] font-semibold text-[12px]">39.4k/s</span>
            </div>
            <div className="bg-[#0a0e17] p-2 flex flex-col border border-[#1c1f29]">
              <span className="font-code-sm text-[#849495] text-[9px]">DROP RATE</span>
              <span className="font-code-md text-[#4edea3] font-semibold text-[12px]">0.000%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Incident-Free Trace Stream Breadcrumb Bar */}
      <div className="bg-[#181b25] px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-[#262a34] shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <span className="material-symbols-outlined text-[#849495] text-[22px]">data_object</span>
          <div className="flex flex-col">
            <span className="font-label-caps text-[#849495] uppercase tracking-wider text-[10px]">
              Trace Context Ingestion
            </span>
            <span className="font-code-sm text-[#dfe2ef] truncate text-[11px]">
              Span ID: <span className="text-[#00dbe9] font-medium">0x8f4c2e091b64a</span> | Context:{' '}
              <span className="text-[#b9cacb]">{cluster} / ml-inference / postprocess</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="font-code-sm text-[#849495] text-[11px]">Span Duration: 2.14ms</span>
          <button
            onClick={() => onInspectTrace('0x8f4c2e091b64a')}
            className="bg-[#dbfcff] text-[#00363a] px-3 py-1 font-code-sm text-[11px] font-semibold uppercase tracking-wider hover:bg-[#00dbe9] transition-colors cursor-pointer"
            type="button"
          >
            Inspect Trace
          </button>
        </div>
      </div>
    </div>
  );
};
