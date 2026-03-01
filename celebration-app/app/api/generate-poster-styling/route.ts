import { NextResponse } from 'next/server';

const FALLBACK_STYLE = {
  backgroundColor: "#F9F5EB",
  frameColor: "#FFFFFF",
  greetingCardColor: "#FFFFFF",
  titleTextColor: "#1A1A1A",
  subtitleTextColor: "#666666",
  decorativeAccentColor: "#D4AF37"
};

export async function POST(req: Request) {
  try {
    const { occasion, name, message } = await req.json();

    const aesthetics = [
      "Soft & Dreamy Pastels", "Dark Academia / Moody Luxury", "Vibrant & Cheerful", 
      "Earthy & Muted Boho", "Royal Jewel Tones (Emerald, Ruby, Sapphire)", 
      "Warm Sunset Glow", "Cool Ocean Blues & Aquas", "Vintage & Nostalgic", 
      "Minimalist Monochrome Elegance", "Desert Sand & Terracotta"
    ];
    const randomAesthetic = aesthetics[Math.floor(Math.random() * aesthetics.length)];
    const uniqueId = Date.now();

    const promptText = `
Role: You are an elite, award-winning UI/UX Designer and Color Theorist.
Task: Create a highly professional, aesthetically perfect, and MODERN color palette for a 1080x1920 portrait poster.
Occasion: "${occasion}"
Aesthetic Theme to Follow: "${randomAesthetic}" (Attempt ID: ${uniqueId})

Layout Structure & Color Assignment Rules:
1. "backgroundColor": The base canvas. Must set the mood.
2. "frameColor": The border of 5 polaroid photos. MUST contrast perfectly with the backgroundColor so the photos pop out (e.g., crisp white on a dark background, or deep charcoal on a light background).
3. "greetingCardColor": The central message card. MUST contrast with the backgroundColor so it acts as a focal point.
4. "titleTextColor" & "subtitleTextColor": These go INSIDE the greeting card. 
   - VISIBILITY CHECK: You MUST ensure WCAG standard high contrast. If "greetingCardColor" is light, these texts MUST be very dark. If the card is dark, these texts MUST be light/white. They must be highly readable.
5. "decorativeAccentColor": For small background dots/lines. Should complement the overall palette.

Design Standards:
- Do NOT use raw/ugly neon colors (like #FF0000 or #00FF00). Use sophisticated, modern, professional hex codes (e.g., #E87A5D, #2B3A4A, #F7F5F0).
- Everything must look like it was designed by a top-tier creative agency. Every color must belong to a unified harmony.

Return ONLY a raw JSON object. Do not wrap it in \`\`\`json or add any conversational text.
Required exact keys:
{
  "backgroundColor": "HEX_CODE",
  "frameColor": "HEX_CODE",
  "greetingCardColor": "HEX_CODE",
  "titleTextColor": "HEX_CODE",
  "subtitleTextColor": "HEX_CODE",
  "decorativeAccentColor": "HEX_CODE"
}
`;

    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("No API key found, falling back.");
      return NextResponse.json(FALLBACK_STYLE);
    }

    const url = `https://openrouter.ai/api/v1/chat/completions`;

    const aiResponse = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.NEXT_PUBLIC_OPENROUTER_MODEL || "arcee-ai/trinity-large-preview:free",
        messages: [{ role: "user", content: promptText }],
        temperature: 0.85 
      })
    });

    if (!aiResponse.ok) {
      console.error("API Error:", await aiResponse.text());
      return NextResponse.json(FALLBACK_STYLE);
    }

    const data = await aiResponse.json();
    let content = data.choices?.[0]?.message?.content || "";
    
    content = content.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
      const parsedJson = JSON.parse(content);
      return NextResponse.json(parsedJson);
    } catch (e) {
      console.error("JSON Parsing failed:", content);
      return NextResponse.json(FALLBACK_STYLE);
    }

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(FALLBACK_STYLE);
  }
}