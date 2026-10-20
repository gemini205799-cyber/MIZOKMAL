import React from 'react';
import { X, Award, Gift, ArrowRight } from 'lucide-react';

interface InviteFriendsModalProps {
  onClose: () => void;
  onClaimCoins: (amount: number) => void;
}

export const InviteFriendsModal: React.FC<InviteFriendsModalProps> = ({ onClose, onClaimCoins }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#450a0a] via-[#290a0a] to-[#170505] rounded-3xl p-5 shadow-2xl overflow-hidden border-2 border-amber-500/60 text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Golden Crown & Treasure Chest Banner */}
        <div className="text-center pt-2 pb-3">
          <div className="relative inline-block">
            <span className="text-5xl block animate-bounce">👑</span>
            <span className="text-4xl block -mt-2">🎁💰</span>
          </div>
          <h3 className="text-xl font-extrabold text-amber-400 mt-1">
            ادع الأصدقاء للحصول على العملات
          </h3>
          <p className="text-xs text-amber-200/80">Invite Friends & Earn Big Coins</p>
        </div>

        {/* Withdrawal preview box from screenshot */}
        <div className="bg-black/50 border border-amber-500/40 rounded-2xl p-4 text-center mb-4">
          <div className="text-xs text-amber-300/80 mb-1">عملات للسحب (Coins Available)</div>
          <div className="text-2xl font-bold font-mono text-amber-400">0 🪙</div>
          <button 
            onClick={() => onClaimCoins(300000)}
            className="mt-3 px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-bold text-xs rounded-full shadow hover:scale-105 transition cursor-pointer"
          >
            سحب (Withdraw)
          </button>
        </div>

        {/* Rules Cards from screenshot */}
        <div className="space-y-2 text-xs mb-4">
          <div className="p-3 bg-amber-950/40 border border-amber-700/50 rounded-xl flex items-center justify-between">
            <span className="font-bold text-amber-300 font-mono">300,000 🪙</span>
            <span className="text-slate-300 text-right">ادع صديقا واحدا واحصل على العملات</span>
          </div>

          <div className="p-3 bg-amber-950/40 border border-amber-700/50 rounded-xl flex items-center justify-between">
            <span className="font-bold text-amber-300 font-mono">300,000 🪙</span>
            <span className="text-slate-300 text-right">شحن رصيد صديقك &gt; 600,000 عملة</span>
          </div>

          <div className="p-3 bg-amber-950/40 border border-amber-700/50 rounded-xl flex items-center justify-between">
            <span className="font-bold text-emerald-400 font-mono">احصل على 5%</span>
            <span className="text-slate-300 text-right">الأصدقاء يرسلون الهدايا</span>
          </div>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText('https://mizo.live/invite/24064120');
            alert('Invite link copied! Share with friends to earn 300,000 coins.');
          }}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg hover:from-amber-400 hover:to-orange-500 transition cursor-pointer"
        >
          نسخ رابط الدعوة (Copy Invite Link)
        </button>
      </div>
    </div>
  );
};
