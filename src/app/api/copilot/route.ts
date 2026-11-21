import { NextRequest, NextResponse } from 'next/server';
import { askGeminiCopilot } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { prompt, history } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const result = await askGeminiCopilot(prompt, history || []);

    return NextResponse.json({
      status: 'success',
      reply: result.text,
      isLiveAI: result.isLiveAI,
      modelUsed: result.modelUsed,
      apiNotice: result.apiNotice,
      source: result.source,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Copilot API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
