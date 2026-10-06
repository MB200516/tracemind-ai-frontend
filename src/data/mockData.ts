import { MicroserviceStatus, TopologyNode, Incident, Threat, LiveSpan } from '../types';

export const MICROSERVICES: MicroserviceStatus[] = [
  {
    id: 'auth-gateway',
    name: 'auth-gateway',
    latencyP99: '4.8ms',
    errorRate: '0.00%',
    state: 'NOMINAL',
    statusColor: 'secondary'
  },
  {
    id: 'ingest-router',
    name: 'ingest-router',
    latencyP99: '11.4ms',
    errorRate: '0.01%',
    state: 'NOMINAL',
    statusColor: 'secondary'
  },
  {
    id: 'ml-inference',
    name: 'ml-inference',
    latencyP99: '28.9ms',
    errorRate: '0.02%',
    state: 'OPTIMIZED',
    statusColor: 'primary-fixed-dim'
  },
  {
    id: 'trace-store',
    name: 'trace-store',
    latencyP99: '18.2ms',
    errorRate: '0.00%',
    state: 'NOMINAL',
    statusColor: 'secondary'
  },
  {
    id: 'billing-worker',
    name: 'billing-worker',
    latencyP99: '8.1ms',
    errorRate: '0.00%',
    state: 'NOMINAL',
    statusColor: 'secondary'
  }
];

