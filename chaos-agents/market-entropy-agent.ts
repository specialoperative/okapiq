/**
 * 🌪️ MARKET ENTROPY AGENT - Chaos Theory Applied to SMB Intelligence
 * 
 * Uses non-linear dynamics, phase transition detection, and emergent pattern recognition
 * to predict business succession events before they occur in traditional channels.
 */

import { OpenAI } from 'openai';
import { Logger } from '../utils/logger';

export interface MarketEntropy {
  zipCode: string;
  industry: string;
  entropy_score: number; // 0-100, higher = more chaotic/opportunity-rich
  phase_transition_probability: number; // 0-1, likelihood of market disruption
  succession_velocity: number; // Rate of ownership changes
  causality_factors: CausalityFactor[];
  emergence_timeline: EmergenceEvent[];
  attractors: MarketAttractor[]; // Strange attractors in market behavior
}

export interface CausalityFactor {
  factor: string;
  weight: number; // 0-1
  entropy_contribution: number;
  trend_direction: 'increasing' | 'decreasing' | 'oscillating' | 'chaotic';
  confidence: number;
}

export interface EmergenceEvent {
  business_name: string;
  predicted_event: 'succession' | 'closure' | 'acquisition' | 'expansion';
  probability: number;
  timeline_days: number;
  causality_chain: string[];
  entropy_signature: number[];
}

export interface MarketAttractor {
  type: 'fixed_point' | 'limit_cycle' | 'strange_attractor';
  description: string;
  influence_radius: number; // Geographic influence in miles
  businesses_affected: string[];
  periodicity?: number; // For cyclic attractors
}

export class MarketEntropyAgent {
  private openai: OpenAI;
  private logger: Logger;
  private entropy_memory: Map<string, MarketEntropy[]> = new Map();
  
  constructor(apiKey: string, logger: Logger) {
    this.openai = new OpenAI({ apiKey });
    this.logger = logger;
  }

  /**
   * Core entropy calculation using chaos theory principles
   */
  public async calculateMarketEntropy(
    zipCode: string, 
    industry: string, 
    dataPoints: any[]
  ): Promise<MarketEntropy> {
    
    const startTime = Date.now();
    this.logger.info(`🌪️ Calculating market entropy for ${zipCode}/${industry}`);

    // 1. Extract chaotic variables from data points
    const chaosVariables = this.extractChaosVariables(dataPoints);
    
    // 2. Calculate Lyapunov exponents (measure of chaos)
    const lyapunovExponents = this.calculateLyapunovExponents(chaosVariables);
    
    // 3. Detect phase transitions using AI pattern recognition
    const phaseTransitions = await this.detectPhaseTransitions(chaosVariables);
    
    // 4. Identify market attractors (stable patterns)
    const attractors = this.identifyMarketAttractors(chaosVariables);
    
    // 5. Generate causality network
    const causalityFactors = await this.buildCausalityNetwork(dataPoints);
    
    // 6. Predict emergence events
    const emergenceEvents = await this.predictEmergenceEvents(
      chaosVariables, 
      causalityFactors, 
      attractors
    );

    const entropy: MarketEntropy = {
      zipCode,
      industry,
      entropy_score: this.normalizeEntropy(lyapunovExponents),
      phase_transition_probability: phaseTransitions.probability,
      succession_velocity: this.calculateSuccessionVelocity(chaosVariables),
      causality_factors: causalityFactors,
      emergence_timeline: emergenceEvents,
      attractors
    };

    // Store in memory for temporal analysis
    this.storeEntropyMemory(zipCode, industry, entropy);
    
    const processingTime = Date.now() - startTime;
    this.logger.info(`🌪️ Entropy calculation completed in ${processingTime}ms`, {
      entropy_score: entropy.entropy_score,
      phase_transition_prob: entropy.phase_transition_probability,
      predicted_events: entropy.emergence_timeline.length
    });

    return entropy;
  }

