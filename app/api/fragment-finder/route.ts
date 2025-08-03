/**
 * Fragment Finder API Route
 * 
 * Next.js API endpoint for the Fragment Finder Agent
 */

import { NextRequest, NextResponse } from 'next/server';
import { FragmentFinderAgent } from '../../../services/fragment-finder-agent';
import { FragmentFinderResponse, BatchAnalysisRequest } from '../../../types/fragment-finder';

const fragmentFinder = new FragmentFinderAgent();

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { zip, industry, options } = body;

    // Validate required parameters
    if (!zip || !industry) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: zip and industry are required',
        metadata: {
          processingTime: Date.now() - startTime,
          dataSourcesUsed: [],
          cacheUsed: false
        }
      }, { status: 400 });
    }

    // Validate ZIP code format (basic validation)
    if (!/^\d{5}(-\d{4})?$/.test(zip)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ZIP code format. Use 5-digit format (e.g., 90210)',
        metadata: {
          processingTime: Date.now() - startTime,
          dataSourcesUsed: [],
          cacheUsed: false
        }
      }, { status: 400 });
    }

    // Run the fragmentation analysis
    const analysis = await fragmentFinder.analyzeFragmentation(zip, industry, options);

    const response: FragmentFinderResponse = {
      success: true,
      data: analysis,
      metadata: {
        processingTime: Date.now() - startTime,
        dataSourcesUsed: ['yelp', 'google', 'bbb'],
        cacheUsed: false
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Fragment Finder API error:', error);
    
    const response: FragmentFinderResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      metadata: {
        processingTime: Date.now() - startTime,
        dataSourcesUsed: [],
        cacheUsed: false
      }
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const zip = searchParams.get('zip');
  const industry = searchParams.get('industry');

  if (!zip || !industry) {
    return NextResponse.json({
      success: false,
      error: 'Missing required query parameters: zip and industry',
      metadata: {
        processingTime: 0,
        dataSourcesUsed: [],
        cacheUsed: false
      }
    }, { status: 400 });
  }

  // Convert GET request to POST format
  return POST(new NextRequest(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      zip,
      industry,
      options: {
        includeEntropy: searchParams.get('includeEntropy') === 'true',
        maxBusinesses: parseInt(searchParams.get('maxBusinesses') || '200'),
        includeNLPAnalysis: searchParams.get('includeNLPAnalysis') !== 'false'
      }
    })
  }));
}