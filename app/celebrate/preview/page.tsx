'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// --- ADDED RefreshCw ICON HERE ---
import { Download, Share2, Volume2, VolumeX, Gift, Home, MessageCircle, QrCode, X, Send, User, Loader2, Info, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { generatePosterCanvas } from './posterRenderer';

const MOBILE_REF = { width: 430, height: 932 };
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
  balloonHeightVariations: [0.156, 0.216, 0.125, 0.260, 0.161, 0.244, 0.205, 0.122],
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
  commentSendIconSize: 20,
};

const ACHIEVEMENT_MILESTONES = [
  { level: 1, required: 100, name: "Beginner", color: "#CD7F32" },
  { level: 2, required: 300, name: "Enthusiast", color: "#C0C0C0" },
  { level: 3, required: 600, name: "Expert", color: "#FFD700" },
  { level: 4, required: 4600, name: "Champion", color: "#E5E4E2" },
  { level: 5, required: 9600, name: "Master", color: "#B9F2FF" },
  { level: 6, required: 15600, name: "Legend", color: "#9966CC" },
  { level: 7, required: 85600, name: "Titan", color: "#FF6347" },
  { level: 8, required: 165600, name: "Mythic", color: "#FF1493" },
  { level: 9, required: 255600, name: "Ultimate", color: "#00CED1" },
  { level: 10, required: 255601, name: "Limitless", color: "#d4af37", special: true },
];

const BIRTHDAY_SELF_LINES = [
  "It's my birthday", "My birthday today", "Birthday day today", "Birthday time", "My special day", "Birthday vibes", "Birthday mood", "Feeling birthday", "Born today", "My big day",
];

let birthdayLineIndex = 0;

const useProportionalScale = () => {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const calc = () => {
      const d = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
      setScale(Math.max(1, Math.min(d / MOBILE_DIAGONAL, 2.5)));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return scale;
};

const useScaled = (scale: number) => {
  return useMemo(() => {
    const s: any = { ...BASE };
    for (const key in BASE) {
      if (key === 'balloonHeightVariations') continue;
      s[key] = (BASE as any)[key] * scale;
    }
    return s as typeof BASE;
  }, [scale]);
};

type ImageFitMode = 'cover' | 'contain';

const determineImageFit = (img: HTMLImageElement): ImageFitMode => {
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

interface Comment { id: string; name: string; message: string; timestamp: string; storyId?: string; }

const formatTime = (iso: string) => {
  try { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
  catch { return ''; }
};

const getOrdinal = (n: string) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = parseInt(n) || 0;
  return n + (s[(v % 100 - 20) % 10] || s[v % 100] || s[0]);
};

const BALLOON_COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA', '#FF9F43', '#7BED9F', '#70A1FF', '#5352ED'];
const getRandomColor = (exclude?: string) => {
  let c;
  do { c = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)]; } while (c === exclude);
  return c;
};
const darken = (hex: string, pct: number) => {
  const n = parseInt(hex.replace('#', ''), 16);
  const a = Math.round(2.55 * pct);
  return `#${((1 << 24) | (Math.max(0, (n >> 16) - a) << 16) | (Math.max(0, ((n >> 8) & 0xFF) - a) << 8) | Math.max(0, (n & 0xFF) - a)).toString(16).slice(1)}`;
};
const lighten = (hex: string, pct: number) => {
  const n = parseInt(hex.replace('#', ''), 16);
  const a = Math.round(2.55 * pct);
  return `#${((1 << 24) | (Math.min(255, (n >> 16) + a) << 16) | (Math.min(255, ((n >> 8) & 0xFF) + a) << 8) | Math.min(255, (n & 0xFF) + a)).toString(16).slice(1)}`;
};

const playBalloonPopSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
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
    for (let i = 0; i < bufferSize; i++) { noiseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2.5); }
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
    for (let channel = 0; channel < 2; channel++) {
      const impulseData = impulseBuffer.getChannelData(channel);
      for (let i = 0; i < reverbLength; i++) { const decay = Math.pow(1 - i / reverbLength, 2); impulseData[i] = (Math.random() * 2 - 1) * decay * 0.5; }
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
    setTimeout(() => audioCtx.close(), 2000);
  } catch (e) {}
};

const PremiumLoader = ({ scale }: { scale: number }) => (
  <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
      style={{ width: 48 * scale, height: 48 * scale, borderWidth: 4 * scale }}
      className="rounded-full border-[#d4af37] border-t-transparent"
    />
  </div>
);

const triggerProfessionalConfetti = () => {
  const isMobile = window.innerWidth < 768;

  const colors = [
    '#FFD700', '#FF6B8A', '#B388FF', '#FF8A80',
    '#FFAB91', '#82B1FF', '#FF4444', '#FFB347',
    '#FF69B4', '#00CED1', '#7FFF00', '#FF6347'
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

  confetti({
    ...crackerDefaults,
    angle: 60,
    origin: { x: 0, y: 1 }
  });

  confetti({
    ...crackerDefaults,
    angle: 120,
    origin: { x: 1, y: 1 }
  });

  setTimeout(() => {
    confetti({
      ...crackerDefaults,
      particleCount: isMobile ? 50 : 80,
      angle: 55,
      spread: 60,
      origin: { x: 0.05, y: 0.95 }
    });
    confetti({
      ...crackerDefaults,
      particleCount: isMobile ? 50 : 80,
      angle: 125,
      spread: 60,
      origin: { x: 0.95, y: 0.95 }
    });
  }, 200);
};

let confettiHasFired = false;

const PopCounter = ({ count, show }: { count: number; show: boolean }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ zIndex: 100 }}
        >
          <span
            className="font-bold text-white"
            style={{
              fontSize: 72,
              textShadow: '0 2px 20px rgba(0,0,0,0.7), 0 4px 40px rgba(0,0,0,0.4)'
            }}
          >
            {count}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const getCurrentAchievement = (count: number) => {
  for (let i = ACHIEVEMENT_MILESTONES.length - 1; i >= 0; i--) {
    if (count >= ACHIEVEMENT_MILESTONES[i].required) {
      return ACHIEVEMENT_MILESTONES[i];
    }
  }
  return null;
};

