//app/celebrate/preview/posterRenderer.ts

export type LayoutType = 'LAYOUT_1_COLLAGE' | 'LAYOUT_2_JAYANTI';

// Intelligent Text-Balancing Helper
const getIntelligentFontSize = (text: string, isTitle: boolean, defaultSize?: number) => {
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

const wrapTextToArray = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  if (!text) return [];
  const words = text.split(' ');
  let lines = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
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
const clamp5 = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Each layout: frames[] with pixel center-coords + texts[] with y positions
// Text x is always CW5/2 (centered) except Layout 1, 6, 9 (right-side text)
const LAYOUT_DEFS: any[] = [
  null, // index 0 unused — layouts are 1-indexed

  // ── Layout 1: POLAROID_VERTICAL_STACK_WITH_BG_PHOTO ─────────────
  // 3 frames stacked left, text on right side
  {
    frames: [
      {x:248,  y:346,  w:389, h:538, rotation: 0},
      {x:238,  y:902,  w:410, h:538, rotation: 0},
      {x:243,  y:1459, w:378, h:538, rotation: 0},
    ],
    texts: [
      {contentKey:'title',        x:820, y:220,  fontSize:72, align:'center', maxWidth:420},
      {contentKey:'relationName', x:820, y:380,  fontSize:52, align:'center', maxWidth:420},
      {contentKey:'subtitle',     x:820, y:1820, fontSize:28, align:'center', maxWidth:420},
    ]
  },

  // ── Layout 2: SCATTERED_POLAROIDS_CARD_FAN ───────────────────────
  // 4 scattered rotated frames, text bottom strip
  {
    frames: [
      {x:308,  y:384,  w:400, h:576, rotation:-10},
      {x:702,  y:365,  w:432, h:614, rotation:  5},
      {x:227,  y:1094, w:389, h:576, rotation:-15},
      {x:637,  y:1258, w:454, h:672, rotation:  8},
    ],
    texts: [
      {contentKey:'title',        x:540, y:1680, fontSize:76, align:'center', maxWidth:900},
      {contentKey:'relationName', x:540, y:1790, fontSize:48, align:'center', maxWidth:900},
      {contentKey:'subtitle',     x:540, y:1876, fontSize:26, align:'center', maxWidth:900},
    ]
  },

  // ── Layout 3: CLEAN_GRID_2x2_CENTER_TEXT_BAND ───────────────────
  // 2 top + 2 bottom, text in center band
  {
    frames: [
      {x:302,  y:365,  w:454, h:538, rotation:0},
      {x:778,  y:365,  w:454, h:538, rotation:0},
      {x:302,  y:1440, w:454, h:576, rotation:0},
      {x:778,  y:1440, w:454, h:576, rotation:0},
    ],
    texts: [
      {contentKey:'title',        x:540, y:840,  fontSize:88, align:'center', maxWidth:900},
      {contentKey:'relationName', x:540, y:990,  fontSize:56, align:'center', maxWidth:900},
      {contentKey:'subtitle',     x:540, y:1100, fontSize:30, align:'center', maxWidth:860},
    ]
  },

  // ── Layout 4: ASYMMETRIC_TWO_COLUMN_WITH_HERO ───────────────────
  // Left: 2 stacked, Right: 1 tall hero. Text bottom.
  {
    frames: [
      {x:275,  y:490,  w:378, h:672,  rotation:0},
      {x:761,  y:758,  w:486, h:1056, rotation:0},
      {x:275,  y:1238, w:378, h:634,  rotation:0},
    ],
    texts: [
      {contentKey:'title',        x:540, y:1680, fontSize:76, align:'center', maxWidth:900},
      {contentKey:'relationName', x:540, y:1790, fontSize:52, align:'center', maxWidth:900},
      {contentKey:'subtitle',     x:540, y:1878, fontSize:26, align:'center', maxWidth:900},
    ]
  },

  // ── Layout 5: ORGANIC_SCATTERED_MULTI_SIZE ──────────────────────
  // 6 frames organic, text top-left and bottom-left open areas
  {
    frames: [
      {x:275,  y:634,  w:378, h:422, rotation:0},
      {x:745,  y:442,  w:518, h:576, rotation:0},
      {x:205,  y:1027, w:238, h:288, rotation:0},
      {x:475,  y:1056, w:302, h:346, rotation:2},
      {x:281,  y:1421, w:346, h:422, rotation:0},
      {x:702,  y:1536, w:324, h:384, rotation:0},
    ],
    texts: [
      {contentKey:'title',        x:270, y:120,  fontSize:72, align:'center', maxWidth:500},
      {contentKey:'relationName', x:270, y:240,  fontSize:48, align:'center', maxWidth:500},
      {contentKey:'subtitle',     x:270, y:1820, fontSize:26, align:'center', maxWidth:500},
    ]
  },

  // ── Layout 6: DARK_MOODBOARD_ASYMMETRIC_OVERLAP ─────────────────
  // 5 frames asymmetric, bold heading top-right, footer bottom
  {
    frames: [
      {x:232,  y:576,  w:356, h:576, rotation:0},
      {x:616,  y:557,  w:324, h:422, rotation:0},
      {x:443,  y:854,  w:346, h:480, rotation:0},
      {x:232,  y:1238, w:292, h:480, rotation:0},
      {x:616,  y:1267, w:410, h:422, rotation:0},
    ],
    texts: [
      {contentKey:'title',        x:810, y:90,   fontSize:82, align:'center', maxWidth:440},
      {contentKey:'relationName', x:810, y:220,  fontSize:52, align:'center', maxWidth:440},
      {contentKey:'subtitle',     x:540, y:1840, fontSize:28, align:'center', maxWidth:900},
    ]
  },

  // ── Layout 7: STAGGERED_CASCADE_DIAGONAL ────────────────────────
  // 4 staircase frames. Minimal text at very bottom.
  {
    frames: [
      {x:297,  y:442,  w:378, h:576, rotation:0},
      {x:518,  y:797,  w:432, h:634, rotation:0},
      {x:254,  y:1248, w:400, h:576, rotation:0},
      {x:659,  y:1373, w:410, h:634, rotation:0},
    ],
    texts: [
      {contentKey:'title',        x:540, y:100,  fontSize:76, align:'center', maxWidth:900},
      {contentKey:'relationName', x:540, y:220,  fontSize:52, align:'center', maxWidth:900},
      {contentKey:'subtitle',     x:540, y:1870, fontSize:26, align:'center', maxWidth:900},
    ]
  },

  // ── Layout 8: TILTED_STACK_PLAYFUL ──────────────────────────────
  // 3 large tilted frames. Text top-right gap + bottom footer.
  {
    frames: [
      {x:400,  y:403,  w:626, h:576, rotation:-3},
      {x:513,  y:883,  w:486, h:538, rotation: 5},
      {x:410,  y:1382, w:562, h:538, rotation:-2},
    ],
    texts: [
      {contentKey:'title',        x:900, y:140,  fontSize:72, align:'right', maxWidth:340},
      {contentKey:'relationName', x:900, y:260,  fontSize:48, align:'right', maxWidth:340},
      {contentKey:'subtitle',     x:540, y:1860, fontSize:26, align:'center', maxWidth:900},
    ]
  },

  // ── Layout 9: CLEAN_MAGAZINE_EDITORIAL_3ROW ─────────────────────
  // 5 frames (missing right-center = text block). Text in right column.
  {
    frames: [
      {x:292,  y:365,  w:475, h:576, rotation:0},
      {x:788,  y:365,  w:475, h:576, rotation:0},
      {x:292,  y:979,  w:475, h:538, rotation:0},
      {x:292,  y:1574, w:475, h:538, rotation:0},
      {x:788,  y:1574, w:475, h:538, rotation:0},
    ],
    texts: [
      {contentKey:'title',        x:824, y:880,  fontSize:78, align:'center', maxWidth:440},
      {contentKey:'relationName', x:824, y:1020, fontSize:52, align:'center', maxWidth:440},
      {contentKey:'subtitle',     x:824, y:1140, fontSize:28, align:'center', maxWidth:440},
    ]
  },

  // ── Layout 10: SCRAPBOOK_MIXED_MEDIA ────────────────────────────
  // 3 slightly rotated frames. Text in open center-right + bottom-left.
  {
    frames: [
      {x:302,  y:653,  w:432, h:614, rotation:-2},
      {x:680,  y:499,  w:324, h:422, rotation: 3},
      {x:729,  y:1286, w:378, h:576, rotation: 0},
    ],
    texts: [
      {contentKey:'title',        x:740, y:900,  fontSize:76, align:'center', maxWidth:500},
      {contentKey:'relationName', x:740, y:1040, fontSize:52, align:'center', maxWidth:500},
      {contentKey:'subtitle',     x:270, y:1800, fontSize:28, align:'center', maxWidth:500},
    ]
  },

  // ── Layout 11: POLAROID_GRID_OVER_FULL_PHOTO ────────────────────
  // 4 polaroids on full-bg photo. Large text bottom open area.
  {
    frames: [
      {x:259,  y:394,  w:346, h:480, rotation:-3},
      {x:734,  y:336,  w:346, h:480, rotation: 4},
      {x:270,  y:1037, w:324, h:461, rotation:-2},
      {x:713,  y:1085, w:346, h:480, rotation: 3},
    ],
    texts: [
      {contentKey:'title',        x:540, y:1580, fontSize:88, align:'center', maxWidth:900},
      {contentKey:'relationName', x:540, y:1730, fontSize:56, align:'center', maxWidth:900},
      {contentKey:'subtitle',     x:540, y:1860, fontSize:28, align:'center', maxWidth:900},
    ]
  },

  // ── Layout 12: INVERTED_TRIANGLE_FESTIVE ────────────────────────
  // 1 hero top + 2 below forming V-shape. Large text bottom open area.
  {
    frames: [
      {x:459,  y:518,  w:594, h:576, rotation: 0},
      {x:275,  y:1046, w:378, h:480, rotation:-5},
      {x:675,  y:1085, w:378, h:480, rotation: 5},
    ],
    texts: [
      {contentKey:'title',        x:540, y:1450, fontSize:92, align:'center', maxWidth:940},
      {contentKey:'relationName', x:540, y:1620, fontSize:60, align:'center', maxWidth:900},
      {contentKey:'subtitle',     x:540, y:1840, fontSize:30, align:'center', maxWidth:860},
    ]
  },
];

// ── MASTER: applyFixedLayout ──────────────────────────────────────
// Called before render. Picks layout from styleConfig.layoutStyleId.
// Overwrites ALL frame positions and text positions with pre-calculated values.
// Preserves AI-provided colors, border styles, and text content/colors.
const applyFixedLayout = (blueprint: any, layoutStyleId: number): any => {
  if (!blueprint) return blueprint;

  try {
    const lid = clamp5(layoutStyleId, 1, 12);
    const def = LAYOUT_DEFS[lid];
    if (!def) { console.warn(`⚠️ No layout def for id=${lid}`); return blueprint; }

    console.log(`🧠 Fixed Layout Engine v5: applying layout ${lid}...`);

    // ── Apply photo frames ───────────────────────────────────────
    const aiFrames = blueprint.imageFrames || [];
    blueprint.imageFrames = def.frames.map((f: any, i: number) => {
      const ai = aiFrames[i] || aiFrames[0] || {};
      return {
        shape:       ai.shape       || 'rectangle',
        borderColor: ai.borderColor || '#FFFFFF',
        borderWidth: clamp5(ai.borderWidth || 14, 8, 22),
        shadow:      true,
        x: f.x, y: f.y, w: f.w, h: f.h, rotation: f.rotation,
      };
    });

    // ── Apply text blocks ────────────────────────────────────────
    const aiTexts  = blueprint.textBlocks || [];
    const maxWDef  = CW5 - 120;
    blueprint.textBlocks = def.texts
      .map((td: any) => {
        const ai = aiTexts.find((t: any) => t.contentKey === td.contentKey) || {};
        const text = (ai.text || '').trim();
        if (!text) return null;
        return {
          contentKey: td.contentKey,
          text,
          x:          td.x,
          y:          td.y,
          fontSize:   td.fontSize,
          fontFamily: ai.fontFamily || 'sans-serif',
          color:      ai.color      || '#FFFFFF',
          align:      td.align,
          maxWidth:   td.maxWidth   || maxWDef,
          isBold:     ai.isBold     || false,
          isItalic:   ai.isItalic   || false,
        };
      })
      .filter(Boolean);

    console.log(`✅ Layout ${lid} applied: ${def.frames.length} frames, ${blueprint.textBlocks.length} text blocks`);

  } catch (err) {
    console.warn("⚠️ Fixed Layout Engine v5 error (non-fatal):", err);
  }
  return blueprint;
};


// --- JSON DYNAMIC RENDERING ENGINE ---
const renderDynamicJSON = (ctx: CanvasRenderingContext2D, data: any, blueprint: any) => {
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
    blueprint.decorations.forEach((dec: any) => {
      ctx.save();
      ctx.globalAlpha = dec.alpha || 1.0;
      ctx.fillStyle = dec.color || '#000000';
      ctx.translate(dec.x || 0, dec.y || 0);
      if (dec.rotation) ctx.rotate((dec.rotation * Math.PI) / 180);
      
      ctx.beginPath();
      if (dec.type === 'circle' && dec.radius) {
        ctx.arc(0, 0, dec.radius, 0, Math.PI * 2);
      } else if (dec.type === 'rect' && dec.w && dec.h) {
        ctx.rect(-dec.w/2, -dec.h/2, dec.w, dec.h);
      }
      ctx.fill();
      ctx.restore();
    });
  }

  // 3. Draw Images inside Frames
  if (blueprint.imageFrames && Array.isArray(blueprint.imageFrames) && data.photos && data.photos.length > 0) {
    blueprint.imageFrames.forEach((frame: any, i: number) => {
      // Loop photos if AI generated more frames than photos
      const img = data.photos[i % data.photos.length];
      if (!img) return;

      const { x, y, w, h, rotation = 0, borderWidth = 0, borderColor = "#FFF", shadow = false } = frame;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);

      // Shadow
      if (shadow) {
        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 10;
      }

      // Border/Background
      ctx.fillStyle = borderColor;
      ctx.fillRect(-w/2, -h/2, w, h);
      ctx.shadowColor = "transparent"; // Reset shadow for inner drawing

      // Inner Image Area
      const innerW = w - (borderWidth * 2);
      const innerH = h - (borderWidth * 2);
      
      // Object-fit Cover Logic
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const targetRatio = innerW / innerH;
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      
      if (imgRatio > targetRatio) { 
        sw = sh * targetRatio; sx = (img.naturalWidth - sw) / 2; 
      } else { 
        sh = sw / targetRatio; sy = (img.naturalHeight - sh) / 2; 
      }

      ctx.beginPath();
      ctx.rect(-innerW/2, -innerH/2, innerW, innerH);
      ctx.clip();
      ctx.drawImage(img, sx, sy, sw, sh, -innerW/2, -innerH/2, innerW, innerH);
      
      ctx.restore();
    });
  }

  // 4. Draw Text Blocks dynamically
  if (blueprint.textBlocks && Array.isArray(blueprint.textBlocks)) {
    blueprint.textBlocks.forEach((tb: any) => {
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
      lines.forEach((line: string, index: number) => {
        ctx.fillText(line, tb.x, startY + (index * lineHeight));
      });
      
      ctx.restore();
    });
  }
};


