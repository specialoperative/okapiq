/**
 * Review NLP Analyzer
 * 
 * Analyzes business reviews using Natural Language Processing
 * to identify chaos indicators and market volatility signals
 */

import { Review } from '../../types/fragment-finder';

export class ReviewNLPAnalyzer {
  private chaosKeywords: { [key: string]: string[] };
  private sentimentKeywords: { positive: string[]; negative: string[] };

  constructor() {
    this.initializeKeywords();
  }

  /**
   * Analyzes reviews for chaos indicators
   */
  async analyzeChaosIndicators(reviews: Review[]): Promise<number> {
    if (reviews.length === 0) return 0;

    let totalChaosScore = 0;
    let reviewsAnalyzed = 0;

    for (const review of reviews) {
      const chaosScore = this.calculateReviewChaosScore(review);
      totalChaosScore += chaosScore;
      reviewsAnalyzed++;
    }

    return reviewsAnalyzed > 0 ? totalChaosScore / reviewsAnalyzed : 0;
  }

  /**
   * Calculates chaos score for a single review
   */
  private calculateReviewChaosScore(review: Review): number {
    let chaosScore = 0;
    const text = review.text.toLowerCase();

    // Check for pricing inconsistency indicators
    chaosScore += this.checkKeywordCategory(text, 'pricing') * 0.25;

    // Check for service volatility indicators
    chaosScore += this.checkKeywordCategory(text, 'service') * 0.25;

    // Check for ownership/management change indicators
    chaosScore += this.checkKeywordCategory(text, 'ownership') * 0.2;

    // Check for quality fluctuation indicators
    chaosScore += this.checkKeywordCategory(text, 'quality') * 0.2;

    // Rating vs sentiment mismatch (chaos indicator)
    const sentimentMismatch = this.checkSentimentMismatch(review);
    chaosScore += sentimentMismatch * 0.1;

    return Math.min(chaosScore, 1); // Cap at 1.0
  }

