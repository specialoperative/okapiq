import { faker } from '@faker-js/faker';
import { addDays, formatISO, differenceInDays, isBefore } from 'date-fns';

// Types for deal management
export interface Deal {
  id: string;
  targetCompany: CompanyProfile;
  buyerProfile: BuyerProfile;
  stage: DealStage;
  financials: FinancialData;
  timeline: DealTimeline;
  contacts: ContactInfo[];
  documents: DealDocument[];
  scoring: DealScoring;
  lastContact: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyProfile {
  name: string;
  industry: string;
  revenue: number;
  ebitda: number;
  employees: number;
  location: string;
  description: string;
  website?: string;
  keyMetrics: Record<string, number>;
}

export interface BuyerProfile {
  name: string;
  type: 'PE' | 'SearchFund' | 'Strategic' | 'Family Office';
  budget: { min: number; max: number };
  preferredIndustries: string[];
  targetMetrics: Record<string, number>;
}

export interface FinancialData {
  cashflows: number[];
  projectedGrowth: number;
  currentValuation: number;
  targetMultiple: number;
  synergies: SynergyAnalysis;
}

export interface SynergyAnalysis {
  revenueUpside: number;
  costSavings: number;
  totalValue: number;
  confidenceLevel: number;
}

export interface DealTimeline {
  loi: { submitted?: Date; accepted?: Date; };
  nda: { signed?: Date; };
  dueDiligence: { started?: Date; completed?: Date; };
  closing: { expected?: Date; actual?: Date; };
}

export interface ContactInfo {
  name: string;
  role: string;
  email: string;
  phone?: string;
  lastContact: Date;
  responseRate: number;
  sentimentScore: number;
}

export interface DealDocument {
  id: string;
  type: 'CIM' | 'LOI' | 'NDA' | 'Financials' | 'Other';
  title: string;
  url?: string;
  generatedAt?: Date;
  status: 'Draft' | 'Sent' | 'Signed' | 'Reviewed';
}

export interface DealScoring {
  irr: number;
  probabilityScore: number;
  timeToClose: number; // days
  riskFactors: string[];
  dealDecayScore: number; // 0-100, higher = more likely to fail
}

export type DealStage = 
  | 'Lead'
  | 'Initial Contact' 
  | 'NDA Signed'
  | 'LOI Submitted'
  | 'LOI Accepted'
  | 'Due Diligence'
  | 'Final Negotiations'
  | 'Closing'
  | 'Closed'
  | 'Dead';

// Main Acquisition Assistant class
export class AcquisitionAssistant {
  private deals: Map<string, Deal> = new Map();
  private historicalData: Deal[] = [];

  // Core pipeline management function
  async managePipeline(dealId: string): Promise<{
    stage: DealStage;
    irr: number;
    synergyScore: number;
    cim?: string;
    followUps: OutreachAction[];
    recommendations: string[];
  }> {
    const deal = await this.getDealData(dealId);
    if (!deal) throw new Error(`Deal ${dealId} not found`);

    const stage = this.determineDealStage(deal);
    const irr = this.calculateIRR(deal.financials.cashflows);
    const synergyScore = this.assessSynergies(deal.targetCompany, deal.buyerProfile);

    const followUps = await this.generateOutreachSequences({
      targetName: deal.targetCompany.name,
      lastContactDate: deal.lastContact,
      dealStage: stage,
      contacts: deal.contacts
    });

    const cim = await this.generateCIM({
      company: deal.targetCompany,
      financials: deal.financials,
      industryBenchmarks: await this.getIndustryBenchmarks(deal.targetCompany.industry)
    });

    const recommendations = this.generateRecommendations(deal);

    // Update deal with new data
    deal.stage = stage;
    deal.scoring.irr = irr;
    deal.financials.synergies.totalValue = synergyScore;
    deal.updatedAt = new Date();
    
    this.deals.set(dealId, deal);

    return {
      stage,
      irr,
      synergyScore,
      cim,
      followUps,
      recommendations
    };
  }

  // Deal Tracker Engine
  determineDealStage(deal: Deal): DealStage {
    const timeline = deal.timeline;
    
    if (timeline.closing?.actual) return 'Closed';
    if (timeline.dueDiligence?.started && !timeline.dueDiligence?.completed) return 'Due Diligence';
    if (timeline.loi?.accepted) return 'LOI Accepted';
    if (timeline.loi?.submitted) return 'LOI Submitted';
    if (timeline.nda?.signed) return 'NDA Signed';
    if (deal.contacts.length > 0) return 'Initial Contact';
    
    return 'Lead';
  }

