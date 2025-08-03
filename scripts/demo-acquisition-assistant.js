const { faker } = require('@faker-js/faker');

// Demo script for Acquisition Assistant Agent
class AcquisitionAssistantDemo {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
  }

  async runDemo() {
    console.log('🧠 Acquisition Assistant Agent Demo');
    console.log('=====================================\n');

    try {
      // 1. Create diverse deal scenarios
      await this.createDiverseDeals();
      
      // 2. Demonstrate pipeline management
      await this.demonstratePipelineManagement();
      
      // 3. Show chaos-aware features
      await this.demonstrateChaosFeatures();
      
      // 4. Display AI CIM generation
      await this.demonstrateAICIM();
      
      // 5. Show outreach automation
      await this.demonstrateOutreachAutomation();

      console.log('\n✅ Demo completed successfully!');
      console.log('Visit http://localhost:3000/acquisition-assistant to see the full dashboard');
      
    } catch (error) {
      console.error('❌ Demo failed:', error.message);
    }
  }

  async createDiverseDeals() {
    console.log('📋 Creating diverse deal scenarios...\n');

    const scenarios = [
      {
        name: 'TechFlow Solutions',
        industry: 'Technology',
        revenue: 15000000,
        ebitda: 3750000,
        stage: 'Due Diligence',
        description: 'High-growth SaaS company with strong recurring revenue',
        contacts: [
          { name: 'Sarah Chen', role: 'CEO', email: 'sarah@techflow.com', responseRate: 0.85, sentimentScore: 0.75 },
          { name: 'Mike Rodriguez', role: 'CFO', email: 'mike@techflow.com', responseRate: 0.65, sentimentScore: 0.60 }
        ],
        daysSinceContact: 3,
        hasNDA: true,
        hasLOI: true
      },
      {
        name: 'Midwest Manufacturing Co',
        industry: 'Manufacturing',
        revenue: 45000000,
        ebitda: 9000000,
        stage: 'LOI Submitted',
        description: 'Family-owned manufacturing business ready for exit',
        contacts: [
          { name: 'Robert Johnson', role: 'Owner', email: 'rjohnson@midwestmfg.com', responseRate: 0.45, sentimentScore: 0.55 }
        ],
        daysSinceContact: 12,
        hasNDA: true,
        hasLOI: false
      },
      {
        name: 'HealthCare Partners LLC',
        industry: 'Healthcare',
        revenue: 8500000,
        ebitda: 1700000,
        stage: 'Initial Contact',
        description: 'Regional healthcare services provider',
        contacts: [
          { name: 'Dr. Amanda Wilson', role: 'Managing Partner', email: 'awilson@hcp.com', responseRate: 0.95, sentimentScore: 0.90 }
        ],
        daysSinceContact: 1,
        hasNDA: false,
        hasLOI: false
      },
      {
        name: 'Retail Innovations Inc',
        industry: 'Retail',
        revenue: 25000000,
        ebitda: 2500000,
        stage: 'NDA Signed',
        description: 'E-commerce platform with strong market position',
        contacts: [
          { name: 'James Park', role: 'Founder', email: 'james@retailinnovations.com', responseRate: 0.70, sentimentScore: 0.80 },
          { name: 'Lisa Chang', role: 'COO', email: 'lisa@retailinnovations.com', responseRate: 0.75, sentimentScore: 0.75 }
        ],
        daysSinceContact: 7,
        hasNDA: true,
        hasLOI: false
      },
      {
        name: 'Professional Services Group',
        industry: 'Services',
        revenue: 12000000,
        ebitda: 3600000,
        stage: 'Lead',
        description: 'Consulting firm with high-value client base',
        contacts: [],
        daysSinceContact: 21,
        hasNDA: false,
        hasLOI: false
      }
    ];

    for (const scenario of scenarios) {
      const dealData = this.createDealFromScenario(scenario);
      
      const response = await fetch(`${this.baseUrl}/api/acquisition-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createDeal', dealData })
      });

      if (response.ok) {
        console.log(`✅ Created deal: ${scenario.name} (${scenario.stage})`);
      } else {
        console.log(`❌ Failed to create deal: ${scenario.name}`);
      }
    }

    console.log('\n');
  }

  createDealFromScenario(scenario) {
    return {
      targetCompany: {
        name: scenario.name,
        industry: scenario.industry,
        revenue: scenario.revenue,
        ebitda: scenario.ebitda,
        employees: Math.floor(scenario.revenue / 200000), // Rough estimate
        location: `${faker.location.city()}, ${faker.location.state()}`,
        description: scenario.description,
        website: `https://${scenario.name.toLowerCase().replace(/\s+/g, '')}.com`,
        keyMetrics: {
          growthRate: faker.number.float({ min: 5, max: 25 }),
          marketShare: faker.number.float({ min: 2, max: 15 }),
          customerRetention: faker.number.float({ min: 85, max: 95 })
        }
      },
      stage: scenario.stage,
      contacts: scenario.contacts.map(contact => ({
        ...contact,
        phone: faker.phone.number(),
        lastContact: new Date(Date.now() - scenario.daysSinceContact * 24 * 60 * 60 * 1000)
      })),
      timeline: {
        nda: scenario.hasNDA ? { signed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } : {},
        loi: scenario.hasLOI ? { submitted: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) } : {},
        dueDiligence: scenario.stage === 'Due Diligence' ? { started: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } : {}
      },
      lastContact: new Date(Date.now() - scenario.daysSinceContact * 24 * 60 * 60 * 1000)
    };
  }

  async demonstratePipelineManagement() {
    console.log('🔄 Demonstrating Pipeline Management...\n');

    // Get all deals
    const dealsResponse = await fetch(`${this.baseUrl}/api/acquisition-assistant?action=getAllDeals`);
    const dealsData = await dealsResponse.json();
    
    if (dealsData.deals && dealsData.deals.length > 0) {
      const deal = dealsData.deals[0];
      
      // Manage pipeline for first deal
      const pipelineResponse = await fetch(`${this.baseUrl}/api/acquisition-assistant?action=managePipeline&dealId=${deal.id}`);
      const pipelineData = await pipelineResponse.json();
      
      console.log(`📊 Pipeline Analysis for ${deal.targetCompany.name}:`);
      console.log(`   Stage: ${pipelineData.stage}`);
      console.log(`   IRR: ${pipelineData.irr}%`);
      console.log(`   Synergy Value: $${(pipelineData.synergyScore / 1000000).toFixed(1)}M`);
      console.log(`   Follow-ups: ${pipelineData.followUps.length} actions recommended`);
      console.log(`   Recommendations: ${pipelineData.recommendations.length} items`);
      
      if (pipelineData.recommendations.length > 0) {
        console.log('\n   🎯 Top Recommendations:');
        pipelineData.recommendations.slice(0, 3).forEach((rec, i) => {
          console.log(`      ${i + 1}. ${rec}`);
        });
      }
    }

    console.log('\n');
  }

  async demonstrateChaosFeatures() {
    console.log('⚡ Demonstrating Chaos-Aware Features...\n');

    // Get decay analytics
    const decayResponse = await fetch(`${this.baseUrl}/api/acquisition-assistant/analytics?type=decay`);
    const decayData = await decayResponse.json();
    
    if (decayData.overview) {
      console.log('📈 Deal Decay Analysis:');
      console.log(`   Average Decay Score: ${decayData.overview.avgDecayScore.toFixed(1)}`);
      console.log(`   High Risk Deals: ${decayData.overview.riskCategories.high}`);
      console.log(`   Medium Risk Deals: ${decayData.overview.riskCategories.medium}`);
      console.log(`   Low Risk Deals: ${decayData.overview.riskCategories.low}`);
      
      if (decayData.detailedScores && decayData.detailedScores.length > 0) {
        console.log('\n   🚨 Highest Risk Deals:');
        decayData.detailedScores
          .sort((a, b) => b.decayScore - a.decayScore)
          .slice(0, 3)
          .forEach((deal, i) => {
            console.log(`      ${i + 1}. ${deal.companyName} - Risk Score: ${deal.decayScore.toFixed(0)} (${deal.daysSinceContact} days since contact)`);
          });
      }
      
      if (decayData.recommendations && decayData.recommendations.length > 0) {
        console.log('\n   💡 Automated Recommendations:');
        decayData.recommendations.slice(0, 3).forEach((rec, i) => {
          console.log(`      ${i + 1}. [${rec.priority}] ${rec.action} - ${rec.reason}`);
        });
      }
    }

    console.log('\n');
  }

  async demonstrateAICIM() {
    console.log('📄 Demonstrating AI CIM Generation...\n');

    // Get deals and generate CIM for one
    const dealsResponse = await fetch(`${this.baseUrl}/api/acquisition-assistant?action=getAllDeals`);
    const dealsData = await dealsResponse.json();
    
    if (dealsData.deals && dealsData.deals.length > 0) {
      const deal = dealsData.deals.find(d => d.stage !== 'Lead') || dealsData.deals[0];
      
      const cimResponse = await fetch(`${this.baseUrl}/api/acquisition-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generateCIM', dealId: deal.id })
      });
      
      const cimData = await cimResponse.json();
      
      if (cimData.cim) {
        console.log(`📋 AI-Generated CIM for ${deal.targetCompany.name}:`);
        console.log('   ' + '='.repeat(50));
        
        // Show first few lines of CIM
        const cimLines = cimData.cim.split('\n').slice(0, 15);
        cimLines.forEach(line => {
          if (line.trim()) {
            console.log(`   ${line}`);
          }
        });
        
        console.log('   ...');
        console.log(`   ✅ Full CIM generated (${cimData.cim.length} characters)`);
      }
    }

    console.log('\n');
  }

  async demonstrateOutreachAutomation() {
    console.log('📧 Demonstrating Outreach Automation...\n');

    // Get deals and show outreach for one
    const dealsResponse = await fetch(`${this.baseUrl}/api/acquisition-assistant?action=getAllDeals`);
    const dealsData = await dealsResponse.json();
    
    if (dealsData.deals && dealsData.deals.length > 0) {
      const deal = dealsData.deals.find(d => d.contacts && d.contacts.length > 0) || dealsData.deals[0];
      
      const outreachResponse = await fetch(`${this.baseUrl}/api/acquisition-assistant/outreach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId: deal.id, action: 'generateSequences' })
      });
      
      const outreachData = await outreachResponse.json();
      
      if (outreachData.followUps && outreachData.followUps.length > 0) {
        console.log(`📬 Automated Outreach Sequences for ${deal.targetCompany.name}:`);
        
        outreachData.followUps.forEach((action, i) => {
          console.log(`   ${i + 1}. [${action.priority.toUpperCase()}] ${action.type.toUpperCase()}`);
          console.log(`      To: ${action.recipient}`);
          console.log(`      Content: ${action.content.substring(0, 80)}...`);
          console.log(`      Scheduled: ${new Date(action.scheduledFor).toLocaleDateString()}`);
          console.log('');
        });
      } else {
        console.log(`   ℹ️  No immediate follow-ups needed for ${deal.targetCompany.name}`);
      }
    }

    console.log('\n');
  }

  async displaySummary() {
    console.log('📊 Acquisition Assistant Summary');
    console.log('=================================\n');

    // Get pipeline analytics
    const pipelineResponse = await fetch(`${this.baseUrl}/api/acquisition-assistant/analytics?type=pipeline`);
    const pipelineData = await pipelineResponse.json();
    
    if (pipelineData.summary) {
      console.log(`💰 Total Pipeline Value: $${(pipelineData.summary.totalValue / 1000000).toFixed(1)}M`);
      console.log(`📈 Average IRR: ${pipelineData.summary.avgIRR.toFixed(1)}%`);
      console.log(`⏱️  Average Time to Close: ${pipelineData.summary.avgTimeToClose} days`);
      console.log(`✅ Closed Deals: ${pipelineData.summary.closedDeals}`);
      console.log(`🔄 Active Deals: ${pipelineData.summary.activeDeals}`);
      console.log(`📋 Total Deals: ${pipelineData.summary.totalDeals}`);
    }

    console.log('\n🚀 Key Features Demonstrated:');
    console.log('   ✅ Deal Tracker Engine - Automated stage tracking');
    console.log('   ✅ AI CIM Generator - Intelligent document creation');
    console.log('   ✅ Outreach Flow Manager - Automated follow-ups');
    console.log('   ✅ Negotiation Scoreboard - Response & sentiment tracking');
    console.log('   ✅ Chaos-Aware Design - Deal decay prediction');
    console.log('   ✅ IRR & Synergy Calculator - Financial modeling');
    console.log('   ✅ Pipeline Analytics - Comprehensive reporting');
  }
}

// Run demo if called directly
if (require.main === module) {
  const demo = new AcquisitionAssistantDemo();
  demo.runDemo().then(() => {
    demo.displaySummary();
  });
}

module.exports = AcquisitionAssistantDemo;