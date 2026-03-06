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
      
      renderDynamicJSON(ctx, data, styleConfig.blueprint);
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