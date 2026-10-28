import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Wallet, 
  Gift, 
  ShieldCheck, 
  Award, 
  Flame, 
  Heart, 
  Users, 
  ShoppingBag, 
  Shirt, 
  Globe, 
  ChevronRight,
  Coins,
  CheckCircle2,
  Sparkles,
  Edit2,
  X,
  CreditCard,
  Gem,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MobileProfileProps {
  onBack: () => void;
  userCoins: number;
  onOpenInvite: () => void;
  onAddCoins?: (amount: number) => void;
}

export const MobileProfile: React.FC<MobileProfileProps> = ({ 
  onBack, 
  userCoins, 
  onOpenInvite,
  onAddCoins
}) => {
  const [profileName, setProfileName] = useState('Eyad Trader');
  const [profileBio, setProfileBio] = useState('Voice room host & high-roller gifter. Mizo Ambassador 🌟');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoCodeUsed, setPromoCodeUsed] = useState(false);
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  // Modals state
  const [showEditBioModal, setShowEditBioModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showMyItemsModal, setShowMyItemsModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Store Items
  const [inventory, setInventory] = useState<string[]>(['Imperial Gold Frame']);
  const storeItems = [
    { id: 'item1', name: 'Royal Pegasus Entrance', type: 'Entrance Effect', price: 15000, icon: '🦄' },
    { id: 'item2', name: 'Cyber Neon Avatar Frame', type: 'Avatar Frame', price: 8000, icon: '👑' },
    { id: 'item3', name: 'Golden Glow Chat Bubble', type: 'Chat Theme', price: 5000, icon: '💬' },
    { id: 'item4', name: 'Diamond Mic Badge', type: 'Medal', price: 12000, icon: '💎' }
  ];

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCodeUsed) {
      setPromoFeedback('Promo code MIZO-DEMO already redeemed.');
      return;
    }

    if (promoCodeInput.trim().toUpperCase() === 'MIZO-DEMO') {
      setPromoCodeUsed(true);
      onAddCoins?.(10000);
      setPromoFeedback('🎉 10,000 Coins added to your wallet!');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } else {
      setPromoFeedback('Invalid code. Try MIZO-DEMO');
    }
  };

  const handleBuyItem = (item: typeof storeItems[0]) => {
    if (userCoins < item.price) {
      alert(`Insufficient coins! You need ${item.price} coins.`);
      return;
    }
    onAddCoins?.(-item.price);
    setInventory(prev => [...prev, item.name]);
    confetti({ particleCount: 40, spread: 50 });
  };

  return (
    <div dir="ltr" className="relative w-full h-[680px] max-w-[390px] mx-auto bg-gradient-to-b from-[#0e1628] via-[#090d18] to-[#060810] text-slate-100 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 flex flex-col justify-between select-none font-sans">
      
      {/* 1. Top Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between text-slate-200 shrink-0">
        <button
          onClick={onBack}
          className="p-1.5 hover:bg-slate-800/80 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold tracking-wide">Me & Account</span>
        <button 
          onClick={() => setShowEditBioModal(true)}
          className="p-1.5 hover:bg-slate-800/80 rounded-full transition text-slate-300"
          title="Edit Profile"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Profile Identity Banner */}
      <div className="px-5 pt-1 pb-3 flex flex-col items-center shrink-0">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
            alt={profileName}
            className="w-20 h-20 rounded-full object-cover ring-3 ring-cyan-500/80 shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full text-[10px] font-black text-slate-950 shadow-md border border-amber-300 flex items-center gap-0.5">
            <Crown className="w-3 h-3 text-slate-950" />
            <span>SVIP4</span>
          </div>
        </div>

        <h3 className="text-base font-bold text-white mt-2 flex items-center gap-1.5">
          <span>{profileName}</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-mono font-bold">
            LV.48
          </span>
        </h3>
        <p className="text-xs font-mono text-slate-400 mt-0.5">ID: #MZ-77294 📋</p>
        <p className="text-[11px] text-slate-400 text-center max-w-[280px] mt-1 italic">
          "{profileBio}"
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-7 mt-3 text-center">
          <div>
            <div className="text-sm font-bold text-white font-mono">1,480</div>
            <div className="text-[10px] text-slate-400">Followers</div>
          </div>
          <div>
            <div className="text-sm font-bold text-white font-mono">218</div>
            <div className="text-[10px] text-slate-400">Following</div>
          </div>
          <div>
            <div className="text-sm font-bold text-cyan-400 font-mono font-bold">9,420</div>
            <div className="text-[10px] text-slate-400">Profile Visits</div>
          </div>
        </div>
      </div>

      {/* 3. Promo Code MIZO-DEMO Strip */}
      <div className="px-4 shrink-0">
        <form onSubmit={handleApplyPromo} className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <input
            type="text"
            placeholder="Enter promo code (e.g. MIZO-DEMO)"
            value={promoCodeInput}
            onChange={(e) => setPromoCodeInput(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white placeholder-amber-200/50 focus:outline-none uppercase font-mono font-bold"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-[11px] font-bold rounded-xl transition shadow"
          >
            Claim
          </button>
        </form>
        {promoFeedback && (
          <p className="text-[10px] text-amber-300 font-medium mt-1 px-1">{promoFeedback}</p>
        )}
      </div>

      {/* 4. Options Menu List */}
      <div className="flex-1 overflow-y-auto px-4 py-2.5 space-y-2 text-xs">
        {/* Wallet */}
        <div 
          onClick={() => setShowWalletModal(true)}
          className="bg-slate-900/80 hover:bg-slate-850 p-3 rounded-2xl border border-slate-800 flex items-center justify-between cursor-pointer transition shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/15 text-amber-400 rounded-xl border border-amber-500/30">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white block">Wallet Balance</span>
              <span className="text-[10px] text-slate-400">Recharge & diamond conversion</span>
            </div>
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-amber-400">
            <span>🪙 {userCoins.toLocaleString()}</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Invite Friends */}
        <div
          onClick={onOpenInvite}
          className="bg-slate-900/80 hover:bg-slate-850 p-3 rounded-2xl border border-slate-800 flex items-center justify-between cursor-pointer transition shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/15 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Gift className="w-4 h-4" />
            </div>
            <span className="font-semibold text-white">Invite Friends</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black rounded-full text-[10px] font-bold">
              +5,000 Coins
            </span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Store */}
        <div 
          onClick={() => setShowStoreModal(true)}
          className="bg-slate-900/80 hover:bg-slate-850 p-3 rounded-2xl border border-slate-800 flex items-center justify-between cursor-pointer transition shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-fuchsia-500/15 text-fuchsia-400 rounded-xl border border-fuchsia-500/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white block">Avatar & Effects Store</span>
              <span className="text-[10px] text-slate-400">Frames, chat themes & badges</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* My Inventory */}
        <div 
          onClick={() => setShowMyItemsModal(true)}
          className="bg-slate-900/80 hover:bg-slate-850 p-3 rounded-2xl border border-slate-800 flex items-center justify-between cursor-pointer transition shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/15 text-cyan-400 rounded-xl border border-cyan-500/30">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white block">My Inventory</span>
              <span className="text-[10px] text-slate-400">{inventory.length} items equipped</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* Language setting */}
        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/15 text-blue-400 rounded-xl border border-blue-500/30">
              <Globe className="w-4 h-4" />
            </div>
            <span className="font-semibold text-white">Language</span>
          </div>
          <span className="text-xs font-semibold text-cyan-400">English (LTR)</span>
        </div>
      </div>

      {/* MODAL: Edit Profile */}
      {showEditBioModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white">Edit Profile</h4>
              <button onClick={() => setShowEditBioModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Display Name</label>
                <input 
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Bio / Status</label>
                <textarea 
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white resize-none"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowEditBioModal(false)}
                className="px-3.5 py-1.5 bg-cyan-500 text-black font-bold text-xs rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Store */}
      {showStoreModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-h-[85%] flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 shrink-0">
              <div>
                <h4 className="text-sm font-bold text-white">Virtual Items Store</h4>
                <p className="text-[10px] text-amber-400 font-mono">🪙 {userCoins.toLocaleString()} Coins Available</p>
              </div>
              <button onClick={() => setShowStoreModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 pr-1">
              {storeItems.map((item) => {
                const alreadyOwned = inventory.includes(item.name);
                return (
                  <div key={item.id} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <span className="font-bold text-white block">{item.name}</span>
                        <span className="text-[10px] text-slate-400">{item.type}</span>
                      </div>
                    </div>

                    <button
                      disabled={alreadyOwned}
                      onClick={() => handleBuyItem(item)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition ${
                        alreadyOwned 
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-black hover:opacity-90 shadow'
                      }`}
                    >
                      {alreadyOwned ? 'Owned' : `🪙 ${item.price.toLocaleString()}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: My Items */}
      {showMyItemsModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white">My Equipped Items</h4>
              <button onClick={() => setShowMyItemsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto text-xs">
              {inventory.map((name, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-white">
                  <span>✨ {name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Wallet */}
      {showWalletModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-amber-400" />
                Wallet & Top-up
              </h4>
              <button onClick={() => setShowWalletModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-slate-400 text-xs">Current Balance</span>
              <p className="text-xl font-bold font-mono text-amber-400 mt-0.5">🪙 {userCoins.toLocaleString()}</p>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <p className="text-slate-400 font-semibold text-[11px]">Instant Top-up Packages</p>
              {[
                { coins: 10000, price: '$0.99' },
                { coins: 50000, price: '$4.99' },
                { coins: 150000, price: '$14.99' }
              ].map((pkg, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl">
                  <span className="font-mono font-bold text-white">🪙 {pkg.coins.toLocaleString()} Coins</span>
                  <button 
                    onClick={() => {
                      onAddCoins?.(pkg.coins);
                      confetti({ particleCount: 30 });
                    }}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs"
                  >
                    {pkg.price}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
