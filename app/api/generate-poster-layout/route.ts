// file path: app/api/generate-poster-layout/route.ts
// Mode A — Single-Image Vertical Poster (4/5 or 9/16) | 1 photo
// Festivals, Jayanti, Special dates — Clean Separation or Smooth Fade
// Receives: { occasion, name, quote,
//             photos: { url: string, orientation: string }[],
//             design_seed }
// Returns:  { isHtmlPoster: true, html: string } | { fallback: true }

import { NextResponse } from 'next/server';

const FALLBACK_TRIGGER = { fallback: true };

// ── Entropy + occasion palette ────────────────────────────────────────────────
function seedHash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function palette(seed: string, occasion: string) {
  const h   = seedHash(seed);
  const occ = occasion.toLowerCase();

  // Occasion → editorial panel colours (light, dignified)
  const cfg: [number, number, number, number, number, number] =
    occ.includes('jayanti') || occ.includes('gandhi')
      ? [38,  6, 96, 220, 40, 20]   // ivory + navy
    : occ.includes('independence') || occ.includes('republic')
      ? [120, 6, 96,  16, 60, 26]   // white + saffron
    : occ.includes('diwali')
      ? [38, 14, 94,  30, 68, 28]   // cream + deep gold
    : occ.includes('eid')
      ? [150, 8, 95, 155, 42, 24]   // pearl + emerald
    : occ.includes('christmas')
      ? [130, 8, 95,   0, 52, 28]   // snow + deep red
    : occ.includes('holi')
      ? [295, 10, 95, 285, 58, 28]  // white + violet
    : [h % 360, 6, 92 + (h % 6), (h + 137) % 360, 38, 24];

  const [pH, pS, pL, aH, aS, aL] = cfg;
  const panelHex  = `hsl(${pH},${pS}%,${pL}%)`;
  const textHex   = `hsl(${pH},36%,10%)`;      // always very dark
  const accentHex = `hsl(${aH},${aS}%,${aL}%)`;
  // Shadow: background-tinted, never same as text
  const shadowCss = `1px 2px 0 ${panelHex}, 0 1px 5px rgba(0,0,0,0.14)`;
  // Use 4/5 ratio for more text space (taller than 1:1, more compact than 9/16)
  const aspectRatio = '4/5';
  // Layout variant: 0=split, 1=fade. Split is default; fade if seed is odd.
  const layoutPick = h % 2;
  return { panelHex, textHex, accentHex, shadowCss, aspectRatio, layoutPick };
}

// ── SVG grain ────────────────────────────────────────────────────────────────
const grain = `<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0"><defs>
  <filter id="gf"><feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4"
    stitchTiles="stitch" result="n"/><feColorMatrix type="saturate" values="0" in="n" result="g"/>
  <feBlend in="SourceGraphic" in2="g" mode="overlay" result="b"/>
  <feComposite in="b" in2="SourceGraphic" operator="in"/></filter>
</defs></svg>`;

// ── Subtle sparkles in text-panel area only (never over photo face) ──────────
function sparkles(seed: string, accentHex: string): string {
  const STAR4   = `clip-path:polygon(50% 0%,52% 47%,100% 50%,52% 53%,50% 100%,48% 53%,0% 50%,48% 47%)`;
  const DIAMOND = `clip-path:polygon(50% 3%,97% 50%,50% 97%,3% 50%)`;
  const sh = [STAR4, DIAMOND, STAR4, DIAMOND];
  // Sparkles only in bottom 36% (text panel zone)
  return Array.from({length: 4}, (_, i) => {
    const sz  = 4  + (seedHash(seed + i) % 8);
    const top = 64 + (seedHash(seed + 't' + i) % 30);   // 64–94% → panel only
    const lft = seedHash(seed + 'l' + i) % 86;
    const dur = (1.8 + (seedHash(seed + 'd' + i) % 28) / 10).toFixed(1);
    const del = ((seedHash(seed + 'q' + i) % 36) / 10).toFixed(1);
    return `<div style="position:absolute;top:${top}%;left:${lft}%;width:${sz}px;height:${sz}px;` +
      `background:${accentHex};${sh[i % 4]};z-index:25;pointer-events:none;` +
      `animation:sp ${dur}s ease-in-out ${del}s infinite alternate;opacity:0.60;"></div>`;
  }).join('\n');
}