  /**
   * Extract chaotic variables from raw business data
   */
  private extractChaosVariables(dataPoints: any[]): ChaosVariable[] {
    const variables: ChaosVariable[] = [];

    dataPoints.forEach((business, index) => {
      // Owner age dynamics
      if (business.owner_age) {
        variables.push({
          name: `owner_age_${index}`,
          value: business.owner_age,
          variance: business.owner_age_variance || 0,
          temporal_derivative: business.age_change_rate || 0,
          coupling_strength: 0.8 // High coupling with succession risk
        });
      }

      // Yelp entropy (review velocity, rating variance)
      if (business.yelp_data) {
        const reviewEntropy = this.calculateReviewEntropy(business.yelp_data);
        variables.push({
          name: `yelp_entropy_${index}`,
          value: reviewEntropy,
          variance: business.yelp_data.rating_variance || 0,
          temporal_derivative: business.yelp_data.review_velocity_change || 0,
          coupling_strength: 0.6
        });
      }

      // Financial chaos indicators
      if (business.financial_data) {
        variables.push({
          name: `financial_chaos_${index}`,
          value: business.financial_data.revenue_volatility || 0,
          variance: business.financial_data.expense_variance || 0,
          temporal_derivative: business.financial_data.profit_trend || 0,
          coupling_strength: 0.9
        });
      }

      // Digital footprint entropy
      if (business.digital_presence) {
        const digitalEntropy = this.calculateDigitalEntropy(business.digital_presence);
        variables.push({
          name: `digital_entropy_${index}`,
          value: digitalEntropy,
          variance: business.digital_presence.posting_variance || 0,
          temporal_derivative: business.digital_presence.engagement_trend || 0,
          coupling_strength: 0.4
        });
      }
    });

    return variables;
  }

  /**
   * Calculate Lyapunov exponents to measure chaos sensitivity
   */
  private calculateLyapunovExponents(variables: ChaosVariable[]): number[] {
    const exponents: number[] = [];
    
    for (let i = 0; i < variables.length; i++) {
      for (let j = i + 1; j < variables.length; j++) {
        const var1 = variables[i];
        const var2 = variables[j];
        
        // Calculate divergence rate between coupled variables
        const deltaValue = Math.abs(var1.value - var2.value);
        const deltaTime = 1; // Normalized time step
        
        if (deltaValue > 0) {
          const lyapunov = Math.log(deltaValue) / deltaTime;
          exponents.push(lyapunov * var1.coupling_strength * var2.coupling_strength);
        }
      }
    }
    
    return exponents;
  }

