import React, { useState, useEffect, useRef } from 'react';
import { VoiceRoom, Seat, GiftItem } from '../../types';
import { 
  Mic, 
  MicOff, 
  Hand, 
  Gift, 
  Send, 
  Lock, 
  Volume2, 
  VolumeX, 
  Share2, 
  Settings, 
  Minimize2, 
  X, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { WebGiftAnimationOverlay, ActiveGiftBroadcast, ComboSideBadge } from './WebGiftAnimationOverlay';

interface MobileVoiceRoomProps {
  room: VoiceRoom;
  userCoins: number;
  gifts: GiftItem[];
  onMinimize: () => void;
  onSendGift: (gift: GiftItem, combo: number, luckyWinCoins?: number) => void;
  onSeatAction: (seatIndex: number, action: 'take' | 'lock' | 'lock_all' | 'mute' | 'leave') => void;
}

export const MobileVoiceRoom: React.FC<MobileVoiceRoomProps> = ({
  room,
  userCoins,
  gifts,
  onMinimize,
  onSendGift,
  onSeatAction,
}) => {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [showSeatActionSheet, setShowSeatActionSheet] = useState(false);
  const [showGiftSheet, setShowGiftSheet] = useState(false);
  const [selectedGiftCategory, setSelectedGiftCategory] = useState<'popular' | 'luxury' | 'lucky' | 'vip'>('popular');
  const [selectedGift, setSelectedGift] = useState<GiftItem>(gifts[0]);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [sendToAllMic, setSendToAllMic] = useState(false);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('host');
  const [isMyMicActive, setIsMyMicActive] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [crystalCoins, setCrystalCoins] = useState(room.crystalBallCoins);
  const [messages, setMessages] = useState<string[]>([
    'System: Welcome to MIZO Party Room. Respect room rules.',
    'Rohan VIP: 🎵 Welcome everyone to the stage!',
    'Zara Queen: Good evening friends! ✨',
  ]);
  const [chatInput, setChatInput] = useState('');

  // High-End Gifting & Animation Engine State
  const [currentBroadcast, setCurrentBroadcast] = useState<ActiveGiftBroadcast | null>(null);
  const [broadcastQueue, setBroadcastQueue] = useState<ActiveGiftBroadcast[]>([]);
  const [comboBadges, setComboBadges] = useState<ComboSideBadge[]>([]);

  // Rapid combo tap tracker
  const [rapidComboCount, setRapidComboCount] = useState(0);
  const rapidComboTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio wave pulsing simulation for occupied seats
  const [audioMeter, setAudioMeter] = useState<number[]>([60, 40, 80, 20]);
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioMeter([
        Math.floor(20 + Math.random() * 80),
        Math.floor(10 + Math.random() * 90),
        Math.floor(30 + Math.random() * 70),
        Math.floor(15 + Math.random() * 85),
      ]);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
    setShowSeatActionSheet(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages((prev) => [...prev, `Me: ${chatInput}`]);
    setChatInput('');
  };

  // Lucky Cash-Back evaluation algorithm (Habi Parity)
  const evaluateLuckyJackpot = (gift: GiftItem, combo: number): { multiplier: number; coinsWon: number; isJackpot: boolean } | undefined => {
    if (!gift.isLucky) return undefined;
    const roll = Math.random();
    let mult = 0;
    if (roll < 0.02) {
      mult = 500; // 2% chance 500x Mega Jackpot
    } else if (roll < 0.08) {
      mult = 50;  // 6% chance 50x Big Win
    } else if (roll < 0.25) {
      mult = 10;  // 17% chance 10x Win
    } else if (roll < 0.50) {
      mult = 2;   // 25% chance 2x Win
    }

    if (mult === 0) return undefined;
    const coinsWon = gift.coinPrice * combo * mult;
    return {
      multiplier: mult,
      coinsWon,
      isJackpot: mult >= 50,
    };
  };

  const triggerGiftSend = (specifiedCombo?: number) => {
    const activeCombo = specifiedCombo ?? comboMultiplier;
    const totalCost = selectedGift.coinPrice * activeCombo * (sendToAllMic ? 8 : 1);

    if (userCoins < totalCost) {
      setMessages((prev) => [...prev, `⚠️ System: Insufficient coins (${userCoins} available, ${totalCost} needed)`]);
      return;
    }

    // Evaluate lucky outcome
    const luckyResult = evaluateLuckyJackpot(selectedGift, activeCombo);

    // Notify parent
    onSendGift(selectedGift, activeCombo, luckyResult?.coinsWon);

    // Target recipient details
    let recName = room.hostName;
    let recAvatar = room.hostAvatar;
    if (sendToAllMic) {
      recName = 'All on Mic (8 Seats)';
      recAvatar = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80';
    } else if (selectedRecipientId === 'boss') {
      recName = 'Sultan (Boss)';
      recAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80';
    }

    const broadcastItem: ActiveGiftBroadcast = {
      id: `bc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      gift: selectedGift,
      senderName: 'Eyad Trader (Me)',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      receiverName: recName,
      receiverAvatar: recAvatar,
      combo: activeCombo,
      isAllMic: sendToAllMic,
      luckyCashBack: luckyResult,
    };

    // Update Side Floating Combo Badge (view_live_bullet_item_room_gift)
    const badgeKey = `me_${selectedGift.id}`;
    setComboBadges((prev) => {
      const existing = prev.find((b) => b.id === badgeKey);
      if (existing) {
        return prev.map((b) =>
          b.id === badgeKey
            ? { ...b, count: b.count + activeCombo, lastUpdated: Date.now() }
            : b
        );
      }
      return [
        ...prev,
        {
          id: badgeKey,
          senderName: 'Eyad Trader',
          senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
          giftIcon: selectedGift.icon,
          giftName: selectedGift.name,
          count: activeCombo,
          lastUpdated: Date.now(),
        },
      ];
    });

    // Auto-expire combo badges after 3.5 seconds
    setTimeout(() => {
      setComboBadges((prev) => prev.filter((b) => Date.now() - b.lastUpdated > 3200));
    }, 3500);

    // Full screen animation queue
    if (!currentBroadcast) {
      setCurrentBroadcast(broadcastItem);
    } else {
      setBroadcastQueue((prev) => [...prev, broadcastItem]);
    }

    // Room chat notification
    setMessages((prev) => [
      ...prev,
      `🎁 Me sent ${activeCombo}x ${selectedGift.name} ${selectedGift.icon} to ${recName}!`,
      ...(luckyResult
        ? [`🎰 LUCKY WIN! Me won +${luckyResult.coinsWon.toLocaleString()} Coins (${luckyResult.multiplier}x)!`]
        : []),
    ]);

    // Don't close sheet if rapid combo is active, otherwise close
    if (!selectedGift.isCombo) {
      setShowGiftSheet(false);
    }
  };

  const handleAnimationEnd = (id: string) => {
    setCurrentBroadcast(null);
    if (broadcastQueue.length > 0) {
      const next = broadcastQueue[0];
      setBroadcastQueue((prev) => prev.slice(1));
      setCurrentBroadcast(next);
    }
  };

  return (
    <div className="relative w-full h-[690px] max-w-[390px] mx-auto bg-gradient-to-b from-[#0D0B18] via-[#160D29] to-[#08060E] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(124,58,237,0.35)] border-4 border-[#241442] flex flex-col justify-between select-none">
      {/* Background Palace Artwork Scrim & Ambient Scrims */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80')`
        }}
      />
      <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#FFD700]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-40 -right-16 w-56 h-56 rounded-full bg-[#FF2E93]/10 blur-3xl pointer-events-none" />

      {/* 1. Header Bar: Host Info, Room ID, Listeners, Network Ping, Actions */}
      <div className="relative z-10 px-3.5 pt-3.5 pb-2 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#FFD700] via-[#FF2E93] to-[#FFA500] shadow-[0_0_12px_rgba(255,215,0,0.4)]">
            <img
              src={room.hostAvatar}
              alt={room.hostName}
              className="w-9 h-9 rounded-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black truncate max-w-[110px] text-white drop-shadow">
                {room.title}
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.2 bg-gradient-to-r from-[#FF2E93] to-[#FF5376] text-white rounded-full">
                + Follow
              </span>
            </div>
            <div className="text-[10px] text-[#FFD700] font-mono flex items-center gap-1.5">
              <span>ID:{room.roomId}</span>
              <span className="text-white/80">👤 {room.listenerCount}</span>
              <span className="text-[#00F5A0] font-bold">📶 42ms</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-200">
          <button className="p-1.5 hover:bg-white/10 rounded-full transition" title="Room Settings">
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded-full transition" title="Share Room">
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={onMinimize}
            className="p-1.5 hover:bg-white/10 rounded-full transition text-[#00F5A0]" 
            title="Minimize to Floating Mini-Player"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Cyberpunk Energy Beam PK Battle Arena */}
      <div className="relative z-10 mx-3 px-3 py-1.5 rounded-2xl bg-[#0D0B18]/80 border border-[#FFD700]/30 shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black text-[#FFD700] tracking-wider flex items-center gap-1">
            ⚔️ PK BATTLE ARENA
          </span>
          <div className="px-2 py-0.5 rounded-full bg-[#160D29] border border-[#00F5A0]/60 shadow-[0_0_8px_rgba(0,245,160,0.3)] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5A0] animate-ping" />
            <span className="text-[9px] font-mono font-black text-[#00F5A0]">02:45</span>
          </div>
        </div>
        <div className="relative h-2 rounded-full overflow-hidden bg-black/60 flex">
          <div className="h-full bg-gradient-to-r from-[#00E5FF] to-[#0284C7]" style={{ width: '54%' }} />
          <div className="h-full bg-gradient-to-r from-[#BE123C] to-[#FF2E93]" style={{ width: '46%' }} />
          <div className="absolute top-1/2 left-[54%] -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_#FFD700] flex items-center justify-center text-[7px]">
            ⚡
          </div>
        </div>
        <div className="flex justify-between items-center text-[9px] font-black font-mono mt-1">
          <span className="text-[#00E5FF]">💙 18,400</span>
          <span className="text-white/40 text-[8px] font-sans">TARGET 25k</span>
          <span className="text-[#FF2E93]">16,200 💖</span>
        </div>
      </div>

      {/* 3. Host Stage (Host Throne pos: 1000 + Imperial Boss Seat pos: 1001) */}
      <div className="relative z-10 py-1.5 flex items-center justify-around px-4">
        {/* Boss Seat (Pos 1001) */}
        <div 
          onClick={() => {
            setMessages(prev => [...prev, '👑 Boss Seat: Current VIP outbid is 50,000 Coins. Tap Send Gift to compete!']);
          }}
          className="relative flex flex-col items-center cursor-pointer group"
          title="Imperial Boss Seat (Pos 1001)"
        >
          <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#7C3AED] via-[#FFD700] to-[#FF2E93] shadow-[0_0_12px_rgba(124,58,237,0.5)]">
            <div className="w-full h-full rounded-full bg-[#0D0B18] p-0.5 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="VIP Boss"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[7px] font-black bg-gradient-to-r from-[#7C3AED] to-[#FF2E93] text-white px-1.5 py-0.2 rounded-full shadow">
              BOSS
            </span>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-black bg-[#0D0B18] border border-[#FFD700] text-[#FFD700] px-1.5 py-0.2 rounded-full shadow font-mono">
              50k🪙
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#FFD700] mt-2.5">Sultan VIP</span>
        </div>

        {/* Host Throne (Pos 1000 with Golden Crown & Triple Ring Pulse) */}
        <div className="relative flex flex-col items-center">
          <div className="relative">
            {/* Pulsing Triple Ring */}
            <div className="absolute -inset-2.5 rounded-full border-2 border-[#FFD700]/70 animate-ping opacity-50" />
            <div className="absolute -inset-1 rounded-full border border-[#FFA500]/80 animate-pulse" />
            
            {/* Host Avatar Frame */}
            <div className="relative w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-[#FFD700] via-[#FFA500] to-[#FFE082] shadow-[0_0_20px_rgba(255,215,0,0.6)]">
              <img
                src={room.hostAvatar}
                alt={room.hostName}
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            {/* Crown Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full text-[8.5px] font-black text-[#0D0B18] shadow flex items-center gap-0.5">
              <span>👑</span>
              <span>HOST</span>
            </div>

            {/* On Air Badge */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-[#00F5A0] rounded-full text-[7.5px] font-black text-[#0D0B18] shadow flex items-center gap-0.5">
              <span>MIC</span>
              <span>LIVE</span>
            </div>
          </div>

          <span className="text-xs font-black text-white drop-shadow mt-2">
            {room.hostName}
          </span>
        </div>

        {/* Lucky Room Crystal Coin Pool */}
        <div 
          onClick={() => setCrystalCoins(prev => prev + 10)}
          className="relative flex flex-col items-center cursor-pointer group"
          title="Lucky Room Coin Pool"
        >
          <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#FF2E93] to-[#FFD700] shadow-[0_0_12px_rgba(255,46,147,0.4)] flex items-center justify-center bg-[#0D0B18]">
            <span className="text-xl">🔮</span>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-black bg-[#160D29] border border-[#FF2E93] text-[#FFD700] px-1.5 py-0.2 rounded-full shadow font-mono">
              +{crystalCoins}
            </span>
          </div>
          <span className="text-[10px] font-bold text-pink-300 mt-2.5">Coin Pot</span>
        </div>
      </div>

      {/* 3. The 12-Seats Matrix Grid (Emerald Circles matching screenshots) */}
      <div className="relative z-10 px-4 py-2">
        <div className="grid grid-cols-4 gap-x-3 gap-y-3">
          {room.seats.map((seat) => {
            const isOccupied = seat.status === 'occupied' && seat.participant;
            const isLocked = seat.isLocked;
            const isSpeaking = isOccupied && seat.participant!.isSpeaking;

            return (
              <div
                key={seat.index}
                onClick={() => handleSeatClick(seat)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="relative">
                  {/* Dynamic Speaking Pulse Ring */}
                  {isSpeaking && (
                    <div className="absolute -inset-1.5 rounded-full border-2 border-emerald-400 animate-audio-ring opacity-80" />
                  )}

                  {/* Circular Seat Body */}
                  <div
                    className={`w-13 h-13 rounded-full flex items-center justify-center transition shadow-lg ${
                      isOccupied
                        ? 'p-0.5 bg-gradient-to-tr from-amber-400 to-emerald-400'
                        : 'bg-gradient-to-b from-[#115e3b] via-[#093c24] to-[#042013] border-2 border-[#22c55e]/70'
                    }`}
                  >
                    {isOccupied ? (
                      <img
                        src={seat.participant!.avatar}
                        alt={seat.participant!.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-amber-400 drop-shadow" />
                    ) : (
                      /* Gold Microphone Icon inside Emerald Badge from screenshot */
                      <svg
                        className="w-6 h-6 text-[#d4af37]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                      </svg>
                    )}
                  </div>

                  {/* Mute badge overlay */}
                  {isOccupied && seat.participant!.isMuted && (
                    <span className="absolute bottom-0 right-0 p-1 bg-rose-600 rounded-full text-white text-[8px] shadow">
                      <MicOff className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {/* Seat Label */}
                <span className="text-[11px] font-semibold text-white/90 drop-shadow mt-1 truncate max-w-[65px]">
                  {isOccupied ? seat.participant!.name : `No.${seat.index}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Live Chat Stream Messages with Stylized Badges & Translucent Glass */}
      <div className="relative z-10 px-3.5 h-24 overflow-y-auto space-y-1.5 text-xs">
        {messages.slice(-4).map((msg, idx) => {
          const isGift = msg.startsWith('🎁');
          const isLucky = msg.startsWith('🎰');
          return (
            <div
              key={idx}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-white/95 text-[11px] backdrop-blur-md border ${
                isLucky
                  ? 'bg-gradient-to-r from-red-950/80 to-amber-950/80 border-[#FFD700] text-[#FFD700] font-black shadow-[0_0_10px_rgba(255,215,0,0.3)]'
                  : isGift
                  ? 'bg-gradient-to-r from-[#7C3AED]/40 to-[#FF2E93]/40 border-[#FFD700]/60 font-bold shadow-sm'
                  : 'bg-[#160D29]/70 border-white/10'
              }`}
            >
              {!isGift && !isLucky && (
                <span className="px-1.5 py-0.2 bg-gradient-to-r from-[#38BDF8] to-[#2563EB] rounded text-[8px] font-black text-white">
                  Lv.28
                </span>
              )}
              <span>{msg}</span>
            </div>
          );
        })}
      </div>

      {/* 5. Bottom Navigation & Control Bar (Luxury Royal Theme) */}
      <div className="relative z-10 px-3 py-2 bg-[#0D0B18]/90 backdrop-blur-md border-t border-[#FFD700]/20 flex items-center justify-between gap-2">
        {/* Chat input trigger */}
        <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-1.5">
          <input
            type="text"
            placeholder="Say something friendly..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#160D29]/90 border border-white/15 rounded-full text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF2E93]"
          />
          {chatInput && (
            <button type="submit" className="p-1.5 bg-[#FF2E93] text-white rounded-full">
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Mic Toggle (Cyber Emerald Glow) */}
        <button
          onClick={() => setIsMyMicActive(!isMyMicActive)}
          className={`p-2 rounded-full border transition ${
            isMyMicActive
              ? 'bg-[#00F5A0] text-[#0D0B18] border-[#00F5A0] shadow-[0_0_12px_rgba(0,245,160,0.6)] font-bold'
              : 'bg-white/10 text-slate-300 border-white/20'
          }`}
          title={isMyMicActive ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {isMyMicActive ? <Mic className="w-4 h-4 text-[#0D0B18]" /> : <MicOff className="w-4 h-4" />}
        </button>

        {/* Raise Hand Button */}
        <button
          onClick={() => {
            setHandRaised(!handRaised);
            setMessages((prev) => [
              ...prev,
              handRaised ? 'System: You lowered your hand' : 'System: ✋ Hand raised for host!',
            ]);
          }}
          className={`p-2 rounded-full border transition ${
            handRaised
              ? 'bg-amber-600 text-white border-amber-400'
              : 'bg-white/10 text-slate-300 border-white/20'
          }`}
          title="Raise Hand to Speak"
        >
          <Hand className="w-4 h-4" />
        </button>

        {/* Gift Box Button (Neon Velvet Pink & Metallic Gold with Radial Pulse) */}
        <button
          onClick={() => setShowGiftSheet(true)}
          className="relative p-2.5 bg-gradient-to-r from-[#FF2E93] via-[#FF5376] to-[#FFD700] text-[#0D0B18] rounded-full shadow-[0_0_16px_rgba(255,46,147,0.6)] hover:scale-105 active:scale-95 transition"
          title="Send Gift"
        >
          <Gift className="w-4 h-4 text-[#0D0B18]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FFD700] rounded-full animate-ping" />
        </button>
      </div>

      {/* 6. Authentic Bottom Action Sheet (Matching User's Uploaded Screenshot) */}
      {showSeatActionSheet && selectedSeat && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-30 flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl overflow-hidden text-slate-900 divide-y divide-slate-100 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <button
              onClick={() => {
                onSeatAction(selectedSeat.index, 'take');
                setShowSeatActionSheet(false);
              }}
              className="w-full py-4 text-center font-medium text-sm hover:bg-slate-50 transition"
            >
              On mic
            </button>
            <button
              onClick={() => {
                setShowSeatActionSheet(false);
                setMessages((prev) => [...prev, `System: Seat invite link created`]);
              }}
              className="w-full py-4 text-center font-medium text-sm hover:bg-slate-50 transition"
            >
              Invite
            </button>
            <button
              onClick={() => {
                onSeatAction(selectedSeat.index, 'lock');
                setShowSeatActionSheet(false);
              }}
              className="w-full py-4 text-center font-medium text-sm hover:bg-slate-50 transition"
            >
              {selectedSeat.isLocked ? 'Unlock' : 'Lock'}
            </button>
            <button
              onClick={() => {
                onSeatAction(selectedSeat.index, 'lock_all');
                setShowSeatActionSheet(false);
              }}
              className="w-full py-4 text-center font-medium text-sm hover:bg-slate-50 transition"
            >
              Lock All
            </button>
            <button
              onClick={() => {
                onSeatAction(selectedSeat.index, 'mute');
                setShowSeatActionSheet(false);
              }}
              className="w-full py-4 text-center font-medium text-sm hover:bg-slate-50 transition"
            >
              {selectedSeat.isMutedByHost ? 'Unmute' : 'Mute'}
            </button>
            <div className="h-2 bg-slate-100" />
            <button
              onClick={() => setShowSeatActionSheet(false)}
              className="w-full py-4 text-center font-medium text-sm text-slate-500 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 7. High-Fidelity Tabbed Gift Sheet Modal (Habi Parity) */}
      {showGiftSheet && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-30 flex flex-col justify-end animate-in fade-in duration-150">
          <div className="bg-[#101726] border-t border-slate-700/80 rounded-t-3xl p-4 text-white shadow-2xl flex flex-col max-h-[460px]">
            {/* Top Bar: Coin Balance & Recipient Selection */}
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-mono font-bold text-xs flex items-center gap-1">
                  💰 {userCoins.toLocaleString()}
                </span>
                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full text-[9px] font-black text-slate-950 uppercase tracking-wider">
                  Recharge
                </span>
              </div>

              {/* Recipient Selector / All on Mic Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSendToAllMic(!sendToAllMic)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 ${
                    sendToAllMic
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/50 ring-1 ring-blue-400'
                      : 'bg-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <span>{sendToAllMic ? 'All Mic (8x)' : 'All on Mic'}</span>
                </button>
                <button
                  onClick={() => setShowGiftSheet(false)}
                  className="p-1 text-white/50 hover:text-white rounded-full transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Tabs: Popular, Luxury, Lucky 🎰, VIP 👑 */}
            <div className="flex items-center gap-2 my-2.5">
              {(
                [
                  { id: 'popular', label: 'Popular' },
                  { id: 'luxury', label: 'Luxury' },
                  { id: 'lucky', label: 'Lucky 🎰' },
                  { id: 'vip', label: 'VIP 👑' },
                ] as const
              ).map((tab) => {
                const isActive = selectedGiftCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedGiftCategory(tab.id);
                      const match = gifts.find((g) => g.category === tab.id);
                      if (match) setSelectedGift(match);
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-sm'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Filtered Gift Grid */}
            <div className="grid grid-cols-4 gap-2 my-1 overflow-y-auto max-h-44 pr-1">
              {gifts
                .filter((g) => g.category === selectedGiftCategory)
                .map((gift) => {
                  const isSelected = selectedGift.id === gift.id;

                  return (
                    <div
                      key={gift.id}
                      onClick={() => setSelectedGift(gift)}
                      className={`relative p-2 rounded-xl text-center cursor-pointer transition border flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-blue-900/40 border-amber-400 ring-1 ring-amber-400/80 shadow-md shadow-amber-400/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {gift.isLucky && (
                        <span className="absolute top-1 right-1 px-1 py-0.2 bg-red-600 rounded text-[8px] font-black text-white uppercase">
                          🎰
                        </span>
                      )}
                      {gift.isCombo && (
                        <span className="absolute top-1 left-1 px-1 py-0.2 bg-pink-600 rounded text-[8px] font-black text-white">
                          Combo
                        </span>
                      )}
                      <span className="text-2xl block animate-in zoom-in duration-100">{gift.icon}</span>
                      <span className="text-[10px] font-bold block truncate w-full text-slate-100 mt-1">
                        {gift.name}
                      </span>
                      <span className="text-[9px] font-mono text-amber-300 font-bold block mt-0.5">
                        🪙 {gift.coinPrice.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
            </div>

            {/* Bottom Action Footer: Combos & Send CTA */}
            <div className="flex items-center justify-between pt-2.5 mt-auto border-t border-white/10 gap-2">
              {/* Combo Preset Buttons */}
              <div className="flex items-center gap-1">
                {[1, 10, 88, 520].map((num) => (
                  <button
                    key={num}
                    onClick={() => setComboMultiplier(num)}
                    className={`px-2 py-1 rounded text-[10px] font-black font-mono transition ${
                      comboMultiplier === num
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    x{num}
                  </button>
                ))}
              </div>

              {/* Combo Rapid Batter vs Standard Send Button */}
              {selectedGift.isCombo ? (
                <button
                  onClick={() => triggerGiftSend(1)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 via-pink-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white rounded-full text-xs font-black shadow-lg shadow-pink-500/30 active:scale-95 transition flex items-center gap-1.5 animate-pulse"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Combo Tap (🪙{selectedGift.coinPrice * (sendToAllMic ? 8 : 1)})</span>
                </button>
              ) : (
                <button
                  onClick={() => triggerGiftSend()}
                  className="px-5 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-full text-xs font-black shadow-lg shadow-pink-500/30 active:scale-95 transition"
                >
                  Send (🪙{(selectedGift.coinPrice * comboMultiplier * (sendToAllMic ? 8 : 1)).toLocaleString()})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. Web Preview High-End Gift & Animation Overlay (Habi Parity) */}
      <WebGiftAnimationOverlay
        currentGift={currentBroadcast}
        comboBadges={comboBadges}
        onAnimationEnd={handleAnimationEnd}
      />
    </div>
  );
};
