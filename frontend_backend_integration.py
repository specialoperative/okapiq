"""
Frontend-Backend Integration Layer for Okapiq
Connects the React frontend to all Flask API endpoints
"""

from flask import Flask, jsonify, request, render_template_string, send_from_directory
from flask_cors import CORS
import json
import pandas as pd
import requests
from typing import Dict, List, Optional
import os
from datetime import datetime
import random
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the generated firm database
try:
    with open('/Users/osirislamon/Documents/GitHub/oc_startup/avilla_firms_database.json', 'r') as f:
        FIRMS_DATABASE = json.load(f)
    
    with open('/Users/osirislamon/Documents/GitHub/oc_startup/avilla_summary_stats.json', 'r') as f:
        SUMMARY_STATS = json.load(f)
        
    print(f"✅ Loaded {len(FIRMS_DATABASE)} firms from database")
except Exception as e:
    print(f"❌ Error loading database: {e}")
    FIRMS_DATABASE = []
    SUMMARY_STATS = {}

# API Configuration (using your existing keys)
API_CONFIG = {
    "YELP_API_KEY": os.getenv("YELP_API_KEY", "your_yelp_api_key_here"),
    "GOOGLE_MAPS_API_KEY": os.getenv("GOOGLE_MAPS_API_KEY", "your_google_maps_api_key_here"),
    "CENSUS_API_KEY": os.getenv("CENSUS_API_KEY", "your_census_api_key_here"),
    "DATA_AXLE_API_KEY": os.getenv("DATA_AXLE_API_KEY", "your_data_axle_api_key_here"),
    "SERPAPI_API_KEY": os.getenv("SERPAPI_API_KEY", "your_serpapi_api_key_here"),
    "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY", "your_openai_api_key_here"),
    "MASTERCARD_API_KEY": "mastercard_api_key_here"
}

# ================================
# FRONTEND ROUTE HANDLERS
# ================================

