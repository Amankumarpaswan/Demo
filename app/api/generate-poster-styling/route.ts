// file path: app/api/generate-poster-styling/route.ts
// Mode B — 9:16 Portrait (1080×1920px) | Up to 5 photos
// Receives: { occasion, name, message, quote,
//             photos: { url: string, orientation: 'vertical'|'horizontal' }[],
//             design_seed, aspect_ratio, photo_count }
// Returns:  { isHtmlPoster: true, html: string } | { fallback: true }

import { NextResponse } from 'next/server';

const FALLBACK_TRIGGER = { fallback: true };

// ── Entropy + occasion-aware palette ────────────────────────────────────────
function seedHash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function palette(seed: string, occasion: string) {
  const h   = seedHash(seed);
  const occ = occasion.toLowerCase();

  // Occasion → base hue mapping (warm, editorial tones)
  const baseHue =
    occ.includes('birthday')    ? 25  :
    occ.includes('anniversary') ? 345 :
    occ.includes('wedding')     ? 38  :
    occ.includes('diwali')      ? 30  :
    occ.includes('eid')         ? 160 :
    occ.includes('holi')        ? 285 :
    occ.includes('christmas')   ? 140 :
    h % 360;

  const hueOff   = (h % 41) - 20;             // ±20° seed variation
  const hue1     = (baseHue + hueOff + 360) % 360;
  const hue2     = (hue1 + 137) % 360;        // golden-angle complement
  const hue3     = (hue1 + 222) % 360;

  // Light warm background (paper/cream feel)
  const satBg    = 8  + (h % 14);
  const lumBg    = 91 + (h % 7);
  const bgHex    = `hsl(${hue1},${satBg}%,${lumBg}%)`;
  const panelHex = `hsl(${hue1},${satBg + 3}%,${lumBg - 4}%)`;

  // Text always very dark (near-black, hue-tinted)
  const textHex   = `hsl(${hue1},38%,10%)`;
  const accentHex = `hsl(${hue2},50%,28%)`;

  // Shadow: must contrast text (text is dark → shadow uses bg with slight offset)
  const shadowCss = `1px 1px 0 ${bgHex}, 0 2px 6px rgba(0,0,0,0.15)`;

  // Tilt from seed (polaroid feel): 5 different angles
  const tilts = Array.from({length: 5}, (_, i) =>
    ((seedHash(seed + 'tilt' + i) % 19) - 9)   // –9° to +9°
  );

  // Layout: 0-3
  const layoutPick = h % 4;

  return { hue1, hue2, hue3, bgHex, panelHex, textHex, accentHex,
           shadowCss, tilts, layoutPick };
}

// ── SVG grain filter ─────────────────────────────────────────────────────────
const grain = `<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0"><defs>
  <filter id="gf"><feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4"
    stitchTiles="stitch" result="n"/><feColorMatrix type="saturate" values="0" in="n" result="g"/>
  <feBlend in="SourceGraphic" in2="g" mode="overlay" result="b"/>
  <feComposite in="b" in2="SourceGraphic" operator="in"/></filter>
  <filter id="sf"><feGaussianBlur stdDeviation="0.35"/></filter>
</defs></svg>`;

// ── Sparkle particles — NO round dots, polygon shapes only ───────────────────
const STAR4   = `clip-path:polygon(50% 0%,52% 47%,100% 50%,52% 53%,50% 100%,48% 53%,0% 50%,48% 47%)`;
const DIAMOND = `clip-path:polygon(50% 3%,97% 50%,50% 97%,3% 50%)`;
const SHAPES  = [STAR4, DIAMOND, STAR4, DIAMOND, STAR4, DIAMOND, STAR4, DIAMOND];

