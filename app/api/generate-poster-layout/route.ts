import { NextResponse } from 'next/server';

const FALLBACK_TRIGGER = { fallback: true };

export async function POST(req: Request) {
  try {
    const { occasion, name, quote } = await req.json();
    const uniqueId = Date.now();

    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

    if (!apiKey) {
      console.warn("No OpenRouter API Key found. Forcing Fallback.");
      return NextResponse.json(FALLBACK_TRIGGER);
    }

    const promptText = `
Role: You are an Elite UI/UX Designer and Frontend Architect.
Task: Design a completely unique, premium SQUARE poster (1080x1080 aspect ratio). Do NOT repeat layouts from previous requests. (Attempt ID: ${uniqueId})

CRITICAL INSTRUCTION: You must ONLY return a valid JSON object matching the exact schema below. No markdown, no explanations.

JSON SCHEMA:
{
  "background": {
    "type": "solid",
    "color1": "#HEX" // Base textured off-white/cream/pastel feel
  },
  "decorations": [ // Abstract organic shapes for the background
    { "type": "circle", "x": Number, "y": Number, "radius": Number, "color": "#HEX", "alpha": 0.8 },
    { "type": "rect", "x": Number, "y": Number, "w": Number, "h": Number, "color": "#HEX", "rotation": Number, "alpha": 0.5 }
  ],
  "imageFrames": [ // EXACTLY ONE frame for the main subject. Position it in the top 60% of the canvas.
    { "x": Number, "y": Number, "w": Number, "h": Number, "rotation": 0, "shape": "rectangle", "borderColor": "#HEX", "borderWidth": Number, "shadow": false }
  ],
  "textBlocks": [ // Position in the bottom 40%
    { "contentKey": "title", "text": "${occasion || name}", "x": Number, "y": Number, "fontSize": Number, "fontFamily": "sans-serif", "color": "#HEX", "align": "center", "maxWidth": 900, "isBold": true },
    { "contentKey": "subtitle", "text": "${quote}", "x": Number, "y": Number, "fontSize": Number, "fontFamily": "serif", "color": "#HEX", "align": "center", "maxWidth": 850, "isItalic": true }
  ]
}

DESIGN RULES:
- Format: Minimalist, elegant flat graphic design. Modern Swiss design.
- Frame coordinates (x,y) are the center of the frame.
- Perfect symmetry and centered vertical alignment for the text block.
- NO 3D renders, NO UI/UX elements. Strictly flat print design.
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
        temperature: 0.85,
        max_tokens: 1500
      })
    });

    if (!aiResponse.ok) {
      console.error("Pipeline B API Error:", await aiResponse.text());
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
      console.error("Pipeline B JSON Parse Error:", parseError, content);
      return NextResponse.json(FALLBACK_TRIGGER);
    }

  } catch (error) {
    console.error("Pipeline B Server Error:", error);
    return NextResponse.json(FALLBACK_TRIGGER);
  }
}