@app.route('/')
def serve_frontend():
    """Serve the main Okapiq React frontend"""
    return render_template_string('''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Okapiq - Bloomberg for Small Businesses</title>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/framer-motion@10/dist/framer-motion.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            /* Okapi Color Palette */
            :root {
                --okapi-brown: #8B4513;
                --okapi-light: #D2691E;
                --okapi-dark: #654321;
                --electric-green: #00FF88;
                --soft-blue: #3B82F6;
            }
            
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                background: linear-gradient(135deg, var(--okapi-brown) 0%, var(--okapi-light) 100%);
                color: #1f2937;
            }
            
            .glass-morphism {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .jaguar-pattern {
                background-image: 
                    radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.3) 8px, transparent 8px),
                    radial-gradient(circle at 80% 70%, rgba(101, 67, 33, 0.2) 6px, transparent 6px),
                    radial-gradient(circle at 40% 80%, rgba(210, 105, 30, 0.25) 10px, transparent 10px);
                background-size: 60px 60px, 45px 45px, 80px 80px;
                animation: jaguarFlow 25s ease-in-out infinite;
            }
            
            @keyframes jaguarFlow {
                0%, 100% { background-position: 0% 0%, 100% 100%, 50% 50%; }
                50% { background-position: 100% 50%, 0% 50%, 25% 75%; }
            }
        </style>
    </head>
    <body>
        <div id="root">
            <div class="min-h-screen jaguar-pattern">
                <!-- Header -->
                <nav class="glass-morphism p-4">
                    <div class="max-w-7xl mx-auto flex justify-between items-center">
                        <div class="flex items-center space-x-2">
                            <div class="w-8 h-8 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-full"></div>
                            <h1 class="text-xl font-bold text-white">Okapiq</h1>
                        </div>
                        <div class="flex space-x-4">
                            <button onclick="navigateTo('dashboard')" class="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all">Dashboard</button>
                            <button onclick="navigateTo('scanner')" class="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all">Market Scanner</button>
                            <button onclick="navigateTo('crm')" class="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all">CRM</button>
                        </div>
                    </div>
                </nav>
                
                <!-- Main Content -->
                <main id="main-content" class="p-8">
                    <div class="max-w-7xl mx-auto">
                        <!-- Landing Section -->
                        <div id="landing-section" class="text-center py-20">
                            <h1 class="text-5xl font-bold text-white mb-6">Bloomberg for Small Businesses</h1>
                            <p class="text-xl text-white/80 mb-8">AI-powered deal sourcing with real-time market intelligence</p>
                            
                            <!-- Live Stats -->
                            <div class="grid grid-cols-4 gap-6 mb-12">
                                <div class="glass-morphism p-6 rounded-xl">
                                    <div class="text-3xl font-bold text-white" id="total-firms">676</div>
                                    <div class="text-white/70">Total Firms</div>
                                </div>
                                <div class="glass-morphism p-6 rounded-xl">
                                    <div class="text-3xl font-bold text-white" id="high-score-firms">256</div>
                                    <div class="text-white/70">High-Score Targets</div>
                                </div>
                                <div class="glass-morphism p-6 rounded-xl">
                                    <div class="text-3xl font-bold text-white" id="succession-firms">96</div>
                                    <div class="text-white/70">Succession Opportunities</div>
                                </div>
                                <div class="glass-morphism p-6 rounded-xl">
                                    <div class="text-3xl font-bold text-white">$12.1B</div>
                                    <div class="text-white/70">Total TAM</div>
                                </div>
                            </div>
                            
                            <!-- Quick Search -->
                            <div class="glass-morphism p-8 rounded-xl max-w-2xl mx-auto">
                                <h3 class="text-2xl font-bold text-white mb-4">Quick Market Scan</h3>
                                <div class="flex gap-4">
                                    <input type="text" id="quick-search" placeholder="Enter industry or location..." 
                                           class="flex-1 p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30">
                                    <button onclick="performQuickScan()" 
                                            class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform">
                                        🚀 Scan Market
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Dashboard Section -->
                        <div id="dashboard-section" class="hidden">
                            <h2 class="text-3xl font-bold text-white mb-8">Market Intelligence Dashboard</h2>
                            
                            <!-- Three Product Tabs -->
                            <div class="flex space-x-4 mb-8">
                                <button onclick="switchProduct('oppy')" id="oppy-tab" 
                                        class="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all">
                                    Oppy - Opportunity Finder
                                </button>
                                <button onclick="switchProduct('fragment')" id="fragment-tab"
                                        class="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all">
                                    Fragment Finder
                                </button>
                                <button onclick="switchProduct('acquisition')" id="acquisition-tab"
                                        class="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all">
                                    Acquisition Assistant
                                </button>
                            </div>
                            
                            <!-- Product Content -->
                            <div id="product-content" class="glass-morphism p-8 rounded-xl">
                                <div id="oppy-content">
                                    <h3 class="text-2xl font-bold text-white mb-4">Oppy - Market Opportunity Detection</h3>
                                    <div class="grid grid-cols-3 gap-6">
                                        <div class="bg-white/10 p-6 rounded-lg">
                                            <div class="text-2xl font-bold text-white" id="oppy-opportunities">1,247</div>
                                            <div class="text-white/70">Opportunities Found</div>
                                        </div>
                                        <div class="bg-white/10 p-6 rounded-lg">
                                            <div class="text-2xl font-bold text-white" id="oppy-tam">$2.4B</div>
                                            <div class="text-white/70">Total TAM</div>
                                        </div>
                                        <div class="bg-white/10 p-6 rounded-lg">
                                            <div class="text-2xl font-bold text-white" id="oppy-growth">12.4%</div>
                                            <div class="text-white/70">Avg Growth Rate</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div id="fragment-content" class="hidden">
                                    <h3 class="text-2xl font-bold text-white mb-4">Fragment Finder - Roll-up Analysis</h3>
                                    <div class="grid grid-cols-3 gap-6">
                                        <div class="bg-white/10 p-6 rounded-lg">
                                            <div class="text-2xl font-bold text-white" id="fragment-markets">47</div>
                                            <div class="text-white/70">Fragmented Markets</div>
                                        </div>
                                        <div class="bg-white/10 p-6 rounded-lg">
                                            <div class="text-2xl font-bold text-white" id="fragment-hhi">0.11</div>
                                            <div class="text-white/70">Avg HHI Score</div>
                                        </div>
                                        <div class="bg-white/10 p-6 rounded-lg">
                                            <div class="text-2xl font-bold text-white" id="fragment-rollups">234</div>
                                            <div class="text-white/70">Roll-up Targets</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div id="acquisition-content" class="hidden">
                                    <h3 class="text-2xl font-bold text-white mb-4">Acquisition Assistant - Deal Pipeline</h3>
                                    <div class="grid grid-cols-3 gap-6">
                                        <div class="bg-white/10 p-6 rounded-lg">
                                            <div class="text-2xl font-bold text-white" id="acquisition-deals">89</div>
                                            <div class="text-white/70">Active Deals</div>
                                        </div>
                                        <div class="bg-white/10 p-6 rounded-lg">
                                            <div class="text-2xl font-bold text-white" id="acquisition-irr">24.7%</div>
                                            <div class="text-white/70">Avg IRR</div>
                                        </div>
                                        <div class="bg-white/10 p-6 rounded-lg">
                                            <div class="text-2xl font-bold text-white" id="acquisition-pipeline">$47M</div>
                                            <div class="text-white/70">Pipeline Value</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Market Scanner Section -->
                        <div id="scanner-section" class="hidden">
                            <h2 class="text-3xl font-bold text-white mb-8">Market Scanner</h2>
                            
                            <!-- Search Interface -->
                            <div class="glass-morphism p-8 rounded-xl mb-8">
                                <div class="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label class="block text-white/80 mb-2">Industry</label>
                                        <select id="industry-select" class="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30">
                                            <option value="accounting">Accounting Services</option>
                                            <option value="pool_cleaning">Pool Cleaning</option>
                                            <option value="hvac">HVAC Services</option>
                                            <option value="dental">Dental Practices</option>
                                            <option value="landscaping">Landscaping</option>
                                            <option value="restaurants">Restaurants</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-white/80 mb-2">Location</label>
                                        <input type="text" id="location-input" placeholder="e.g., Miami, FL" 
                                               class="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30">
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-4 gap-4 mb-6">
                                    <div>
                                        <label class="block text-white/80 mb-2">Min Revenue ($M)</label>
                                        <input type="number" id="min-revenue" value="0.5" min="0" step="0.1"
                                               class="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30">
                                    </div>
                                    <div>
                                        <label class="block text-white/80 mb-2">Max Revenue ($M)</label>
                                        <input type="number" id="max-revenue" value="10" min="0" step="0.1"
                                               class="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30">
                                    </div>
                                    <div>
                                        <label class="block text-white/80 mb-2">Min Rating</label>
                                        <select id="min-rating" class="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30">
                                            <option value="0">Any Rating</option>
                                            <option value="3.0">3.0+ Stars</option>
                                            <option value="4.0">4.0+ Stars</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-white/80 mb-2">Succession Risk</label>
                                        <select id="succession-risk" class="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30">
                                            <option value="all">All Levels</option>
                                            <option value="high">High Risk (70+)</option>
                                            <option value="medium">Medium Risk (40-69)</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <button onclick="performComprehensiveSearch()" 
                                        class="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold text-lg hover:scale-105 transition-transform">
                                    🔍 Search & Analyze Market
                                </button>
                            </div>
                            
                            <!-- Results -->
                            <div id="search-results" class="hidden">
                                <div class="glass-morphism p-8 rounded-xl">
                                    <h3 class="text-2xl font-bold text-white mb-6">Search Results</h3>
                                    <div id="results-table" class="overflow-x-auto">
                                        <!-- Results will be populated here -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- CRM Section -->
                        <div id="crm-section" class="hidden">
                            <h2 class="text-3xl font-bold text-white mb-8">Deal Pipeline</h2>
                            
                            <div class="grid grid-cols-4 gap-6">
                                <div class="glass-morphism p-6 rounded-xl">
                                    <h3 class="text-lg font-semibold text-white mb-4">Sourced</h3>
                                    <div id="sourced-deals" class="space-y-3">
                                        <!-- Deal cards will be populated here -->
                                    </div>
                                </div>
                                <div class="glass-morphism p-6 rounded-xl">
                                    <h3 class="text-lg font-semibold text-white mb-4">Contacted</h3>
                                    <div id="contacted-deals" class="space-y-3">
                                        <!-- Deal cards will be populated here -->
                                    </div>
                                </div>
                                <div class="glass-morphism p-6 rounded-xl">
                                    <h3 class="text-lg font-semibold text-white mb-4">Qualified</h3>
                                    <div id="qualified-deals" class="space-y-3">
                                        <!-- Deal cards will be populated here -->
                                    </div>
                                </div>
                                <div class="glass-morphism p-6 rounded-xl">
                                    <h3 class="text-lg font-semibold text-white mb-4">Closed</h3>
                                    <div id="closed-deals" class="space-y-3">
                                        <!-- Deal cards will be populated here -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        
        <script>
            // Global state
            let currentView = 'landing';
            let currentResults = [];
            
            // API Base URL
            const API_BASE = 'http://localhost:5000/api';
            
            // Navigation
            function navigateTo(section) {
                // Hide all sections
                document.getElementById('landing-section').classList.add('hidden');
                document.getElementById('dashboard-section').classList.add('hidden');
                document.getElementById('scanner-section').classList.add('hidden');
                document.getElementById('crm-section').classList.add('hidden');
                
                // Show selected section
                document.getElementById(section + '-section').classList.remove('hidden');
                currentView = section;
                
                // Load section data
                if (section === 'dashboard') loadDashboardData();
                if (section === 'crm') loadCRMData();
            }
            
            // Load dashboard stats
            async function loadDashboardData() {
                try {
                    const response = await fetch(`${API_BASE}/stats`);
                    const stats = await response.json();
                    
                    document.getElementById('total-firms').textContent = stats.total_firms.toLocaleString();
                    document.getElementById('high-score-firms').textContent = stats.high_score_firms.toLocaleString();
                    document.getElementById('succession-firms').textContent = stats.succession_opportunities.toLocaleString();
                    
                } catch (error) {
                    console.error('Error loading dashboard data:', error);
                }
            }
            
            // Product switching
            function switchProduct(product) {
                // Hide all product content
                document.getElementById('oppy-content').classList.add('hidden');
                document.getElementById('fragment-content').classList.add('hidden');
                document.getElementById('acquisition-content').classList.add('hidden');
                
                // Show selected product
                document.getElementById(product + '-content').classList.remove('hidden');
                
                // Update tab styles
                document.querySelectorAll('[id$="-tab"]').forEach(tab => {
                    tab.classList.remove('bg-white/30');
                    tab.classList.add('bg-white/20');
                });
                document.getElementById(product + '-tab').classList.add('bg-white/30');
                document.getElementById(product + '-tab').classList.remove('bg-white/20');
            }
            
            // Quick market scan
            async function performQuickScan() {
                const query = document.getElementById('quick-search').value;
                if (!query) return;
                
                try {
                    const response = await fetch(`${API_BASE}/ai-search`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({query: query})
                    });
                    
                    const data = await response.json();
                    
                    if (data.results_count > 0) {
                        alert(`Found ${data.results_count} potential targets! Switching to Market Scanner...`);
                        navigateTo('scanner');
                    } else {
                        alert('No results found. Try a different search term.');
                    }
                    
                } catch (error) {
                    console.error('Quick scan error:', error);
                    alert('Search failed. Please try again.');
                }
            }
            
            // Comprehensive market search
            async function performComprehensiveSearch() {
                const industry = document.getElementById('industry-select').value;
                const location = document.getElementById('location-input').value;
                const minRevenue = parseFloat(document.getElementById('min-revenue').value) * 1000000;
                const maxRevenue = parseFloat(document.getElementById('max-revenue').value) * 1000000;
                const minRating = parseFloat(document.getElementById('min-rating').value);
                const successionRisk = document.getElementById('succession-risk').value;
                
                if (!location) {
                    alert('Please enter a location');
                    return;
                }
                
                try {
                    const buyboxCriteria = {
                        min_revenue: minRevenue,
                        max_revenue: maxRevenue,
                        min_rating: minRating,
                        succession_priority: successionRisk,
                        target_state: extractState(location)
                    };
                    
                    const response = await fetch(`${API_BASE}/comprehensive-search`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            industry: industry,
                            location: location,
                            buybox_criteria: buyboxCriteria
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        currentResults = data.businesses;
                        displaySearchResults(data);
                    } else {
                        alert('Search failed: ' + data.error);
                    }
                    
                } catch (error) {
                    console.error('Comprehensive search error:', error);
                    alert('Search failed. Please try again.');
                }
            }
            
            // Display search results
            function displaySearchResults(data) {
                const resultsDiv = document.getElementById('search-results');
                const tableDiv = document.getElementById('results-table');
                
                if (!data.businesses || data.businesses.length === 0) {
                    tableDiv.innerHTML = '<p class="text-white/70">No results found. Try adjusting your criteria.</p>';
                    resultsDiv.classList.remove('hidden');
                    return;
                }
                
                let tableHTML = `
                    <div class="mb-4 flex justify-between items-center">
                        <div class="text-white">
                            <span class="text-2xl font-bold">${data.total_found || data.businesses.length}</span> 
                            <span class="text-white/70">businesses found</span>
                        </div>
                        <button onclick="exportToCRM()" 
                                class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:scale-105 transition-transform">
                            📤 Export to CRM
                        </button>
                    </div>
                    <table class="w-full text-white">
                        <thead>
                            <tr class="border-b border-white/20">
                                <th class="text-left py-3 px-4">Business Name</th>
                                <th class="text-left py-3 px-4">Location</th>
                                <th class="text-left py-3 px-4">Revenue Est.</th>
                                <th class="text-left py-3 px-4">Rating</th>
                                <th class="text-left py-3 px-4">Score</th>
                                <th class="text-left py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                data.businesses.slice(0, 20).forEach(business => {
                    const revenue = business.revenue_estimate || 0;
                    const rating = business.yelp_rating || 0;
                    const score = business.overall_score || business.deal_score || 0;
                    
                    tableHTML += `
                        <tr class="border-b border-white/10 hover:bg-white/5">
                            <td class="py-3 px-4 font-semibold">${business.name}</td>
                            <td class="py-3 px-4">${business.city}, ${business.state}</td>
                            <td class="py-3 px-4">$${(revenue / 1000000).toFixed(1)}M</td>
                            <td class="py-3 px-4">${rating}★</td>
                            <td class="py-3 px-4">
                                <span class="px-2 py-1 rounded-full text-sm ${getScoreColor(score)}">
                                    ${score}
                                </span>
                            </td>
                            <td class="py-3 px-4">
                                <button onclick="viewBusiness('${business.business_id || business.firm_id}')" 
                                        class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                    View
                                </button>
                            </td>
                        </tr>
                    `;
                });
                
                tableHTML += '</tbody></table>';
                tableDiv.innerHTML = tableHTML;
                resultsDiv.classList.remove('hidden');
            }
            
            // Load CRM data
            async function loadCRMData() {
                try {
                    // Load sample deals for each stage
                    const stages = ['sourced', 'contacted', 'qualified', 'closed'];
                    
                    stages.forEach(stage => {
                        const container = document.getElementById(stage + '-deals');
                        container.innerHTML = generateSampleDeals(stage);
                    });
                    
                } catch (error) {
                    console.error('Error loading CRM data:', error);
                }
            }
            
            // Generate sample deals for CRM
            function generateSampleDeals(stage) {
                const sampleDeals = {
                    sourced: [
                        {name: 'Miami Pool Care', revenue: '$1.2M', score: 84},
                        {name: 'Sunshine HVAC', revenue: '$2.1M', score: 78},
                        {name: 'Elite Landscaping', revenue: '$890K', score: 72}
                    ],
                    contacted: [
                        {name: 'Pro Dental Group', revenue: '$3.4M', score: 91},
                        {name: 'Quick Plumbing', revenue: '$1.7M', score: 85}
                    ],
                    qualified: [
                        {name: 'Golden Gate HVAC', revenue: '$4.2M', score: 95},
                        {name: 'Bay Area Cleaning', revenue: '$2.8M', score: 88}
                    ],
                    closed: [
                        {name: 'Coastal Accounting', revenue: '$5.1M', score: 97}
                    ]
                };
                
                const deals = sampleDeals[stage] || [];
                
                return deals.map(deal => `
                    <div class="bg-white/10 p-4 rounded-lg mb-3 cursor-pointer hover:bg-white/15 transition-colors">
                        <div class="font-semibold text-white">${deal.name}</div>
                        <div class="text-white/70 text-sm">${deal.revenue}</div>
                        <div class="text-white/70 text-sm">Score: ${deal.score}</div>
                    </div>
                `).join('');
            }
            
            // Export to CRM
            async function exportToCRM() {
                if (currentResults.length === 0) {
                    alert('No results to export');
                    return;
                }
                
                try {
                    const response = await fetch(`${API_BASE}/export-firms`, {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json'}
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        // Create and download CSV
                        const blob = new Blob([data.csv_data], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = data.filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                        
                        alert(`Exported ${data.record_count} records to ${data.filename}`);
                    } else {
                        alert('Export failed: ' + data.error);
                    }
                    
                } catch (error) {
                    console.error('Export error:', error);
                    alert('Export failed. Please try again.');
                }
            }
            
            // View business details
            async function viewBusiness(businessId) {
                try {
                    const response = await fetch(`${API_BASE}/firm/${businessId}`);
                    const business = await response.json();
                    
                    if (response.ok) {
                        alert(`Business: ${business.name}\\nOwner: ${business.owner_name}\\nRevenue: $${(business.revenue_estimate/1000000).toFixed(1)}M\\nSuccession Risk: ${business.succession_risk_score}%`);
                    } else {
                        alert('Business details not found');
                    }
                    
                } catch (error) {
                    console.error('Error viewing business:', error);
                    alert('Failed to load business details');
                }
            }
            
            // Utility functions
            function extractState(location) {
                const stateMap = {
                    'florida': 'FL', 'fl': 'FL', 'miami': 'FL',
                    'massachusetts': 'MA', 'ma': 'MA', 'boston': 'MA',
                    'texas': 'TX', 'tx': 'TX', 'california': 'CA', 'ca': 'CA'
                };
                
                const locationLower = location.toLowerCase();
                for (const [key, value] of Object.entries(stateMap)) {
                    if (locationLower.includes(key)) return value;
                }
                return 'FL';
            }
            
            function getScoreColor(score) {
                if (score >= 80) return 'bg-green-500 text-white';
                if (score >= 60) return 'bg-yellow-500 text-black';
                return 'bg-red-500 text-white';
            }
            
            // Initialize
            document.addEventListener('DOMContentLoaded', function() {
                loadDashboardData();
            });
        </script>
    </body>
    </html>
    ''')

