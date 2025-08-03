# 🔥 CURSOR PROMPTS - CHAOS ENGINE ORCHESTRATION

## Core Orchestration Prompt - Master Controller

```typescript
// CURSOR PROMPT: Chaos Engine Master Orchestrator
/*
Create a ChaosEngineOrchestrator class that:

1. Coordinates MarketEntropyAgent + EmergencePredictionAgent + Ghost Fleet
2. Uses real-time WebSocket feeds for live market updates
3. Implements adaptive learning algorithms that get smarter over time
4. Auto-triggers scraping missions based on entropy spikes
5. Generates real-time alerts when phase transitions detected

Key Features:
- React to entropy changes in real-time (like a living organism)
- Route different signal types to specialized sub-agents
- Maintain temporal memory of market states for pattern recognition
- Auto-scale Ghost Fleet based on opportunity density
- Generate investment-ready deal briefs when confidence > 80%

Architecture:
- Event-driven with pub/sub pattern
- Redis for real-time state management
- MongoDB for temporal pattern storage
- WebSocket for live dashboard updates
- Background job queue for heavy AI processing

The orchestrator should feel like a chaotic, adaptive, living intelligence system.
*/

interface ChaosOrchestratorConfig {
  entropy_threshold: number; // Trigger level for auto-actions
  emergence_sensitivity: number; // How quickly to react to signals
  ghost_fleet_scaling: 'manual' | 'auto' | 'predictive';
  ai_learning_rate: number;
  real_time_mode: boolean;
}

class ChaosEngineOrchestrator {
  // Implement the orchestration logic here
}
```

---

## Signal Processing Prompt - Real-Time Market Sensing

```typescript
// CURSOR PROMPT: Real-Time Signal Processor
/*
Build a RealTimeSignalProcessor that continuously monitors market signals:

1. Yelp API monitoring for review velocity changes
2. Google My Business status tracking
3. IRS/SOS filing change detection
4. Social media sentiment analysis for business distress
5. Ad spend tracking via Facebook/Google Ad libraries

Technical Requirements:
- Process 10,000+ signals per minute
- Detect anomalies using statistical process control
- Use sliding window analysis for trend detection
- Apply Kalman filters for noise reduction
- Implement circuit breakers for API rate limits

The processor should identify:
- Sudden review drops (business distress)
- Owner behavior changes (succession signals)
- Competitor landscape shifts
- Market saturation/opportunity gaps
- Franchise network health changes

Output: Real-time signal stream for chaos agents to consume
*/

interface SignalSource {
  type: 'yelp' | 'gmb' | 'irs' | 'social' | 'ads';
  endpoint: string;
  rate_limit: number;
  health_check: () => Promise<boolean>;
}

class RealTimeSignalProcessor {
  // Implement continuous signal monitoring
}
```

---

## AI Agent Prompt - Swarm Intelligence Controller

```typescript
// CURSOR PROMPT: AI Swarm Intelligence Agent
/*
Create an AI agent that behaves like a swarm intelligence for market discovery:

1. Multiple specialized "drone" agents for different signal types
2. Inter-agent communication using pheromone-like message passing
3. Emergent behavior where agents adapt and specialize
4. Self-organizing based on signal density and success rates
5. Collective intelligence that's smarter than individual agents

Agent Types:
- ScoutAgent: Discovers new signal sources
- AnalyzerAgent: Deep analysis of specific signals
- ValidatorAgent: Confirms signal authenticity
- PredictorAgent: Forecasts signal evolution
- CoordinatorAgent: Orchestrates swarm behavior

Swarm Behaviors:
- Convergence on high-signal areas
- Divergence to explore new territories
- Load balancing based on agent performance
- Memory sharing across the swarm
- Adaptive specialization

The swarm should exhibit emergence: collective intelligence > sum of parts
*/

interface SwarmAgent {
  agent_id: string;
  specialization: string[];
  performance_history: number[];
  pheromone_trails: Map<string, number>;
  communicate: (message: any) => void;
}

class AISwarmIntelligence {
  // Implement swarm coordination logic
}
```

---

## Chaos Fleet Prompt - Advanced Ghost Network

