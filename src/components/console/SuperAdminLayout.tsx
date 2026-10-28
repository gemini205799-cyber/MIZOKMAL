import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Radio, 
  Gift, 
  BarChart3, 
  DollarSign, 
  FileText, 
  Settings, 
  Search, 
  Bell, 
  Calendar, 
  ChevronDown, 
  ShieldCheck, 
  Mic, 
  LogOut,
  UserCheck,
  CheckCircle2,
  X,
  Sparkles,
  Smartphone,
  ExternalLink,
  Shield,
  Layers,
  Activity
} from 'lucide-react';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { SuperAdminUserManagement } from './SuperAdminUserManagement';
import { SuperAdminStaffManagement } from './SuperAdminStaffManagement';
import { LiveOperationsCenter } from './LiveOperationsCenter';
import { GiftCmsEconomy } from './GiftCmsEconomy';
import { AgencyPortal } from './AgencyPortal';
import { LiveKitTelemetry } from './LiveKitTelemetry';
import { SeatsTemplateConfig } from './SeatsTemplateConfig';
import { MobileClientShell } from '../client/MobileClientShell';
import { MobileVoiceRoom } from '../client/MobileVoiceRoom';
import { MobileDiscover } from '../client/MobileDiscover';
import { MobileProfile } from '../client/MobileProfile';
import { VoiceRoom, UserAccount, GiftItem, TransactionRecord, WithdrawalRequest, AgencyData } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface SuperAdminLayoutProps {
  rooms: VoiceRoom[];
  users: UserAccount[];
  gifts: GiftItem[];
  transactions: TransactionRecord[];
  withdrawals: WithdrawalRequest[];
  agencies: AgencyData[];
  onTerminateRoom: (roomId: string) => void;
  onToggleSeatMute: (roomId: string, seatIndex: number) => void;
  onKickParticipant: (roomId: string, seatIndex: number) => void;
  onToggleSeatLock: (roomId: string, seatIndex: number) => void;
  onUpdateUserStatus: (userId: string, newStatus: UserAccount['status']) => void;
  onAdjustUserWallet: (userId: string, deltaCoins: number, deltaDiamonds: number) => void;
  onToggleKycVerification: (userId: string) => void;
  onAddGift: (newGift: GiftItem) => void;
  onDeleteGift: (giftId: string) => void;
  onReviewWithdrawal: (id: string, approved: boolean) => void;
  bossMicEnabled: boolean;
  bossMicBasePrice: number;
  onUpdateBossMic: (enabled: boolean, basePrice: number) => void;
  userCoins?: number;
  onSendGift?: (gift: GiftItem, combo: number) => void;
  onSeatAction?: (seatIndex: number, action: 'take' | 'lock' | 'lock_all' | 'mute' | 'leave') => void;
}

export type ConsoleActiveTab = 
  | 'dashboard' 
  | 'users' 
  | 'staff' 
  | 'rooms' 
  | 'gifting' 
  | 'finance' 
  | 'reports' 
  | 'settings';