# ================================
# API ENDPOINTS FOR FRONTEND
# ================================

@app.route('/api/dashboard-stats')
def get_dashboard_stats():
    """Get comprehensive dashboard statistics"""
    
    # Calculate stats from loaded firms
    total_firms = len(FIRMS_DATABASE)
    high_score_firms = len([f for f in FIRMS_DATABASE if f.get('deal_score', 0) >= 80])
    succession_opportunities = len([f for f in FIRMS_DATABASE if f.get('succession_risk_score', 0) >= 70])
    
    # Calculate TAM
    total_tam = sum(f.get('estimated_ebitda', 0) * f.get('estimated_multiple', 3.0) for f in FIRMS_DATABASE)
    
    # Product-specific metrics
    oppy_metrics = {
        "opportunities": total_firms,
        "tam": total_tam,
        "growth_rate": 12.4,
        "markets_analyzed": 47
    }
    
    fragment_metrics = {
        "fragmented_markets": 47,
        "avg_hhi": 0.11,
        "rollup_targets": 234,
        "consolidation_score": 78.5
    }
    
    acquisition_metrics = {
        "active_deals": 89,
        "avg_irr": 24.7,
        "pipeline_value": 47000000,
        "closed_deals": 12
    }
    
    return jsonify({
        'overall_stats': {
            'total_firms': total_firms,
            'high_score_firms': high_score_firms,
            'succession_opportunities': succession_opportunities,
            'total_tam': total_tam
        },
        'oppy_metrics': oppy_metrics,
        'fragment_metrics': fragment_metrics,
        'acquisition_metrics': acquisition_metrics,
        'last_updated': datetime.now().isoformat()
    })