export const TOPOLOGY_NODES: Record<string, TopologyNode> = {
  'node-llm': {
    id: 'node-llm',
    name: 'LLM Inference Cluster',
    tier: 'Tier 03 (Core)',
    tierId: 'app',
    latency: '64.2ms',
    rps: '3,240 rps',
    status: 'Degraded (p95 spike)',
    errors: '2.10%',
    k8sServiceId: 'cluster.svc.llm-inference.vllm',
    statusType: 'degraded',
    upstreams: [
      { name: 'Routing Proxy', latency: '42ms avg' },
      { name: 'Ingestion Bus', latency: '61ms avg' }
    ],
    downstreams: [
      { name: 'ClickHouse Vector', latency: '14ms avg' },
      { name: 'Redis Cache', latency: '0.9ms avg' }
    ]
  },
  'node-web-client': {
    id: 'node-web-client',
    name: 'Edge Client (Web SDK)',
    tier: 'Tier 01 (Client)',
    tierId: 'client',
    latency: '4.2ms',
    rps: '18.2k',
    status: '200 OK',
    errors: '0.00%',
    k8sServiceId: 'ingress.client.web-spa',
    statusType: 'ok',
    upstreams: [{ name: 'Cloudflare CDN', latency: '2.1ms avg' }],
    downstreams: [{ name: 'API Gateway', latency: '1.2ms avg' }]
  },
  'node-mobile-client': {
    id: 'node-mobile-client',
    name: 'Mobile / Edge SDK',
    tier: 'Tier 01 (Client)',
    tierId: 'client',
    latency: '16.8ms',
    rps: '9.4k',
    status: '200 OK',
    errors: '0.01%',
    k8sServiceId: 'ingress.client.grpc-mobile',
    statusType: 'ok',
    upstreams: [{ name: 'Global Anycast BGP', latency: '5.4ms avg' }],
    downstreams: [
      { name: 'API Gateway', latency: '1.2ms avg' },
      { name: 'Auth Engine', latency: '3.1ms avg' }
    ]
  },
  'node-api-gw': {
    id: 'node-api-gw',
    name: 'Envoy Ingress Gateway',
    tier: 'Tier 02 (Edge)',
    tierId: 'edge',
    latency: '1.2ms',
    rps: '27.6k',
    status: '200 OK',
    errors: '0.00%',
    k8sServiceId: 'k8s.svc.envoy-ingress-gateway',
    statusType: 'ok',
    upstreams: [
      { name: 'Edge Client (Web SDK)', latency: '4.2ms avg' },
      { name: 'Mobile / Edge SDK', latency: '16.8ms avg' }
    ],
    downstreams: [
      { name: 'Routing Proxy', latency: '2.1ms avg' },
      { name: 'Ingestion Bus', latency: '8.4ms avg' },
      { name: 'LLM Inference Cluster', latency: '64.2ms avg' }
    ]
  },
  'node-auth': {
    id: 'node-auth',
    name: 'Auth & Token Engine',
    tier: 'Tier 02 (Edge)',
    tierId: 'edge',
    latency: '3.1ms',
    rps: '14.1k',
    status: '200 OK',
    errors: '0.00%',
    k8sServiceId: 'k8s.svc.auth-security-engine',
    statusType: 'ok',
    upstreams: [{ name: 'Mobile / Edge SDK', latency: '16.8ms avg' }],
    downstreams: [
      { name: 'Ingestion Bus', latency: '8.4ms avg' },
      { name: 'Pay Processor', latency: '18.1ms avg' }
    ]
  },
  'node-routing': {
    id: 'node-routing',
    name: 'Smart Routing Proxy',
    tier: 'Tier 03 (Core)',
    tierId: 'app',
    latency: '2.1ms',
    rps: '19.4k',
    status: '200 OK',
    errors: '0.00%',
    k8sServiceId: 'k8s.svc.smart-routing-proxy',
    statusType: 'ok',
    upstreams: [{ name: 'Envoy Ingress Gateway', latency: '1.2ms avg' }],
    downstreams: [
      { name: 'LLM Inference Cluster', latency: '64.2ms avg' },
      { name: 'Redis Cache Cluster', latency: '0.8ms avg' }
    ]
  },
  'node-ingestion': {
    id: 'node-ingestion',
    name: 'Telemetry Ingestion Pipeline',
    tier: 'Tier 03 (Core)',
    tierId: 'app',
    latency: '8.4ms',
    rps: '22.8k',
    status: '200 OK',
    errors: '0.01%',
    k8sServiceId: 'k8s.svc.telemetry-ingestion-kafka',
    statusType: 'ok',
    upstreams: [
      { name: 'Envoy Ingress Gateway', latency: '1.2ms avg' },
      { name: 'Auth & Token Engine', latency: '3.1ms avg' }
    ],
    downstreams: [
      { name: 'LLM Inference Cluster', latency: '64.2ms avg' },
      { name: 'PostgreSQL Aurora Primary', latency: '6.4ms avg' },
      { name: 'ClickHouse Vector Store', latency: '14.3ms avg' }
    ]
  },
  'node-payment': {
    id: 'node-payment',
    name: 'Payment Transaction Svc',
    tier: 'Tier 03 (Core)',
    tierId: 'app',
    latency: '18.1ms',
    rps: '1.1k',
    status: '200 OK',
    errors: '0.00%',
    k8sServiceId: 'k8s.svc.payment-pci-dss',
    statusType: 'ok',
    upstreams: [{ name: 'Auth & Token Engine', latency: '3.1ms avg' }],
    downstreams: [{ name: 'PostgreSQL Aurora Primary', latency: '6.4ms avg' }]
  },
  'node-redis': {
    id: 'node-redis',
    name: 'Redis Cache Cluster',
    tier: 'Tier 04 (State)',
    tierId: 'persist',
    latency: '0.8ms',
    rps: '35.2k',
    status: '200 OK',
    errors: '0.00%',
    k8sServiceId: 'k8s.svc.redis-cache-cluster',
    statusType: 'ok',
    upstreams: [
      { name: 'Smart Routing Proxy', latency: '2.1ms avg' },
      { name: 'LLM Inference Cluster', latency: '64.2ms avg' }
    ],
    downstreams: [{ name: 'Memory Bus Shards (x6)', latency: '0.2ms avg' }]
  },
  'node-postgres': {
    id: 'node-postgres',
    name: 'PostgreSQL Aurora Primary',
    tier: 'Tier 04 (State)',
    tierId: 'persist',
    latency: '6.4ms',
    rps: '12.0k',
    status: '200 OK',
    errors: '0.00%',
    k8sServiceId: 'k8s.svc.postgres-aurora-acid',
    statusType: 'ok',
    upstreams: [
      { name: 'Telemetry Ingestion Pipeline', latency: '8.4ms avg' },
      { name: 'Payment Transaction Svc', latency: '18.1ms avg' }
    ],
    downstreams: [{ name: 'WAL Replication Stream', latency: '1.1ms avg' }]
  },
  'node-clickhouse': {
    id: 'node-clickhouse',
    name: 'ClickHouse Vector Store',
    tier: 'Tier 04 (State)',
    tierId: 'persist',
    latency: '14.3ms',
    rps: '8.8k',
    status: '200 OK',
    errors: '0.02%',
    k8sServiceId: 'k8s.svc.clickhouse-vector-olap',
    statusType: 'ok',
    upstreams: [
      { name: 'LLM Inference Cluster', latency: '64.2ms avg' },
      { name: 'Telemetry Ingestion Pipeline', latency: '8.4ms avg' }
    ],
    downstreams: [{ name: 'Disk NVMe Vector Index', latency: '3.4ms avg' }]
  }
};

