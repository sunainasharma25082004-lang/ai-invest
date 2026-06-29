import {
  Activity,
  AlertCircle,
  BarChart3,
  BookOpen,
  Globe,
  Shield,
  type LucideIcon,
} from 'lucide-react'

export const trustBadges = [
  'Google Ads Certified',
  'Regulatory Compliant',
  'Risk Disclosures Included',
] as const

export const features: {
  title: string
  description: string
  icon: LucideIcon
}[] = [
  {
    title: 'Live Market Data',
    description:
      'Real-time Digital assets price feeds, volume tracking, and market cap metrics.',
    icon: Activity,
  },
  {
    title: 'Historical Analysis',
    description:
      'Access years of on-chain data and price history with visual charting tools.',
    icon: BarChart3,
  },
  {
    title: 'Educational Hub',
    description:
      'Beginner to advanced crypto guides, explainers, and video walk-through.',
    icon: BookOpen,
  },
  {
    title: 'Price Alerts',
    description:
      'Set custom alerts for Digital assets price movements directly to your email or phone.',
    icon: AlertCircle,
  },
  {
    title: 'Risk Tools',
    description:
      'Portfolio risk calculators and volatility indicators to help you plan.',
    icon: Shield,
  },
  {
    title: 'Global Market News',
    description:
      'Curated, fact-checked crypto news aggregated from licensed sources.',
    icon: Globe,
  },
]

export const compliancePoints = [
  'All landing pages include clear, prominent risk disclosures as required by Google policy.',
  'No misleading claims about returns, profits, or guaranteed performance are made.',
  'Platform does not offer Initial Coin Offerings (ICOs), DeFi wallets, or unregulated exchange services.',
  'All claims are substantiated with data sources and do not constitute financial advice.',
] as const

export const legalPoints = [
  'InvestAI is registered as an information and research service provider, not a regulated financial institution.',
  'We do not accept deposits, manage funds, or execute trades on behalf of users.',
  'Data sources: CoinMarketCap, CoinGecko, Bloomberg Terminal feeds, and publicly available blockchain data.',
  'All content complies with applicable advertising standards in target regions.',
] as const