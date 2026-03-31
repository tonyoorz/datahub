import { NextRequest, NextResponse } from 'next/server';
import { tools } from '@/data/tools';
import { TrendData, DataPoint, ApiResponse } from '@/types';
import { withCache } from '@/lib/cache/strategy';
import { subDays, format } from 'date-fns';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * GET /api/trends?toolId=d3js&period=30d - Get trend data for a tool
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const toolId = searchParams.get('toolId');
    const period = searchParams.get('period') || '30d';

    if (toolId) {
      // Get trends for specific tool
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

      const { data } = await withCache({
        key: `trend:${toolId}:${period}`,
        fetcher: () => generateTrendData(tool, period),
        ttl: 3600,
      });

      return NextResponse.json({
        success: true,
        data,
      } as ApiResponse<TrendData>);
    }

    // Get trends for all tools (top 5)
    const featuredTools = tools.filter(t => t.featured).slice(0, 5);
    const allTrends = await Promise.all(
      featuredTools.map(async (tool) => {
        const { data } = await withCache({
          key: `trend:${tool.id}:${period}`,
          fetcher: () => generateTrendData(tool, period),
          ttl: 3600,
        });
        return data;
      })
    );

    return NextResponse.json({
      success: true,
      data: allTrends,
    } as ApiResponse<TrendData[]>);
  } catch (error) {
    console.error('Error in trends API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch trend data',
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

/**
 * Generate trend data for a tool
 * Note: This is simulated data. In production, you would:
 * 1. Fetch historical GitHub stars data
 * 2. Query Google Trends API
 * 3. Track npm downloads
 * 4. Monitor social mentions
 */
async function generateTrendData(tool: any, period: string): Promise<TrendData> {
  const days = parseInt(period) || 30;
  const dataPoints: DataPoint[] = [];

  // Base value from GitHub stars or random
  let baseValue = 0;
  if (tool.githubStars) {
    baseValue = parseInt(tool.githubStars.replace(/[^0-9]/g, '')) || 1000;
  } else {
    baseValue = 1000 + Math.random() * 50000;
  }

  // Generate daily data points with some randomness
  for (let i = days; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const randomFactor = 1 + (Math.random() - 0.5) * 0.1; // ±5% daily variation
    const trendFactor = 1 + (i / days) * 0.2; // 20% growth over period

    dataPoints.push({
      date: format(date, 'yyyy-MM-dd'),
      value: Math.round(baseValue * randomFactor * trendFactor),
    });
  }

  // Calculate growth rate
  const firstValue = dataPoints[0].value;
  const lastValue = dataPoints[dataPoints.length - 1].value;
  const growthRate = ((lastValue - firstValue) / firstValue) * 100;

  // Calculate average
  const avgStars = dataPoints.reduce((sum, dp) => sum + dp.value, 0) / dataPoints.length;

  return {
    toolId: tool.id,
    toolName: tool.name,
    dataPoints,
    growthRate: Math.round(growthRate * 10) / 10,
    avgStars: Math.round(avgStars),
  };
}
