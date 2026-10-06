import React, { useState } from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  cluster: string;
  setCluster: (cluster: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenSettings: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  latencyMs: number;
  tpsK: number;
}

export const Header: React.FC<HeaderProps> = ({
  cluster,
  setCluster,
  onRefresh,
  isRefreshing,
  onOpenSettings,
  activeTab,
  setActiveTab,
  latencyMs,
  tpsK
}) => {
  const [showClusterMenu, setShowClusterMenu] = useState(false);

  const clusters = [
    { id: 'us-east-prod', label: 'us-east-prod (Primary N.Virginia)' },
    { id: 'us-west-prod', label: 'us-west-prod (Oregon Standby)' },
    { id: 'eu-central-prod', label: 'eu-central-prod (Frankfurt Mesh)' },
    { id: 'ap-south-prod', label: 'ap-south-prod (Mumbai Region)' },
    { id: 'staging-cluster', label: 'staging-cluster (Canary K8s)' }
  ];

  return (
    <header className="fixed top-0 left-64 right-0 h-14 bg-[#0f131c]/90 backdrop-blur-xl z-40 border-b border-[#1c1f29] flex items-center justify-between px-4 select-none">
      {/* Cluster Navigation Breadcrumb */}
      <div className="relative flex items-center gap-2">
        <div 
          onClick={() => setShowClusterMenu(!showClusterMenu)}
          className="flex items-center gap-1.5 font-code-sm text-[#849495] cursor-pointer hover:text-[#dfe2ef] py-1 px-1.5 rounded transition-colors"
          title="Click to switch Kubernetes cluster"
        >
          <span className="material-symbols-outlined text-[18px] text-[#849495]">lan</span>
          <span>cluster.k8s.internal</span>
          <span className="text-[#3b494b]">/</span>
          <span className="text-[#00dbe9] font-semibold">{cluster}</span>
          <span className="material-symbols-outlined text-[14px] text-[#849495]">arrow_drop_down</span>
        </div>

        {/* Cluster Switcher Dropdown */}
        {showClusterMenu && (
          <div className="absolute top-10 left-0 w-64 bg-[#181b25] border border-[#262a34] shadow-2xl py-1 z-50">
            <div className="px-3 py-1 font-label-caps text-[9px] text-[#849495] border-b border-[#262a34]">
              SWITCH CONTEXT
            </div>
            {clusters.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCluster(c.id);
                  setShowClusterMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 font-code-sm text-[11px] flex items-center justify-between transition-colors ${
                  cluster === c.id
                    ? 'bg-[#1c1f29] text-[#00f0ff] font-medium'
                    : 'text-[#dfe2ef] hover:bg-[#262a34]'
                }`}
              >
                <span>{c.label}</span>
                {cluster === c.id && (
                  <span className="w-1.5 h-1.5 bg-[#00dbe9]"></span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Telemetry & Actions */}
      <div className="flex items-center gap-3">
        {/* Fast Switch Tab Pills if on mobile or compact */}
        <div className="hidden xl:flex items-center bg-[#0a0e17] border border-[#262a34] p-0.5 font-code-sm text-[10px]">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-2 py-0.5 transition-colors ${activeTab === 'dashboard' ? 'bg-[#262a34] text-[#00f0ff]' : 'text-[#849495] hover:text-[#dfe2ef]'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('traces')}
            className={`px-2 py-0.5 transition-colors ${activeTab === 'traces' ? 'bg-[#262a34] text-[#00f0ff]' : 'text-[#849495] hover:text-[#dfe2ef]'}`}
          >
            Traces
          </button>
          <button 
            onClick={() => setActiveTab('incidents')}
            className={`px-2 py-0.5 transition-colors ${activeTab === 'incidents' ? 'bg-[#262a34] text-[#00f0ff]' : 'text-[#849495] hover:text-[#dfe2ef]'}`}
          >
            Incidents (2)
          </button>
          <button 
            onClick={() => setActiveTab('threats')}
            className={`px-2 py-0.5 transition-colors ${activeTab === 'threats' ? 'bg-[#262a34] text-[#00f0ff]' : 'text-[#849495] hover:text-[#dfe2ef]'}`}
          >
            Threats
          </button>
        </div>

        {/* Global Latency & TPS Readout */}
        <div className="flex items-center gap-2 font-code-sm bg-[#0a0e17] px-2.5 py-1 border border-[#262a34]">
          <span className="text-[#849495]">LATENCY:</span>
          <span className="text-[#4edea3] font-semibold">{latencyMs}ms</span>
          <span className="text-[#3b494b]">|</span>
          <span className="text-[#849495]">TPS:</span>
          <span className="text-[#dfe2ef] font-semibold">{tpsK.toFixed(1)}k</span>
        </div>

        {/* Refresh & Settings Triggers */}
        <div className="flex items-center gap-1">
          <button
            onClick={onRefresh}
            className="bg-[#262a34] hover:bg-[#353943] text-[#dfe2ef] p-1.5 flex items-center justify-center transition-colors"
            title="Force Telemetry Poll"
          >
            <span className={`material-symbols-outlined text-[18px] ${isRefreshing ? 'animate-spin text-[#00dbe9]' : ''}`}>
              refresh
            </span>
          </button>
          <button
            onClick={onOpenSettings}
            className="bg-[#262a34] hover:bg-[#353943] text-[#dfe2ef] p-1.5 flex items-center justify-center transition-colors"
            title="Cluster & Alerting Settings"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
