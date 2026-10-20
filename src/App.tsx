import React, { useState } from 'react';
import { 
  INITIAL_ROOMS, 
  INITIAL_USERS, 
  INITIAL_GIFTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_WITHDRAWALS, 
  INITIAL_AGENCIES 
} from './mock/initialData';
import { VoiceRoom, UserAccount, GiftItem, TransactionRecord, WithdrawalRequest, AgencyData } from './types';
import { LiveOperationsCenter } from './components/console/LiveOperationsCenter';
import { UserModerationPortal } from './components/console/UserModerationPortal';
import { GiftManagementCMS } from './components/console/GiftManagementCMS';
import { GiftCmsEconomy } from './components/console/GiftCmsEconomy';
import { AgencyPortal } from './components/console/AgencyPortal';
import { LiveKitTelemetry } from './components/console/LiveKitTelemetry';
import { MobileVoiceRoom } from './components/client/MobileVoiceRoom';
import { MobileDiscover } from './components/client/MobileDiscover';
import { MobileProfile } from './components/client/MobileProfile';
import { DailyRewardModal } from './components/client/DailyRewardModal';
import { InviteFriendsModal } from './components/client/InviteFriendsModal';
import { TRANSLATIONS, Language } from './i18n/translations';
import { SeatsTemplateConfig } from './components/console/SeatsTemplateConfig';
import { CodeExplorer } from './components/monorepo/CodeExplorer';
import { 
  Radio, 
  ShieldCheck, 
  Gift, 
  Building2, 
  Server, 
  Smartphone, 
  Columns, 
  Code2,
  SlidersHorizontal,
  Flame,
  Globe,
  Crown
} from 'lucide-react';

