// Core tool types
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'bi' | 'visualization' | 'crawler';
  rating: number;
  features: string[];
  website: string;
  icon: string;
  tags: string[];
  featured?: boolean;
  pricing?: string;
  pros?: string[];
  cons?: string[];
  bestFor?: string;
  githubStars?: string;
  githubRepo?: string;
}

// GitHub statistics
export interface GitHubStats {
  stars: number;
  lastUpdated: string;
  openIssues: number;
  latestRelease: string;
  contributors: number;
  weeklyGrowth: number;
  forks: number;
  language: string;
  repoUrl: string;
}

// Trend data
export interface TrendData {
  toolId: string;
  toolName: string;
  dataPoints: DataPoint[];
  growthRate: number;
  avgStars: number;
}

export interface DataPoint {
  date: string;
  value: number;
}

// Comparison data
export interface ComparisonMetric {
  label: string;
  key: string;
  maxValue: number;
}

export interface ComparisonData {
  toolId: string;
  toolName: string;
  icon: string;
  metrics: Record<string, number>;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
  timestamp?: string;
}

export interface ToolListResponse {
  tools: Tool[];
  total: number;
  category?: string;
}

// Dashboard stats
export interface DashboardStats {
  totalTools: number;
  avgRating: number;
  totalStars: number;
  activeCategories: number;
  latestUpdate: string;
}

export interface CategoryStats {
  category: string;
  count: number;
  avgRating: number;
  totalStars: number;
}

// Pricing data
export interface PricingInfo {
  toolId: string;
  plans: PricingPlan[];
  lastUpdated: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  features: string[];
}

// Review data
export interface ReviewSource {
  source: string;
  url: string;
  rating: number;
  count: number;
}

export interface AggregatedRating {
  toolId: string;
  averageRating: number;
  totalReviews: number;
  sources: ReviewSource[];
  lastUpdated: string;
}

// Filter and sort options
export interface FilterOptions {
  category?: string;
  minRating?: number;
  pricing?: 'free' | 'paid' | 'freemium';
  tags?: string[];
  search?: string;
}

export interface SortOptions {
  field: 'rating' | 'name' | 'stars' | 'updated';
  order: 'asc' | 'desc';
}

// Cache strategy
export interface CacheConfig {
  ttl: number; // Time to live in seconds
  staleWhileRevalidate?: number; // Serve stale while revalidating
}

export const CACHE_CONFIG = {
  GITHUB_STATS: { ttl: 86400, staleWhileRevalidate: 3600 }, // 24 hours
  TOOL_LIST: { ttl: 3600 }, // 1 hour
  TOOL_DETAIL: { ttl: 3600 }, // 1 hour
  PRICING: { ttl: 604800 }, // 7 days
  REVIEWS: { ttl: 43200 }, // 12 hours
  TRENDS: { ttl: 3600 }, // 1 hour
} as const;

// Animation variants
export interface AnimationVariants {
  initial?: any;
  animate: any;
  exit?: any;
}

export const fadeInUp: AnimationVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const staggerContainer: AnimationVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const scaleIn: AnimationVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};
