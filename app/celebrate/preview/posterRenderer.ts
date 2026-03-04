export type LayoutType = 'LAYOUT_1_COLLAGE' | 'LAYOUT_2_JAYANTI';

const getIntelligentFontSize = (text: string, isTitle: boolean, aiSize?: string, defaultSize?: number) => {
  if (aiSize && !isNaN(parseInt(aiSize))) return parseInt(aiSize);
  if (defaultSize) return defaultSize;
  const count = text.length;
  if (isTitle) {
    if (count <= 20) return 55;
    if (count <= 50) return 40;
    return 30;
  } else {
    if (count <= 50) return 24;
    return 18;
  }
};

const wrapTextToArray = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
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

const drawSmartPolaroid = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, rotateDeg: number, frameColor: string) => {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(rotateDeg * Math.PI / 180);
  ctx.translate(-w / 2, -h / 2);
  ctx.shadowColor = "rgba(0,0,0,0.15)"; ctx.shadowBlur = 20; ctx.shadowOffsetX = 8; ctx.shadowOffsetY = 12;
  ctx.fillStyle = frameColor || "#FDFDFD";
  ctx.fillRect(0, 0, w, h);
  const paddingX = 20; const paddingY = 20; const bottomChin = 90;
  const imgW = w - (paddingX * 2); const imgH = h - paddingY - bottomChin;
  ctx.shadowColor = "transparent";
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const targetRatio = imgW / imgH;
  let sx, sy, sw, sh;
  if (imgRatio < 0.65) { sw = img.naturalWidth; sh = img.naturalWidth / targetRatio; sx = 0; sy = 0; }
  else { if (imgRatio > targetRatio) { sh = img.naturalHeight; sw = img.naturalHeight * targetRatio; sy = 0; sx = (img.naturalWidth - sw) / 2; } else { sw = img.naturalWidth; sh = img.naturalWidth / targetRatio; sx = 0; sy = (img.naturalHeight - sh) / 2; } }
  ctx.beginPath(); ctx.rect(paddingX, paddingY, imgW, imgH); ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh, paddingX, paddingY, imgW, imgH);
  ctx.fillStyle = "rgba(255,255,240,0.05)"; ctx.fillRect(paddingX, paddingY, imgW, imgH);
  ctx.restore();
};