export default function App() {
  // Global Ecosystem State
  const [rooms, setRooms] = useState<VoiceRoom[]>(INITIAL_ROOMS);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [gifts, setGifts] = useState<GiftItem[]>(INITIAL_GIFTS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS);
  const [agencies] = useState<AgencyData[]>(INITIAL_AGENCIES);

  // Client Simulation State
  const [userCoins, setUserCoins] = useState<number>(148000);
  const [activeClientScreen, setActiveClientScreen] = useState<'room' | 'discover' | 'profile'>('room');
  const [isRoomMinimized, setIsRoomMinimized] = useState<boolean>(false);
  const [showDailyReward, setShowDailyReward] = useState<boolean>(false);
  const [showInviteFriends, setShowInviteFriends] = useState<boolean>(false);
  const [selectedMobileRoom, setSelectedMobileRoom] = useState<VoiceRoom>(rooms[0]);

  // Tri-Lingual i18n & RTL State
  const [language, setLanguage] = useState<Language>('en');
  const t = TRANSLATIONS[language];

  // Platform-wide Boss Mic Configuration (Admin Control)
  const [bossMicEnabled, setBossMicEnabled] = useState<boolean>(true);
  const [bossMicBasePrice, setBossMicBasePrice] = useState<number>(50000);

  // Master Ecosystem Navigation Mode
  const [viewMode, setViewMode] = useState<'console' | 'client' | 'dual' | 'code'>('dual');
  const [consoleTab, setConsoleTab] = useState<'ops' | 'seatsConfig' | 'users' | 'economy' | 'agency' | 'telemetry'>('ops');

  // Console Action Handlers
  const handleTerminateRoom = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.roomId === roomId
          ? {
              ...r,
              isTerminated: true,
              seats: r.seats.map((s) => ({ ...s, status: 'empty', participant: null })),
            }
          : r
      )
    );
  };

  const handleToggleSeatMute = (roomId: string, seatIndex: number) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomId !== roomId) return r;
        const newSeats = [...r.seats];
        const target = newSeats.find((s) => s.index === seatIndex);
        if (target && target.participant) {
          target.isMutedByHost = !target.isMutedByHost;
          target.participant.isMuted = target.isMutedByHost;
        }
        return { ...r, seats: newSeats };
      })
    );
  };

  const handleKickParticipant = (roomId: string, seatIndex: number) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomId !== roomId) return r;
        const newSeats = [...r.seats];
        const target = newSeats.find((s) => s.index === seatIndex);
        if (target) {
          target.status = target.isLocked ? 'locked' : 'empty';
          target.participant = null;
        }
        return { ...r, seats: newSeats };
      })
    );
  };

  const handleToggleSeatLock = (roomId: string, seatIndex: number) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomId !== roomId) return r;
        const newSeats = [...r.seats];
        const target = newSeats.find((s) => s.index === seatIndex);
        if (target) {
          target.isLocked = !target.isLocked;
          if (target.isLocked && target.status === 'empty') target.status = 'locked';
          if (!target.isLocked && target.status === 'locked') target.status = 'empty';
        }
        return { ...r, seats: newSeats };
      })
    );
  };

  // Client Gift Action Handler (Cross-reflects in Console)
  const handleSendGift = (gift: GiftItem, combo: number, luckyWinCoins?: number) => {
    const totalCost = gift.coinPrice * combo;
    const totalDiamonds = gift.diamondValue * combo;
    const netCoinCost = totalCost - (luckyWinCoins || 0);

    setUserCoins((prev) => Math.max(0, prev - netCoinCost));

    // Append to live transaction ledger in real-time
    const newTx: TransactionRecord = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: 'Just now',
      senderName: 'Eyad Trader (Me)',
      receiverName: selectedMobileRoom.hostName,
      giftName: gift.name,
      giftIcon: gift.icon,
      combo,
      totalCoins: totalCost,
      totalDiamonds: totalDiamonds,
      platformShareCoins: Math.round(totalCost * 0.3),
      roomId: selectedMobileRoom.roomId,
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Client Seat Action Handler
  const handleClientSeatAction = (
    seatIndex: number,
    action: 'take' | 'lock' | 'lock_all' | 'mute' | 'leave'
  ) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomId !== selectedMobileRoom.roomId) return r;
        const newSeats = [...r.seats];
        const target = newSeats.find((s) => s.index === seatIndex);

        if (!target) return r;

        if (action === 'take') {
          target.status = 'occupied';
          target.participant = {
            userId: 'usr_me',
            name: 'Me (Kit Kat)',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            role: 'speaker',
            level: 77,
            isMuted: false,
            isSpeaking: true,
            audioLevel: 0.9,
          };
        } else if (action === 'lock') {
          target.isLocked = !target.isLocked;
          target.status = target.isLocked ? 'locked' : 'empty';
        } else if (action === 'lock_all') {
          newSeats.forEach((s) => {
            s.isLocked = true;
            if (s.status === 'empty') s.status = 'locked';
          });
        } else if (action === 'mute') {
          target.isMutedByHost = !target.isMutedByHost;
          if (target.participant) target.participant.isMuted = target.isMutedByHost;
        }

        return { ...r, seats: newSeats };
      })
    );
  };

  const currentRoomState =
    rooms.find((r) => r.roomId === selectedMobileRoom.roomId) || selectedMobileRoom;

  return (
    <div 
      dir={language === 'ar' ? 'rtl' : 'ltr'} 
      className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans"
    >
      {/* Universal Top Bar Contract: 3-Zone Architecture */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center text-white text-base font-black shadow-md shadow-pink-500/20">
              M
            </span>
            {t.appName}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded">
            {t.sfuEcosystem}
          </span>
        </div>

        {/* Zone 2: Navigation Links (View Mode Selector) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('dual')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
              viewMode === 'dual'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{t.dualView}</span>
          </button>

          <button
            onClick={() => setViewMode('console')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
              viewMode === 'console'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t.mizoConsole}</span>
          </button>

          <button
            onClick={() => setViewMode('client')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
              viewMode === 'client'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t.mizoClient}</span>
          </button>

          <button
            onClick={() => setViewMode('code')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
              viewMode === 'code'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{t.architectureCode}</span>
          </button>
        </nav>

        {/* Zone 3: Tri-lingual Switcher & Status Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Tri-Lingual i18n Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded font-mono transition ${
                language === 'en' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('bn')}
              className={`px-2 py-0.5 rounded transition ${
                language === 'bn' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-2 py-0.5 rounded transition ${
                language === 'ar' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              العربية
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.livekitOnline}</span>
          </div>

          <button
            onClick={() => setShowDailyReward(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition"
          >
            {t.dailyBonus}
          </button>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto">
        {/* VIEW 1: SIDE-BY-SIDE DUAL VIEW (Console + Mobile Client Running Together) */}
        {viewMode === 'dual' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: MIZO Console Operations */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                    {t.mizoConsole}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setConsoleTab('ops')}
                    className={`px-2 py-1 rounded-md font-medium transition ${
                      consoleTab === 'ops' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.tabRooms}
                  </button>
                  <button
                    onClick={() => setConsoleTab('seatsConfig')}
                    className={`px-2 py-1 rounded-md font-medium flex items-center gap-1 transition ${
                      consoleTab === 'seatsConfig' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Crown className="w-3 h-3" />
                    <span>{t.tabSeatsConfig}</span>
                  </button>
                  <button
                    onClick={() => setConsoleTab('users')}
                    className={`px-2 py-1 rounded-md font-medium transition ${
                      consoleTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.tabUsers}
                  </button>
                  <button
                    onClick={() => setConsoleTab('economy')}
                    className={`px-2 py-1 rounded-md font-medium transition ${
                      consoleTab === 'economy' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.tabEconomy}
                  </button>
                  <button
                    onClick={() => setConsoleTab('agency')}
                    className={`px-2 py-1 rounded-md font-medium transition ${
                      consoleTab === 'agency' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.tabAgency}
                  </button>
                  <button
                    onClick={() => setConsoleTab('telemetry')}
                    className={`px-2 py-1 rounded-md font-medium transition ${
                      consoleTab === 'telemetry' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.tabLiveKit}
                  </button>
                </div>
              </div>

              {consoleTab === 'ops' && (
                <LiveOperationsCenter
                  rooms={rooms}
                  onTerminateRoom={handleTerminateRoom}
                  onToggleSeatMute={handleToggleSeatMute}
                  onKickParticipant={handleKickParticipant}
                  onToggleSeatLock={handleToggleSeatLock}
                />
              )}

              {consoleTab === 'users' && (
                <UserModerationPortal
                  users={users}
                  onUpdateUserStatus={(userId, newStatus) =>
                    setUsers((prev) =>
                      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
                    )
                  }
                  onAdjustUserWallet={(userId, deltaCoins, deltaDiamonds) =>
                    setUsers((prev) =>
                      prev.map((u) =>
                        u.id === userId
                          ? {
                              ...u,
                              coins: Math.max(0, u.coins + deltaCoins),
                              diamonds: Math.max(0, u.diamonds + deltaDiamonds),
                            }
                          : u
                      )
                    )
                  }
                  onToggleKycVerification={(userId) =>
                    setUsers((prev) =>
                      prev.map((u) => (u.id === userId ? { ...u, isKycVerified: !u.isKycVerified } : u))
                    )
                  }
                />
              )}

              {consoleTab === 'economy' && (
                <GiftCmsEconomy
                  gifts={gifts}
                  transactions={transactions}
                  withdrawals={withdrawals}
                  onAddGift={(newGift) => setGifts((prev) => [newGift, ...prev])}
                  onDeleteGift={(giftId) => setGifts((prev) => prev.filter((g) => g.id !== giftId))}
                  onReviewWithdrawal={(id, approved) =>
                    setWithdrawals((prev) =>
                      prev.map((w) =>
                        w.id === id ? { ...w, status: approved ? 'approved' : 'rejected' } : w
                      )
                    )
                  }
                />
              )}

              {consoleTab === 'agency' && <AgencyPortal agencies={agencies} />}

              {consoleTab === 'telemetry' && <LiveKitTelemetry />}
            </div>

            {/* Right 5 Columns: MIZO Mobile Flutter Client Live Simulator */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[390px] mb-2 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-pink-400" />
                  MIZO Mobile Client (Yari Architecture)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveClientScreen('room')}
                    className={`px-2 py-0.5 rounded ${
                      activeClientScreen === 'room' ? 'bg-pink-600 text-white' : 'hover:text-white'
                    }`}
                  >
                    Room
                  </button>
                  <button
                    onClick={() => setActiveClientScreen('discover')}
                    className={`px-2 py-0.5 rounded ${
                      activeClientScreen === 'discover' ? 'bg-pink-600 text-white' : 'hover:text-white'
                    }`}
                  >
                    Discover
                  </button>
                  <button
                    onClick={() => setActiveClientScreen('profile')}
                    className={`px-2 py-0.5 rounded ${
                      activeClientScreen === 'profile' ? 'bg-pink-600 text-white' : 'hover:text-white'
                    }`}
                  >
                    Me
                  </button>
                </div>
              </div>

              {activeClientScreen === 'room' ? (
                <MobileVoiceRoom
                  room={currentRoomState}
                  userCoins={userCoins}
                  gifts={gifts}
                  onMinimize={() => {
                    setIsRoomMinimized(true);
                    setActiveClientScreen('discover');
                  }}
                  onSendGift={handleSendGift}
                  onSeatAction={handleClientSeatAction}
                />
              ) : activeClientScreen === 'discover' ? (
                <MobileDiscover
                  rooms={rooms}
                  userCoins={userCoins}
                  activeRoom={selectedMobileRoom}
                  isRoomMinimized={isRoomMinimized}
                  onSelectRoom={(r) => {
                    setSelectedMobileRoom(r);
                    setIsRoomMinimized(false);
                    setActiveClientScreen('room');
                  }}
                  onRestoreRoom={() => {
                    setIsRoomMinimized(false);
                    setActiveClientScreen('room');
                  }}
                  onCloseMinimizedRoom={() => setIsRoomMinimized(false)}
                  onOpenDailyReward={() => setShowDailyReward(true)}
                  onOpenInviteFriends={() => setShowInviteFriends(true)}
                  onOpenProfile={() => setActiveClientScreen('profile')}
                />
              ) : (
                <MobileProfile
                  onBack={() => setActiveClientScreen('discover')}
                  userCoins={userCoins}
                  onOpenInvite={() => setShowInviteFriends(true)}
                />
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: FULL CONSOLE VIEW */}
        {viewMode === 'console' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl max-w-fit">
              <button
                onClick={() => setConsoleTab('ops')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition ${
                  consoleTab === 'ops' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>Live Operations Center</span>
              </button>
              <button
                onClick={() => setConsoleTab('users')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition ${
                  consoleTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>User Identity & Trust/Safety</span>
              </button>
              <button
                onClick={() => setConsoleTab('economy')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition ${
                  consoleTab === 'economy' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Gift className="w-4 h-4 text-pink-400" />
                <span>Virtual Economy & Gift CMS</span>
              </button>
              <button
                onClick={() => setConsoleTab('agency')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition ${
                  consoleTab === 'agency' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4 text-purple-400" />
                <span>Agency & Host Portal</span>
              </button>
              <button
                onClick={() => setConsoleTab('telemetry')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition ${
                  consoleTab === 'telemetry' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Server className="w-4 h-4 text-amber-400" />
                <span>LiveKit SFU Telemetry</span>
              </button>
            </div>

            {consoleTab === 'ops' && (
              <LiveOperationsCenter
                rooms={rooms}
                onTerminateRoom={handleTerminateRoom}
                onToggleSeatMute={handleToggleSeatMute}
                onKickParticipant={handleKickParticipant}
                onToggleSeatLock={handleToggleSeatLock}
              />
            )}
            {consoleTab === 'users' && (
              <UserModerationPortal
                users={users}
                onUpdateUserStatus={(userId, newStatus) =>
                  setUsers((prev) =>
                    prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
                  )
                }
                onAdjustUserWallet={(userId, deltaCoins, deltaDiamonds) =>
                  setUsers((prev) =>
                    prev.map((u) =>
                      u.id === userId
                        ? {
                            ...u,
                            coins: Math.max(0, u.coins + deltaCoins),
                            diamonds: Math.max(0, u.diamonds + deltaDiamonds),
                          }
                        : u
                    )
                  )
                }
                onToggleKycVerification={(userId) =>
                  setUsers((prev) =>
                    prev.map((u) => (u.id === userId ? { ...u, isKycVerified: !u.isKycVerified } : u))
                  )
                }
              />
            )}
            {consoleTab === 'economy' && (
              <GiftCmsEconomy
                gifts={gifts}
                transactions={transactions}
                withdrawals={withdrawals}
                onAddGift={(newGift) => setGifts((prev) => [newGift, ...prev])}
                onDeleteGift={(giftId) => setGifts((prev) => prev.filter((g) => g.id !== giftId))}
                onReviewWithdrawal={(id, approved) =>
                  setWithdrawals((prev) =>
                    prev.map((w) =>
                      w.id === id ? { ...w, status: approved ? 'approved' : 'rejected' } : w
                    )
                  )
                }
              />
            )}
            {consoleTab === 'agency' && <AgencyPortal agencies={agencies} />}
            {consoleTab === 'telemetry' && <LiveKitTelemetry />}
          </div>
        )}

        {/* VIEW 3: FULL CLIENT VIEW */}
        {viewMode === 'client' && (
          <div className="py-6 flex flex-col items-center">
            <div className="mb-4 flex items-center gap-2">
              <button
                onClick={() => setActiveClientScreen('room')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeClientScreen === 'room' ? 'bg-pink-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                12-Seat Voice Room
              </button>
              <button
                onClick={() => setActiveClientScreen('discover')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeClientScreen === 'discover' ? 'bg-pink-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Discover & Country Rooms
              </button>
              <button
                onClick={() => setActiveClientScreen('profile')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeClientScreen === 'profile' ? 'bg-pink-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                User Profile (Me)
              </button>
            </div>

            {activeClientScreen === 'room' ? (
              <MobileVoiceRoom
                room={currentRoomState}
                userCoins={userCoins}
                gifts={gifts}
                onMinimize={() => {
                  setIsRoomMinimized(true);
                  setActiveClientScreen('discover');
                }}
                onSendGift={handleSendGift}
                onSeatAction={handleClientSeatAction}
              />
            ) : activeClientScreen === 'discover' ? (
              <MobileDiscover
                rooms={rooms}
                userCoins={userCoins}
                activeRoom={selectedMobileRoom}
                isRoomMinimized={isRoomMinimized}
                onSelectRoom={(r) => {
                  setSelectedMobileRoom(r);
                  setIsRoomMinimized(false);
                  setActiveClientScreen('room');
                }}
                onRestoreRoom={() => {
                  setIsRoomMinimized(false);
                  setActiveClientScreen('room');
                }}
                onCloseMinimizedRoom={() => setIsRoomMinimized(false)}
                onOpenDailyReward={() => setShowDailyReward(true)}
                onOpenInviteFriends={() => setShowInviteFriends(true)}
                onOpenProfile={() => setActiveClientScreen('profile')}
              />
            ) : (
              <MobileProfile
                onBack={() => setActiveClientScreen('discover')}
                userCoins={userCoins}
                onOpenInvite={() => setShowInviteFriends(true)}
              />
            )}
          </div>
        )}

        {/* VIEW 4: MONOREPO CODE & ARCHITECTURE EXPLORER */}
        {viewMode === 'code' && <CodeExplorer />}
      </main>

      {/* Daily Reward Modal Popup */}
      {showDailyReward && (
        <DailyRewardModal
          onClose={() => setShowDailyReward(false)}
          onClaim={(coins) => setUserCoins((prev) => prev + coins)}
        />
      )}

      {/* Invite Friends Modal Popup */}
      {showInviteFriends && (
        <InviteFriendsModal
          onClose={() => setShowInviteFriends(false)}
          onClaimCoins={(amount) => setUserCoins((prev) => prev + amount)}
        />
      )}
    </div>
  );
}
