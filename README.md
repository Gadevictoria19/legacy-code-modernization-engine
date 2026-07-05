# Legacy Code Modernization Engine

A developer tool that ingests legacy Java/COBOL/C++ functions, isolates the
relevant context (target function + 1st-degree dependencies + data structures),
and uses Gemini to generate idiomatic Go equivalents — with the goal of
minimizing LLM hallucinations by keeping the prompt context small and precise.

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- Gemini API (`@google/genai`), called from a Vercel serverless function
  (`api/generate.ts`) — the API key never reaches the browser.

## Run locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set `GEMINI_API_KEY`:
   ```bash
   cp .env.example .env
   ```
3. Run the app:
   ```bash
   npm run dev
   ```

Note: `/api/generate` is a Vercel serverless function. Run `vercel dev`
instead of `npm run dev` if you want to exercise the real Gemini call locally;
`npm run dev` alone serves the frontend only and that endpoint will 404.

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. In Project Settings → Environment Variables, add `GEMINI_API_KEY`.
4. Deploy. Vercel will build the Vite frontend and auto-detect
   `api/generate.ts` as a serverless function.

## Project structure

```
src/
  components/     UI views (Dashboard, Repositories, Modernize, Settings)
  engine/
    parser.ts     Strips comments from legacy Java/COBOL/C++
    optimizer.ts  Builds the minimal context (target fn + deps + structs)
    llm.ts        Client helper that calls /api/generate
api/
  generate.ts     Serverless function — holds the Gemini API key server-side
```