function particles(seed: string, accentHex: string, count = 8): string {
  return Array.from({length: count}, (_, i) => {
    const sz  = 4  + (seedHash(seed + 'sz' + i) % 10);
    const top = seedHash(seed + 'tp' + i) % 90;
    const lft = seedHash(seed + 'lf' + i) % 88;
    const dur = (1.6 + (seedHash(seed + 'dr' + i) % 30) / 10).toFixed(1);
    const del = ((seedHash(seed + 'dl' + i) % 40) / 10).toFixed(1);
    return `<div style="position:absolute;top:${top}%;left:${lft}%;width:${sz}px;height:${sz}px;` +
      `background:${accentHex};${SHAPES[i % 8]};z-index:28;pointer-events:none;` +
      `filter:url(#sf);animation:sp ${dur}s ease-in-out ${del}s infinite alternate;opacity:0.65;"></div>`;
  }).join('\n');
}

// ── Frame builders (Grid-based, object-position: center center) ──────────────
// Shape mapping: vertical → square (1/1), horizontal → landscape rect (4/3)
// object-position: center center — equal crop from all sides, face stays centered

function gridCell(
  n: number,
  orientation: string,
  extraStyle = '',
  border     = '12px solid #fff',
  shadow     = '0 4px 18px rgba(0,0,0,0.20),0 1px 4px rgba(0,0,0,0.10)',
  tiltDeg    = 0
): string {
  const ar  = orientation === 'horizontal' ? '4/3' : '1/1';
  return `<div style="overflow:hidden;border:${border};border-radius:3px;
    box-shadow:${shadow};${tiltDeg !== 0 ? `transform:rotate(${tiltDeg}deg);` : ''}${extraStyle}">
  <div style="width:100%;aspect-ratio:${ar};overflow:hidden;">
    <img src="{{PHOTO_${n}}}"
      style="width:100%;height:100%;object-fit:cover;object-position:center center;display:block;">
  </div>
</div>`;
}

// ── Text helpers ──────────────────────────────────────────────────────────────
const txt = {
  heading: (t: string, px: number, col: string, shad: string) => !t ? '' :
    `<div style="font-size:${px}px;font-weight:800;color:${col};letter-spacing:0.03em;
      line-height:1.15;font-family:Georgia,serif;text-shadow:${shad};">${t}</div>`,
  sub: (t: string, px: number, col: string) => !t ? '' :
    `<div style="font-size:${px}px;font-weight:600;color:${col};letter-spacing:0.05em;
      margin-top:6px;font-family:Georgia,serif;">${t}</div>`,
  quote: (t: string, px: number, col: string) => !t ? '' :
    `<div style="font-size:${px}px;font-style:italic;font-weight:300;color:${col};
      line-height:1.55;font-family:Georgia,serif;opacity:0.88;">"${t}"</div>`,
  pill: (t: string, col: string) => !t ? '' :
    `<span style="display:inline-block;border-radius:999px;padding:5px 22px;
      border:1.5px solid ${col};font-size:17px;letter-spacing:0.12em;
      text-transform:uppercase;color:${col};font-family:Georgia,serif;">${t}</span>`,
};