export const INCIDENTS_DATA: Incident[] = [
  {
    id: '1',
    code: 'INC-4091',
    severity: 'CRITICAL',
    service: 'redis-cache-tier',
    timeAgo: '12m ago',
    title: 'Redis cluster replica lag spike',
    rootCause:
      'Memory pressure triggered eviction cycle in cluster shard-02. Latency increased by +420ms on read downstream.',
    state: 'INVESTIGATING',
    spanId: 'span-7f83a0bc991',
    correlatedEndpoint: 'GET /api/v1/user/cache',
    correlatedLatency: '842ms (+710%)',
    barWidth: '88%',
    barColor: 'bg-[#ffb4ab]',
    origin: 'edge-router-01',
    lockTime: '620ms',
    explanation:
      'Sharding keyspace collision during automated batch writes from <span class="font-code-sm text-[#00f0ff]">data-sync-worker</span> exhausted free memory on <span class="font-code-sm text-[#dfe2ef]">shard-02</span>. The LRU eviction cycle locked read threads for 620ms, propagating replica synchronization delays to downstream cache clients.',
    timeline: [
      {
        time: '14:21:02',
        title: 'Shard Memory 94% Threshold Exceeded',
        description: 'Maxmemory flag engaged; keyspace sweep initiated',
        color: 'bg-[#ffb4ab]'
      },
      {
        time: '14:21:18',
        title: 'Trace Latency Spike Alert Triggered',
        description: 'P99 degraded from 18ms to 842ms',
        color: 'bg-[#00f0ff]'
      },
      {
        time: '14:22:04',
        title: 'Replica Sync Offset Alert',
        description: 'Replica lagged by >1.2M unacknowledged write bytes',
        color: 'bg-[#4edea3]'
      }
    ],
    actionLabel: 'Run Remediation Script'
  },
  {
    id: '2',
    code: 'INC-4088',
    severity: 'MEDIUM',
    service: 'ml-inference-v2',
    timeAgo: '45m ago',
    title: 'Upstream rate limit on inference provider',
    rootCause:
      'HTTP 429 received from secondary vector provider fallback. Automatic traffic shaping redirected 100% load to regional replica.',
    state: 'AUTO-MITIGATED',
    spanId: 'span-9942ff6c12e',
    correlatedEndpoint: 'POST /v2/embeddings/batch',
    correlatedLatency: '184ms (+14%)',
    barWidth: '42%',
    barColor: 'bg-[#4edea3]',
    origin: 'inference-router-west',
    lockTime: '0ms (fallback ok)',
    explanation:
      'HTTP 429 Too Many Requests returned by vector search upstream during query surge. Circuit breaker opened gracefully at 14:02:11 UTC. Autonomous fall-through router routed traffic to cold-standby embedded indices with sub-50ms delta.',
    timeline: [
      {
        time: '13:58:20',
        title: 'External Provider Ingestion Spurt',
        description: 'Rate cap of 12,000 req/min saturated',
        color: 'bg-[#00f0ff]'
      },
      {
        time: '14:01:45',
        title: 'Auto-Mitigation: Circuit Breaker Fired',
        description: 'Traffic reshuffled across secondary replicas',
        color: 'bg-[#4edea3]'
      }
    ],
    actionLabel: 'Verify Upstream Health'
  },
  {
    id: '3',
    code: 'INC-4081',
    severity: 'RESOLVED',
    service: 'edge-ingress-04',
    timeAgo: '3h ago',
    title: 'TLS Handshake timeout on edge-ingress-04',
    rootCause:
      'Stale session ticket encryption key rotation deadlock during rolling update.',
    state: 'RESOLVED',
    spanId: 'span-4e9102c89aa',
    correlatedEndpoint: 'CONNECT /tls/session-resumption',
    correlatedLatency: '12ms (Normal)',
    barWidth: '12%',
    barColor: 'bg-[#4edea3]',
    origin: 'ingress-envoy-node',
    lockTime: '0ms',
    explanation:
      'Resolved by Auto-healer controller after restarting stale Envoy daemonset pods in availability zone eu-central-1b. Handshake latency normalized back to 3.4ms.',
    timeline: [
      {
        time: '11:14:00',
        title: 'TLS Handshake Error Rate Spike (1.4%)',
        description: 'Session resumption keys out of sync across worker nodes',
        color: 'bg-[#ffb4ab]'
      },
      {
        time: '11:15:30',
        title: 'Autonomous Rollout Healer Triggered',
        description: 'Graceful node pod rotation and TLS session cache flush',
        color: 'bg-[#4edea3]'
      }
    ],
    actionLabel: 'Reopen Incident'
  }
];

