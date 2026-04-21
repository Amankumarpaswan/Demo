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
"[project]/app/api/generate-poster-layout/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
// file path: app/api/generate-poster-layout/route.ts
// Mode A -- Single-Image Vertical Poster (Jayanti, Divas, Festivals, Special Dates)
// API: Google AI Studio (Gemini) -- keys strictly from .env.local:
//   GEMINI_API_KEY   (server-side only, no NEXT_PUBLIC_ prefix)
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
// ============================================================
// DYNAMIC ASPECT RATIO (Mode A innovation -- NOT forced 1:1)
// vertical   -> 3/4  (portrait editorial, generous text space)
// horizontal -> 16/9 (cinematic widescreen)
// square     -> 1/1  (classic square)
// ============================================================
function aspectFromOrientation(orient) {
    if (orient === 'horizontal') return '16/9';
    if (orient === 'square') return '1/1';
    return '3/4';
}
// ============================================================
// OCCASION-AWARE EDITORIAL PALETTE
// ============================================================
function buildPalette(seed, occasion) {
    const h = seedHash(seed);
    const occ = occasion.toLowerCase();
    const cfg = occ.includes('jayanti') || occ.includes('gandhi') ? [
        38,
        6,
        96,
        220,
        42,
        20
    ] // ivory + navy
     : occ.includes('independence') || occ.includes('republic') ? [
        120,
        6,
        96,
        16,
        60,
        26
    ] // white + saffron
     : occ.includes('diwali') ? [
        38,
        14,
        94,
        30,
        68,
        28
    ] // cream + deep gold
     : occ.includes('eid') ? [
        150,
        8,
        95,
        155,
        42,
        24
    ] // pearl + emerald
     : occ.includes('christmas') ? [
        130,
        8,
        95,
        0,
        52,
        28
    ] // snow + deep red
     : occ.includes('holi') ? [
        295,
        10,
        95,
        285,
        58,
        28
    ] // white + violet
     : occ.includes('birthday') ? [
        32,
        10,
        95,
        25,
        55,
        26
    ] // warm cream + amber
     : occ.includes('wedding') || occ.includes('anniversary') ? [
        38,
        8,
        96,
        345,
        45,
        26
    ] // champagne + rose
     : occ.includes('divas') ? [
        38,
        6,
        96,
        30,
        50,
        22
    ] // cream + ochre (Aadivasi/Marathi Divas)
     : [
        h % 360,
        6,
        92 + h % 6,
        (h + 137) % 360,
        38,
        24
    ];
    const [pH, pS, pL, aH, aS, aL] = cfg;
    const panelHex = `hsl(${pH},${pS}%,${pL}%)`;
    const textHex = `hsl(${pH},36%,10%)`; // always near-black (contrast law)
    const accentHex = `hsl(${aH},${aS}%,${aL}%)`;
    // Shadow: shifted bg -- NEVER same colour as text (contrast law)
    const shadowCss = `1px 2px 0 ${panelHex},0 1px 5px rgba(0,0,0,0.15)`;
    // Layout variant: 0=Split, 1=Smooth-Fade (seed decides)
    const layoutPick = h % 2;
    return {
        panelHex,
        textHex,
        accentHex,
        shadowCss,
        layoutPick
    };
}
// ============================================================
// SVG GRAIN
// ============================================================
const grain = '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0"><defs>' + '<filter id="gf"><feTurbulence type="fractalNoise" baseFrequency=".68" numOctaves="4" ' + 'stitchTiles="stitch" result="n"/><feColorMatrix type="saturate" values="0" in="n" result="g"/>' + '<feBlend in="SourceGraphic" in2="g" mode="overlay" result="b"/>' + '<feComposite in="b" in2="SourceGraphic" operator="in"/></filter>' + '</defs></svg>';
// ============================================================
// SPARKLES (text-panel zone only -- never over photo/face)
// Placed at top 65-92% so they never overlap the photo area
// ============================================================
function sparks(seed, col) {
    const STAR = 'clip-path:polygon(50% 0%,52% 47%,100% 50%,52% 53%,50% 100%,48% 53%,0% 50%,48% 47%)';
    const DIAMOND = 'clip-path:polygon(50% 3%,97% 50%,50% 97%,3% 50%)';
    const sh = [
        STAR,
        DIAMOND,
        STAR,
        DIAMOND
    ];
    return Array.from({
        length: 4
    }, (_, i)=>{
        const s = 4 + seedHash(seed + i) % 8;
        const top = 65 + seedHash(seed + 't' + i) % 27; // 65-92%: text panel only
        const lft = seedHash(seed + 'l' + i) % 86;
        const dur = (1.8 + seedHash(seed + 'd' + i) % 28 / 10).toFixed(1);
        const del = (seedHash(seed + 'q' + i) % 36 / 10).toFixed(1);
        return `<div style="position:absolute;top:${top}%;left:${lft}%;width:${s}px;height:${s}px;` + `background:${col};${sh[i % 4]};z-index:25;pointer-events:none;` + `animation:sp ${dur}s ease-in-out ${del}s infinite alternate;opacity:.58;"></div>`;
    }).join('');
}
// ============================================================
// MODE A: PROMPT BUILDER
// Generates a clean split or smooth-fade single-image poster.
// ============================================================
function buildMode_A_Prompt(p) {
    const pal = buildPalette(p.seed, p.occasionName);
    const ar = aspectFromOrientation(p.orientation);
    const h = seedHash(p.seed);
    // Font sizes
    const fs1 = 62 + h % 28; // 62-90px heading
    const fs2 = 30 + h % 14; // 30-44px quote
    // SYMMETRICAL CENTER CROP (Mode A requirement):
    // object-position: center center -- equal crop from all sides.
    // Face stays in the mathematical center of the frame.
    const objPos = 'center center';
    const photoEl = p.hasPhoto ? `<img src="{{PHOTO_0}}" ` + `style="width:100%;height:100%;object-fit:cover;object-position:${objPos};display:block;">` : `<div style="width:100%;height:100%;background:${pal.panelHex};"></div>`;
    // Both heading and quote MUST appear (content completeness law)
    const headingEl = `<div style="font-size:${fs1}px;font-weight:800;color:${pal.textHex};` + `letter-spacing:.03em;line-height:1.15;font-family:Georgia,serif;` + `text-shadow:${pal.shadowCss};margin-bottom:16px;">${p.occasionName}</div>`;
    const quoteEl = p.quoteText ? `<div style="font-size:${fs2}px;font-style:italic;font-weight:300;` + `color:${pal.textHex};line-height:1.55;font-family:Georgia,serif;` + `opacity:.88;">"${p.quoteText}"</div>` : '';
    // ---- Style 0: SPLIT LAYOUT -----------------------------------------------
    // Photo top 62%. 2px accent divider. Solid text panel bottom 38%.
    // MANDATORY gap between photo and text: 2px divider line (visual separation).
    // Text panel centred with 52px horizontal padding (breathing room).
    // Smart proportion: hero >= 62%, text area <= 38%. No head-crop possible.
    const split = '<!-- Photo: top 62% -- center center crop, face stays in frame center -->' + `<div style="position:absolute;top:0;left:0;width:100%;height:62%;overflow:hidden;z-index:2;">${photoEl}</div>` + `<div style="position:absolute;top:62%;left:0;width:100%;height:2px;background:${pal.accentHex}66;z-index:6;"></div>` + '<!-- Text panel: bottom 38% -- solid bg, professional gap 1.5rem+ via flex centering -->' + `<div style="position:absolute;top:62%;left:0;width:100%;height:38%;z-index:10;` + `display:flex;flex-direction:column;align-items:center;justify-content:center;` + `gap:1.5rem;padding:0 52px;text-align:center;background:${pal.panelHex};">` + headingEl + quoteEl + '</div>' + sparks(p.seed, pal.accentHex);
    // ---- Style 1: SMOOTH FADE ------------------------------------------------
    // Full-bleed photo. STRICT gradient: rgba(0,0,0,0) at 50%, rgba(0,0,0,0.9) at 100%.
    // Text near-white for contrast over dark gradient (contrast law).
    // Glass-morphism backdrop on text block for maximum legibility.
    const fadeTextHex = 'hsl(0,0%,96%)';
    const fadeShad = '0 2px 8px rgba(0,0,0,0.88),1px 1px 0 rgba(0,0,0,0.60)';
    const fade = `<div style="position:absolute;inset:0;overflow:hidden;z-index:2;">${photoEl}</div>` + '<!-- Strict smooth gradient: transparent 0-50%, rgba(0,0,0,0.9) at 100% -->' + `<div style="position:absolute;bottom:0;left:0;width:100%;height:55%;z-index:5;pointer-events:none;` + `background:linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.9) 100%);"></div>` + '<!-- Text block: glass-morphism container for 100% legibility -->' + `<div style="position:absolute;bottom:0;left:0;width:100%;z-index:10;` + `padding:0 52px 52px;text-align:center;` + `background:linear-gradient(to top,rgba(0,0,0,0.15),transparent);` + `backdrop-filter:blur(0px);">` + `<div style="font-size:${fs1}px;font-weight:800;color:${fadeTextHex};` + `letter-spacing:.03em;line-height:1.15;font-family:Georgia,serif;` + `text-shadow:${fadeShad};margin-bottom:14px;">${p.occasionName}</div>` + (p.quoteText ? `<div style="font-size:${fs2}px;font-style:italic;font-weight:300;` + `color:${fadeTextHex};line-height:1.55;font-family:Georgia,serif;` + `opacity:.92;text-shadow:0 1px 4px rgba(0,0,0,.70);">"${p.quoteText}"</div>` : '') + '</div>';
    const chosen = pal.layoutPick === 0 ? split : fade;
    const styleName = pal.layoutPick === 0 ? 'Split Layout' : 'Smooth Fade';
    const fullHtml = `<div style="width:1080px;aspect-ratio:${ar};position:relative;` + `overflow:hidden;font-family:Georgia,serif;background:${pal.panelHex};">` + `<style>@keyframes sp{from{opacity:0;transform:scale(.3)}to{opacity:.70;transform:scale(1)}}</style>` + grain + `<div style="position:absolute;inset:0;z-index:15;pointer-events:none;` + `opacity:.08;filter:url(#gf);mix-blend-mode:overlay;"></div>` + chosen + `</div>`;
    // ALL prompt text is pure ASCII (no chars > 127) -- prevents ByteString TypeError
    return `You are a world-class editorial poster designer. Output a COMPLETE SELF-CONTAINED HTML string.
Raw HTML only, no markdown fences, no explanation. Start with <div, end with </div>.

DESIGN SEED: ${p.seed}
Occasion: "${p.occasionName}"
Quote: "${p.quoteText}"
Has Photo: ${p.hasPhoto}
Image Orientation: ${p.orientation}

PHOTO TOKEN (DO NOT ALTER): src="{{PHOTO_0}}"
<img> style: width:100%;height:100%;object-fit:cover;object-position:center center;display:block;
  SYMMETRICAL CENTER CROP: object-position:center center crops equally from all sides.
  Face stays in the mathematical center of the frame. No awkward cropping.
Frame wrapper: overflow:hidden -- zero notch gaps guaranteed.

DYNAMIC ASPECT RATIO (STRICT):
  Image orientation="${p.orientation}" -> Container MUST use aspect-ratio:${ar}.
  vertical -> 3/4  |  horizontal -> 16/9  |  square -> 1/1
  Width: 1080px always. Height computed from ratio.
  DO NOT force 1:1 for non-square images.

CHOSEN STYLE: ${styleName}
${pal.layoutPick === 0 ? `Split Layout:
  - Photo top 62%. Frame: overflow:hidden. object-position:center center.
  - 2px solid accent divider at 62%.
  - Text panel: bottom 38%, solid bg (${pal.panelHex}).
  - MANDATORY gap between sections: 1.5rem min (use flex gap or padding).
  - 52px horizontal padding on text panel. Flex column, centred.
  - DO NOT apply any overlay on photo. Keep it clean and editorial.` : `Smooth Fade:
  - Full-bleed photo. STRICT gradient only:
    linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.9) 100%)
  - Text at bottom, 52px padding. Text color: near-white hsl(0,0%,96%).
  - Glass-morphism backdrop: backdrop-filter:blur(8px) + semi-transparent bg on text block.
  - DO NOT use a heavy solid overlay. Gradient must start transparent at 50%.`}

SMART PROPORTION LAW:
  Hero image: min 62% of container height. Text area: max 38%.
  NEVER crop above the mathematical center (object-position:center center handles this).

CONTENT COMPLETENESS (BOTH MUST APPEAR -- skipping = violation):
  1. Occasion heading: "${p.occasionName}"
  2. Quote text: "${p.quoteText}"

PROFESSIONAL SEPARATION LAW:
  MANDATORY: At least 1.5rem gap between photo section and text section.
  Use CSS gap property in flex/grid or padding to ensure professional breathing room.

CONTRAST LAW:
${pal.layoutPick === 0 ? `Text: ${pal.textHex} (dark). text-shadow: ${pal.panelHex} shifted -- never same color.` : `Text: near-white hsl(0,0%,96%). Shadow: rgba(0,0,0,0.88) -- very dark, high contrast.`}

SAFE ZONE: All absolute positions: 5% to 95% of container. No bleed.

Output only the following pre-computed HTML template.
Replace "occasionName" and "quoteText" placeholders with actual values above.
Shift bg/panel color +-3% lightness based on seed ${p.seed}. Keep ALL structure intact:

${fullHtml}`;
}
async function POST(req) {
    try {
        const body = await req.json();
        const { occasion, name, quote, photos, design_seed } = body;
        // Keys strictly from .env.local -- never hardcoded
        const apiKey = process.env.GEMINI_API_KEY;
        const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';
        if (!apiKey) {
            console.error('[Gemini][Layout] GEMINI_API_KEY not set in .env.local');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(FALLBACK_TRIGGER);
        }
        const occasionName = occasion || name || '';
        const quoteText = quote || '';
        const seed = design_seed || crypto.randomUUID();
        // Normalise hero photo payload
        const rawPhotos = Array.isArray(photos) ? photos.slice(0, 1) : [];
        const heroRaw = rawPhotos[0];
        const heroItem = !heroRaw ? {
            url: '',
            orientation: 'vertical'
        } : typeof heroRaw === 'string' ? {
            url: heroRaw,
            orientation: 'vertical'
        } : {
            url: heroRaw.url || '',
            orientation: heroRaw.orientation || 'vertical'
        };
        const hasPhoto = Boolean(heroItem.url);
        console.log(`[Gemini][Layout] seed=${seed.slice(0, 8)} | ` + `occasion="${occasionName}" | hasPhoto=${hasPhoto} | ` + `orientation=${heroItem.orientation} | model=${modelName}`);
        const promptText = buildMode_A_Prompt({
            occasionName,
            quoteText,
            hasPhoto,
            orientation: heroItem.orientation,
            seed
        });
        console.log('[Gemini][Layout] Prompt length:', promptText.length, 'chars');
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
        // when the payload contains characters with code point > 255 (e.g. em-dash U+2014)
        const bodyBuffer = Buffer.from(JSON.stringify(geminiPayload), 'utf8');
        console.log('[Gemini][Layout] Calling Gemini API...');
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
            console.error(`[Gemini][Layout] HTTP ${resp.status}:`, err.slice(0, 400));
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(FALLBACK_TRIGGER);
        }
        const data = await resp.json();
        console.log('[Gemini][Layout] Raw response:', JSON.stringify(data).slice(0, 300));
        const resParts = data?.candidates?.[0]?.content?.parts || [];
        const textPart = resParts.find((p)=>typeof p.text === 'string');
        if (!textPart?.text) {
            console.error('[Gemini][Layout] No text in response:', JSON.stringify(data).slice(0, 300));
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(FALLBACK_TRIGGER);
        }
        let html = textPart.text.replace(/^```html[\s\S]*?(\n|$)/i, '').replace(/^```[\s\S]*?(\n|$)/i, '').replace(/```\s*$/i, '').trim();
        console.log('[Gemini][Layout] Cleaned HTML (first 300):', html.slice(0, 300));
        if (!html.startsWith('<')) {
            console.error('[Gemini][Layout] Response not HTML:', html.slice(0, 200));
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(FALLBACK_TRIGGER);
        }
        console.log(`[Gemini][Layout] OK | seed=${seed.slice(0, 8)} | ${html.length} chars`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            isHtmlPoster: true,
            html,
            seed
        });
    } catch (err) {
        console.error('[Gemini][Layout] Server error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(FALLBACK_TRIGGER);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0zuvl.7._.js.map