// ── Build Mode B HTML ─────────────────────────────────────────────────────────
function buildMode_B_Html(p: {
  occasionName: string; partnerName: string; quote: string;
  relationLabel: string; seed: string;
  images: { url: string; orientation: string }[];
}): string {

  const imgs = p.images.slice(0, 5);
  const pc   = imgs.length;
  const pal  = palette(p.seed, p.occasionName);

  // Font sizes
  const fs1 = 48 + (seedHash(p.seed + 'f1') % 22);  // 48–70 occasion name
  const fs2 = 32 + (seedHash(p.seed + 'f2') % 14);  // 32–46 partner
  const fs3 = 22 + (seedHash(p.seed + 'f3') % 10);  // 22–32 quote

  // Shared style block
  const style = `<style>
*{box-sizing:border-box;margin:0;padding:0;}
@keyframes sp{from{opacity:0;transform:scale(.3)rotate(0deg)}to{opacity:.88;transform:scale(1)rotate(40deg)}}
</style>`;

  const bg       = `<div style="position:absolute;inset:0;background:${pal.bgHex};z-index:0;"></div>`;
  const grainOvl = `<div style="position:absolute;inset:0;z-index:1;pointer-events:none;
    opacity:0.10;filter:url(#gf);mix-blend-mode:overlay;"></div>`;
  const sparks   = particles(p.seed, pal.accentHex, 8);

  // ── Text blocks (always in open/negative-space areas, never face-center) ────
  const topRightText = `<div style="position:absolute;top:4%;right:4%;z-index:22;
    text-align:right;max-width:44%;pointer-events:none;">
  ${txt.heading(p.occasionName, fs1, pal.textHex, pal.shadowCss)}
  ${txt.sub(p.partnerName, fs2, pal.accentHex)}
</div>`;

  const botLeftText = `<div style="position:absolute;bottom:3%;left:4%;z-index:22;
    max-width:58%;pointer-events:none;">
  ${txt.pill(p.relationLabel, pal.accentHex)}
  <div style="margin-top:6px;">${txt.quote(p.quote, fs3, pal.textHex)}</div>
</div>`;

  const topCenterText = `<div style="position:absolute;top:2%;left:0;width:100%;
    text-align:center;z-index:22;padding:0 32px;pointer-events:none;">
  ${txt.heading(p.occasionName, fs1, pal.textHex, pal.shadowCss)}
  ${txt.sub(p.partnerName, fs2, pal.accentHex)}
  <div style="margin-top:8px;">${txt.quote(p.quote, Math.round(fs3 * 0.9), pal.textHex)}</div>
</div>`;

  // ── 4 layout templates — CSS Grid/Flexbox with gap, 10-20% overlap ──────────

  // ── Template 0: SCATTERED POLAROIDS with flex + translateY overlap ──────────
  // Frames in a vertical flex column with -10% translateY overlap each
  // Text top-right corner, quote bottom-left
  const overlapPx0 = Math.round(0.12 * 280); // 12% of ~280px frame height
  const t0 = `${style}${grain}${bg}${grainOvl}
${topRightText}
<div style="position:absolute;top:16%;left:3%;width:94%;z-index:5;
  display:flex;flex-direction:column;gap:0;padding:0 8px;">
  ${gridCell(0, imgs[0]?.orientation ?? 'vertical', 'transform:rotate(' + pal.tilts[0] + 'deg);', '14px solid #fff')}
  ${pc >= 2 ? `<div style="margin-top:-${overlapPx0}px;align-self:flex-end;width:62%;transform:rotate(${pal.tilts[1]}deg);">
    ${gridCell(1, imgs[1]?.orientation ?? 'vertical', '', '14px solid #fff')}
  </div>` : ''}
  ${pc >= 3 ? `<div style="margin-top:-${overlapPx0}px;align-self:flex-start;width:60%;transform:rotate(${pal.tilts[2]}deg);">
    ${gridCell(2, imgs[2]?.orientation ?? 'vertical', '', '14px solid #fff')}
  </div>` : ''}
  ${pc >= 4 ? `<div style="margin-top:-${overlapPx0}px;align-self:center;width:64%;transform:rotate(${pal.tilts[3]}deg);">
    ${gridCell(3, imgs[3]?.orientation ?? 'vertical', '', '14px solid #fff')}
  </div>` : ''}
  ${pc >= 5 ? `<div style="margin-top:-${Math.round(overlapPx0 * 0.8)}px;align-self:flex-end;width:56%;transform:rotate(${pal.tilts[4]}deg);">
    ${gridCell(4, imgs[4]?.orientation ?? 'vertical', '', '14px solid #fff')}
  </div>` : ''}
</div>
${botLeftText}
${sparks}`;

  // ── Template 1: CSS GRID 2-COL with mid-band text ───────────────────────────
  // Top row: 2 frames. Mid band: text. Bottom row: 2-3 frames.
  // Gap: 0.75rem between cells. No rotation. Clean editorial.
  const t1 = `${style}${grain}${bg}${grainOvl}
<div style="position:absolute;inset:0;display:grid;
  grid-template-rows:auto 1fr auto;gap:0;z-index:5;">
  <!-- Top row: 2 frames -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;padding:0.75rem;">
    ${gridCell(0, imgs[0]?.orientation ?? 'vertical', '', '3px solid #fff')}
    ${pc >= 2 ? gridCell(1, imgs[1]?.orientation ?? 'vertical', '', '3px solid #fff') : '<div></div>'}
  </div>
  <!-- Mid text band -->
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:20px 32px;text-align:center;z-index:22;">
    ${txt.heading(p.occasionName, fs1, pal.textHex, pal.shadowCss)}
    <div style="margin-top:8px;">${txt.sub(p.partnerName, fs2, pal.accentHex)}</div>
    <div style="margin-top:6px;">${txt.pill(p.relationLabel, pal.accentHex)}</div>
    <div style="margin-top:8px;">${txt.quote(p.quote, fs3, pal.textHex)}</div>
  </div>
  <!-- Bottom row: up to 3 frames -->
  <div style="display:grid;grid-template-columns:repeat(${Math.min(pc - 2, 3)},1fr);
    gap:0.75rem;padding:0.75rem;">
    ${pc >= 3 ? gridCell(2, imgs[2]?.orientation ?? 'vertical', '', '3px solid #fff') : ''}
    ${pc >= 4 ? gridCell(3, imgs[3]?.orientation ?? 'vertical', '', '3px solid #fff') : ''}
    ${pc >= 5 ? gridCell(4, imgs[4]?.orientation ?? 'vertical', '', '3px solid #fff') : ''}
  </div>
</div>
${sparks}`;

  // ── Template 2: HERO + 2×2 with accent border, title top ────────────────────
  // Hero takes full width, 2×2 grid below with 1rem gap.
  // 15% translateY overlap: hero's bottom edge overlaps into 2×2 zone.
  // Title above hero, quote below 2×2.
  const t2 = `${style}${grain}${bg}${grainOvl}
<!-- Thin accent border around poster -->
<div style="position:absolute;inset:16px;border:1px solid ${pal.accentHex}66;
  z-index:30;pointer-events:none;border-radius:2px;"></div>
<!-- Title block top -->
<div style="position:absolute;top:2%;left:0;width:100%;text-align:center;
  z-index:22;padding:0 36px;pointer-events:none;">
  ${txt.heading(p.occasionName, fs1, pal.textHex, pal.shadowCss)}
  <div style="margin-top:6px;">${txt.sub(p.partnerName, fs2, pal.accentHex)}</div>
</div>
<!-- Hero frame (full width, top area) -->
<div style="position:absolute;top:18%;left:4%;width:92%;z-index:5;">
  ${gridCell(0, imgs[0]?.orientation ?? 'vertical', '', '3px solid #fff',
    '0 6px 24px rgba(0,0,0,0.22)')}
</div>
<!-- 2×2 grid below hero, translateY to create 15% overlap with hero bottom -->
<div style="position:absolute;top:62%;left:4%;width:92%;
  transform:translateY(-15%);z-index:6;">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
    ${pc >= 2 ? gridCell(1, imgs[1]?.orientation ?? 'vertical', '', '3px solid #fff') : '<div></div>'}
    ${pc >= 3 ? gridCell(2, imgs[2]?.orientation ?? 'vertical', '', '3px solid #fff') : '<div></div>'}
    ${pc >= 4 ? gridCell(3, imgs[3]?.orientation ?? 'vertical', '', '3px solid #fff') : '<div></div>'}
    ${pc >= 5 ? gridCell(4, imgs[4]?.orientation ?? 'vertical', '', '3px solid #fff') : '<div></div>'}
  </div>
</div>
<!-- Quote bottom -->
<div style="position:absolute;bottom:3%;left:4%;width:92%;text-align:center;
  z-index:22;pointer-events:none;">
  ${txt.quote(p.quote, fs3, pal.textHex)}
</div>
${sparks}`;

  // ── Template 3: STAGGERED FLEX COLUMNS ──────────────────────────────────────
  // Left flex column (2 frames), right flex column (3 frames).
  // Columns use gap:1rem. Right column has translateY(-10%) for 10% stagger.
  // Text: occasion top-right, quote bottom-left.
  const t3 = `${style}${grain}${bg}${grainOvl}
${topRightText}
<div style="position:absolute;top:14%;left:2%;width:96%;height:78%;
  display:flex;flex-direction:row;gap:0.75rem;z-index:5;padding:0 6px;">
  <!-- Left column: 2 frames -->
  <div style="flex:1;display:flex;flex-direction:column;gap:0.75rem;">
    ${gridCell(0, imgs[0]?.orientation ?? 'vertical', '', '12px solid #fff')}
    ${pc >= 3 ? gridCell(2, imgs[2]?.orientation ?? 'vertical', '', '12px solid #fff') : ''}
  </div>
  <!-- Right column: 2-3 frames, staggered 10% down -->
  <div style="flex:1;display:flex;flex-direction:column;gap:0.75rem;
    transform:translateY(10%);">
    ${pc >= 2 ? gridCell(1, imgs[1]?.orientation ?? 'vertical', '', '12px solid #fff') : ''}
    ${pc >= 4 ? gridCell(3, imgs[3]?.orientation ?? 'vertical', '', '12px solid #fff') : ''}
    ${pc >= 5 ? gridCell(4, imgs[4]?.orientation ?? 'vertical', '', '12px solid #fff') : ''}
  </div>
</div>
${botLeftText}
${sparks}`;

  const templates = [t0, t1, t2, t3];
  const chosen    = templates[pal.layoutPick];

  return `<div style="width:1080px;height:1920px;aspect-ratio:9/16;position:relative;
overflow:hidden;font-family:Georgia,serif;background:${pal.bgHex};">
${chosen}
</div>`;
}

