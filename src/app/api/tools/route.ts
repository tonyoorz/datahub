import { NextRequest, NextResponse } from 'next/server';
import { tools } from '@/data/tools';
import { Tool, FilterOptions, SortOptions, ApiResponse } from '@/types';
import { withCache } from '@/lib/cache/strategy';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * GET /api/tools - Get filtered and sorted tools list
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const minRating = searchParams.get('minRating');
    const pricing = searchParams.get('pricing');
    const tags = searchParams.get('tags')?.split(',');
    const sortBy = searchParams.get('sortBy') || 'rating';
    const order = searchParams.get('order') || 'desc';
    const search = searchParams.get('search');

    // Create cache key based on query params
    const cacheKey = `list:${JSON.stringify({
      category,
      minRating,
      pricing,
      tags,
      sortBy,
      order,
      search,
    })}`;

    const { data: filteredTools } = await withCache({
      key: cacheKey,
      fetcher: () => filterAndSortTools({
        category: category || undefined,
        minRating: minRating ? parseFloat(minRating) : undefined,
        pricing: pricing as any,
        tags,
        search: search || undefined,
      }, { field: sortBy as any, order: order as any }),
    });

    return NextResponse.json({
      success: true,
      data: {
        tools: filteredTools,
        total: filteredTools.length,
      },
    } as ApiResponse<{ tools: Tool[]; total: number }>);
  } catch (error) {
    console.error('Error in tools API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tools',
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

/**
 * Filter and sort tools
 */
async function filterAndSortTools(
  filters: FilterOptions & { search?: string },
  sort: SortOptions
): Promise<Tool[]> {
  let result = [...tools];

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    result = result.filter((tool) => tool.category === filters.category);
  }

  // Apply rating filter
  if (filters.minRating) {
    result = result.filter((tool) => tool.rating >= filters.minRating!);
  }

  // Apply pricing filter
  if (filters.pricing) {
    result = result.filter((tool) => {
      const pricingText = tool.pricing?.toLowerCase() || '';
      switch (filters.pricing) {
        case 'free':
          return pricingText.includes('免费') || pricingText.includes('开源');
        case 'paid':
          return !pricingText.includes('免费') && !pricingText.includes('开源');
        case 'freemium':
          return pricingText.includes('免费') && pricingText.includes('/');
        default:
          return true;
      }
    });
  }

  // Apply tags filter
  if (filters.tags && filters.tags.length > 0) {
    result = result.filter((tool) =>
      filters.tags!.some((tag) => tool.tags.includes(tag))
    );
  }

  // Apply sorting
  result.sort((a, b) => {
    let comparison = 0;

    switch (sort.field) {
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name, 'zh-CN');
        break;
      case 'stars':
        const aStars = a.githubStars ? parseInt(a.githubStars) : 0;
        const bStars = b.githubStars ? parseInt(b.githubStars) : 0;
        comparison = aStars - bStars;
        break;
      case 'updated':
        // Would need actual update date
        comparison = 0;
        break;
    }

    return sort.order === 'asc' ? comparison : -comparison;
  });

  return result;
}

/**
 * OPTIONS /api/tools - Handle CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