  /**
   * Checks for keywords in specific chaos categories
   */
  private checkKeywordCategory(text: string, category: string): number {
    const keywords = this.chaosKeywords[category] || [];
    let matchCount = 0;

    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        matchCount++;
      }
    }

    // Normalize by category size and apply sigmoid function
    const normalizedScore = matchCount / keywords.length;
    return Math.min(normalizedScore * 2, 1); // Scale up and cap at 1
  }

  /**
   * Checks for sentiment mismatch (rating doesn't match review sentiment)
   */
  private checkSentimentMismatch(review: Review): number {
    const text = review.text.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;

    // Count sentiment indicators
    this.sentimentKeywords.positive.forEach(word => {
      if (text.includes(word)) positiveScore++;
    });

    this.sentimentKeywords.negative.forEach(word => {
      if (text.includes(word)) negativeScore++;
    });

    // Determine text sentiment
    const textSentiment = positiveScore > negativeScore ? 'positive' : 
                         negativeScore > positiveScore ? 'negative' : 'neutral';

    // Check for mismatch
    const ratingBasedSentiment = review.rating >= 4 ? 'positive' : 
                                review.rating <= 2 ? 'negative' : 'neutral';

    if (textSentiment !== ratingBasedSentiment && textSentiment !== 'neutral') {
      return 0.8; // High mismatch score
    }

    return 0;
  }

  /**
   * Analyzes temporal patterns in reviews
   */
  async analyzeTemporalPatterns(reviews: Review[]): Promise<{
    volatilityScore: number;
    trendDirection: 'improving' | 'declining' | 'stable';
    seasonalPatterns: boolean;
  }> {
    if (reviews.length < 3) {
      return {
        volatilityScore: 0,
        trendDirection: 'stable',
        seasonalPatterns: false
      };
    }

    // Sort reviews by date
    const sortedReviews = reviews
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate rating volatility
    const ratings = sortedReviews.map(r => r.rating);
    const volatilityScore = this.calculateVolatility(ratings);

    // Determine trend direction
    const recentRatings = ratings.slice(-Math.min(5, ratings.length));
    const olderRatings = ratings.slice(0, Math.min(5, ratings.length));
    
    const recentAvg = recentRatings.reduce((a, b) => a + b, 0) / recentRatings.length;
    const olderAvg = olderRatings.reduce((a, b) => a + b, 0) / olderRatings.length;

    let trendDirection: 'improving' | 'declining' | 'stable' = 'stable';
    if (recentAvg > olderAvg + 0.3) trendDirection = 'improving';
    else if (recentAvg < olderAvg - 0.3) trendDirection = 'declining';

    // Check for seasonal patterns (simplified)
    const seasonalPatterns = this.detectSeasonalPatterns(sortedReviews);

    return {
      volatilityScore,
      trendDirection,
      seasonalPatterns
    };
  }

  /**
   * Calculates volatility of a numeric series
   */
  private calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    // Normalize volatility score (0-1)
    return Math.min(standardDeviation / 2, 1); // Assuming max std dev of 2 for 5-point scale
  }

  /**
   * Detects seasonal patterns in reviews
   */
  private detectSeasonalPatterns(reviews: Review[]): boolean {
    if (reviews.length < 12) return false;

    // Group reviews by month
    const monthlyRatings: { [month: number]: number[] } = {};
    
    reviews.forEach(review => {
      const month = new Date(review.date).getMonth();
      if (!monthlyRatings[month]) monthlyRatings[month] = [];
      monthlyRatings[month].push(review.rating);
    });

    // Calculate monthly averages
    const monthlyAverages = Object.keys(monthlyRatings).map(month => {
      const ratings = monthlyRatings[parseInt(month)];
      return ratings.reduce((a, b) => a + b, 0) / ratings.length;
    });

    // Simple seasonality check: significant variance in monthly averages
    const avgVariance = this.calculateVolatility(monthlyAverages);
    return avgVariance > 0.3; // Threshold for seasonal pattern detection
  }

  /**
   * Extracts specific business insights from reviews
   */
  async extractBusinessInsights(reviews: Review[]): Promise<{
    commonComplaints: string[];
    commonPraises: string[];
    riskIndicators: string[];
    operationalInsights: string[];
  }> {
    const insights = {
      commonComplaints: [] as string[],
      commonPraises: [] as string[],
      riskIndicators: [] as string[],
      operationalInsights: [] as string[]
    };

    const allText = reviews.map(r => r.text.toLowerCase()).join(' ');

    // Analyze complaint patterns
    if (allText.includes('slow') || allText.includes('wait')) {
      insights.commonComplaints.push('Service speed issues');
    }
    if (allText.includes('expensive') || allText.includes('overpriced')) {
      insights.commonComplaints.push('Pricing concerns');
    }
    if (allText.includes('rude') || allText.includes('unprofessional')) {
      insights.commonComplaints.push('Staff behavior issues');
    }

    // Analyze praise patterns
    if (allText.includes('excellent') || allText.includes('outstanding')) {
      insights.commonPraises.push('Exceptional service quality');
    }
    if (allText.includes('professional') || allText.includes('knowledgeable')) {
      insights.commonPraises.push('Professional expertise');
    }
    if (allText.includes('fair price') || allText.includes('good value')) {
      insights.commonPraises.push('Fair pricing');
    }

    // Risk indicators
    if (allText.includes('new owner') || allText.includes('management change')) {
      insights.riskIndicators.push('Recent ownership/management changes');
    }
    if (allText.includes('going downhill') || allText.includes('not what it used to be')) {
      insights.riskIndicators.push('Declining quality perception');
    }

    // Operational insights
    if (allText.includes('appointment') || allText.includes('booking')) {
      insights.operationalInsights.push('Appointment-based service model');
    }
    if (allText.includes('online') || allText.includes('website')) {
      insights.operationalInsights.push('Digital presence mentioned');
    }

    return insights;
  }

  /**
   * Initializes keyword dictionaries for chaos detection
   */
  private initializeKeywords(): void {
    this.chaosKeywords = {
      pricing: [
        'overcharged', 'price changed', 'different price', 'unexpected cost',
        'hidden fee', 'price increase', 'inconsistent pricing', 'bait and switch',
        'quoted different', 'price surprise', 'cost more than expected'
      ],
      service: [
        'inconsistent', 'hit or miss', 'depends on who', 'sometimes good',
        'unpredictable', 'varies greatly', 'different each time', 'unreliable',
        'service varies', 'not consistent', 'quality depends', 'staff turnover'
      ],
      ownership: [
        'new owner', 'management change', 'under new management', 'ownership change',
        'different owner', 'new management', 'changed hands', 'sold the business',
        'new people', 'management turnover', 'ownership transition'
      ],
      quality: [
        'quality declined', 'not what it used to be', 'gone downhill', 'used to be better',
        'quality varies', 'inconsistent quality', 'hit or miss quality', 'quality issues',
        'standards dropped', 'not as good', 'quality problems', 'declining standards'
      ]
    };

    this.sentimentKeywords = {
      positive: [
        'excellent', 'outstanding', 'amazing', 'fantastic', 'wonderful', 'great',
        'awesome', 'perfect', 'love', 'highly recommend', 'best', 'impressed',
        'satisfied', 'happy', 'pleased', 'professional', 'quality', 'reliable'
      ],
      negative: [
        'terrible', 'awful', 'horrible', 'worst', 'disappointed', 'unsatisfied',
        'poor', 'bad', 'rude', 'unprofessional', 'overpriced', 'waste',
        'avoid', 'regret', 'never again', 'scam', 'fraud', 'incompetent'
      ]
    };
  }
}