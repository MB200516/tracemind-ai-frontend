import React, { useState } from 'react';

interface FlamegraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
}

interface SpanItem {
  id: string;
  name: string;
  service: string;
  startPct: number;
  widthPct: number;
  durationMs: number;
  color: string;
  status: 'ok' | 'slow' | 'error';
  tags: Record<string, string>;
}

export const FlamegraphModal: React.FC<FlamegraphModalProps> = ({
  isOpen,
  onClose,
  serviceName
}) => {
  const [selectedSpan, setSelectedSpan] = useState<SpanItem | null>(null);

  if (!isOpen) return null;

  const spans: SpanItem[] = [
    {
      id: 'span-root',
      name: 'HTTP POST /api/v2/inference/rag-completion',
      service: 'ingress.client.web-spa',
      startPct: 0,
      widthPct: 100,
      durationMs: 64.2,
      color: '#00dbe9',
      status: 'ok',
      tags: { 'http.status_code': '200', 'client.ip': '142.250.190.46', 'protocol': 'HTTP/3' }
    },
    {
      id: 'span-gw',
      name: 'envoy.router / envoy.ingress.filter',
      service: 'k8s.svc.envoy-ingress-gateway',
      startPct: 2,
      widthPct: 96,
      durationMs: 61.8,
      color: '#00f0ff',
      status: 'ok',
      tags: { 'envoy.downstream_local_address': '10.244.2.14:443', 'ratelimit.status': 'OK' }
    },
    {
      id: 'span-auth',
      name: 'jwt.verify_signature & mtls.handshake',
      service: 'k8s.svc.auth-security-engine',
      startPct: 4,
      widthPct: 12,
      durationMs: 7.4,
      color: '#4edea3',
      status: 'ok',
      tags: { 'auth.spiffe_id': 'spiffe://cluster.local/ns/prod/sa/web', 'jwt.alg': 'RS256' }
    },
    {
      id: 'span-routing',
      name: 'proxy.route_selection [weighted_canary]',
      service: 'k8s.svc.smart-routing-proxy',
      startPct: 18,
      widthPct: 8,
      durationMs: 5.1,
      color: '#4edea3',
      status: 'ok',
      tags: { 'canary.version': 'v2.4-tensorrt', 'upstream.cluster': 'vllm-us-east' }
    },
    {
      id: 'span-vllm-exec',
      name: 'vllm.tensorrt.forward_pass [KV_CACHE_MISS]',
      service: 'cluster.svc.llm-inference.vllm',
      startPct: 28,
      widthPct: 68,
      durationMs: 43.6,
      color: '#ffb4ab',
      status: 'slow',
      tags: {
        'model.name': 'meta-llama/Llama-3-70B-Instruct',
        'tokens.prompt': '1024',
        'tokens.generated': '256',
        'kv_cache.hit_rate': '18.4% (Threshold: >80%)'
      }
    },
    {
      id: 'span-vector-knn',
      name: 'clickhouse.vector.knn_search (dim=1536)',
      service: 'k8s.svc.clickhouse-vector-olap',
      startPct: 32,
      widthPct: 24,
      durationMs: 15.4,
      color: '#00dbe9',
      status: 'ok',
      tags: { 'vector.top_k': '10', 'index.scanned_rows': '2.4M', 'cache.status': 'MISS' }
    },
    {
      id: 'span-redis-read',
      name: 'redis.mget [shard-02:keyspace_wait]',
      service: 'k8s.svc.redis-cache-cluster',
      startPct: 58,
      widthPct: 22,
      durationMs: 14.1,
      color: '#ffb4ab',
      status: 'slow',
      tags: {
        'redis.command': 'MGET',
        'shard.id': 'shard-02',
        'shard.mem_util': '94.2%',
        'eviction.cycle': 'ACTIVE'
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#070b13]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#181b25] border border-[#262a34] w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#262a34] bg-[#0a0e17]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">
              account_tree
            </span>
            <div className="flex flex-col">
              <span className="font-headline-md text-[14px] text-[#dfe2ef] font-semibold">
                OpenTelemetry Full Flamegraph Waterfall: <span className="text-[#00f0ff] font-mono">tr-8891f-ingest-v2</span>
              </span>
              <span className="font-code-sm text-[10px] text-[#849495]">
                Root Context: {serviceName} · Total Span Duration: 64.2ms
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

        {/* Timing Scale bar */}
        <div className="px-4 py-2 bg-[#0f131c] border-b border-[#262a34] flex items-center justify-between font-code-sm text-[10px] text-[#849495]">
          <span>0ms</span>
          <span>16ms</span>
          <span>32ms</span>
          <span>48ms</span>
          <span>64.2ms (End)</span>
        </div>

        {/* Flamegraph Spans Body */}
        <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-2">
          {spans.map((span) => {
            const isSelected = selectedSpan?.id === span.id;
            return (
              <div
                key={span.id}
                onClick={() => setSelectedSpan(span)}
                className={`relative group cursor-pointer transition-all border p-1.5 ${
                  isSelected
                    ? 'border-[#00f0ff] bg-[#1c1f29]'
                    : 'border-[#262a34] hover:border-[#353943] bg-[#0a0e17]'
                }`}
                style={{
                  marginLeft: `${span.startPct}%`,
                  width: `${Math.max(span.widthPct, 22)}%`
                }}
              >
                <div className="flex items-center justify-between font-code-sm text-[10px] truncate">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2 h-2 shrink-0"
                      style={{ backgroundColor: span.color }}
                    ></span>
                    <span className="text-[#dfe2ef] font-medium truncate">{span.name}</span>
                  </div>
                  <span
                    className={`font-semibold shrink-0 pl-1 ${
                      span.status === 'slow' ? 'text-[#ffb4ab]' : 'text-[#4edea3]'
                    }`}
                  >
                    {span.durationMs}ms
                  </span>
                </div>
                <div className="text-[9px] font-code-sm text-[#849495] truncate mt-0.5">
                  {span.service}
                </div>
              </div>
            );
          })}
        </div>

        {/* Inspector Detail Footer */}
        <div className="bg-[#0a0e17] p-3 border-t border-[#262a34]">
          {selectedSpan ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between font-code-sm text-[11px]">
                <span className="text-[#00f0ff] font-semibold">{selectedSpan.name}</span>
                <span className="text-[#dfe2ef]">Duration: {selectedSpan.durationMs}ms ({((selectedSpan.durationMs / 64.2) * 100).toFixed(1)}% of trace)</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-code-sm text-[10px]">
                {Object.entries(selectedSpan.tags).map(([k, v]) => (
                  <div key={k} className="bg-[#181b25] p-1.5 border border-[#262a34]">
                    <span className="text-[#849495] block text-[9px] uppercase">{k}</span>
                    <span className="text-[#dfe2ef] truncate block">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="font-code-sm text-[11px] text-[#849495] text-center py-1">
              Click any execution span above to inspect its OpenTelemetry metadata tags and attributes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
