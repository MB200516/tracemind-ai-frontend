import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  durationMs = 2400
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('ATTACHING eBPF KERNEL PROBES...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / durationMs) * 100), 100);
      setProgress(pct);

      if (pct > 25 && pct <= 60) {
        setStatusText('CALIBRATING DISTRIBUTED TRACE MESH...');
      } else if (pct > 60 && pct < 95) {
        setStatusText('SYNCHRONIZING CLUSTER TOPOLOGY (64/64 NODES)...');
      } else if (pct >= 95) {
        setStatusText('NOMINAL STATE VERIFIED. READY.');
      }

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 450);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070b13] cursor-pointer select-none transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      title="Click anywhere to skip loading"
    >
      {/* Background Matrix Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #353943 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Main Wave Artifact Graphic (Exact reproduction of Image 1.png) */}
      <div className="relative w-full max-w-3xl flex flex-col items-center justify-center px-6">
        <div className="relative w-full h-48 md:h-56 flex items-center justify-center">
          <svg
            viewBox="0 0 800 240"
            className="w-full h-full max-w-2xl overflow-visible"
            fill="none"
          >
            <defs>
              {/* Intense cyan core and halo glow */}
              <filter id="loadingCyanGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur1" />
                <feGaussianBlur stdDeviation="12" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="loadingWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1c2536" stopOpacity="0.1" />
                <stop offset="25%" stopColor="#00dbe9" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#00f0ff" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#7df4ff" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Dotted horizontal trail on the left */}
            <line
              x1="180"
              y1="120"
              x2="260"
              y2="120"
              stroke="#00dbe9"
              strokeWidth="1.2"
              strokeDasharray="2 4"
              strokeOpacity="0.5"
            />

            {/* Crosshair marker at start transition */}
            <circle cx="260" cy="116" r="1.5" fill="#00dbe9" />
            <line
              x1="260"
              y1="112"
              x2="260"
              y2="120"
              stroke="#00dbe9"
              strokeWidth="0.8"
              strokeOpacity="0.7"
            />

            {/* Smooth Sine/Bezier Curve */}
            <path
              d="M 260 120 C 310 120, 320 95, 360 95 C 410 95, 440 142, 500 142 C 550 142, 575 125, 600 120"
              stroke="url(#loadingWaveGradient)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Middle Crest Marker Anchor */}
            <circle cx="360" cy="95" r="2.2" stroke="#00dbe9" strokeWidth="1" fill="#070b13" />

            {/* Trough Marker Anchor */}
            <circle cx="500" cy="142" r="2.2" stroke="#00dbe9" strokeWidth="1" fill="#070b13" />

            {/* Small trailing satellite dots near the terminal head */}
            <circle cx="586" cy="122.5" r="1.5" fill="#00dbe9" opacity="0.6" />
            <circle cx="592" cy="121.2" r="1.8" fill="#7df4ff" opacity="0.85" />

            {/* Terminal glowing head bead */}
            <g filter="url(#loadingCyanGlow)">
              <circle cx="600" cy="120" r="10" fill="#00f0ff" opacity="0.25" />
              <circle cx="600" cy="120" r="6" fill="#00f0ff" opacity="0.55" />
              <circle cx="600" cy="120" r="3.2" fill="#ffffff" />
            </g>

            {/* Flowing packet pulse along the wave */}
            <circle
              r="2.8"
              fill="#7df4ff"
              filter="url(#loadingCyanGlow)"
              opacity="0.95"
            >
              <animateMotion
                dur="1.8s"
                repeatCount="indefinite"
                path="M 260 120 C 310 120, 320 95, 360 95 C 410 95, 440 142, 500 142 C 550 142, 575 125, 600 120"
              />
            </circle>
          </svg>
        </div>

        {/* Brand Text: Exact match for Image 1 "tracemind." */}
        <div className="flex flex-col items-center gap-3 text-center mt-1">
          <h1 className="font-code-lg text-[26px] md:text-[32px] tracking-tight text-[#dfe2ef] font-medium flex items-baseline">
            <span>tracemind</span>
            <span className="text-[#00f0ff] font-bold">.</span>
          </h1>

          {/* Micro Telemetry Sync Indicator */}
          <div className="flex flex-col items-center gap-2 mt-4 w-64">
            <div className="w-full bg-[#181b25] h-1 overflow-hidden border border-[#262a34]">
              <div
                className="bg-[#00f0ff] h-full transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between w-full font-code-sm text-[9px] text-[#849495]">
              <span className="truncate max-w-[190px]">{statusText}</span>
              <span className="text-[#00f0ff] font-semibold">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skip button prompt */}
      <div className="absolute bottom-6 font-code-sm text-[10px] text-[#849495] hover:text-[#dfe2ef] transition-colors flex items-center gap-1">
        <span>Click anywhere or press any key to skip</span>
        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
      </div>
    </div>
  );
};