// --- LAYOUT 1: ORIGINAL 5-SECTIONS DESIGN (1080x1920) ---
const renderLayout1 = async (ctx: CanvasRenderingContext2D, data: any, style: any) => {
  ctx.canvas.width = 1080; 
  ctx.canvas.height = 1920;

  const bg = style?.backgroundColor || '#F9F5EB';
  const decorCol = style?.decorativeAccentColor || '#A89F91';
  const cardCol = style?.greetingCardColor || '#FFFFFF';
  const titleCol = style?.titleTextColor || '#1A1A1A';
  const subCol = style?.subtitleTextColor || '#333333';
  const frameCol = style?.frameColor || '#FFFFFF';

  ctx.fillStyle = bg; 
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = decorCol; ctx.globalAlpha = 0.2;
  ctx.beginPath(); ctx.arc(100, 300, 10, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(950, 1700, 15, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1.0;

  const pW = 750; const pH = 750; const pX = (ctx.canvas.width - pW) / 2; const pY = (ctx.canvas.height - pH) / 2;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.15)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
  ctx.fillStyle = cardCol;
  ctx.beginPath();
  const cutoutSize = 20; const gap = 30;
  ctx.moveTo(pX, pY);
  for (let i = pX + gap; i < pX + pW - gap; i += (cutoutSize + gap)) { 
    ctx.lineTo(i, pY); ctx.lineTo(i, pY + cutoutSize); ctx.lineTo(i + cutoutSize, pY + cutoutSize); ctx.lineTo(i + cutoutSize, pY); 
  }
  ctx.lineTo(pX + pW, pY); ctx.lineTo(pX + pW, pY + pH); ctx.lineTo(pX, pY + pH);
  ctx.closePath(); ctx.fill();
  ctx.restore();

  const layouts: any = { 
    2: [[80, 150, 480, 600, -6], [520, 1050, 480, 600, 6]], 
    3: [[60, 100, 450, 550, -8], [570, 100, 450, 550, 8], [315, 1100, 450, 550, -2]], 
    4: [[40, 100, 420, 520, -10], [620, 100, 420, 520, 10], [50, 1100, 420, 520, 5], [610, 1100, 420, 520, -5]], 
    5: [[30, 80, 400, 500, -12], [650, 80, 400, 500, 12], [40, 1150, 400, 500, 8], [640, 1150, 400, 500, -8], [340, 80, 400, 500, 0]] 
  };
  
  let imagesToDraw = data.photos || [];
  if (imagesToDraw.length === 1) imagesToDraw.push(imagesToDraw[0]);
  const imgCount = Math.max(2, Math.min(5, imagesToDraw.length));
  const currentLayout = layouts[imgCount] || layouts[2];

  imagesToDraw.slice(0, imgCount).forEach((img: any, i: number) => { 
    if (currentLayout[i]) { 
      const [x, y, w, h, r] = currentLayout[i]; 
      drawSmartPolaroid(ctx, img, x, y, w, h, r, frameCol); 
    } 
  });

  const centerX = ctx.canvas.width / 2;
  const cardCenterY = pY + (pH / 2);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const tSize = getIntelligentFontSize(data.title, true, style?.titleFontSize, 55);
  const relationSize = 36;
  const termSize = 20;
  const sSize = getIntelligentFontSize(data.subtitle, false, style?.subtitleFontSize, 24);

  ctx.font = `italic ${sSize}px Georgia, serif`;
  const msgText = data.subtitle.length > 140 ? data.subtitle.substring(0, 140) + '...' : data.subtitle;
  const msgLines = wrapTextToArray(ctx, msgText, pW - 140);
  const msgLineHeight = sSize * 1.5;

  let totalContentHeight = tSize; 
  const gap1 = 40; const gap2 = 30; const gap3 = 50;

  if (data.relationName) totalContentHeight += gap1 + relationSize;
  if (data.termLine) totalContentHeight += gap2 + termSize;
  if (msgText) totalContentHeight += gap3 + (msgLines.length * msgLineHeight);

  let currentY = cardCenterY - (totalContentHeight / 2) + (tSize / 2);

  ctx.font = `italic ${tSize}px "Comic Sans MS", cursive, sans-serif`; 
  ctx.fillStyle = titleCol; 
  ctx.fillText(data.title, centerX, currentY); 

  if (data.relationName) {
    currentY += gap1 + (relationSize / 2);
    ctx.font = `bold ${relationSize}px Helvetica, Arial, sans-serif`; 
    ctx.fillStyle = titleCol; 
    ctx.fillText(data.relationName.toUpperCase(), centerX, currentY); 
  }

  if (data.termLine) {
    currentY += gap2 + (termSize / 2);
    ctx.font = `500 ${termSize}px Helvetica, Arial, sans-serif`; 
    ctx.fillStyle = subCol; 
    ctx.fillText(data.termLine, centerX, currentY); 
  }

  if (msgText) {
    currentY += gap3 + (msgLineHeight / 2) - 10;
    ctx.font = `italic ${sSize}px Georgia, serif`; 
    ctx.fillStyle = subCol;
    for (let line of msgLines) {
      ctx.fillText(line, centerX, currentY);
      currentY += msgLineHeight;
    }
  }

  ctx.textBaseline = 'alphabetic';
  ctx.font = 'bold 16px sans-serif'; 
  ctx.fillStyle = decorCol; 
  ctx.fillText("CREATED WITH JASHN", centerX, ctx.canvas.height - 40);
};

// --- LAYOUT 2: NEW GANDHI JAYANTI DESIGN (1080x1080) CLEAN NO WATERMARK ---
const renderLayout2 = async (ctx: CanvasRenderingContext2D, data: any, style: any) => {
  ctx.canvas.width = 1080;
  ctx.canvas.height = 1080;

  // New Image Exact Color Fallbacks
  const bg = style?.posterBackgroundColor || '#F4F1EC';
  const textPanelBg = style?.textPanelColor || '#F3EFE6';
  const titleCol = style?.titleTextColor || '#2B3A4A'; // Dark Slate Blue
  const subCol = style?.subtitleTextColor || '#1A1A1A';
  const align = style?.textAlignment || 'center';

  const tSize = getIntelligentFontSize(data.title || '', true, style?.titleFontSize, 72);
  const sSize = getIntelligentFontSize(data.subtitle || '', false, style?.subtitleFontSize, 32);

  // 1. Base Textured-look Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1080);

  // 2. 4 Large Corner Blobs (Based exactly on new image)
  ctx.globalAlpha = 0.8;
  
  // Top-Left (Dusty Blue)
  ctx.fillStyle = style?.decorativeShape1Color || '#7D95A5';
  ctx.beginPath(); ctx.ellipse(0, 0, 450, 350, 0, 0, Math.PI * 2); ctx.fill();
  
  // Top-Right (Soft Greenish)
  ctx.fillStyle = style?.decorativeShape2Color || '#C3D5C0';
  ctx.beginPath(); ctx.ellipse(1080, 0, 400, 450, 0, 0, Math.PI * 2); ctx.fill();
  
  // Bottom-Left (Muted Sage)
  ctx.fillStyle = style?.decorativeShape3Color || '#BED0C3';
  ctx.beginPath(); ctx.ellipse(0, 1080, 500, 400, 0, 0, Math.PI * 2); ctx.fill();
  
  // Bottom-Right (Taupe/Brownish)
  ctx.fillStyle = style?.decorativeShape4Color || '#B3A99D';
  ctx.beginPath(); ctx.ellipse(1080, 1080, 400, 350, 0, 0, Math.PI * 2); ctx.fill();

  // Thin Gold Curved Lines (Accents)
  ctx.strokeStyle = style?.accentLineColor || '#D1B67F';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(1080, 250, 300, Math.PI/2, Math.PI); ctx.stroke();
  ctx.beginPath(); ctx.arc(150, 1080, 250, 0, -Math.PI/2); ctx.stroke();
  ctx.globalAlpha = 1.0;

  // 3. Central Container (Image + Text Panel combined)
  const mX = 90, mY = 90, mW = 900, mH = 900;
  
  // Outer White Frame/Border around the entire container
  ctx.strokeStyle = style?.imageFrameBorderColor || '#FFFFFF';
  ctx.lineWidth = 20;
  ctx.strokeRect(mX - 10, mY - 10, mW + 20, mH + 20);

  // Image Section (Top 70%)
  const imgH = mH * 0.7;
  ctx.fillStyle = '#E5E5E5';
  ctx.fillRect(mX, mY, mW, imgH);

  if (data.photos && data.photos[0]) {
    ctx.save();
    ctx.beginPath(); ctx.rect(mX, mY, mW, imgH); ctx.clip();
    const imgRatio = data.photos[0].width / data.photos[0].height;
    const targetRatio = mW / imgH;
    let sx = 0, sy = 0, sw = data.photos[0].width, sh = data.photos[0].height;
    
    // Fit Image inside covering area perfectly
    if (imgRatio > targetRatio) { 
        sw = data.photos[0].height * targetRatio; sx = (data.photos[0].width - sw) / 2; 
    } else { 
        sh = data.photos[0].width / targetRatio; sy = (data.photos[0].height - sh) / 2; 
    }
    
    ctx.drawImage(data.photos[0], sx, sy, sw, sh, mX, mY, mW, imgH);
    ctx.restore();
  }

  // 4. Text Panel Section (Bottom 30%)
  const panelY = mY + imgH;
  const panelH = mH - imgH;
  ctx.fillStyle = textPanelBg;
  ctx.fillRect(mX, panelY, mW, panelH);

  // 5. Intelligent Text Centering inside Text Panel
  const centerX = mX + (mW / 2);
  const panelCenterY = panelY + (panelH / 2);
  ctx.textAlign = align as CanvasTextAlign;
  ctx.textBaseline = 'middle';

  ctx.font = `italic ${sSize}px "Georgia", serif`;
  const msgLines = wrapTextToArray(ctx, data.subtitle || '', mW - 120);
  const msgLineHeight = sSize * 1.5;

  let totalContentHeight = tSize + 25 + (msgLines.length * msgLineHeight);
  let currentY = panelCenterY - (totalContentHeight / 2) + (tSize / 2);

  // Print Title
  ctx.fillStyle = titleCol; 
  ctx.font = `bold ${tSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
  ctx.fillText(data.title || 'Special Occasion', centerX, currentY);

  // Print Subtitle/Quote
  currentY += 25 + (msgLineHeight / 2);
  ctx.fillStyle = subCol; 
  ctx.font = `italic ${sSize}px "Georgia", serif`;
  for (let line of msgLines) {
    ctx.fillText(line, centerX, currentY);
    currentY += msgLineHeight;
  }
};

export const generatePosterCanvas = async (canvas: HTMLCanvasElement, layoutType: LayoutType, data: any, styleConfig: any) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas failed');
  if (layoutType === 'LAYOUT_1_COLLAGE') await renderLayout1(ctx, data, styleConfig);
  else if (layoutType === 'LAYOUT_2_JAYANTI') await renderLayout2(ctx, data, styleConfig);
  return canvas;
};