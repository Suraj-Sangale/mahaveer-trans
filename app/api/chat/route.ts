import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are a helpful support assistant for Mahaveer Trans Solutions, a professional logistics and transportation company based in Mumbai, India.

Key facts about Mahaveer Trans:
- Full name: Mahaveer Trans Solutions
- Contact: +91 70395 29129
- Email: info@mahaveertrans.com
- Website: mahaveertrans.com
- Address: Mumbai, India
- Services: Freight transportation, logistics, supply chain management, cargo tracking, fleet services

Your role:
- Help customers with inquiries about shipping, cargo tracking, quotes, and logistics services
- Be professional, concise, and friendly
- Always refer users to call or email for specific quotes or bookings
- If asked about pricing, say you can connect them with the sales team
- Keep responses under 3 short paragraphs
- Respond in the same language the user uses (English or Hindi if needed)`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Groq API key not configured. Please add GROQ_API_KEY to your .env file." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array is required." },
        { status: 400 }
      );
    }

    // Keep last 10 messages max to stay within token limits
    const trimmedMessages = messages.slice(-10);

    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...trimmedMessages,
        ],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json().catch(() => ({}));
      console.error("Groq API error:", groqResponse.status, errorData);
      return NextResponse.json(
        { error: "AI service temporarily unavailable. Please try again." },
        { status: 502 }
      );
    }

    const data = await groqResponse.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, I could not generate a response.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
