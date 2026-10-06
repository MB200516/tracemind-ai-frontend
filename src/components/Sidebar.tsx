import React from 'react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenTerminal: () => void;
  cluster: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenTerminal,
  cluster
}) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0a0e17] border-r border-[#1c1f29] flex flex-col justify-between z-50 select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="h-14 px-4 flex items-center gap-2 cursor-pointer hover:bg-[#181b25]/50 transition-colors"
          title="TraceMind AI Observability"
        >
          <span className="material-symbols-outlined text-[#00dbe9] text-[22px]">monitoring</span>
          <div className="flex flex-col">
            <span className="font-label-caps text-[10px] tracking-wider text-[#dfe2ef] font-semibold">
              TRACEMIND AI
            </span>
            <span className="font-code-sm text-[9px] text-[#849495] tracking-wider">
              OBSERVABILITY
            </span>
          </div>
        </div>

        {/* Engine Live Status Bar */}
        <div className="px-4 py-1">
          <div className="bg-[#181b25] px-2 py-1 flex items-center justify-between border border-[#262a34]">
            <span className="font-code-sm text-[#849495]">ENGINE</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#4edea3] animate-pulse"></span>
              <span className="font-code-sm text-[#4edea3] font-medium">LIVE / 99.99%</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 px-2 py-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-2 py-1.5 text-left transition-colors font-code-md text-[12px] ${
              activeTab === 'dashboard'
                ? 'bg-[#1c1f29] text-[#dbfcff] font-medium border-l-2 border-[#00dbe9]'
                : 'text-[#b9cacb] hover:bg-[#262a34] hover:text-[#dfe2ef]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">space_dashboard</span>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('traces')}
            className={`flex items-center gap-2 px-2 py-1.5 text-left transition-colors font-code-md text-[12px] ${
              activeTab === 'traces'
                ? 'bg-[#1c1f29] text-[#dbfcff] font-medium border-l-2 border-[#00dbe9]'
                : 'text-[#b9cacb] hover:bg-[#262a34] hover:text-[#dfe2ef]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
            <span>Traces</span>
          </button>

          <button
            onClick={() => setActiveTab('incidents')}
            className={`flex items-center gap-2 px-2 py-1.5 text-left transition-colors font-code-md text-[12px] ${
              activeTab === 'incidents'
                ? 'bg-[#1c1f29] text-[#dbfcff] font-medium border-l-2 border-[#00dbe9]'
                : 'text-[#b9cacb] hover:bg-[#262a34] hover:text-[#dfe2ef]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">crisis_alert</span>
            <div className="flex items-center justify-between w-full">
              <span>Incidents</span>
              <span className="bg-[#262a34] text-[#ffb4ab] text-[9px] px-1 py-0.5 font-code-sm font-semibold">2</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('threats')}
            className={`flex items-center gap-2 px-2 py-1.5 text-left transition-colors font-code-md text-[12px] ${
              activeTab === 'threats'
                ? 'bg-[#1c1f29] text-[#dbfcff] font-medium border-l-2 border-[#00dbe9]'
                : 'text-[#b9cacb] hover:bg-[#262a34] hover:text-[#dfe2ef]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">shield</span>
            <div className="flex items-center justify-between w-full">
              <span>Threats</span>
              <span className="w-1.5 h-1.5 bg-[#ffb4ab] rounded-full animate-ping"></span>
            </div>
          </button>
        </nav>
      </div>

      {/* User Footer Profile & Terminal Toggle */}
      <div className="p-4 flex flex-col gap-2 border-t border-[#1c1f29]">
        <div className="bg-[#181b25] p-2 flex items-center justify-between border border-[#262a34]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#dbfcff] flex items-center justify-center text-[#00363a]">
              <span className="material-symbols-outlined text-[16px]">person</span>
            </div>
            <div className="flex flex-col">
              <span className="font-code-sm text-[#dfe2ef] font-semibold">sre-lead</span>
              <span className="font-code-sm text-[9px] text-[#849495]">{cluster}</span>
            </div>
          </div>
          <button 
            onClick={onOpenTerminal}
            className="text-[#849495] hover:text-[#00dbe9] hover:bg-[#262a34] p-1 transition-colors"
            title="Open SRE Console Terminal"
          >
            <span className="material-symbols-outlined text-[18px]">terminal</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
