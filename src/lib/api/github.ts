import { Octokit } from '@octokit/rest';
import { GitHubStats } from '@/types';
import { formatNumber } from '@/lib/utils';
import { GITHUB_REPOS } from '@/lib/githubRepos';

/**
 * Initialize GitHub Octokit client
 */
function getGitHubClient(): Octokit {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.warn('GitHub token not found. API rate limits will apply.');
  }

  return new Octokit({
    auth: token,
    userAgent: 'DataHub-Tools/1.0',
  });
}

/**
 * Fetch GitHub repository statistics
 */
export async function fetchGitHubStats(repo: string): Promise<GitHubStats | null> {
  const client = getGitHubClient();

  try {
    const [repoData, releasesData] = await Promise.all([
      client.rest.repos.get({
        owner: repo.split('/')[0],
        repo: repo.split('/')[1],
      }),
      client.rest.repos.listReleases({
        owner: repo.split('/')[0],
        repo: repo.split('/')[1],
        per_page: 1,
      }).catch(() => ({ data: [] })),
    ]);

    const { data } = repoData;
    const latestRelease = releasesData.data[0];

    // Calculate weekly growth (estimate based to stargazers count)
    // In production, you would use the stargazers timeline API
    const weeklyGrowth = +((data.stargazers_count * 0.002) // Rough estimate
      .toFixed(1));

    return {
      stars: data.stargazers_count,
      lastUpdated: data.updated_at,
      openIssues: data.open_issues_count,
      latestRelease: latestRelease?.tag_name || 'N/A',
      contributors: 0, // Would need separate API call
      weeklyGrowth,
      forks: data.forks_count,
      language: data.language || 'Unknown',
      repoUrl: data.html_url,
    };
  } catch (error: any) {
    if (error.status === 404) {
      console.warn(`GitHub repository not found: ${repo}`);
      return null;
    }
    if (error.status === 403) {
      console.error('GitHub API rate limit exceeded');
      throw new Error('GitHub API rate limit exceeded');
    }
    console.error(`Error fetching GitHub stats for ${repo}:`, error);
    return null;
  }
}

/**
 * Fetch GitHub stats by tool ID
 */
export async function fetchGitHubStatsByToolId(toolId: string): Promise<GitHubStats | null> {
  const repo = GITHUB_REPOS[toolId];
  if (!repo) {
    return null;
  }
  return fetchGitHubStats(repo);
}

/**
 * Batch fetch GitHub stats for multiple tools
 */
export async function batchFetchGitHubStats(toolIds: string[]): Promise<Map<string, GitHubStats>> {
  const results = new Map<string, GitHubStats>();

  // Filter out tools without GitHub repos
  const validTools = toolIds.filter(id => GITHUB_REPOS[id]);

  // Fetch in batches to respect rate limits
  const batchSize = 10;
  for (let i = 0; i < validTools.length; i += batchSize) {
    const batch = validTools.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (toolId) => {
        const stats = await fetchGitHubStatsByToolId(toolId);
        if (stats) {
          results.set(toolId, stats);
        }
      })
    );

    // Add delay between batches to be nice to the API
    if (i + batchSize < validTools.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

/**
 * Format GitHub stats for display
 */
export function formatGitHubStatsDisplay(stats: GitHubStats) {
  return {
    stars: formatNumber(stats.stars),
    forks: formatNumber(stats.forks),
    growth: stats.weeklyGrowth >= 0 ? `+${stats.weeklyGrowth.toFixed(1)}%` : `${stats.weeklyGrowth.toFixed(1)}%`,
    issues: formatNumber(stats.openIssues),
    release: stats.latestRelease,
    language: stats.language,
  };
}

/**
 * Check if a tool has GitHub integration
 */
export function hasGitHubIntegration(toolId: string): boolean {
  return toolId in GITHUB_REPOS;
}

/**
 * Get GitHub repo URL for a tool
 */
export function getGitHubRepoUrl(toolId: string): string | null {
  const repo = GITHUB_REPOS[toolId];
  if (!repo) return null;
  return `https://github.com/${repo}`;
}
