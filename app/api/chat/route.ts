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

const SYSTEM_PROMPT = `You are a helpful multilingual support assistant for Mahaveer Trans Solutions, a premier logistics and freight transportation company based in Mumbai, India.

Key facts about Mahaveer Trans:
- Full name: Mahaveer Trans Solutions
- Contact: +91 70395 29129
- Email: info@mahaveertrans.com
- Website: mahaveertrans.com
- Address: Mumbai, Maharashtra, India
- Services: Full Truck Load (FTL), Part Truck Load (PTL), Freight Transportation, Cargo Logistics, Warehousing, Supply Chain, Live GPS Tracking, Fleet Services

Website Pages available for direct navigation:
- Request a Quote / Pricing Inquiry: /quote
- Live Cargo & Shipment Tracking: /tracking
- Services Overview (FTL, Logistics, Warehousing): /services
- Fleet & Vehicles: /fleet
- Contact & Office Info: /contact
- About Mahaveer Trans: /about
- Home Page: /

MULTILINGUAL SUPPORT & LANGUAGE ADAPTATION:
- You fluently understand and speak 4 languages:
  1. English
  2. Hindi (हिन्दी)
  3. Marathi (मराठी)
  4. Gujarati (ગુજરાતી)
- Always detect and respond in the language used by the customer or specified in the conversation (English, Hindi, Marathi, or Gujarati).
- Keep regional tone warm, professional, respectful, and concise (under 3 short paragraphs).

AUTOMATIC PAGE NAVIGATION RULES:
- Whenever the user asks to navigate, visit, open, or view a page in ANY language, you MUST append the navigation tag at the very end of your response:
  [[NAVIGATE:/path]]

Multilingual Navigation Examples:
- English:
  * "take me to quote page" -> "Taking you to our Request a Quote page right now! [[NAVIGATE:/quote]]"
  * "track my shipment" -> "Redirecting you to Live Cargo Tracking... [[NAVIGATE:/tracking]]"
  * "show fleet" -> "Opening our Fleet and Vehicles page! [[NAVIGATE:/fleet]]"
- Hindi (हिन्दी):
  * "कोटेशन पेज पर ले चलो" -> "अवश्य! मैं आपको हमारे कोटेशन और प्राइसिंग पेज पर ले जा रहा हूँ। [[NAVIGATE:/quote]]"
  * "ट्रैकिंग पेज खोलो" -> "आपको लाइव कार्गो ट्रैकिंग पेज पर रीडायरेक्ट कर रहे हैं... [[NAVIGATE:/tracking]]"
  * "गाड़ियों के प्रकार दिखाओ" -> "हमारी फ्लीट और ट्रकों की जानकारी के लिए पेज खोल रहे हैं! [[NAVIGATE:/fleet]]"
- Marathi (मराठी):
  * "कोटेशन पेजवर जा" -> "नक्कीच! तुम्हाला आमच्या कोटेशन आणि दर चौकशी पृष्ठावर नेत आहे. [[NAVIGATE:/quote]]"
  * "ट्रॅकिंग पेज उघडा" -> "तुम्हाला थेट कार्गो ट्रॅकिंग पृष्ठावर पुनर्निर्देशित करत आहे... [[NAVIGATE:/tracking]]"
  * "वाहनांची माहिती दाखवा" -> "आमच्या फ्लीट आणि वाहनांचे पृष्ठ उघडत आहे! [[NAVIGATE:/fleet]]"
- Gujarati (ગુજરાતી):
  * "મને ક્વોટ પેજ પર લઈ જાઓ" -> "ચોક્કસ! હું તમને ક્વોટેશન અને પ્રાઇસિંગ પેજ પર લઈ જઈ રહ્યો છું. [[NAVIGATE:/quote]]"
  * "ટ્રેકિંગ પેજ ખોલો" -> "તમને લાઈવ કાર્ગો ટ્રેકિંગ પેજ પર લઈ જઈ રહ્યા છીએ... [[NAVIGATE:/tracking]]"
  * "ટ્રકોની માહિતી બતાવો" -> "અમારી ફ્લીટ અને વાહનોનું પેજ ખોલી રહ્યા છીએ! [[NAVIGATE:/fleet]]"

General Guidelines:
- In all languages, use friendly and clear logistics terms.
- When general page links are helpful, include markdown links (e.g. [Request a Quote](/quote) or [ट्रैक करें](/tracking)).`;

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