```typescript
// CURSOR PROMPT: Chaos Fleet - Advanced Ghost Network
/*
Build an advanced ghost network that operates like a chaotic system:

1. Self-healing proxy rotation with chaos injection
2. Adaptive fingerprinting that evolves with detection
3. Quantum-inspired randomization for unpredictability
4. Distributed consensus for coordinated actions
5. Emergent scraping strategies based on success patterns

Anti-Detection Features:
- Chaos-based timing variations
- Behavioral pattern evolution
- Dynamic proxy mesh networking
- ML-powered captcha solving
- Social engineering for access

Fleet Coordination:
- Byzantine fault tolerance
- Distributed task assignment
- Real-time performance optimization
- Adaptive rate limiting
- Failure cascade prevention

The fleet should be antifragile: gets stronger from disruptions
*/

interface ChaosNode {
  node_id: string;
  chaos_factor: number; // 0-1, how chaotic behavior should be
  adaptation_rate: number;
  performance_metrics: PerformanceMetrics;
  behavioral_dna: BehavioralPattern[];
}

class ChaosGhostFleet {
  // Implement antifragile scraping network
}
```

---

## Predictive Analytics Prompt - Market Phase Transition Engine

```typescript
// CURSOR PROMPT: Market Phase Transition Prediction Engine
/*
Create a prediction engine using chaos theory and complexity science:

1. Phase transition detection using order parameters
2. Critical point identification with early warning signals
3. Bifurcation analysis for market trajectory prediction
4. Strange attractor modeling for cyclical patterns
5. Butterfly effect amplification for small signal impact

Mathematical Models:
- Logistic maps for population dynamics
- Lorenz equations for chaotic behavior
- Hopf bifurcations for oscillatory transitions
- Catastrophe theory for sudden changes
- Network percolation for cascade effects

Prediction Outputs:
- Phase transition probability
- Critical transition timeline
- Tipping point identification
- Market regime classification
- Opportunity window timing

Should predict market changes 30-90 days before they manifest
*/

interface PhaseTransition {
  transition_type: 'gradual' | 'sudden' | 'catastrophic' | 'oscillatory';
  probability: number;
  timeline_days: number;
  critical_parameters: string[];
  early_warning_signals: Signal[];
}

class MarketPhaseTransitionEngine {
  // Implement chaos theory prediction models
}
```

---

## Integration Prompt - Chaos API Gateway

```typescript
// CURSOR PROMPT: Chaos API Gateway with Real-Time Intelligence
/*
Build a high-performance API gateway that serves chaos intelligence:

1. GraphQL endpoint for complex market queries
2. WebSocket streaming for real-time updates
3. REST API for traditional integrations
4. Webhook system for proactive notifications
5. SDK generation for multiple languages

Real-Time Features:
- Live entropy heatmaps
- Phase transition alerts
- Opportunity emergence notifications
- Fleet status monitoring
- Performance dashboards

API Capabilities:
- Complex market topology queries
- Historical pattern analysis
- Predictive scenario modeling
- Custom signal subscriptions
- Bulk data exports

Performance Requirements:
- <100ms response times
- 10,000+ concurrent connections
- 99.9% uptime
- Auto-scaling based on demand
- Circuit breaker patterns

The API should feel like querying a living, intelligent market organism
*/

interface ChaosAPIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'WEBSOCKET' | 'GRAPHQL';
  real_time: boolean;
  caching_strategy: 'none' | 'aggressive' | 'smart';
  rate_limit: number;
}

class ChaosAPIGateway {
  // Implement high-performance chaos intelligence API
}
```

---

## Data Pipeline Prompt - Temporal Intelligence Engine

```typescript
// CURSOR PROMPT: Temporal Intelligence Data Pipeline
/*
Create a time-series data pipeline for temporal pattern recognition:

1. Multi-resolution time series storage (second → year granularity)
2. Sliding window analysis with exponential smoothing
3. Seasonal decomposition for cyclical patterns
4. Anomaly detection using isolation forests
5. Temporal correlation analysis across signal types

Pipeline Stages:
- Raw signal ingestion
- Noise filtering and cleaning
- Feature extraction and transformation
- Pattern recognition and classification
- Temporal relationship mapping

Storage Strategy:
- Hot storage: Last 30 days (millisecond precision)
- Warm storage: Last year (minute precision)  
- Cold storage: Historical (hour precision)
- Archive: Compressed long-term patterns

Analysis Capabilities:
- Lead-lag relationship detection
- Cross-correlation analysis
- Granger causality testing
- Fourier transform for frequency analysis
- Wavelet analysis for time-frequency patterns

The pipeline should discover temporal patterns humans can't see
*/

interface TemporalPattern {
  pattern_id: string;
  frequency: number; // Hz
  amplitude: number;
  phase: number;
  confidence: number;
  temporal_extent: [Date, Date];
}

class TemporalIntelligenceEngine {
  // Implement time-series pattern recognition
}
```