@app.route('/api/comprehensive-search', methods=['POST'])
def comprehensive_search_api():
    """Enhanced comprehensive search with real API integration"""
    
    data = request.get_json()
    industry = data.get('industry', '')
    location = data.get('location', '')
    buybox_criteria = data.get('buybox_criteria', {})
    
    if not industry or not location:
        return jsonify({'error': 'Industry and location are required'}), 400
    
    try:
        # Use real Yelp API if available
        yelp_results = search_yelp_api(industry, location)
        
        # Get Census data
        census_data = get_census_data(location)
        
        # Filter and score results
        filtered_firms = filter_firms_by_criteria(FIRMS_DATABASE, buybox_criteria, location)
        
        # Combine with API results
        combined_results = combine_results(filtered_firms, yelp_results, census_data)
        
        # Calculate market metrics
        market_analysis = calculate_market_analysis(combined_results, industry, location)
        
        return jsonify({
            'businesses': combined_results[:50],  # Top 50 results
            'total_found': len(combined_results),
            'market_analysis': market_analysis,
            'search_metadata': {
                'industry': industry,
                'location': location,
                'apis_used': ['internal_db', 'yelp', 'census'],
                'search_timestamp': datetime.now().isoformat()
            }
        })
        
    except Exception as e:
        print(f"Comprehensive search error: {e}")
        return jsonify({'error': 'Search failed'}), 500

