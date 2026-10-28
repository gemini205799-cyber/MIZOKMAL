import React, { useState } from 'react';
import { 
  Home, 
  MessageSquare, 
  User, 
  LogOut, 
  Sparkles, 
  Share2, 
  Settings, 
  X, 
  Check, 
  Volume2, 
  Minimize2,
  Coins
} from 'lucide-react';
import { VoiceRoom, GiftItem } from '../../types';
import { MobileDiscover } from './MobileDiscover';
import { MobileMessages } from './MobileMessages';
import { MobileProfile } from './MobileProfile';
import { MobileVoiceRoom } from './MobileVoiceRoom';

interface MobileClientShellProps {
  rooms: VoiceRoom[];
  gifts: GiftItem[];
  userCoins: number;
  onSendGift: (gift: GiftItem, combo: number) => void;
  onSeatAction: (seatIndex: number, action: 'take' | 'lock' | 'lock_all' | 'mute' | 'leave') => void;
  onAddCoins?: (amount: number) => void;
  onCreateRoom?: (title: string, category: string) => void;
}

export type MobileTab = 'home' | 'message' | 'me';

export const MobileClientShell: React.FC<MobileClientShellProps> = ({
  rooms,
  gifts,
  userCoins,
  onSendGift,
  onSeatAction,
  onAddCoins,
  onCreateRoom
}) => {
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [activeRoom, setActiveRoom] = useState<VoiceRoom | null>(null);
  const [isRoomMinimized, setIsRoomMinimized] = useState<boolean>(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(3);

  // In-Room Features (Settings, Share, Follow)
  const [isFollowingHost, setIsFollowingHost] = useState(false);
  const [showRoomSettings, setShowRoomSettings] = useState(false);
  const [roomAnnouncements, setRoomAnnouncements] = useState('Welcome to the VIP voice party room! Keep it respectful and enjoy the music.');
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const handleSelectRoom = (room: VoiceRoom) => {
    setActiveRoom(room);
    setIsRoomMinimized(false);
  };

  const handleLeaveRoom = () => {
    setActiveRoom(null);
    setIsRoomMinimized(false);
  };

  const handleShareRoom = () => {
    if (activeRoom) {
      const shareUrl = `https://mizo.live/room/${activeRoom.roomId}`;
      navigator.clipboard?.writeText(shareUrl);
      setShareFeedback('Room link copied to clipboard!');
      setTimeout(() => setShareFeedback(null), 3000);
    }
  };

  return (
    <div dir="ltr" className="relative w-full max-w-[390px] h-[720px] mx-auto bg-[#07090e] rounded-[36px] overflow-hidden shadow-2xl border-4 border-slate-800 flex flex-col justify-between select-none font-sans">
      
      {/* Toast Alert Feedback */}
      {shareFeedback && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 px-3.5 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold shadow-2xl flex items-center gap-1.5 animate-in slide-in-from-top-2">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>{shareFeedback}</span>
        </div>
      )}

      {/* Main Screen Body */}
      <div className="flex-1 overflow-hidden relative">
        {/* Scenario 1: Active Room Open (Full Screen Inside Frame) */}
        {activeRoom && !isRoomMinimized ? (
          <div className="relative w-full h-full flex flex-col">
            {/* Top Room Quick Action Strip */}
            <div className="absolute top-2 right-2 z-40 flex items-center gap-1.5">
              {/* Share button */}
              <button
                onClick={handleShareRoom}
                className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition"
                title="Share Room"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

              {/* Room Settings */}
              <button
                onClick={() => setShowRoomSettings(true)}
                className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition"
                title="Room Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              {/* Red Leave Room Button (Requested by User) */}
              <button
                onClick={handleLeaveRoom}
                className="px-2.5 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold shadow-lg shadow-rose-600/40 flex items-center gap-1 transition"
                title="Leave Voice Room"
              >
                <LogOut className="w-3 h-3" />
                <span>Leave</span>
              </button>
            </div>

            {/* In-Room Voice Experience */}
            <div className="flex-1 overflow-hidden">
              <MobileVoiceRoom
                room={activeRoom}
                userCoins={userCoins}
                gifts={gifts}
                onMinimize={() => setIsRoomMinimized(true)}
                onSendGift={onSendGift}
                onSeatAction={onSeatAction}
              />
            </div>
          </div>
        ) : (
          /* Scenario 2: Main Tab Navigation (Home / Message / Me) */
          <div className="w-full h-full flex flex-col overflow-hidden">
            {activeTab === 'home' && (
              <MobileDiscover
                rooms={rooms}
                userCoins={userCoins}
                activeRoom={activeRoom}
                isRoomMinimized={isRoomMinimized}
                onSelectRoom={handleSelectRoom}
                onRestoreRoom={() => setIsRoomMinimized(false)}
                onCloseMinimizedRoom={handleLeaveRoom}
                onOpenDailyReward={() => onAddCoins?.(1000)}
                onOpenInviteFriends={() => onAddCoins?.(5000)}
                onOpenProfile={() => setActiveTab('me')}
                onCreateRoom={onCreateRoom}
              />
            )}

            {activeTab === 'message' && (
              <MobileMessages />
            )}

            {activeTab === 'me' && (
              <MobileProfile
                onBack={() => setActiveTab('home')}
                userCoins={userCoins}
                onOpenInvite={() => onAddCoins?.(5000)}
                onAddCoins={onAddCoins}
              />
            )}
          </div>
        )}
      </div>

      {/* Persistent Bottom Navigation Bar (Home / Message / Me) */}
      <nav className="h-14 border-t border-slate-800 bg-[#0a0e18] px-6 flex items-center justify-around shrink-0 z-30">
        {/* Tab 1: Home */}
        <button
          onClick={() => {
            setActiveTab('home');
            if (activeRoom && !isRoomMinimized) setIsRoomMinimized(true);
          }}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${
            activeTab === 'home' && (!activeRoom || isRoomMinimized) ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] tracking-wide">Home</span>
        </button>

        {/* Tab 2: Message (with unread counter) */}
        <button
          onClick={() => {
            setActiveTab('message');
            setUnreadMessagesCount(0);
            if (activeRoom && !isRoomMinimized) setIsRoomMinimized(true);
          }}
          className={`flex flex-col items-center gap-1 transition relative cursor-pointer ${
            activeTab === 'message' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-wide">Message</span>
        </button>

        {/* Tab 3: Me (Profile) */}
        <button
          onClick={() => {
            setActiveTab('me');
            if (activeRoom && !isRoomMinimized) setIsRoomMinimized(true);
          }}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${
            activeTab === 'me' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[10px] tracking-wide">Me</span>
        </button>
      </nav>

      {/* MODAL: Room Settings */}
      {showRoomSettings && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-cyan-400" />
                Room Settings
              </h4>
              <button onClick={() => setShowRoomSettings(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Room Announcements</label>
                <textarea
                  value={roomAnnouncements}
                  onChange={(e) => setRoomAnnouncements(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white resize-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Clean Chat History</span>
                <button
                  onClick={() => {
                    alert('Room chat messages cleared.');
                    setShowRoomSettings(false);
                  }}
                  className="px-3 py-1 rounded-lg bg-rose-600/30 text-rose-300 border border-rose-500/40 text-[11px] font-semibold"
                >
                  Clear Chat
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Follow Room Host</span>
                <button
                  onClick={() => setIsFollowingHost(!isFollowingHost)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition ${
                    isFollowingHost
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-cyan-500 text-black font-bold'
                  }`}
                >
                  {isFollowingHost ? 'Following ✓' : '+ Follow Host'}
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowRoomSettings(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
