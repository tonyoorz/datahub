import { NextRequest, NextResponse } from 'next/server';
import { tools } from '@/data/tools';
import { Tool, ApiResponse } from '@/types';
import { withToolCache } from '@/lib/cache/strategy';
import { fetchGitHubStatsByToolId } from '@/lib/api/github';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * GET /api/tools/[id] - Get single tool details with enhanced data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tool = tools.find((t) => t.id === id);

    if (!tool) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tool not found',
        } as ApiResponse<never>,
        { status: 404 }
      );
    }

    // Fetch enhanced data
    const { data: enhancedTool } = await withToolCache(
      id,
      async () => {
        const [githubStats] = await Promise.all([
          fetchGitHubStatsByToolId(id),
        ]);

        return {
          ...tool,
          githubStats: githubStats || undefined,
          enrichedAt: new Date().toISOString(),
        };
      }
    );

    return NextResponse.json({
      success: true,
      data: enhancedTool,
    } as ApiResponse<typeof enhancedTool>);
  } catch (error) {
    console.error('Error in tool detail API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tool details',
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
