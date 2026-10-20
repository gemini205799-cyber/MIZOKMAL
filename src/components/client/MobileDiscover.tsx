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
  MessageSquare, 
  User, 
  Home, 
  Volume2, 
  X, 
  Maximize2 
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
}) => {
  const [activeTab, setActiveTab] = useState<'popular' | 'mine'>('popular');
  const [filterTag, setFilterTag] = useState<'popular' | 'game' | 'music'>('popular');

  return (
    <div className="relative w-full h-[680px] max-w-[390px] mx-auto bg-gradient-to-b from-[#e8faf6] via-[#f7fdfc] to-white rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 flex flex-col justify-between select-none">
      {/* 1. Top Bar */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between text-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('mine')}
            className={`text-sm font-bold transition ${
              activeTab === 'mine' ? 'text-teal-700' : 'text-slate-400'
            }`}
          >
            Mine
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`text-base font-extrabold relative transition ${
              activeTab === 'popular' ? 'text-teal-900' : 'text-slate-400'
            }`}
          >
            Popular
            {activeTab === 'popular' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-teal-500 rounded-full" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-600" />
          <div
            onClick={onOpenInviteFriends}
            className="flex items-center gap-1 bg-amber-100/80 border border-amber-300 px-2 py-0.5 rounded-full text-[11px] font-bold font-mono text-amber-800 cursor-pointer shadow-xs hover:scale-105 transition"
            title="Coins Balance & Invite"
          >
            <span>🪙</span>
            <span>{userCoins.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 space-y-3">
        {/* Promotional Carousel Banner (Friend World Tour) matching screenshot */}
        <div className="relative h-28 rounded-2xl overflow-hidden shadow-md group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80"
            alt="Friend World Tour"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/70 via-black/30 to-transparent flex flex-col justify-center px-4 text-white">
            <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">Featured Event</span>
            <h4 className="text-lg font-black leading-tight drop-shadow">Friend World Tour ✈️</h4>
            <p className="text-[10px] text-teal-100 mt-0.5">Connect with international voice hosts</p>
          </div>
        </div>

        {/* 3 Featured Tiles: Ranking, Family, CP/Friend matching screenshot */}
        <div className="grid grid-cols-3 gap-2">
          {/* Ranking Tile */}
          <div className="p-2.5 rounded-xl bg-gradient-to-b from-teal-400 to-teal-600 text-white shadow-xs cursor-pointer hover:opacity-95 transition flex flex-col justify-between h-20">
            <span className="text-xs font-bold">Ranking</span>
            <div className="flex items-center justify-center gap-0.5">
              <span className="text-xs">🥈</span>
              <span className="text-sm font-bold">🥇</span>
              <span className="text-xs">🥉</span>
            </div>
          </div>

          {/* Family Tile */}
          <div className="p-2.5 rounded-xl bg-gradient-to-b from-amber-400 to-orange-500 text-white shadow-xs cursor-pointer hover:opacity-95 transition flex flex-col justify-between h-20">
            <span className="text-xs font-bold">Family</span>
            <div className="flex items-center justify-center -space-x-1">
              <span className="text-xs">👨‍👩‍👧</span>
            </div>
          </div>

          {/* CP / Friend Tile */}
          <div className="p-2.5 rounded-xl bg-gradient-to-b from-pink-400 to-rose-500 text-white shadow-xs cursor-pointer hover:opacity-95 transition flex flex-col justify-between h-20">
            <span className="text-xs font-bold">CP / Friend</span>
            <div className="flex items-center justify-center">
              <span className="text-xs">❤️🤝</span>
            </div>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setFilterTag('popular')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
              filterTag === 'popular'
                ? 'bg-amber-400 text-slate-900 shadow-xs'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            <span>Popular</span>
          </button>
          <button
            onClick={() => setFilterTag('game')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
              filterTag === 'game'
                ? 'bg-amber-400 text-slate-900 shadow-xs'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Game</span>
          </button>
          <button
            onClick={() => setFilterTag('music')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
              filterTag === 'music'
                ? 'bg-amber-400 text-slate-900 shadow-xs'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-purple-600" />
            <span>Video/Music</span>
          </button>
        </div>

        {/* 2x2 Voice Rooms Grid (Matching Screenshot) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {rooms.map((room) => (
            <div
              key={room.roomId}
              onClick={() => onSelectRoom(room)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              {/* Host Picture with Crest */}
              <div className="relative h-36">
                <img
                  src={room.hostAvatar}
                  alt={room.hostName}
                  className="w-full h-full object-cover"
                />
                {/* Level Crest Badge from screenshot */}
                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-blue-600/90 text-white rounded-md text-[10px] font-bold shadow">
                  Lv.26
                </div>

                {/* Country Flag & Listener Count */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-full text-white text-[10px]">
                  <span>{room.countryFlag}</span>
                  <span className="font-mono">👤 {room.listenerCount}</span>
                </div>
              </div>

              {/* Room Info */}
              <div className="p-2.5">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {room.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                  <span className="truncate">{room.hostName}</span>
                  <span className="text-emerald-600 font-mono text-[10px]">LIVE</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Daily Rewards Icon on Right */}
      <div
        onClick={onOpenDailyReward}
        className="absolute bottom-16 right-4 w-12 h-12 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-2xl shadow-xl flex items-center justify-center text-xl cursor-pointer hover:scale-110 transition border-2 border-white z-20"
        title="Claim Daily Rewards"
      >
        🎁
      </div>

      {/* 3. Floating Mini-Player Bar (When Room is Minimized in Background) */}
      {isRoomMinimized && activeRoom && (
        <div className="absolute bottom-14 left-3 right-3 bg-slate-900/95 backdrop-blur-md border border-teal-500/50 p-2.5 rounded-2xl shadow-2xl flex items-center justify-between z-20 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={activeRoom.hostAvatar}
              alt={activeRoom.hostName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-400"
            />
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate max-w-[150px]">
                {activeRoom.title}
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <Volume2 className="w-3 h-3 animate-pulse" />
                <span>LiveKit SFU Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onRestoreRoom}
              className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
              title="Return to Voice Room"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onCloseMinimizedRoom}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              title="Leave Room"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Bottom Tab Bar matching screenshot */}
      <div className="relative z-10 px-6 py-2 bg-white border-t border-slate-200/80 flex items-center justify-between text-slate-500">
        <button className="flex flex-col items-center gap-0.5 text-teal-600">
          <div className="w-7 h-7 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-600">
            <Home className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button 
          onClick={onOpenInviteFriends}
          className="flex flex-col items-center gap-0.5 hover:text-slate-900 transition relative"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-red-500 text-white rounded-full text-[9px] font-bold font-mono">
              34
            </span>
          </div>
          <span className="text-[10px] font-medium">Message</span>
        </button>

        <button 
          onClick={onOpenProfile}
          className="flex flex-col items-center gap-0.5 hover:text-slate-900 transition"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Me</span>
        </button>
      </div>
    </div>
  );
};
