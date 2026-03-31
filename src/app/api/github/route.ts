import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubStatsByToolId } from '@/lib/api/github';
import { withGitHubCache, invalidateCache } from '@/lib/cache/strategy';
import { GitHubStats, ApiResponse } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * GET /api/github?toolId=d3js - Get GitHub statistics for a tool
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const toolId = searchParams.get('toolId');

    if (!toolId) {
      return NextResponse.json(
        {
          success: false,
          error: 'toolId parameter is required',
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    const { data, cached } = await withGitHubCache(toolId, async () => {
      const stats = await fetchGitHubStatsByToolId(toolId);
      if (!stats) {
        throw new Error('GitHub repository not found for this tool');
      }
      return stats;
    });

    return NextResponse.json({
      success: true,
      data,
      cached,
      timestamp: new Date().toISOString(),
    } as ApiResponse<GitHubStats>);
  } catch (error: any) {
    console.error('Error in GitHub API:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch GitHub statistics',
      } as ApiResponse<never>,
      { status: error.message?.includes('not found') ? 404 : 500 }
    );
  }
}

/**
 * POST /api/github/refresh - Force refresh GitHub data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId } = body;

    if (!toolId) {
      return NextResponse.json(
        {
          success: false,
          error: 'toolId is required',
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Invalidate cache
    await invalidateCache(`github:${toolId}`, 'github');

    // Fetch fresh data
    const stats = await fetchGitHubStatsByToolId(toolId);

    if (!stats) {
      return NextResponse.json(
        {
          success: false,
          error: 'GitHub repository not found for this tool',
        } as ApiResponse<never>,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: stats,
      cached: false,
      timestamp: new Date().toISOString(),
    } as ApiResponse<GitHubStats>);
  } catch (error: any) {
    console.error('Error refreshing GitHub data:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to refresh GitHub statistics',
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
