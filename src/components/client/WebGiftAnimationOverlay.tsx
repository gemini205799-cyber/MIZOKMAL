import React, { useEffect, useRef, useState } from 'react';
import { GiftItem } from '../../types';
import confetti from 'canvas-confetti';

export interface ActiveGiftBroadcast {
  id: string;
  gift: GiftItem;
  senderName: string;
  senderAvatar: string;
  receiverName: string;
  receiverAvatar: string;
  combo: number;
  isAllMic?: boolean;
  luckyCashBack?: {
    multiplier: number;
    coinsWon: number;
    isJackpot: boolean;
  };
}

export interface ComboSideBadge {
  id: string;
  senderName: string;
  senderAvatar: string;
  giftIcon: string;
  giftName: string;
  count: number;
  lastUpdated: number;
}

interface WebGiftAnimationOverlayProps {
  currentGift: ActiveGiftBroadcast | null;
  comboBadges: ComboSideBadge[];
  onAnimationEnd: (id: string) => void;
}

/**
 * Web Audio API Sound FX Synthesizer
 * Provides instant, zero-latency realistic sound effects for MIZO gifting engine
 */
class SoundFxEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playCarRev() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.6);
      osc.frequency.exponentialRampToValueAtTime(140, now + 1.2);
      osc.frequency.exponentialRampToValueAtTime(450, now + 1.8);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 2.2);
    } catch (_) {}
  }

  public playRocketLaunch() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      
      // Rumble sub-bass
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(55, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 2.5);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 2.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 2.8);
    } catch (_) {}
  }

  public playJackpotFanfare() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C major arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.2, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.5);
      });
    } catch (_) {}
  }

  public playChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    } catch (_) {}
  }
}

const sfxEngine = new SoundFxEngine();

