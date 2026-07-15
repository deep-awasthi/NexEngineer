import { NextResponse } from 'next/server';

const LANGUAGE_VERSIONS: Record<string, { language: string; version: string }> = {
  python: { language: 'python', version: '3.10.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  cpp: { language: 'cpp', version: '10.2.0' },
  java: { language: 'java', version: '15.0.2' },
};

export async function POST(request: Request) {
  try {
    const { language, code, stdin } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required for execution.' }, { status: 400 });
    }

    const mapping = LANGUAGE_VERSIONS[language];
    if (!mapping) {
      return NextResponse.json({ error: `Language "${language}" is not supported.` }, { status: 400 });
    }

    const PISTON_URL = process.env.NEXT_PUBLIC_CODE_EXECUTION_URL || 'https://emkc.org/api/v2/piston';

    // Call Piston execute API
    const response = await fetch(`${PISTON_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: mapping.language,
        version: mapping.version,
        files: [
          {
            name: 'main',
            content: code,
          },
        ],
        stdin: stdin || '',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Execution engine responded with error status.', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Normalize response for frontend mapping
    return NextResponse.json({
      stdout: data.run?.stdout || '',
      stderr: data.run?.stderr || '',
      code: data.run?.code ?? 0,
      signal: data.run?.signal || null,
      output: data.run?.output || '',
    });

  } catch (error: any) {
    console.error('Code execution proxy error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error during code execution.', details: error.message },
      { status: 500 }
    );
  }
}
