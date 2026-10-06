import React, { useState, useEffect, useRef } from 'react';
import { TopologyNode } from '../types';
import { TOPOLOGY_NODES, LIVE_SPANS_BUFFER } from '../data/mockData';

interface TracesViewProps {
  onOpenFlamegraph: (serviceName: string) => void;
  onDownloadTelemetry: () => void;
  onInspectSpan: (spanId: string) => void;
}

interface Particle {
  id: number;
  pathId: string;
  progress: number;
  speed: number;
  isAmber: boolean;
  size: number;
}

export const TracesView: React.FC<TracesViewProps> = ({
  onOpenFlamegraph,
  onDownloadTelemetry,
  onInspectSpan
}) => {
  const [searchQuery, setSearchQuery] = useState('tr-8891f-ingest-v2');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ok' | 'error'>('all');
  const [flowSpeed, setFlowSpeed] = useState<number>(1.0);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-llm');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

  const selectedNode: TopologyNode = TOPOLOGY_NODES[selectedNodeId] || TOPOLOGY_NODES['node-llm'];

  // Particle simulation loop
  const [particles, setParticles] = useState<Particle[]>([]);
  const pathIds = [
    'path-c1-gw', 'path-c2-gw', 'path-c2-auth',
    'path-gw-route', 'path-gw-ingest', 'path-gw-llm',
    'path-auth-ingest', 'path-auth-pay',
    'path-route-llm', 'path-ingest-llm',
    'path-route-redis', 'path-ingest-pg',
    'path-llm-vector', 'path-pay-pg',
    'path-llm-redis', 'path-ingest-vector'
  ];

  // Initialize particle pool
  useEffect(() => {
    const initialParticles: Particle[] = Array.from({ length: 42 }).map((_, i) => ({
      id: i,
      pathId: pathIds[Math.floor(Math.random() * pathIds.length)],
      progress: Math.random(),
      speed: (0.003 + Math.random() * 0.005) * (Math.random() < 0.22 ? 0.65 : 1.1),
      isAmber: Math.random() < 0.22,
      size: Math.random() < 0.22 ? 3.5 : 2.6
    }));
    setParticles(initialParticles);
  }, []);

  // Animation frame updater
  useEffect(() => {
    if (flowSpeed === 0) return;
    let animId: number;

    const tick = () => {
      setParticles((prev) =>
        prev.map((p) => {
          let nextProgress = p.progress + p.speed * flowSpeed;
          let nextPathId = p.pathId;
          if (nextProgress >= 1) {
            nextProgress = 0;
            nextPathId = pathIds[Math.floor(Math.random() * pathIds.length)];
          }
          return {
            ...p,
            progress: nextProgress,
            pathId: nextPathId
          };
        })
      );
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [flowSpeed]);

  const cycleSpeed = () => {
    if (flowSpeed === 1.0) setFlowSpeed(2.0);
    else if (flowSpeed === 2.0) setFlowSpeed(0.5);
    else if (flowSpeed === 0.5) setFlowSpeed(0);
    else setFlowSpeed(1.0);
  };

  const getSpeedLabel = () => {
    if (flowSpeed === 0) return 'PAUSED';
    return `${flowSpeed}x LIVE`;
  };

  // Node Tier Visibility Filter
  const isNodeVisible = (tier: string) => {
    if (selectedTier === 'all') return true;
    return selectedTier === tier;
  };

  return (
    <div className="flex flex-col w-full pb-6">
      {/* System Diagnostic Header / Search Console */}
      <div className="flex flex-col gap-2 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0a0e17] p-2 border border-[#1c1f29]">
          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[320px]">
            <div className="flex items-center bg-[#181b25] px-2.5 py-1 border border-[#262a34] flex-1 min-w-[260px] max-w-md">
              <span className="material-symbols-outlined text-[#849495] text-[16px] pr-2">search</span>
              <input
                className="bg-transparent font-code-sm text-[#00f0ff] placeholder-[#849495] focus:outline-none w-full text-[11px]"
                id="traceQueryInput"
                placeholder="Trace ID: tr-9940x-llm-sync / Span ID..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="font-label-caps text-[9px] bg-[#31353f] text-[#849495] px-1 py-0.5 ml-1">
                REGEX
              </span>
            </div>

            {/* Tier Selector */}
            <div className="flex items-center bg-[#181b25] px-2.5 py-1 border border-[#262a34] gap-1.5">
              <span className="font-label-caps text-[9px] text-[#849495]">TIER</span>
              <select
                className="bg-transparent font-code-sm text-[#dfe2ef] focus:outline-none cursor-pointer text-[11px]"
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
              >
                <option value="all" className="bg-[#181b25]">ALL TIERS (4)</option>
                <option value="client" className="bg-[#181b25]">T1: INGRESS / CLIENT</option>
                <option value="edge" className="bg-[#181b25]">T2: EDGE GATEWAY</option>
                <option value="app" className="bg-[#181b25]">T3: CORE RUNTIME</option>
                <option value="persist" className="bg-[#181b25]">T4: PERSISTENCE</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-[#181b25] px-2 py-1 border border-[#262a34] gap-1">
              <span className="font-label-caps text-[9px] text-[#849495] mr-1">STATUS</span>
              <button
                onClick={() => setStatusFilter(statusFilter === 'ok' ? 'all' : 'ok')}
                className={`px-1.5 py-0.5 font-code-sm text-[10px] transition-colors ${
                  statusFilter === 'ok'
                    ? 'bg-[#003824] text-[#4edea3] border border-[#4edea3]'
                    : 'bg-[#1c1f29] text-[#4edea3] hover:bg-[#262a34]'
                }`}
              >
                200 OK
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === 'error' ? 'all' : 'error')}
                className={`px-1.5 py-0.5 font-code-sm text-[10px] transition-colors ${
                  statusFilter === 'error'
                    ? 'bg-[#690005] text-[#ffb4ab] border border-[#ffb4ab]'
                    : 'bg-[#181b25] text-[#ffb4ab] hover:bg-[#262a34]'
                }`}
              >
                ERRORS (3)
              </button>
            </div>

            {/* Speed Simulation Toggle */}
            <div className="flex items-center bg-[#181b25] px-2 py-1 border border-[#262a34] gap-1">
              <span className="font-label-caps text-[9px] text-[#849495]">FLOW:</span>
              <button
                onClick={cycleSpeed}
                className="font-code-sm text-[11px] text-[#00dbe9] hover:text-[#00f0ff] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">speed</span>
                <span>{getSpeedLabel()}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex items-center gap-3 font-code-sm text-[11px]">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
              <span className="text-[#849495]">PACKETS:</span>
              <span className="text-[#00f0ff]">1.82k/s</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#849495]">P95 LATENCY:</span>
              <span className="text-[#4edea3]">18.4ms</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#849495]">DROPPED:</span>
              <span className="text-[#ffb4ab]">0.002%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Topology Viewport and Inspector Slideout Layout */}
      <div className="relative w-full flex overflow-hidden border border-[#1c1f29] bg-[#0a0e17] min-h-[720px]">
        {/* Distributed Topology Interactive SVG Canvas Area */}
        <div className="relative flex-1 h-[720px] overflow-hidden select-none bg-[#0a0e17]">
          {/* Radial Grid Floor Accent */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #353943 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Tier Header Annotations overlay */}
          <div className="absolute top-2 left-6 right-6 flex justify-between pointer-events-none z-10 font-label-caps text-[9px] text-[#849495] uppercase tracking-wider">
            <div className={`flex items-center gap-1.5 ${selectedTier === 'client' ? 'text-[#00f0ff] font-bold' : ''}`}>
              <span className="w-1.5 h-1.5 bg-[#849495]"></span>
              <span>Tier 01 // Client Ingress</span>
            </div>
            <div className={`flex items-center gap-1.5 ${selectedTier === 'edge' ? 'text-[#00f0ff] font-bold' : ''}`}>
              <span className="w-1.5 h-1.5 bg-[#00dbe9]"></span>
              <span>Tier 02 // Edge Mesh</span>
            </div>
            <div className={`flex items-center gap-1.5 ${selectedTier === 'app' ? 'text-[#00f0ff] font-bold' : ''}`}>
              <span className="w-1.5 h-1.5 bg-[#4edea3]"></span>
              <span>Tier 03 // Core Application Runtime</span>
            </div>
            <div className={`flex items-center gap-1.5 ${selectedTier === 'persist' ? 'text-[#00f0ff] font-bold' : ''}`}>
              <span className="w-1.5 h-1.5 bg-[#ffb2b7]"></span>
              <span>Tier 04 // State & Vector Persistence</span>
            </div>
          </div>

          {/* Zoom / Pan HUD Overlay controls */}
          <div className="absolute bottom-4 left-4 flex items-center bg-[#262a34]/90 backdrop-blur border border-[#3b494b] p-0.5 gap-1 z-20">
            <button
              onClick={() => setZoomScale((z) => Math.min(z + 0.15, 1.6))}
              className="w-7 h-7 flex items-center justify-center text-[#dfe2ef] hover:bg-[#353943] text-code-md font-semibold cursor-pointer"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => setZoomScale((z) => Math.max(z - 0.15, 0.7))}
              className="w-7 h-7 flex items-center justify-center text-[#dfe2ef] hover:bg-[#353943] text-code-md font-semibold cursor-pointer"
              title="Zoom Out"
            >
              -
            </button>
            <button
              onClick={() => {
                setZoomScale(1.0);
                setSelectedTier('all');
                setStatusFilter('all');
              }}
              className="px-2 h-7 flex items-center justify-center text-[#849495] hover:text-[#dfe2ef] font-code-sm text-[10px] cursor-pointer"
            >
              RESET
            </button>
          </div>

          {/* Live Flow Indicator Badge */}
          <div className="absolute top-8 right-6 bg-[#262a34]/90 backdrop-blur border border-[#3b494b] px-3 py-1 flex items-center gap-2 z-20">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
              <span className="font-code-sm text-[10px] text-[#dfe2ef] font-medium">
                CYAN: 200 OK STREAM
              </span>
            </div>
            <div className="flex items-center gap-1.5 pl-2 border-l border-[#31353f]">
              <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping"></span>
              <span className="font-code-sm text-[10px] text-[#ffb4ab] font-medium">
                AMBER: RETRY / HIGH P95
              </span>
            </div>
          </div>

          {/* SVG Topology Map */}
          <svg
            className="w-full h-full cursor-default"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 1080 720"
            style={{ transform: `scale(${zoomScale})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
          >
            <defs>
              <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="cylinderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#262a34" />
                <stop offset="100%" stopColor="#181b25" />
              </linearGradient>
            </defs>

            {/* Connecting Vector Paths */}
            <g fill="none" stroke="#262a34" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75">
              <path d="M 120 220 L 260 270" id="path-c1-gw" />
              <path d="M 120 440 L 260 300" id="path-c2-gw" />
              <path d="M 120 440 L 260 480" id="path-c2-auth" />
              <path d="M 390 285 L 510 180" id="path-gw-route" />
              <path d="M 390 285 L 510 320" id="path-gw-ingest" />
              <path d="M 390 285 L 510 460" id="path-gw-llm" />
              <path d="M 390 480 L 510 320" id="path-auth-ingest" />
              <path d="M 390 480 L 510 590" id="path-auth-pay" />
              <path d="M 640 180 L 575 320 L 640 460" id="path-route-llm" />
              <path d="M 640 320 L 575 420 L 640 460" id="path-ingest-llm" />
              <path d="M 640 180 L 850 140" id="path-route-redis" />
              <path d="M 640 320 L 850 290" id="path-ingest-pg" />
              <path d="M 640 460 L 850 440" id="path-llm-vector" />
              <path d="M 640 590 L 850 290" id="path-pay-pg" />
              <path d="M 640 460 L 760 300 L 850 140" id="path-llm-redis" />
              <path d="M 640 320 L 760 380 L 850 440" id="path-ingest-vector" />
            </g>

            {/* Dynamic Telemetry Packet Animations (SVG native for precision) */}
            <g id="telemetryPackets">
              {/* Cyan Stream Particles */}
              <circle r="3" fill="#00f0ff" filter="url(#glowCyan)" opacity="0.9">
                <animateMotion dur="2.4s" repeatCount="indefinite" path="M 120 220 L 260 270" />
              </circle>
              <circle r="2.8" fill="#00f0ff" filter="url(#glowCyan)" opacity="0.9">
                <animateMotion dur="3.1s" begin="0.8s" repeatCount="indefinite" path="M 120 440 L 260 300" />
              </circle>
              <circle r="3" fill="#00f0ff" filter="url(#glowCyan)" opacity="0.9">
                <animateMotion dur="2.6s" begin="0.4s" repeatCount="indefinite" path="M 390 285 L 510 180" />
              </circle>
              <circle r="3" fill="#00f0ff" filter="url(#glowCyan)" opacity="0.9">
                <animateMotion dur="2.1s" repeatCount="indefinite" path="M 390 285 L 510 320" />
              </circle>
              <circle r="3" fill="#00f0ff" filter="url(#glowCyan)" opacity="0.9">
                <animateMotion dur="2.8s" begin="1.2s" repeatCount="indefinite" path="M 640 180 L 850 140" />
              </circle>
              <circle r="2.8" fill="#00f0ff" filter="url(#glowCyan)" opacity="0.9">
                <animateMotion dur="2.3s" begin="0.5s" repeatCount="indefinite" path="M 640 320 L 850 290" />
              </circle>
              <circle r="3" fill="#00f0ff" filter="url(#glowCyan)" opacity="0.9">
                <animateMotion dur="2.5s" begin="0.2s" repeatCount="indefinite" path="M 640 460 L 850 440" />
              </circle>
              <circle r="2.8" fill="#00f0ff" filter="url(#glowCyan)" opacity="0.9">
                <animateMotion dur="3.4s" begin="1.0s" repeatCount="indefinite" path="M 390 480 L 510 590" />
              </circle>
              <circle r="2.8" fill="#00f0ff" filter="url(#glowCyan)" opacity="0.9">
                <animateMotion dur="2.7s" begin="1.5s" repeatCount="indefinite" path="M 640 590 L 850 290" />
              </circle>

              {/* Amber Retrying / High-p95 Particles */}
              <circle r="3.6" fill="#ffb2b7" filter="url(#glowAmber)" opacity="0.95">
                <animateMotion dur="3.8s" repeatCount="indefinite" path="M 390 285 L 510 460" />
              </circle>
              <circle r="3.4" fill="#ffb2b7" filter="url(#glowAmber)" opacity="0.95">
                <animateMotion dur="4.2s" begin="1.6s" repeatCount="indefinite" path="M 640 320 L 575 420 L 640 460" />
              </circle>
              <circle r="3.6" fill="#ffb2b7" filter="url(#glowAmber)" opacity="0.95">
                <animateMotion dur="4.0s" begin="0.9s" repeatCount="indefinite" path="M 640 460 L 760 300 L 850 140" />
              </circle>
            </g>

            {/* Tier 1: Client Ingress Entities */}
            <g
              id="tier1Nodes"
              className="cursor-pointer transition-opacity duration-200"
              style={{ opacity: isNodeVisible('client') ? 1 : 0.15 }}
            >
              {/* Web Edge Client */}
              <g
                className="node-item"
                onClick={() => {
                  setSelectedNodeId('node-web-client');
                  setIsDrawerOpen(true);
                }}
              >
                <rect
                  fill="#181b25"
                  height="70"
                  stroke={selectedNodeId === 'node-web-client' ? '#00f0ff' : '#3b494b'}
                  strokeWidth={selectedNodeId === 'node-web-client' ? 1.8 : 1.2}
                  width="100"
                  x="20"
                  y="180"
                />
                <text className="font-label-caps text-[9px] uppercase" fill="#849495" x="32" y="206">
                  CLIENT
                </text>
                <text className="font-code-md text-[12px]" fill="#dfe2ef" x="32" y="226">
                  Web-App
                </text>
                <text className="font-code-sm text-[10px]" fill="#4edea3" x="32" y="240">
                  TLS 1.3 - OK
                </text>
              </g>

              {/* Mobile / Edge SDK */}
              <g
                className="node-item"
                onClick={() => {
                  setSelectedNodeId('node-mobile-client');
                  setIsDrawerOpen(true);
                }}
              >
                <rect
                  fill="#181b25"
                  height="70"
                  stroke={selectedNodeId === 'node-mobile-client' ? '#00f0ff' : '#3b494b'}
                  strokeWidth={selectedNodeId === 'node-mobile-client' ? 1.8 : 1.2}
                  width="100"
                  x="20"
                  y="405"
                />
                <text className="font-label-caps text-[9px] uppercase" fill="#849495" x="32" y="431">
                  CLIENT
                </text>
                <text className="font-code-md text-[12px]" fill="#dfe2ef" x="32" y="451">
                  gRPC-iOS/And
                </text>
                <text className="font-code-sm text-[10px]" fill="#4edea3" x="32" y="465">
                  HTTP/3 QUIC
                </text>
              </g>
            </g>

            {/* Tier 2: Edge Network & Mesh */}
            <g
              id="tier2Nodes"
              className="cursor-pointer transition-opacity duration-200"
              style={{ opacity: isNodeVisible('edge') ? 1 : 0.15 }}
            >
              {/* API Gateway */}
              <g
                className="node-item"
                onClick={() => {
                  setSelectedNodeId('node-api-gw');
                  setIsDrawerOpen(true);
                }}
              >
                <rect
                  fill="#1c1f29"
                  height="75"
                  stroke={selectedNodeId === 'node-api-gw' ? '#00f0ff' : '#00dbe9'}
                  strokeWidth="1.5"
                  width="130"
                  x="260"
                  y="245"
                />
                <circle cx="274" cy="265" fill="#00dbe9" r="3" />
                <text className="font-label-caps text-[9px] uppercase" fill="#00dbe9" x="284" y="268">
                  GATEWAY
                </text>
                <text className="font-headline-md text-[14px] font-semibold" fill="#dbfcff" x="274" y="290">
                  API Gateway
                </text>
                <text className="font-code-sm text-[10px]" fill="#849495" x="274" y="306">
                  Envoy Mesh / Rate-Lim
                </text>
              </g>

              {/* Auth Engine */}
              <g
                className="node-item"
                onClick={() => {
                  setSelectedNodeId('node-auth');
                  setIsDrawerOpen(true);
                }}
              >
                <rect
                  fill="#1c1f29"
                  height="75"
                  stroke={selectedNodeId === 'node-auth' ? '#00f0ff' : '#3b494b'}
                  strokeWidth="1.2"
                  width="130"
                  x="260"
                  y="445"
                />
                <circle cx="274" cy="465" fill="#4edea3" r="3" />
                <text className="font-label-caps text-[9px] uppercase" fill="#849495" x="284" y="468">
                  SECURITY
                </text>
                <text className="font-headline-md text-[14px] font-semibold" fill="#dfe2ef" x="274" y="490">
                  Auth Engine
                </text>
                <text className="font-code-sm text-[10px]" fill="#849495" x="274" y="506">
                  mTLS & JWT Issuer
                </text>
              </g>
            </g>

            {/* Tier 3: Core Application Microservices */}
            <g
              id="tier3Nodes"
              className="cursor-pointer transition-opacity duration-200"
              style={{ opacity: isNodeVisible('app') ? 1 : 0.15 }}
            >
              {/* Routing Proxy */}
              <g
                className="node-item"
                onClick={() => {
                  setSelectedNodeId('node-routing');
                  setIsDrawerOpen(true);
                }}
              >
                <rect
                  fill="#1c1f29"
                  height="70"
                  stroke={selectedNodeId === 'node-routing' ? '#00f0ff' : '#3b494b'}
                  strokeWidth="1.2"
                  width="130"
                  x="510"
                  y="145"
                />
                <text className="font-label-caps text-[9px] uppercase" fill="#849495" x="522" y="168">
                  ROUTING
                </text>
                <text className="font-code-md text-[12px] font-semibold" fill="#dfe2ef" x="522" y="188">
                  Routing Proxy
                </text>
                <text className="font-code-sm text-[10px]" fill="#4edea3" x="522" y="202">
                  Weighted Canary
                </text>
              </g>

              {/* Ingestion Bus */}
              <g
                className="node-item"
                onClick={() => {
                  setSelectedNodeId('node-ingestion');
                  setIsDrawerOpen(true);
                }}
              >
                <rect
                  fill="#1c1f29"
                  height="75"
                  stroke={selectedNodeId === 'node-ingestion' ? '#00f0ff' : '#3b494b'}
                  strokeWidth="1.2"
                  width="130"
                  x="510"
                  y="285"
                />
                <text className="font-label-caps text-[9px] uppercase" fill="#849495" x="522" y="308">
                  INGESTION
                </text>
                <text className="font-headline-md text-[14px] font-semibold" fill="#dfe2ef" x="522" y="328">
                  Ingestion Bus
                </text>
                <text className="font-code-sm text-[10px]" fill="#00dbe9" x="522" y="344">
                  Kafka Partitioned
                </text>
              </g>

              {/* LLM Inference Cluster (Degraded / Slow) */}
              <g
                className="node-item"
                onClick={() => {
                  setSelectedNodeId('node-llm');
                  setIsDrawerOpen(true);
                }}
              >
                <rect
                  fill="#262a34"
                  height="75"
                  stroke={selectedNodeId === 'node-llm' ? '#00f0ff' : '#ffb2b7'}
                  strokeWidth="1.75"
                  width="130"
                  x="510"
                  y="425"
                />
                <circle className="animate-ping" cx="522" cy="445" fill="#ffb4ab" r="3.5" />
                <text className="font-label-caps text-[9px] uppercase" fill="#ffb4ab" x="532" y="448">
                  INFERENCE // SLOW
                </text>
                <text className="font-headline-md text-[14px] font-semibold" fill="#fff3f2" x="522" y="470">
                  LLM Inference
                </text>
                <text className="font-code-sm text-[10px]" fill="#ffb2b7" x="522" y="486">
                  vLLM TensorRT-LLM
                </text>
              </g>

              {/* Payment Processor */}
              <g
                className="node-item"
                onClick={() => {
                  setSelectedNodeId('node-payment');
                  setIsDrawerOpen(true);
                }}
              >
                <rect
                  fill="#1c1f29"
                  height="70"
                  stroke={selectedNodeId === 'node-payment' ? '#00f0ff' : '#3b494b'}
                  strokeWidth="1.2"
                  width="130"
                  x="510"
                  y="555"
                />
                <text className="font-label-caps text-[9px] uppercase" fill="#849495" x="522" y="578">
                  PAYMENT
                </text>
                <text className="font-code-md text-[12px] font-semibold" fill="#dfe2ef" x="522" y="598">
                  Pay Processor
                </text>
                <text className="font-code-sm text-[10px]" fill="#4edea3" x="522" y="612">
                  PCI-DSS Encrypted
                </text>
              </g>
            </g>

            {/* Tier 4: Clean Cylindrical Databases & Storage */}
            <g
              id="tier4Databases"
              className="cursor-pointer transition-opacity duration-200"
              style={{ opacity: isNodeVisible('persist') ? 1 : 0.15 }}
            >
              {/* Redis Cache Cluster */}
              <g
                className="node-item"
                onClick={() => {
                  setSelectedNodeId('node-redis');
                  setIsDrawerOpen(true);
                }}
              >
                <ellipse cx="910" cy="118" fill="#262a34" rx="48" ry="12" stroke="#4edea3" strokeWidth="1.2" />
                <path d="M 862 118 v 42 a 48 12 0 0 0 96 0 v -42 Z" fill="url(#cylinderGrad)" stroke="#4edea3" strokeWidth="1.2" />
                <ellipse cx="910" cy="160" fill="none" rx="48" ry="12" stroke="#4edea3" strokeWidth="1.2" />
                <text className="font-label-caps text-[9px] font-semibold" fill="#4edea3" textAnchor="middle" x="910" y="138">
                  REDIS CACHE
                </text>
                <text className="font-code-sm text-[10px]" fill="#dfe2ef" textAnchor="middle" x="910" y="152">
                  Shard x6 / Mem
                </text>
              </g>

              {/* Postgres Primary */}
              <g
                className="node-item"
                onClick={() => {
                  setSelectedNodeId('node-postgres');
                  setIsDrawerOpen(true);
                }}
              >
                <ellipse cx="910" cy="270" fill="#262a34" rx="48" ry="12" stroke="#3b494b" strokeWidth="1.2" />
                <path d="M 862 270 v 46 a 48 12 0 0 0 96 0 v -46 Z" fill="url(#cylinderGrad)" stroke="#3b494b" strokeWidth="1.2" />
                <ellipse cx="910" cy="316" fill="none" rx="48" ry="12" stroke="#3b494b" strokeWidth="1.2" />
                <text className="font-label-caps text-[9px] font-semibold" fill="#849495" textAnchor="middle" x="910" y="292">
                  POSTGRES DB
                </text>
                <text className="font-code-sm text-[10px]" fill="#dfe2ef" textAnchor="middle" x="910" y="306">
                  ACID Leader-Replica
                </text>
              </g>

              {/* ClickHouse / Vector Store */}
              <g
                className="node-item"
                onClick={() => {
                  setSelectedNodeId('node-clickhouse');
                  setIsDrawerOpen(true);
                }}
              >
                <ellipse cx="910" cy="420" fill="#262a34" rx="48" ry="12" stroke="#00dbe9" strokeWidth="1.2" />
                <path d="M 862 420 v 48 a 48 12 0 0 0 96 0 v -48 Z" fill="url(#cylinderGrad)" stroke="#00dbe9" strokeWidth="1.2" />
                <ellipse cx="910" cy="468" fill="none" rx="48" ry="12" stroke="#00dbe9" strokeWidth="1.2" />
                <text className="font-label-caps text-[9px] font-semibold" fill="#00dbe9" textAnchor="middle" x="910" y="442">
                  CLICKHOUSE
                </text>
                <text className="font-code-sm text-[10px]" fill="#dbfcff" textAnchor="middle" x="910" y="456">
                  Vector & OLAP
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* Minimal Modern Drawer / Slide Panel */}
        {isDrawerOpen && (
          <div className="w-80 bg-[#181b25] border-l border-[#262a34] flex flex-col justify-between p-3 z-30 transition-transform duration-200 ease-out select-none">
            {/* Top Service Metadata */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1 border-b border-[#262a34]">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      selectedNode.statusType === 'degraded' ? 'bg-[#ffb4ab]' : 'bg-[#4edea3]'
                    }`}
                  ></span>
                  <span className="font-label-caps text-[9px] uppercase text-[#849495]">
                    {selectedNode.tier}
                  </span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-[#849495] hover:text-[#dfe2ef] transition-colors p-1"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="flex flex-col">
                <h2 className="font-headline-lg text-[18px] font-semibold text-[#dbfcff]">
                  {selectedNode.name}
                </h2>
                <span className="font-code-sm text-[10px] text-[#849495]">
                  {selectedNode.k8sServiceId}
                </span>
              </div>

              {/* Telemetry Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-[#1c1f29] p-2 border border-[#262a34]">
                  <span className="font-label-caps text-[8px] text-[#849495] block">LATENCY (P95)</span>
                  <span
                    className={`font-code-lg text-[13px] font-semibold ${
                      selectedNode.statusType === 'degraded' ? 'text-[#ffb4ab]' : 'text-[#4edea3]'
                    }`}
                  >
                    {selectedNode.latency}
                  </span>
                </div>
                <div className="bg-[#1c1f29] p-2 border border-[#262a34]">
                  <span className="font-label-caps text-[8px] text-[#849495] block">THROUGHPUT</span>
                  <span className="font-code-lg text-[13px] text-[#4edea3] font-semibold">
                    {selectedNode.rps}
                  </span>
                </div>
                <div className="bg-[#1c1f29] p-2 border border-[#262a34]">
                  <span className="font-label-caps text-[8px] text-[#849495] block">RUNTIME STATUS</span>
                  <span className="font-code-sm text-[10px] text-[#dfe2ef] font-semibold truncate block">
                    {selectedNode.status}
                  </span>
                </div>
                <div className="bg-[#1c1f29] p-2 border border-[#262a34]">
                  <span className="font-label-caps text-[8px] text-[#849495] block">ERROR RATE</span>
                  <span
                    className={`font-code-lg text-[13px] font-semibold ${
                      selectedNode.statusType === 'degraded' ? 'text-[#ffb4ab]' : 'text-[#4edea3]'
                    }`}
                  >
                    {selectedNode.errors}
                  </span>
                </div>
              </div>

              {/* Upstream Callers */}
              <div className="flex flex-col gap-1 pt-1">
                <span className="font-label-caps text-[9px] text-[#849495] uppercase">
                  UPSTREAM CALLERS
                </span>
                <div className="flex flex-col gap-1">
                  {selectedNode.upstreams.map((u, i) => (
                    <div
                      key={i}
                      className="bg-[#1c1f29] px-2 py-1 border border-[#262a34] flex items-center justify-between font-code-sm text-[10px]"
                    >
                      <span className="text-[#dfe2ef]">{u.name}</span>
                      <span className="text-[#4edea3]">{u.latency}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Downstream Dependencies */}
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-[9px] text-[#849495] uppercase">
                  DOWNSTREAM DEPENDENCIES
                </span>
                <div className="flex flex-col gap-1">
                  {selectedNode.downstreams.map((d, i) => (
                    <div
                      key={i}
                      className="bg-[#1c1f29] px-2 py-1 border border-[#262a34] flex items-center justify-between font-code-sm text-[10px]"
                    >
                      <span className="text-[#dfe2ef]">{d.name}</span>
                      <span className="text-[#00f0ff]">{d.latency}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flamegraph Mini Sparkline */}
              <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-[9px] text-[#849495] uppercase">
                    EXECUTION SPAN WATERFALL
                  </span>
                  <span className="font-code-sm text-[9px] text-[#849495]">tr-8891f</span>
                </div>
                <div className="bg-[#1c1f29] p-2 border border-[#262a34] flex flex-col gap-1.5">
                  <div className="w-full bg-[#262a34] h-2 overflow-hidden">
                    <div className="bg-[#dbfcff] h-full w-[85%]"></div>
                  </div>
                  <div className="w-full bg-[#262a34] h-2 overflow-hidden pl-6">
                    <div className="bg-[#00dbe9] h-full w-[65%]"></div>
                  </div>
                  <div className="w-full bg-[#262a34] h-2 overflow-hidden pl-16">
                    <div className="bg-[#ffb4ab] h-full w-[45%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Panel */}
            <div className="pt-3 flex flex-col gap-1.5 border-t border-[#262a34]">
              <button
                onClick={() => onOpenFlamegraph(selectedNode.name)}
                className="w-full py-2 bg-[#dbfcff] text-[#00363a] font-code-sm text-[11px] font-semibold hover:bg-[#7df4ff] transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                <span>Open Full Flamegraph</span>
              </button>
              <button
                onClick={onDownloadTelemetry}
                className="w-full py-1.5 bg-[#1c1f29] text-[#dfe2ef] font-code-sm text-[10px] hover:bg-[#262a34] transition-colors border border-[#262a34] cursor-pointer"
              >
                Download Telemetry JSON
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Span Telemetry Feed Tabular Strip */}
      <div className="mt-3 bg-[#0a0e17] p-2 border border-[#1c1f29] flex flex-col gap-1">
        <div className="flex items-center justify-between pb-1 border-b border-[#1c1f29]">
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-[9px] uppercase text-[#849495]">
              LIVE SPANS BUFFER (SELECTED PATHWAY)
            </span>
            <span className="px-1.5 py-0.5 bg-[#1c1f29] font-code-sm text-[9px] text-[#00f0ff]">
              BUFFER: 250 SPANS
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#849495] font-code-sm text-[10px]">
            <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
            <span>OTLP/gRPC v1.28</span>
          </div>
        </div>

        {/* Telemetry Waterfall Rows */}
        <div className="flex flex-col gap-1 font-code-sm text-[11px]">
          {LIVE_SPANS_BUFFER.map((span) => (
            <div
              key={span.id}
              onClick={() => onInspectSpan(span.id)}
              className="flex items-center justify-between p-2 bg-[#181b25] hover:bg-[#1c1f29] transition-colors cursor-pointer border border-[#262a34]"
            >
              <div className="flex items-center gap-3">
                <span className={`font-semibold ${span.isError ? 'text-[#ffb4ab]' : 'text-[#4edea3]'}`}>
                  {span.statusCode}
                </span>
                <span className="text-[#dfe2ef] font-medium">
                  {span.method} {span.path}
                </span>
                <span className="text-[#849495]">{span.service}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-[#262a34] h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${span.isError ? 'bg-[#ffb4ab]' : 'bg-[#4edea3]'}`}
                    style={{ width: `${span.barPercent}%` }}
                  ></div>
                </div>
                <span className={span.isError ? 'text-[#ffb4ab]' : 'text-[#dfe2ef]'}>
                  {span.durationStr}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