// ── Mode A HTML builder ───────────────────────────────────────────────────────
function buildMode_A_Html(p: {
  occasionName: string;
  quoteText: string;
  hasPhoto: boolean;
  orientation: string;
  seed: string;
}): string {
  const pal = palette(p.seed, p.occasionName);
  const h   = seedHash(p.seed);

  const fs1 = 62 + (h % 28);       // 62–90px heading
  const fs2 = 30 + (h % 14);       // 30–44px quote

  // object-position always center center (equal crop, face stays centered)
  const objPos = 'center center';

  const photoEl = p.hasPhoto
    ? `<img src="{{PHOTO_0}}"
        style="width:100%;height:100%;object-fit:cover;object-position:${objPos};display:block;">`
    : `<div style="width:100%;height:100%;background:${pal.panelHex};"></div>`;

  const textContent = `
  <div style="font-size:${fs1}px;font-weight:800;color:${pal.textHex};
    letter-spacing:0.03em;line-height:1.15;font-family:Georgia,serif;
    text-shadow:${pal.shadowCss};margin-bottom:16px;">${p.occasionName}</div>
  ${p.quoteText
    ? `<div style="font-size:${fs2}px;font-style:italic;font-weight:300;
        color:${pal.textHex};line-height:1.55;font-family:Georgia,serif;
        opacity:0.88;">"${p.quoteText}"</div>`
    : ''}`;

  // ── Style 1: SPLIT LAYOUT — clean editorial separation ────────────────────
  // Photo top ~60%, thin accent divider line, solid panel text section bottom ~40%
  const split = `
<!-- Photo section top 60% -->
<div style="position:absolute;top:0;left:0;width:100%;height:60%;overflow:hidden;z-index:2;">
  ${photoEl}
</div>
<!-- Thin accent divider -->
<div style="position:absolute;top:60%;left:0;width:100%;height:2px;
  background:${pal.accentHex}66;z-index:6;"></div>
<!-- Solid text panel bottom 40% — generous space for heading + quote -->
<div style="position:absolute;top:61%;left:0;width:100%;height:39%;z-index:10;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:0 52px;text-align:center;background:${pal.panelHex};">
  ${textContent}
</div>
${sparkles(p.seed, pal.accentHex)}`;

  // ── Style 2: SMOOTH FADE — full bleed image + strict gradient at bottom ────
  // STRICT gradient: transparent 50% → rgba(0,0,0,0.9) 100%
  // text-color switches to near-white for legibility over dark gradient
  const fadeTextHex   = `hsl(0,0%,96%)`;   // near-white
  const fadeShad      = `0 2px 8px rgba(0,0,0,0.85), 1px 1px 0 rgba(0,0,0,0.60)`;
  const fade = `
<!-- Full-bleed photo -->
<div style="position:absolute;inset:0;overflow:hidden;z-index:2;">
  ${photoEl}
</div>
<!-- Strict smooth gradient: rgba(0,0,0,0) 50% → rgba(0,0,0,0.9) 100% -->
<div style="position:absolute;bottom:0;left:0;width:100%;height:55%;z-index:5;
  pointer-events:none;
  background:linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.9) 100%);"></div>
<!-- Text anchored to bottom — large comfortable space -->
<div style="position:absolute;bottom:0;left:0;width:100%;z-index:10;
  padding:0 52px 52px;text-align:center;">
  <div style="font-size:${fs1}px;font-weight:800;color:${fadeTextHex};
    letter-spacing:0.03em;line-height:1.15;font-family:Georgia,serif;
    text-shadow:${fadeShad};margin-bottom:14px;">${p.occasionName}</div>
  ${p.quoteText
    ? `<div style="font-size:${fs2}px;font-style:italic;font-weight:300;
        color:${fadeTextHex};line-height:1.55;font-family:Georgia,serif;
        opacity:0.92;text-shadow:0 1px 4px rgba(0,0,0,0.70);">"${p.quoteText}"</div>`
    : ''}
</div>`;

  const chosen = pal.layoutPick === 0 ? split : fade;

  return `<div style="width:1080px;aspect-ratio:${pal.aspectRatio};position:relative;
