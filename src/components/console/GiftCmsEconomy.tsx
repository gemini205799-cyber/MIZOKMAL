import React, { useState } from 'react';
import { GiftItem, TransactionRecord, WithdrawalRequest } from '../../types';
import { 
  Gift, 
  Sparkles, 
  Plus, 
  Trash2, 
  Play, 
  DollarSign, 
  ArrowUpRight, 
  Check, 
  X, 
  CreditCard,
  Layers,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GiftCmsEconomyProps {
  gifts: GiftItem[];
  transactions: TransactionRecord[];
  withdrawals: WithdrawalRequest[];
  onAddGift: (newGift: GiftItem) => void;
  onDeleteGift: (giftId: string) => void;
  onReviewWithdrawal: (id: string, approved: boolean) => void;
}

export const GiftCmsEconomy: React.FC<GiftCmsEconomyProps> = ({
  gifts,
  transactions,
  withdrawals,
  onAddGift,
  onDeleteGift,
  onReviewWithdrawal,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'ledger' | 'withdrawals'>('matrix');
  const [showNewGiftModal, setShowNewGiftModal] = useState(false);
  const [testPlayingGift, setTestPlayingGift] = useState<string | null>(null);

  // New gift form state
  const [newGiftName, setNewGiftName] = useState('Royal Arabian Falcon');
  const [newGiftSubtitle, setNewGiftSubtitle] = useState('Imperial Falcon SVGA');
  const [newGiftPrice, setNewGiftPrice] = useState(22000);
  const [newGiftCategory, setNewGiftCategory] = useState<GiftItem['category']>('luxury');
  const [newGiftIcon, setNewGiftIcon] = useState('🦅');

  const handleTestGift = (gift: GiftItem) => {
    setTestPlayingGift(gift.name);
    // Trigger visual confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Try playing sound if available
    try {
      const audio = new Audio(gift.soundFxUrl);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {}

    setTimeout(() => {
      setTestPlayingGift(null);
    }, 3000);
  };

  const handleCreateGift = (e: React.FormEvent) => {
    e.preventDefault();
    const newGift: GiftItem = {
      id: `gift_${Date.now()}`,
      name: newGiftName,
      subtitle: newGiftSubtitle,
      coinPrice: Number(newGiftPrice),
      diamondValue: Math.round(Number(newGiftPrice) * 0.7),
      category: newGiftCategory,
      icon: newGiftIcon,
      animationType: 'svga',
      animationUrl: `/assets/animations/${newGiftName.toLowerCase().replace(/\s+/g, '_')}.svga`,
      soundFxUrl: 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',
      durationMs: 4000,
    };
    onAddGift(newGift);
    setShowNewGiftModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'matrix' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Gift Matrix CMS ({gifts.length})
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'withdrawals' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Withdrawal Approvals ({withdrawals.filter(w => w.status === 'pending').length} Pending)
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'ledger' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Real-Time Financial Ledger
          </button>
        </div>

        {activeTab === 'matrix' && (
          <button
            onClick={() => setShowNewGiftModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Gift</span>
          </button>
        )}
      </div>

      {/* Tab 1: Gift Matrix CMS */}
      {activeTab === 'matrix' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gifts.map((gift) => (
              <div
                key={gift.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                      {gift.icon}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-slate-800 text-slate-300 rounded">
                      {gift.category}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-sm font-bold text-white">{gift.name}</h4>
                    <p className="text-xs text-amber-400/90 font-medium">
                      {gift.subtitle || `${gift.category.toUpperCase()} TIER`}
                    </p>
                  </div>

                  <div className="mt-3 space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-amber-400">
                      <span className="text-slate-400">Coin Price:</span>
                      <span className="font-bold">{gift.coinPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-cyan-400">
                      <span className="text-slate-400">Diamond Value:</span>
                      <span>{gift.diamondValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Animation:</span>
                      <span className="uppercase text-slate-300">{gift.animationType}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleTestGift(gift)}
                    className="flex-1 py-1.5 px-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Test Animation</span>
                  </button>

                  <button
                    onClick={() => onDeleteGift(gift.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition"
                    title="Delete Gift"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {testPlayingGift && (
            <div className="fixed bottom-6 right-6 bg-slate-950 border border-amber-500/50 p-4 rounded-xl shadow-2xl z-50 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
              <div>
                <p className="text-xs font-bold text-white">Triggering SVGA / Lottie Stream</p>
                <p className="text-[11px] text-amber-400">{testPlayingGift} animation packet sent to room</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Withdrawal Review Pipeline */}
      {activeTab === 'withdrawals' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Diamond-to-Cash Withdrawal Queue</h3>
            <span className="text-xs text-slate-400">100,000 Diamonds = $500.00 USD</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Host / Applicant</th>
                  <th className="py-3 px-4">Diamonds Requested</th>
                  <th className="py-3 px-4">Cash Value</th>
                  <th className="py-3 px-4">Payout Method & Details</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {withdrawals.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.userAvatar}
                          alt={req.userName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-white">{req.userName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">Ref: {req.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                      {req.diamondAmount.toLocaleString()} 💎
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      ${req.cashEquivalentUsd.toFixed(2)} USD
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                      <span className="font-bold text-slate-200">{req.method}: </span>
                      <span className="text-slate-400">{req.accountDetails}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          req.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : req.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {req.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onReviewWithdrawal(req.id, true)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => onReviewWithdrawal(req.id, false)}
                            className="px-2.5 py-1 bg-rose-600/40 hover:bg-rose-600 text-rose-200 rounded text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Real-Time Financial Ledger */}
      {activeTab === 'ledger' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Double-Entry Virtual Economy Ledger</h3>
            <span className="text-xs text-slate-400">Platform Split: 70% Host Diamonds / 30% System Coins</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">TX Ref</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Gift Sent</th>
                  <th className="py-3 px-4">Coins Deducted</th>
                  <th className="py-3 px-4">Diamonds Credited</th>
                  <th className="py-3 px-4">Platform Fee (30%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 text-slate-400">{tx.id}</td>
                    <td className="py-3 px-4 text-slate-400">{tx.timestamp}</td>
                    <td className="py-3 px-4 font-sans text-white font-medium">{tx.senderName}</td>
                    <td className="py-3 px-4 font-sans text-amber-300 font-medium">{tx.receiverName}</td>
                    <td className="py-3 px-4 font-sans">
                      <span className="inline-flex items-center gap-1.5">
                        <span>{tx.giftIcon}</span>
                        <span>{tx.giftName} (x{tx.combo})</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-rose-400 font-bold">-{tx.totalCoins.toLocaleString()}</td>
                    <td className="py-3 px-4 text-cyan-400 font-bold">+{tx.totalDiamonds.toLocaleString()}</td>
                    <td className="py-3 px-4 text-emerald-400">+{tx.platformShareCoins.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Creating New Gift */}
      {showNewGiftModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create New Gift Asset</h3>
              <button
                onClick={() => setShowNewGiftModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGift} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Gift Name (English)</label>
                <input
                  type="text"
                  value={newGiftName}
                  onChange={(e) => setNewGiftName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Gift Name (Arabic)</label>
                <input
                  type="text"
                  value={newGiftArabic}
                  onChange={(e) => setNewGiftArabic(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white text-right"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Coin Price</label>
                  <input
                    type="number"
                    value={newGiftPrice}
                    onChange={(e) => setNewGiftPrice(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Emoji / Icon</label>
                  <input
                    type="text"
                    value={newGiftIcon}
                    onChange={(e) => setNewGiftIcon(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white text-center"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={newGiftCategory}
                  onChange={(e) => setNewGiftCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                >
                  <option value="popular">Popular</option>
                  <option value="luxury">Luxury</option>
                  <option value="romantic">Romantic</option>
                  <option value="special">Special</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewGiftModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                >
                  Save Gift to Matrix
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