---

## Deployment Prompt - Chaos Infrastructure

```bash
# CURSOR PROMPT: Chaos Infrastructure Deployment
# Create infrastructure-as-code for chaos engine deployment:

# 1. Kubernetes deployment with auto-scaling
# 2. Redis cluster for real-time state
# 3. MongoDB replica set for data persistence
# 4. Prometheus/Grafana for monitoring
# 5. ELK stack for log analysis

# Infrastructure Components:
# - API Gateway (3 replicas, auto-scale to 50)
# - Chaos Orchestrator (5 replicas)
# - Ghost Fleet Manager (10 replicas)
# - Signal Processors (50 replicas, burst to 200)
# - AI Agents (20 replicas, GPU-enabled)

# Performance Targets:
# - Process 100,000 signals/minute
# - Generate 1,000 opportunities/hour
# - <500ms API response times
# - 99.95% uptime
# - Auto-recovery from failures

# Create:
# - Docker containers with optimized images
# - Kubernetes manifests with resource limits
# - Helm charts for easy deployment
# - CI/CD pipeline with chaos testing
# - Infrastructure monitoring and alerting

version: '3.8'
services:
  chaos-orchestrator:
    # Define optimized deployment configuration
```

---

## Testing Prompt - Chaos Validation Framework

```typescript
// CURSOR PROMPT: Chaos Engine Testing Framework
/*
Build a comprehensive testing framework for chaos systems:

1. Chaos engineering tests (inject failures)
2. Property-based testing for emergent behaviors
3. A/B testing for prediction accuracy
4. Load testing for performance validation
5. Red team testing for anti-detection

Test Categories:
- Unit tests for individual agents
- Integration tests for agent coordination  
- System tests for end-to-end scenarios
- Performance tests for scalability
- Chaos tests for resilience

Validation Metrics:
- Prediction accuracy (precision/recall)
- Signal detection sensitivity
- False positive/negative rates
- System latency and throughput
- Anti-detection effectiveness

The testing should prove the system is antifragile and adaptive
*/

interface ChaosTest {
  test_name: string;
  chaos_injection: string[];
  expected_behavior: 'adapt' | 'degrade_gracefully' | 'self_heal';
  success_criteria: string[];
}

class ChaosValidationFramework {
  // Implement comprehensive chaos testing
}
```

---

## Production Monitoring Prompt - Chaos Observatory

```typescript
// CURSOR PROMPT: Chaos Engine Observatory
/*
Create a monitoring system that observes chaos engine behavior:

1. Real-time performance dashboards
2. Anomaly detection for system behavior
3. Predictive failure analysis
4. Adaptive alert thresholds
5. Self-healing automation triggers

Monitoring Dimensions:
- Agent performance and adaptation
- Signal quality and noise levels
- Prediction accuracy over time
- System resource utilization
- Business outcome correlation

Observatory Features:
- 3D visualization of market entropy
- Real-time chaos metrics
- Pattern evolution tracking
- Fleet coordination visualization
- Emergence event timelines

The observatory should provide insights into the system's "consciousness"
*/

interface ChaosMetric {
  metric_name: string;
  current_value: number;
  trend_direction: 'increasing' | 'decreasing' | 'stable' | 'chaotic';
  alert_threshold: number;
  adaptive_threshold: boolean;
}

class ChaosEngineObservatory {
  // Implement intelligent system monitoring
}
```

---

## Usage Examples

### Quick Start Chaos Engine:
```bash
# Initialize chaos engine
npm run chaos:init

# Start with restaurant industry in Chicago
npm run chaos:scan -- --industry restaurants --location "Chicago, IL" --depth deep

# Enable real-time mode
npm run chaos:live -- --entropy-threshold 75 --auto-scale

# Generate investment brief
npm run chaos:brief -- --opportunity-id opp_12345 --format pdf
```

### Advanced Chaos Operations:
```bash
# Inject chaos for testing
npm run chaos:inject -- --failure-type proxy-ban --intensity 0.7

# Temporal analysis
npm run chaos:temporal -- --lookback 90d --predict 30d

# Swarm coordination
npm run chaos:swarm -- --convergence-target high-entropy-zones
```

These prompts create a fully orchestrated chaos intelligence system that operates beyond traditional scraping - it's a living, adaptive market intelligence organism.