// ── Prompt sent to Gemini ─────────────────────────────────────────────────────
function buildMode_B_Prompt(p: {
  occasionName: string; partnerName: string; quote: string;
  relationLabel: string; seed: string;
  images: { url: string; orientation: string }[];
}): string {

  const htmlTemplate = buildMode_B_Html(p);

  return `You are a world-class poster designer. Output a COMPLETE SELF-CONTAINED HTML string.
Raw HTML only — no markdown, no fences, no explanation. Start with <div, end with </div>.

DESIGN SEED    : ${p.seed}
OCCASION       : "${p.occasionName}"
PARTNER / NAME : "${p.partnerName}"
RELATION LABEL : "${p.relationLabel}"
QUOTE          : "${p.quote}"
PHOTO COUNT    : ${p.images.length}
ORIENTATIONS   : ${p.images.map((im, i) => `Photo${i}=${im.orientation}`).join(', ')}

PHOTO TOKENS (CRITICAL — do not alter):
  {{PHOTO_0}}, {{PHOTO_1}}, {{PHOTO_2}}, {{PHOTO_3}}, {{PHOTO_4}}
Every <img>: width:100%;height:100%;object-fit:cover;object-position:center center;display:block;
Frame wrapper: overflow:hidden — zero notch gaps guaranteed.

SHAPE MAPPING RULE:
  orientation=vertical   → frame aspect-ratio:1/1   (square — faces stay centered)
  orientation=horizontal → frame aspect-ratio:4/3   (landscape rectangle)

DISTANCE & GAP RULE: Use gap:0.5rem–1.5rem in grids/flex. Frames must not drift apart.

OVERLAP RULE (10%-20%):
  When frames overlap, use transform:translateY(-10% to -20%) or negative margins.
  Max overlap = 30%. NEVER overlap top-center of any photo (face protection).
  Text/badges placed only in corners or negative-space zones.

CONTRAST RULE: Text is dark. text-shadow must be the background colour offset — never same colour.

OUTPUT THE FOLLOWING TEMPLATE.
Replace ONLY the text placeholders with the actual OCCASION, PARTNER, QUOTE values above.
Adjust background hue ±3% based on seed ${p.seed}.
Do NOT restructure the layout. Output only the HTML:

${htmlTemplate}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      occasion, name, message, quote, photos,
      design_seed, photo_count,
    } = body;

    const apiKey    = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || 'gemini-flash-latest';

    if (!apiKey) {
      console.error('[Gemini][Styling] GEMINI_API_KEY not set');
      throw new Error('GEMINI_API_KEY is not set in .env.local');
    }

    const occasionName  = occasion  || '';
    const partnerName   = name && name !== occasion ? name : '';
    const quoteText     = quote     || message || '';
    const relationLabel = body.relationLabel || body.termLine || '';
    const seed          = design_seed || crypto.randomUUID();

    // photos can be either enriched { url, orientation }[] or legacy string[]
    const rawPhotos = Array.isArray(photos) ? photos.slice(0, 5) : [];
    const imageItems: { url: string; orientation: string }[] = rawPhotos.map((p: any) =>
      typeof p === 'string'
        ? { url: p, orientation: 'vertical' }          // legacy fallback
        : { url: p.url || '', orientation: p.orientation || 'vertical' }
    ).filter((p: any) => p.url);

    const pc = photo_count || imageItems.length || 1;

    console.log(`[Gemini][Styling] seed=${seed.substring(0,8)} | occasion="${occasionName}" | photos=${imageItems.length} | orientations=${imageItems.map(im=>im.orientation).join(',')} | model=${modelName}`);

    // ── Build Gemini request parts ─────────────────────────────────
    const parts: any[] = [];

    imageItems.forEach(({ url, orientation }, i) => {
      const raw = url.replace(/^data:image\/[a-z+]+;base64,/i, '');
      if (!raw) return;
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: raw } });
      console.log(`[Gemini][Styling] Photo ${i} (${orientation}) attached (~${Math.round(raw.length * 0.75 / 1024)}KB)`);
    });

    parts.push({
      text: buildMode_B_Prompt({
        occasionName,
        partnerName,
        quote:         quoteText,
        relationLabel,
        seed,
        images: imageItems,
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

    console.log('[Gemini][Styling] Sending prompt...');
    const resp = await fetch(geminiUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body:    JSON.stringify(requestBody),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error(`[Gemini][Styling] HTTP ${resp.status}:`, err.substring(0, 400));
      return NextResponse.json(FALLBACK_TRIGGER);
    }

    const data = await resp.json();
    const resParts: any[] = data?.candidates?.[0]?.content?.parts || [];
    const textPart = resParts.find((p: any) => typeof p.text === 'string');

    if (!textPart?.text) {
      console.error('[Gemini][Styling] No text part in response:', JSON.stringify(data).substring(0, 300));
      return NextResponse.json(FALLBACK_TRIGGER);
    }

    let html = textPart.text
      .replace(/^```html[\s\S]*?(\n|$)/i, '')
      .replace(/^```[\s\S]*?(\n|$)/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    if (!html.startsWith('<')) {
      console.error('[Gemini][Styling] Response not HTML:', html.substring(0, 200));
      return NextResponse.json(FALLBACK_TRIGGER);
    }

    console.log(`[Gemini][Styling] ✅ HTML poster ready | seed=${seed.substring(0,8)} | ${html.length} chars`);
    return NextResponse.json({ isHtmlPoster: true, html, seed });

  } catch (err) {
    console.error('[Gemini][Styling] Server error:', err);
    return NextResponse.json(FALLBACK_TRIGGER);
  }
}
