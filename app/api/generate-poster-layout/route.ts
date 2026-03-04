import { NextResponse } from 'next/server';

const FALLBACK_STYLE = {
  posterBackgroundColor: "#F4F1EC",
  decorativeShape1Color: "#7D95A5",
  decorativeShape2Color: "#C3D5C0",
  decorativeShape3Color: "#BED0C3",
  decorativeShape4Color: "#B3A99D",
  accentLineColor: "#D1B67F", 
  imageFrameBorderColor: "#FFFFFF",
  textPanelColor: "#F3EFE6",
  titleTextColor: "#2B3A4A",
  subtitleTextColor: "#1A1A1A"
};

export async function POST(req: Request) {
  try {
    const { occasion, name, quote } = await req.json();

    const aesthetics = [
      "Earthy & Spiritual (Saffron, Sand, Sage)", "Royal Festive (Marigold, Deep Red, Emerald)", 
      "Modern Minimalist (Slate, Cream, Muted Navy)", "Warm Vintage Sepia (Terracotta, Brown, Cream)", 
      "Soft Spiritual Pastels (Peach, Mint, Lavender)", "Dark Mode Luxury (Charcoal, Gold, Deep Green)",
      "Vibrant Celebration (Pink, Orange, Yellow)", "Cool & Calm (Teal, Aqua, Soft Gray)"
    ];
    const randomAesthetic = aesthetics[Math.floor(Math.random() * aesthetics.length)];
    const uniqueId = Date.now();

    const promptText = `
Role: You are an elite, award-winning UI/UX Designer and Color Theorist specializing in Indian cultural aesthetics.
Task: Create a highly professional, aesthetically perfect color palette for a 1080x1080 square poster.
Occasion: "${occasion}"
Aesthetic Theme to Follow: "${randomAesthetic}" (Attempt ID: ${uniqueId})

Layout Structure & Color Assignment Rules:
1. "posterBackgroundColor": The main background canvas.
2. "decorativeShape1Color" to "4": These are 4 large organic blobs in the background. They MUST harmonize perfectly with the "posterBackgroundColor". They should look like a beautiful, cohesive abstract painting (analogous colors or soft contrast). Do not make them look messy or uncoordinated.
3. "imageFrameBorderColor": A thick border around the main image. Usually looks best as crisp White, Cream, or a deep accent color.
4. "textPanelColor": The solid block at the bottom for text. MUST look visually distinct but complementary to the image above it.
5. "titleTextColor" & "subtitleTextColor": These sit INSIDE the "textPanelColor". 
   - VISIBILITY CHECK: You MUST guarantee high contrast. If "textPanelColor" is dark, the text MUST be light/white. If the panel is light, text MUST be dark. It must be highly legible.
6. "accentLineColor": For elegant curve lines. Usually a metallic tone (Gold/Silver) or a strong elegant accent.

Design Standards:
- Do NOT use unrefined, default HTML colors (like pure blue #0000FF). Use sophisticated, muted, rich, or pastel modern hex codes.
- Ensure the overall vibe matches the occasion (Respectful for Jayanti, Festive for Diwali, Modern for Special Days).

Return ONLY a raw JSON object. Do not wrap it in \`\`\`json or add any conversational text.
Required exact keys:
{
  "posterBackgroundColor": "HEX_CODE",
  "decorativeShape1Color": "HEX_CODE",
  "decorativeShape2Color": "HEX_CODE",
  "decorativeShape3Color": "HEX_CODE",
  "decorativeShape4Color": "HEX_CODE",
  "accentLineColor": "HEX_CODE",
  "imageFrameBorderColor": "HEX_CODE",
  "textPanelColor": "HEX_CODE",
  "titleTextColor": "HEX_CODE",
  "subtitleTextColor": "HEX_CODE"
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