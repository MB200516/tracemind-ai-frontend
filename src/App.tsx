/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TracesView } from './components/TracesView';
import { IncidentsView } from './components/IncidentsView';
import { ThreatsView } from './components/ThreatsView';
import { FlamegraphModal } from './components/FlamegraphModal';
import { TraceInspectModal } from './components/TraceInspectModal';
import { AgentConfigModal } from './components/AgentConfigModal';
import { SettingsModal } from './components/SettingsModal';
import { TerminalDrawer } from './components/TerminalDrawer';
import { Toast } from './components/Toast';
import { LoadingScreen } from './components/LoadingScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [cluster, setCluster] = useState<string>('us-east-prod');
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isFlamegraphOpen, setIsFlamegraphOpen] = useState<boolean>(false);
  const [flamegraphService, setFlamegraphService] = useState<string>('LLM Inference Cluster');
  const [isTraceInspectOpen, setIsTraceInspectOpen] = useState<boolean>(false);
  const [inspectedSpanId, setInspectedSpanId] = useState<string>('0x8f4c2e091b64a');
  const [isAgentConfigOpen, setIsAgentConfigOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Simulated live metrics ticker
  const [latencyMs, setLatencyMs] = useState<number>(12);
  const [tpsK, setTpsK] = useState<number>(48.2);

  useEffect(() => {
    const interval = setInterval(() => {
      // Subtle realistic metric jitter
      const latDelta = Math.floor(Math.random() * 3) - 1;
      setLatencyMs((prev) => Math.max(10, Math.min(18, prev + latDelta)));

      const tpsDelta = (Math.random() * 0.4 - 0.2);
      setTpsK((prev) => Math.max(45.0, Math.min(52.0, parseFloat((prev + tpsDelta).toFixed(1)))));
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    showToast('Polling live eBPF telemetry hooks across 64 cluster nodes...');
    setTimeout(() => {
      setIsRefreshing(false);
      setLatencyMs(11);
      setTpsK(49.1);
      showToast('Telemetry state synchronized. Nominal operation verified.');
    }, 900);
  };

  const handleOpenFlamegraph = (service: string) => {
    setFlamegraphService(service);
    setIsFlamegraphOpen(true);
  };

  const handleDownloadTelemetry = () => {
    const telemetryObj = {
      resourceSpans: [
        {
          resource: {
            attributes: [
              { key: 'service.name', value: { stringValue: 'cluster.svc.llm-inference.vllm' } },
              { key: 'k8s.cluster.name', value: { stringValue: cluster } },
              { key: 'telemetry.sdk.language', value: { stringValue: 'ebpf-rust-native' } }
            ]
          },
          scopeSpans: [
            {
              scope: { name: 'io.tracemind.runtime' },
              spans: [
                {
                  traceId: '8f4c2e091b64a0007a92bf008c010000',
                  spanId: '7f83a0bc99100000',
                  name: 'vLLM.ForwardTensorRT',
                  kind: 'SPAN_KIND_INTERNAL',
                  startTimeUnixNano: '1775496000000000000',
                  endTimeUnixNano: '1775496000064200000',
                  attributes: [
                    { key: 'http.status_code', value: { intValue: 200 } },
                    { key: 'inference.p95_ms', value: { doubleValue: 64.2 } }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    const blob = new Blob([JSON.stringify(telemetryObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tracemind-${cluster}-telemetry.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Telemetry JSON downloaded for ${cluster}`);
  };

  const handleInspectTrace = (spanId: string) => {
    setInspectedSpanId(spanId);
    setIsTraceInspectOpen(true);
  };

  const handleSavePolicy = (policy: string) => {
    showToast(`Autonomous Agent Policy updated: ${policy} applied cluster-wide.`);
  };

  const handleSaveSettings = () => {
    showToast('Observability cluster parameters saved successfully.');
  };

  return (
    <div className="min-h-screen bg-[#0f131c] text-[#dfe2ef] font-body-md antialiased selection:bg-[#00f0ff] selection:text-[#00363a]">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTerminal={() => setIsTerminalOpen((prev) => !prev)}
        cluster={cluster}
      />

      {/* Main Container Area (shifted by 64 = 16rem = 256px) */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Fixed Top Header */}
        <Header
          cluster={cluster}
          setCluster={(newCluster) => {
            setCluster(newCluster);
            showToast(`Switched Kubernetes context to ${newCluster}`);
          }}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onOpenSettings={() => setIsSettingsOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          latencyMs={latencyMs}
          tpsK={tpsK}
        />

        {/* Viewport Main Canvas Area */}
        <main className="relative pt-16 w-full px-4 flex-1">
          {activeTab === 'dashboard' && (
            <DashboardView
              setActiveTab={setActiveTab}
              onOpenAgentConfig={() => setIsAgentConfigOpen(true)}
              onInspectTrace={handleInspectTrace}
              cluster={cluster}
            />
          )}

          {activeTab === 'traces' && (
            <TracesView
              onOpenFlamegraph={handleOpenFlamegraph}
              onDownloadTelemetry={handleDownloadTelemetry}
              onInspectSpan={handleInspectTrace}
            />
          )}

          {activeTab === 'incidents' && (
            <IncidentsView
              onShowToast={showToast}
              onViewTrace={(spanId) => {
                setActiveTab('traces');
                showToast(`Focused trace span: ${spanId}`);
              }}
            />
          )}

          {activeTab === 'threats' && (
            <ThreatsView onShowToast={showToast} />
          )}
        </main>
      </div>

      {/* Interactive Modals and Drawers */}
      <FlamegraphModal
        isOpen={isFlamegraphOpen}
        onClose={() => setIsFlamegraphOpen(false)}
        serviceName={flamegraphService}
      />

      <TraceInspectModal
        isOpen={isTraceInspectOpen}
        onClose={() => setIsTraceInspectOpen(false)}
        spanId={inspectedSpanId}
        cluster={cluster}
      />

      <AgentConfigModal
        isOpen={isAgentConfigOpen}
        onClose={() => setIsAgentConfigOpen(false)}
        onSave={handleSavePolicy}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />

      <TerminalDrawer
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        cluster={cluster}
      />

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* Initial Startup Loading Screen (Image 1 wave trajectory) */}
      {isLoading && (
        <LoadingScreen
          onComplete={() => setIsLoading(false)}
          durationMs={2200}
        />
      )}
    </div>
  );
}
