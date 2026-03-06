import { NextResponse } from 'next/server';

const FALLBACK_TRIGGER = { fallback: true };

export async function POST(req: Request) {
  try {
    const { occasion, name, message } = await req.json();
    const uniqueId = Date.now();

    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

    if (!apiKey) {
      console.warn("No OpenRouter API Key found. Forcing Fallback.");
      return NextResponse.json(FALLBACK_TRIGGER);
    }

    const promptText = `
Role: You are an Elite UI/UX Designer and Frontend Architect.
Task: Design a completely unique, premium vertical poster (1080x1920 aspect ratio). Do NOT repeat layouts from previous requests. (Attempt ID: ${uniqueId})

CRITICAL INSTRUCTION: You must ONLY return a valid JSON object matching the exact schema below. No markdown, no explanations, no HTML.

JSON SCHEMA:
{
  "background": {
    "type": "solid", // or "gradient"
    "color1": "#HEX",
    "color2": "#HEX" // Only if gradient
  },
  "decorations": [ // Background decorative shapes
    { "type": "circle", "x": Number, "y": Number, "radius": Number, "color": "#HEX", "alpha": 0.2 },
    { "type": "rect", "x": Number, "y": Number, "w": Number, "h": Number, "color": "#HEX", "rotation": Number, "alpha": 0.3 }
  ],
  "imageFrames": [ // Create up to 5 frames for photos. Abandon fixed grids. Be creative (asymmetric, scattered, editorial).
    { "x": Number, "y": Number, "w": Number, "h": Number, "rotation": Number, "shape": "rectangle", "borderColor": "#HEX", "borderWidth": Number, "shadow": true }
  ],
  "textBlocks": [ // Position these texts gracefully
    { "contentKey": "title", "text": "${occasion}", "x": Number, "y": Number, "fontSize": Number, "fontFamily": "sans-serif", "color": "#HEX", "align": "center", "maxWidth": 900, "isBold": true },
    { "contentKey": "relationName", "text": "${name}", "x": Number, "y": Number, "fontSize": Number, "fontFamily": "sans-serif", "color": "#HEX", "align": "center", "maxWidth": 900, "isBold": true },
    { "contentKey": "subtitle", "text": "${message}", "x": Number, "y": Number, "fontSize": Number, "fontFamily": "serif", "color": "#HEX", "align": "center", "maxWidth": 900, "isItalic": true }
  ]
}

DESIGN RULES:
- Frame coordinates (x,y) are the center of the frame.
- Ensure textBlocks have high contrast against the background colors.
- Use elegant, modern hex colors (avoid pure #FF0000).
- Vary frame sizes and rotations for a modern scrapbook or editorial feel.
Return pure JSON only.
`;

    const aiResponse = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://jashn-celebration.vercel.app',
        'X-Title': 'Jashn Celebration App'
      },
      body: JSON.stringify({
        model: process.env.NEXT_PUBLIC_OPENROUTER_MODEL || "arcee-ai/trinity-large-preview:free",
        messages: [{ role: "user", content: promptText }],
        temperature: 0.9,
        max_tokens: 1500
      })
    });

    if (!aiResponse.ok) {
      console.error("Pipeline A API Error:", await aiResponse.text());
      return NextResponse.json(FALLBACK_TRIGGER);
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices?.[0]?.message?.content || "";
    
    // Clean markdown to ensure pure JSON
    content = content.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
      const blueprint = JSON.parse(content);
      return NextResponse.json({ isDynamic: true, blueprint });
    } catch (parseError) {
      console.error("Pipeline A JSON Parse Error:", parseError, content);
      return NextResponse.json(FALLBACK_TRIGGER);
    }

  } catch (error) {
    console.error("Pipeline A Server Error:", error);
    return NextResponse.json(FALLBACK_TRIGGER);
  }
}