overflow:hidden;font-family:Georgia,serif;background:${pal.panelHex};">
<style>@keyframes sp{from{opacity:0;transform:scale(.3)}to{opacity:.70;transform:scale(1)}}</style>
${grain}
<div style="position:absolute;inset:0;z-index:15;pointer-events:none;
  opacity:0.08;filter:url(#gf);mix-blend-mode:overlay;"></div>
${chosen}
</div>`;
}

// ── Prompt to Gemini ──────────────────────────────────────────────────────────
function buildMode_A_Prompt(p: {
  occasionName: string;
  quoteText: string;
  hasPhoto: boolean;
  orientation: string;
  seed: string;
}): string {

  const pal         = palette(p.seed, p.occasionName);
  const htmlTemplate = buildMode_A_Html(p);
  const styleName   = pal.layoutPick === 0 ? 'Split Layout' : 'Smooth Fade';

  return `You are a world-class editorial poster designer. Output a COMPLETE SELF-CONTAINED HTML string.
Raw HTML only — no markdown, no fences, no explanation. Start with <div, end with </div>.

DESIGN SEED  : ${p.seed}
OCCASION     : "${p.occasionName}"
QUOTE        : "${p.quoteText}"
HAS PHOTO    : ${p.hasPhoto}
ORIENTATION  : ${p.orientation}
CHOSEN STYLE : ${styleName}

PHOTO TOKEN: src="{{PHOTO_0}}" — do not alter.
Every <img>: width:100%;height:100%;object-fit:cover;object-position:center center;display:block;
Frame: overflow:hidden — zero notch gaps. object-position:center center (equal crop, face stays centred).

ROOT ELEMENT uses aspect-ratio:${pal.aspectRatio} (NOT 1:1 — deprecated for insufficient text space).

CLEAN SEPARATION RULE:
  ${pal.layoutPick === 0
    ? 'Style 1 SPLIT: Photo top 60%. Thin accent divider line. Distinct solid text panel bottom 40%.\n  DO NOT apply any overlay on the photo section. Keep it clean and editorial.'
    : 'Style 2 SMOOTH FADE: Full-bleed photo. STRICT gradient at bottom:\n  linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.9) 100%)\n  Do NOT use a heavy solid overlay. The gradient must be smooth, not abrupt.'}

CONTRAST RULE:
  ${pal.layoutPick === 0
    ? `Text colour: ${pal.textHex} (dark). text-shadow must use panel bg ${pal.panelHex} as base — never the same as text colour.`
    : 'Text on fade section: near-white (hsl(0,0%,96%)). Shadow: rgba(0,0,0,0.85) — dark, not white.'}

GAP & SPACING: Ensure the text panel has sufficient padding (min 48px horizontal) and vertical centring.

Output the following template. Replace OCCASION and QUOTE with actual values.
Adjust panel/bg colour tone ±3% lightness from seed ${p.seed}. Keep layout intact:

${htmlTemplate}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { occasion, name, quote, photos, design_seed } = body;

    const apiKey    = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || 'gemini-flash-latest';

    if (!apiKey) {
      console.error('[Gemini][Layout] GEMINI_API_KEY not set');
      throw new Error('GEMINI_API_KEY is not set in .env.local');
    }

    const occasionName = occasion || name || '';
    const quoteText    = quote    || '';
    const seed         = design_seed || crypto.randomUUID();

    // photos can be enriched { url, orientation }[] or legacy string[]
    const rawPhotos = Array.isArray(photos) ? photos.slice(0, 1) : [];
    const heroItem: { url: string; orientation: string } =
      rawPhotos.length > 0
        ? typeof rawPhotos[0] === 'string'
          ? { url: rawPhotos[0], orientation: 'vertical' }
          : { url: rawPhotos[0].url || '', orientation: rawPhotos[0].orientation || 'vertical' }
        : { url: '', orientation: 'vertical' };

    const hasPhoto = Boolean(heroItem.url);

    console.log(`[Gemini][Layout] seed=${seed.substring(0,8)} | occasion="${occasionName}" | hasPhoto=${hasPhoto} | orientation=${heroItem.orientation} | model=${modelName}`);

    const parts: any[] = [];

    if (hasPhoto) {
      const raw = heroItem.url.replace(/^data:image\/[a-z+]+;base64,/i, '');
      if (raw) {
        parts.push({ inlineData: { mimeType: 'image/jpeg', data: raw } });
        console.log(`[Gemini][Layout] Hero photo (${heroItem.orientation}) attached (~${Math.round(raw.length * 0.75 / 1024)}KB)`);
      }
    }

    parts.push({
      text: buildMode_A_Prompt({
        occasionName,
        quoteText,
        hasPhoto,
        orientation: heroItem.orientation,
        seed,
      }),
    });

    const requestBody = {
      contents: [{ parts }],
      generationConfig: {
        responseModalities: ['TEXT'],
        temperature:        1.0,
        maxOutputTokens:    8192,
      },
    };

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    console.log('[Gemini][Layout] Sending prompt...');
    const resp = await fetch(geminiUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body:    JSON.stringify(requestBody),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error(`[Gemini][Layout] HTTP ${resp.status}:`, err.substring(0, 400));
      return NextResponse.json(FALLBACK_TRIGGER);
    }

    const data = await resp.json();
    const resParts: any[] = data?.candidates?.[0]?.content?.parts || [];
    const textPart = resParts.find((p: any) => typeof p.text === 'string');

    if (!textPart?.text) {
      console.error('[Gemini][Layout] No text in response:', JSON.stringify(data).substring(0, 300));
      return NextResponse.json(FALLBACK_TRIGGER);
    }

    let html = textPart.text
      .replace(/^```html[\s\S]*?(\n|$)/i, '')
      .replace(/^```[\s\S]*?(\n|$)/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    if (!html.startsWith('<')) {
      console.error('[Gemini][Layout] Response not HTML:', html.substring(0, 200));
      return NextResponse.json(FALLBACK_TRIGGER);
    }

    console.log(`[Gemini][Layout] ✅ Square HTML poster ready | seed=${seed.substring(0,8)} | ${html.length} chars`);
    return NextResponse.json({ isHtmlPoster: true, html, seed });

  } catch (err) {
    console.error('[Gemini][Layout] Server error:', err);
    return NextResponse.json(FALLBACK_TRIGGER);
  }
}
