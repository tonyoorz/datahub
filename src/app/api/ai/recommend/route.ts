import { NextRequest } from 'next/server';
import { tools } from '@/data/tools';

export const runtime = 'edge';

// Build a concise tool context to fit in the prompt
function buildToolsContext(): string {
  const lines = tools.map((t) =>
    `[${t.id}] ${t.name} | 分类:${t.category} | 评分:${t.rating} | 价格:${t.pricing || '未知'} | 标签:${t.tags.join(',')} | 简介:${t.description.slice(0, 80)}...`
  );
  return lines.join('\n');
}

const SYSTEM_PROMPT = `你是 DataHub 平台的 AI 选型助手，帮助用户在数据工具领域做出最优决策。
你只推荐 DataHub 收录的工具，不编造不存在的工具。

当前收录的工具数据如下：
${buildToolsContext()}

回答规范：
- 先简短地复述你对用户需求的理解（1句）
- 然后推荐 1-3 个最合适的工具，每个工具说明：名称、推荐原因、适合场景（2-3句）
- 最后给出一句简短的总结建议
- 语言：中文，语气专业但友好
- 格式：使用 markdown，但保持简洁
- 不要推荐超出用户需求的工具`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GLM_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GLM_API_KEY 未配置' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { messages } = await req.json();
  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: '无效的请求格式' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const glmMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'glm-4-flash',
      messages: glmMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return new Response(JSON.stringify({ error: `GLM API 错误: ${errorText}` }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Pass through the SSE stream directly
  const transformStream = new TransformStream({
    async transform(chunk, controller) {
      const text = new TextDecoder().decode(chunk);
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              controller.enqueue(
                new TextEncoder().encode(`data: ${JSON.stringify({ content: delta })}\n\n`)
              );
            }
          } catch {
            // skip malformed JSON lines
          }
        }
      }
    },
  });

  return new Response(response.body!.pipeThrough(transformStream), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
