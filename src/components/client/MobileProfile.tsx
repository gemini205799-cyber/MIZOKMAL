import React from 'react';
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
  Coins
} from 'lucide-react';

interface MobileProfileProps {
  onBack: () => void;
  userCoins: number;
  onOpenInvite: () => void;
}

export const MobileProfile: React.FC<MobileProfileProps> = ({ onBack, userCoins, onOpenInvite }) => {
  return (
    <div className="relative w-full h-[680px] max-w-[390px] mx-auto bg-gradient-to-b from-[#b2f5ea] via-[#e6fffa] to-white rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between text-slate-800">
        <button
          onClick={onBack}
          className="p-1.5 hover:bg-black/10 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold">Profile</span>
        <div className="w-5" />
      </div>

      {/* Profile Info Header */}
      <div className="px-5 pt-2 pb-4 flex flex-col items-center">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
            alt="Eyad Trader"
            className="w-20 h-20 rounded-full object-cover ring-3 ring-white shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-amber-500 rounded-full text-[9px] font-bold text-slate-950 shadow">
            SVIP4
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 mt-2">《Kit Kat》 · (🟡)</h3>
        <p className="text-xs font-mono text-slate-500 mt-0.5">ID: 24064120 📋</p>

        {/* Followers / Following / Visitors */}
        <div className="flex items-center gap-8 mt-3 text-center">
          <div>
            <div className="text-sm font-bold text-slate-900 font-mono">55</div>
            <div className="text-[11px] text-slate-500">Followers</div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 font-mono">4</div>
            <div className="text-[11px] text-slate-500">Following</div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 font-mono">217</div>
            <div className="text-[11px] text-slate-500">Visitors</div>
          </div>
        </div>
      </div>

      {/* Options Menu List matching screenshot */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 text-xs">
        {/* Wallet */}
        <div className="bg-white p-3 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-800">Wallet</span>
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-amber-600">
            <span>🪙 {userCoins.toLocaleString()}</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Invite Friends */}
        <div
          onClick={onOpenInvite}
          className="bg-white p-3 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-amber-50/50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Gift className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-800">Invite Friends</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-[10px] font-bold">
              Earn Coins 🎉
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* SVIP */}
        <div className="bg-white p-3 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 text-amber-400 rounded-xl font-bold font-mono">
              S
            </div>
            <span className="font-semibold text-slate-800">SVIP</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[10px] font-bold font-mono">
              SVIP4
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Level */}
        <div className="bg-white p-3 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <Flame className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-800">Level</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-2 py-0.5 bg-purple-600 text-white rounded text-[10px] font-bold font-mono">
              Lv.77
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* CP / Friend */}
        <div className="bg-white p-3 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-xl">
              <Heart className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-800">CP / Friend</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Family */}
        <div className="bg-white p-3 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-800">Family</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-2 py-0.5 bg-purple-700 text-white rounded text-[10px] font-bold font-mono">
              Royal Stars
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Store */}
        <div className="bg-white p-3 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-800">Store</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Language */}
        <div className="bg-white p-3 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Globe className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-800">Language</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <span>English</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
