import React from 'react';

interface TraceInspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  spanId: string;
  cluster: string;
}

export const TraceInspectModal: React.FC<TraceInspectModalProps> = ({
  isOpen,
  onClose,
  spanId,
  cluster
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#070b13]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#181b25] border border-[#262a34] w-full max-w-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#262a34] bg-[#0a0e17]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00dbe9] text-[20px]">
              data_object
            </span>
            <div className="flex flex-col">
              <span className="font-headline-md text-[14px] text-[#dfe2ef] font-semibold">
                Trace Context Ingestion Inspector
              </span>
              <span className="font-code-sm text-[10px] text-[#849495]">
                Span ID: <span className="text-[#00f0ff]">{spanId}</span>
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

        {/* Content */}
        <div className="p-4 flex flex-col gap-3 font-code-sm text-[11px]">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#0a0e17] p-2 border border-[#262a34]">
              <span className="text-[#849495] text-[9px] block">CLUSTER CONTEXT</span>
              <span className="text-[#dfe2ef] font-medium">{cluster}</span>
            </div>
            <div className="bg-[#0a0e17] p-2 border border-[#262a34]">
              <span className="text-[#849495] text-[9px] block">TARGET SUB-PATH</span>
              <span className="text-[#00dbe9] font-medium">/ml-inference/postprocess</span>
            </div>
            <div className="bg-[#0a0e17] p-2 border border-[#262a34]">
              <span className="text-[#849495] text-[9px] block">DURATION</span>
              <span className="text-[#4edea3] font-medium">2.14ms</span>
            </div>
            <div className="bg-[#0a0e17] p-2 border border-[#262a34]">
              <span className="text-[#849495] text-[9px] block">eBPF SAMPLING</span>
              <span className="text-[#dfe2ef] font-medium">100% Deterministic (Ring 0)</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-label-caps text-[9px] text-[#849495] uppercase">
              DECODED PAYLOAD ATTRIBUTES
            </span>
            <pre className="bg-[#0a0e17] p-2.5 text-[#dfe2ef] border border-[#262a34] overflow-x-auto text-[10px] leading-relaxed">
              <code>{`{
  "traceparent": "00-8f4c2e091b64a-4a2109bc-01",
  "tracestate": "congo=t61rcWkgMzE,rojo=00f061",
  "rpc.method": "vLLM.PostprocessEmbedding",
  "rpc.service": "ml-inference",
  "net.peer.name": "10.244.12.8",
  "net.peer.port": 50051,
  "thread.id": 140412891,
  "memory.peak_rss_mb": 412.4,
  "error": false
}`}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0a0e17] p-3 border-t border-[#262a34] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#262a34] hover:bg-[#353943] text-[#dfe2ef] font-code-sm text-[11px] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
