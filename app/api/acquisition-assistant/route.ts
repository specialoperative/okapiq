import { NextRequest, NextResponse } from 'next/server';
import { acquisitionAssistant } from '@/services/acquisition-assistant';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const dealId = searchParams.get('dealId');

    switch (action) {
      case 'getAllDeals':
        const deals = acquisitionAssistant.getAllDeals();
        return NextResponse.json({ deals });

      case 'getDeal':
        if (!dealId) {
          return NextResponse.json({ error: 'Deal ID required' }, { status: 400 });
        }
        const deal = await acquisitionAssistant.getDealData(dealId);
        if (!deal) {
          return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
        }
        return NextResponse.json({ deal });

      case 'managePipeline':
        if (!dealId) {
          return NextResponse.json({ error: 'Deal ID required' }, { status: 400 });
        }
        const pipelineResult = await acquisitionAssistant.managePipeline(dealId);
        return NextResponse.json(pipelineResult);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Acquisition Assistant API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, dealData, dealId, updates } = body;

    switch (action) {
      case 'createDeal':
        const newDeal = acquisitionAssistant.createDeal(dealData || {});
        return NextResponse.json({ deal: newDeal });

      case 'updateDeal':
        if (!dealId) {
          return NextResponse.json({ error: 'Deal ID required' }, { status: 400 });
        }
        const updatedDeal = acquisitionAssistant.updateDeal(dealId, updates);
        if (!updatedDeal) {
          return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
        }
        return NextResponse.json({ deal: updatedDeal });

      case 'generateCIM':
        if (!dealId) {
          return NextResponse.json({ error: 'Deal ID required' }, { status: 400 });
        }
        const deal = await acquisitionAssistant.getDealData(dealId);
        if (!deal) {
          return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
        }
        const cim = await acquisitionAssistant.generateCIM({
          company: deal.targetCompany,
          financials: deal.financials,
          industryBenchmarks: await acquisitionAssistant.getIndustryBenchmarks(deal.targetCompany.industry)
        });
        return NextResponse.json({ cim });

      case 'trackDealDecay':
        if (!dealId) {
          return NextResponse.json({ error: 'Deal ID required' }, { status: 400 });
        }
        const decayDeal = await acquisitionAssistant.getDealData(dealId);
        if (!decayDeal) {
          return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
        }
        const decayScore = acquisitionAssistant.trackDealDecay(decayDeal);
        return NextResponse.json({ decayScore });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Acquisition Assistant API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}