export const THREATS_DATA: Threat[] = [
  {
    id: 'THR-102',
    title: 'Anomalous Token Extraction Burst',
    status: 'ACTIVE',
    endpoint: '/v1/chat/completions',
    origin: '194.26.29.x',
    originType: '(Tor Exit)',
    anomalyScore: '98.4%',
    actionText: 'Action: Rate-throttled & IP quarantined',
    traceId: '7a92-ef01',
    decodedSignature: {
      trace_id: '00-7a92bf008-c01',
      vector: 'TOKEN_HARVEST_BURST',
      target: '/v1/chat/completions',
      entropy_variance: 0.9984,
      payload_probe: {
        tokens_requested: 131072,
        concurrency: 64,
        auth_context: 'REPLAY_SUSPECT'
      }
    },
    upstreamQuarantined: 'edge-ingress-02'
  },
  {
    id: 'THR-098',
    title: 'SQL Injection Pattern via Query Param',
    status: 'BLOCKED',
    endpoint: '/api/traces/search',
    origin: '89.144.20.12',
    anomalyScore: '94.2%',
    actionText: 'WAF Policy #402 applied',
    mitigation: 'WAF Policy #402',
    traceImpact: '0ms Leak',
    traceId: '8f4c-sqli',
    decodedSignature: {
      trace_id: '00-8f4c2e091b-waf',
      vector: 'SQLI_UNION_SELECT',
      target: '/api/traces/search?query=admin\'%20OR%201=1--',
      entropy_variance: 0.7412,
      payload_probe: {
        tokens_requested: 0,
        concurrency: 1,
        auth_context: 'UNAUTHENTICATED'
      }
    },
    upstreamQuarantined: 'waf-edge-shield'
  },
  {
    id: 'THR-094',
    title: 'Unauthorized gRPC Reflection Probe',
    status: 'DROPPED',
    endpoint: 'internal-auth:50051',
    origin: '10.244.18.2 (Compromised Worker Pod)',
    anomalyScore: '89.1%',
    actionText: 'mTLS Identity Reject',
    mechanism: 'mTLS Identity Reject',
    traceImpact: 'Packet Nullified',
    traceId: 'grpc-refl-094',
    decodedSignature: {
      trace_id: '00-3c1a998f4-proto',
      vector: 'GRPC_REFLECTION_DISCOVERY',
      target: 'grpc.reflection.v1alpha.ServerReflection',
      entropy_variance: 0.8123,
      payload_probe: {
        tokens_requested: 0,
        concurrency: 4,
        auth_context: 'INVALID_SPIFFE_ID'
      }
    },
    upstreamQuarantined: 'service-mesh-istio-proxy'
  }
];

export const LIVE_SPANS_BUFFER: LiveSpan[] = [
  {
    id: 'span-1',
    statusCode: 200,
    method: 'POST',
    path: '/api/v2/inference/rag-completion',
    service: 'cluster.svc.llm-inference',
    durationMs: 38.4,
    durationStr: '38.4ms',
    barPercent: 40
  },
  {
    id: 'span-2',
    statusCode: 200,
    method: 'GET',
    path: '/v1/tokens/validate',
    service: 'cluster.svc.auth',
    durationMs: 1.8,
    durationStr: '1.8ms',
    barPercent: 12
  },
  {
    id: 'span-3',
    statusCode: 504,
    method: 'POST',
    path: '/vectors/knn-search',
    service: 'cluster.svc.vector-store',
    durationMs: 120.4,
    durationStr: '120.4ms',
    isError: true,
    barPercent: 94
  },
  {
    id: 'span-4',
    statusCode: 200,
    method: 'GET',
    path: '/telemetry/probes/healthz',
    service: 'cluster.svc.ebpf-daemon',
    durationMs: 0.4,
    durationStr: '0.4ms',
    barPercent: 4
  }
];