  // IRR Calculator
  calculateIRR(cashflows: number[]): number {
    if (cashflows.length < 2) return 0;

    let irr = 0.1; // Initial guess
    const tolerance = 0.0001;
    const maxIterations = 1000;

    for (let i = 0; i < maxIterations; i++) {
      const npv = this.calculateNPV(cashflows, irr);
      const npvDerivative = this.calculateNPVDerivative(cashflows, irr);

      if (Math.abs(npv) < tolerance) break;
      if (npvDerivative === 0) break;

      irr = irr - npv / npvDerivative;
    }

    return Math.round(irr * 10000) / 100; // Return as percentage
  }

  private calculateNPV(cashflows: number[], rate: number): number {
    return cashflows.reduce((npv, cashflow, index) => {
      return npv + cashflow / Math.pow(1 + rate, index);
    }, 0);
  }

  private calculateNPVDerivative(cashflows: number[], rate: number): number {
    return cashflows.reduce((derivative, cashflow, index) => {
      if (index === 0) return derivative;
      return derivative - (index * cashflow) / Math.pow(1 + rate, index + 1);
    }, 0);
  }

  // Synergy Assessment
  assessSynergies(target: CompanyProfile, buyer: BuyerProfile): number {
    let synergyScore = 0;

    // Revenue synergies
    const industryMatch = buyer.preferredIndustries.includes(target.industry) ? 1.2 : 0.8;
    const scaleMultiplier = Math.min(target.revenue / 1000000, 10) * 0.1; // Max 100% uplift
    const revenueUpside = target.revenue * 0.15 * industryMatch * scaleMultiplier;

    // Cost synergies
    const costSavings = target.revenue * 0.08; // 8% cost savings baseline

    // Technology and operational synergies
    const opSynergies = target.employees > 50 ? target.revenue * 0.05 : 0;

    synergyScore = revenueUpside + costSavings + opSynergies;

    return Math.round(synergyScore);
  }

  // Outreach Flow Manager
  async generateOutreachSequences(params: {
    targetName: string;
    lastContactDate: Date;
    dealStage: DealStage;
    contacts: ContactInfo[];
  }): Promise<OutreachAction[]> {
    const daysSinceContact = differenceInDays(new Date(), params.lastContactDate);
    const actions: OutreachAction[] = [];

    // Stage-specific outreach logic
    switch (params.dealStage) {
      case 'Lead':
        if (daysSinceContact > 7) {
          actions.push({
            type: 'email',
            priority: 'high',
            scheduledFor: new Date(),
            content: this.generateInitialOutreachEmail(params.targetName),
            recipient: params.contacts[0]?.email || 'unknown@company.com'
          });
        }
        break;

      case 'Initial Contact':
        if (daysSinceContact > 3) {
          actions.push({
            type: 'call',
            priority: 'medium',
            scheduledFor: addDays(new Date(), 1),
            content: 'Follow up on initial interest discussion',
            recipient: params.contacts[0]?.name || 'Contact'
          });
        }
        break;

      case 'NDA Signed':
        actions.push({
          type: 'email',
          priority: 'high',
          scheduledFor: new Date(),
          content: this.generateLOIEmail(params.targetName),
          recipient: params.contacts[0]?.email || 'unknown@company.com'
        });
        break;

      case 'Due Diligence':
        if (daysSinceContact > 2) {
          actions.push({
            type: 'call',
            priority: 'high',
            scheduledFor: new Date(),
            content: 'Due diligence progress check and Q&A',
            recipient: params.contacts[0]?.name || 'Contact'
          });
        }
        break;
    }

    return actions;
  }

