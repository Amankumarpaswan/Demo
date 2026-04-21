module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/generate-poster-styling/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
// file path: app/api/generate-poster-styling/route.ts
// Mode B -- 9:16 Multi-Image Collage (Personal Celebrations, Birthdays, Weddings)
// API: Google AI Studio (Gemini) -- keys strictly from .env.local:
//   GEMINI_API_KEY   (server-side, no NEXT_PUBLIC_ prefix)
//   GEMINI_MODEL     (e.g. gemini-2.0-flash-exp)
//
// FIX: all fetch bodies use Buffer.from(JSON.stringify(...), 'utf8')
//      to prevent undici ByteString TypeError on non-Latin1 characters.
// All prompt string literals use only ASCII 0-127 chars.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const FALLBACK_TRIGGER = {
    fallback: true
};
// ============================================================
// ENTROPY HELPERS
// ============================================================
function seedHash(seed) {
    let h = 0;
    for(let i = 0; i < seed.length; i++)h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
    return Math.abs(h);
}
function buildPalette(seed, occasion) {
    const h = seedHash(seed);
    const occ = occasion.toLowerCase();
    // Occasion-aware base hue (prevents random mismatched palettes)
    const baseHue = occ.includes('birthday') ? 25 : occ.includes('anniversary') ? 345 : occ.includes('wedding') ? 38 : occ.includes('diwali') ? 30 : occ.includes('eid') ? 160 : occ.includes('holi') ? 285 : occ.includes('christmas') ? 140 : h % 360;
    const hueShift = h % 41 - 20; // +-20 deg seed variation
    const hue1 = (baseHue + hueShift + 360) % 360;
    const hue2 = (hue1 + 137) % 360; // golden-angle complement
    const satBg = 8 + h % 14;
    const lumBg = 91 + h % 7;
    const bgHex = `hsl(${hue1},${satBg}%,${lumBg}%)`;
    // Text: near-black. Shadow: shifted bg color -- never same as text (contrast law).
    const textHex = `hsl(${hue1},38%,10%)`;
    const accentHex = `hsl(${hue2},50%,28%)`;
    const shadowCss = `1px 1px 0 ${bgHex},0 2px 6px rgba(0,0,0,0.18)`;
    // Tilt angles for polaroid layouts (5 values, +-9 deg)
    const tilts = Array.from({
        length: 5
    }, (_, i)=>seedHash(seed + 'tilt' + i) % 19 - 9);
    // Layout template: 0=Fan-Card, 1=Editorial-Grid, 2=Masonry, 3=Stagger-Cols
    const layoutPick = h % 4;
    return {
        bgHex,
        textHex,
        accentHex,
        shadowCss,
        tilts,
        layoutPick
    };
}
// ============================================================
// SAFE-ZONE: clamp all % values to 5-92 (no bleed-off-screen)
// ============================================================
const sz = (v)=>Math.max(5, Math.min(92, Math.round(v)));
// ============================================================
// FRAME BUILDER
// Shape mapping: vertical -> 1/1 square, horizontal -> 4/3, square -> 1/1
// object-position: top center -- face preserved, crop from bottom only
// ============================================================
function frame(n, orient, extraStyle = '', tilt = 0, border = '12px solid #fff', shadow = '0 6px 22px rgba(0,0,0,0.24),0 1px 5px rgba(0,0,0,0.12)') {
    const ar = orient === 'horizontal' ? '4/3' : '1/1';
    const rot = tilt !== 0 ? `transform:rotate(${tilt}deg);` : '';
    return `<div style="overflow:hidden;border:${border};border-radius:3px;box-shadow:${shadow};${rot}${extraStyle}">` + `<div style="width:100%;aspect-ratio:${ar};overflow:hidden;">` + `<img src="{{PHOTO_${n}}}" ` + `style="width:100%;height:100%;object-fit:cover;object-position:top center;display:block;">` + `</div></div>`;
}
// ============================================================
// TEXT HELPERS (ASCII-only output to avoid ByteString errors)
// ============================================================
const T = {
    h1: (t, px, col, shad)=>!t ? '' : `<div style="font-size:${px}px;font-weight:800;color:${col};letter-spacing:.03em;` + `line-height:1.15;font-family:Georgia,serif;text-shadow:${shad};">${t}</div>`,
    h2: (t, px, col)=>!t ? '' : `<div style="font-size:${px}px;font-weight:600;color:${col};letter-spacing:.05em;` + `margin-top:6px;font-family:Georgia,serif;">${t}</div>`,
    q: (t, px, col)=>!t ? '' : `<div style="font-size:${px}px;font-style:italic;font-weight:300;color:${col};` + `line-height:1.55;font-family:Georgia,serif;opacity:.88;">"${t}"</div>`,
    pill: (t, col)=>!t ? '' : `<span style="display:inline-block;border-radius:999px;padding:5px 22px;` + `border:1.5px solid ${col};font-size:17px;letter-spacing:.12em;` + `text-transform:uppercase;color:${col};font-family:Georgia,serif;">${t}</span>`
};
// ============================================================
// SVG GRAIN TEXTURE (paper feel, subtle)
// ============================================================
const grain = '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0"><defs>' + '<filter id="gf"><feTurbulence type="fractalNoise" baseFrequency=".68" numOctaves="4" ' + 'stitchTiles="stitch" result="n"/><feColorMatrix type="saturate" values="0" in="n" result="g"/>' + '<feBlend in="SourceGraphic" in2="g" mode="overlay" result="b"/>' + '<feComposite in="b" in2="SourceGraphic" operator="in"/></filter>' + '<filter id="sf"><feGaussianBlur stdDeviation=".35"/></filter>' + '</defs></svg>';
// ============================================================
// SPARKLE PARTICLES (polygon shapes only -- NO circles/dots)
// ============================================================
const SHAPES = [
    'clip-path:polygon(50% 0%,52% 47%,100% 50%,52% 53%,50% 100%,48% 53%,0% 50%,48% 47%)',
    'clip-path:polygon(50% 3%,97% 50%,50% 97%,3% 50%)'
];
function sparks(seed, col, n = 6) {
    return Array.from({
        length: n
    }, (_, i)=>{
        const s = 4 + seedHash(seed + 'sz' + i) % 10;
        const top = seedHash(seed + 'tp' + i) % 90;
        const lft = seedHash(seed + 'lf' + i) % 88;
        const dur = (1.6 + seedHash(seed + 'dr' + i) % 30 / 10).toFixed(1);
        const del = (seedHash(seed + 'dl' + i) % 40 / 10).toFixed(1);
        return `<div style="position:absolute;top:${top}%;left:${lft}%;width:${s}px;height:${s}px;` + `background:${col};${SHAPES[i % 2]};z-index:28;pointer-events:none;` + `filter:url(#sf);animation:sp ${dur}s ease-in-out ${del}s infinite alternate;opacity:.6;"></div>`;
    }).join('');
}
// ============================================================
// MODE B: BUILD PROMPT (pre-computes the HTML template,
//         sends it to Gemini for text-fill and colour-shift only)
// ============================================================
function buildMode_B_Prompt(p) {
    const imgs = p.images.slice(0, 5);
    const pc = imgs.length;
    const pal = buildPalette(p.seed, p.occasionName);
    const h = seedHash(p.seed);
    // Font sizes derived from seed
    const fs1 = 48 + h % 22; // 48-70 heading
    const fs2 = 32 + h % 14; // 32-46 partner name
    const fs3 = 22 + h % 10; // 22-32 quote
    const style = '<style>*{box-sizing:border-box;margin:0;padding:0;}' + '@keyframes sp{from{opacity:0;transform:scale(.3)rotate(0deg)}' + 'to{opacity:.85;transform:scale(1)rotate(42deg)}}</style>';
    const bg = `<div style="position:absolute;inset:0;background:${pal.bgHex};z-index:0;"></div>`;
    const grainOvl = '<div style="position:absolute;inset:0;z-index:1;pointer-events:none;' + 'opacity:.09;filter:url(#gf);mix-blend-mode:overlay;"></div>';
    const sp = sparks(p.seed, pal.accentHex, 6);
    // ---- Text blocks (placed in safe open zones, NEVER top-center of any photo) ----
    const textTR = `<div style="position:absolute;top:${sz(4)}%;right:${sz(4)}%;z-index:22;` + `text-align:right;max-width:44%;pointer-events:none;">` + T.h1(p.occasionName, fs1, pal.textHex, pal.shadowCss) + T.h2(p.partnerName, fs2, pal.accentHex) + `</div>`;
    const textBL = `<div style="position:absolute;bottom:${sz(3)}%;left:${sz(4)}%;z-index:22;` + `max-width:58%;pointer-events:none;">` + T.pill(p.relationLabel, pal.accentHex) + `<div style="margin-top:6px;">${T.q(p.quote, fs3, pal.textHex)}</div>` + `</div>`;
    const textTC = `<div style="position:absolute;top:${sz(2)}%;left:0;width:100%;` + `text-align:center;z-index:22;padding:0 32px;pointer-events:none;">` + T.h1(p.occasionName, fs1, pal.textHex, pal.shadowCss) + T.h2(p.partnerName, fs2, pal.accentHex) + `<div style="margin-top:8px;">${T.q(p.quote, Math.round(fs3 * .9), pal.textHex)}</div>` + `</div>`;
    // ---- 4 creative layout templates -----------------------------------------
    // Template 0: FAN CARD -- vertical cascade with 18% negative-margin overlap
    const overlapPx = Math.round(0.18 * 240);
    const t0 = style + grain + bg + grainOvl + textTR + `<div style="position:absolute;top:${sz(15)}%;left:${sz(3)}%;width:${sz(94)}%;` + `z-index:5;display:flex;flex-direction:column;align-items:center;gap:0;">` + frame(0, imgs[0]?.orientation ?? 'vertical', 'width:85%;', pal.tilts[0]) + (pc >= 2 ? `<div style="width:65%;margin-top:-${overlapPx}px;align-self:flex-end;` + `transform:rotate(${pal.tilts[1]}deg);">` + frame(1, imgs[1]?.orientation ?? 'vertical') + '</div>' : '') + (pc >= 3 ? `<div style="width:60%;margin-top:-${overlapPx}px;align-self:flex-start;` + `transform:rotate(${pal.tilts[2]}deg);">` + frame(2, imgs[2]?.orientation ?? 'vertical') + '</div>' : '') + (pc >= 4 ? `<div style="width:62%;margin-top:-${overlapPx}px;align-self:center;` + `transform:rotate(${pal.tilts[3]}deg);">` + frame(3, imgs[3]?.orientation ?? 'vertical') + '</div>' : '') + (pc >= 5 ? `<div style="width:56%;margin-top:-${Math.round(overlapPx * .75)}px;align-self:flex-end;` + `transform:rotate(${pal.tilts[4]}deg);">` + frame(4, imgs[4]?.orientation ?? 'vertical') + '</div>' : '') + '</div>' + textBL + sp;
    // Template 1: EDITORIAL GRID -- 2 top | text band | 1-3 bottom (gap: 0.75rem)
    const cols3 = Math.min(Math.max(pc - 2, 1), 3);
    const t1 = style + grain + grainOvl + `<div style="position:absolute;inset:0;display:grid;grid-template-rows:auto 1fr auto;z-index:5;">` + `<div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;padding:.75rem;">` + frame(0, imgs[0]?.orientation ?? 'vertical', '', 0, '3px solid #fff') + (pc >= 2 ? frame(1, imgs[1]?.orientation ?? 'vertical', '', 0, '3px solid #fff') : '<div></div>') + `</div>` + `<div style="background:${pal.bgHex};display:flex;flex-direction:column;` + `align-items:center;justify-content:center;padding:18px 32px;text-align:center;z-index:22;">` + T.h1(p.occasionName, fs1, pal.textHex, pal.shadowCss) + `<div style="margin-top:8px;">${T.h2(p.partnerName, fs2, pal.accentHex)}</div>` + `<div style="margin-top:6px;">${T.pill(p.relationLabel, pal.accentHex)}</div>` + `<div style="margin-top:8px;">${T.q(p.quote, fs3, pal.textHex)}</div>` + `</div>` + `<div style="background:${pal.bgHex};display:grid;` + `grid-template-columns:repeat(${cols3},1fr);gap:.75rem;padding:.75rem;">` + (pc >= 3 ? frame(2, imgs[2]?.orientation ?? 'vertical', '', 0, '3px solid #fff') : '') + (pc >= 4 ? frame(3, imgs[3]?.orientation ?? 'vertical', '', 0, '3px solid #fff') : '') + (pc >= 5 ? frame(4, imgs[4]?.orientation ?? 'vertical', '', 0, '3px solid #fff') : '') + `</div></div>` + sp;
    // Template 2: ASYMMETRIC MASONRY -- hero + 2x2 grid, translateY(-15%) overlap
    const t2 = style + grain + bg + grainOvl + `<div style="position:absolute;inset:16px;border:1px solid ${pal.accentHex}66;` + `z-index:30;pointer-events:none;border-radius:2px;"></div>` + textTC + `<div style="position:absolute;top:${sz(18)}%;left:${sz(4)}%;width:${sz(92)}%;z-index:5;">` + frame(0, imgs[0]?.orientation ?? 'vertical', '', 0, '3px solid #fff', '0 6px 24px rgba(0,0,0,0.22)') + `</div>` + `<div style="position:absolute;top:${sz(62)}%;left:${sz(4)}%;width:${sz(92)}%;` + `transform:translateY(-15%);z-index:6;">` + `<div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">` + (pc >= 2 ? frame(1, imgs[1]?.orientation ?? 'vertical', '', 0, '3px solid #fff') : '<div></div>') + (pc >= 3 ? frame(2, imgs[2]?.orientation ?? 'vertical', '', 0, '3px solid #fff') : '<div></div>') + (pc >= 4 ? frame(3, imgs[3]?.orientation ?? 'vertical', '', 0, '3px solid #fff') : '<div></div>') + (pc >= 5 ? frame(4, imgs[4]?.orientation ?? 'vertical', '', 0, '3px solid #fff') : '<div></div>') + `</div></div>` + `<div style="position:absolute;bottom:${sz(3)}%;left:${sz(4)}%;width:${sz(92)}%;` + `text-align:center;z-index:22;pointer-events:none;">${T.q(p.quote, fs3, pal.textHex)}</div>` + sp;
    // Template 3: STAGGERED COLUMNS -- left col + right col offset 10% down
    const t3 = style + grain + bg + grainOvl + textTR + `<div style="position:absolute;top:${sz(14)}%;left:${sz(2)}%;width:${sz(96)}%;height:${sz(78)}%;` + `display:flex;flex-direction:row;gap:.75rem;z-index:5;padding:0 6px;">` + `<div style="flex:1;display:flex;flex-direction:column;gap:.75rem;">` + frame(0, imgs[0]?.orientation ?? 'vertical', '', pal.tilts[0], '12px solid #fff') + (pc >= 3 ? frame(2, imgs[2]?.orientation ?? 'vertical', '', pal.tilts[2], '12px solid #fff') : '') + `</div>` + `<div style="flex:1;display:flex;flex-direction:column;gap:.75rem;transform:translateY(10%);">` + (pc >= 2 ? frame(1, imgs[1]?.orientation ?? 'vertical', '', pal.tilts[1], '12px solid #fff') : '') + (pc >= 4 ? frame(3, imgs[3]?.orientation ?? 'vertical', '', pal.tilts[3], '12px solid #fff') : '') + (pc >= 5 ? frame(4, imgs[4]?.orientation ?? 'vertical', '', pal.tilts[4], '12px solid #fff') : '') + `</div></div>` + textBL + sp;
    const templates = [
        t0,
        t1,
        t2,
        t3
    ];
    const htmlBody = templates[pal.layoutPick];
    const htmlTemplate = `<div style="width:1080px;height:1920px;aspect-ratio:9/16;position:relative;` + `overflow:hidden;font-family:Georgia,serif;background:${pal.bgHex};">` + htmlBody + `</div>`;
    // ALL prompt text is pure ASCII (no chars > 127) to prevent ByteString TypeError
    return `You are a world-class poster designer. Output a COMPLETE SELF-CONTAINED HTML string.
Raw HTML only, no markdown fences, no explanation. Start with <div, end with </div>.

DESIGN SEED: ${p.seed}
Occasion: "${p.occasionName}"
Partner/Name: "${p.partnerName}"
Relation: "${p.relationLabel}"
Quote: "${p.quote}"
Photo count: ${pc}
Orientations: ${imgs.map((im, i)=>`Photo${i}=${im.orientation}`).join(', ')}

PHOTO TOKENS (DO NOT ALTER):
  Photo 0 -> src="{{PHOTO_0}}", Photo 1 -> src="{{PHOTO_1}}"
  Photo 2 -> src="{{PHOTO_2}}", Photo 3 -> src="{{PHOTO_3}}"
  Photo 4 -> src="{{PHOTO_4}}"
<img> style: width:100%;height:100%;object-fit:cover;object-position:top center;display:block;
  object-position:top center = crop from bottom, face always safe at top.
Frame wrapper: overflow:hidden -- zero notch gaps.

SHAPE MAPPING:
  orientation=vertical or square -> frame aspect-ratio:1/1 (square)
  orientation=horizontal -> frame aspect-ratio:4/3 (rectangle)

SAFE-ZONE: All absolute top/left/right/bottom values: 5% to 95% only. No bleed.

GAP AND OVERLAP:
  Grids/flex: gap:0.5rem to 1.5rem (no huge white spaces).
  Frame overlap: margin-top negative (max 20% of frame height) or translateY(-10% to -20%).
  Text badges: MUST NOT sit over top-center of any photo (face protection).

CONTRAST LAW:
  Text: ${pal.textHex} (dark). text-shadow: shifted bg color -- NEVER same as text.
  100% legibility required on all text elements.

CONTENT COMPLETENESS (ALL FOUR MUST APPEAR -- skipping any = violation):
  occasionName="${p.occasionName}"
  partnerName="${p.partnerName}"
  relationLabel="${p.relationLabel}"
  quote="${p.quote}"

Root container LOCKED: width:1080px; height:1920px; aspect-ratio:9/16;
9:16 ratio is STRICT for Mode B. Do not change dimensions.

Output only the following pre-computed HTML template.
Replace text placeholders with actual content values above.
Adjust background hue +-3% lightness from seed ${p.seed}. Keep ALL layout positions intact:

${htmlTemplate}`;
}
async function POST(req) {
    try {
        const body = await req.json();
        const { occasion, name, message, quote, photos, design_seed, photo_count } = body;
        // Keys strictly from .env.local -- never hardcoded
        const apiKey = process.env.GEMINI_API_KEY;
        const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';
        if (!apiKey) {
            console.error('[Gemini][Styling] GEMINI_API_KEY not set in .env.local');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(FALLBACK_TRIGGER);
        }
        const occasionName = occasion || '';
        const partnerName = name && name !== occasion ? name : '';
        const quoteText = quote || message || '';
        const relationLabel = body.relationLabel || body.termLine || '';
        const seed = design_seed || crypto.randomUUID();
        // Normalise photos: supports { url, orientation }[] or legacy string[]
        const rawPhotos = Array.isArray(photos) ? photos.slice(0, 5) : [];
        const imageItems = rawPhotos.map((p)=>typeof p === 'string' ? {
                url: p,
                orientation: 'vertical'
            } : {
                url: p.url || '',
                orientation: p.orientation || 'vertical'
            }).filter((p)=>p.url);
        const pc = photo_count || imageItems.length || 1;
        console.log(`[Gemini][Styling] seed=${seed.slice(0, 8)} | ` + `occasion="${occasionName}" | photos=${imageItems.length} | model=${modelName}`);
        const promptText = buildMode_B_Prompt({
            occasionName,
            partnerName,
            quote: quoteText,
            relationLabel,
            seed,
            images: imageItems
        });
        console.log('[Gemini][Styling] Prompt length:', promptText.length, 'chars');
        const geminiPayload = {
            contents: [
                {
                    parts: [
                        {
                            text: promptText
                        }
                    ]
                }
            ],
            generationConfig: {
                responseModalities: [
                    'TEXT'
                ],
                temperature: 1.0,
                maxOutputTokens: 8192
            }
        };
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        // FIX: Buffer.from(JSON.stringify(), 'utf8') prevents undici ByteString TypeError
        // when payload contains non-Latin1 characters (Unicode > 255)
        const bodyBuffer = Buffer.from(JSON.stringify(geminiPayload), 'utf8');
        console.log('[Gemini][Styling] Calling Gemini API...');
        const resp = await fetch(geminiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: bodyBuffer
        });
        if (!resp.ok) {
            const err = await resp.text();
            console.error(`[Gemini][Styling] HTTP ${resp.status}:`, err.slice(0, 400));
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(FALLBACK_TRIGGER);
        }
        const data = await resp.json();
        console.log('[Gemini][Styling] Raw response:', JSON.stringify(data).slice(0, 300));
        const resParts = data?.candidates?.[0]?.content?.parts || [];
        const textPart = resParts.find((p)=>typeof p.text === 'string');
        if (!textPart?.text) {
            console.error('[Gemini][Styling] No text in response:', JSON.stringify(data).slice(0, 300));
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(FALLBACK_TRIGGER);
        }
        let html = textPart.text.replace(/^```html[\s\S]*?(\n|$)/i, '').replace(/^```[\s\S]*?(\n|$)/i, '').replace(/```\s*$/i, '').trim();
        console.log('[Gemini][Styling] Cleaned HTML (first 300):', html.slice(0, 300));
        if (!html.startsWith('<')) {
            console.error('[Gemini][Styling] Response not HTML:', html.slice(0, 200));
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(FALLBACK_TRIGGER);
        }
        console.log(`[Gemini][Styling] OK | seed=${seed.slice(0, 8)} | ${html.length} chars`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            isHtmlPoster: true,
            html,
            seed
        });
    } catch (err) {
        console.error('[Gemini][Styling] Server error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(FALLBACK_TRIGGER);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0_bata.._.js.map