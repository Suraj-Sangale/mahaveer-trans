import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = process.env.GROQ_MODEL || "groq/compound-mini";
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_HISTORY_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 2000;

const FALLBACK_MODELS = [
  DEFAULT_MODEL,
  "groq/compound",
  "qwen/qwen3.8-27b",
].filter((model, i, arr) => arr.indexOf(model) === i);

const SYSTEM_PROMPT = `You are a helpful support assistant for Mahaveer Trans Solutions, a professional logistics and transportation company based in Mumbai, India.

Key facts about Mahaveer Trans:
- Full name: Mahaveer Trans Solutions
- Contact: +91 70395 29129
- Email: info@mahaveertrans.com
- Website: mahaveertrans.com
- Address: Mumbai, India
- Services: Freight transportation (FTL/PTL), logistics, supply chain management, cargo tracking, fleet services

Website Pages available for direct navigation:
- Request a Quote / Pricing Inquiry: /quote
- Live Cargo & Shipment Tracking: /tracking
- Services Overview (FTL, Logistics, Warehousing): /services
- Fleet & Vehicles: /fleet
- Contact & Office Info: /contact
- About Mahaveer Trans: /about
- Home Page: /

AUTOMATIC PAGE NAVIGATION RULES:
- Whenever the user asks to navigate, go to, open, visit, take them to, or show a specific page (e.g. "go to quote page", "take me to tracking", "show fleet", "open contact us", "navigate to services", "take me home"), you MUST append the exact navigation tag at the very end of your response:
  \`[[NAVIGATE:/path]]\`

  Examples:
  - User: "take me to quote page" -> Reply: "Taking you to our Request a Quote page right now! [[NAVIGATE:/quote]]"
  - User: "go to tracking" -> Reply: "Redirecting you to Live Cargo Tracking... [[NAVIGATE:/tracking]]"
  - User: "show me your fleet" -> Reply: "Opening our Fleet and Vehicles page! [[NAVIGATE:/fleet]]"
  - User: "contact page" -> Reply: "Taking you to our Contact Us page... [[NAVIGATE:/contact]]"
  - User: "what services do you offer? take me there" -> Reply: "We offer FTL, cargo logistics, warehousing and more. Taking you to our Services page! [[NAVIGATE:/services]]"
  - User: "go to home" -> Reply: "Navigating to Home page... [[NAVIGATE:/]]"

General Role:
- Help customers with inquiries about shipping, cargo tracking, quotes, fleet, and logistics services.
- When answering general questions where page links are helpful, include markdown links (e.g. [Request a Quote](/quote) or [Track Shipment](/tracking)).
- Be professional, concise, and friendly.
- Keep responses under 3 short paragraphs.
- Respond in the same language the user uses (English, Hindi, Marathi, etc.).`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface GroqChoice {
  message?: { content?: string };
}

interface GroqResponse {
  choices?: GroqChoice[];
}

function isValidMessage(msg: unknown): msg is ChatMessage {
  if (typeof msg !== "object" || msg === null) return false;
  const m = msg as Record<string, unknown>;
  return (
    (m.role === "user" || m.role === "assistant") &&
    typeof m.content === "string" &&
    m.content.trim().length > 0 &&
    m.content.length <= MAX_MESSAGE_LENGTH
  );
}

function sanitizeMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const trimmed = raw.slice(-MAX_HISTORY_MESSAGES);
  if (!trimmed.every(isValidMessage)) return null;
  return trimmed as ChatMessage[];
}

async function callGroq(
  model: string,
  messages: ChatMessage[],
  apiKey: string
): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 512,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      console.error(`Groq API error [${model}] (${response.status}):`, errorBody);
      return null;
    }

    const data: GroqResponse = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    return reply || null;
  } catch (err) {
    const reason =
      err instanceof Error && err.name === "AbortError" ? "timeout" : err;
    console.error(`Groq request failed [${model}]:`, reason);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("GROQ_API_KEY is not set.");
    return NextResponse.json(
      { error: "Chat service is not configured. Please try again later." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  const messages = sanitizeMessages(
    (body as { messages?: unknown })?.messages
  );
  if (!messages) {
    return NextResponse.json(
      {
        error:
          "Invalid request: 'messages' must be a non-empty array of { role: 'user' | 'assistant', content: string }.",
      },
      { status: 400 }
    );
  }

  for (const model of FALLBACK_MODELS) {
    const reply = await callGroq(model, messages, apiKey);
    if (reply) {
      return NextResponse.json({ reply });
    }
  }

  return NextResponse.json(
    { error: "AI service temporarily unavailable. Please try again." },
    { status: 502 }
  );
}