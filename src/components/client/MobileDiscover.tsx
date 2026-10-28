import React, { useState } from 'react';
import { VoiceRoom } from '../../types';
import { 
  Search, 
  Trophy, 
  Heart, 
  Users, 
  Flame, 
  Gamepad2, 
  Music, 
  Plus, 
  Volume2, 
  X, 
  Sparkles,
  Radio,
  Crown
} from 'lucide-react';

interface MobileDiscoverProps {
  rooms: VoiceRoom[];
  userCoins: number;
  activeRoom: VoiceRoom | null;
  isRoomMinimized: boolean;
  onSelectRoom: (room: VoiceRoom) => void;
  onRestoreRoom: () => void;
  onCloseMinimizedRoom: () => void;
  onOpenDailyReward: () => void;
  onOpenInviteFriends: () => void;
  onOpenProfile: () => void;
  onCreateRoom?: (title: string, category: string) => void;
}

export const MobileDiscover: React.FC<MobileDiscoverProps> = ({
  rooms,
  userCoins,
  activeRoom,
  isRoomMinimized,
  onSelectRoom,
  onRestoreRoom,
  onCloseMinimizedRoom,
  onOpenDailyReward,
  onOpenInviteFriends,
  onOpenProfile,
  onCreateRoom
}) => {
  const [filterTag, setFilterTag] = useState<'popular' | 'game' | 'music'>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomCategory, setNewRoomCategory] = useState('Relax & Chat');

  // Filtered rooms
  const filteredRooms = rooms.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.hostName.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterTag === 'game') return matchesSearch && (r.title.toLowerCase().includes('game') || r.title.toLowerCase().includes('arena'));
    if (filterTag === 'music') return matchesSearch && (r.title.toLowerCase().includes('music') || r.title.toLowerCase().includes('oud') || r.title.toLowerCase().includes('melody'));
    return matchesSearch;
  });

  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) return;
    onCreateRoom?.(newRoomTitle.trim(), newRoomCategory);
    setShowCreateModal(false);
    setNewRoomTitle('');
  };

  return (
    <div dir="ltr" className="relative w-full h-full bg-gradient-to-b from-[#0e1628] via-[#090d18] to-[#060810] text-slate-100 flex flex-col justify-between select-none font-sans overflow-hidden">
      
      {/* 1. Top Header Bar */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between shrink-0 bg-[#0c101d]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-fuchsia-500 p-0.5 flex items-center justify-center">
            <Radio className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-black tracking-wider text-white">MIZO LIVE</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Daily Reward / Coins pill */}
          <button
            onClick={onOpenDailyReward}
            className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono text-amber-300 hover:bg-amber-500/25 transition cursor-pointer"
            title="Daily Reward"
          >
            <span>🪙 {userCoins.toLocaleString()}</span>
          </button>

          {/* Create Room Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black shadow-md shadow-cyan-500/20 transition cursor-pointer"
            title="Create Voice Room"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* 2. Search & Category Filters */}
      <div className="px-4 py-2 shrink-0 space-y-2 bg-[#0c101d]">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search voice rooms or hosts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Filters: Popular / Game / Video-Music */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterTag('popular')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
              filterTag === 'popular'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => setFilterTag('game')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              filterTag === 'game'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Gamepad2 className="w-3 h-3" />
            <span>Game</span>
          </button>
          <button
            onClick={() => setFilterTag('music')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              filterTag === 'music'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Music className="w-3 h-3" />
            <span>Video-Music</span>
          </button>
        </div>
      </div>

      {/* 3. Three Banner Cards: Ranking / Family / CP-Friend */}
      <div className="px-4 py-2 shrink-0 grid grid-cols-3 gap-2">
        <div 
          onClick={onOpenDailyReward}
          className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400 transition"
        >
          <Trophy className="w-4 h-4 text-amber-400 mb-1" />
          <span className="text-[10px] font-bold text-white leading-tight">Ranking</span>
          <span className="text-[8px] text-amber-300">Top Stars</span>
        </div>

        <div 
          onClick={onOpenInviteFriends}
          className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-500/30 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-400 transition"
        >
          <Users className="w-4 h-4 text-purple-400 mb-1" />
          <span className="text-[10px] font-bold text-white leading-tight">Family</span>
          <span className="text-[8px] text-purple-300">Clans & VIP</span>
        </div>

        <div 
          onClick={onOpenInviteFriends}
          className="p-2 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/10 border border-pink-500/30 flex flex-col items-center justify-center text-center cursor-pointer hover:border-pink-400 transition"
        >
          <Heart className="w-4 h-4 text-pink-400 mb-1" />
          <span className="text-[10px] font-bold text-white leading-tight">CP / Friend</span>
          <span className="text-[8px] text-pink-300">Couples</span>
        </div>
      </div>

      {/* 4. Live Voice Rooms Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-bold text-white uppercase text-[11px] tracking-wider">Live Voice Stages</span>
          <span className="font-mono text-[10px]">{filteredRooms.length} Active</span>
        </div>

        {filteredRooms.map((room) => (
          <div
            key={room.roomId}
            onClick={() => onSelectRoom(room)}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={room.hostAvatar}
                  alt={room.hostName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                />
                <span className="absolute -top-1 -right-1 px-1 rounded bg-rose-600 text-[8px] font-black text-white uppercase animate-pulse">
                  LIVE
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition line-clamp-1">
                  {room.title}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Host: {room.hostName}</p>
                
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-medium">
                    12-Seats
                  </span>
                  <span className="text-[9px] text-amber-400 font-mono">
                    💎 {(room.crystalBallCoins || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold font-mono text-cyan-400">
                {room.listenerCount || 128}
              </span>
              <p className="text-[9px] text-slate-400">Listening</p>
            </div>
          </div>
        ))}
      </div>

      {/* Minimized Room Floating Dock (if room is minimized) */}
      {isRoomMinimized && activeRoom && (
        <div 
          onClick={onRestoreRoom}
          className="mx-4 mb-2 p-2.5 rounded-2xl bg-gradient-to-r from-teal-900/90 to-slate-900/90 border border-teal-500/50 shadow-xl flex items-center justify-between cursor-pointer animate-in slide-in-from-bottom-2 shrink-0"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
              <Volume2 className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate max-w-[170px]">{activeRoom.title}</p>
              <p className="text-[10px] text-teal-300 font-mono">Tap to expand room</p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onCloseMinimizedRoom();
            }}
            className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MODAL: Create Room */}
      {showCreateModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Create Voice Room
              </h4>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoomSubmit} className="mt-3 space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Room Title</label>
                <input
                  type="text"
                  placeholder="e.g. Arab Karaoke Night & Talk"
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category</label>
                <select
                  value={newRoomCategory}
                  onChange={(e) => setNewRoomCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                >
                  <option value="Relax & Chat">Relax & Chat</option>
                  <option value="Live Music & Oud">Live Music & Oud</option>
                  <option value="Gaming & Esports">Gaming & Esports</option>
                  <option value="Poetry & Tarab">Poetry & Tarab</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-md shadow-cyan-500/20"
                >
                  Go Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
