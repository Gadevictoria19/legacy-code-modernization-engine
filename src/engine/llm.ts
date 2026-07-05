/**
 * The LLM Integration: Requests Go code generation from the server.
 *
 * The Gemini API key is never present in this file or in the browser —
 * the actual model call happens in /api/generate.ts on the server.
 */
export async function generateGoCode(
  optimizedContext: string,
  model: string = "gemini-3.1-pro-preview",
  temperature: number = 0.1
): Promise<string> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ context: optimizedContext, model, temperature }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.code as string;
}