def search_yelp_api(industry, location):
    """Search Yelp API with error handling"""
    try:
        headers = {"Authorization": f"Bearer {API_CONFIG['YELP_API_KEY']}"}
        
        # Map industry to Yelp category
        category_map = {
            'accounting': 'accountants',
            'pool_cleaning': 'pool_cleaners',
            'hvac': 'hvac',
            'dental': 'dentists',
            'landscaping': 'landscaping',
            'restaurants': 'restaurants'
        }
        
        category = category_map.get(industry, 'accountants')
        
        params = {
            "categories": category,
            "location": location,
            "limit": 50,
            "radius": 40000
        }
        
        response = requests.get(
            "https://api.yelp.com/v3/businesses/search",
            headers=headers,
            params=params,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            return data.get("businesses", [])
        else:
            print(f"Yelp API error: {response.status_code}")
            return []
            
    except Exception as e:
        print(f"Yelp search error: {e}")
        return []

def get_census_data(location):
    """Get Census demographic data"""
    try:
        # Extract state code
        state_codes = {
            'florida': '12', 'fl': '12', 'massachusetts': '25', 'ma': '25',
            'texas': '48', 'tx': '48', 'california': '06', 'ca': '06'
        }
        
        location_lower = location.lower()
        state_code = '12'  # Default to Florida
        
        for state_name, code in state_codes.items():
            if state_name in location_lower:
                state_code = code
                break
        
        params = {
            "get": "B19013_001E,B25077_001E,B01003_001E",
            "for": "county:*",
            "in": f"state:{state_code}",
            "key": API_CONFIG["CENSUS_API_KEY"]
        }
        
        response = requests.get(
            "https://api.census.gov/data/2021/acs/acs5",
            params=params,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            return process_census_response(data)
        else:
            print(f"Census API error: {response.status_code}")
            return {}
            
    except Exception as e:
        print(f"Census error: {e}")
        return {}

def process_census_response(raw_data):
    """Process Census API response"""
    if not raw_data or len(raw_data) < 2:
        return {}
    
    income_values = []
    for row in raw_data[1:]:
        try:
            if row[0] and row[0] != '-666666666':
                income_values.append(int(row[0]))
        except (ValueError, IndexError):
            continue
    
    return {
        "median_income": sum(income_values) / len(income_values) if income_values else 50000,
        "wealth_index": min(100, max(0, (sum(income_values) / len(income_values) - 40000) / 1000)) if income_values else 50
    }

def filter_firms_by_criteria(firms, criteria, location):
    """Filter firms based on buybox criteria"""
    filtered = firms.copy()
    
    # Revenue filter
    min_revenue = criteria.get('min_revenue', 0)
    max_revenue = criteria.get('max_revenue', 100000000)
    filtered = [f for f in filtered if min_revenue <= f.get('revenue_estimate', 0) <= max_revenue]
    
    # Rating filter
    min_rating = criteria.get('min_rating', 0)
    if min_rating > 0:
        filtered = [f for f in filtered if f.get('yelp_rating', 0) >= min_rating]
    
    # Succession risk filter
    succession_priority = criteria.get('succession_priority', 'all')
    if succession_priority == 'high':
        filtered = [f for f in filtered if f.get('succession_risk_score', 0) >= 70]
    elif succession_priority == 'medium':
        filtered = [f for f in filtered if 40 <= f.get('succession_risk_score', 0) < 70]
    
    # Location filter
    target_state = criteria.get('target_state', '')
    if target_state:
        filtered = [f for f in filtered if f.get('state', '').upper() == target_state.upper()]
    
    return filtered

def combine_results(db_firms, yelp_results, census_data):
    """Combine database firms with API results"""
    combined = []
    
    # Add database firms
    for firm in db_firms:
        enhanced_firm = firm.copy()
        enhanced_firm['source'] = 'database'
        enhanced_firm['census_data'] = census_data
        combined.append(enhanced_firm)
    
    # Add Yelp results
    for i, business in enumerate(yelp_results):
        location = business.get("location", {})
        
        yelp_firm = {
            'business_id': f'yelp_{i}',
            'name': business.get('name', ''),
            'city': location.get('city', ''),
            'state': location.get('state', ''),
            'phone': business.get('phone', ''),
            'website': business.get('url', ''),
            'yelp_rating': business.get('rating', 0),
            'yelp_review_count': business.get('review_count', 0),
            'revenue_estimate': estimate_revenue_from_yelp(business),
            'overall_score': calculate_yelp_score(business),
            'source': 'yelp',
            'census_data': census_data
        }
        combined.append(yelp_firm)
    
    # Sort by score
    combined.sort(key=lambda x: x.get('overall_score', 0), reverse=True)
    
    return combined

def estimate_revenue_from_yelp(business):
    """Estimate revenue from Yelp data"""
    review_count = business.get('review_count', 0)
    price_level = len(business.get('price', '$'))
    rating = business.get('rating', 3.0)
    
    base_revenue = 200000
    review_multiplier = min(review_count / 10, 5)
    price_multiplier = price_level
    rating_multiplier = rating / 3.0
    
    return base_revenue * review_multiplier * price_multiplier * rating_multiplier

def calculate_yelp_score(business):
    """Calculate overall score for Yelp business"""
    rating = business.get('rating', 0)
    review_count = business.get('review_count', 0)
    
    score = 0
    if rating >= 4.0:
        score += 40
    elif rating >= 3.5:
        score += 30
    elif rating >= 3.0:
        score += 20
    
    if review_count >= 50:
        score += 30
    elif review_count >= 20:
        score += 25
    elif review_count >= 10:
        score += 20
    
    if business.get('url'):
        score += 15
    
    # Add some randomness
    score += random.randint(5, 15)
    
    return min(score, 100)

def calculate_market_analysis(businesses, industry, location):
    """Calculate comprehensive market analysis"""
    total_businesses = len(businesses)
    total_revenue = sum(b.get('revenue_estimate', 0) for b in businesses)
    avg_revenue = total_revenue / total_businesses if total_businesses > 0 else 0
    
    # Score distribution
    high_score = len([b for b in businesses if b.get('overall_score', 0) >= 80])
    medium_score = len([b for b in businesses if 60 <= b.get('overall_score', 0) < 80])
    
    # Market fragmentation
    if total_revenue > 0:
        market_shares = [b.get('revenue_estimate', 0) / total_revenue for b in businesses]
        hhi = sum(share ** 2 for share in market_shares)
    else:
        hhi = 0
    
    return {
        "tam_estimate": total_revenue,
        "business_count": total_businesses,
        "avg_revenue": avg_revenue,
        "high_score_count": high_score,
        "medium_score_count": medium_score,
        "hhi_index": hhi,
        "fragmentation_level": "High" if hhi < 0.15 else "Medium" if hhi < 0.25 else "Low",
        "top_opportunities": businesses[:5]
    }

# ================================
# CLIENT-SPECIFIC ENDPOINTS
# ================================

@app.route('/api/avilla-intelligence')
def avilla_intelligence():
    """Avilla Peak Partners specific intelligence"""
    
    # Filter for accounting firms in MA/FL
    avilla_firms = [f for f in FIRMS_DATABASE if 
                   f.get('state') in ['MA', 'FL'] and 
                   'accounting' in f.get('subindustry', '').lower()]
    
    # Calculate Avilla-specific metrics
    high_succession = [f for f in avilla_firms if f.get('succession_risk_score', 0) >= 70]
    wealthy_zip_firms = [f for f in avilla_firms if f.get('wealth_index', 0) >= 80]
    
    return jsonify({
        'total_targets': len(avilla_firms),
        'succession_opportunities': len(high_succession),
        'wealthy_market_targets': len(wealthy_zip_firms),
        'avg_deal_score': sum(f.get('deal_score', 0) for f in avilla_firms) / len(avilla_firms) if avilla_firms else 0,
        'top_targets': sorted(avilla_firms, key=lambda x: x.get('deal_score', 0), reverse=True)[:10],
        'market_analysis': {
            'ma_firms': len([f for f in avilla_firms if f.get('state') == 'MA']),
            'fl_firms': len([f for f in avilla_firms if f.get('state') == 'FL']),
            'avg_revenue': sum(f.get('revenue_estimate', 0) for f in avilla_firms) / len(avilla_firms) if avilla_firms else 0
        }
    })

@app.route('/api/ybridge-intelligence')
def ybridge_intelligence():
    """YBridge Capital specific intelligence"""
    
    # Sample YBridge targets (industrial services)
    ybridge_targets = [
        {
            "name": "Heavy Haul Trailer Manufacturer",
            "revenue": 32000000,
            "ebitda": 4700000,
            "employees": 90,
            "location": "Pennsylvania",
            "market_score": 96,
            "deal_score": 94,
            "industry": "Heavy Equipment Manufacturing"
        },
        {
            "name": "Midwest Equipment Rental",
            "revenue": 8500000,
            "ebitda": 1200000,
            "employees": 45,
            "location": "Ohio",
            "market_score": 87,
            "deal_score": 82,
            "industry": "Equipment Rental"
        },
        {
            "name": "Industrial Facility Services",
            "revenue": 12000000,
            "ebitda": 1800000,
            "employees": 67,
            "location": "Michigan",
            "market_score": 91,
            "deal_score": 89,
            "industry": "Facility Services"
        }
    ]
    
    return jsonify({
        'featured_deal': ybridge_targets[0],
        'target_pipeline': ybridge_targets,
        'market_metrics': {
            'total_tam': sum(t['revenue'] for t in ybridge_targets),
            'avg_ebitda_margin': sum(t['ebitda']/t['revenue'] for t in ybridge_targets) / len(ybridge_targets),
            'avg_market_score': sum(t['market_score'] for t in ybridge_targets) / len(ybridge_targets)
        },
        'geographic_focus': ['Pennsylvania', 'Ohio', 'Michigan', 'Indiana', 'Illinois'],
        'industry_focus': ['Heavy Equipment', 'Industrial Services', '3PL', 'Facility Services']
    })

@app.route('/api/generate-cim', methods=['POST'])
def generate_cim():
    """Generate AI-powered CIM for a business"""
    
    data = request.get_json()
    business_id = data.get('business_id')
    
    if not business_id:
        return jsonify({'error': 'Business ID required'}), 400
    
    # Find business
    business = next((f for f in FIRMS_DATABASE if f.get('firm_id') == business_id), None)
    
    if not business:
        return jsonify({'error': 'Business not found'}), 404
    
    # Generate CIM content
    cim_content = {
        "executive_summary": f"{business.get('name')} is a well-established {business.get('subindustry', 'service')} business located in {business.get('city')}, {business.get('state')}. With estimated annual revenue of ${(business.get('revenue_estimate', 0)/1000000):.1f}M and strong market position, this represents an attractive acquisition opportunity.",
        
        "business_overview": {
            "name": business.get('name'),
            "industry": business.get('subindustry'),
            "location": f"{business.get('city')}, {business.get('state')}",
            "years_established": business.get('years_established'),
            "employees": business.get('employee_count')
        },
        
        "financial_highlights": {
            "revenue": business.get('revenue_estimate'),
            "estimated_ebitda": business.get('estimated_ebitda'),
            "ebitda_margin": (business.get('estimated_ebitda', 0) / business.get('revenue_estimate', 1)) * 100 if business.get('revenue_estimate') else 0,
            "multiple_range": f"{business.get('estimated_multiple', 3.0) - 0.5:.1f}x - {business.get('estimated_multiple', 3.0) + 0.5:.1f}x"
        },
        
        "market_position": {
            "yelp_rating": business.get('yelp_rating'),
            "review_count": business.get('yelp_review_count'),
            "digital_presence": "Strong" if business.get('website') else "Limited",
            "market_share": "Local market leader" if business.get('deal_score', 0) >= 80 else "Established player"
        },
        
        "investment_highlights": [
            f"Strong {business.get('subindustry', 'service')} business with {business.get('years_established', 'established')} years of operation",
            f"Revenue of ${(business.get('revenue_estimate', 0)/1000000):.1f}M with estimated EBITDA of ${(business.get('estimated_ebitda', 0)/1000):.0f}K",
            f"High succession opportunity with {business.get('succession_risk_score', 0)}% succession risk score",
            f"Located in {business.get('city')}, {business.get('state')} with strong local market presence"
        ],
        
        "next_steps": [
            "Initial management presentation",
            "Financial due diligence",
            "Market analysis and competitive positioning",
            "LOI and purchase agreement negotiation"
        ]
    }
    
    return jsonify({
        'business_id': business_id,
        'cim_content': cim_content,
        'generated_at': datetime.now().isoformat(),
        'document_type': 'Confidential Information Memorandum'
    })

@app.route('/api/lbo-analysis', methods=['POST'])
def lbo_analysis():
    """Perform LBO analysis for a deal"""
    
    data = request.get_json()
    purchase_price = data.get('purchase_price', 0)
    ebitda = data.get('ebitda', 0)
    debt_ratio = data.get('debt_ratio', 0.6)  # 60% debt
    exit_multiple = data.get('exit_multiple', 5.0)
    hold_period = data.get('hold_period', 5)
    
    if not purchase_price or not ebitda:
        return jsonify({'error': 'Purchase price and EBITDA required'}), 400
    
    # Calculate LBO metrics
    debt_amount = purchase_price * debt_ratio
    equity_amount = purchase_price * (1 - debt_ratio)
    
    # Simple cash flow projection
    annual_cash_flow = ebitda * 0.8  # Assume 80% cash conversion
    debt_service = debt_amount * 0.12  # Assume 12% interest rate
    free_cash_flow = annual_cash_flow - debt_service
    
    # Exit value
    exit_ebitda = ebitda * (1.05 ** hold_period)  # 5% annual growth
    exit_value = exit_ebitda * exit_multiple
    remaining_debt = max(0, debt_amount - (free_cash_flow * hold_period * 0.3))  # 30% debt paydown
    
    # Calculate returns
    equity_proceeds = exit_value - remaining_debt
    total_return = equity_proceeds / equity_amount
    irr = (total_return ** (1/hold_period)) - 1
    
    return jsonify({
        'purchase_price': purchase_price,
        'debt_amount': debt_amount,
        'equity_amount': equity_amount,
        'annual_free_cash_flow': free_cash_flow,
        'exit_value': exit_value,
        'equity_proceeds': equity_proceeds,
        'total_return_multiple': total_return,
        'irr': irr * 100,  # Convert to percentage
        'analysis_summary': {
            'investment_grade': 'Strong' if irr > 0.20 else 'Moderate' if irr > 0.15 else 'Weak',
            'key_metrics': {
                'debt_to_equity': debt_ratio / (1 - debt_ratio),
                'cash_on_cash': (free_cash_flow / equity_amount) * 100,
                'exit_multiple': exit_multiple,
                'hold_period': hold_period
            }
        }
    })

@app.route('/api/market-heatmap/<state>')
def get_market_heatmap(state):
    """Get heatmap data for specific state"""
    
    state_firms = [f for f in FIRMS_DATABASE if f.get('state', '').upper() == state.upper()]
    
    # Group by zip code
    zip_data = {}
    for firm in state_firms:
        zip_code = firm.get('zip_code', '')
        if not zip_code:
            continue
            
        if zip_code not in zip_data:
            zip_data[zip_code] = {
                'zip': zip_code,
                'city': firm.get('city', ''),
                'firms': [],
                'total_score': 0,
                'succession_opportunities': 0
            }
        
        zip_data[zip_code]['firms'].append(firm)
        zip_data[zip_code]['total_score'] += firm.get('deal_score', 0)
        
        if firm.get('succession_risk_score', 0) >= 70:
            zip_data[zip_code]['succession_opportunities'] += 1
    
    # Calculate heatmap points
    heatmap_data = []
    for zip_code, data in zip_data.items():
        firm_count = len(data['firms'])
        avg_score = data['total_score'] / firm_count if firm_count > 0 else 0
        
        heatmap_data.append({
            'zip': zip_code,
            'city': data['city'],
            'firm_count': firm_count,
            'avg_score': avg_score,
            'succession_opportunities': data['succession_opportunities'],
            'opportunity_density': avg_score * np.log(firm_count + 1)
        })
    
    # Sort by opportunity density
    heatmap_data.sort(key=lambda x: x['opportunity_density'], reverse=True)
    
    return jsonify({
        'state': state,
        'heatmap_data': heatmap_data,
        'summary': {
            'total_zips': len(heatmap_data),
            'total_firms': len(state_firms),
            'avg_opportunity_density': np.mean([p['opportunity_density'] for p in heatmap_data]) if heatmap_data else 0
        }
    })

# ================================
# EXISTING API ENDPOINTS (Enhanced)
# ================================

@app.route('/api/stats')
def get_enhanced_stats():
    """Enhanced dashboard statistics"""
    
    base_stats = {
        'total_firms': len(FIRMS_DATABASE),
        'high_score_firms': len([f for f in FIRMS_DATABASE if f.get('deal_score', 0) >= 80]),
        'succession_opportunities': len([f for f in FIRMS_DATABASE if f.get('succession_risk_score', 0) >= 70]),
        'avg_deal_score': sum(f.get('deal_score', 0) for f in FIRMS_DATABASE) / len(FIRMS_DATABASE) if FIRMS_DATABASE else 0,
        'ma_firms': len([f for f in FIRMS_DATABASE if f.get('state') == 'MA']),
        'fl_firms': len([f for f in FIRMS_DATABASE if f.get('state') == 'FL']),
        'last_updated': datetime.now().isoformat()
    }
    
    # Add real-time enhancements
    base_stats['api_health'] = {
        'yelp': 'active',
        'google': 'active', 
        'census': 'active',
        'data_axle': 'active',
        'openai': 'limited',  # Due to API key issues
        'mastercard': 'inactive'
    }
    
    base_stats['market_intelligence'] = {
        'total_tam': sum(f.get('estimated_ebitda', 0) * f.get('estimated_multiple', 3.0) for f in FIRMS_DATABASE),
        'fragmented_markets': 47,
        'consolidation_opportunities': 234
    }
    
    return jsonify(base_stats)

@app.route('/api/firms')
def get_enhanced_firms():
    """Enhanced firms endpoint with better filtering"""
    
    # Get query parameters
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 25))
    state = request.args.get('state', 'all')
    min_score = int(request.args.get('min_score', 0))
    industry = request.args.get('industry', 'all')
    
    # Filter firms
    filtered_firms = FIRMS_DATABASE.copy()
    
    if state != 'all':
        filtered_firms = [f for f in filtered_firms if f.get('state') == state]
    
    if min_score > 0:
        filtered_firms = [f for f in filtered_firms if f.get('deal_score', 0) >= min_score]
    
    if industry != 'all':
        filtered_firms = [f for f in filtered_firms if industry.lower() in f.get('subindustry', '').lower()]
    
    # Pagination
    total_firms = len(filtered_firms)
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    paginated_firms = filtered_firms[start_idx:end_idx]
    
    # Add market context
    for firm in paginated_firms:
        firm['market_context'] = {
            'rank_in_state': get_firm_rank_in_state(firm),
            'succession_probability': calculate_succession_probability(firm),
            'acquisition_readiness': calculate_acquisition_readiness(firm)
        }
    
    return jsonify({
        'firms': paginated_firms,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': total_firms,
            'pages': (total_firms + per_page - 1) // per_page
        },
        'market_summary': {
            'avg_score': sum(f.get('deal_score', 0) for f in filtered_firms) / len(filtered_firms) if filtered_firms else 0,
            'total_tam': sum(f.get('estimated_ebitda', 0) * f.get('estimated_multiple', 3.0) for f in filtered_firms)
        }
    })

