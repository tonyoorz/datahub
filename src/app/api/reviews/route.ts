import { NextRequest, NextResponse } from 'next/server';
import { tools } from '@/data/tools';
import { AggregatedRating, ReviewSource, ApiResponse } from '@/types';
import { withReviewCache } from '@/lib/cache/strategy';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * GET /api/reviews?toolId=d3js - Get aggregated review ratings for a tool
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const toolId = searchParams.get('toolId');

    if (toolId) {
      const tool = tools.find((t) => t.id === toolId);

      if (!tool) {
        return NextResponse.json(
          {
            success: false,
            error: 'Tool not found',
          } as ApiResponse<never>,
          { status: 404 }
        );
      }

      const { data } = await withReviewCache(toolId, async () => {
        return aggregateReviews(tool);
      });

      return NextResponse.json({
        success: true,
        data,
      } as ApiResponse<AggregatedRating>);
    }

    // Get ratings for all tools
    const allRatings = tools.map((tool) => ({
      toolId: tool.id,
      rating: tool.rating,
    }));

    return NextResponse.json({
      success: true,
      data: allRatings,
    } as ApiResponse<typeof allRatings>);
  } catch (error) {
    console.error('Error in reviews API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch review ratings',
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

/**
 * Aggregate reviews from multiple sources
 * For now, this uses the static rating from tools data
 * In production, you would integrate with:
 * - G2
 * - Capterra
 * - TrustRadius
 * - GitHub discussions
 * - Reddit
 */
async function aggregateReviews(tool: any): Promise<AggregatedRating> {
  const sources: ReviewSource[] = [];

  // Add internal rating as a source
  sources.push({
    source: 'DataHub',
    url: `https://datahub.example.com/tools/${tool.id}`,
    rating: tool.rating,
    count: Math.floor(Math.random() * 500) + 100, // Simulated count
  });

  // For tools with GitHub repos, we could add community metrics
  // This would require additional API calls

  // Calculate weighted average
  const totalWeight = sources.reduce((sum, s) => sum + s.count, 0);
  const weightedSum = sources.reduce((sum, s) => sum + (s.rating * s.count), 0);
  const averageRating = weightedSum / totalWeight;

  return {
    toolId: tool.id,
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: sources.reduce((sum, s) => sum + s.count, 0),
    sources,
    lastUpdated: new Date().toISOString(),
  };
}