export const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = (props) => {
  const [activeTab, setActiveTab] = useState<ConsoleActiveTab>('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [currentTime, setCurrentTime] = useState('15 Oct 2026, 11:32 AM');
  const [adminStatus, setAdminStatus] = useState<'Online' | 'Away' | 'Busy' | 'Offline'>('Online');
  const [unreadCount, setUnreadCount] = useState<number>(2);

  // Mobile app drawer simulation inside Admin Panel
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [activeMobileScreen, setActiveMobileScreen] = useState<'room' | 'discover' | 'profile'>('room');
  const [selectedMobileRoom, setSelectedMobileRoom] = useState<VoiceRoom>(props.rooms[0]);

  // Real-time clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + 
        ', ' + 
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Notifications list with realistic Mizo Live alerts
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Agency Payout Approved', desc: '85,000 Diamonds payout confirmed for Al-Noor Agency', time: '2m ago', tab: 'finance' },
    { id: '2', title: 'High-Value Gift Broadcast', desc: 'Tariq sent Royal Imperial Falcon (50,000 Coins)', time: '4m ago', tab: 'gifting' },
    { id: '3', title: 'LiveKit SFU Auto-Scale', desc: 'Cluster scaled to 12 active audio nodes (42ms latency)', time: '9m ago', tab: 'reports' }
  ]);

  // Global search quick-access index
  const searchableItems = [
    { name: 'Tariq Al-Mansoor', type: 'User (#MZ-1082)', tab: 'users' as const },
    { name: 'Reem Al-Fahad', type: 'User (#MZ-2491)', tab: 'users' as const },
    { name: 'Youssef Benali', type: 'User (#MZ-3850)', tab: 'users' as const },
    { name: 'Kamal Al-Din', type: 'Staff (ID: MZ-101)', tab: 'staff' as const },
    { name: 'Zeina Al-Harbi', type: 'Staff (ID: MZ-102)', tab: 'staff' as const },
    { name: 'Royal Gulf Majlis', type: 'Live Room', tab: 'rooms' as const },
    { name: 'Cairo Nights & Live Oud', type: 'Live Room', tab: 'rooms' as const },
    { name: 'Royal Imperial Falcon', type: 'Virtual Gift', tab: 'gifting' as const },
    { name: 'Boss Mic Engine', type: 'Matrix Settings', tab: 'settings' as const },
  ];

  const filteredSearchResults = globalSearch.trim()
    ? searchableItems.filter(item => 
        item.name.toLowerCase().includes(globalSearch.toLowerCase()) || 
        item.type.toLowerCase().includes(globalSearch.toLowerCase())
      )
    : [];

  return (
    <div dir="ltr" className="h-screen w-screen bg-[#07090e] text-slate-100 flex overflow-hidden font-sans">
      
      {/* ============================================================== */}
      {/* 1. LEFT SIDEBAR (MANDATORY LEFT POSITION - IMAGE 1, 2, 3 PARITY) */}
      {/* ============================================================== */}
      <aside className="w-64 bg-[#0c101a] border-r border-slate-800/80 flex flex-col justify-between shrink-0 z-30 select-none">
        
        <div>
          {/* Brand Logo & Super Admin Header (Top Left - Image 1 & 2 Parity) */}
          <div className="h-16 px-5 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-fuchsia-500 p-0.5 flex items-center justify-center shadow-[0_0_18px_rgba(6,182,212,0.4)]">
              <div className="w-full h-full bg-[#0c101a] rounded-[10px] flex items-center justify-center">
                <Mic className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-wider text-white">MIZO LIVE</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">PRO</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">ADMIN PANEL • Super Admin</p>
            </div>
          </div>

          {/* Vertical Menu Navigation (LEFT SIDEBAR ONLY - EXACT PARITY) */}
          <div className="p-3 space-y-1">
            
            {/* 1. Dashboard (Image 2 - Glowing cyan accent) */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>Dashboard</span>
            </button>

            {/* 2. Users (Image 1: USER MANAGEMENT) */}
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'users'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Users className={`w-4 h-4 ${activeTab === 'users' ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>User Management</span>
            </button>

            {/* 3. Staff Management (Image 3: Staff Management) */}
            <button
              onClick={() => setActiveTab('staff')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'staff'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <UserCheck className={`w-4 h-4 ${activeTab === 'staff' ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>Staff Management</span>
            </button>

            {/* 4. Live Rooms */}
            <button
              onClick={() => setActiveTab('rooms')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'rooms'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Radio className={`w-4 h-4 ${activeTab === 'rooms' ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>Rooms</span>
            </button>

            {/* 5. Gifting (3D PAG Virtual Gift CMS) */}
            <button
              onClick={() => setActiveTab('gifting')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'gifting'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Gift className={`w-4 h-4 ${activeTab === 'gifting' ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>Gifting</span>
            </button>

            {/* 6. Finance & Withdrawals */}
            <button
              onClick={() => setActiveTab('finance')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'finance'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <DollarSign className={`w-4 h-4 ${activeTab === 'finance' ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>Finance</span>
            </button>

            {/* 7. Analytics & Reports */}
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'reports'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <BarChart3 className={`w-4 h-4 ${activeTab === 'reports' ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>Analytics & Logs</span>
            </button>

            {/* 8. Settings */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>Settings</span>
            </button>

          </div>
        </div>

        {/* Bottom Sidebar Footer: Live Phone Preview Trigger + Server Status */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          
          {/* Mobile Client Simulator Toggle Button */}
          <button
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
              showMobilePreview
                ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-600/30'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-pink-400" />
              <span>Mobile App Simulator</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-pink-300 font-mono">
              {showMobilePreview ? 'Open' : 'Preview'}
            </span>
          </button>

          {/* System Telemetry Tag */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LiveKit SFU
              </span>
              <span className="text-emerald-400 font-mono font-semibold">Healthy</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Sub-100ms Latency</p>
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. MAIN WORKSPACE WITH TOP BAR (Image 1, 2, 3 Right Side)       */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header Bar (Image 2 Parity) */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0c101a] px-6 flex items-center justify-between shrink-0 relative z-30">
          
          {/* Left: Search input (Image 2 Parity: Pill Search with Live Dropdown) */}
          <div className="relative w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users, staff, rooms..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full pl-10 pr-8 py-1.5 bg-[#121726] border border-slate-700/80 rounded-full text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Live Search Quick Results Dropdown */}
            {globalSearch.trim() && (
              <div className="absolute left-0 top-10 w-96 rounded-2xl bg-[#0f172a] border border-cyan-500/40 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                  Quick Navigation Results ({filteredSearchResults.length})
                </div>
                <div className="mt-1 space-y-1 max-h-64 overflow-y-auto">
                  {filteredSearchResults.length === 0 ? (
                    <div className="p-3 text-xs text-slate-400 text-center">
                      No matching records for "{globalSearch}"
                    </div>
                  ) : (
                    filteredSearchResults.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveTab(item.tab);
                          setGlobalSearch('');
                        }}
                        className="w-full p-2 rounded-xl text-left hover:bg-slate-800/80 flex items-center justify-between text-xs transition cursor-pointer"
                      >
                        <span className="font-semibold text-white">{item.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                          {item.type}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Calendar/Time, Notification Bell '2', Admin Profile (Image 2 & 1 Parity) */}
          <div className="flex items-center gap-4">
            
            {/* Calendar & Time Display (Image 1 Parity) */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-[11px]">{currentTime}</span>
            </div>

            {/* Notifications Bell with Counter (Image 2 Parity) */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0c101a] animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                    <span className="text-xs font-bold text-white">Live System Alerts</span>
                    <button
                      onClick={() => setUnreadCount(0)}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          setActiveTab(n.tab as any);
                          setShowNotifications(false);
                        }}
                        className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-xs cursor-pointer transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Pill: Alex R. Online (Image 2 Parity) */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
                    alt="Admin"
                    className="w-7 h-7 rounded-full object-cover border border-cyan-400"
                  />
                  <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-2 ring-[#0c101a] ${
                    adminStatus === 'Online' ? 'bg-emerald-400' : adminStatus === 'Away' ? 'bg-amber-400' : adminStatus === 'Busy' ? 'bg-rose-500' : 'bg-slate-500'
                  }`} />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-white leading-tight">Kamal M.</p>
                  <p className={`text-[10px] font-medium leading-tight ${
                    adminStatus === 'Online' ? 'text-emerald-400' : adminStatus === 'Away' ? 'text-amber-400' : adminStatus === 'Busy' ? 'text-rose-400' : 'text-slate-400'
                  }`}>{adminStatus}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0f172a] border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">Kamal M.</p>
                    <p className="text-[10px] text-slate-400 font-mono">kamal.admin@mizo.live</p>
                  </div>

                  {/* Status Picker */}
                  <div className="p-2 border-b border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Presence Status</p>
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      {(['Online', 'Away', 'Busy', 'Offline'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setAdminStatus(st)}
                          className={`px-2 py-1 rounded-md text-left font-medium transition ${
                            adminStatus === st ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}
                    className="w-full mt-1 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Admin Settings</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowSignOutModal(true);
                    }}
                    className="w-full px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg text-left flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          
          <main className="flex-1 overflow-y-auto p-6 bg-[#07090e]">
            
            {/* TAB 1: Dashboard (Image 2 Parity) */}
            {activeTab === 'dashboard' && (
              <SuperAdminDashboard 
                rooms={props.rooms} 
                onNavigateToTab={(tab) => setActiveTab(tab as any)} 
              />
            )}

            {/* TAB 2: Users (Image 1 Parity) */}
            {activeTab === 'users' && (
              <SuperAdminUserManagement
                users={props.users}
                onUpdateUserStatus={props.onUpdateUserStatus}
                onAdjustUserWallet={props.onAdjustUserWallet}
              />
            )}

            {/* TAB 3: Staff Management (Image 3 Parity) */}
            {activeTab === 'staff' && (
              <SuperAdminStaffManagement 
                onNavigateToDashboard={() => setActiveTab('dashboard')}
              />
            )}

            {/* TAB 4: Rooms */}
            {activeTab === 'rooms' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Live Voice Rooms Moderation</h2>
                  <p className="text-xs text-slate-400">Direct LiveKit SFU stage controller and mic enforcement</p>
                </div>
                <LiveOperationsCenter
                  rooms={props.rooms}
                  onTerminateRoom={props.onTerminateRoom}
                  onToggleSeatMute={props.onToggleSeatMute}
                  onKickParticipant={props.onKickParticipant}
                  onToggleSeatLock={props.onToggleSeatLock}
                />
              </div>
            )}

            {/* TAB 5: Gifting */}
            {activeTab === 'gifting' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Virtual Gift Catalog & Economy</h2>
                  <p className="text-xs text-slate-400">Tencent libpag 3D assets, coin prices, and lucky multiplier engine</p>
                </div>
                <GiftCmsEconomy
                  gifts={props.gifts}
                  transactions={props.transactions}
                  withdrawals={props.withdrawals}
                  onAddGift={props.onAddGift}
                  onDeleteGift={props.onDeleteGift}
                  onReviewWithdrawal={props.onReviewWithdrawal}
                />
              </div>
            )}

            {/* TAB 6: Finance & Agencies */}
            {activeTab === 'finance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Finance & Agency Commission Portal</h2>
                  <p className="text-xs text-slate-400">Host settlement, bKash/Nagad transactions, and diamond withdrawal approvals</p>
                </div>
                <AgencyPortal agencies={props.agencies} />
              </div>
            )}

            {/* TAB 7: Reports & Telemetry */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">System Reports & LiveKit Telemetry</h2>
                  <p className="text-xs text-slate-400">Real-time WebRTC packet loss, jitter buffers, and Redis Lua seat latencies</p>
                </div>
                <LiveKitTelemetry />
              </div>
            )}

            {/* TAB 8: Settings */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">System Settings & Matrix Template</h2>
                  <p className="text-xs text-slate-400">Boss Mic dynamic outbidding, 8/12 matrix layout, and platform fees</p>
                </div>
                <SeatsTemplateConfig
                  t={TRANSLATIONS.en}
                  bossMicEnabled={props.bossMicEnabled}
                  bossMicBasePrice={props.bossMicBasePrice}
                  onUpdateBossMic={props.onUpdateBossMic}
                />
              </div>
            )}

          </main>

          {/* ============================================================== */}
          {/* SLIDE-OVER MOBILE CLIENT PREVIEW (Right Drawer - Optional)     */}
          {/* ============================================================== */}
          {/* SLIDE-OVER MOBILE CLIENT PREVIEW (Right Drawer) */}
          {showMobilePreview && (
            <aside className="w-[430px] bg-[#0b0f19] border-l border-slate-800 flex flex-col shrink-0 animate-in slide-in-from-right duration-200 shadow-2xl z-20">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-[#0e1322]">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-pink-400" />
                  <span className="text-xs font-bold text-white">Mobile Client Simulator (Mizo Live)</span>
                </div>
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 flex justify-center bg-[#07090e]">
                <div className="w-[390px] h-[720px]">
                  <MobileClientShell
                    rooms={props.rooms}
                    gifts={props.gifts}
                    userCoins={props.userCoins || 148000}
                    onSendGift={props.onSendGift || (() => {})}
                    onSeatAction={props.onSeatAction || (() => {})}
                    onAddCoins={(amount) => {
                      if (props.onAdjustUserWallet) {
                        props.onAdjustUserWallet('u4', amount, 0);
                      }
                    }}
                  />
                </div>
              </div>
            </aside>
          )}

        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowSignOutModal(false)}
        >
          <div 
            className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30">
                <LogOut className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-white">Sign Out of Super Admin?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your active session as <span className="font-bold text-white">Kamal M. (Super Admin)</span> will be locked. You can sign back in at any time.
            </p>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowSignOutModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                Stay Logged In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminStatus('Offline');
                  setShowSignOutModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

