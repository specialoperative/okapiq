import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClientUseCase } from "@/components/client-use-case"

export default function ClientUseCasesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Client Use Cases</h2>
      </div>
      <Tabs defaultValue="search-funds" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="search-funds">Search Funds</TabsTrigger>
          <TabsTrigger value="private-equity">Private Equity</TabsTrigger>
          <TabsTrigger value="family-offices">Family Offices</TabsTrigger>
          <TabsTrigger value="brokers">Brokerage Firms</TabsTrigger>
          <TabsTrigger value="marketing">Marketing Firms</TabsTrigger>
          <TabsTrigger value="smb-operators">SMB Operators</TabsTrigger>
          <TabsTrigger value="lead-gen">Lead Generation</TabsTrigger>
        </TabsList>

        <TabsContent value="search-funds">
          <ClientUseCase
            title="Search Funds"
            description="Efficient deal sourcing and target identification for search fund entrepreneurs"
            challenges={[
              "Finding qualified acquisition targets that meet specific criteria",
              "Accessing accurate financial data for preliminary valuation",
              "Identifying owners approaching retirement age",
              "Evaluating growth potential in fragmented markets",
            ]}
            solutions={[
              "Proprietary database of 33.2M SMBs with comprehensive filtering",
              "Owner demographic analysis to identify retirement-ready sellers",
              "Financial benchmarking against industry standards",
              "Fragmentation analysis to identify roll-up opportunities",
            ]}
            keyMetrics={[
              "78% of search funds cite 'finding quality targets' as top challenge",
              "240 hours saved per deal on data collection",
              "58% of SMB owners plan to exit in 5-10 years",
              "5M+ SMBs in high-fragmentation industries",
            ]}
            caseStudy={{
              title: "Midwest Manufacturing Acquisition",
              content:
                "A search fund used OkapIQ to identify 37 manufacturing SMBs with owners aged 60+ in the Midwest. Census data integration revealed optimal locations based on workforce availability and income levels. The fund successfully acquired a precision parts manufacturer at 4.2x EBITDA, below the industry average of 5.5x.",
            }}
          />
        </TabsContent>

        <TabsContent value="private-equity">
          <ClientUseCase
            title="Private Equity Firms"
            description="Data-driven deal sourcing and market analysis for lower middle market PE firms"
            challenges={[
              "Deploying $2.3T in dry powder efficiently",
              "Identifying proprietary deals outside competitive auctions",
              "Evaluating fragmentation for roll-up strategies",
              "Assessing demographic trends for market sizing",
            ]}
            solutions={[
              "AI-powered 'hidden gem' identification algorithm",
              "Industry fragmentation analysis with consolidation potential scoring",
              "Census-enhanced market sizing and growth forecasting",
              "Proprietary valuation models calibrated to industry-specific multiples",
            ]}
            keyMetrics={[
              "68% of lower-middle-market PE firms miss return targets due to poor deal flow",
              "PE firms spend 68% of due diligence time validating SMB data",
              "Early SMB data leaders captured 80% of market share in niche verticals",
              "Every 10% increase in SMB data coverage drives 6% more deals",
            ]}
            caseStudy={{
              title: "Healthcare Services Roll-Up",
              content:
                "A PE firm leveraged OkapIQ to identify 87 dental practices in the Southeast with strong financial metrics and aging owners. Census integration revealed optimal locations based on income demographics and competition density. The firm acquired 12 practices in 18 months, achieving 30% operational synergies and a successful exit at 9.2x EBITDA.",
            }}
          />
        </TabsContent>

        <TabsContent value="family-offices">
          <ClientUseCase
            title="Family Offices"
            description="Long-term investment opportunities with stable returns for family offices"
            challenges={[
              "Finding businesses aligned with family expertise and values",
              "Identifying opportunities for generational wealth preservation",
              "Evaluating long-term demographic and market trends",
              "Assessing management succession and transition potential",
            ]}
            solutions={[
              "Value-aligned business matching algorithm",
              "Long-term demographic trend analysis for market stability",
              "Management depth assessment and succession planning tools",
              "Multi-generational ownership transition modeling",
            ]}
            keyMetrics={[
              "Family offices hold investments 2.7x longer than traditional PE",
              "42% of EU SMB owners will retire by 2030 with no succession plans",
              "SMBs with 3+ years of digital payment history sell 2.5x faster",
              "Cross-border SMB acquisitions increased 41% since 2020",
            ]}
            caseStudy={{
              title: "Multi-Generation Service Business",
              content:
                "A family office with industrial services expertise used OkapIQ to identify HVAC businesses in regions with favorable demographic trends. Census integration revealed areas with high homeownership rates and rising median incomes. The office acquired a 30-year-old HVAC business with strong customer retention, implementing technology improvements that increased margins by 15% while maintaining the company's community-focused values.",
            }}
          />
        </TabsContent>

        <TabsContent value="brokers">
          <ClientUseCase
            title="Business Brokerage Firms"
            description="Enhanced deal matching and valuation services for business brokers"
            challenges={[
              "Efficiently matching buyers with appropriate seller listings",
              "Providing accurate valuation guidance based on comparable sales",
              "Demonstrating market potential to prospective buyers",
              "Differentiating services in a competitive brokerage market",
            ]}
            solutions={[
              "AI-powered buyer-seller matching algorithm",
              "Industry-specific valuation benchmarking",
              "Census-enhanced market potential analysis",
              "White-labeled data visualization tools for client presentations",
            ]}
            keyMetrics={[
              "33% fewer active business brokers since 2019",
              "67% of brokers use 5+ tools to compile SMB data",
              "Only 12% of SMB transactions have publicly available pricing",
              "Brokers with data-driven approaches close 2.3x more deals",
            ]}
            caseStudy={{
              title: "Regional Brokerage Expansion",
              content:
                "A business brokerage firm integrated OkapIQ's data platform into their workflow, creating custom market reports for each listing that included census-enhanced demographic analysis and growth projections. The firm increased their closing rate by 35% and expanded into two new metropolitan areas, leveraging data-driven insights to win listings against established competitors.",
            }}
          />
        </TabsContent>

        <TabsContent value="marketing">
          <ClientUseCase
            title="Marketing Firms"
            description="Data-driven targeting and campaign optimization for marketing agencies"
            challenges={[
              "Identifying ideal SMB prospects for client acquisition",
              "Developing industry-specific messaging and positioning",
              "Optimizing marketing spend allocation by geography",
              "Demonstrating ROI to SMB clients with limited budgets",
            ]}
            solutions={[
              "Ideal customer profile matching across 33.2M SMBs",
              "Industry-specific pain point and messaging analysis",
              "Census-enhanced geographic targeting optimization",
              "Marketing ROI benchmarking by industry and region",
            ]}
            keyMetrics={[
              "SMBs with strong social engagement sell for 0.5-1.2x higher EBITDA multiples",
              "73% of investors prioritize EBITDA margins in search filters",
              "22% YoY growth in SMB SaaS spend",
              "SMBs in areas with median incomes 20%+ above average sustain 15-25% higher pricing",
            ]}
            caseStudy={{
              title: "Vertical-Specific Agency Growth",
              content:
                "A marketing agency specializing in professional services used OkapIQ to identify 1,200+ law firms matching their ideal client profile. Census integration enabled precise geographic targeting based on income demographics and competition density. The agency developed vertical-specific campaigns that achieved 3.2x higher conversion rates, growing their client base by 45% in 12 months.",
            }}
          />
        </TabsContent>

        <TabsContent value="smb-operators">
          <ClientUseCase
            title="SMB Owner-Operators"
            description="Market intelligence and growth strategies for SMB owners"
            challenges={[
              "Understanding competitive positioning in local markets",
              "Identifying expansion opportunities in new geographies",
              "Optimizing pricing strategy based on market conditions",
              "Planning for eventual business sale or succession",
            ]}
            solutions={[
              "Local market competitive intelligence dashboard",
              "Expansion opportunity scoring by geography",
              "Census-enhanced pricing optimization tools",
              "Exit planning and valuation enhancement roadmap",
            ]}
            keyMetrics={[
              "SMBs with digital financial records sell for 2.5x higher multiples",
              "60% of U.S. SMB owners will retire by 2030",
              "SMBs whose target customer age aligns with local demographics show 41% higher growth",
              "Areas with 25%+ population over age 55 show 32% higher rates of business transition",
            ]}
            caseStudy={{
              title: "Service Business Expansion",
              content:
                "A residential services company used OkapIQ to analyze expansion opportunities in neighboring counties. Census integration revealed optimal locations based on homeownership rates, income levels, and competition density. The business expanded into two new territories with precise marketing targeting, achieving profitability in both locations within 6 months and increasing overall company valuation by 40%.",
            }}
          />
        </TabsContent>

        <TabsContent value="lead-gen">
          <ClientUseCase
            title="Enterprise Lead Generation"
            description="Precision targeting and qualification for enterprise sales teams"
            challenges={[
              "Identifying SMBs that match ideal customer profiles",
              "Prioritizing prospects based on propensity to buy",
              "Scaling lead generation across multiple territories",
              "Demonstrating ROI of lead generation investments",
            ]}
            solutions={[
              "AI-powered ideal customer profile matching",
              "Propensity-to-buy scoring based on firmographic data",
              "Territory optimization with census-enhanced targeting",
              "Lead-to-revenue attribution modeling",
            ]}
            keyMetrics={[
              "Enterprise firms targeting SMBs waste 40% of sales efforts on poor-fit prospects",
              "Data-driven lead scoring improves conversion rates by 35%",
              "Territory optimization increases sales productivity by 28%",
              "SMBs in high-growth regions convert at 2.3x higher rates",
            ]}
            caseStudy={{
              title: "Enterprise SaaS Expansion",
              content:
                "An enterprise SaaS provider used OkapIQ to identify 5,000+ SMBs matching their ideal customer profile across 12 territories. Census integration enabled precise targeting based on business density and growth trends. The company achieved a 42% increase in qualified leads and 28% higher conversion rates, resulting in $3.2M in incremental annual recurring revenue.",
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