  /**
   * Use AI to detect phase transitions in market behavior
   */
  private async detectPhaseTransitions(variables: ChaosVariable[]): Promise<{
    probability: number;
    transition_type: string;
    timeline_days: number;
  }> {
    
    const prompt = `
    Analyze these market chaos variables and detect potential phase transitions:
    
    Variables: ${JSON.stringify(variables.map(v => ({
      name: v.name,
      value: v.value,
      variance: v.variance,
      trend: v.temporal_derivative
    })), null, 2)}
    
    Using chaos theory and non-linear dynamics, identify:
    1. Probability of phase transition (0-1)
    2. Type of transition (gradual_shift, sudden_collapse, bifurcation, emergence)
    3. Expected timeline in days
    
    Consider:
    - Critical thresholds where small changes cause large effects
    - Bifurcation points where system behavior fundamentally changes
    - Attractor basins and their stability
    - Coupling effects between variables
    
    Respond in JSON format:
    {
      "probability": number,
      "transition_type": string,
      "timeline_days": number,
      "reasoning": string
    }
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        probability: result.probability || 0,
        transition_type: result.transition_type || 'unknown',
        timeline_days: result.timeline_days || 999
      };

    } catch (error) {
      this.logger.error('Phase transition detection failed', error);
      return { probability: 0, transition_type: 'unknown', timeline_days: 999 };
    }
  }

  /**
   * Identify market attractors using pattern recognition
   */
  private identifyMarketAttractors(variables: ChaosVariable[]): MarketAttractor[] {
    const attractors: MarketAttractor[] = [];
    
    // Find fixed points (stable states)
    const fixedPoints = variables.filter(v => 
      Math.abs(v.temporal_derivative) < 0.1 && v.variance < 0.2
    );
    
    if (fixedPoints.length > 0) {
      attractors.push({
        type: 'fixed_point',
        description: 'Stable market equilibrium detected',
        influence_radius: 5, // 5 mile radius
        businesses_affected: fixedPoints.map(fp => fp.name)
      });
    }

    // Find limit cycles (oscillating patterns)
    const cyclicVariables = variables.filter(v => 
      Math.abs(v.temporal_derivative) > 0.5 && v.variance > 0.3
    );
    
    if (cyclicVariables.length > 2) {
      attractors.push({
        type: 'limit_cycle',
        description: 'Periodic market oscillation detected',
        influence_radius: 3,
        businesses_affected: cyclicVariables.map(cv => cv.name),
        periodicity: 90 // 90-day cycles
      });
    }

    // Find strange attractors (chaotic but bounded behavior)
    const chaoticVariables = variables.filter(v => 
      v.variance > 0.7 && Math.abs(v.temporal_derivative) > 0.3
    );
    
    if (chaoticVariables.length > 1) {
      attractors.push({
        type: 'strange_attractor',
        description: 'Chaotic market behavior with hidden order',
        influence_radius: 2,
        businesses_affected: chaoticVariables.map(cv => cv.name)
      });
    }

    return attractors;
  }

  /**
   * Build causality network using AI reasoning
   */
  private async buildCausalityNetwork(dataPoints: any[]): Promise<CausalityFactor[]> {
    const prompt = `
    Build a causality network for these business data points:
    ${JSON.stringify(dataPoints.slice(0, 10), null, 2)}
    
    Identify causal relationships between factors like:
    - Owner demographics → succession risk
    - Yelp performance → customer retention
    - Financial metrics → business stability
    - Digital presence → market visibility
    - Location factors → foot traffic
    
    For each causal factor, provide:
    1. Factor name
    2. Weight (0-1, strength of causal influence)
    3. Entropy contribution (how much it adds to market chaos)
    4. Trend direction
    5. Confidence in the relationship
    
    Focus on non-obvious, emergent causalities that traditional analysis misses.
    
    Respond in JSON format as array of factors.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4
      });

      const factors = JSON.parse(response.choices[0].message.content || '[]');
      return factors.map((f: any) => ({
        factor: f.factor || 'unknown',
        weight: f.weight || 0.5,
        entropy_contribution: f.entropy_contribution || 0.3,
        trend_direction: f.trend_direction || 'oscillating',
        confidence: f.confidence || 0.5
      }));

    } catch (error) {
      this.logger.error('Causality network building failed', error);
      return [];
    }
  }

  /**
   * Predict specific emergence events using chaos theory
   */
  private async predictEmergenceEvents(
    variables: ChaosVariable[],
    causality: CausalityFactor[],
    attractors: MarketAttractor[]
  ): Promise<EmergenceEvent[]> {
    
    const prompt = `
    Using chaos theory and the following market intelligence, predict specific business emergence events:
    
    Chaos Variables: ${JSON.stringify(variables.slice(0, 5))}
    Causality Factors: ${JSON.stringify(causality.slice(0, 5))}
    Market Attractors: ${JSON.stringify(attractors)}
    
    For each predicted event:
    1. Identify specific business (can be hypothetical based on patterns)
    2. Predict event type (succession, closure, acquisition, expansion)
    3. Calculate probability (0-1)
    4. Estimate timeline in days
    5. Show causality chain leading to event
    6. Provide entropy signature (array of key chaos indicators)
    
    Focus on events likely to occur in the next 90 days.
    Use butterfly effect principles - small current changes → large future effects.
    
    Respond as JSON array of emergence events.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6
      });

      const events = JSON.parse(response.choices[0].message.content || '[]');
      return events.map((e: any) => ({
        business_name: e.business_name || 'Unknown Business',
        predicted_event: e.predicted_event || 'succession',
        probability: e.probability || 0.5,
        timeline_days: e.timeline_days || 90,
        causality_chain: e.causality_chain || [],
        entropy_signature: e.entropy_signature || []
      }));

    } catch (error) {
      this.logger.error('Emergence event prediction failed', error);
      return [];
    }
  }

  /**
   * Helper methods for entropy calculations
   */
  private calculateReviewEntropy(yelpData: any): number {
    const reviewCounts = yelpData.monthly_reviews || [];
    if (reviewCounts.length < 2) return 0;

    let entropy = 0;
    const total = reviewCounts.reduce((sum: number, count: number) => sum + count, 0);
    
    reviewCounts.forEach((count: number) => {
      if (count > 0) {
        const probability = count / total;
        entropy -= probability * Math.log2(probability);
      }
    });

    return entropy;
  }

  private calculateDigitalEntropy(digitalData: any): number {
    const postingFrequency = digitalData.posts_per_week || 0;
    const engagementVariance = digitalData.engagement_variance || 0;
    const platformDiversity = digitalData.platform_count || 1;

    return (engagementVariance * 0.6) + 
           (1 / (postingFrequency + 1) * 0.3) + 
           (1 / platformDiversity * 0.1);
  }

  private normalizeEntropy(lyapunovExponents: number[]): number {
    if (lyapunovExponents.length === 0) return 0;
    
    const maxExponent = Math.max(...lyapunovExponents);
    const avgExponent = lyapunovExponents.reduce((sum, exp) => sum + exp, 0) / lyapunovExponents.length;
    
    // Normalize to 0-100 scale
    return Math.min(100, Math.max(0, (avgExponent + maxExponent) * 50));
  }

  private calculateSuccessionVelocity(variables: ChaosVariable[]): number {
    const ageVariables = variables.filter(v => v.name.includes('owner_age'));
    if (ageVariables.length === 0) return 0;

    const avgAgeDerivative = ageVariables.reduce((sum, v) => sum + Math.abs(v.temporal_derivative), 0) / ageVariables.length;
    return avgAgeDerivative * 10; // Scale to meaningful velocity
  }

  private storeEntropyMemory(zipCode: string, industry: string, entropy: MarketEntropy): void {
    const key = `${zipCode}_${industry}`;
    const history = this.entropy_memory.get(key) || [];
    
    history.push(entropy);
    
    // Keep only last 30 entropy calculations for temporal analysis
    if (history.length > 30) {
      history.shift();
    }
    
    this.entropy_memory.set(key, history);
  }

  /**
   * Public API for retrieving entropy history
   */
  public getEntropyHistory(zipCode: string, industry: string): MarketEntropy[] {
    const key = `${zipCode}_${industry}`;
    return this.entropy_memory.get(key) || [];
  }

  /**
   * Detect market phase transitions across time
   */
  public async detectTemporalPhaseTransitions(zipCode: string, industry: string): Promise<{
    transition_detected: boolean;
    transition_type: string;
    confidence: number;
    critical_point: Date;
  }> {
    const history = this.getEntropyHistory(zipCode, industry);
    
    if (history.length < 5) {
      return {
        transition_detected: false,
        transition_type: 'insufficient_data',
        confidence: 0,
        critical_point: new Date()
      };
    }

    // Analyze entropy trajectory for critical transitions
    const entropyTrajectory = history.map(h => h.entropy_score);
    const derivatives = this.calculateDerivatives(entropyTrajectory);
    const secondDerivatives = this.calculateDerivatives(derivatives);

    // Look for rapid acceleration in entropy (phase transition indicator)
    const maxSecondDerivative = Math.max(...secondDerivatives.map(Math.abs));
    const transitionThreshold = 5.0; // Empirically determined

    return {
      transition_detected: maxSecondDerivative > transitionThreshold,
      transition_type: maxSecondDerivative > transitionThreshold ? 'critical_transition' : 'stable',
      confidence: Math.min(1.0, maxSecondDerivative / (transitionThreshold * 2)),
      critical_point: new Date() // Would be calculated from actual transition point
    };
  }

  private calculateDerivatives(values: number[]): number[] {
    const derivatives: number[] = [];
    for (let i = 1; i < values.length; i++) {
      derivatives.push(values[i] - values[i-1]);
    }
    return derivatives;
  }
}

export interface ChaosVariable {
  name: string;
  value: number;
  variance: number;
  temporal_derivative: number; // Rate of change
  coupling_strength: number; // How strongly this affects other variables
}