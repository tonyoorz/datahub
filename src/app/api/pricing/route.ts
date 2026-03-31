import { NextRequest, NextResponse } from 'next/server';
import { tools } from '@/data/tools';
import { PricingInfo, PricingPlan, ApiResponse } from '@/types';
import { withPricingCache } from '@/lib/cache/strategy';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * GET /api/pricing?toolId=d3js - Get pricing information for a tool
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const toolId = searchParams.get('toolId');

    if (toolId) {
      // Get pricing for specific tool
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

      const { data } = await withPricingCache(toolId, async () => {
        return parsePricingInfo(tool.pricing);
      });

      return NextResponse.json({
        success: true,
        data: {
          toolId,
          plans: data,
          lastUpdated: new Date().toISOString(),
        } as PricingInfo,
      });
    }

    // Get pricing for all tools
    const allPricing = tools.map((tool) => ({
      toolId: tool.id,
      pricing: tool.pricing || null,
    }));

    return NextResponse.json({
      success: true,
      data: allPricing,
    } as ApiResponse<typeof allPricing>);
  } catch (error) {
    console.error('Error in pricing API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pricing information',
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

/**
 * Parse pricing string into structured format
 */
function parsePricingInfo(pricing?: string): PricingPlan[] {
  if (!pricing) {
    return [{
      name: 'Contact for Pricing',
      price: '自定义',
      features: [],
    }];
  }

  const plans: PricingPlan[] = [];

  // Parse common pricing patterns
  // Example: "免费版可用 / Pro ¥73/用户/月 / Premium 按容量付费"
  const parts = pricing.split('/').map(p => p.trim());

  for (const part of parts) {
    const plan: PricingPlan = {
      name: '',
      price: part,
      features: [],
    };

    // Identify plan name
    if (part.toLowerCase().includes('免费') || part.toLowerCase().includes('开源')) {
      plan.name = 'Free';
    } else if (part.toLowerCase().includes('pro')) {
      plan.name = 'Pro';
    } else if (part.toLowerCase().includes('premium') || part.toLowerCase().includes('企业')) {
      plan.name = 'Premium';
    } else if (part.toLowerCase().includes('standard')) {
      plan.name = 'Standard';
    } else if (part.toLowerCase().includes('enterprise')) {
      plan.name = 'Enterprise';
    } else {
      plan.name = 'Default';
    }

    plans.push(plan);
  }

  return plans.length > 0 ? plans : [{
    name: 'Pricing',
    price: pricing,
    features: [],
  }];
}
