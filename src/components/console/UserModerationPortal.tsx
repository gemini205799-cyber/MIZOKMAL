import React, { useState } from 'react';
import { UserAccount } from '../../types';
import { 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  MicOff, 
  Ban, 
  Smartphone, 
  Globe, 
  Coins, 
  Gem, 
  CheckCircle2, 
  XCircle,
  Eye,
  Edit3
} from 'lucide-react';

interface UserModerationPortalProps {
  users: UserAccount[];
  onUpdateUserStatus: (userId: string, newStatus: UserAccount['status']) => void;
  onAdjustUserWallet: (userId: string, deltaCoins: number, deltaDiamonds: number) => void;
  onToggleKycVerification: (userId: string) => void;
}

export const UserModerationPortal: React.FC<UserModerationPortalProps> = ({
  users,
  onUpdateUserStatus,
  onAdjustUserWallet,
  onToggleKycVerification,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(users[0] || null);
  const [coinAdjustment, setCoinAdjustment] = useState<number>(5000);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('Host Compensation / Event Bonus');

  const filteredUsers = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayId.includes(searchQuery) ||
      u.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.ipAddress.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Search & Statistics Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by User ID, Name, Device ID, or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div>Total Users: <span className="text-white font-bold">{users.length}</span></div>
          <div>Banned: <span className="text-rose-400 font-bold">{users.filter(u => u.status.includes('ban')).length}</span></div>
          <div>KYC Verified: <span className="text-emerald-400 font-bold">{users.filter(u => u.isKycVerified).length}</span></div>
        </div>
      </div>

      {/* Main Split: User Accounts Table & Deep Profile Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: User Table */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">User Directory & Fingerprints</h3>
            <span className="text-xs text-slate-400">Showing {filteredUsers.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">User / Display ID</th>
                  <th className="py-3 px-4">Role & Level</th>
                  <th className="py-3 px-4">Wallet Balance</th>
                  <th className="py-3 px-4">Hardware Fingerprint</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((user) => {
                  const isSelected = selectedUser?.id === user.id;

                  return (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition ${
                        isSelected ? 'bg-slate-800/60 font-medium' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.displayName}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700"
                          />
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{user.displayName}</span>
                              {user.isKycVerified && (
                                <span title="KYC Verified Host">
                                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              ID: {user.displayId} · @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="capitalize text-slate-200">{user.role}</span>
                          <span className="text-[11px] text-amber-400 font-mono">
                            Lv.{user.level} {user.svipTier > 0 ? `· SVIP ${user.svipTier}` : ''}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <div className="flex flex-col text-[11px]">
                          <span className="text-amber-400 font-bold">{user.coins.toLocaleString()} Coins</span>
                          <span className="text-cyan-400">{user.diamonds.toLocaleString()} Diamonds</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-slate-500" />
                          <span className="truncate max-w-[110px]">{user.deviceId}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Globe className="w-2.5 h-2.5" />
                          <span>{user.ipAddress}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                            user.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : user.status === 'voice_muted'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {user.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser(user);
                          }}
                          className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected User Deep Profile & Disciplinary Actions */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          {selectedUser ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.displayName}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500"
                  />
                  <div>
                    <h4 className="text-base font-bold text-white">{selectedUser.displayName}</h4>
                    <p className="text-xs text-slate-400 font-mono">ID: {selectedUser.displayId}</p>
                    <p className="text-xs text-slate-400">{selectedUser.country}</p>
                  </div>
                </div>

                <button
                  onClick={() => onToggleKycVerification(selectedUser.id)}
                  className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition ${
                    selectedUser.isKycVerified
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                  title="Toggle KYC verification"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{selectedUser.isKycVerified ? 'Verified' : 'Verify KYC'}</span>
                </button>
              </div>

              {/* Hardware & Network Forensics */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Forensic Fingerprints
                </span>
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Device ID:</span>
                    <span className="text-slate-300 truncate max-w-[180px]">{selectedUser.deviceId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Seen IP:</span>
                    <span className="text-slate-300">{selectedUser.ipAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Member Since:</span>
                    <span className="text-slate-300">{selectedUser.createdAt}</span>
                  </div>
                  {selectedUser.agencyCode && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Agency Affiliation:</span>
                      <span className="text-amber-400">{selectedUser.agencyCode}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Disciplinary Actions Engine */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Disciplinary Enforcement
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      onUpdateUserStatus(
                        selectedUser.id,
                        selectedUser.status === 'voice_muted' ? 'active' : 'voice_muted'
                      )
                    }
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                      selectedUser.status === 'voice_muted'
                        ? 'bg-amber-600 text-white border-amber-500'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-900/40'
                    }`}
                  >
                    <MicOff className="w-3.5 h-3.5" />
                    <span>{selectedUser.status === 'voice_muted' ? 'Unmute Mic' : 'Mute Voice'}</span>
                  </button>

                  <button
                    onClick={() =>
                      onUpdateUserStatus(
                        selectedUser.id,
                        selectedUser.status === 'global_banned' ? 'active' : 'global_banned'
                      )
                    }
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                      selectedUser.status === 'global_banned'
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-800 hover:bg-slate-700 text-rose-300 border-rose-900/40'
                    }`}
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>{selectedUser.status === 'global_banned' ? 'Unban User' : 'Global Ban'}</span>
                  </button>
                </div>
              </div>

              {/* Wallet Adjustment Panel */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Virtual Ledger & Wallet Tool
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">COIN BALANCE</span>
                    <span className="text-amber-400 font-bold text-sm">
                      {selectedUser.coins.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">DIAMONDS BALANCE</span>
                    <span className="text-cyan-400 font-bold text-sm">
                      {selectedUser.diamonds.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] text-slate-400">Add Coins (or negative to deduct):</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={coinAdjustment}
                      onChange={(e) => setCoinAdjustment(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white font-mono"
                    />
                    <button
                      onClick={() => onAdjustUserWallet(selectedUser.id, coinAdjustment, 0)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded transition"
                    >
                      Credit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400">
              <p>Select a user to inspect profile and actions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