  // AI CIM Generator
  async generateCIM(params: {
    company: CompanyProfile;
    financials: FinancialData;
    industryBenchmarks: IndustryBenchmarks;
  }): Promise<string> {
    const { company, financials, industryBenchmarks } = params;
    
    const cim = `
# CONFIDENTIAL INFORMATION MEMORANDUM

## ${company.name}
### ${company.industry} | ${company.location}

---

## EXECUTIVE SUMMARY

${company.name} is a well-established ${company.industry.toLowerCase()} company located in ${company.location}, generating annual revenue of $${(company.revenue / 1000000).toFixed(1)}M with EBITDA of $${(company.ebitda / 1000000).toFixed(1)}M (${((company.ebitda / company.revenue) * 100).toFixed(1)}% margin).

**Key Investment Highlights:**
- Strong financial performance with ${((company.ebitda / company.revenue) * 100).toFixed(1)}% EBITDA margins
- ${company.employees} dedicated employees across operations
- Market-leading position in ${company.industry}
- Projected IRR of ${financials.projectedGrowth.toFixed(1)}%
- Synergy potential of $${(financials.synergies.totalValue / 1000000).toFixed(1)}M

## FINANCIAL OVERVIEW

**Revenue & Profitability:**
- Annual Revenue: $${(company.revenue / 1000000).toFixed(1)}M
- EBITDA: $${(company.ebitda / 1000000).toFixed(1)}M
- EBITDA Margin: ${((company.ebitda / company.revenue) * 100).toFixed(1)}%
- Valuation Multiple: ${financials.targetMultiple}x EBITDA

**Industry Benchmarks:**
- Industry Avg EBITDA Margin: ${industryBenchmarks.avgEbitdaMargin.toFixed(1)}%
- Industry Avg Multiple: ${industryBenchmarks.avgMultiple.toFixed(1)}x
- Market Growth Rate: ${industryBenchmarks.marketGrowth.toFixed(1)}%

## INVESTMENT THESIS

This acquisition represents a compelling opportunity to acquire a market-leading ${company.industry.toLowerCase()} business with:

1. **Strong Financial Profile**: Consistent profitability with margins ${((company.ebitda / company.revenue) * 100 - industryBenchmarks.avgEbitdaMargin).toFixed(1)} percentage points above industry average
2. **Growth Potential**: Multiple expansion opportunities through operational improvements and market consolidation
3. **Synergy Realization**: Estimated $${(financials.synergies.totalValue / 1000000).toFixed(1)}M in synergies through cost optimization and revenue enhancement

## NEXT STEPS

Please review this preliminary information and confirm your interest in proceeding to the next stage of our process.

---
*This CIM was generated by AI Deal Engine on ${formatISO(new Date())}*
`;

    return cim;
  }

  // Negotiation Scoreboard & Chaos-Aware Features
  trackDealDecay(deal: Deal): number {
    let decayScore = 0;

    // Time-based decay
    const daysSinceLastContact = differenceInDays(new Date(), deal.lastContact);
    decayScore += Math.min(daysSinceLastContact * 2, 40); // Max 40 points for time

    // Response rate decay
    const avgResponseRate = deal.contacts.reduce((sum, c) => sum + c.responseRate, 0) / deal.contacts.length;
    decayScore += (1 - avgResponseRate) * 30; // Max 30 points for poor response

    // Sentiment decay
    const avgSentiment = deal.contacts.reduce((sum, c) => sum + c.sentimentScore, 0) / deal.contacts.length;
    decayScore += (1 - avgSentiment) * 20; // Max 20 points for poor sentiment

    // Stage stagnation
    const stageTime = differenceInDays(new Date(), deal.updatedAt);
    if (stageTime > 30) decayScore += 10;

    return Math.min(decayScore, 100);
  }

  // Helper methods
  async getDealData(dealId: string): Promise<Deal | null> {
    return this.deals.get(dealId) || null;
  }

  async getIndustryBenchmarks(industry: string): Promise<IndustryBenchmarks> {
    // Mock industry benchmarks - in real implementation, fetch from database
    return {
      avgEbitdaMargin: faker.number.float({ min: 8, max: 25 }),
      avgMultiple: faker.number.float({ min: 3, max: 8 }),
      marketGrowth: faker.number.float({ min: 2, max: 15 }),
      fragmentationIndex: faker.number.float({ min: 0.2, max: 0.9 })
    };
  }

  private generateInitialOutreachEmail(companyName: string): string {
    return `Subject: Strategic Partnership Opportunity - ${companyName}

Dear [Name],

I hope this message finds you well. I'm reaching out regarding a potential strategic partnership opportunity that could significantly benefit ${companyName}.

Our investment group specializes in partnering with exceptional businesses like yours to accelerate growth and market expansion. Based on our analysis, ${companyName} appears to be well-positioned for the next phase of growth.

Would you be open to a brief 15-minute conversation to explore how we might work together?

Best regards,
[Your Name]`;
  }

  private generateLOIEmail(companyName: string): string {
    return `Subject: Letter of Intent - ${companyName} Acquisition

Dear [Name],

Following our productive discussions and the completion of our initial due diligence, we are pleased to submit this Letter of Intent for the acquisition of ${companyName}.

Please find the LOI attached for your review. We believe this represents a fair valuation that reflects both the current performance and future potential of the business.

We look forward to your feedback and moving forward to the next phase of our partnership.

Best regards,
[Your Name]`;
  }

