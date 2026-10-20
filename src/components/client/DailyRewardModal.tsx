import React from 'react';
import { X, Check } from 'lucide-react';

interface DailyRewardModalProps {
  onClose: () => void;
  onClaim: (coins: number) => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ onClose, onClaim }) => {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#20b2aa]/90 via-[#e0f2f1] to-white rounded-3xl p-5 shadow-2xl overflow-hidden border border-emerald-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-black/20 hover:bg-black/30 rounded-full text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header matching screenshot */}
        <div className="text-center pt-2 pb-4">
          <div className="text-3xl mb-1">📅✨</div>
          <h3 className="text-xl font-extrabold text-emerald-950">Daily Reward</h3>
          <p className="text-xs text-emerald-800 font-medium mt-0.5">
            Sign in for 7 days for rich rewards
          </p>
        </div>

        {/* 7-Days Reward Matrix matching screenshot */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {/* Day 1 - Already Signed */}
          <div className="bg-emerald-100/90 border border-emerald-300 rounded-xl p-2 text-center relative flex flex-col items-center">
            <span className="absolute top-1 left-1.5 text-[9px] font-bold text-emerald-800">1</span>
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white my-1">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-[10px] font-bold text-emerald-900">6000 🪙</span>
          </div>

          {/* Day 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-2 text-center relative flex flex-col items-center shadow-xs">
            <span className="absolute top-1 left-1.5 text-[9px] font-bold text-slate-500">2</span>
            <span className="text-xl my-1">🪙</span>
            <span className="text-[10px] font-bold text-slate-800">6000</span>
          </div>

          {/* Day 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-2 text-center relative flex flex-col items-center shadow-xs">
            <span className="absolute top-1 left-1.5 text-[9px] font-bold text-slate-500">3</span>
            <span className="text-xl my-1">⭕</span>
            <span className="text-[9px] font-semibold text-slate-600">x1 Day</span>
          </div>

          {/* Day 4 */}
          <div className="bg-white border border-slate-200 rounded-xl p-2 text-center relative flex flex-col items-center shadow-xs">
            <span className="absolute top-1 left-1.5 text-[9px] font-bold text-slate-500">4</span>
            <span className="text-xl my-1">🪙</span>
            <span className="text-[10px] font-bold text-slate-800">12000</span>
          </div>

          {/* Day 5 */}
          <div className="bg-white border border-slate-200 rounded-xl p-2 text-center relative flex flex-col items-center shadow-xs col-span-2">
            <span className="absolute top-1 left-1.5 text-[9px] font-bold text-slate-500">5</span>
            <div className="flex items-center justify-center gap-2 my-1">
              <span className="text-lg">🪙 12000</span>
              <span className="text-xl">🏍️</span>
            </div>
            <span className="text-[9px] text-amber-700 font-bold">Gold Bike (1 Day)</span>
          </div>

          {/* Day 6 */}
          <div className="bg-white border border-slate-200 rounded-xl p-2 text-center relative flex flex-col items-center shadow-xs col-span-2">
            <span className="absolute top-1 left-1.5 text-[9px] font-bold text-slate-500">6</span>
            <div className="flex items-center justify-center gap-2 my-1">
              <span className="text-lg">🪙 12000</span>
              <span className="text-xl">🌅</span>
            </div>
            <span className="text-[9px] text-amber-700 font-bold">Sunset Theme (3 Days)</span>
          </div>
        </div>

        {/* Day 7 Big Reward Box */}
        <div className="p-3 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-50 border-2 border-amber-300 rounded-2xl mb-4 text-center">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 mb-1">
            Day 7 Super Grand Mystery Box
          </div>
          <div className="flex items-center justify-around py-1">
            <div className="text-center">
              <span className="text-2xl block">🪙</span>
              <span className="text-[10px] font-bold text-slate-800">18,000</span>
            </div>
            <div className="text-center">
              <span className="text-2xl block">👑</span>
              <span className="text-[10px] font-bold text-slate-800">Super Fans</span>
            </div>
            <div className="text-center">
              <span className="text-2xl block">🏎️</span>
              <span className="text-[10px] font-bold text-slate-800">McLaren P1</span>
            </div>
          </div>
        </div>

        {/* Claim / Signed Button */}
        <button
          onClick={() => {
            onClaim(6000);
            onClose();
          }}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/30 transition cursor-pointer"
        >
          Claim Today's Bonus (+6,000 Coins)
        </button>
      </div>
    </div>
  );
};
