'use client';

import { useState } from 'react';
import { 
  StarIcon,
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  FireIcon,
  TrendingUpIcon
} from '@heroicons/react/24/outline';

interface Business {
  name: string;
  estimated_revenue: number;
  employee_count: number;
  years_in_business: number;
  yelp_rating: number;
  yelp_review_count: number;
  succession_risk_score: number;
  owner_age_estimate: number;
  market_share_percent: number;
  lead_score: number;
  opportunity_score?: number;  // NEW
  badges?: string[];           // NEW
}

interface BusinessListProps {
  businesses: Business[];
}

const getBadgeStyle = (badge: string): { color: string; icon: React.ReactNode } => {
  switch (badge) {
    case 'High Opportunity':
      return { color: 'bg-red-100 text-red-800', icon: <FireIcon className="h-3 w-3" /> };
    case 'Market Leader':
      return { color: 'bg-yellow-100 text-yellow-800', icon: <TrophyIcon className="h-3 w-3" /> };
    case 'Succession Target':
      return { color: 'bg-orange-100 text-orange-800', icon: <ExclamationTriangleIcon className="h-3 w-3" /> };
    case 'Growth Market':
      return { color: 'bg-green-100 text-green-800', icon: <TrendingUpIcon className="h-3 w-3" /> };
    case 'Premium Demographic':
      return { color: 'bg-purple-100 text-purple-800', icon: <StarIcon className="h-3 w-3" /> };
    default:
      return { color: 'bg-gray-100 text-gray-800', icon: <StarIcon className="h-3 w-3" /> };
  }
};

const getOpportunityScoreStyle = (score: number): string => {
  if (score >= 80) return 'text-red-600 font-bold animate-pulse';
  if (score >= 60) return 'text-orange-600 font-semibold';
  if (score >= 40) return 'text-yellow-600';
  return 'text-gray-600';
};

export function BusinessList({ businesses }: BusinessListProps) {
  const [sortBy, setSortBy] = useState('opportunity_score'); // Default to opportunity score
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const formatCurrency = (value: number) => {
    if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-danger-600 bg-danger-100';
    if (score >= 60) return 'text-warning-600 bg-warning-100';
    if (score >= 40) return 'text-primary-600 bg-primary-100';
    return 'text-success-600 bg-success-100';
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-600 bg-success-100';
    if (score >= 75) return 'text-primary-600 bg-primary-100';
    if (score >= 60) return 'text-warning-600 bg-warning-100';
    return 'text-gray-600 bg-gray-100';
  };

  const sortedBusinesses = [...businesses].sort((a, b) => {
    const aValue = a[sortBy as keyof Business] as number;
    const bValue = b[sortBy as keyof Business] as number;
    
    if (sortOrder === 'asc') {
      return aValue - bValue;
    }
    return bValue - aValue;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Business Intelligence</h3>
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input"
          >
            <option value="opportunity_score">🔥 Opportunity Score</option>
            <option value="lead_score">Lead Score</option>
            <option value="estimated_revenue">Revenue</option>
            <option value="succession_risk_score">Succession Risk</option>
            <option value="yelp_rating">Yelp Rating</option>
            <option value="market_share_percent">Market Share</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="btn-secondary btn-sm"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Business</th>
                <th className="table-header-cell">🔥 Opportunity</th>
                <th className="table-header-cell">🏆 Badges</th>
                <th className="table-header-cell">Revenue</th>
                <th className="table-header-cell">Employees</th>
                <th className="table-header-cell">Years</th>
                <th className="table-header-cell">Rating</th>
                <th className="table-header-cell">Succession Risk</th>
                <th className="table-header-cell">Lead Score</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {sortedBusinesses.map((business, index) => (
                <tr key={index} className={`table-row ${(business.opportunity_score || 0) >= 80 ? 'bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500' : (business.opportunity_score || 0) >= 60 ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400' : 'hover:bg-gray-50'}`}>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      {index === 0 && sortBy === 'opportunity_score' && (
                        <span className="text-lg">👑</span>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{business.name}</div>
                        <div className="text-sm text-gray-500">
                          Owner: ~{business.owner_age_estimate} years old
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className={`text-xl font-bold ${getOpportunityScoreStyle(business.opportunity_score || 0)}`}>
                      {business.opportunity_score || 0}
                      <span className="text-sm font-normal text-gray-500">/100</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex flex-wrap gap-1">
                      {business.badges?.slice(0, 2).map((badge, idx) => {
                        const style = getBadgeStyle(badge);
                        return (
                          <span
                            key={idx}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.color}`}
                          >
                            {style.icon}
                            {badge}
                          </span>
                        );
                      })}
                      {(business.badges?.length || 0) > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{(business.badges?.length || 0) - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {formatCurrency(business.estimated_revenue)}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {business.employee_count}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {business.years_in_business}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      {business.yelp_rating.toFixed(1)} ({business.yelp_review_count})
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${getRiskColor(business.succession_risk_score)}`}>
                      <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                      {business.succession_risk_score}/100
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${getLeadScoreColor(business.lead_score)}`}>
                      {business.lead_score}/100
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button className="btn-secondary btn-sm">Export</button>
                      <button className="btn-primary btn-sm">Contact</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {businesses.length} businesses
        </div>
        <div className="flex space-x-2">
          <button className="btn-secondary">
            Export All to CRM
          </button>
          <button className="btn-primary">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
} 