export const WebGiftAnimationOverlay: React.FC<WebGiftAnimationOverlayProps> = ({
  currentGift,
  comboBadges,
  onAnimationEnd,
}) => {
  const [engineFps, setEngineFps] = useState(60);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger sound effect on frame 0 synchronized with visual presentation
  useEffect(() => {
    if (!currentGift) return;

    if (currentGift.gift.id.includes('car') || currentGift.gift.id.includes('bike')) {
      sfxEngine.playCarRev();
    } else if (currentGift.gift.id.includes('rocket')) {
      sfxEngine.playRocketLaunch();
    } else if (currentGift.luckyCashBack?.isJackpot || currentGift.gift.isLucky) {
      sfxEngine.playJackpotFanfare();
    } else {
      sfxEngine.playChime();
    }

    // Try HTML5 sound if available
    if (currentGift.gift.soundFxUrl) {
      try {
        const audio = new Audio(currentGift.gift.soundFxUrl);
        audio.volume = 0.4;
        audio.play().catch(() => {});
      } catch (_) {}
    }

    // Fire fireworks confetti for high-end luxury gifts
    if (currentGift.gift.category === 'luxury' || currentGift.gift.category === 'vip' || currentGift.luckyCashBack?.isJackpot) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#F59E0B', '#EF4444', '#EC4899', '#3B82F6', '#10B981'],
      });
    }

    const timer = setTimeout(() => {
      onAnimationEnd(currentGift.id);
    }, currentGift.gift.durationMs || 4200);

    return () => clearTimeout(timer);
  }, [currentGift?.id]);

  // Subtle canvas particle stars simulation
  useEffect(() => {
    if (!currentGift) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2 - 0.8,
      alpha: Math.random() * 0.8 + 0.2,
      color: ['#F59E0B', '#EC4899', '#60A5FA', '#FCD34D'][Math.floor(Math.random() * 4)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [currentGift?.id]);

  const isPag = currentGift?.gift.animationType === 'pag' || Boolean(currentGift?.gift.pagUrl);
  const isSvga = currentGift?.gift.animationType === 'svga' || Boolean(currentGift?.gift.svgaAvatarKey);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden flex flex-col justify-between">
      {/* 1. Side Floating Combo Batter Badges (view_live_bullet_item_room_gift) */}
      <div className="absolute left-3 top-36 flex flex-col gap-2 z-40 max-w-[280px]">
        {comboBadges.map((badge) => (
          <div
            key={badge.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/85 border border-pink-500/80 shadow-lg shadow-pink-500/20 backdrop-blur-md animate-in slide-in-from-left-4 duration-200"
          >
            <img
              src={badge.senderAvatar}
              alt={badge.senderName}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-400"
            />
            <div className="flex-1 min-w-0 pr-1">
              <span className="text-[11px] font-bold text-white block truncate leading-tight">
                {badge.senderName}
              </span>
              <span className="text-[9px] text-pink-300 block truncate">
                Sent {badge.giftName} {badge.giftIcon}
              </span>
            </div>
            <div className="flex items-baseline">
              <span className="text-xs font-black text-amber-300 italic">x</span>
              <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-tr from-amber-300 to-yellow-100 font-mono tracking-tighter drop-shadow">
                {badge.count}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Lucky Cash-Back Jackpot Banner (Habi Parity) */}
      {currentGift?.luckyCashBack && (
        <div className="absolute top-12 left-4 right-4 z-50 animate-in slide-in-from-top-6 duration-300">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-red-600 via-purple-600 to-amber-500 border border-yellow-300/80 shadow-2xl shadow-red-500/40 text-white flex items-center gap-3">
            <span className="text-3xl animate-bounce">🎰</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-full text-yellow-300">
                  {currentGift.luckyCashBack.isJackpot ? 'MEGA JACKPOT HIT!' : 'LUCKY CASH-BACK'}
                </span>
                <span className="text-xs font-bold text-yellow-200">
                  {currentGift.luckyCashBack.multiplier}x Multiplier
                </span>
              </div>
              <p className="text-xs font-extrabold text-white truncate drop-shadow">
                {currentGift.senderName} won +{currentGift.luckyCashBack.coinsWon.toLocaleString()} Coins!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Full-Screen Hybrid SVGA / PAG Animation Overlay */}
      {currentGift && (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in zoom-in duration-200">
          <canvas
            ref={canvasRef}
            width={380}
            height={640}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Engine Header Watermark */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-400/80 text-[10px] text-amber-300 font-mono font-bold shadow-lg shadow-amber-500/20">
            <span>{isPag ? '⚡ PAG Hybrid Engine' : isSvga ? '✨ SVGA 2.0 Renderer' : '💫 Particle Engine'}</span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-400">60 FPS</span>
          </div>

          {/* Dynamic Injected Avatar Showcase (matching svga_avatar_key & PAG slots) */}
          <div className="relative z-10 flex items-center justify-center gap-6 mt-4">
            {/* Sender Slot */}
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-amber-300 ring-2 ring-amber-400 shadow-xl shadow-amber-500/40 animate-pulse">
                <img
                  src={currentGift.senderAvatar}
                  alt={currentGift.senderName}
                  className="w-full h-full rounded-full object-cover"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full shadow">
                  SENDER
                </span>
              </div>
              <span className="text-xs font-bold text-white mt-3 truncate max-w-[90px] drop-shadow">
                {currentGift.senderName}
              </span>
            </div>

            {/* Injected Center Gift Badge */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-2xl shadow-lg ring-2 ring-white/30 animate-bounce">
                {currentGift.gift.icon}
              </div>
              <span className="text-xs font-mono font-black text-amber-300 mt-1 drop-shadow">
                x{currentGift.combo}
              </span>
            </div>

            {/* Receiver Slot */}
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-400 ring-2 ring-blue-400 shadow-xl shadow-blue-500/40">
                <img
                  src={currentGift.receiverAvatar}
                  alt={currentGift.receiverName}
                  className="w-full h-full rounded-full object-cover"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-500 text-white text-[9px] font-black rounded-full shadow">
                  {currentGift.isAllMic ? 'ALL MIC' : 'RECEIVER'}
                </span>
              </div>
              <span className="text-xs font-bold text-white mt-3 truncate max-w-[90px] drop-shadow">
                {currentGift.receiverName}
              </span>
            </div>
          </div>

          {/* Dynamic SVG / Luxury Asset Centerpiece Graphic */}
          <div className="relative z-10 mt-8 flex flex-col items-center">
            {/* Ambient Halo */}
            <div className="absolute -inset-10 bg-radial from-amber-500/30 via-pink-500/10 to-transparent blur-2xl rounded-full pointer-events-none" />

            {/* Scaled Visual Render */}
            <div className="relative text-8xl filter drop-shadow-[0_15px_25px_rgba(245,158,11,0.6)] animate-pulse">
              {currentGift.gift.icon}
            </div>

            <div className="mt-4 px-5 py-2 rounded-2xl bg-slate-950/90 border-2 border-amber-400/90 shadow-2xl flex flex-col items-center text-center">
              <span className="text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-200 uppercase tracking-widest">
                {currentGift.gift.name}
              </span>
              {currentGift.gift.arabicName && (
                <span className="text-[11px] font-medium text-amber-200/80 font-arabic mt-0.5" dir="rtl">
                  {currentGift.gift.arabicName}
                </span>
              )}
              <span className="text-[10px] font-mono text-emerald-400 mt-1">
                Value: {(currentGift.gift.coinPrice * currentGift.combo).toLocaleString()} Coins
              </span>
            </div>

            {/* Injected Slot Info Pill */}
            {currentGift.gift.svgaAvatarKey && (
              <div className="mt-2 text-[9px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded-full border border-slate-800">
                slot: [{currentGift.gift.svgaAvatarKey}]
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
