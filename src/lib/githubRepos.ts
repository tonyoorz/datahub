export const GITHUB_REPOS: Record<string, string> = {
  d3js: 'd3/d3',
  echarts: 'apache/echarts',
  chartjs: 'chartjs/Chart.js',
  apexcharts: 'apexcharts/apexcharts.js',
  recharts: 'recharts/recharts',
  highcharts: 'highcharts/highcharts',
  scrapy: 'scrapy/scrapy',
  puppeteer: 'puppeteer/puppeteer',
  playwright: 'microsoft/playwright',
  selenium: 'SeleniumHQ/selenium',
  metabase: 'metabase/metabase',
  superset: 'apache/superset',
  redash: 'getredash/redash',
};

export function hasGitHubIntegration(toolId: string): boolean {
  return toolId in GITHUB_REPOS;
}

export function getGitHubRepo(toolId: string): string | null {
  return GITHUB_REPOS[toolId] || null;
}
