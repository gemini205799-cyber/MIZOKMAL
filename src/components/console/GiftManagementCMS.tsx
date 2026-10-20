import React, { useState } from 'react';
import { GiftItem } from '../../types';
import { Translations } from '../../i18n/translations';
import { 
  Gift, 
  Sparkles, 
  Plus, 
  Trash2, 
  Play, 
  Volume2, 
  VolumeX, 
  Coins, 
  Layers, 
  Wand2, 
  Check, 
  Sliders, 
  X,
  Dice5
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GiftCardArt } from '../client/GiftCardArt';

interface GiftManagementCMSProps {
  t: Translations;
  gifts: GiftItem[];
  onAddGift: (newGift: GiftItem) => void;
  onDeleteGift: (giftId: string) => void;
}

export const GiftManagementCMS: React.FC<GiftManagementCMSProps> = ({
  t,
  gifts,
  onAddGift,
  onDeleteGift,
}) => {
  const [selectedGift, setSelectedGift] = useState<GiftItem>(gifts[0]);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Gift Form State matching Habi DTOs
  const [nameEn, setNameEn] = useState('Imperial Royal Dragon');
  const [nameBn, setNameBn] = useState('রাজকীয় ড্রাগন');
  const [nameAr, setNameAr] = useState('التنين الإمبراطوري الملكي');
  const [coinCost, setCoinCost] = useState(65000);
  const [category, setCategory] = useState<GiftItem['category']>('special');
  const [icon, setIcon] = useState('🐉');
  const [svgaAvatarKey, setSvgaAvatarKey] = useState('avatar_rider_crest');
  const [pagUrl, setPagUrl] = useState('https://mizo-assets.live/pag/royal_dragon.pag');
  const [soundUrl, setSoundUrl] = useState('https://assets.mixkit.co/active_storage/sfx/2873/2873-preview.mp3');
  const [isCombo, setIsCombo] = useState(false);
  const [isLucky, setIsLucky] = useState(false);
  const [luckyJackpotRate, setLuckyJackpotRate] = useState(0.005); // 0.5% jackpot
  const [durationSec, setDurationSec] = useState(5.5);

  const handlePlayPreview = (gift: GiftItem) => {
    setIsPreviewPlaying(true);

    // Audio sync test
    try {
      const audio = new Audio(gift.soundFxUrl);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (_) {}

    // Visual celebration test
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'],
    });

    setTimeout(() => {
      setIsPreviewPlaying(false);
    }, (gift.durationMs || 4000));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGift: GiftItem = {
      id: `gift_${Date.now()}`,
      name: nameEn,
      arabicName: nameAr,
      bengaliName: nameBn,
      coinPrice: Number(coinCost),
      diamondValue: Math.round(Number(coinCost) * 0.7),
      category: category,
      icon: icon,
      animationType: pagUrl.endsWith('.pag') ? 'pag' : 'svga',
      animationUrl: pagUrl,
      pagUrl: pagUrl,
      svgaAvatarKey: svgaAvatarKey,
      soundFxUrl: soundUrl,
      durationMs: Math.round(durationSec * 1000),
      isCombo: isCombo,
      isLucky: isLucky,
      luckyJackpotRate: luckyJackpotRate,
    };

    onAddGift(newGift);
    setSelectedGift(newGift);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">{t.giftMatrixTitle}</h2>
          <p className="text-xs text-slate-400">
            Habi Parity: Configure PAG / SVGA formats, audio synchronization, and lucky cash-back odds
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addNewGift}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Gift Catalog List */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2.5 max-h-[640px] overflow-y-auto">
          {gifts.map((gift) => {
            const isSelected = selectedGift.id === gift.id;

            return (
              <div
                key={gift.id}
                onClick={() => setSelectedGift(gift)}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500/30'
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center w-12 h-12">
                    <GiftCardArt giftId={gift.id} size={36} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{gift.name}</h4>
                    <span className="text-[11px] text-amber-400/90 font-mono">
                      {gift.subtitle || `${gift.category.toUpperCase()} TIER`}
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {gift.coinPrice.toLocaleString()} Coins · {gift.category.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPreview(gift);
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-blue-600 text-slate-200 rounded-lg transition"
                    title="Play Preview"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteGift(gift.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Gift In-Dashboard Audio-Visual Inspector */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <GiftCardArt giftId={selectedGift.id} size={32} />
                <h3 className="text-base font-bold text-white">{selectedGift.name}</h3>
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-mono rounded">
                  {selectedGift.category.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-amber-300 mt-1 font-mono">
                {selectedGift.subtitle || `${selectedGift.category.toUpperCase()} TIER`}
              </p>
            </div>

            <button
              onClick={() => handlePlayPreview(selectedGift)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Simulate In-Room Blast</span>
            </button>
          </div>

          {/* Graphic Simulator Canvas */}
          <div className="relative h-48 bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
            {isPreviewPlaying ? (
              <div className="text-center animate-in zoom-in duration-300 flex flex-col items-center">
                <div className="mb-2 filter drop-shadow-[0_8px_20px_rgba(255,215,0,0.5)]">
                  <GiftCardArt giftId={selectedGift.id} size={72} />
                </div>
                <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-500 uppercase tracking-widest">
                  Rendering {selectedGift.name}
                </span>
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 mt-1 font-mono">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>Audio Sync Active (48kHz Opus)</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 flex flex-col items-center">
                <div className="mb-2 opacity-60">
                  <GiftCardArt giftId={selectedGift.id} size={48} />
                </div>
                <p className="text-xs">Preview canvas idle. Click "Simulate In-Room Blast" to test audio sync & graphics.</p>
              </div>
            )}
          </div>

          {/* DTO Technical Properties Inspector */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Habi DTO Schema Invariants (`GiftJson.java`)
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-500 block text-[10px]">COIN COST</span>
                <span className="text-amber-400 font-bold text-sm">
                  {selectedGift.coinPrice.toLocaleString()} Coins
                </span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-500 block text-[10px]">HOST DIAMONDS (70%)</span>
                <span className="text-cyan-400 font-bold text-sm">
                  {selectedGift.diamondValue.toLocaleString()} Diamonds
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>Sound Asset:</span>
                <span className="text-slate-200 truncate max-w-[240px]">{selectedGift.soundFxUrl}</span>
              </div>
              <div className="flex justify-between">
                <span>Animation Path:</span>
                <span className="text-slate-200 truncate max-w-[240px]">{selectedGift.animationUrl}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="text-slate-200">{(selectedGift.durationMs / 1000).toFixed(1)}s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload & Create Gift Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Register New Gift Asset (Habi Engine)</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Name (English)</label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Name (Bengali)</label>
                  <input
                    type="text"
                    value={nameBn}
                    onChange={(e) => setNameBn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Name (Arabic)</label>
                <input
                  type="text"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-right"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Coin Price</label>
                  <input
                    type="number"
                    value={coinCost}
                    onChange={(e) => setCoinCost(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-center"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="popular">Popular</option>
                    <option value="luxury">Luxury</option>
                    <option value="lucky">Lucky 🎰</option>
                    <option value="vip">VIP 👑</option>
                    <option value="romantic">Romantic</option>
                    <option value="special">Special</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">PAG / SVGA Asset URL</label>
                <input
                  type="text"
                  value={pagUrl}
                  onChange={(e) => setPagUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sound FX Audio URL</label>
                <input
                  type="text"
                  value={soundUrl}
                  onChange={(e) => setSoundUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  required
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isCombo}
                    onChange={(e) => setIsCombo(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Allow Combo Batter (`is_combo`)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isLucky}
                    onChange={(e) => setIsLucky(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Lucky Cash-Back Engine (`lucky`)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-md"
                >
                  Save & Publish to Room Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