const TrophySVG = ({ color, size = 20, glow = false }: { color: string; size?: number; glow?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={glow ? { filter: `drop-shadow(0 0 6px ${color})` } : {}}>
    <path d="M6 2H18V14C18 17.3137 15.3137 20 12 20C8.68629 20 6 17.3137 6 14V2Z" fill={color} fillOpacity="0.9"/>
    <path d="M6 6H3C3 9.31371 4.34315 11 6 11" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M18 6H21C21 9.31371 19.6569 11 18 11" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 20V22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 22H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 13L10.5 14.5L15 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LockedBadgeSVG = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14 5H18L15.5 7.5L16.5 11L12 9L7.5 11L8.5 7.5L6 5H10L12 2Z"
      stroke="#888" strokeWidth="1.2" strokeDasharray="2 1.5" fill="rgba(100,100,100,0.12)"
      strokeLinejoin="round"/>
    <rect x="9.5" y="12" width="5" height="4" rx="1" fill="#666" fillOpacity="0.8"/>
    <path d="M10.5 12V10.5C10.5 9.4 11.4 8.5 12 8.5C12.6 8.5 13.5 9.4 13.5 10.5V12"
      stroke="#666" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    <circle cx="12" cy="14" r="0.6" fill="#333"/>
    <path d="M12 14.6V15.5" stroke="#333" strokeWidth="0.8" strokeLinecap="round"/>
  </svg>
);

const AchievementBadge = ({
  globalCount,
  onClick,
  S
}: {
  globalCount: number;
  onClick: () => void;
  S: typeof BASE;
}) => {
  const achievement = getCurrentAchievement(globalCount);

  if (!achievement) {
    return (
      <motion.button
        onClick={onClick}
        className="flex items-center justify-center rounded-full backdrop-blur-md border-2 transition-all relative overflow-hidden"
        style={{
          width: S.topButtonSize,
          height: S.topButtonSize,
          backgroundColor: 'rgba(212, 175, 55, 0.15)',
          borderColor: 'rgba(212, 175, 55, 0.4)',
          boxShadow: '0 0 15px rgba(212, 175, 55, 0.3), 0 0 25px rgba(212, 175, 55, 0.1)',
        }}
        animate={{
          boxShadow: [
            '0 0 15px rgba(212, 175, 55, 0.3), 0 0 25px rgba(212, 175, 55, 0.1)',
            '0 0 20px rgba(212, 175, 55, 0.5), 0 0 35px rgba(212, 175, 55, 0.2)',
            '0 0 15px rgba(212, 175, 55, 0.3), 0 0 25px rgba(212, 175, 55, 0.1)',
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
          }}
          animate={{
            x: ['-100%', '200%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 1
          }}
        />
        <svg width={S.topIconSize} height={S.topIconSize} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L14.5 7L20 8L16 12L17 18L12 15L7 18L8 12L4 8L9.5 7L12 2Z"
            fill="rgba(212, 175, 55, 0.6)"
            stroke="#d4af37"
            strokeWidth="1.5"/>
          <circle cx="12" cy="11" r="4" fill="rgba(0,0,0,0.6)"/>
          <text x="12" y="14" textAnchor="middle" fill="#d4af37" fontSize="8" fontWeight="bold">?</text>
        </svg>
      </motion.button>
    );
  }

  const isSpecial = (achievement as any).special;

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-full backdrop-blur-md border transition-all"
      style={{
        width: S.topButtonSize,
        height: S.topButtonSize,
        backgroundColor: `${achievement.color}25`,
        borderColor: `${achievement.color}60`,
        boxShadow: `0 0 12px ${achievement.color}50`,
      }}
    >
      <TrophySVG
        color={achievement.color}
        size={S.topIconSize}
        glow={isSpecial}
      />
    </button>
  );
};

const AchievementModal = ({
  show,
  onClose,
  globalCount
}: {
  show: boolean;
  onClose: () => void;
  globalCount: number;
}) => {
  const [showInfoFor, setShowInfoFor] = useState<number | null>(null);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      style={{ padding: 16 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#1a0505] border border-[#d4af37]/30 rounded-2xl overflow-hidden"
        style={{ width: 340, maxWidth: '100%', maxHeight: '80vh', padding: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-[#d4af37] font-bold text-center font-serif" style={{ fontSize: 20, marginBottom: 8 }}>
          Achievements
        </h3>
        <p className="text-white/60 text-center" style={{ fontSize: 14, marginBottom: 16 }}>
          Global Pops: {globalCount.toLocaleString()}
        </p>
        <div className="overflow-y-auto" style={{ maxHeight: 400, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ACHIEVEMENT_MILESTONES.map((milestone) => {
            const unlocked = globalCount >= milestone.required;
            const isSpecial = (milestone as any).special;
            return (
              <div
                key={milestone.level}
                className={`flex items-center rounded-xl border ${unlocked ? 'bg-black/40' : 'bg-black/20'}`}
                style={{
                  padding: 12,
                  gap: 12,
                  borderColor: unlocked ? `${milestone.color}50` : 'rgba(255,255,255,0.15)',
                  boxShadow: unlocked
                    ? `0 0 10px ${milestone.color}30`
                    : '0 2px 8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
                }}
              >
                <div
                  className="rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: unlocked ? `${milestone.color}30` : 'rgba(60,60,60,0.6)',
                    boxShadow: unlocked && isSpecial
                      ? `0 0 15px ${milestone.color}50`
                      : unlocked
                        ? 'none'
                        : '0 2px 6px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                >
                  {unlocked ? (
                    <TrophySVG
                      color={milestone.color}
                      size={22}
                      glow={isSpecial}
                    />
                  ) : (
                    <LockedBadgeSVG size={22} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-bold truncate"
                    style={{
                      fontSize: 14,
                      color: unlocked ? milestone.color : '#888',
                    }}
                  >
                    {milestone.name}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInfoFor(showInfoFor === milestone.level ? null : milestone.level);
                      }}
                      className="text-white/40 hover:text-[#d4af37] transition-colors"
                    >
                      <Info size={12} />
                    </button>
                    <p className="text-white/50" style={{ fontSize: 11 }}>
                      {isSpecial
                        ? 'Beyond All Limits'
                        : milestone.required.toLocaleString()}
                    </p>
                  </div>

                  {showInfoFor === milestone.level && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-2 bg-black/60 rounded-lg border border-[#d4af37]/20"
                    >
                      <p className="text-white/70 text-xs">
                        {isSpecial
                          ? 'Ultimate achievement - no limit!'
                          : `This achievement unlocks at ${milestone.required.toLocaleString()} pops`}
                      </p>
                    </motion.div>
                  )}
                </div>
                {unlocked ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" fill="#4ade80" fillOpacity="0.2" stroke="#4ade80" strokeWidth="1.5"/>
                    <path d="M4.5 8L7 10.5L11.5 6" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="3" y="6.5" width="8" height="5.5" rx="1.5" fill="#555" fillOpacity="0.8"/>
                    <path d="M4.5 6.5V5C4.5 3.6 5.6 2.5 7 2.5C8.4 2.5 9.5 3.6 9.5 5V6.5"
                      stroke="#555" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                    <circle cx="7" cy="9.5" r="0.8" fill="#888"/>
                  </svg>
                )}
              </div>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="w-full text-white/40 hover:text-white transition-colors"
          style={{ marginTop: 16, fontSize: 13, padding: 8 }}
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

interface BalloonData { id: number; side: 'left' | 'right'; xPct: number; color: string; visible: boolean; progress: number; heightLimit: number; }
interface Glitter { x: number; y: number; vx: number; vy: number; size: number; color: string; life: number; rot: number; rotSpeed: number; glow: number; }

const BalloonSystem = ({ scale, S, onPop }: { scale: number; S: typeof BASE; onPop: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glitterRef = useRef<Glitter[]>([]);
  const timeRef = useRef(0);
  const rafRef = useRef<number>();
  const [balloons, setBalloons] = useState<BalloonData[]>([]);
  const [mounted, setMounted] = useState(false);
  const [, tick] = useState(0);

  const perSide = useMemo(() => {
    if (scale >= 1.5) return 4;
    if (scale >= 1.2) return 3;
    return BASE.balloonsPerSideMobile;
  }, [scale]);

  useEffect(() => {
    const arr: BalloonData[] = [];
    let id = 1;
    const variations = BASE.balloonHeightVariations;
    for (let i = 0; i < perSide; i++) {
      arr.push({ id: id++, side: 'left', xPct: 8 + i * 6, color: getRandomColor(), visible: true, progress: 1, heightLimit: variations[id % variations.length] });
      arr.push({ id: id++, side: 'right', xPct: 92 - i * 6, color: getRandomColor(), visible: true, progress: 1, heightLimit: variations[(id + 3) % variations.length] });
    }
    setBalloons(arr);
    setMounted(true);
  }, [perSide]);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      timeRef.current += 0.016;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const contentBottom = S.contentPadBottom + S.actionBottom;
      const availableH = H - contentBottom;
      const leftX = W * 0.05, rightX = W * 0.95, originY = H + S.stringOriginY;

      for (const b of balloons) {
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

      glitterRef.current = glitterRef.current.filter(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy += BASE.glitterGravity * scale;
        p.vx *= 0.985; p.life -= 0.012;
        p.rot += p.rotSpeed; p.glow = Math.max(0, p.glow - 0.008);
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
        for (let i = 0; i < 4; i++) {
          const a = Math.PI / 2 * i - Math.PI / 4;
          ctx.lineTo(Math.cos(a) * p.size, Math.sin(a) * p.size);
          ctx.lineTo(Math.cos(a + Math.PI / 4) * p.size * 0.25, Math.sin(a + Math.PI / 4) * p.size * 0.25);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        return true;
      });

      tick(n => n + 1);
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [mounted, balloons, S, scale]);

  const pop = (id: number, x: number, y: number, color: string) => {
    playBalloonPopSound();
    onPop();

    const colors = ['#FFD700', '#FFFACD', '#FFF8DC', '#FFFFFF', lighten(color, 30), color, lighten(color, 50)];
    const cnt = Math.round(S.glitterCount);
    for (let i = 0; i < cnt; i++) {
      const a = (Math.PI * 2 / cnt) * i + (Math.random() - 0.5) * 0.6;
      const spd = (3 + Math.random() * 7) * scale;
      glitterRef.current.push({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 4 * scale, size: (4 + Math.random() * 6) * scale, color: colors[Math.floor(Math.random() * colors.length)], life: 1, rot: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.3, glow: 1 });
    }
    for (let i = 0; i < Math.round(S.glitterCountSmall); i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = (1.5 + Math.random() * 3) * scale;
      glitterRef.current.push({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 2 * scale, size: (2 + Math.random() * 3) * scale, color: '#FFFFFF', life: 0.8, rot: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.4, glow: 1.2 });
    }

    const popped = balloons.find(b => b.id === id);
    setBalloons(prev => prev.map(b => b.id === id ? { ...b, visible: false } : b));

    setTimeout(() => {
      const newColor = getRandomColor(popped?.color);
      const newHeight = BASE.balloonHeightVariations[Math.floor(Math.random() * BASE.balloonHeightVariations.length)];
      setBalloons(prev => prev.map(b => b.id === id ? { ...b, visible: true, progress: 0, color: newColor, heightLimit: newHeight } : b));
      const start = Date.now(), dur = 2200;
      const respawn = () => {
        const p = Math.min(1, (Date.now() - start) / dur);
        const e = 1 - Math.pow(1 - p, 4);
        setBalloons(prev => prev.map(b => b.id === id ? { ...b, progress: e } : b));
        if (p < 1) requestAnimationFrame(respawn);
      };
      requestAnimationFrame(respawn);
    }, 2800);
  };

  const getPos = (b: BalloonData) => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };
    const W = window.innerWidth, H = window.innerHeight;
    const contentBottom = S.contentPadBottom + S.actionBottom;
    const availableH = H - contentBottom;
    const swayX = Math.sin(timeRef.current * 1.2 + b.id * 1.5) * S.balloonSwayX;
    const swayY = Math.sin(timeRef.current * 1.8 + b.id * 0.9) * S.balloonSwayY;
    const maxRise = availableH * b.heightLimit;
    const finalY = H - contentBottom - maxRise + S.balloonHeight / 2;
    const startY = H + S.balloonSpawnY;
    const currY = startY - b.progress * (startY - finalY);
    return { x: W * b.xPct / 100 + swayX, y: currY + swayY };
  };

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 5 }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {balloons.filter(b => b.visible).map(b => {
        const pos = getPos(b);
        return (
          <div key={b.id} onClick={e => { e.stopPropagation(); pop(b.id, pos.x, pos.y, b.color); }} className="absolute pointer-events-auto cursor-pointer" style={{ left: pos.x, top: pos.y, transform: 'translate(-50%,-50%)' }}>
            <div style={{ width: S.balloonWidth, height: S.balloonHeight, background: `radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 12%, ${lighten(b.color, 15)} 35%, ${b.color} 55%, ${darken(b.color, 25)} 100%)`, borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%', boxShadow: `inset -${S.balloonShadowInset1}px -${S.balloonShadowInset2}px ${S.balloonShadowInset3}px rgba(0,0,0,0.15), inset ${S.balloonShadowInset4}px ${S.balloonShadowInset4}px ${S.balloonShadowInset5}px rgba(255,255,255,0.4), 0 ${S.balloonShadowOuter1}px ${S.balloonShadowOuter2}px rgba(0,0,0,0.3), 0 0 ${S.balloonShadowGlow}px ${b.color}40`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '10%', left: '15%', width: '32%', height: '38%', background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 100%)', borderRadius: '50%', filter: `blur(${S.balloonHighlight1Blur}px)` }} />
              <div style={{ position: 'absolute', top: '25%', left: '55%', width: '18%', height: '22%', background: 'rgba(255,255,255,0.4)', borderRadius: '50%', filter: `blur(${S.balloonHighlight2Blur}px)` }} />
              <div style={{ position: 'absolute', bottom: '20%', right: '12%', width: '10%', height: '12%', background: 'rgba(255,255,255,0.25)', borderRadius: '50%', filter: `blur(${S.balloonHighlight3Blur}px)` }} />
            </div>
            <div style={{ position: 'absolute', bottom: -S.balloonKnotOffset, left: '50%', transform: 'translateX(-50%)', width: S.balloonKnotSize, height: S.balloonKnotSize, background: `linear-gradient(180deg, ${darken(b.color, 15)} 0%, ${darken(b.color, 35)} 100%)`, clipPath: 'polygon(50% 0%, 10% 100%, 90% 100%)' }} />
          </div>
        );
      })}
    </div>
  );
};

const CommentSlideshow = ({ comments, S }: { comments: Comment[]; S: typeof BASE }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (comments.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % comments.length), 4000);
    return () => clearInterval(t);
  }, [comments.length]);
  if (!comments.length) return null;
  return (
    <div className="absolute w-full flex justify-center pointer-events-none" style={{ bottom: S.slideshowBottom, paddingLeft: S.slideshowPadX, paddingRight: S.slideshowPadX, zIndex: 20 }}>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, y: S.slideshowAnimOffset }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -S.slideshowAnimOffset }} transition={{ duration: 0.4 }} className="bg-black/60 backdrop-blur-md border border-white/10 text-white/90 shadow-md text-center truncate" style={{ paddingLeft: S.slideshowBubblePadX, paddingRight: S.slideshowBubblePadX, paddingTop: S.slideshowBubblePadY, paddingBottom: S.slideshowBubblePadY, fontSize: S.slideshowFontSize, maxWidth: S.slideshowMaxWidth, borderRadius: S.slideshowRadius }}>
          <span className="text-[#d4af37] font-bold mr-2">{comments[idx].name}:</span>
          {comments[idx].message}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// SVG icons for volume indicator
const VolumeHighSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="white" fillOpacity="0.9"/>
    <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7"/>
  </svg>
);

const VolumeMidSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="white" fillOpacity="0.9"/>
    <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const VolumeLowSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="white" fillOpacity="0.9"/>
  </svg>
);

const VolumeMuteSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="white" fillOpacity="0.5"/>
    <path d="M22 9L17 14M17 9L22 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default function FreeStoryMode() {
  const router = useRouter();
  const scale = useProportionalScale();
  const S = useScaled(scale);

  const [data, setData] = useState<any>(null);
  const [emotionalTerm, setEmotionalTerm] = useState('');
  const [babyTerm, setBabyTerm] = useState('');
  const [coupleTerm, setCoupleTerm] = useState('');
  const [stage, setStage] = useState('ENVELOPE');
  const [countdown, setCountdown] = useState(3);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [qrLoading, setQrLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [visitorName, setVisitorName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [imgFit, setImgFit] = useState<ImageFitMode>('cover');
  const [currentImgSrc, setCurrentImgSrc] = useState<string>('');

  const [globalPopCount, setGlobalPopCount] = useState(0);
  const [showPopNumber, setShowPopNumber] = useState(false);
  
  // NEW: State to track if the user has downloaded at least once
  const [hasDownloaded, setHasDownloaded] = useState(false);

  // TASK 7: Store the birthday line chosen for "For Yourself" birthday
  const [birthdaySelfLine, setBirthdaySelfLine] = useState('');

  // Volume control state
  const volumeLevel = useRef(70);
  const [volDisplay, setVolDisplay] = useState({ show: false, level: 70 });
  const touchStartPos = useRef({ x: 0, y: 0 });
  const touchStartVol = useRef(70);
  const isVolGesture = useRef(false);
  const gestureDecided = useRef(false);
  const isOverlayOpen = useRef(false);
  const volHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleImageLoad = (img: HTMLImageElement) => {
    const fit = determineImageFit(img);
    setImgFit(fit);
    setCurrentImgSrc(img.src);
  };

  useEffect(() => {
    const saved = localStorage.getItem('celebrationData');
    if (saved) {
      const parsedData = JSON.parse(saved);

      // TASK 6: Generate or retrieve unique story ID
      if (!parsedData.storyId) {
        parsedData.storyId = `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('celebrationData', JSON.stringify(parsedData));
      }

      setData(parsedData);

      // TASK 6: Load comments ONLY for THIS specific story
      const allCommentsStr = localStorage.getItem('storyCommentsV3');
      if (allCommentsStr) {
        const allComments = JSON.parse(allCommentsStr);
        // Filter to get only comments for this story
        const storyComments = allComments.filter((c: any) => c.storyId === parsedData.storyId);
        setComments(storyComments);
      }

      const n = localStorage.getItem('jashnVisitorName');
      if (n) { setVisitorName(n); setIsNameSet(true); }

      const savedGlobalPopCount = localStorage.getItem('jashnGlobalBalloonPopCount');
      if (savedGlobalPopCount) setGlobalPopCount(parseInt(savedGlobalPopCount) || 0);

      const savedTerm = localStorage.getItem('emotionalTerm');
      if (savedTerm) setEmotionalTerm(savedTerm);

      const savedBabyTerm = localStorage.getItem('babyTerm');
      if (savedBabyTerm) setBabyTerm(savedBabyTerm);

      const savedCoupleTerm = localStorage.getItem('coupleTerm');
      if (savedCoupleTerm) setCoupleTerm(savedCoupleTerm);

      // TASK 7: Assign a rotating birthday line for "For Yourself" birthday stories
      if (parsedData.category === 'BIRTHDAY' && parsedData.isForSelf) {
        const line = BIRTHDAY_SELF_LINES[birthdayLineIndex % BIRTHDAY_SELF_LINES.length];
        birthdayLineIndex++;
        setBirthdaySelfLine(line);
      }
    }
  }, []);

  // Keep overlay ref in sync with state
  useEffect(() => {
    isOverlayOpen.current = showQR || showComments || showAchievements;
  }, [showQR, showComments, showAchievements]);

  const handleBalloonPop = () => {
    const newCount = globalPopCount + 1;
    setGlobalPopCount(newCount);
    localStorage.setItem('jashnGlobalBalloonPopCount', newCount.toString());

    setShowPopNumber(true);
    setTimeout(() => {
      setShowPopNumber(false);
    }, 800);
  };

  // Volume control handlers
  const onVolTouchStart = (e: TouchEvent) => {
    if (isOverlayOpen.current) return;
    if (stage !== 'STORY') return;
    touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchStartVol.current = volumeLevel.current;
    isVolGesture.current = false;
    gestureDecided.current = false;
  };

  const onVolTouchMove = (e: TouchEvent) => {
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
    const volumeChange = (verticalDelta / window.innerHeight) * 150;
    let newVol = Math.round(touchStartVol.current + volumeChange);
    newVol = Math.max(0, Math.min(100, newVol));

    volumeLevel.current = newVol;
    setVolDisplay({ show: true, level: newVol });

    const audioEl = document.querySelector('audio') as HTMLAudioElement;
    if (audioEl) audioEl.volume = newVol / 100;
  };

  const onVolTouchEnd = () => {
    if (isVolGesture.current) {
      if (volHideTimer.current) clearTimeout(volHideTimer.current);
      volHideTimer.current = setTimeout(() => {
        setVolDisplay(prev => ({ ...prev, show: false }));
      }, 300);
    }
    gestureDecided.current = false;
    isVolGesture.current = false;
  };

  useEffect(() => {
    document.addEventListener('touchstart', onVolTouchStart as any, { passive: true });
    document.addEventListener('touchmove', onVolTouchMove as any, { passive: false });
    document.addEventListener('touchend', onVolTouchEnd);

    return () => {
      document.removeEventListener('touchstart', onVolTouchStart as any);
      document.removeEventListener('touchmove', onVolTouchMove as any);
      document.removeEventListener('touchend', onVolTouchEnd);
      if (volHideTimer.current) clearTimeout(volHideTimer.current);
    };
  }, [stage]);

  // TASK 3: Back button handling for story view
  useEffect(() => {
    window.history.pushState({ storyView: true }, '');

    const handlePopState = () => {
      router.push('/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [router]);

  useEffect(() => {
    if (stage === 'COUNTDOWN') {
      const t = setInterval(() => setCountdown(c => c - 1), 1000);
      if (countdown === 0) {
        clearInterval(t);
        setStage('STORY');
        audioRef.current?.play().catch(() => {});

        if (!confettiHasFired) {
          confettiHasFired = true;
          setTimeout(() => {
            triggerProfessionalConfetti();
          }, 300);
        }
      }
      return () => clearInterval(t);
    }
  }, [stage, countdown]);

  useEffect(() => {
    if (stage === 'STORY' && data?.photos?.length > 1) {
      const t = setInterval(() => setCurrentSlide(i => (i + 1) % data.photos.length), 4000);
      return () => clearInterval(t);
    }
  }, [stage, data]);

  const getSmartFestivalTitle = (occasionName: string) => {
    if (!occasionName) return '';
    const trimmed = occasionName.trim();
    if (trimmed.toLowerCase().startsWith('happy')) {
      return trimmed;
    }
    return `Happy ${trimmed}`;
  };

  const getFormattedTitle = () => {
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

  const getTermLine = () => {
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

  const getDisplayName = () => {
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

  const getSelfProfileText = () => {
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

  const isAutoProfile = (name: string) => {
    if (!name) return false;
    const autoProfilePrefixes = ['From your', 'Your dear', 'Your love'];
    return autoProfilePrefixes.some(prefix => name.startsWith(prefix));
  };


  // --- UPDATED HANDLE DOWNLOAD (AI Logic Added, NO minification) ---
  const handleDownload = async () => {
    if (!data) return;
    setIsDownloading(true);

    try {
      const title = getFormattedTitle();
      const subtitle = data.customMessage || '';

      const isLayout2 = data.category === 'SPECIAL' && ['JYANTI', 'DIVAS', 'FESTIVALS'].includes(data.specialSubcategory);
      const layoutType = isLayout2 ? 'LAYOUT_2_JAYANTI' : 'LAYOUT_1_COLLAGE';
      const apiEndpoint = isLayout2 ? '/api/generate-poster-layout' : '/api/generate-poster-styling';

      let styleConfig = {};

      try {
        const res = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            occasion: title,
            name: getDisplayName() || title,
            message: subtitle,
            quote: subtitle
          })
        });

        if (res.ok) {
          styleConfig = await res.json();
        }
      } catch (apiError) {
        console.warn("API Error:", apiError);
      }

      const loadedImages: HTMLImageElement[] = [];
      const photosToLoad = data.photos && data.photos.length > 0 ? data.photos.slice(0, 5) : [];

      for (let src of photosToLoad) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = src;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          loadedImages.push(img);
        } catch (e) {
          console.error("Failed to load image");
        }
      }

      if (layoutType === 'LAYOUT_1_COLLAGE' && loadedImages.length > 0 && loadedImages.length < 5) {
        while (loadedImages.length < 5) {
          loadedImages.push(loadedImages[0]);
        }
      }

      const canvas = document.createElement('canvas');

      await generatePosterCanvas(
        canvas,
        layoutType,
        { 
          title: title, 
          subtitle: subtitle, 
          photos: loadedImages,
          relationName: getDisplayName(),
          termLine: getTermLine()
        },
        styleConfig
      );

      const dlLink = document.createElement('a');
      dlLink.download = `Jashn-${getDisplayName().replace(/\s/g, '-') || 'Celebration'}.jpg`;
      dlLink.href = canvas.toDataURL('image/jpeg', 0.95);
      dlLink.click();

      // NEW: Set hasDownloaded to true so button changes to Redesign
      setHasDownloaded(true);

    } catch (err) {
      console.error(err);
      alert("Error generating poster.");
    } finally {
      setIsDownloading(false);
    }
  };


  const handleShareQR = async () => {
    try {
      if (navigator.share) {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.href)}&color=d4af37&bgcolor=3D1010`;
        const response = await fetch(qrUrl);
        const blob = await response.blob();
        const file = new File([blob], "qr-code.png", { type: "image/png" });
        await navigator.share({ title: 'Celebration Story', text: 'Watch this celebration!', url: window.location.href, files: [file] });
      } else { throw new Error("Share not supported"); }
    } catch (e) { try { await navigator.clipboard.writeText(window.location.href); alert("Link copied to clipboard!"); } catch (clipErr) { alert("Could not share. Please copy the URL manually."); } }
  };

  const saveName = () => { if (visitorName.trim()) { localStorage.setItem('jashnVisitorName', visitorName); setIsNameSet(true); } };

  const addComment = () => {
    if (!inputMsg.trim() || !data) return;

    // TASK 6: Add storyId to comment
    const c: Comment = {
      id: Date.now().toString(),
      name: visitorName || 'Guest',
      message: inputMsg,
      timestamp: new Date().toISOString(),
      storyId: data.storyId
    };

    // Load all comments from storage
    const allCommentsStr = localStorage.getItem('storyCommentsV3');
    const allComments = allCommentsStr ? JSON.parse(allCommentsStr) : [];

    // Add new comment to global list
    const updatedAllComments = [...allComments, c];
    localStorage.setItem('storyCommentsV3', JSON.stringify(updatedAllComments));

    // Update UI with this story's comments only
    const storyComments = updatedAllComments.filter((comment: any) => comment.storyId === data.storyId);
    setComments(storyComments);

    setInputMsg('');
  };

  if (!data) return <PremiumLoader scale={scale} />;

  const screenW = typeof window !== 'undefined' ? window.innerWidth : 430;
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 932;
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

  // TASK 2 & 3: Check if occasion name heading style applies (Jayanti, Divas, Festivals)
  const isOccasionNameType =
    data.specialSubcategory === 'JYANTI' ||
    data.specialSubcategory === 'DIVAS' ||
    data.specialSubcategory === 'FESTIVALS';

  return (
    <div className="fixed inset-0 w-full h-[100dvh] overflow-hidden bg-black">
      {isDownloading && <PremiumLoader scale={scale} />}

      <PopCounter count={globalPopCount} show={showPopNumber} />

      <AchievementModal
        show={showAchievements}
        onClose={() => setShowAchievements(false)}
        globalCount={globalPopCount}
      />

      <AnimatePresence>
        {stage === 'ENVELOPE' && (
          <motion.div exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-[#1a0505]" onClick={() => setStage('COUNTDOWN')}>
            <div className="flex flex-col items-center animate-pulse cursor-pointer">
              <Gift style={{ width: S.envelopeIconSize, height: S.envelopeIconSize }} className="text-[#d4af37]" />
              <p style={{ fontSize: S.envelopeTextSize, marginTop: S.envelopeTextMarginTop }} className="text-[#d4af37] tracking-widest uppercase">Tap to Open</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {stage === 'COUNTDOWN' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#1a0505]">
          <h1 style={{ fontSize: S.countdownFontSize }} className="font-serif text-[#d4af37]">{countdown}</h1>
        </div>
      )}

      {stage === 'STORY' && (
        <div className="relative w-full h-full">
          <BalloonSystem scale={scale} S={S} onPop={handleBalloonPop} />

          <div className="absolute inset-0 bg-black" style={{ zIndex: 0 }}>
            {imgFit === 'contain' && currentImgSrc && (<div className="absolute inset-0" style={{ zIndex: 1, backgroundImage: `url(${currentImgSrc})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(40px) brightness(0.5) saturate(1.2)', transform: 'scale(1.1)' }} />)}
            {imgFit === 'contain' && (<div className="absolute inset-0 bg-black/30" style={{ zIndex: 2 }} />)}
            <AnimatePresence mode="wait">
              <motion.img key={currentSlide} src={data.photos?.[currentSlide]} onLoad={e => handleImageLoad(e.currentTarget)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} className="absolute inset-0 w-full h-full" style={{ zIndex: 3, objectFit: imgFit, objectPosition: 'center center' }} alt="" />
            </AnimatePresence>
            <div className="absolute bottom-0 left-0 w-full pointer-events-none" style={{ zIndex: 4, height: `${BASE.overlayHeightPercent}%`, background: 'linear-gradient(to top, #000 15%, rgba(0,0,0,0.9) 50%, transparent 100%)' }} />
          </div>

          {/* Top Bar */}
          <div className="absolute top-0 w-full flex justify-between items-center" style={{ padding: S.topPadding, zIndex: 20 }}>
            <div className="flex items-center" style={{ gap: S.topGap }}>
              <button onClick={() => router.push('/')} className="flex items-center justify-center bg-black/40 rounded-full backdrop-blur-md border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black transition-all" style={{ width: S.topButtonSize, height: S.topButtonSize }}>
                <Home style={{ width: S.topIconSize, height: S.topIconSize }} />
              </button>

              {effectiveCreatorName && (
                <div className="flex items-center bg-black/40 backdrop-blur-md border border-[#d4af37]/30 rounded-full shadow-lg" style={{ paddingTop: S.creatorPillPadY, paddingBottom: S.creatorPillPadY, paddingRight: S.creatorPillPadX, paddingLeft: S.creatorPillPadY, gap: S.creatorPillGap }}>
                  <div className="rounded-full border border-[#d4af37] overflow-hidden bg-gray-800" style={{ width: S.creatorAvatarSize, height: S.creatorAvatarSize }}>
                    {effectiveCreatorPhoto ? <img src={effectiveCreatorPhoto} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-[#d4af37]" style={{ fontSize: S.creatorNameSize }}>{effectiveCreatorName?.charAt(0) || 'M'}</div>}
                  </div>
                  {/* TASK 4: LEFT-aligned creator name with proper two-line format for "From your wife/husband" */}
                  <div className="flex flex-col leading-none justify-center" style={{ textAlign: 'left' }}>
                    {!isAutoProfile(effectiveCreatorName) && (
                      <span className="text-[#d4af37] uppercase tracking-wider" style={{ fontSize: S.creatorBySize, marginBottom: S.creatorByMargin }}>By</span>
                    )}
                    {effectiveCreatorName === 'From your wife' ? (
                      <div style={{ fontSize: S.creatorNameSize, lineHeight: '1.2', textAlign: 'left' }}>
                        <span className="text-white font-bold" style={{ display: 'block' }}>From</span>
                        <span className="text-white font-bold" style={{ display: 'block' }}>your wife</span>
                      </div>
                    ) : effectiveCreatorName === 'From your husband' ? (
                      <div style={{ fontSize: S.creatorNameSize, lineHeight: '1.2', textAlign: 'left' }}>
                        <span className="text-white font-bold" style={{ display: 'block' }}>From</span>
                        <span className="text-white font-bold" style={{ display: 'block' }}>your husband</span>
                      </div>
                    ) : (
                      <span className="text-white font-bold" style={{ fontSize: S.creatorNameSize, maxWidth: S.creatorNameMaxWidth, lineHeight: '1.2', wordWrap: 'break-word', textAlign: 'left' }}>{effectiveCreatorName}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center" style={{ gap: S.topGap }}>
              <AchievementBadge
                globalCount={globalPopCount}
                onClick={() => setShowAchievements(true)}
                S={S}
              />
              <button onClick={() => { setMuted(!muted); if (audioRef.current) audioRef.current.muted = !muted; }} className="flex items-center justify-center bg-black/40 rounded-full backdrop-blur-md border border-[#d4af37]/30 text-white" style={{ width: S.topButtonSize, height: S.topButtonSize }}>
                {muted ? <VolumeX style={{ width: S.topIconSize, height: S.topIconSize }} /> : <Volume2 style={{ width: S.topIconSize, height: S.topIconSize }} />}
              </button>
            </div>
          </div>

          {/* Story Content */}
          <div className="absolute bottom-0 w-full text-center flex flex-col items-center justify-end pointer-events-none" style={{ height: `${BASE.overlayHeightPercent}%`, paddingLeft: S.contentPadX, paddingRight: S.contentPadX, paddingBottom: S.contentPadBottom, zIndex: 20 }}>

            {/* TASK 2: Birthday "For Yourself" — occasion heading + quote */}
            {isBirthdaySelf ? (
              <>
                {/*
                  UNIFIED OCCASION HEADING — shared by all 4 types:
                  Birthday line, Jayanti name, Special Day name, Festival name.
                  <h1> element, font-weight: normal (400), royal color (#d4af37),
                  golden glow text-shadow, NO divider line.
                */}
                <h1
                  className="font-serif leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,1)]"
                  style={{
                    fontSize: S.nameSize,
                    marginBottom: S.nameMarginBottom * 1.5,
                    letterSpacing: '0.04em',
                    fontWeight: 'normal',
                    color: '#d4af37',
                    textShadow: '0 0 18px rgba(212, 175, 55, 0.7), 0 0 35px rgba(212, 175, 55, 0.35)',
                  }}
                >
                  {birthdaySelfLine}
                </h1>

                {/* Quote — plain italic, visually distinct from heading above */}
                <p className="text-white/80 italic leading-relaxed font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
                  style={{ fontSize: S.messageSize, maxWidth: S.messageMaxWidth }}>
                  "{data.customMessage}"
                </p>
              </>
            ) : isOccasionNameType ? (
              <>
                {/*
                  UNIFIED OCCASION HEADING — Jayanti / Special Day / Festivals.
                  SAME style as Birthday Self heading above: <h1>, font-weight: normal,
                  royal color (#d4af37), golden glow, NO divider line.
                  fontSize: S.nameSize (not S.titleSize which is 12px).
                */}
                {getFormattedTitle() && (
                  <h1
                    className="font-serif leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,1)]"
                    style={{
                      fontSize: S.nameSize,
                      marginBottom: S.nameMarginBottom * 1.5,
                      letterSpacing: '0.04em',
                      fontWeight: 'normal',
                      color: '#d4af37',
                      textShadow: '0 0 18px rgba(212, 175, 55, 0.7), 0 0 35px rgba(212, 175, 55, 0.35)',
                    }}
                  >
                    {getFormattedTitle()}
                  </h1>
                )}

                {/* Quote — plain italic, visually distinct from heading above */}
                <p className="text-white/80 italic leading-relaxed font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
                  style={{ fontSize: S.messageSize, maxWidth: S.messageMaxWidth }}>
                  "{data.customMessage}"
                </p>
              </>
            ) : (
              <>
                {/* HEADING: Small uppercase occasion label (Marriage/Relationship/Birthday-for-other etc.) */}
                {getFormattedTitle() && (
                  <h3
                    className="font-sans uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
                    style={{
                      fontSize: S.titleSize,
                      letterSpacing: '0.3em',
                      marginBottom: S.titleMarginBottom,
                      paddingBottom: S.titlePadBottom,
                      fontWeight: 'normal',
                      color: '#d4af37',
                      textShadow: 'none',
                      borderBottom: '1px solid rgba(212, 175, 55, 0.4)',
                    }}
                  >
                    {getFormattedTitle()}
                  </h3>
                )}

                {/* NAME */}
                {displayName && (
                  <h1 className="font-serif text-white drop-shadow-[0_4px_8px_rgba(0,0,0,1)] leading-tight"
                    style={{ fontSize: S.nameSize, marginBottom: S.nameMarginBottom }}>
                    {displayName}
                  </h1>
                )}

                {/* TERM LINE — pill capsule */}
                {termLine && (
                  <div
                    className="bg-[#d4af37]/20 border border-[#d4af37]/40 backdrop-blur-sm"
                    style={{
                      marginBottom: S.subtitleMarginBottom,
                      paddingLeft: S.subtitlePadX,
                      paddingRight: S.subtitlePadX,
                      paddingTop: S.subtitlePadY,
                      paddingBottom: S.subtitlePadY,
                      borderRadius: S.subtitleRadius
                    }}
                  >
                    <p className="font-bold text-[#d4af37] uppercase tracking-widest drop-shadow-md"
                      style={{ fontSize: S.subtitleSize }}>
                      {termLine}
                    </p>
                  </div>
                )}

                {/* Quote — plain, visually distinct from styled headings above */}
                <p className="text-white/80 italic leading-relaxed font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
                  style={{ fontSize: S.messageSize, maxWidth: S.messageMaxWidth }}>
                  "{data.customMessage}"
                </p>
              </>
            )}
          </div>

          <CommentSlideshow comments={comments} S={S} />

          {/* Action Buttons (Updated with hasDownloaded logic) */}
          <div className="absolute w-full flex justify-center" style={{ bottom: S.actionBottom, gap: S.actionGap, zIndex: 30 }}>
            {[
              { icon: hasDownloaded ? RefreshCw : Download, label: hasDownloaded ? 'Redesign' : 'Save', onClick: handleDownload },
              { icon: Share2, label: 'Share', onClick: handleShareQR },
              { icon: MessageCircle, label: 'Wishes', onClick: () => setShowComments(true) },
              { icon: QrCode, label: 'QR', onClick: () => setShowQR(true) },
            ].map(({ icon: Icon, label, onClick }) => (
              <button key={label} onClick={onClick} className="flex flex-col items-center text-white/90 hover:text-[#d4af37] group transition-colors" style={{ gap: S.actionItemGap }}>
                <Icon style={{ width: S.actionIconSize, height: S.actionIconSize }} className="group-hover:scale-110 transition-transform" />
                <span className="uppercase tracking-wider font-bold" style={{ fontSize: S.actionLabelSize }}>{label}</span>
              </button>
            ))}
          </div>

          {/* Volume indicator */}
          {volDisplay.show && (
            <div style={{
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
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}>
              <div style={{ width: 20, height: 20 }}>
                {volDisplay.level === 0 ? <VolumeMuteSVG /> :
                  volDisplay.level < 30 ? <VolumeLowSVG /> :
                    volDisplay.level < 70 ? <VolumeMidSVG /> : <VolumeHighSVG />}
              </div>

              <div style={{
                width: '5px',
                height: '120px',
                borderRadius: '3px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  height: `${volDisplay.level}%`,
                  backgroundColor: 'rgba(212, 175, 55, 0.9)',
                  borderRadius: '3px',
                  transition: 'height 0.05s linear'
                }} />
              </div>

              <span style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: '700',
                textShadow: '0 1px 2px rgba(0,0,0,0.4)'
              }}>
                {volDisplay.level}
              </span>
            </div>
          )}
        </div>
      )}

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" style={{ padding: 16 }} onClick={() => setShowQR(false)}>
          <div className="bg-[#1a0505] border border-[#d4af37] rounded-2xl text-center shadow-[0_0_50px_rgba(212,175,55,0.2)] overflow-hidden" style={{ width: qrModalMaxWidth, maxWidth: '100%', padding: 20 }} onClick={e => e.stopPropagation()}>
            <h3 className="text-[#d4af37] font-bold font-serif" style={{ fontSize: 18, marginBottom: 16 }}>Share the Love</h3>
            <div className="relative mx-auto bg-white rounded-xl overflow-hidden" style={{ width: qrSize, height: qrSize, padding: 8, marginBottom: 16 }}>
              {qrLoading && (<div className="absolute inset-0 flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#1a0505]" style={{ width: 32, height: 32 }} /></div>)}
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&color=1a0505&bgcolor=FFFFFF`} className="w-full h-full object-contain" onLoad={() => setQrLoading(false)} alt="QR Code" />
            </div>
            <button onClick={handleShareQR} className="w-full bg-[#d4af37] text-[#1a0505] font-bold rounded-lg hover:brightness-110 transition-all flex items-center justify-center" style={{ padding: 12, fontSize: 14, gap: 8 }}>
              <Share2 style={{ width: 18, height: 18 }} /> Share QR + Link
            </button>
            <button onClick={() => setShowQR(false)} className="text-white/40 hover:text-white transition-colors w-full" style={{ marginTop: 12, fontSize: 13, padding: 8 }}>Close</button>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {showComments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" style={{ padding: 8 }} onClick={() => setShowComments(false)}>
          <div className="bg-[#1a0505] rounded-2xl border border-[#d4af37]/30 flex flex-col shadow-2xl overflow-hidden" style={{ width: commentsModalMaxWidth, maxWidth: '100%', height: commentsModalMaxHeight, maxHeight: 'calc(100vh - 32px)' }} onClick={e => e.stopPropagation()}>
            {!isNameSet ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center overflow-auto" style={{ padding: 24, gap: 20 }}>
                <div className="rounded-full bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/30 flex-shrink-0" style={{ width: 64, height: 64 }}>
                  <User style={{ width: 32, height: 32 }} className="text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="font-serif text-[#d4af37]" style={{ fontSize: 20, marginBottom: 8 }}>Who are you?</h3>
                  <p className="text-white/60" style={{ fontSize: 13 }}>Enter your name to join.</p>
                </div>
                <input autoFocus className="w-full bg-black/30 border border-[#d4af37]/30 rounded-xl text-white text-center focus:border-[#d4af37] outline-none transition-all" placeholder="Your Name" value={visitorName} onChange={e => setVisitorName(e.target.value)} style={{ padding: 14, fontSize: 16 }} />
                <button onClick={saveName} disabled={!visitorName.trim()} className="w-full bg-[#d4af37] text-[#1a0505] font-bold rounded-xl disabled:opacity-50 hover:scale-[1.02] transition-transform" style={{ padding: 14, fontSize: 16 }}>Continue</button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-[#d4af37]/20 bg-[#150404] flex-shrink-0" style={{ padding: 14 }}>
                  <h3 className="text-[#d4af37] font-bold flex items-center font-serif" style={{ fontSize: 16, gap: 8 }}>
                    <MessageCircle style={{ width: 18, height: 18 }} /> Wishes ({comments.length})
                  </h3>
                  <button onClick={() => setShowComments(false)} className="text-white/50 hover:text-white p-2">
                    <X style={{ width: 18, height: 18 }} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto bg-[#1a0505]" style={{ padding: 14 }}>
                  {comments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/20" style={{ gap: 8, minHeight: 150 }}>
                      <MessageCircle style={{ width: 40, height: 40 }} />
                      <p className="italic" style={{ fontSize: 13 }}>No wishes yet.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {comments.map(c => (
                        <div key={c.id} className="flex" style={{ gap: 10 }}>
                          <div className="rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a6e15] flex items-center justify-center text-[#1a0505] font-bold flex-shrink-0 shadow-lg border border-white/10" style={{ width: 36, height: 36, fontSize: 13 }}>{c.name.charAt(0).toUpperCase()}</div>
                          <div className="flex-1 bg-black/40 rounded-2xl rounded-tl-none border border-[#d4af37]/10" style={{ padding: 10 }}>
                            <div className="flex justify-between items-baseline" style={{ marginBottom: 4 }}>
                              <span className="font-bold text-[#d4af37]" style={{ fontSize: 13 }}>{c.name}</span>
                              <span className="text-white/30" style={{ fontSize: 10 }}>{formatTime(c.timestamp)}</span>
                            </div>
                            <p className="text-white/90 leading-relaxed" style={{ fontSize: 13 }}>{c.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-[#150404] border-t border-[#d4af37]/20 flex-shrink-0" style={{ padding: 12 }}>
                  <div className="flex" style={{ gap: 10 }}>
                    <input className="flex-1 bg-black/30 border border-[#d4af37]/20 rounded-full text-white focus:border-[#d4af37] outline-none placeholder:text-white/30 transition-all" placeholder={`Wish as ${visitorName}...`} value={inputMsg} onChange={e => setInputMsg(e.target.value)} style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10, fontSize: 14 }} />
                    <button className="bg-[#d4af37] text-[#1a0505] rounded-full flex items-center justify-center disabled:opacity-50 hover:scale-110 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]" disabled={!inputMsg.trim()} onClick={addComment} style={{ width: 42, height: 42 }}>
                      <Send style={{ width: 18, height: 18 }} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <audio ref={audioRef} loop src={data?.music || undefined} />
    </div>
  );
}