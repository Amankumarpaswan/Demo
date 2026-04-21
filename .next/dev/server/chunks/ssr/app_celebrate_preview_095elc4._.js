module.exports = [
"[project]/app/celebrate/preview/posterRenderer.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

//app/celebrate/preview/posterRenderer.ts
__turbopack_context__.s([
    "generatePosterCanvas",
    ()=>generatePosterCanvas
]);
// Intelligent Text-Balancing Helper
const getIntelligentFontSize = (text, isTitle, defaultSize)=>{
    if (defaultSize) return defaultSize;
    const count = text?.length || 0;
    if (isTitle) {
        if (count <= 15) return 65;
        if (count <= 35) return 45;
        return 36;
    } else {
        if (count <= 50) return 28;
        if (count <= 120) return 24;
        return 18;
    }
};
const wrapTextToArray = (ctx, text, maxWidth)=>{
    if (!text) return [];
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0] || '';
    for(let i = 1; i < words.length; i++){
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
};
// ═══════════════════════════════════════════════════════════════════
// FIXED LAYOUT ENGINE v5  —  12 Reference-Based Layouts
//
// All frame positions extracted from 12 professional reference designs
// converted from percentage to pixel center-coordinates (1080×1920).
//
// AI provides: background colors, borderColor, text colors/content.
// Frame x, y, w, h, rotation = ALWAYS from this hardcoded table.
// Text y positions = ALWAYS from this hardcoded table.
// ═══════════════════════════════════════════════════════════════════
const CW5 = 1080;
const clamp5 = (v, lo, hi)=>Math.max(lo, Math.min(hi, v));
// Each layout: frames[] with pixel center-coords + texts[] with y positions
// Text x is always CW5/2 (centered) except Layout 1, 6, 9 (right-side text)
const LAYOUT_DEFS = [
    null,
    // ── Layout 1: POLAROID_VERTICAL_STACK_WITH_BG_PHOTO ─────────────
    // 3 frames stacked left, text on right side
    {
        frames: [
            {
                x: 248,
                y: 346,
                w: 389,
                h: 538,
                rotation: 0
            },
            {
                x: 238,
                y: 902,
                w: 410,
                h: 538,
                rotation: 0
            },
            {
                x: 243,
                y: 1459,
                w: 378,
                h: 538,
                rotation: 0
            }
        ],
        texts: [
            {
                contentKey: 'title',
                x: 820,
                y: 220,
                fontSize: 72,
                align: 'center',
                maxWidth: 420
            },
            {
                contentKey: 'relationName',
                x: 820,
                y: 380,
                fontSize: 52,
                align: 'center',
                maxWidth: 420
            },
            {
                contentKey: 'subtitle',
                x: 820,
                y: 1820,
                fontSize: 28,
                align: 'center',
                maxWidth: 420
            }
        ]
    },
    // ── Layout 2: SCATTERED_POLAROIDS_CARD_FAN ───────────────────────
    // 4 scattered rotated frames, text bottom strip
    {
        frames: [
            {
                x: 308,
                y: 384,
                w: 400,
                h: 576,
                rotation: -10
            },
            {
                x: 702,
                y: 365,
                w: 432,
                h: 614,
                rotation: 5
            },
            {
                x: 227,
                y: 1094,
                w: 389,
                h: 576,
                rotation: -15
            },
            {
                x: 637,
                y: 1258,
                w: 454,
                h: 672,
                rotation: 8
            }
        ],
        texts: [
            {
                contentKey: 'title',
                x: 540,
                y: 1680,
                fontSize: 76,
                align: 'center',
                maxWidth: 900
            },
            {
                contentKey: 'relationName',
                x: 540,
                y: 1790,
                fontSize: 48,
                align: 'center',
                maxWidth: 900
            },
            {
                contentKey: 'subtitle',
                x: 540,
                y: 1876,
                fontSize: 26,
                align: 'center',
                maxWidth: 900
            }
        ]
    },
    // ── Layout 3: CLEAN_GRID_2x2_CENTER_TEXT_BAND ───────────────────
    // 2 top + 2 bottom, text in center band
    {
        frames: [
            {
                x: 302,
                y: 365,
                w: 454,
                h: 538,
                rotation: 0
            },
            {
                x: 778,
                y: 365,
                w: 454,
                h: 538,
                rotation: 0
            },
            {
                x: 302,
                y: 1440,
                w: 454,
                h: 576,
                rotation: 0
            },
            {
                x: 778,
                y: 1440,
                w: 454,
                h: 576,
                rotation: 0
            }
        ],
        texts: [
            {
                contentKey: 'title',
                x: 540,
                y: 840,
                fontSize: 88,
                align: 'center',
                maxWidth: 900
            },
            {
                contentKey: 'relationName',
                x: 540,
                y: 990,
                fontSize: 56,
                align: 'center',
                maxWidth: 900
            },
            {
                contentKey: 'subtitle',
                x: 540,
                y: 1100,
                fontSize: 30,
                align: 'center',
                maxWidth: 860
            }
        ]
    },
    // ── Layout 4: ASYMMETRIC_TWO_COLUMN_WITH_HERO ───────────────────
    // Left: 2 stacked, Right: 1 tall hero. Text bottom.
    {
        frames: [
            {
                x: 275,
                y: 490,
                w: 378,
                h: 672,
                rotation: 0
            },
            {
                x: 761,
                y: 758,
                w: 486,
                h: 1056,
                rotation: 0
            },
            {
                x: 275,
                y: 1238,
                w: 378,
                h: 634,
                rotation: 0
            }
        ],
        texts: [
            {
                contentKey: 'title',
                x: 540,
                y: 1680,
                fontSize: 76,
                align: 'center',
                maxWidth: 900
            },
            {
                contentKey: 'relationName',
                x: 540,
                y: 1790,
                fontSize: 52,
                align: 'center',
                maxWidth: 900
            },
            {
                contentKey: 'subtitle',
                x: 540,
                y: 1878,
                fontSize: 26,
                align: 'center',
                maxWidth: 900
            }
        ]
    },
    // ── Layout 5: ORGANIC_SCATTERED_MULTI_SIZE ──────────────────────
    // 6 frames organic, text top-left and bottom-left open areas
    {
        frames: [
            {
                x: 275,
                y: 634,
                w: 378,
                h: 422,
                rotation: 0
            },
            {
                x: 745,
                y: 442,
                w: 518,
                h: 576,
                rotation: 0
            },
            {
                x: 205,
                y: 1027,
                w: 238,
                h: 288,
                rotation: 0
            },
            {
                x: 475,
                y: 1056,
                w: 302,
                h: 346,
                rotation: 2
            },
            {
                x: 281,
                y: 1421,
                w: 346,
                h: 422,
                rotation: 0
            },
            {
                x: 702,
                y: 1536,
                w: 324,
                h: 384,
                rotation: 0
            }
        ],
        texts: [
            {
                contentKey: 'title',
                x: 270,
                y: 120,
                fontSize: 72,
                align: 'center',
                maxWidth: 500
            },
            {
                contentKey: 'relationName',
                x: 270,
                y: 240,
                fontSize: 48,
                align: 'center',
                maxWidth: 500
            },
            {
                contentKey: 'subtitle',
                x: 270,
                y: 1820,
                fontSize: 26,
                align: 'center',
                maxWidth: 500
            }
        ]
    },
    // ── Layout 6: DARK_MOODBOARD_ASYMMETRIC_OVERLAP ─────────────────
    // 5 frames asymmetric, bold heading top-right, footer bottom
    {
        frames: [
            {
                x: 232,
                y: 576,
                w: 356,
                h: 576,
                rotation: 0
            },
            {
                x: 616,
                y: 557,
                w: 324,
                h: 422,
                rotation: 0
            },
            {
                x: 443,
                y: 854,
                w: 346,
                h: 480,
                rotation: 0
            },
            {
                x: 232,
                y: 1238,
                w: 292,
                h: 480,
                rotation: 0
            },
            {
                x: 616,
                y: 1267,
                w: 410,
                h: 422,
                rotation: 0
            }
        ],
        texts: [
            {
                contentKey: 'title',
                x: 810,
                y: 90,
                fontSize: 82,
                align: 'center',
                maxWidth: 440
            },
            {
                contentKey: 'relationName',
                x: 810,
                y: 220,
                fontSize: 52,
                align: 'center',
                maxWidth: 440
            },
            {
                contentKey: 'subtitle',
                x: 540,
                y: 1840,
                fontSize: 28,
                align: 'center',
                maxWidth: 900
            }
        ]
    },
    // ── Layout 7: STAGGERED_CASCADE_DIAGONAL ────────────────────────
    // 4 staircase frames. Minimal text at very bottom.
    {
        frames: [
            {
                x: 297,
                y: 442,
                w: 378,
                h: 576,
                rotation: 0
            },
            {
                x: 518,
                y: 797,
                w: 432,
                h: 634,
                rotation: 0
            },
            {
                x: 254,
                y: 1248,
                w: 400,
                h: 576,
                rotation: 0
            },
            {
                x: 659,
                y: 1373,
                w: 410,
                h: 634,
                rotation: 0
            }
        ],
        texts: [
            {
                contentKey: 'title',
                x: 540,
                y: 100,
                fontSize: 76,
                align: 'center',
                maxWidth: 900
            },
            {
                contentKey: 'relationName',
                x: 540,
                y: 220,
                fontSize: 52,
                align: 'center',
                maxWidth: 900
            },
            {
                contentKey: 'subtitle',
                x: 540,
                y: 1870,
                fontSize: 26,
                align: 'center',
                maxWidth: 900
            }
        ]
    },
    // ── Layout 8: TILTED_STACK_PLAYFUL ──────────────────────────────
    // 3 large tilted frames. Text top-right gap + bottom footer.
    {
        frames: [
            {
                x: 400,
                y: 403,
                w: 626,
                h: 576,
                rotation: -3
            },
            {
                x: 513,
                y: 883,
                w: 486,
                h: 538,
                rotation: 5
            },
            {
                x: 410,
                y: 1382,
                w: 562,
                h: 538,
                rotation: -2
            }
        ],
        texts: [
            {
                contentKey: 'title',
                x: 900,
                y: 140,
                fontSize: 72,
                align: 'right',
                maxWidth: 340
            },
            {
                contentKey: 'relationName',
                x: 900,
                y: 260,
                fontSize: 48,
                align: 'right',
                maxWidth: 340
            },
            {
                contentKey: 'subtitle',
                x: 540,
                y: 1860,
                fontSize: 26,
                align: 'center',
                maxWidth: 900
            }
        ]
    },
    // ── Layout 9: CLEAN_MAGAZINE_EDITORIAL_3ROW ─────────────────────
    // 5 frames (missing right-center = text block). Text in right column.
    {
        frames: [
            {
                x: 292,
                y: 365,
                w: 475,
                h: 576,
                rotation: 0
            },
            {
                x: 788,
                y: 365,
                w: 475,
                h: 576,
                rotation: 0
            },
            {
                x: 292,
                y: 979,
                w: 475,
                h: 538,
                rotation: 0
            },
            {
                x: 292,
                y: 1574,
                w: 475,
                h: 538,
                rotation: 0
            },
            {
                x: 788,
                y: 1574,
                w: 475,
                h: 538,
                rotation: 0
            }
        ],
        texts: [
            {
                contentKey: 'title',
                x: 824,
                y: 880,
                fontSize: 78,
                align: 'center',
                maxWidth: 440
            },
            {
                contentKey: 'relationName',
                x: 824,
                y: 1020,
                fontSize: 52,
                align: 'center',
                maxWidth: 440
            },
            {
                contentKey: 'subtitle',
                x: 824,
                y: 1140,
                fontSize: 28,
                align: 'center',
                maxWidth: 440
            }
        ]
    },
    // ── Layout 10: SCRAPBOOK_MIXED_MEDIA ────────────────────────────
    // 3 slightly rotated frames. Text in open center-right + bottom-left.
    {
        frames: [
            {
                x: 302,
                y: 653,
                w: 432,
                h: 614,
                rotation: -2
            },
            {
                x: 680,
                y: 499,
                w: 324,
                h: 422,
                rotation: 3
            },
            {
                x: 729,
                y: 1286,
                w: 378,
                h: 576,
                rotation: 0
            }
        ],
        texts: [
            {
                contentKey: 'title',
                x: 740,
                y: 900,
                fontSize: 76,
                align: 'center',
                maxWidth: 500
            },
            {
                contentKey: 'relationName',
                x: 740,
                y: 1040,
                fontSize: 52,
                align: 'center',
                maxWidth: 500
            },
            {
                contentKey: 'subtitle',
                x: 270,
                y: 1800,
                fontSize: 28,
                align: 'center',
                maxWidth: 500
            }
        ]
    },
    // ── Layout 11: POLAROID_GRID_OVER_FULL_PHOTO ────────────────────
    // 4 polaroids on full-bg photo. Large text bottom open area.
    {
        frames: [
            {
                x: 259,
                y: 394,
                w: 346,
                h: 480,
                rotation: -3
            },
            {
                x: 734,
                y: 336,
                w: 346,
                h: 480,
                rotation: 4
            },
            {
                x: 270,
                y: 1037,
                w: 324,
                h: 461,
                rotation: -2
            },
            {
                x: 713,
                y: 1085,
                w: 346,
                h: 480,
                rotation: 3
            }
        ],
        texts: [
            {
                contentKey: 'title',
                x: 540,
                y: 1580,
                fontSize: 88,
                align: 'center',
                maxWidth: 900
            },
            {
                contentKey: 'relationName',
                x: 540,
                y: 1730,
                fontSize: 56,
                align: 'center',
                maxWidth: 900
            },
            {
                contentKey: 'subtitle',
                x: 540,
                y: 1860,
                fontSize: 28,
                align: 'center',
                maxWidth: 900
            }
        ]
    },
    // ── Layout 12: INVERTED_TRIANGLE_FESTIVE ────────────────────────
    // 1 hero top + 2 below forming V-shape. Large text bottom open area.
    {
        frames: [
            {
                x: 459,
                y: 518,
                w: 594,
                h: 576,
                rotation: 0
            },
            {
                x: 275,
                y: 1046,
                w: 378,
                h: 480,
                rotation: -5
            },
            {
                x: 675,
                y: 1085,
                w: 378,
                h: 480,
                rotation: 5
            }
        ],
        texts: [
            {
                contentKey: 'title',
                x: 540,
                y: 1450,
                fontSize: 92,
                align: 'center',
                maxWidth: 940
            },
            {
                contentKey: 'relationName',
                x: 540,
                y: 1620,
                fontSize: 60,
                align: 'center',
                maxWidth: 900
            },
            {
                contentKey: 'subtitle',
                x: 540,
                y: 1840,
                fontSize: 30,
                align: 'center',
                maxWidth: 860
            }
        ]
    }
];
// ── MASTER: applyFixedLayout ──────────────────────────────────────
// Called before render. Picks layout from styleConfig.layoutStyleId.
// Overwrites ALL frame positions and text positions with pre-calculated values.
// Preserves AI-provided colors, border styles, and text content/colors.
const applyFixedLayout = (blueprint, layoutStyleId)=>{
    if (!blueprint) return blueprint;
    try {
        const lid = clamp5(layoutStyleId, 1, 12);
        const def = LAYOUT_DEFS[lid];
        if (!def) {
            console.warn(`⚠️ No layout def for id=${lid}`);
            return blueprint;
        }
        console.log(`🧠 Fixed Layout Engine v5: applying layout ${lid}...`);
        // ── Apply photo frames ───────────────────────────────────────
        const aiFrames = blueprint.imageFrames || [];
        blueprint.imageFrames = def.frames.map((f, i)=>{
            const ai = aiFrames[i] || aiFrames[0] || {};
            return {
                shape: ai.shape || 'rectangle',
                borderColor: ai.borderColor || '#FFFFFF',
                borderWidth: clamp5(ai.borderWidth || 14, 8, 22),
                shadow: true,
                x: f.x,
                y: f.y,
                w: f.w,
                h: f.h,
                rotation: f.rotation
            };
        });
        // ── Apply text blocks ────────────────────────────────────────
        const aiTexts = blueprint.textBlocks || [];
        const maxWDef = CW5 - 120;
        blueprint.textBlocks = def.texts.map((td)=>{
            const ai = aiTexts.find((t)=>t.contentKey === td.contentKey) || {};
            const text = (ai.text || '').trim();
            if (!text) return null;
            return {
                contentKey: td.contentKey,
                text,
                x: td.x,
                y: td.y,
                fontSize: td.fontSize,
                fontFamily: ai.fontFamily || 'sans-serif',
                color: ai.color || '#FFFFFF',
                align: td.align,
                maxWidth: td.maxWidth || maxWDef,
                isBold: ai.isBold || false,
                isItalic: ai.isItalic || false
            };
        }).filter(Boolean);
        console.log(`✅ Layout ${lid} applied: ${def.frames.length} frames, ${blueprint.textBlocks.length} text blocks`);
    } catch (err) {
        console.warn("⚠️ Fixed Layout Engine v5 error (non-fatal):", err);
    }
    return blueprint;
};
// --- JSON DYNAMIC RENDERING ENGINE ---
const renderDynamicJSON = (ctx, data, blueprint)=>{
    // 1. Draw Background
    if (blueprint.background.type === 'gradient' && blueprint.background.color2) {
        const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        grad.addColorStop(0, blueprint.background.color1 || '#FFFFFF');
        grad.addColorStop(1, blueprint.background.color2 || '#F0F0F0');
        ctx.fillStyle = grad;
    } else {
        ctx.fillStyle = blueprint.background.color1 || '#FFFFFF';
    }
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // 2. Draw Decorative Shapes
    if (blueprint.decorations && Array.isArray(blueprint.decorations)) {
        blueprint.decorations.forEach((dec)=>{
            ctx.save();
            ctx.globalAlpha = dec.alpha || 1.0;
            ctx.fillStyle = dec.color || '#000000';
            ctx.translate(dec.x || 0, dec.y || 0);
            if (dec.rotation) ctx.rotate(dec.rotation * Math.PI / 180);
            ctx.beginPath();
            if (dec.type === 'circle' && dec.radius) {
                ctx.arc(0, 0, dec.radius, 0, Math.PI * 2);
            } else if (dec.type === 'rect' && dec.w && dec.h) {
                ctx.rect(-dec.w / 2, -dec.h / 2, dec.w, dec.h);
            }
            ctx.fill();
            ctx.restore();
        });
    }
    // 3. Draw Images inside Frames
    if (blueprint.imageFrames && Array.isArray(blueprint.imageFrames) && data.photos && data.photos.length > 0) {
        blueprint.imageFrames.forEach((frame, i)=>{
            // Loop photos if AI generated more frames than photos
            const img = data.photos[i % data.photos.length];
            if (!img) return;
            const { x, y, w, h, rotation = 0, borderWidth = 0, borderColor = "#FFF", shadow = false } = frame;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation * Math.PI / 180);
            // Shadow
            if (shadow) {
                ctx.shadowColor = "rgba(0,0,0,0.2)";
                ctx.shadowBlur = 20;
                ctx.shadowOffsetX = 5;
                ctx.shadowOffsetY = 10;
            }
            // Border/Background
            ctx.fillStyle = borderColor;
            ctx.fillRect(-w / 2, -h / 2, w, h);
            ctx.shadowColor = "transparent"; // Reset shadow for inner drawing
            // Inner Image Area
            const innerW = w - borderWidth * 2;
            const innerH = h - borderWidth * 2;
            // Object-fit Cover Logic
            const imgRatio = img.naturalWidth / img.naturalHeight;
            const targetRatio = innerW / innerH;
            let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
            if (imgRatio > targetRatio) {
                sw = sh * targetRatio;
                sx = (img.naturalWidth - sw) / 2;
            } else {
                sh = sw / targetRatio;
                sy = (img.naturalHeight - sh) / 2;
            }
            ctx.beginPath();
            ctx.rect(-innerW / 2, -innerH / 2, innerW, innerH);
            ctx.clip();
            ctx.drawImage(img, sx, sy, sw, sh, -innerW / 2, -innerH / 2, innerW, innerH);
            ctx.restore();
        });
    }
    // 4. Draw Text Blocks dynamically
    if (blueprint.textBlocks && Array.isArray(blueprint.textBlocks)) {
        blueprint.textBlocks.forEach((tb)=>{
            if (!tb.text || tb.text.trim() === '') return;
            ctx.save();
            const style = tb.isItalic ? 'italic ' : '';
            const weight = tb.isBold ? 'bold ' : 'normal ';
            ctx.font = `${style}${weight}${tb.fontSize || 30}px ${tb.fontFamily || 'sans-serif'}`;
            ctx.fillStyle = tb.color || '#000000';
            ctx.textAlign = tb.align || 'center';
            ctx.textBaseline = 'middle';
            const lines = wrapTextToArray(ctx, tb.text, tb.maxWidth || ctx.canvas.width - 100);
            const lineHeight = (tb.fontSize || 30) * 1.4;
            let startY = tb.y;
            lines.forEach((line, index)=>{
                ctx.fillText(line, tb.x, startY + index * lineHeight);
            });
            ctx.restore();
        });
    }
};
// --- FALLBACK A: 5-Photo Permanent Hardcoded Design (With Text Balancing) ---
const drawSmartPolaroid = (ctx, img, x, y, w, h, rotateDeg)=>{
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(rotateDeg * Math.PI / 180);
    ctx.translate(-w / 2, -h / 2);
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, w, h);
    const padding = 20;
    const bottomChin = 80;
    const imgW = w - padding * 2;
    const imgH = h - padding - bottomChin;
    ctx.shadowColor = "transparent";
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const targetRatio = imgW / imgH;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (imgRatio > targetRatio) {
        sw = sh * targetRatio;
        sx = (img.naturalWidth - sw) / 2;
    } else {
        sh = sw / targetRatio;
        sy = (img.naturalHeight - sh) / 2;
    }
    ctx.beginPath();
    ctx.rect(padding, padding, imgW, imgH);
    ctx.clip();
    ctx.drawImage(img, sx, sy, sw, sh, padding, padding, imgW, imgH);
    ctx.restore();
};
const renderFallbackLayout1 = async (ctx, data)=>{
    ctx.canvas.width = 1080;
    ctx.canvas.height = 1920;
    ctx.fillStyle = '#F9F5EB';
    ctx.fillRect(0, 0, 1080, 1920);
    ctx.fillStyle = '#D4AF37';
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(150, 200, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(900, 1600, 400, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
    const pW = 800, pH = 800, pX = 140, pY = 560;
    ctx.shadowColor = "rgba(0,0,0,0.1)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 15;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(pX, pY, pW, pH);
    ctx.shadowColor = "transparent";
    const layouts = {
        2: [
            [
                100,
                200,
                450,
                550,
                -5
            ],
            [
                550,
                1100,
                450,
                550,
                5
            ]
        ],
        3: [
            [
                80,
                150,
                400,
                500,
                -8
            ],
            [
                600,
                150,
                400,
                500,
                8
            ],
            [
                340,
                1200,
                400,
                500,
                -2
            ]
        ],
        4: [
            [
                60,
                100,
                380,
                480,
                -10
            ],
            [
                640,
                100,
                380,
                480,
                10
            ],
            [
                60,
                1300,
                380,
                480,
                5
            ],
            [
                640,
                1300,
                380,
                480,
                -5
            ]
        ],
        5: [
            [
                50,
                80,
                350,
                450,
                -12
            ],
            [
                680,
                80,
                350,
                450,
                12
            ],
            [
                50,
                1350,
                350,
                450,
                8
            ],
            [
                680,
                1350,
                350,
                450,
                -8
            ],
            [
                365,
                100,
                350,
                450,
                0
            ]
        ]
    };
    let images = data.photos || [];
    if (images.length === 1) images = [
        images[0],
        images[0]
    ]; // Duplicate safely for layout
    const imgCount = Math.max(2, Math.min(5, images.length));
    images.slice(0, imgCount).forEach((img, i)=>{
        if (layouts[imgCount][i]) {
            const [x, y, w, h, r] = layouts[imgCount][i];
            drawSmartPolaroid(ctx, img, x, y, w, h, r);
        }
    });
    const centerX = 1080 / 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const tSize = getIntelligentFontSize(data.title, true);
    const sSize = getIntelligentFontSize(data.subtitle, false);
    const relSize = 36;
    ctx.font = `italic ${sSize}px Georgia, serif`;
    const msgLines = wrapTextToArray(ctx, data.subtitle || '', pW - 100);
    let totalH = tSize;
    if (data.relationName) totalH += 40 + relSize;
    if (data.termLine) totalH += 30 + 20;
    if (msgLines.length > 0) totalH += 50 + msgLines.length * (sSize * 1.5);
    let currentY = pY + pH / 2 - totalH / 2 + tSize / 2;
    ctx.fillStyle = '#1A1A1A';
    ctx.font = `bold ${tSize}px "Helvetica Neue", sans-serif`;
    ctx.fillText(data.title || '', centerX, currentY);
    if (data.relationName) {
        currentY += 40 + relSize / 2;
        ctx.fillStyle = '#D4AF37';
        ctx.font = `bold ${relSize}px sans-serif`;
        ctx.fillText(data.relationName.toUpperCase(), centerX, currentY);
    }
    if (data.termLine) {
        currentY += 30 + 10;
        ctx.fillStyle = '#666666';
        ctx.font = `600 20px sans-serif`;
        ctx.fillText(data.termLine, centerX, currentY);
    }
    if (msgLines.length > 0) {
        currentY += 50 + sSize * 0.75;
        ctx.fillStyle = '#4A4A4A';
        ctx.font = `italic ${sSize}px Georgia, serif`;
        for (let line of msgLines){
            ctx.fillText(line, centerX, currentY);
            currentY += sSize * 1.5;
        }
    }
};
// --- FALLBACK B: 1-Photo Permanent Hardcoded Design (With Text Balancing) ---
const renderFallbackLayout2 = async (ctx, data)=>{
    ctx.canvas.width = 1080;
    ctx.canvas.height = 1080;
    ctx.fillStyle = '#F4F1EC';
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = '#7D95A5';
    ctx.beginPath();
    ctx.ellipse(0, 0, 450, 350, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#B3A99D';
    ctx.beginPath();
    ctx.ellipse(1080, 1080, 400, 350, 0, 0, Math.PI * 2);
    ctx.fill();
    const mX = 90, mY = 90, mW = 900, mH = 900, imgH = mH * 0.65;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 16;
    ctx.strokeRect(mX - 8, mY - 8, mW + 16, mH + 16);
    if (data.photos && data.photos[0]) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(mX, mY, mW, imgH);
        ctx.clip();
        const imgRatio = data.photos[0].width / data.photos[0].height;
        let sx = 0, sy = 0, sw = data.photos[0].width, sh = data.photos[0].height;
        if (imgRatio > mW / imgH) {
            sw = sh * (mW / imgH);
            sx = (data.photos[0].width - sw) / 2;
        } else {
            sh = sw / (mW / imgH);
            sy = (data.photos[0].height - sh) / 2;
        }
        ctx.drawImage(data.photos[0], sx, sy, sw, sh, mX, mY, mW, imgH);
        ctx.restore();
    } else {
        ctx.fillStyle = '#E5E5E5';
        ctx.fillRect(mX, mY, mW, imgH);
    }
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(mX, mY + imgH, mW, mH - imgH);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const tSize = getIntelligentFontSize(data.title, true);
    const sSize = getIntelligentFontSize(data.subtitle, false);
    ctx.font = `italic ${sSize}px "Georgia", serif`;
    const msgLines = wrapTextToArray(ctx, data.subtitle || '', mW - 100);
    const panelCenterY = mY + imgH + (mH - imgH) / 2;
    let totalH = tSize + 30 + msgLines.length * (sSize * 1.5);
    let currentY = panelCenterY - totalH / 2 + tSize / 2;
    ctx.fillStyle = '#2B3A4A';
    ctx.font = `bold ${tSize}px sans-serif`;
    ctx.fillText(data.title || '', mX + mW / 2, currentY);
    currentY += 30 + sSize * 0.75;
    ctx.fillStyle = '#4A4A4A';
    ctx.font = `italic ${sSize}px "Georgia", serif`;
    for (let line of msgLines){
        ctx.fillText(line, mX + mW / 2, currentY);
        currentY += sSize * 1.5;
    }
};
const generatePosterCanvas = async (canvas, layoutType, data, styleConfig)=>{
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas failed');
    // 1. Try JSON Dynamic Rendering First
    if (styleConfig && styleConfig.isDynamic && styleConfig.blueprint) {
        try {
            console.log("🚀 Executing dynamic AI JSON architecture...");
            if (layoutType === 'LAYOUT_1_COLLAGE') {
                ctx.canvas.width = 1080;
                ctx.canvas.height = 1920;
            } else {
                ctx.canvas.width = 1080;
                ctx.canvas.height = 1080;
            }
            // Run intelligent layout engine BEFORE rendering
            // Apply fixed pre-calculated layout (v4 engine)
            // Apply fixed layout using layoutStyleId from API response
            const layoutId = styleConfig.layoutStyleId || 1;
            const optimizedBlueprint = applyFixedLayout(styleConfig.blueprint, layoutId);
            renderDynamicJSON(ctx, data, optimizedBlueprint);
            return canvas;
        } catch (err) {
            console.error("⚠️ AI JSON execution failed. Engaging Fallback Systems.", err);
        // Let it fall through to hardcoded designs
        }
    }
    // 2. Fallback Mechanism
    console.log(`🛡️ Using Permanent Hardcoded Fallback for ${layoutType}`);
    if (layoutType === 'LAYOUT_1_COLLAGE') {
        await renderFallbackLayout1(ctx, data);
    } else if (layoutType === 'LAYOUT_2_JAYANTI') {
        await renderFallbackLayout2(ctx, data);
    }
    return canvas;
};
}),
"[project]/app/celebrate/preview/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FreeStoryMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/share-2.js [app-ssr] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-2.js [app-ssr] (ecmascript) <export default as Volume2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__VolumeX$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-x.js [app-ssr] (ecmascript) <export default as VolumeX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gift.js [app-ssr] (ecmascript) <export default as Gift>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$home$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/home.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-ssr] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$qr$2d$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__QrCode$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/qr-code.js [app-ssr] (ecmascript) <export default as QrCode>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-ssr] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-2.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-ssr] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/canvas-confetti/dist/confetti.module.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$celebrate$2f$preview$2f$posterRenderer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/celebrate/preview/posterRenderer.ts [app-ssr] (ecmascript)");
// html-to-image: DOM-to-image capture (install: npm install html-to-image)
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$to$2d$image$2f$es$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/html-to-image/es/index.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
const MOBILE_REF = {
    width: 430,
    height: 932
};
const MOBILE_DIAGONAL = Math.sqrt(MOBILE_REF.width ** 2 + MOBILE_REF.height ** 2);
const BASE = {
    envelopeIconSize: 80,
    envelopeTextSize: 14,
    envelopeTextMarginTop: 16,
    countdownFontSize: 160,
    topPadding: 24,
    topGap: 12,
    topButtonSize: 40,
    topIconSize: 18,
    creatorPillPadX: 16,
    creatorPillPadY: 4,
    creatorPillGap: 8,
    creatorAvatarSize: 32,
    creatorBySize: 8,
    creatorByMargin: 2,
    creatorNameSize: 12,
    creatorNameMaxWidth: 80,
    overlayHeightPercent: 40,
    contentPadX: 24,
    contentPadBottom: 144,
    titleSize: 12,
    titleMarginBottom: 4,
    titlePadBottom: 4,
    nameSize: 36,
    nameMarginBottom: 8,
    subtitleSize: 10,
    subtitlePadX: 12,
    subtitlePadY: 4,
    subtitleMarginBottom: 12,
    subtitleRadius: 9999,
    messageSize: 14,
    messageMaxWidth: 320,
    slideshowBottom: 96,
    slideshowPadX: 24,
    slideshowBubblePadX: 16,
    slideshowBubblePadY: 6,
    slideshowFontSize: 12,
    slideshowMaxWidth: 280,
    slideshowRadius: 9999,
    slideshowAnimOffset: 10,
    actionBottom: 24,
    actionGap: 32,
    actionIconSize: 24,
    actionLabelSize: 10,
    actionItemGap: 4,
    balloonWidth: 55,
    balloonHeight: 70,
    balloonKnotSize: 10,
    balloonKnotOffset: 8,
    balloonSwayX: 12,
    balloonSwayY: 6,
    balloonSpawnY: 100,
    balloonHeightVariations: [
        0.156,
        0.216,
        0.125,
        0.260,
        0.161,
        0.244,
        0.205,
        0.122
    ],
    balloonsPerSideMobile: 2,
    balloonShadowInset1: 8,
    balloonShadowInset2: 10,
    balloonShadowInset3: 20,
    balloonShadowInset4: 5,
    balloonShadowInset5: 15,
    balloonShadowOuter1: 8,
    balloonShadowOuter2: 25,
    balloonShadowGlow: 15,
    balloonHighlight1Blur: 1.5,
    balloonHighlight2Blur: 2,
    balloonHighlight3Blur: 1,
    stringWidth: 1.5,
    stringOriginY: 80,
    stringSway: 20,
    glitterCount: 45,
    glitterCountSmall: 20,
    glitterGravity: 0.08,
    modalPad: 24,
    modalTitleSize: 20,
    modalTitleMargin: 24,
    qrContainerSize: 220,
    qrContainerPad: 8,
    qrContainerMargin: 24,
    qrLoaderSize: 40,
    modalBtnPad: 12,
    modalBtnSize: 14,
    modalBtnIconSize: 18,
    modalBtnGap: 8,
    modalCloseMargin: 16,
    modalCloseSize: 14,
    namePromptPad: 40,
    namePromptGap: 32,
    namePromptAvatarSize: 80,
    namePromptIconSize: 40,
    namePromptTitleSize: 24,
    namePromptSubSize: 14,
    namePromptInputPad: 16,
    namePromptInputSize: 18,
    namePromptBtnPad: 16,
    namePromptBtnSize: 18,
    commentsHeaderPad: 16,
    commentsHeaderSize: 18,
    commentsHeaderIconSize: 20,
    commentsHeaderGap: 8,
    commentsHeaderClosePad: 8,
    commentsHeaderCloseSize: 20,
    commentsListPad: 16,
    commentsListGap: 16,
    commentsEmptyIconSize: 48,
    commentsEmptyGap: 8,
    commentsEmptySize: 14,
    commentAvatarSize: 40,
    commentAvatarFontSize: 14,
    commentItemGap: 12,
    commentBubblePad: 12,
    commentNameSize: 14,
    commentTimeSize: 10,
    commentMsgSize: 14,
    commentInputAreaPad: 16,
    commentInputGap: 12,
    commentInputPadX: 20,
    commentInputPadY: 12,
    commentInputSize: 14,
    commentSendSize: 48,
    commentSendIconSize: 20
};
const ACHIEVEMENT_MILESTONES = [
    {
        level: 1,
        required: 100,
        name: "Beginner",
        color: "#CD7F32"
    },
    {
        level: 2,
        required: 300,
        name: "Enthusiast",
        color: "#C0C0C0"
    },
    {
        level: 3,
        required: 600,
        name: "Expert",
        color: "#FFD700"
    },
    {
        level: 4,
        required: 4600,
        name: "Champion",
        color: "#E5E4E2"
    },
    {
        level: 5,
        required: 9600,
        name: "Master",
        color: "#B9F2FF"
    },
    {
        level: 6,
        required: 15600,
        name: "Legend",
        color: "#9966CC"
    },
    {
        level: 7,
        required: 85600,
        name: "Titan",
        color: "#FF6347"
    },
    {
        level: 8,
        required: 165600,
        name: "Mythic",
        color: "#FF1493"
    },
    {
        level: 9,
        required: 255600,
        name: "Ultimate",
        color: "#00CED1"
    },
    {
        level: 10,
        required: 255601,
        name: "Limitless",
        color: "#d4af37",
        special: true
    }
];
const BIRTHDAY_SELF_LINES = [
    "It's my birthday",
    "My birthday today",
    "Birthday day today",
    "Birthday time",
    "My special day",
    "Birthday vibes",
    "Birthday mood",
    "Feeling birthday",
    "Born today",
    "My big day"
];
let birthdayLineIndex = 0;
const useProportionalScale = ()=>{
    const [scale, setScale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const calc = ()=>{
            const d = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
            setScale(Math.max(1, Math.min(d / MOBILE_DIAGONAL, 2.5)));
        };
        calc();
        window.addEventListener('resize', calc);
        return ()=>window.removeEventListener('resize', calc);
    }, []);
    return scale;
};
const useScaled = (scale)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const s = {
            ...BASE
        };
        for(const key in BASE){
            if (key === 'balloonHeightVariations') continue;
            s[key] = BASE[key] * scale;
        }
        return s;
    }, [
        scale
    ]);
};
const determineImageFit = (img)=>{
    const W = window.innerWidth;
    const H = window.innerHeight;
    if (W < 768) return 'cover';
    const screenRatio = W / H;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    if (imgRatio < 0.75 && screenRatio > 1.2) return 'contain';
    if (imgRatio > 1.33 && screenRatio < 0.8) return 'contain';
    if (imgRatio > 0.8 && imgRatio < 1.2 && screenRatio > 1.5) return 'contain';
    const wouldCropVertical = imgRatio > screenRatio;
    const cropRatio = wouldCropVertical ? screenRatio / imgRatio : imgRatio / screenRatio;
    return cropRatio >= 0.55 ? 'cover' : 'contain';
};
const formatTime = (iso)=>{
    try {
        return new Date(iso).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch  {
        return '';
    }
};
const getOrdinal = (n)=>{
    const s = [
        'th',
        'st',
        'nd',
        'rd'
    ];
    const v = parseInt(n) || 0;
    return n + (s[(v % 100 - 20) % 10] || s[v % 100] || s[0]);
};
const BALLOON_COLORS = [
    '#FF6B6B',
    '#4ECDC4',
    '#FFE66D',
    '#95E1D3',
    '#F38181',
    '#AA96DA',
    '#FCBAD3',
    '#A8D8EA',
    '#FF9F43',
    '#7BED9F',
    '#70A1FF',
    '#5352ED'
];
const getRandomColor = (exclude)=>{
    let c;
    do {
        c = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    }while (c === exclude)
    return c;
};
const darken = (hex, pct)=>{
    const n = parseInt(hex.replace('#', ''), 16);
    const a = Math.round(2.55 * pct);
    return `#${(1 << 24 | Math.max(0, (n >> 16) - a) << 16 | Math.max(0, (n >> 8 & 0xFF) - a) << 8 | Math.max(0, (n & 0xFF) - a)).toString(16).slice(1)}`;
};
const lighten = (hex, pct)=>{
    const n = parseInt(hex.replace('#', ''), 16);
    const a = Math.round(2.55 * pct);
    return `#${(1 << 24 | Math.min(255, (n >> 16) + a) << 16 | Math.min(255, (n >> 8 & 0xFF) + a) << 8 | Math.min(255, (n & 0xFF) + a)).toString(16).slice(1)}`;
};
const playBalloonPopSound = ()=>{
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const popOsc = audioCtx.createOscillator();
        const popGain = audioCtx.createGain();
        popOsc.type = 'sine';
        popOsc.frequency.setValueAtTime(180, audioCtx.currentTime);
        popOsc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.12);
        popGain.gain.setValueAtTime(1.5, audioCtx.currentTime);
        popGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        const bufferSize = audioCtx.sampleRate * 0.08;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for(let i = 0; i < bufferSize; i++){
            noiseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2.5);
        }
        const noiseSrc = audioCtx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(1.2, audioCtx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 2000;
        noiseFilter.Q.value = 0.5;
        const reverbTime = 1.2;
        const reverbLength = audioCtx.sampleRate * reverbTime;
        const impulseBuffer = audioCtx.createBuffer(2, reverbLength, audioCtx.sampleRate);
        for(let channel = 0; channel < 2; channel++){
            const impulseData = impulseBuffer.getChannelData(channel);
            for(let i = 0; i < reverbLength; i++){
                const decay = Math.pow(1 - i / reverbLength, 2);
                impulseData[i] = (Math.random() * 2 - 1) * decay * 0.5;
            }
        }
        const convolver = audioCtx.createConvolver();
        convolver.buffer = impulseBuffer;
        const dryGain = audioCtx.createGain();
        dryGain.gain.value = 1.0;
        const wetGain = audioCtx.createGain();
        wetGain.gain.value = 0.7;
        const reverbFilter = audioCtx.createBiquadFilter();
        reverbFilter.type = 'lowpass';
        reverbFilter.frequency.value = 4000;
        const master = audioCtx.createGain();
        master.gain.value = 1.5;
        popOsc.connect(popGain);
        popGain.connect(dryGain);
        popGain.connect(convolver);
        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(dryGain);
        noiseGain.connect(convolver);
        convolver.connect(reverbFilter);
        reverbFilter.connect(wetGain);
        dryGain.connect(master);
        wetGain.connect(master);
        master.connect(audioCtx.destination);
        popOsc.start();
        noiseSrc.start();
        popOsc.stop(audioCtx.currentTime + 0.2);
        noiseSrc.stop(audioCtx.currentTime + 0.12);
        setTimeout(()=>audioCtx.close(), 2000);
    } catch (e) {}
};
const PremiumLoader = ({ scale })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 flex items-center justify-center z-[100] bg-black",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
            animate: {
                rotate: 360
            },
            transition: {
                repeat: Infinity,
                duration: 2,
                ease: 'linear'
            },
            style: {
                width: 48 * scale,
                height: 48 * scale,
                borderWidth: 4 * scale
            },
            className: "rounded-full border-[#d4af37] border-t-transparent"
        }, void 0, false, {
            fileName: "[project]/app/celebrate/preview/page.tsx",
            lineNumber: 289,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/celebrate/preview/page.tsx",
        lineNumber: 288,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const triggerProfessionalConfetti = ()=>{
    const isMobile = window.innerWidth < 768;
    const colors = [
        '#FFD700',
        '#FF6B8A',
        '#B388FF',
        '#FF8A80',
        '#FFAB91',
        '#82B1FF',
        '#FF4444',
        '#FFB347',
        '#FF69B4',
        '#00CED1',
        '#7FFF00',
        '#FF6347'
    ];
    const crackerDefaults = {
        particleCount: isMobile ? 80 : 120,
        spread: 70,
        startVelocity: 55,
        decay: 0.92,
        gravity: 1,
        ticks: 400,
        colors,
        disableForReducedMotion: true
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
        ...crackerDefaults,
        angle: 60,
        origin: {
            x: 0,
            y: 1
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
        ...crackerDefaults,
        angle: 120,
        origin: {
            x: 1,
            y: 1
        }
    });
    setTimeout(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
            ...crackerDefaults,
            particleCount: isMobile ? 50 : 80,
            angle: 55,
            spread: 60,
            origin: {
                x: 0.05,
                y: 0.95
            }
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
            ...crackerDefaults,
            particleCount: isMobile ? 50 : 80,
            angle: 125,
            spread: 60,
            origin: {
                x: 0.95,
                y: 0.95
            }
        });
    }, 200);
};
let confettiHasFired = false;
const PopCounter = ({ count, show })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: show && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                scale: 0.5,
                opacity: 0
            },
            animate: {
                scale: 1,
                opacity: 1
            },
            exit: {
                scale: 0.5,
                opacity: 0
            },
            transition: {
                duration: 0.3
            },
            className: "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none",
            style: {
                zIndex: 100
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-bold text-white",
                style: {
                    fontSize: 72,
                    textShadow: '0 2px 20px rgba(0,0,0,0.7), 0 4px 40px rgba(0,0,0,0.4)'
                },
                children: count
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 362,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/app/celebrate/preview/page.tsx",
            lineNumber: 354,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/celebrate/preview/page.tsx",
        lineNumber: 352,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const getCurrentAchievement = (count)=>{
    for(let i = ACHIEVEMENT_MILESTONES.length - 1; i >= 0; i--){
        if (count >= ACHIEVEMENT_MILESTONES[i].required) {
            return ACHIEVEMENT_MILESTONES[i];
        }
    }
    return null;
};
const TrophySVG = ({ color, size = 20, glow = false })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style: glow ? {
            filter: `drop-shadow(0 0 6px ${color})`
        } : {},
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6 2H18V14C18 17.3137 15.3137 20 12 20C8.68629 20 6 17.3137 6 14V2Z",
                fill: color,
                fillOpacity: "0.9"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 389,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6 6H3C3 9.31371 4.34315 11 6 11",
                stroke: color,
                strokeWidth: "1.5",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 390,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M18 6H21C21 9.31371 19.6569 11 18 11",
                stroke: color,
                strokeWidth: "1.5",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 391,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 20V22",
                stroke: color,
                strokeWidth: "1.5",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 392,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8 22H16",
                stroke: color,
                strokeWidth: "1.5",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 393,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 13L10.5 14.5L15 10",
                stroke: "white",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 394,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/celebrate/preview/page.tsx",
        lineNumber: 387,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const LockedBadgeSVG = ({ size = 20 })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 2L14 5H18L15.5 7.5L16.5 11L12 9L7.5 11L8.5 7.5L6 5H10L12 2Z",
                stroke: "#888",
                strokeWidth: "1.2",
                strokeDasharray: "2 1.5",
                fill: "rgba(100,100,100,0.12)",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 400,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "9.5",
                y: "12",
                width: "5",
                height: "4",
                rx: "1",
                fill: "#666",
                fillOpacity: "0.8"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 403,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10.5 12V10.5C10.5 9.4 11.4 8.5 12 8.5C12.6 8.5 13.5 9.4 13.5 10.5V12",
                stroke: "#666",
                strokeWidth: "1.2",
                strokeLinecap: "round",
                fill: "none"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 404,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "14",
                r: "0.6",
                fill: "#333"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 406,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 14.6V15.5",
                stroke: "#333",
                strokeWidth: "0.8",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 407,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/celebrate/preview/page.tsx",
        lineNumber: 399,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const AchievementBadge = ({ globalCount, onClick, S })=>{
    const achievement = getCurrentAchievement(globalCount);
    if (!achievement) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
            onClick: onClick,
            className: "flex items-center justify-center rounded-full backdrop-blur-md border-2 transition-all relative overflow-hidden",
            style: {
                width: S.topButtonSize,
                height: S.topButtonSize,
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                borderColor: 'rgba(212, 175, 55, 0.4)',
                boxShadow: '0 0 15px rgba(212, 175, 55, 0.3), 0 0 25px rgba(212, 175, 55, 0.1)'
            },
            animate: {
                boxShadow: [
                    '0 0 15px rgba(212, 175, 55, 0.3), 0 0 25px rgba(212, 175, 55, 0.1)',
                    '0 0 20px rgba(212, 175, 55, 0.5), 0 0 35px rgba(212, 175, 55, 0.2)',
                    '0 0 15px rgba(212, 175, 55, 0.3), 0 0 25px rgba(212, 175, 55, 0.1)'
                ]
            },
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    className: "absolute inset-0",
                    style: {
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)'
                    },
                    animate: {
                        x: [
                            '-100%',
                            '200%'
                        ]
                    },
                    transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 1
                    }
                }, void 0, false, {
                    fileName: "[project]/app/celebrate/preview/page.tsx",
                    lineNumber: 447,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: S.topIconSize,
                    height: S.topIconSize,
                    viewBox: "0 0 24 24",
                    fill: "none",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M12 2L14.5 7L20 8L16 12L17 18L12 15L7 18L8 12L4 8L9.5 7L12 2Z",
                            fill: "rgba(212, 175, 55, 0.6)",
                            stroke: "#d4af37",
                            strokeWidth: "1.5"
                        }, void 0, false, {
                            fileName: "[project]/app/celebrate/preview/page.tsx",
                            lineNumber: 463,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "12",
                            cy: "11",
                            r: "4",
                            fill: "rgba(0,0,0,0.6)"
                        }, void 0, false, {
                            fileName: "[project]/app/celebrate/preview/page.tsx",
                            lineNumber: 467,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: "12",
                            y: "14",
                            textAnchor: "middle",
                            fill: "#d4af37",
                            fontSize: "8",
                            fontWeight: "bold",
                            children: "?"
                        }, void 0, false, {
                            fileName: "[project]/app/celebrate/preview/page.tsx",
                            lineNumber: 468,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/celebrate/preview/page.tsx",
                    lineNumber: 462,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/celebrate/preview/page.tsx",
            lineNumber: 424,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    const isSpecial = achievement.special;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: "flex items-center justify-center rounded-full backdrop-blur-md border transition-all",
        style: {
            width: S.topButtonSize,
            height: S.topButtonSize,
            backgroundColor: `${achievement.color}25`,
            borderColor: `${achievement.color}60`,
            boxShadow: `0 0 12px ${achievement.color}50`
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TrophySVG, {
            color: achievement.color,
            size: S.topIconSize,
            glow: isSpecial
        }, void 0, false, {
            fileName: "[project]/app/celebrate/preview/page.tsx",
            lineNumber: 488,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/celebrate/preview/page.tsx",
        lineNumber: 477,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const AchievementModal = ({ show, onClose, globalCount })=>{
    const [showInfoFor, setShowInfoFor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    if (!show) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm",
        style: {
            padding: 16
        },
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                scale: 0.9,
                opacity: 0
            },
            animate: {
                scale: 1,
                opacity: 1
            },
            exit: {
                scale: 0.9,
                opacity: 0
            },
            className: "bg-[#1a0505] border border-[#d4af37]/30 rounded-2xl overflow-hidden",
            style: {
                width: 340,
                maxWidth: '100%',
                maxHeight: '80vh',
                padding: 20
            },
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-[#d4af37] font-bold text-center font-serif",
                    style: {
                        fontSize: 20,
                        marginBottom: 8
                    },
                    children: "Achievements"
                }, void 0, false, {
                    fileName: "[project]/app/celebrate/preview/page.tsx",
                    lineNumber: 524,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-white/60 text-center",
                    style: {
                        fontSize: 14,
                        marginBottom: 16
                    },
                    children: [
                        "Global Pops: ",
                        globalCount.toLocaleString()
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/celebrate/preview/page.tsx",
                    lineNumber: 527,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-y-auto",
                    style: {
                        maxHeight: 400,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10
                    },
                    children: ACHIEVEMENT_MILESTONES.map((milestone)=>{
                        const unlocked = globalCount >= milestone.required;
                        const isSpecial = milestone.special;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex items-center rounded-xl border ${unlocked ? 'bg-black/40' : 'bg-black/20'}`,
                            style: {
                                padding: 12,
                                gap: 12,
                                borderColor: unlocked ? `${milestone.color}50` : 'rgba(255,255,255,0.15)',
                                boxShadow: unlocked ? `0 0 10px ${milestone.color}30` : '0 2px 8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-full flex items-center justify-center flex-shrink-0",
                                    style: {
                                        width: 40,
                                        height: 40,
                                        backgroundColor: unlocked ? `${milestone.color}30` : 'rgba(60,60,60,0.6)',
                                        boxShadow: unlocked && isSpecial ? `0 0 15px ${milestone.color}50` : unlocked ? 'none' : '0 2px 6px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)'
                                    },
                                    children: unlocked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TrophySVG, {
                                        color: milestone.color,
                                        size: 22,
                                        glow: isSpecial
                                    }, void 0, false, {
                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                        lineNumber: 561,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LockedBadgeSVG, {
                                        size: 22
                                    }, void 0, false, {
                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                        lineNumber: 567,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 547,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-bold truncate",
                                            style: {
                                                fontSize: 14,
                                                color: unlocked ? milestone.color : '#888'
                                            },
                                            children: milestone.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                            lineNumber: 571,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 mt-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: (e)=>{
                                                        e.stopPropagation();
                                                        setShowInfoFor(showInfoFor === milestone.level ? null : milestone.level);
                                                    },
                                                    className: "text-white/40 hover:text-[#d4af37] transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                        size: 12
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                                        lineNumber: 589,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                                    lineNumber: 582,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-white/50",
                                                    style: {
                                                        fontSize: 11
                                                    },
                                                    children: isSpecial ? 'Beyond All Limits' : milestone.required.toLocaleString()
                                                }, void 0, false, {
                                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                                    lineNumber: 591,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                            lineNumber: 581,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        showInfoFor === milestone.level && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                            initial: {
                                                opacity: 0,
                                                y: -5
                                            },
                                            animate: {
                                                opacity: 1,
                                                y: 0
                                            },
                                            className: "mt-2 p-2 bg-black/60 rounded-lg border border-[#d4af37]/20",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white/70 text-xs",
                                                children: isSpecial ? 'Ultimate achievement - no limit!' : `This achievement unlocks at ${milestone.required.toLocaleString()} pops`
                                            }, void 0, false, {
                                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                                lineNumber: 604,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                            lineNumber: 599,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 570,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                unlocked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "16",
                                    height: "16",
                                    viewBox: "0 0 16 16",
                                    fill: "none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "8",
                                            cy: "8",
                                            r: "7",
                                            fill: "#4ade80",
                                            fillOpacity: "0.2",
                                            stroke: "#4ade80",
                                            strokeWidth: "1.5"
                                        }, void 0, false, {
                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                            lineNumber: 614,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M4.5 8L7 10.5L11.5 6",
                                            stroke: "#4ade80",
                                            strokeWidth: "1.5",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                            lineNumber: 615,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 613,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "14",
                                    height: "14",
                                    viewBox: "0 0 14 14",
                                    fill: "none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                            x: "3",
                                            y: "6.5",
                                            width: "8",
                                            height: "5.5",
                                            rx: "1.5",
                                            fill: "#555",
                                            fillOpacity: "0.8"
                                        }, void 0, false, {
                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                            lineNumber: 619,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M4.5 6.5V5C4.5 3.6 5.6 2.5 7 2.5C8.4 2.5 9.5 3.6 9.5 5V6.5",
                                            stroke: "#555",
                                            strokeWidth: "1.2",
                                            strokeLinecap: "round",
                                            fill: "none"
                                        }, void 0, false, {
                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                            lineNumber: 620,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "7",
                                            cy: "9.5",
                                            r: "0.8",
                                            fill: "#888"
                                        }, void 0, false, {
                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                            lineNumber: 622,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 618,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, milestone.level, true, {
                            fileName: "[project]/app/celebrate/preview/page.tsx",
                            lineNumber: 535,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0));
                    })
                }, void 0, false, {
                    fileName: "[project]/app/celebrate/preview/page.tsx",
                    lineNumber: 530,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    className: "w-full text-white/40 hover:text-white transition-colors",
                    style: {
                        marginTop: 16,
                        fontSize: 13,
                        padding: 8
                    },
                    children: "Close"
                }, void 0, false, {
                    fileName: "[project]/app/celebrate/preview/page.tsx",
                    lineNumber: 629,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/celebrate/preview/page.tsx",
            lineNumber: 516,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/celebrate/preview/page.tsx",
        lineNumber: 511,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const BalloonSystem = ({ scale, S, onPop })=>{
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const glitterRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const timeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const rafRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])();
    const [balloons, setBalloons] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [, tick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const perSide = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (scale >= 1.5) return 4;
        if (scale >= 1.2) return 3;
        return BASE.balloonsPerSideMobile;
    }, [
        scale
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const arr = [];
        let id = 1;
        const variations = BASE.balloonHeightVariations;
        for(let i = 0; i < perSide; i++){
            arr.push({
                id: id++,
                side: 'left',
                xPct: 8 + i * 6,
                color: getRandomColor(),
                visible: true,
                progress: 1,
                heightLimit: variations[id % variations.length]
            });
            arr.push({
                id: id++,
                side: 'right',
                xPct: 92 - i * 6,
                color: getRandomColor(),
                visible: true,
                progress: 1,
                heightLimit: variations[(id + 3) % variations.length]
            });
        }
        setBalloons(arr);
        setMounted(true);
    }, [
        perSide
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!mounted) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const resize = ()=>{
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        const animate = ()=>{
            timeRef.current += 0.016;
            const W = canvas.width, H = canvas.height;
            ctx.clearRect(0, 0, W, H);
            const contentBottom = S.contentPadBottom + S.actionBottom;
            const availableH = H - contentBottom;
            const leftX = W * 0.05, rightX = W * 0.95, originY = H + S.stringOriginY;
            for (const b of balloons){
                if (!b.visible) continue;
                const originX = b.side === 'left' ? leftX : rightX;
                const swayX = Math.sin(timeRef.current * 1.2 + b.id * 1.5) * S.balloonSwayX;
                const swayY = Math.sin(timeRef.current * 1.8 + b.id * 0.9) * S.balloonSwayY;
                const maxRise = availableH * b.heightLimit;
                const finalY = H - contentBottom - maxRise + S.balloonHeight / 2;
                const startY = H + S.balloonSpawnY;
                const currY = startY - b.progress * (startY - finalY);
                const bx = W * b.xPct / 100 + swayX;
                const by = currY + swayY;
                const bottomY = by + S.balloonHeight / 2;
                const strSway = Math.sin(timeRef.current + b.id * 1.2) * S.stringSway;
                const midX = (originX + bx) / 2;
                ctx.beginPath();
                ctx.moveTo(originX, originY);
                ctx.bezierCurveTo(originX + (midX - originX) * 0.5 + strSway * 0.4, originY - H * 0.12, bx + (midX - bx) * 0.3 + strSway * 0.8, bottomY + (originY - bottomY) * 0.5, bx, bottomY);
                ctx.strokeStyle = 'rgba(160,140,120,0.75)';
                ctx.lineWidth = S.stringWidth;
                ctx.lineCap = 'round';
                ctx.stroke();
            }
            glitterRef.current = glitterRef.current.filter((p)=>{
                p.x += p.vx;
                p.y += p.vy;
                p.vy += BASE.glitterGravity * scale;
                p.vx *= 0.985;
                p.life -= 0.012;
                p.rot += p.rotSpeed;
                p.glow = Math.max(0, p.glow - 0.008);
                if (p.life <= 0) return false;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                const alpha = p.life * p.glow * 0.6;
                const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3);
                grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
                grad.addColorStop(0.3, p.color + Math.floor(Math.min(1, alpha) * 255).toString(16).padStart(2, '0'));
                grad.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(0, 0, p.size * 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = Math.min(1, p.life * 1.8);
                ctx.fillStyle = p.color;
                ctx.beginPath();
                for(let i = 0; i < 4; i++){
                    const a = Math.PI / 2 * i - Math.PI / 4;
                    ctx.lineTo(Math.cos(a) * p.size, Math.sin(a) * p.size);
                    ctx.lineTo(Math.cos(a + Math.PI / 4) * p.size * 0.25, Math.sin(a + Math.PI / 4) * p.size * 0.25);
                }
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                return true;
            });
            tick((n)=>n + 1);
            rafRef.current = requestAnimationFrame(animate);
        };
        animate();
        return ()=>{
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', resize);
        };
    }, [
        mounted,
        balloons,
        S,
        scale
    ]);
    const pop = (id, x, y, color)=>{
        playBalloonPopSound();
        onPop();
        const colors = [
            '#FFD700',
            '#FFFACD',
            '#FFF8DC',
            '#FFFFFF',
            lighten(color, 30),
            color,
            lighten(color, 50)
        ];
        const cnt = Math.round(S.glitterCount);
        for(let i = 0; i < cnt; i++){
            const a = Math.PI * 2 / cnt * i + (Math.random() - 0.5) * 0.6;
            const spd = (3 + Math.random() * 7) * scale;
            glitterRef.current.push({
                x,
                y,
                vx: Math.cos(a) * spd,
                vy: Math.sin(a) * spd - 4 * scale,
                size: (4 + Math.random() * 6) * scale,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                rot: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.3,
                glow: 1
            });
        }
        for(let i = 0; i < Math.round(S.glitterCountSmall); i++){
            const a = Math.random() * Math.PI * 2;
            const spd = (1.5 + Math.random() * 3) * scale;
            glitterRef.current.push({
                x,
                y,
                vx: Math.cos(a) * spd,
                vy: Math.sin(a) * spd - 2 * scale,
                size: (2 + Math.random() * 3) * scale,
                color: '#FFFFFF',
                life: 0.8,
                rot: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.4,
                glow: 1.2
            });
        }
        const popped = balloons.find((b)=>b.id === id);
        setBalloons((prev)=>prev.map((b)=>b.id === id ? {
                    ...b,
                    visible: false
                } : b));
        setTimeout(()=>{
            const newColor = getRandomColor(popped?.color);
            const newHeight = BASE.balloonHeightVariations[Math.floor(Math.random() * BASE.balloonHeightVariations.length)];
            setBalloons((prev)=>prev.map((b)=>b.id === id ? {
                        ...b,
                        visible: true,
                        progress: 0,
                        color: newColor,
                        heightLimit: newHeight
                    } : b));
            const start = Date.now(), dur = 2200;
            const respawn = ()=>{
                const p = Math.min(1, (Date.now() - start) / dur);
                const e = 1 - Math.pow(1 - p, 4);
                setBalloons((prev)=>prev.map((b)=>b.id === id ? {
                            ...b,
                            progress: e
                        } : b));
                if (p < 1) requestAnimationFrame(respawn);
            };
            requestAnimationFrame(respawn);
        }, 2800);
    };
    const getPos = (b)=>{
        if ("TURBOPACK compile-time truthy", 1) return {
            x: 0,
            y: 0
        };
        //TURBOPACK unreachable
        ;
        const W = undefined, H = undefined;
        const contentBottom = undefined;
        const availableH = undefined;
        const swayX = undefined;
        const swayY = undefined;
        const maxRise = undefined;
        const finalY = undefined;
        const startY = undefined;
        const currY = undefined;
    };
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-0 overflow-hidden pointer-events-none",
        style: {
            zIndex: 5
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                className: "absolute inset-0 w-full h-full"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 811,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            balloons.filter((b)=>b.visible).map((b)=>{
                const pos = getPos(b);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: (e)=>{
                        e.stopPropagation();
                        pop(b.id, pos.x, pos.y, b.color);
                    },
                    className: "absolute pointer-events-auto cursor-pointer",
                    style: {
                        left: pos.x,
                        top: pos.y,
                        transform: 'translate(-50%,-50%)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: S.balloonWidth,
                                height: S.balloonHeight,
                                background: `radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 12%, ${lighten(b.color, 15)} 35%, ${b.color} 55%, ${darken(b.color, 25)} 100%)`,
                                borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%',
                                boxShadow: `inset -${S.balloonShadowInset1}px -${S.balloonShadowInset2}px ${S.balloonShadowInset3}px rgba(0,0,0,0.15), inset ${S.balloonShadowInset4}px ${S.balloonShadowInset4}px ${S.balloonShadowInset5}px rgba(255,255,255,0.4), 0 ${S.balloonShadowOuter1}px ${S.balloonShadowOuter2}px rgba(0,0,0,0.3), 0 0 ${S.balloonShadowGlow}px ${b.color}40`,
                                position: 'relative'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'absolute',
                                        top: '10%',
                                        left: '15%',
                                        width: '32%',
                                        height: '38%',
                                        background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 100%)',
                                        borderRadius: '50%',
                                        filter: `blur(${S.balloonHighlight1Blur}px)`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 817,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'absolute',
                                        top: '25%',
                                        left: '55%',
                                        width: '18%',
                                        height: '22%',
                                        background: 'rgba(255,255,255,0.4)',
                                        borderRadius: '50%',
                                        filter: `blur(${S.balloonHighlight2Blur}px)`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 818,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'absolute',
                                        bottom: '20%',
                                        right: '12%',
                                        width: '10%',
                                        height: '12%',
                                        background: 'rgba(255,255,255,0.25)',
                                        borderRadius: '50%',
                                        filter: `blur(${S.balloonHighlight3Blur}px)`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 819,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/celebrate/preview/page.tsx",
                            lineNumber: 816,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: 'absolute',
                                bottom: -S.balloonKnotOffset,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: S.balloonKnotSize,
                                height: S.balloonKnotSize,
                                background: `linear-gradient(180deg, ${darken(b.color, 15)} 0%, ${darken(b.color, 35)} 100%)`,
                                clipPath: 'polygon(50% 0%, 10% 100%, 90% 100%)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/celebrate/preview/page.tsx",
                            lineNumber: 821,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, b.id, true, {
                    fileName: "[project]/app/celebrate/preview/page.tsx",
                    lineNumber: 815,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            })
        ]
    }, void 0, true, {
        fileName: "[project]/app/celebrate/preview/page.tsx",
        lineNumber: 810,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const CommentSlideshow = ({ comments, S })=>{
    const [idx, setIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (comments.length <= 1) return;
        const t = setInterval(()=>setIdx((i)=>(i + 1) % comments.length), 4000);
        return ()=>clearInterval(t);
    }, [
        comments.length
    ]);
    if (!comments.length) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute w-full flex justify-center pointer-events-none",
        style: {
            bottom: S.slideshowBottom,
            paddingLeft: S.slideshowPadX,
            paddingRight: S.slideshowPadX,
            zIndex: 20
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            mode: "wait",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: S.slideshowAnimOffset
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                exit: {
                    opacity: 0,
                    y: -S.slideshowAnimOffset
                },
                transition: {
                    duration: 0.4
                },
                className: "bg-black/60 backdrop-blur-md border border-white/10 text-white/90 shadow-md text-center truncate",
                style: {
                    paddingLeft: S.slideshowBubblePadX,
                    paddingRight: S.slideshowBubblePadX,
                    paddingTop: S.slideshowBubblePadY,
                    paddingBottom: S.slideshowBubblePadY,
                    fontSize: S.slideshowFontSize,
                    maxWidth: S.slideshowMaxWidth,
                    borderRadius: S.slideshowRadius
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[#d4af37] font-bold mr-2",
                        children: [
                            comments[idx].name,
                            ":"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/celebrate/preview/page.tsx",
                        lineNumber: 841,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    comments[idx].message
                ]
            }, idx, true, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 840,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/app/celebrate/preview/page.tsx",
            lineNumber: 839,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/celebrate/preview/page.tsx",
        lineNumber: 838,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
// SVG icons for volume indicator
const VolumeHighSVG = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M11 5L6 9H2V15H6L11 19V5Z",
                fill: "white",
                fillOpacity: "0.9"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 852,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53",
                stroke: "white",
                strokeWidth: "1.5",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 853,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07",
                stroke: "white",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeOpacity: "0.7"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 854,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/celebrate/preview/page.tsx",
        lineNumber: 851,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const VolumeMidSVG = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M11 5L6 9H2V15H6L11 19V5Z",
                fill: "white",
                fillOpacity: "0.9"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 860,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53",
                stroke: "white",
                strokeWidth: "1.5",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 861,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/celebrate/preview/page.tsx",
        lineNumber: 859,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const VolumeLowSVG = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M11 5L6 9H2V15H6L11 19V5Z",
            fill: "white",
            fillOpacity: "0.9"
        }, void 0, false, {
            fileName: "[project]/app/celebrate/preview/page.tsx",
            lineNumber: 867,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/celebrate/preview/page.tsx",
        lineNumber: 866,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const VolumeMuteSVG = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M11 5L6 9H2V15H6L11 19V5Z",
                fill: "white",
                fillOpacity: "0.5"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 873,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M22 9L17 14M17 9L22 14",
                stroke: "white",
                strokeWidth: "1.5",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 874,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/celebrate/preview/page.tsx",
        lineNumber: 872,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
function FreeStoryMode() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const scale = useProportionalScale();
    const S = useScaled(scale);
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [emotionalTerm, setEmotionalTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [babyTerm, setBabyTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [coupleTerm, setCoupleTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [stage, setStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('ENVELOPE');
    const [countdown, setCountdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(3);
    const [currentSlide, setCurrentSlide] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [muted, setMuted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDownloading, setIsDownloading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showQR, setShowQR] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showComments, setShowComments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAchievements, setShowAchievements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [qrLoading, setQrLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [comments, setComments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [visitorName, setVisitorName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [isNameSet, setIsNameSet] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [inputMsg, setInputMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [imgFit, setImgFit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('cover');
    const [currentImgSrc, setCurrentImgSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [globalPopCount, setGlobalPopCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showPopNumber, setShowPopNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasDownloaded, setHasDownloaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // DOM-to-image pipeline state
    const [geminiHtml, setGeminiHtml] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pendingCapture, setPendingCapture] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const posterRenderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [birthdaySelfLine, setBirthdaySelfLine] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const volumeLevel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(70);
    const [volDisplay, setVolDisplay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        show: false,
        level: 70
    });
    const touchStartPos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0
    });
    const touchStartVol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(70);
    const isVolGesture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const gestureDecided = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const isOverlayOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const volHideTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleImageLoad = (img)=>{
        const fit = determineImageFit(img);
        setImgFit(fit);
        setCurrentImgSrc(img.src);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const saved = localStorage.getItem('celebrationData');
        if (saved) {
            const parsedData = JSON.parse(saved);
            if (!parsedData.storyId) {
                parsedData.storyId = `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem('celebrationData', JSON.stringify(parsedData));
            }
            setData(parsedData);
            const allCommentsStr = localStorage.getItem('storyCommentsV3');
            if (allCommentsStr) {
                const allComments = JSON.parse(allCommentsStr);
                const storyComments = allComments.filter((c)=>c.storyId === parsedData.storyId);
                setComments(storyComments);
            }
            const n = localStorage.getItem('jashnVisitorName');
            if (n) {
                setVisitorName(n);
                setIsNameSet(true);
            }
            const savedGlobalPopCount = localStorage.getItem('jashnGlobalBalloonPopCount');
            if (savedGlobalPopCount) setGlobalPopCount(parseInt(savedGlobalPopCount) || 0);
            const savedTerm = localStorage.getItem('emotionalTerm');
            if (savedTerm) setEmotionalTerm(savedTerm);
            const savedBabyTerm = localStorage.getItem('babyTerm');
            if (savedBabyTerm) setBabyTerm(savedBabyTerm);
            const savedCoupleTerm = localStorage.getItem('coupleTerm');
            if (savedCoupleTerm) setCoupleTerm(savedCoupleTerm);
            if (parsedData.category === 'BIRTHDAY' && parsedData.isForSelf) {
                const line = BIRTHDAY_SELF_LINES[birthdayLineIndex % BIRTHDAY_SELF_LINES.length];
                birthdayLineIndex++;
                setBirthdaySelfLine(line);
            }
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        isOverlayOpen.current = showQR || showComments || showAchievements;
    }, [
        showQR,
        showComments,
        showAchievements
    ]);
    const handleBalloonPop = ()=>{
        const newCount = globalPopCount + 1;
        setGlobalPopCount(newCount);
        localStorage.setItem('jashnGlobalBalloonPopCount', newCount.toString());
        setShowPopNumber(true);
        setTimeout(()=>{
            setShowPopNumber(false);
        }, 800);
    };
    const onVolTouchStart = (e)=>{
        if (isOverlayOpen.current) return;
        if (stage !== 'STORY') return;
        touchStartPos.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        touchStartVol.current = volumeLevel.current;
        isVolGesture.current = false;
        gestureDecided.current = false;
    };
    const onVolTouchMove = (e)=>{
        if (isOverlayOpen.current) return;
        if (stage !== 'STORY') return;
        const currX = e.touches[0].clientX;
        const currY = e.touches[0].clientY;
        const dx = Math.abs(currX - touchStartPos.current.x);
        const dy = Math.abs(currY - touchStartPos.current.y);
        if (!gestureDecided.current && (dx > 8 || dy > 8)) {
            gestureDecided.current = true;
            isVolGesture.current = dy > dx;
        }
        if (!isVolGesture.current) return;
        e.preventDefault();
        const verticalDelta = touchStartPos.current.y - currY;
        const volumeChange = verticalDelta / window.innerHeight * 150;
        let newVol = Math.round(touchStartVol.current + volumeChange);
        newVol = Math.max(0, Math.min(100, newVol));
        volumeLevel.current = newVol;
        setVolDisplay({
            show: true,
            level: newVol
        });
        const audioEl = document.querySelector('audio');
        if (audioEl) audioEl.volume = newVol / 100;
    };
    const onVolTouchEnd = ()=>{
        if (isVolGesture.current) {
            if (volHideTimer.current) clearTimeout(volHideTimer.current);
            volHideTimer.current = setTimeout(()=>{
                setVolDisplay((prev)=>({
                        ...prev,
                        show: false
                    }));
            }, 300);
        }
        gestureDecided.current = false;
        isVolGesture.current = false;
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        document.addEventListener('touchstart', onVolTouchStart, {
            passive: true
        });
        document.addEventListener('touchmove', onVolTouchMove, {
            passive: false
        });
        document.addEventListener('touchend', onVolTouchEnd);
        return ()=>{
            document.removeEventListener('touchstart', onVolTouchStart);
            document.removeEventListener('touchmove', onVolTouchMove);
            document.removeEventListener('touchend', onVolTouchEnd);
            if (volHideTimer.current) clearTimeout(volHideTimer.current);
        };
    }, [
        stage
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        window.history.pushState({
            storyView: true
        }, '');
        const handlePopState = ()=>{
            router.push('/');
        };
        window.addEventListener('popstate', handlePopState);
        return ()=>window.removeEventListener('popstate', handlePopState);
    }, [
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (stage === 'COUNTDOWN') {
            const t = setInterval(()=>setCountdown((c)=>c - 1), 1000);
            if (countdown === 0) {
                clearInterval(t);
                setStage('STORY');
                audioRef.current?.play().catch(()=>{});
                if (!confettiHasFired) {
                    confettiHasFired = true;
                    setTimeout(()=>{
                        triggerProfessionalConfetti();
                    }, 300);
                }
            }
            return ()=>clearInterval(t);
        }
    }, [
        stage,
        countdown
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (stage === 'STORY' && data?.photos?.length > 1) {
            const t = setInterval(()=>setCurrentSlide((i)=>(i + 1) % data.photos.length), 4000);
            return ()=>clearInterval(t);
        }
    }, [
        stage,
        data
    ]);
    const getSmartFestivalTitle = (occasionName)=>{
        if (!occasionName) return '';
        const trimmed = occasionName.trim();
        if (trimmed.toLowerCase().startsWith('happy')) {
            return trimmed;
        }
        return `Happy ${trimmed}`;
    };
    const getFormattedTitle = ()=>{
        if (!data) return '';
        if (data.category === 'SPECIAL') {
            if (data.specialSubcategory === 'NEW_MEMBERS' || data.specialSubcategory === 'MARRIAGE_DATE_FIX') {
                if (data.selectedLanguage === 'hindi') {
                    return 'जश्न करने का समय';
                } else {
                    return "Let's Celebration Time";
                }
            }
            if (data.specialSubcategory === 'FESTIVALS') {
                return getSmartFestivalTitle(data.occasionName || '');
            }
            return data.occasionName || '';
        }
        if (data.category === 'BIRTHDAY' && data.isForSelf) {
            return '';
        }
        const count = data.count ? getOrdinal(data.count) : '';
        if (data.category === 'BIRTHDAY') return `Happy ${count} Birthday`;
        if (data.category === 'MARRIAGE' || data.category === 'RELATIONSHIP') return `Happy ${count} Anniversary`;
        return data.occasion || 'Celebration';
    };
    const getTermLine = ()=>{
        if (!data) return '';
        if (data.category === 'MARRIAGE' || data.category === 'RELATIONSHIP') {
            if (data.isForSelf && emotionalTerm) {
                return emotionalTerm;
            }
            if (!data.isForSelf && data.relationLabel) {
                return data.relationLabel;
            }
            return '';
        }
        if (data.category === 'SPECIAL') {
            if (data.specialSubcategory === 'NEW_MEMBERS' && babyTerm) {
                return babyTerm;
            }
            if (data.specialSubcategory === 'MARRIAGE_DATE_FIX' && coupleTerm) {
                return coupleTerm;
            }
        }
        return '';
    };
    const getDisplayName = ()=>{
        if (!data) return '';
        if (data.category === 'BIRTHDAY' && data.isForSelf) {
            return '';
        }
        if (data.category === 'SPECIAL') {
            if (data.specialSubcategory === 'NEW_MEMBERS') {
                const fatherName = data.fatherName || '';
                const motherName = data.motherName || '';
                if (fatherName && motherName) return `${fatherName} & ${motherName}`;
                if (fatherName) return fatherName;
                if (motherName) return motherName;
                return 'Our Family';
            }
            if (data.specialSubcategory === 'MARRIAGE_DATE_FIX') {
                const name1 = data.name1 || '';
                const name2 = data.name2 || '';
                if (name1 && name2) return `${name1} & ${name2}`;
                if (name1) return name1;
                if (name2) return name2;
                return 'The Couple';
            }
            return '';
        }
        if (data.category === 'BIRTHDAY') {
            return data.names || '';
        }
        if (data.category === 'MARRIAGE' || data.category === 'RELATIONSHIP') {
            return data.names || '';
        }
        return data.names || '';
    };
    const getSelfProfileText = ()=>{
        if (!data || !data.isForSelf) return '';
        if (data.category === 'MARRIAGE') {
            if (data.whoAreYou === 'WIFE') return 'From your wife';
            if (data.whoAreYou === 'HUSBAND') return 'From your husband';
        }
        if (data.category === 'RELATIONSHIP') {
            if (data.whoAreYou === 'FEMALE_PARTNER') return 'Your dear';
            if (data.whoAreYou === 'MALE_PARTNER') return 'Your love';
        }
        return '';
    };
    const isAutoProfile = (name)=>{
        if (!name) return false;
        const autoProfilePrefixes = [
            'From your',
            'Your dear',
            'Your love'
        ];
        return autoProfilePrefixes.some((prefix)=>name.startsWith(prefix));
    };
    // ═══════════════════════════════════════════════════════════════════
    // HANDLE DOWNLOAD — DOM-to-Image Architecture
    // Pipeline A (success): Gemini returns HTML → render in hidden div
    //                       → html-to-image captures → JPEG download
    // Pipeline B (fallback): Gemini fails → hardcoded canvas poster
    //
    // Routes:
    //   LAYOUT_1_COLLAGE → /api/generate-poster-styling  (9:16, up to 5 photos)
    //   LAYOUT_2_JAYANTI → /api/generate-poster-layout   (1:1, 1 hero photo)
    // ═══════════════════════════════════════════════════════════════════
    // ── Helper: HTMLImageElement → { url: base64, orientation } ────────────
    // orientation = 'vertical' if taller than wide, 'horizontal' otherwise.
    // Routes use orientation to pick frame aspect-ratio (1/1 vs 4/3).
    // All images rendered with object-position:center center (equal crop on all sides).
    const imageToPayload = (img)=>{
        const w = img.naturalWidth || img.width || 512;
        const h = img.naturalHeight || img.height || 512;
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const cx = c.getContext('2d');
        if (cx) {
            try {
                cx.drawImage(img, 0, 0);
            } catch (corsErr) {
                // Canvas tainted by CORS — fill with placeholder colour so poster still renders
                console.warn('[imageToPayload] Canvas tainted (CORS), using placeholder');
                cx.fillStyle = '#e8e0d0';
                cx.fillRect(0, 0, w, h);
            }
        }
        const url = c.toDataURL('image/jpeg', 0.85).split(',')[1] || '';
        // Detect orientation: square within 10% aspect ratio tolerance
        const ratio = w / h;
        const orientation = ratio > 1.1 ? 'horizontal' : ratio < 0.9 ? 'vertical' : 'square';
        return {
            url,
            orientation
        };
    };
    // Backwards-compat shim — canvas fallback still uses plain base64
    const imageElementToBase64 = (img)=>imageToPayload(img).url;
    // ── Helper: inject user photos into Gemini HTML by replacing tokens ──
    // Gemini uses {{PHOTO_0}}, {{PHOTO_1}} … as src placeholders.
    const injectPhotosIntoHtml = (html, photosBase64)=>{
        let result = html;
        photosBase64.forEach((b64, i)=>{
            const dataUri = `data:image/jpeg;base64,${b64}`;
            // Replace both quoted and unquoted variants Gemini might produce
            result = result.replace(new RegExp(`"\{\{PHOTO_${i}\}\}"`, 'g'), `"${dataUri}"`).replace(new RegExp(`'\{\{PHOTO_${i}\}\}'`, 'g'), `"${dataUri}"`).replace(new RegExp(`\{\{PHOTO_${i}\}\}`, 'g'), dataUri);
        });
        return result;
    };
    // ── Helper: download a base64 string as a file ────────────────────
    const downloadBase64Image = (base64, mimeType, filename)=>{
        const bytes = atob(base64);
        const ab = new ArrayBuffer(bytes.length);
        const ua = new Uint8Array(ab);
        for(let i = 0; i < bytes.length; i++)ua[i] = bytes.charCodeAt(i);
        const blob = new Blob([
            ab
        ], {
            type: mimeType
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = filename;
        a.href = url;
        a.click();
        setTimeout(()=>URL.revokeObjectURL(url), 2000);
    };
    // ── useEffect: fires after geminiHtml state update renders the hidden div ──
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!pendingCapture || !geminiHtml || !posterRenderRef.current) return;
        const captureNode = posterRenderRef.current;
        // Delay to let browser fully paint injected HTML (fonts, gradients, animations)
        const timer = setTimeout(async ()=>{
            try {
                console.log('[DOMCapture] Starting html-to-image capture...');
                console.log('[DOMCapture] Capture node:', captureNode.innerHTML.substring(0, 200));
                // Options to prevent [object Event] crashes from broken internal links/CORS
                const fallbackOptions = {
                    imagePlaceholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
                };
                // Pre-warm the capture (first call often inaccurate for external fonts)
                // Wrapped in try-catch so an Event crash here doesn't kill the main capture
                try {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$to$2d$image$2f$es$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toJpeg"])(captureNode, {
                        quality: 0.5,
                        pixelRatio: 1,
                        ...fallbackOptions
                    });
                } catch (preWarmErr) {
                    console.warn('[DOMCapture] Pre-warm failed, continuing anyway:', preWarmErr);
                }
                // Actual high-res capture
                const dataUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$to$2d$image$2f$es$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toJpeg"])(captureNode, {
                    quality: 0.96,
                    pixelRatio: 2,
                    skipAutoScale: false,
                    cacheBust: true,
                    includeQueryParams: true,
                    ...fallbackOptions,
                    // CORS-safe: embed images as data URIs (already done via injectPhotosIntoHtml)
                    fetchRequestInit: {
                        mode: 'cors',
                        cache: 'no-cache'
                    }
                });
                // dataUrl is a "data:image/jpeg;base64,..." string
                const base64 = dataUrl.split(',')[1] || '';
                const pending_filename = `Jashn-${Date.now()}.jpg`;
                downloadBase64Image(base64, 'image/jpeg', pending_filename);
                console.log('[DOMCapture] ✅ Poster captured and downloaded');
                setHasDownloaded(true);
            } catch (captureErr) {
                console.error('[DOMCapture] html-to-image failed:', captureErr);
                // On capture failure show an error; the hidden div is already rendered
                alert('Poster render captured but download failed. Please try again.');
            } finally{
                // Clean up: unmount the generated HTML and reset flags
                setGeminiHtml(null);
                setPendingCapture(false);
                setIsDownloading(false);
            }
        }, 350); // 350ms: enough for fonts, gradients, animations to paint
        return ()=>clearTimeout(timer);
    }, [
        pendingCapture,
        geminiHtml
    ]);
    // ── Main download handler ─────────────────────────────────────────
    const handleDownload = async ()=>{
        if (!data) return;
        setIsDownloading(true);
        try {
            const title = getFormattedTitle();
            const subtitle = data.customMessage || '';
            const isLayout2 = data.category === 'SPECIAL' && [
                'JYANTI',
                'DIVAS',
                'FESTIVALS'
            ].includes(data.specialSubcategory);
            const layoutType = isLayout2 ? 'LAYOUT_2_JAYANTI' : 'LAYOUT_1_COLLAGE';
            const apiEndpoint = isLayout2 ? '/api/generate-poster-layout' : '/api/generate-poster-styling';
            const maxPhotos = isLayout2 ? 1 : 5;
            const filename = `Jashn-${(getDisplayName() || 'Celebration').replace(/\s/g, '-')}`;
            // ── Step 1: Load user photos (CORS-safe with retry) ───────────
            const loadedImages = [];
            const photosToLoad = data.photos?.length > 0 ? data.photos.slice(0, maxPhotos) : [];
            for (const src of photosToLoad){
                try {
                    const img = new Image();
                    // Try anonymous CORS first (needed for html-to-image canvas taint prevention)
                    img.crossOrigin = 'anonymous';
                    await new Promise((resolve, reject)=>{
                        img.onload = ()=>resolve();
                        img.onerror = ()=>{
                            // CORS failed — retry without crossOrigin (canvas fallback will still work)
                            console.warn('[CORS] crossOrigin failed, retrying without CORS attribute:', src?.substring(0, 60));
                            const img2 = new Image();
                            img2.onload = ()=>{
                                loadedImages.push(img2);
                                resolve();
                            };
                            img2.onerror = ()=>reject(new Error('load failed completely'));
                            img2.src = src;
                            return; // img2 pushed inside, skip outer push
                        };
                        img.src = src;
                    }).then(()=>{
                        // Only push if CORS retry didn't already push
                        if (!loadedImages.includes(img) && img.complete && img.naturalWidth > 0) {
                            loadedImages.push(img);
                        }
                    }).catch((err)=>{
                        console.error('Failed to load image:', src?.substring(0, 60), err);
                    });
                } catch (err) {
                    console.error('Failed to load image:', src?.substring(0, 60), err);
                }
            }
            // ── Step 2: Convert to enriched payload { url, orientation } ─────────
            const imagePayloads = loadedImages.map(imageToPayload).filter((p)=>p.url);
            const photosBase64 = imagePayloads.map((p)=>p.url); // for canvas fallback
            console.log(`[Gemini] Sending ${imagePayloads.length} photo(s) [${imagePayloads.map((p)=>p.orientation).join(',')}] to ${apiEndpoint}`);
            // ── Step 3: Call Gemini route — expect { isHtmlPoster, html } ─
            try {
                const res = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        occasion: title,
                        name: getDisplayName() || title,
                        message: subtitle,
                        quote: subtitle,
                        photos: imagePayloads,
                        design_seed: crypto.randomUUID(),
                        aspect_ratio: isLayout2 ? '1:1' : '9:16',
                        photo_count: imagePayloads.length
                    })
                });
                if (res.ok) {
                    const result = await res.json();
                    if (result.isHtmlPoster && result.html) {
                        console.log('[Gemini] ✅ HTML poster received — injecting photos and rendering...');
                        // Replace {{PHOTO_N}} tokens with actual base64 data URIs
                        const injectedHtml = injectPhotosIntoHtml(result.html, photosBase64);
                        // Set state → triggers hidden div render → useEffect captures it
                        setGeminiHtml(injectedHtml);
                        setPendingCapture(true);
                        // NOTE: setIsDownloading(false) is called inside the useEffect after capture
                        return; // ← useEffect takes over from here
                    }
                    console.warn('[Gemini] No isHtmlPoster in response — falling back to canvas');
                } else {
                    console.warn(`[Gemini] HTTP ${res.status} — falling back to canvas`);
                }
            } catch (apiErr) {
                console.warn('[Gemini] API error — falling back to canvas:', apiErr);
            }
            // ── Step 4: Canvas fallback (only if Gemini pipeline failed) ──
            console.log(`[Canvas] Rendering fallback for ${layoutType}`);
            let styleConfig = {};
            try {
                const res = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        occasion: title,
                        name: getDisplayName() || title,
                        message: subtitle,
                        quote: subtitle
                    })
                });
                if (res.ok) styleConfig = await res.json();
            } catch  {
                console.warn('Canvas fallback API call failed');
            }
            const canvas = document.createElement('canvas');
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$celebrate$2f$preview$2f$posterRenderer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generatePosterCanvas"])(canvas, layoutType, {
                title,
                subtitle,
                photos: loadedImages,
                relationName: getDisplayName(),
                termLine: getTermLine()
            }, styleConfig);
            const dlLink = document.createElement('a');
            dlLink.download = `${filename}.jpg`;
            dlLink.href = canvas.toDataURL('image/jpeg', 0.95);
            dlLink.click();
            setHasDownloaded(true);
        } catch (err) {
            console.error(err);
            alert('Error generating poster.');
        } finally{
            // Only set false here for the canvas path; Gemini path does it in useEffect
            if (!pendingCapture) setIsDownloading(false);
        }
    };
    const handleShareQR = async ()=>{
        try {
            if (navigator.share) {
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.href)}&color=d4af37&bgcolor=3D1010`;
                const response = await fetch(qrUrl);
                const blob = await response.blob();
                const file = new File([
                    blob
                ], "qr-code.png", {
                    type: "image/png"
                });
                await navigator.share({
                    title: 'Celebration Story',
                    text: 'Watch this celebration!',
                    url: window.location.href,
                    files: [
                        file
                    ]
                });
            } else {
                throw new Error("Share not supported");
            }
        } catch (e) {
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            } catch (clipErr) {
                alert("Could not share. Please copy the URL manually.");
            }
        }
    };
    const saveName = ()=>{
        if (visitorName.trim()) {
            localStorage.setItem('jashnVisitorName', visitorName);
            setIsNameSet(true);
        }
    };
    const addComment = ()=>{
        if (!inputMsg.trim() || !data) return;
        const c = {
            id: Date.now().toString(),
            name: visitorName || 'Guest',
            message: inputMsg,
            timestamp: new Date().toISOString(),
            storyId: data.storyId
        };
        const allCommentsStr = localStorage.getItem('storyCommentsV3');
        const allComments = allCommentsStr ? JSON.parse(allCommentsStr) : [];
        const updatedAllComments = [
            ...allComments,
            c
        ];
        localStorage.setItem('storyCommentsV3', JSON.stringify(updatedAllComments));
        const storyComments = updatedAllComments.filter((comment)=>comment.storyId === data.storyId);
        setComments(storyComments);
        setInputMsg('');
    };
    if (!data) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PremiumLoader, {
        scale: scale
    }, void 0, false, {
        fileName: "[project]/app/celebrate/preview/page.tsx",
        lineNumber: 1503,
        columnNumber: 21
    }, this);
    const screenW = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 430;
    const screenH = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 932;
    const qrModalMaxWidth = Math.min(380, screenW - 32);
    const qrSize = Math.min(200, qrModalMaxWidth - 48);
    const commentsModalMaxWidth = Math.min(420, screenW - 16);
    const commentsModalMaxHeight = Math.min(screenH * 0.8, 600);
    const termLine = getTermLine();
    const displayName = getDisplayName();
    const selfProfileText = getSelfProfileText();
    const effectiveCreatorName = data.creatorName || (data.isForSelf ? selfProfileText : '');
    const effectiveCreatorPhoto = data.creatorPhoto || null;
    const isBirthdaySelf = data.category === 'BIRTHDAY' && data.isForSelf;
    const isOccasionNameType = data.specialSubcategory === 'JYANTI' || data.specialSubcategory === 'DIVAS' || data.specialSubcategory === 'FESTIVALS';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 w-full h-[100dvh] overflow-hidden bg-black",
        children: [
            isDownloading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PremiumLoader, {
                scale: scale
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 1528,
                columnNumber: 25
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PopCounter, {
                count: globalPopCount,
                show: showPopNumber
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 1530,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AchievementModal, {
                show: showAchievements,
                onClose: ()=>setShowAchievements(false),
                globalCount: globalPopCount
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 1532,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: stage === 'ENVELOPE' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    exit: {
                        opacity: 0
                    },
                    className: "absolute inset-0 z-50 flex items-center justify-center bg-[#1a0505]",
                    onClick: ()=>setStage('COUNTDOWN'),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center animate-pulse cursor-pointer",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__["Gift"], {
                                style: {
                                    width: S.envelopeIconSize,
                                    height: S.envelopeIconSize
                                },
                                className: "text-[#d4af37]"
                            }, void 0, false, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1542,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: S.envelopeTextSize,
                                    marginTop: S.envelopeTextMarginTop
                                },
                                className: "text-[#d4af37] tracking-widest uppercase",
                                children: "Tap to Open"
                            }, void 0, false, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1543,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/celebrate/preview/page.tsx",
                        lineNumber: 1541,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/celebrate/preview/page.tsx",
                    lineNumber: 1540,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 1538,
                columnNumber: 7
            }, this),
            stage === 'COUNTDOWN' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 z-40 flex items-center justify-center bg-[#1a0505]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    style: {
                        fontSize: S.countdownFontSize
                    },
                    className: "font-serif text-[#d4af37]",
                    children: countdown
                }, void 0, false, {
                    fileName: "[project]/app/celebrate/preview/page.tsx",
                    lineNumber: 1551,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 1550,
                columnNumber: 9
            }, this),
            stage === 'STORY' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full h-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BalloonSystem, {
                        scale: scale,
                        S: S,
                        onPop: handleBalloonPop
                    }, void 0, false, {
                        fileName: "[project]/app/celebrate/preview/page.tsx",
                        lineNumber: 1557,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-black",
                        style: {
                            zIndex: 0
                        },
                        children: [
                            imgFit === 'contain' && currentImgSrc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0",
                                style: {
                                    zIndex: 1,
                                    backgroundImage: `url(${currentImgSrc})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    filter: 'blur(40px) brightness(0.5) saturate(1.2)',
                                    transform: 'scale(1.1)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1560,
                                columnNumber: 56
                            }, this),
                            imgFit === 'contain' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-black/30",
                                style: {
                                    zIndex: 2
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1561,
                                columnNumber: 39
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                mode: "wait",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].img, {
                                    src: data.photos?.[currentSlide],
                                    onLoad: (e)=>handleImageLoad(e.currentTarget),
                                    initial: {
                                        opacity: 0
                                    },
                                    animate: {
                                        opacity: 1
                                    },
                                    exit: {
                                        opacity: 0
                                    },
                                    transition: {
                                        duration: 1.2
                                    },
                                    className: "absolute inset-0 w-full h-full",
                                    style: {
                                        zIndex: 3,
                                        objectFit: imgFit,
                                        objectPosition: 'center center'
                                    },
                                    alt: ""
                                }, currentSlide, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1563,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1562,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-0 left-0 w-full pointer-events-none",
                                style: {
                                    zIndex: 4,
                                    height: `${BASE.overlayHeightPercent}%`,
                                    background: 'linear-gradient(to top, #000 15%, rgba(0,0,0,0.9) 50%, transparent 100%)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1565,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/celebrate/preview/page.tsx",
                        lineNumber: 1559,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-0 w-full flex justify-between items-center",
                        style: {
                            padding: S.topPadding,
                            zIndex: 20
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center",
                                style: {
                                    gap: S.topGap
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.push('/'),
                                        className: "flex items-center justify-center bg-black/40 rounded-full backdrop-blur-md border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black transition-all",
                                        style: {
                                            width: S.topButtonSize,
                                            height: S.topButtonSize
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$home$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                            style: {
                                                width: S.topIconSize,
                                                height: S.topIconSize
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                            lineNumber: 1571,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                        lineNumber: 1570,
                                        columnNumber: 15
                                    }, this),
                                    effectiveCreatorName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center bg-black/40 backdrop-blur-md border border-[#d4af37]/30 rounded-full shadow-lg",
                                        style: {
                                            paddingTop: S.creatorPillPadY,
                                            paddingBottom: S.creatorPillPadY,
                                            paddingRight: S.creatorPillPadX,
                                            paddingLeft: S.creatorPillPadY,
                                            gap: S.creatorPillGap
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-full border border-[#d4af37] overflow-hidden bg-gray-800",
                                                style: {
                                                    width: S.creatorAvatarSize,
                                                    height: S.creatorAvatarSize
                                                },
                                                children: effectiveCreatorPhoto ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: effectiveCreatorPhoto,
                                                    className: "w-full h-full object-cover",
                                                    alt: ""
                                                }, void 0, false, {
                                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                                    lineNumber: 1577,
                                                    columnNumber: 46
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full h-full flex items-center justify-center text-[#d4af37]",
                                                    style: {
                                                        fontSize: S.creatorNameSize
                                                    },
                                                    children: effectiveCreatorName?.charAt(0) || 'M'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                                    lineNumber: 1577,
                                                    columnNumber: 130
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                                lineNumber: 1576,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col leading-none justify-center",
                                                style: {
                                                    textAlign: 'left'
                                                },
                                                children: [
                                                    !isAutoProfile(effectiveCreatorName) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#d4af37] uppercase tracking-wider",
                                                        style: {
                                                            fontSize: S.creatorBySize,
                                                            marginBottom: S.creatorByMargin
                                                        },
                                                        children: "By"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                                        lineNumber: 1581,
                                                        columnNumber: 23
                                                    }, this),
                                                    effectiveCreatorName === 'From your wife' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: S.creatorNameSize,
                                                            lineHeight: '1.2',
                                                            textAlign: 'left'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white font-bold",
                                                                style: {
                                                                    display: 'block'
                                                                },
                                                                children: "From"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                                                lineNumber: 1585,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white font-bold",
                                                                style: {
                                                                    display: 'block'
                                                                },
                                                                children: "your wife"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                                                lineNumber: 1586,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                                        lineNumber: 1584,
                                                        columnNumber: 23
                                                    }, this) : effectiveCreatorName === 'From your husband' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: S.creatorNameSize,
                                                            lineHeight: '1.2',
                                                            textAlign: 'left'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white font-bold",
                                                                style: {
                                                                    display: 'block'
                                                                },
                                                                children: "From"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                                                lineNumber: 1590,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white font-bold",
                                                                style: {
                                                                    display: 'block'
                                                                },
                                                                children: "your husband"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                                                lineNumber: 1591,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                                        lineNumber: 1589,
                                                        columnNumber: 23
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white font-bold",
                                                        style: {
                                                            fontSize: S.creatorNameSize,
                                                            maxWidth: S.creatorNameMaxWidth,
                                                            lineHeight: '1.2',
                                                            wordWrap: 'break-word',
                                                            textAlign: 'left'
                                                        },
                                                        children: effectiveCreatorName
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                                        lineNumber: 1594,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                                lineNumber: 1579,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                        lineNumber: 1575,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1569,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center",
                                style: {
                                    gap: S.topGap
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AchievementBadge, {
                                        globalCount: globalPopCount,
                                        onClick: ()=>setShowAchievements(true),
                                        S: S
                                    }, void 0, false, {
                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                        lineNumber: 1602,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setMuted(!muted);
                                            if (audioRef.current) audioRef.current.muted = !muted;
                                        },
                                        className: "flex items-center justify-center bg-black/40 rounded-full backdrop-blur-md border border-[#d4af37]/30 text-white",
                                        style: {
                                            width: S.topButtonSize,
                                            height: S.topButtonSize
                                        },
                                        children: muted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__VolumeX$3e$__["VolumeX"], {
                                            style: {
                                                width: S.topIconSize,
                                                height: S.topIconSize
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                            lineNumber: 1608,
                                            columnNumber: 26
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
                                            style: {
                                                width: S.topIconSize,
                                                height: S.topIconSize
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                            lineNumber: 1608,
                                            columnNumber: 96
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                        lineNumber: 1607,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1601,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/celebrate/preview/page.tsx",
                        lineNumber: 1568,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-0 w-full text-center flex flex-col items-center justify-end pointer-events-none",
                        style: {
                            height: `${BASE.overlayHeightPercent}%`,
                            paddingLeft: S.contentPadX,
                            paddingRight: S.contentPadX,
                            paddingBottom: S.contentPadBottom,
                            zIndex: 20
                        },
                        children: isBirthdaySelf ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "font-serif leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,1)]",
                                    style: {
                                        fontSize: S.nameSize,
                                        marginBottom: S.nameMarginBottom * 1.5,
                                        letterSpacing: '0.04em',
                                        fontWeight: 'normal',
                                        color: '#d4af37',
                                        textShadow: '0 0 18px rgba(212, 175, 55, 0.7), 0 0 35px rgba(212, 175, 55, 0.35)'
                                    },
                                    children: birthdaySelfLine
                                }, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1617,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-white/80 italic leading-relaxed font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,1)]",
                                    style: {
                                        fontSize: S.messageSize,
                                        maxWidth: S.messageMaxWidth
                                    },
                                    children: [
                                        '"',
                                        data.customMessage,
                                        '"'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1631,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true) : isOccasionNameType ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                getFormattedTitle() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "font-serif leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,1)]",
                                    style: {
                                        fontSize: S.nameSize,
                                        marginBottom: S.nameMarginBottom * 1.5,
                                        letterSpacing: '0.04em',
                                        fontWeight: 'normal',
                                        color: '#d4af37',
                                        textShadow: '0 0 18px rgba(212, 175, 55, 0.7), 0 0 35px rgba(212, 175, 55, 0.35)'
                                    },
                                    children: getFormattedTitle()
                                }, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1639,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-white/80 italic leading-relaxed font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,1)]",
                                    style: {
                                        fontSize: S.messageSize,
                                        maxWidth: S.messageMaxWidth
                                    },
                                    children: [
                                        '"',
                                        data.customMessage,
                                        '"'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1654,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                getFormattedTitle() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-sans uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)]",
                                    style: {
                                        fontSize: S.titleSize,
                                        letterSpacing: '0.3em',
                                        marginBottom: S.titleMarginBottom,
                                        paddingBottom: S.titlePadBottom,
                                        fontWeight: 'normal',
                                        color: '#d4af37',
                                        textShadow: 'none',
                                        borderBottom: '1px solid rgba(212, 175, 55, 0.4)'
                                    },
                                    children: getFormattedTitle()
                                }, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1662,
                                    columnNumber: 19
                                }, this),
                                displayName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "font-serif text-white drop-shadow-[0_4px_8px_rgba(0,0,0,1)] leading-tight",
                                    style: {
                                        fontSize: S.nameSize,
                                        marginBottom: S.nameMarginBottom
                                    },
                                    children: displayName
                                }, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1680,
                                    columnNumber: 19
                                }, this),
                                termLine && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-[#d4af37]/20 border border-[#d4af37]/40 backdrop-blur-sm",
                                    style: {
                                        marginBottom: S.subtitleMarginBottom,
                                        paddingLeft: S.subtitlePadX,
                                        paddingRight: S.subtitlePadX,
                                        paddingTop: S.subtitlePadY,
                                        paddingBottom: S.subtitlePadY,
                                        borderRadius: S.subtitleRadius
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-bold text-[#d4af37] uppercase tracking-widest drop-shadow-md",
                                        style: {
                                            fontSize: S.subtitleSize
                                        },
                                        children: termLine
                                    }, void 0, false, {
                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                        lineNumber: 1698,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1687,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-white/80 italic leading-relaxed font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,1)]",
                                    style: {
                                        fontSize: S.messageSize,
                                        maxWidth: S.messageMaxWidth
                                    },
                                    children: [
                                        '"',
                                        data.customMessage,
                                        '"'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1705,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/app/celebrate/preview/page.tsx",
                        lineNumber: 1613,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CommentSlideshow, {
                        comments: comments,
                        S: S
                    }, void 0, false, {
                        fileName: "[project]/app/celebrate/preview/page.tsx",
                        lineNumber: 1713,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute w-full flex justify-center",
                        style: {
                            bottom: S.actionBottom,
                            gap: S.actionGap,
                            zIndex: 30
                        },
                        children: [
                            {
                                icon: hasDownloaded ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"],
                                label: hasDownloaded ? 'Redesign' : 'Save',
                                onClick: handleDownload
                            },
                            {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"],
                                label: 'Share',
                                onClick: handleShareQR
                            },
                            {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"],
                                label: 'Wishes',
                                onClick: ()=>setShowComments(true)
                            },
                            {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$qr$2d$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__QrCode$3e$__["QrCode"],
                                label: 'QR',
                                onClick: ()=>setShowQR(true)
                            }
                        ].map(({ icon: Icon, label, onClick })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClick,
                                className: "flex flex-col items-center text-white/90 hover:text-[#d4af37] group transition-colors",
                                style: {
                                    gap: S.actionItemGap
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        style: {
                                            width: S.actionIconSize,
                                            height: S.actionIconSize
                                        },
                                        className: "group-hover:scale-110 transition-transform"
                                    }, void 0, false, {
                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                        lineNumber: 1723,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "uppercase tracking-wider font-bold",
                                        style: {
                                            fontSize: S.actionLabelSize
                                        },
                                        children: label
                                    }, void 0, false, {
                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                        lineNumber: 1724,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, label, true, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1722,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/celebrate/preview/page.tsx",
                        lineNumber: 1715,
                        columnNumber: 11
                    }, this),
                    volDisplay.show && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'fixed',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            opacity: 1,
                            transition: 'opacity 0.3s ease',
                            pointerEvents: 'none',
                            zIndex: 9999,
                            background: 'rgba(0,0,0,0.55)',
                            borderRadius: '16px',
                            padding: '14px 10px',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.4)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 20,
                                    height: 20
                                },
                                children: volDisplay.level === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(VolumeMuteSVG, {}, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1751,
                                    columnNumber: 43
                                }, this) : volDisplay.level < 30 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(VolumeLowSVG, {}, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1752,
                                    columnNumber: 43
                                }, this) : volDisplay.level < 70 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(VolumeMidSVG, {}, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1753,
                                    columnNumber: 45
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(VolumeHighSVG, {}, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1753,
                                    columnNumber: 64
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1750,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '5px',
                                    height: '120px',
                                    borderRadius: '3px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'absolute',
                                        bottom: 0,
                                        width: '100%',
                                        height: `${volDisplay.level}%`,
                                        backgroundColor: 'rgba(212, 175, 55, 0.9)',
                                        borderRadius: '3px',
                                        transition: 'height 0.05s linear'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1764,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1756,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: '11px',
                                    color: 'rgba(255, 255, 255, 0.85)',
                                    fontWeight: '700',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.4)'
                                },
                                children: volDisplay.level
                            }, void 0, false, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1775,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/celebrate/preview/page.tsx",
                        lineNumber: 1730,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 1556,
                columnNumber: 9
            }, this),
            showQR && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm",
                style: {
                    padding: 16
                },
                onClick: ()=>setShowQR(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1a0505] border border-[#d4af37] rounded-2xl text-center shadow-[0_0_50px_rgba(212,175,55,0.2)] overflow-hidden",
                    style: {
                        width: qrModalMaxWidth,
                        maxWidth: '100%',
                        padding: 20
                    },
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-[#d4af37] font-bold font-serif",
                            style: {
                                fontSize: 18,
                                marginBottom: 16
                            },
                            children: "Share the Love"
                        }, void 0, false, {
                            fileName: "[project]/app/celebrate/preview/page.tsx",
                            lineNumber: 1791,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative mx-auto bg-white rounded-xl overflow-hidden",
                            style: {
                                width: qrSize,
                                height: qrSize,
                                padding: 8,
                                marginBottom: 16
                            },
                            children: [
                                qrLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 flex items-center justify-center bg-white",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "animate-spin text-[#1a0505]",
                                        style: {
                                            width: 32,
                                            height: 32
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                        lineNumber: 1793,
                                        columnNumber: 106
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1793,
                                    columnNumber: 30
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '')}&color=1a0505&bgcolor=FFFFFF`,
                                    className: "w-full h-full object-contain",
                                    onLoad: ()=>setQrLoading(false),
                                    alt: "QR Code"
                                }, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1794,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/celebrate/preview/page.tsx",
                            lineNumber: 1792,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleShareQR,
                            className: "w-full bg-[#d4af37] text-[#1a0505] font-bold rounded-lg hover:brightness-110 transition-all flex items-center justify-center",
                            style: {
                                padding: 12,
                                fontSize: 14,
                                gap: 8
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                    style: {
                                        width: 18,
                                        height: 18
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1797,
                                    columnNumber: 15
                                }, this),
                                " Share QR + Link"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/celebrate/preview/page.tsx",
                            lineNumber: 1796,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowQR(false),
                            className: "text-white/40 hover:text-white transition-colors w-full",
                            style: {
                                marginTop: 12,
                                fontSize: 13,
                                padding: 8
                            },
                            children: "Close"
                        }, void 0, false, {
                            fileName: "[project]/app/celebrate/preview/page.tsx",
                            lineNumber: 1799,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/celebrate/preview/page.tsx",
                    lineNumber: 1790,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 1789,
                columnNumber: 9
            }, this),
            showComments && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm",
                style: {
                    padding: 8
                },
                onClick: ()=>setShowComments(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-[#1a0505] rounded-2xl border border-[#d4af37]/30 flex flex-col shadow-2xl overflow-hidden",
                    style: {
                        width: commentsModalMaxWidth,
                        maxWidth: '100%',
                        height: commentsModalMaxHeight,
                        maxHeight: 'calc(100vh - 32px)'
                    },
                    onClick: (e)=>e.stopPropagation(),
                    children: !isNameSet ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 flex flex-col items-center justify-center text-center overflow-auto",
                        style: {
                            padding: 24,
                            gap: 20
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-full bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/30 flex-shrink-0",
                                style: {
                                    width: 64,
                                    height: 64
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                    style: {
                                        width: 32,
                                        height: 32
                                    },
                                    className: "text-[#d4af37]"
                                }, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1810,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1809,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-serif text-[#d4af37]",
                                        style: {
                                            fontSize: 20,
                                            marginBottom: 8
                                        },
                                        children: "Who are you?"
                                    }, void 0, false, {
                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                        lineNumber: 1813,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-white/60",
                                        style: {
                                            fontSize: 13
                                        },
                                        children: "Enter your name to join."
                                    }, void 0, false, {
                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                        lineNumber: 1814,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1812,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                autoFocus: true,
                                className: "w-full bg-black/30 border border-[#d4af37]/30 rounded-xl text-white text-center focus:border-[#d4af37] outline-none transition-all",
                                placeholder: "Your Name",
                                value: visitorName,
                                onChange: (e)=>setVisitorName(e.target.value),
                                style: {
                                    padding: 14,
                                    fontSize: 16
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1816,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: saveName,
                                disabled: !visitorName.trim(),
                                className: "w-full bg-[#d4af37] text-[#1a0505] font-bold rounded-xl disabled:opacity-50 hover:scale-[1.02] transition-transform",
                                style: {
                                    padding: 14,
                                    fontSize: 16
                                },
                                children: "Continue"
                            }, void 0, false, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1817,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/celebrate/preview/page.tsx",
                        lineNumber: 1808,
                        columnNumber: 15
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between border-b border-[#d4af37]/20 bg-[#150404] flex-shrink-0",
                                style: {
                                    padding: 14
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-[#d4af37] font-bold flex items-center font-serif",
                                        style: {
                                            fontSize: 16,
                                            gap: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                style: {
                                                    width: 18,
                                                    height: 18
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                                lineNumber: 1823,
                                                columnNumber: 21
                                            }, this),
                                            " Wishes (",
                                            comments.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                        lineNumber: 1822,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowComments(false),
                                        className: "text-white/50 hover:text-white p-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            style: {
                                                width: 18,
                                                height: 18
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                            lineNumber: 1826,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/celebrate/preview/page.tsx",
                                        lineNumber: 1825,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1821,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-auto bg-[#1a0505]",
                                style: {
                                    padding: 14
                                },
                                children: comments.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full flex flex-col items-center justify-center text-white/20",
                                    style: {
                                        gap: 8,
                                        minHeight: 150
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                            style: {
                                                width: 40,
                                                height: 40
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                            lineNumber: 1832,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "italic",
                                            style: {
                                                fontSize: 13
                                            },
                                            children: "No wishes yet."
                                        }, void 0, false, {
                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                            lineNumber: 1833,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1831,
                                    columnNumber: 21
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 12
                                    },
                                    children: comments.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex",
                                            style: {
                                                gap: 10
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a6e15] flex items-center justify-center text-[#1a0505] font-bold flex-shrink-0 shadow-lg border border-white/10",
                                                    style: {
                                                        width: 36,
                                                        height: 36,
                                                        fontSize: 13
                                                    },
                                                    children: c.name.charAt(0).toUpperCase()
                                                }, void 0, false, {
                                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                                    lineNumber: 1839,
                                                    columnNumber: 27
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 bg-black/40 rounded-2xl rounded-tl-none border border-[#d4af37]/10",
                                                    style: {
                                                        padding: 10
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between items-baseline",
                                                            style: {
                                                                marginBottom: 4
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-bold text-[#d4af37]",
                                                                    style: {
                                                                        fontSize: 13
                                                                    },
                                                                    children: c.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                                                    lineNumber: 1842,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-white/30",
                                                                    style: {
                                                                        fontSize: 10
                                                                    },
                                                                    children: formatTime(c.timestamp)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                                                    lineNumber: 1843,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                                            lineNumber: 1841,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-white/90 leading-relaxed",
                                                            style: {
                                                                fontSize: 13
                                                            },
                                                            children: c.message
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                                            lineNumber: 1845,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                                    lineNumber: 1840,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, c.id, true, {
                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                            lineNumber: 1838,
                                            columnNumber: 25
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1836,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1829,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[#150404] border-t border-[#d4af37]/20 flex-shrink-0",
                                style: {
                                    padding: 12
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex",
                                    style: {
                                        gap: 10
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "flex-1 bg-black/30 border border-[#d4af37]/20 rounded-full text-white focus:border-[#d4af37] outline-none placeholder:text-white/30 transition-all",
                                            placeholder: `Wish as ${visitorName}...`,
                                            value: inputMsg,
                                            onChange: (e)=>setInputMsg(e.target.value),
                                            style: {
                                                paddingLeft: 16,
                                                paddingRight: 16,
                                                paddingTop: 10,
                                                paddingBottom: 10,
                                                fontSize: 14
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                            lineNumber: 1854,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "bg-[#d4af37] text-[#1a0505] rounded-full flex items-center justify-center disabled:opacity-50 hover:scale-110 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]",
                                            disabled: !inputMsg.trim(),
                                            onClick: addComment,
                                            style: {
                                                width: 42,
                                                height: 42
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                                style: {
                                                    width: 18,
                                                    height: 18
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                                lineNumber: 1856,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/celebrate/preview/page.tsx",
                                            lineNumber: 1855,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/celebrate/preview/page.tsx",
                                    lineNumber: 1853,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/celebrate/preview/page.tsx",
                                lineNumber: 1852,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true)
                }, void 0, false, {
                    fileName: "[project]/app/celebrate/preview/page.tsx",
                    lineNumber: 1806,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 1805,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("audio", {
                ref: audioRef,
                loop: true,
                src: data?.music || undefined
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 1866,
                columnNumber: 7
            }, this),
            geminiHtml && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    left: '-9999px',
                    top: '-9999px',
                    zIndex: -9999,
                    pointerEvents: 'none',
                    // No width/height here — the Gemini HTML root div sets its own 1080px size
                    overflow: 'visible'
                },
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: posterRenderRef,
                    dangerouslySetInnerHTML: {
                        __html: geminiHtml
                    }
                }, void 0, false, {
                    fileName: "[project]/app/celebrate/preview/page.tsx",
                    lineNumber: 1886,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/celebrate/preview/page.tsx",
                lineNumber: 1874,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/celebrate/preview/page.tsx",
        lineNumber: 1527,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=app_celebrate_preview_095elc4._.js.map