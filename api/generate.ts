import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

/**
 * Server-side endpoint for Go code generation.
 * The Gemini API key never reaches the browser — it lives only in
 * this function's environment (set as GEMINI_API_KEY in Vercel).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
  }

  const { context, model = 'gemini-3.1-pro-preview', temperature = 0.1 } = req.body ?? {};

  if (!context || typeof context !== 'string') {
    return res.status(400).json({ error: 'Missing required field: context (string)' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: `Convert the following legacy function into idiomatic Go. Assume the provided dependent function signatures already exist in the Go environment. Only output the Go code, no markdown formatting or explanations.\n\n${context}`,
      config: {
        systemInstruction:
          'You are an expert legacy migration engineer. Convert the provided legacy function into idiomatic Go. Assume the provided dependent function signatures already exist in the Go environment. Output only the raw Go code without any markdown formatting like ```go.',
        temperature,
      },
    });

    let text = response.text || '// Failed to generate code';
    text = text.replace(/^```(go)?\n/m, '').replace(/\n```$/m, '');

    return res.status(200).json({ code: text });
  } catch (error) {
    console.error('Error generating code:', error);
    return res.status(502).json({ error: 'Failed to generate code from the LLM provider' });
  }
}