// --- FALLBACK A: 5-Photo Permanent Hardcoded Design (With Text Balancing) ---
const drawSmartPolaroid = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, rotateDeg: number) => {
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(rotateDeg * Math.PI / 180);
  ctx.translate(-w / 2, -h / 2);
  ctx.shadowColor = "rgba(0,0,0,0.15)"; ctx.shadowBlur = 20; ctx.shadowOffsetX = 8; ctx.shadowOffsetY = 12;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, w, h);
  const padding = 20; const bottomChin = 80;
  const imgW = w - (padding * 2); const imgH = h - padding - bottomChin;
  ctx.shadowColor = "transparent";
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const targetRatio = imgW / imgH;
  let sx=0, sy=0, sw=img.naturalWidth, sh=img.naturalHeight;
  if (imgRatio > targetRatio) { sw = sh * targetRatio; sx = (img.naturalWidth - sw) / 2; } 
  else { sh = sw / targetRatio; sy = (img.naturalHeight - sh) / 2; }
  ctx.beginPath(); ctx.rect(padding, padding, imgW, imgH); ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh, padding, padding, imgW, imgH);
  ctx.restore();
};

const renderFallbackLayout1 = async (ctx: CanvasRenderingContext2D, data: any) => {
  ctx.canvas.width = 1080; ctx.canvas.height = 1920;
  ctx.fillStyle = '#F9F5EB'; ctx.fillRect(0, 0, 1080, 1920);

  ctx.fillStyle = '#D4AF37'; ctx.globalAlpha = 0.15;
  ctx.beginPath(); ctx.arc(150, 200, 300, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(900, 1600, 400, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1.0;

  const pW = 800, pH = 800, pX = 140, pY = 560;
  ctx.shadowColor = "rgba(0,0,0,0.1)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 15;
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(pX, pY, pW, pH);
  ctx.shadowColor = "transparent";

  const layouts: any = { 
    2: [[100, 200, 450, 550, -5], [550, 1100, 450, 550, 5]], 
    3: [[80, 150, 400, 500, -8], [600, 150, 400, 500, 8], [340, 1200, 400, 500, -2]], 
    4: [[60, 100, 380, 480, -10], [640, 100, 380, 480, 10], [60, 1300, 380, 480, 5], [640, 1300, 380, 480, -5]], 
    5: [[50, 80, 350, 450, -12], [680, 80, 350, 450, 12], [50, 1350, 350, 450, 8], [680, 1350, 350, 450, -8], [365, 100, 350, 450, 0]] 
  };
  let images = data.photos || [];
  if (images.length === 1) images = [images[0], images[0]]; // Duplicate safely for layout
  const imgCount = Math.max(2, Math.min(5, images.length));
  
  images.slice(0, imgCount).forEach((img: any, i: number) => { 
    if (layouts[imgCount][i]) {
      const [x, y, w, h, r] = layouts[imgCount][i]; 
      drawSmartPolaroid(ctx, img, x, y, w, h, r); 
    }
  });

  const centerX = 1080 / 2;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  
  const tSize = getIntelligentFontSize(data.title, true);
  const sSize = getIntelligentFontSize(data.subtitle, false);
  const relSize = 36;

  ctx.font = `italic ${sSize}px Georgia, serif`;
  const msgLines = wrapTextToArray(ctx, data.subtitle || '', pW - 100);
  
  let totalH = tSize;
  if (data.relationName) totalH += 40 + relSize;
  if (data.termLine) totalH += 30 + 20;
  if (msgLines.length > 0) totalH += 50 + (msgLines.length * (sSize * 1.5));

  let currentY = pY + (pH / 2) - (totalH / 2) + (tSize / 2);

  ctx.fillStyle = '#1A1A1A'; ctx.font = `bold ${tSize}px "Helvetica Neue", sans-serif`; 
  ctx.fillText(data.title || '', centerX, currentY); 

  if (data.relationName) {
    currentY += 40 + (relSize / 2);
    ctx.fillStyle = '#D4AF37'; ctx.font = `bold ${relSize}px sans-serif`; 
    ctx.fillText(data.relationName.toUpperCase(), centerX, currentY); 
  }

  if (data.termLine) {
    currentY += 30 + 10;
    ctx.fillStyle = '#666666'; ctx.font = `600 20px sans-serif`; 
    ctx.fillText(data.termLine, centerX, currentY); 
  }

  if (msgLines.length > 0) {
    currentY += 50 + (sSize * 0.75);
    ctx.fillStyle = '#4A4A4A'; ctx.font = `italic ${sSize}px Georgia, serif`;
    for (let line of msgLines) {
      ctx.fillText(line, centerX, currentY);
      currentY += (sSize * 1.5);
    }
  }
};


// --- FALLBACK B: 1-Photo Permanent Hardcoded Design (With Text Balancing) ---
const renderFallbackLayout2 = async (ctx: CanvasRenderingContext2D, data: any) => {
  ctx.canvas.width = 1080; ctx.canvas.height = 1080;

  ctx.fillStyle = '#F4F1EC'; ctx.fillRect(0, 0, 1080, 1080);
  ctx.fillStyle = '#7D95A5'; ctx.beginPath(); ctx.ellipse(0, 0, 450, 350, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#B3A99D'; ctx.beginPath(); ctx.ellipse(1080, 1080, 400, 350, 0, 0, Math.PI * 2); ctx.fill();

  const mX = 90, mY = 90, mW = 900, mH = 900, imgH = mH * 0.65;
  
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 16;
  ctx.strokeRect(mX - 8, mY - 8, mW + 16, mH + 16);

  if (data.photos && data.photos[0]) {
    ctx.save(); ctx.beginPath(); ctx.rect(mX, mY, mW, imgH); ctx.clip();
    const imgRatio = data.photos[0].width / data.photos[0].height;
    let sx = 0, sy = 0, sw = data.photos[0].width, sh = data.photos[0].height;
    if (imgRatio > (mW/imgH)) { sw = sh * (mW/imgH); sx = (data.photos[0].width - sw) / 2; } 
    else { sh = sw / (mW/imgH); sy = (data.photos[0].height - sh) / 2; }
    ctx.drawImage(data.photos[0], sx, sy, sw, sh, mX, mY, mW, imgH);
    ctx.restore();
  } else {
    ctx.fillStyle = '#E5E5E5'; ctx.fillRect(mX, mY, mW, imgH);
  }

  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(mX, mY + imgH, mW, mH - imgH);

  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const tSize = getIntelligentFontSize(data.title, true);
  const sSize = getIntelligentFontSize(data.subtitle, false);
  
  ctx.font = `italic ${sSize}px "Georgia", serif`;
  const msgLines = wrapTextToArray(ctx, data.subtitle || '', mW - 100);
  
  const panelCenterY = mY + imgH + ((mH - imgH) / 2);
  let totalH = tSize + 30 + (msgLines.length * (sSize * 1.5));
  let currentY = panelCenterY - (totalH / 2) + (tSize / 2);

  ctx.fillStyle = '#2B3A4A'; ctx.font = `bold ${tSize}px sans-serif`;
  ctx.fillText(data.title || '', mX + mW/2, currentY);

  currentY += 30 + (sSize * 0.75);
  ctx.fillStyle = '#4A4A4A'; ctx.font = `italic ${sSize}px "Georgia", serif`;
  for (let line of msgLines) {
    ctx.fillText(line, mX + mW/2, currentY);
    currentY += (sSize * 1.5);
  }
};

// --- MAIN EXECUTION ENGINE ---
export const generatePosterCanvas = async (canvas: HTMLCanvasElement, layoutType: LayoutType, data: any, styleConfig: any) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas failed');

  // 1. Try JSON Dynamic Rendering First
  if (styleConfig && styleConfig.isDynamic && styleConfig.blueprint) {
    try {
      console.log("🚀 Executing dynamic AI JSON architecture...");
      if (layoutType === 'LAYOUT_1_COLLAGE') {
        ctx.canvas.width = 1080; ctx.canvas.height = 1920;
      } else {
        ctx.canvas.width = 1080; ctx.canvas.height = 1080;
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