  private generateRecommendations(deal: Deal): string[] {
    const recommendations: string[] = [];
    const decayScore = this.trackDealDecay(deal);

    if (decayScore > 50) {
      recommendations.push("🚨 High deal decay risk - immediate follow-up required");
    }

    if (deal.scoring.irr < 15) {
      recommendations.push("💰 Consider renegotiating terms to improve IRR");
    }

    if (deal.contacts.length < 2) {
      recommendations.push("👥 Expand contact network within target company");
    }

    const daysSinceContact = differenceInDays(new Date(), deal.lastContact);
    if (daysSinceContact > 7) {
      recommendations.push("📞 Schedule immediate follow-up call");
    }

    if (deal.stage === 'Due Diligence' && !deal.timeline.dueDiligence?.completed) {
      const ddDays = deal.timeline.dueDiligence?.started 
        ? differenceInDays(new Date(), deal.timeline.dueDiligence.started)
        : 0;
      if (ddDays > 45) {
        recommendations.push("⏰ Due diligence taking longer than expected - investigate bottlenecks");
      }
    }

    return recommendations;
  }

  // Create new deal
  createDeal(params: Partial<Deal>): Deal {
    const deal: Deal = {
      id: params.id || faker.string.uuid(),
      targetCompany: params.targetCompany || this.generateMockCompany(),
      buyerProfile: params.buyerProfile || this.generateMockBuyer(),
      stage: params.stage || 'Lead',
      financials: params.financials || this.generateMockFinancials(),
      timeline: params.timeline || {},
      contacts: params.contacts || [],
      documents: params.documents || [],
      scoring: params.scoring || {
        irr: 0,
        probabilityScore: 50,
        timeToClose: 180,
        riskFactors: [],
        dealDecayScore: 0
      },
      lastContact: params.lastContact || new Date(),
      createdAt: params.createdAt || new Date(),
      updatedAt: params.updatedAt || new Date()
    };

    this.deals.set(deal.id, deal);
    return deal;
  }

  // Get all deals
  getAllDeals(): Deal[] {
    return Array.from(this.deals.values());
  }

  // Update deal
  updateDeal(dealId: string, updates: Partial<Deal>): Deal | null {
    const deal = this.deals.get(dealId);
    if (!deal) return null;

    const updatedDeal = { ...deal, ...updates, updatedAt: new Date() };
    this.deals.set(dealId, updatedDeal);
    return updatedDeal;
  }

  private generateMockCompany(): CompanyProfile {
    return {
      name: faker.company.name(),
      industry: faker.helpers.arrayElement(['Manufacturing', 'Technology', 'Healthcare', 'Retail', 'Services']),
      revenue: faker.number.int({ min: 1000000, max: 50000000 }),
      ebitda: faker.number.int({ min: 100000, max: 10000000 }),
      employees: faker.number.int({ min: 10, max: 500 }),
      location: `${faker.location.city()}, ${faker.location.state()}`,
      description: faker.company.catchPhrase(),
      website: faker.internet.url(),
      keyMetrics: {
        growthRate: faker.number.float({ min: 5, max: 25 }),
        marketShare: faker.number.float({ min: 1, max: 15 }),
        customerRetention: faker.number.float({ min: 85, max: 98 })
      }
    };
  }

  private generateMockBuyer(): BuyerProfile {
    return {
      name: faker.company.name() + ' Capital',
      type: faker.helpers.arrayElement(['PE', 'SearchFund', 'Strategic', 'Family Office']),
      budget: { min: 5000000, max: 50000000 },
      preferredIndustries: faker.helpers.arrayElements(['Manufacturing', 'Technology', 'Healthcare', 'Retail', 'Services'], 2),
      targetMetrics: {
        minRevenue: 5000000,
        minEbitda: 1000000,
        maxMultiple: 6
      }
    };
  }

  private generateMockFinancials(): FinancialData {
    const revenue = faker.number.int({ min: 5000000, max: 25000000 });
    const ebitda = revenue * faker.number.float({ min: 0.1, max: 0.3 });
    
    return {
      cashflows: Array.from({ length: 5 }, (_, i) => 
        i === 0 ? -ebitda * 5 : ebitda * (1 + 0.1 * i)
      ),
      projectedGrowth: faker.number.float({ min: 10, max: 30 }),
      currentValuation: ebitda * faker.number.float({ min: 4, max: 8 }),
      targetMultiple: faker.number.float({ min: 4, max: 7 }),
      synergies: {
        revenueUpside: revenue * 0.15,
        costSavings: revenue * 0.08,
        totalValue: revenue * 0.23,
        confidenceLevel: faker.number.float({ min: 0.6, max: 0.9 })
      }
    };
  }
}

// Additional interfaces
export interface OutreachAction {
  type: 'email' | 'call' | 'meeting';
  priority: 'low' | 'medium' | 'high';
  scheduledFor: Date;
  content: string;
  recipient: string;
}

export interface IndustryBenchmarks {
  avgEbitdaMargin: number;
  avgMultiple: number;
  marketGrowth: number;
  fragmentationIndex: number;
}

// Export singleton instance
export const acquisitionAssistant = new AcquisitionAssistant();