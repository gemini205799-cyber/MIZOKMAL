import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Video, 
  DollarSign, 
  UserPlus, 
  MoreHorizontal, 
  TrendingUp, 
  Flame, 
  Sparkles, 
  Radio, 
  Crown, 
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Gift,
  CheckCircle2,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Volume2
} from 'lucide-react';
import { VoiceRoom } from '../../types';

interface SuperAdminDashboardProps {
  rooms: VoiceRoom[];
  onNavigateToTab: (tab: string) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ rooms, onNavigateToTab }) => {
  const [revenueTimeframe, setRevenueTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [metricsTimeframe, setMetricsTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  
  // Metric toggles for chart curves
  const [showUsersOnline, setShowUsersOnline] = useState(true);
  const [showVoiceStreams, setShowVoiceStreams] = useState(true);
  const [showTotalActivity, setShowTotalActivity] = useState(true);

  // Live fluctuating counters to give real-time vitality for Mizo Live Platform
  const [metrics, setMetrics] = useState({
    activeUsers: 24850,
    liveRooms: 1480,
    totalRevenue: 168420,
    newRegistrations: 845
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 9) - 4,
        liveRooms: prev.liveRooms + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0),
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 25),
        newRegistrations: prev.newRegistrations + (Math.random() > 0.7 ? 1 : 0)
      }));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Time labels based on timeframe
  const timeLabels = metricsTimeframe === '24h'
    ? ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00']
    : metricsTimeframe === '7d'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  // Realistic activity feed for Mizo Live
  const [activityFeed, setActivityFeed] = useState([
    {
      id: '1',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      name: 'Tariq Al-Mansoor',
      action: 'sent Royal Imperial Falcon (50,000 Coins)',
      time: '1m ago',
      type: 'gift',
      borderColor: 'border-amber-400',
      tab: 'gifting'
    },
    {
      id: '2',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      name: 'Reem Al-Fahad',
      action: 'took Boss Mic throne in Royal Gulf Majlis',
      time: '3m ago',
      type: 'user',
      borderColor: 'border-cyan-400',
      tab: 'rooms'
    },
    {
      id: '3',
      avatar: '',
      icon: 'video',
      name: 'Cairo Nights & Live Oud',
      action: 'voice room went live',
      time: '7m ago',
      type: 'room',
      borderColor: 'border-purple-500',
      tab: 'rooms'
    },
    {
      id: '4',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      name: 'Zeina Al-Harbi',
      action: 'approved agency payout for Al-Noor Media',
      time: '11m ago',
      type: 'mod',
      borderColor: 'border-emerald-400',
      tab: 'finance'
    }
  ]);

  // Context menu on activity feed
  const [showActivityMenu, setShowActivityMenu] = useState(false);

  // Top active rooms on Mizo Live
  const topRooms = [
    {
      id: 'r1',
      name: 'Royal Gulf Majlis',
      category: 'Gulf VIP Chat',
      users: '3.4k',
      revenue: '$14.2k',
      iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
    },
    {
      id: 'r2',
      name: 'Cairo Nights & Live Oud',
      category: 'Live Acoustic & Tarab',
      users: '2.8k',
      revenue: '$9.8k',
      iconBg: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
    },
    {
      id: 'r3',
      name: 'Levant Melody Stage',
      category: 'Poetry & Music',
      users: '2.1k',
      revenue: '$7.4k',
      iconBg: 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/40'
    },
    {
      id: 'r4',
      name: 'Gaming & Voice Arena',
      category: 'Esports & Talk',
      users: '1.9k',
      revenue: '$5.6k',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
    }
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans pb-10">
      
      {/* 1. Header Section: Real-time Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Real-time Overview
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </h2>
          <span className="text-xs text-slate-400">Click any card for in-depth management</span>
        </div>

        {/* 4 Neon Glow Stat Cards (Image 2 Parity) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Active Users (Cyan Neon Glow) */}
          <div 
            onClick={() => onNavigateToTab('users')}
            className="relative overflow-hidden rounded-2xl bg-[#0e1322] border border-cyan-500/40 p-5 shadow-[0_0_25px_rgba(6,182,212,0.18)] transition-all hover:border-cyan-400 hover:scale-[1.02] cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Active Users</span>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                {metrics.activeUsers.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                +8.4%
              </span>
            </div>
          </div>

          {/* Card 2: Live Rooms (Purple/Pink Neon Glow) */}
          <div 
            onClick={() => onNavigateToTab('rooms')}
            className="relative overflow-hidden rounded-2xl bg-[#0e1322] border border-purple-500/40 p-5 shadow-[0_0_25px_rgba(168,85,247,0.18)] transition-all hover:border-purple-400 hover:scale-[1.02] cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Live Rooms</span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 transition">
                <Video className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                {metrics.liveRooms.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                +11.2%
              </span>
            </div>
          </div>

          {/* Card 3: Total Revenue (Cyan/Teal Neon Glow) */}
          <div 
            onClick={() => onNavigateToTab('finance')}
            className="relative overflow-hidden rounded-2xl bg-[#0e1322] border border-cyan-400/40 p-5 shadow-[0_0_25px_rgba(34,211,238,0.18)] transition-all hover:border-cyan-300 hover:scale-[1.02] cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Total Revenue</span>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                ${metrics.totalRevenue.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                +15.1%
              </span>
            </div>
          </div>

          {/* Card 4: New Registrations (Purple/Indigo Glow) */}
          <div 
            onClick={() => onNavigateToTab('users')}
            className="relative overflow-hidden rounded-2xl bg-[#0e1322] border border-indigo-500/40 p-5 shadow-[0_0_25px_rgba(99,102,241,0.18)] transition-all hover:border-indigo-400 hover:scale-[1.02] cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">New Registrations</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition">
                <UserPlus className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                {metrics.newRegistrations}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                today
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Middle Row: Main Waveform Chart & Recent Activity Feed (Image 2 Parity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Rooms & User Metrics Waveform (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-[#0e1322] border border-slate-800/80 p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Live Rooms & User Metrics</h3>
              
              {/* Interactive Legend pills (Image 2 Parity) */}
              <div className="flex items-center gap-4 mt-2 text-xs">
                <button 
                  onClick={() => setShowUsersOnline(!showUsersOnline)}
                  className={`flex items-center gap-1.5 transition cursor-pointer ${showUsersOnline ? 'text-slate-300' : 'text-slate-600 line-through'}`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                  <span>Users Online</span>
                </button>
                <button 
                  onClick={() => setShowVoiceStreams(!showVoiceStreams)}
                  className={`flex items-center gap-1.5 transition cursor-pointer ${showVoiceStreams ? 'text-slate-300' : 'text-slate-600 line-through'}`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                  <span>Voice Streams</span>
                </button>
                <button 
                  onClick={() => setShowTotalActivity(!showTotalActivity)}
                  className={`flex items-center gap-1.5 transition cursor-pointer ${showTotalActivity ? 'text-slate-300' : 'text-slate-600 line-through'}`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef]" />
                  <span>Total Activity</span>
                </button>
              </div>
            </div>

            {/* Timeframe Buttons: 24h, 7d, 30d */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
              {(['24h', '7d', '30d'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setMetricsTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    metricsTimeframe === tf 
                      ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Glow Chart Canvas (Image 2 Exact Waveform) */}
          <div className="mt-6 relative h-64 w-full">
            
            {/* Y Axis Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between text-[11px] font-mono text-slate-500 pointer-events-none">
              <div className="flex items-center gap-3">
                <span className="w-6 text-right">200</span>
                <div className="flex-1 h-px bg-slate-800/60" />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 text-right">160</span>
                <div className="flex-1 h-px bg-slate-800/60" />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 text-right">120</span>
                <div className="flex-1 h-px bg-slate-800/60" />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 text-right">80</span>
                <div className="flex-1 h-px bg-slate-800/60" />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 text-right">40</span>
                <div className="flex-1 h-px bg-slate-800/60" />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 text-right">0</span>
                <div className="flex-1 h-px bg-slate-800/60" />
              </div>
            </div>

            {/* SVG Curves Container */}
            <svg className="absolute inset-0 w-full h-full pl-9 pr-2 pb-6 pt-2 overflow-visible" viewBox="0 0 700 210" preserveAspectRatio="none">
              <defs>
                {/* Cyan Glow Filter */}
                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Purple Glow Filter */}
                <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Curve 1: Users Online (Cyan) */}
              {showUsersOnline && (
                <path
                  d="M 0 190 Q 70 180, 140 120 T 280 135 T 420 90 T 560 145 T 700 160"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  filter="url(#glow-cyan)"
                />
              )}

              {/* Curve 2: Voice Streams (Blue/Violet) */}
              {showVoiceStreams && (
                <path
                  d="M 0 200 Q 70 190, 140 140 T 280 160 T 420 115 T 560 165 T 700 175"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                />
              )}

              {/* Curve 3: Total Activity (Fuchsia) */}
              {showTotalActivity && (
                <path
                  d="M 0 205 Q 70 195, 140 155 T 280 175 T 420 135 T 560 180 T 700 190"
                  fill="none"
                  stroke="#d946ef"
                  strokeWidth="2.5"
                  filter="url(#glow-purple)"
                />
              )}

              {/* Glowing Peaks (Data Points on curve) */}
              {showUsersOnline && (
                <>
                  <circle cx="140" cy="120" r="4.5" fill="#22d3ee" className="animate-pulse" />
                  <circle cx="420" cy="90" r="4.5" fill="#22d3ee" className="animate-pulse" />
                  <circle cx="560" cy="145" r="4.5" fill="#22d3ee" />
                </>
              )}

              {showVoiceStreams && (
                <>
                  <circle cx="280" cy="160" r="4" fill="#3b82f6" />
                  <circle cx="420" cy="115" r="4" fill="#3b82f6" />
                </>
              )}

              {showTotalActivity && (
                <>
                  <circle cx="140" cy="155" r="4" fill="#d946ef" />
                  <circle cx="420" cy="135" r="4" fill="#d946ef" />
                </>
              )}
            </svg>

            {/* X Axis Time Labels */}
            <div className="absolute bottom-0 left-9 right-2 flex justify-between text-[11px] font-mono text-slate-400">
              {timeLabels.map((t, idx) => (
                <span key={idx}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed (4 Cols - Image 2 Parity) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0e1322] border border-slate-800/80 p-5 shadow-xl relative">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white tracking-wide">Recent Activity Feed</h3>
            <div className="relative">
              <button 
                onClick={() => setShowActivityMenu(!showActivityMenu)}
                className="p-1 hover:text-white text-slate-400 rounded hover:bg-slate-800 transition"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {showActivityMenu && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#0f172a] border border-slate-700 shadow-2xl p-1.5 z-40 text-xs">
                  <button 
                    onClick={() => {
                      setActivityFeed(prev => [{
                        id: String(Date.now()),
                        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
                        name: 'Alex R.',
                        action: 'Adjusted Boss Mic base price to 5,000 Coins',
                        time: 'Just now',
                        type: 'mod',
                        borderColor: 'border-cyan-500',
                        tab: 'settings'
                      }, ...prev]);
                      setShowActivityMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                  >
                    Refresh Activity
                  </button>
                  <button 
                    onClick={() => {
                      setActivityFeed([]);
                      setShowActivityMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    Clear Feed
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {activityFeed.length === 0 ? (
              <p className="text-center py-10 text-xs text-slate-500">No recent activity</p>
            ) : (
              activityFeed.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigateToTab(item.tab)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className={`w-9 h-9 rounded-full object-cover border-2 ${item.borderColor}`}
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center text-purple-400">
                        <Video className="w-4 h-4" />
                      </div>
                    )}

                    <div className="text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white group-hover:text-cyan-400 transition">{item.name}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">{item.action}</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {item.time}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 3. Bottom Row: Revenue Tracking, Virtual Gift Analytics, Top Rooms By Activity (Image 2 Parity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card 1: Revenue Tracking (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0e1322] border border-slate-800/80 p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white tracking-wide">Revenue Tracking</h3>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setRevenueTimeframe('daily')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  revenueTimeframe === 'daily' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Daily
              </button>
              <button 
                onClick={() => setRevenueTimeframe('weekly')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  revenueTimeframe === 'weekly' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Weekly
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-extrabold font-mono text-white">
                  {revenueTimeframe === 'daily' ? '$168.4k' : '$1,120.5k'}
                </span>
                <p className="text-xs text-slate-400 mt-0.5">{revenueTimeframe === 'daily' ? 'Daily Earnings' : 'Weekly Accumulated'}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                +19.2%
              </span>
            </div>

            {/* Cyan Wave SVG */}
            <div className="mt-4 h-28 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                <path
                  d="M 0 80 Q 50 90, 100 65 T 200 40 T 300 15"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                />
                <circle cx="200" cy="40" r="4" fill="#22d3ee" className="animate-pulse" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 2: Virtual Gift Analytics (4 Cols - Bar Charts) */}
        <div 
          onClick={() => onNavigateToTab('gifting')}
          className="lg:col-span-4 rounded-2xl bg-[#0e1322] border border-slate-800/80 p-5 shadow-xl hover:border-slate-700 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide group-hover:text-cyan-400 transition">Virtual Gift Analytics</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Top 100 gifts by volume</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition" />
          </div>

          {/* Bar Chart matching Image 2 */}
          <div className="mt-6 flex items-end justify-between h-36 px-4">
            
            {/* Bar 1: Gold Star */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm">⭐</span>
              <div className="w-8 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg h-24 shadow-[0_0_12px_rgba(6,182,212,0.4)]" />
              <span className="text-[10px] text-slate-300 font-medium">Gold Star</span>
            </div>

            {/* Bar 2: Dragon */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm">🐉</span>
              <div className="w-8 bg-gradient-to-t from-cyan-700 to-cyan-500 rounded-t-lg h-18 shadow-[0_0_10px_rgba(6,182,212,0.3)]" />
              <span className="text-[10px] text-slate-300 font-medium">Dragon</span>
            </div>

            {/* Bar 3: Mic */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm">🎤</span>
              <div className="w-8 bg-gradient-to-t from-cyan-800 to-cyan-600 rounded-t-lg h-14" />
              <span className="text-[10px] text-slate-300 font-medium">Mic</span>
            </div>

            {/* Bar 4: Heart */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm">❤️</span>
              <div className="w-8 bg-gradient-to-t from-cyan-900 to-cyan-700 rounded-t-lg h-10" />
              <span className="text-[10px] text-slate-300 font-medium">Heart</span>
            </div>

          </div>
        </div>

        {/* Card 3: Top Rooms By Activity (4 Cols - Image 2 Parity) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0e1322] border border-slate-800/80 p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white tracking-wide">Top Rooms By Activity</h3>
            <button 
              onClick={() => onNavigateToTab('rooms')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              View all
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {topRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => onNavigateToTab('rooms')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${room.iconBg}`}>
                    <Radio className="w-4 h-4" />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition">{room.name}</h4>
                    <p className="text-[11px] text-slate-400">{room.users} users</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-emerald-400">{room.revenue}</span>
                  <p className="text-[10px] text-slate-400">Total Gifted</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