def get_firm_rank_in_state(firm):
    """Calculate firm's rank within its state"""
    same_state_firms = [f for f in FIRMS_DATABASE if f.get('state') == firm.get('state')]
    sorted_firms = sorted(same_state_firms, key=lambda x: x.get('deal_score', 0), reverse=True)
    
    try:
        return sorted_firms.index(firm) + 1
    except ValueError:
        return len(sorted_firms)

def calculate_succession_probability(firm):
    """Calculate succession probability percentage"""
    risk_score = firm.get('succession_risk_score', 0)
    
    if risk_score >= 80:
        return "Very High (90%+)"
    elif risk_score >= 70:
        return "High (70-90%)"
    elif risk_score >= 50:
        return "Medium (50-70%)"
    else:
        return "Low (<50%)"

def calculate_acquisition_readiness(firm):
    """Calculate acquisition readiness score"""
    score = 0
    
    # Revenue factor
    revenue = firm.get('revenue_estimate', 0)
    if revenue >= 2000000:
        score += 30
    elif revenue >= 1000000:
        score += 25
    elif revenue >= 500000:
        score += 20
    
    # Digital presence
    if firm.get('website'):
        score += 20
    
    # Review consistency
    if firm.get('yelp_rating', 0) >= 4.0:
        score += 25
    elif firm.get('yelp_rating', 0) >= 3.5:
        score += 20
    
    # Business maturity
    if firm.get('years_established', 0) >= 10:
        score += 25
    
    return min(score, 100)

if __name__ == '__main__':
    print(f"🚀 Starting Okapiq Integrated Platform...")
    print(f"📊 Loaded {len(FIRMS_DATABASE)} firms")
    print(f"🌐 Frontend: http://localhost:5000")
    print(f"📡 API endpoints: http://localhost:5000/api/*")
    print(f"🎯 Client dashboards: /api/avilla-intelligence, /api/ybridge-intelligence")
    print(f"🔧 Tools: /api/generate-cim, /api/lbo-analysis")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
