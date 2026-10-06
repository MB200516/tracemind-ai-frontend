export type ActiveTab = 'dashboard' | 'traces' | 'incidents' | 'threats';

export interface MicroserviceStatus {
  id: string;
  name: string;
  latencyP99: string;
  errorRate: string;
  state: 'NOMINAL' | 'OPTIMIZED' | 'DEGRADED' | 'CRITICAL';
  statusColor: 'secondary' | 'primary-fixed-dim' | 'error';
}

export interface TopologyNode {
  id: string;
  name: string;
  tier: string;
  tierId: 'client' | 'edge' | 'app' | 'persist';
  latency: string;
  rps: string;
  status: string;
  errors: string;
  k8sServiceId: string;
  statusType: 'ok' | 'warning' | 'degraded';
  upstreams: { name: string; latency: string }[];
  downstreams: { name: string; latency: string }[];
}

export interface Incident {
  id: string;
  code: string;
  severity: 'CRITICAL' | 'MEDIUM' | 'RESOLVED';
  service: string;
  timeAgo: string;
  title: string;
  rootCause: string;
  state: 'INVESTIGATING' | 'AUTO-MITIGATED' | 'RESOLVED';
  spanId: string;
  correlatedEndpoint: string;
  correlatedLatency: string;
  barWidth: string;
  barColor: string;
  origin: string;
  lockTime: string;
  explanation: string;
  timeline: {
    time: string;
    title: string;
    description: string;
    color: string;
  }[];
  actionLabel: string;
  acknowledged?: boolean;
}

export interface Threat {
  id: string;
  title: string;
  status: 'ACTIVE' | 'BLOCKED' | 'DROPPED';
  endpoint: string;
  origin: string;
  originType?: string;
  anomalyScore?: string;
  actionText: string;
  traceId: string;
  mitigation?: string;
  traceImpact?: string;
  mechanism?: string;
  statusText?: string;
  decodedSignature: {
    trace_id: string;
    vector: string;
    target: string;
    entropy_variance: number;
    payload_probe: {
      tokens_requested: number;
      concurrency: number;
      auth_context: string;
    };
  };
  upstreamQuarantined: string;
}

export interface LiveSpan {
  id: string;
  statusCode: number;
  method: string;
  path: string;
  service: string;
  durationMs: number;
  durationStr: string;
  isError?: boolean;
  barPercent: number;
}
