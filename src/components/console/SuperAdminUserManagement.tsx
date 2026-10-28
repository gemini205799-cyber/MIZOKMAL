import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  MoreHorizontal, 
  AlertTriangle, 
  Ban, 
  Eye, 
  Key, 
  UserCheck, 
  X, 
  Check, 
  ChevronDown,
  Shield,
  Mail,
  Calendar,
  Lock,
  Smartphone,
  CheckCircle2,
  Coins,
  Gem,
  RefreshCw,
  Copy,
  Sliders,
  DollarSign,
  UserX
} from 'lucide-react';
import { UserAccount } from '../../types';

interface SuperAdminUserManagementProps {
  users?: UserAccount[];
  onUpdateUserStatus?: (userId: string, newStatus: UserAccount['status']) => void;
  onAdjustUserWallet?: (userId: string, deltaCoins: number, deltaDiamonds: number) => void;
}

export interface AdminUserRecord {
  id: string;
  code: string; // e.g. #US814
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Moderator' | 'Member';
  status: 'Active' | 'Inactive' | 'Suspended' | 'Banned';
  lastLogin: string;
  coins: number;
  diamonds: number;
  kycVerified: boolean;
  phone?: string;
  device?: string;
}

export const SuperAdminUserManagement: React.FC<SuperAdminUserManagementProps> = ({
  users,
  onUpdateUserStatus,
  onAdjustUserWallet
}) => {
  // Realistic user accounts for Mizo Live Platform
  const [userList, setUserList] = useState<AdminUserRecord[]>([
    {
      id: 'u1',
      code: '#MZ-1082',
      name: 'Tariq Al-Mansoor',
      email: 'tariq.mansoor@mizo.live',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      role: 'Admin',
      status: 'Active',
      lastLogin: 'Today, 11:28 AM',
      coins: 1840000,
      diamonds: 320000,
      kycVerified: true,
      phone: '+971 50 842 1904',
      device: 'iPhone 16 Pro Max (iOS 18.2)'
    },
    {
      id: 'u2',
      code: '#MZ-2491',
      name: 'Reem Al-Fahad',
      email: 'reem.host@mizo.stream',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      role: 'Moderator',
      status: 'Active',
      lastLogin: 'Today, 10:15 AM',
      coins: 450000,
      diamonds: 145000,
      kycVerified: true,
      phone: '+966 54 321 8890',
      device: 'Samsung Galaxy S24 Ultra'
    },
    {
      id: 'u3',
      code: '#MZ-3850',
      name: 'Youssef Benali',
      email: 'youssef.benali@mizo.live',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      role: 'Member',
      status: 'Active',
      lastLogin: 'Today, 09:40 AM',
      coins: 890000,
      diamonds: 62500,
      kycVerified: true,
      phone: '+212 661 234567',
      device: 'iPad Pro M4'
    },
    {
      id: 'u4',
      code: '#MZ-4912',
      name: 'Sarah Jenkins',
      email: 'sarah.j@voicecloud.io',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      role: 'Member',
      status: 'Active',
      lastLogin: 'Yesterday, 11:50 PM',
      coins: 340000,
      diamonds: 41200,
      kycVerified: true,
      phone: '+44 7700 900142',
      device: 'iPhone 15 (iOS 18.1)'
    },
    {
      id: 'u5',
      code: '#MZ-5820',
      name: 'Nasser Al-Subaie',
      email: 'nasser.subaie@mizo.vip',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      role: 'Member',
      status: 'Active',
      lastLogin: 'Today, 08:12 AM',
      coins: 2750000,
      diamonds: 490000,
      kycVerified: true,
      phone: '+965 99 123 456',
      device: 'iPhone 15 Pro'
    },
    {
      id: 'u6',
      code: '#MZ-6743',
      name: 'Dalia Mahmoud',
      email: 'dalia.singer@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      role: 'Moderator',
      status: 'Active',
      lastLogin: '27 Oct 2026, 07:30 PM',
      coins: 125000,
      diamonds: 88400,
      kycVerified: true,
      phone: '+20 100 987 6543',
      device: 'Xiaomi 14 Ultra'
    },
    {
      id: 'u7',
      code: '#MZ-7195',
      name: 'Fahad Al-Kuwari',
      email: 'fahad.kuwari@outlook.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      role: 'Member',
      status: 'Suspended',
      lastLogin: '25 Oct 2026, 04:10 PM',
      coins: 18500,
      diamonds: 2400,
      kycVerified: false,
      phone: '+974 55 123 789',
      device: 'OnePlus 12'
    },
    {
      id: 'u8',
      code: '#MZ-8321',
      name: 'Lina Rostova',
      email: 'lina.rostova@techvoice.net',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      role: 'Member',
      status: 'Inactive',
      lastLogin: '22 Oct 2026, 01:25 PM',
      coins: 4200,
      diamonds: 300,
      kycVerified: false,
      phone: '+33 6 45 12 78 90',
      device: 'Google Pixel 9 Pro'
    },
    {
      id: 'u9',
      code: '#MZ-9054',
      name: 'Zaid Al-Harbi',
      email: 'zaid.harbi@mizo.live',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
      role: 'Member',
      status: 'Inactive',
      lastLogin: '20 Oct 2026, 06:14 AM',
      coins: 1800,
      diamonds: 0,
      kycVerified: false,
      phone: '+962 7 9123 4567',
      device: 'Huawei Mate 60 Pro'
    },
    {
      id: 'u10',
      code: '#MZ-9840',
      name: 'Karim Al-Zahrawi',
      email: 'karim.streamer@mizo.live',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face',
      role: 'Member',
      status: 'Banned',
      lastLogin: '18 Oct 2026, 09:05 PM',
      coins: 0,
      diamonds: 0,
      kycVerified: false,
      phone: '+964 770 123 4567',
      device: 'Sony Xperia 1 VI'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>(['u4']);
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState<AdminUserRecord | null>(null);
  const [showEditModal, setShowEditModal] = useState<AdminUserRecord | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<AdminUserRecord | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warn' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'warn' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Admin' | 'Moderator' | 'Member'>('Member');
  const [newUserStatus, setNewUserStatus] = useState<'Active' | 'Inactive'>('Active');
  const [newUserCoins, setNewUserCoins] = useState<number>(10000);
  const [newUserDiamonds, setNewUserDiamonds] = useState<number>(500);
  const [newUserAvatar, setNewUserAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face');

  // Edit User Form State
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'Admin' | 'Moderator' | 'Member'>('Member');
  const [editStatus, setEditStatus] = useState<'Active' | 'Inactive' | 'Suspended' | 'Banned'>('Active');
  const [editCoins, setEditCoins] = useState<number>(0);
  const [editDiamonds, setEditDiamonds] = useState<number>(0);

  const openEditModal = (user: AdminUserRecord) => {
    setShowEditModal(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditStatus(user.status);
    setEditCoins(user.coins);
    setEditDiamonds(user.diamonds);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;

    setUserList(prev => prev.map(u => u.id === showEditModal.id ? {
      ...u,
      name: editName,
      email: editEmail,
      role: editRole,
      status: editStatus,
      coins: editCoins,
      diamonds: editDiamonds
    } : u));

    showToast(`User ${editName} updated successfully.`);
    setShowEditModal(null);
  };

  // Toggle single user select
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filtered users
  const filteredUsers = userList.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Toggle select all filtered
  const toggleSelectAll = () => {
    const currentFilteredIds = filteredUsers.map(u => u.id);
    const allSelected = currentFilteredIds.length > 0 && currentFilteredIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !currentFilteredIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...currentFilteredIds])));
    }
  };

  // Status badge style helper
  const renderStatusBadge = (status: AdminUserRecord['status']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Active
          </span>
        );
      case 'Inactive':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            Inactive
          </span>
        );
      case 'Suspended':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Suspended
          </span>
        );
      case 'Banned':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-600/20 text-red-400 border border-red-500/40">
            Banned
          </span>
        );
      default:
        return null;
    }
  };

  // Role badge style helper
  const renderRoleBadge = (role: AdminUserRecord['role']) => {
    switch (role) {
      case 'Admin':
        return <span className="text-xs font-medium text-slate-200">Admin</span>;
      case 'Moderator':
        return <span className="text-xs font-medium text-slate-200">Moderator</span>;
      case 'Member':
        return <span className="text-xs font-medium text-slate-300">Member</span>;
    }
  };

  // Action handlers
  const handleSuspend = (user: AdminUserRecord) => {
    const newStatus = user.status === 'Suspended' ? 'Active' : 'Suspended';
    setUserList(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    onUpdateUserStatus?.(user.id, newStatus.toLowerCase() as any);
    setActiveMenuUserId(null);
    showToast(newStatus === 'Suspended' ? `User ${user.name} (${user.code}) has been SUSPENDED.` : `User ${user.name} reactivated.`, 'warn');
  };

  const handleBan = (user: AdminUserRecord) => {
    const newStatus = user.status === 'Banned' ? 'Active' : 'Banned';
    setUserList(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    onUpdateUserStatus?.(user.id, newStatus.toLowerCase() as any);
    setActiveMenuUserId(null);
    showToast(newStatus === 'Banned' ? `User ${user.name} (${user.code}) has been BANNED.` : `User ${user.name} unbanned.`, 'warn');
  };

  const handleDeleteConfirmed = () => {
    if (!showDeleteConfirm) return;
    const id = showDeleteConfirm.id;
    const name = showDeleteConfirm.name;
    setUserList(prev => prev.filter(u => u.id !== id));
    setSelectedIds(prev => prev.filter(item => item !== id));
    setShowDeleteConfirm(null);
    showToast(`User ${name} has been permanently deleted.`, 'warn');
  };

  // Bulk actions
  const handleBulkStatusChange = (status: AdminUserRecord['status']) => {
    setUserList(prev => prev.map(u => selectedIds.includes(u.id) ? { ...u, status } : u));
    showToast(`${selectedIds.length} users marked as ${status}.`);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected users?`)) {
      setUserList(prev => prev.filter(u => !selectedIds.includes(u.id)));
      showToast(`${selectedIds.length} users deleted.`, 'warn');
      setSelectedIds([]);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const randomCodeNum = Math.floor(820 + Math.random() * 80);
    const newUser: AdminUserRecord = {
      id: `u_${Date.now()}`,
      code: `#US${randomCodeNum}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      avatar: newUserAvatar,
      role: newUserRole,
      status: newUserStatus,
      lastLogin: 'Just now',
      coins: newUserCoins,
      diamonds: newUserDiamonds,
      kycVerified: false,
      phone: '+1 555 ' + Math.floor(100 + Math.random() * 900) + ' ' + Math.floor(1000 + Math.random() * 9000),
      device: 'Mobile Web Client'
    };
    setUserList(prev => [newUser, ...prev]);
    setShowAddModal(false);
    setNewUserName('');
    setNewUserEmail('');
    showToast(`New user ${newUser.name} (${newUser.code}) created successfully!`);
  };

  // Quick Wallet Adjust inside Details Modal
  const handleAdjustDetailsBalance = (deltaCoins: number, deltaDiamonds: number) => {
    if (!showDetailsModal) return;
    const updated = {
      ...showDetailsModal,
      coins: Math.max(0, showDetailsModal.coins + deltaCoins),
      diamonds: Math.max(0, showDetailsModal.diamonds + deltaDiamonds)
    };
    setShowDetailsModal(updated);
    setUserList(prev => prev.map(u => u.id === updated.id ? updated : u));
    onAdjustUserWallet?.(updated.id, deltaCoins, deltaDiamonds);
    showToast(`Wallet adjusted: ${deltaCoins >= 0 ? '+' : ''}${deltaCoins.toLocaleString()} Coins, ${deltaDiamonds >= 0 ? '+' : ''}${deltaDiamonds.toLocaleString()} Diamonds.`);
  };

  // Toggle KYC Status inside Details Modal
  const handleToggleKyc = () => {
    if (!showDetailsModal) return;
    const updated = {
      ...showDetailsModal,
      kycVerified: !showDetailsModal.kycVerified
    };
    setShowDetailsModal(updated);
    setUserList(prev => prev.map(u => u.id === updated.id ? updated : u));
    showToast(`KYC status for ${updated.name} updated to ${updated.kycVerified ? 'VERIFIED' : 'UNVERIFIED'}.`);
  };

  // Reset password simulation
  const handleResetPassword = (user: AdminUserRecord) => {
    const tempPass = 'Mizo#' + Math.random().toString(36).slice(-6) + '!';
    navigator.clipboard?.writeText(tempPass);
    setActiveMenuUserId(null);
    showToast(`Temp password for ${user.email}: ${tempPass} (Copied to clipboard!)`, 'info');
  };

  // Quick cycle role
  const handleCycleRole = (user: AdminUserRecord) => {
    const nextRole: AdminUserRecord['role'] = 
      user.role === 'Admin' ? 'Moderator' : user.role === 'Moderator' ? 'Member' : 'Admin';
    setUserList(prev => prev.map(u => u.id === user.id ? { ...u, role: nextRole } : u));
    setActiveMenuUserId(null);
    showToast(`Role for ${user.name} changed to ${nextRole}.`);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans pb-12 relative" onClick={() => setActiveMenuUserId(null)}>
      
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0f172a] border border-cyan-500/50 shadow-2xl text-xs font-semibold text-white animate-in slide-in-from-top-4">
          <CheckCircle2 className={`w-4 h-4 ${
            toastMessage.type === 'warn' ? 'text-amber-400' : toastMessage.type === 'info' ? 'text-cyan-400' : 'text-emerald-400'
          }`} />
          <span>{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header with Title and Add New User Button (Image 1 Parity) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase">USER MANAGEMENT</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage live accounts, verify identities, adjust coin wallets, and moderate access</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowAddModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New User</span>
        </button>
      </div>

      {/* 2. Filter Bar: Search, Status Dropdown, Role Dropdown (Image 1 Parity) */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0f172a] border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* All Statuses Dropdown */}
        <div className="relative w-full sm:w-44">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0f172a] border border-slate-700/80 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
            <option value="Banned">Banned</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Role: All Dropdown */}
        <div className="relative w-full sm:w-44">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0f172a] border border-slate-700/80 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
          >
            <option value="All">Role: All</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
            <option value="Member">Member</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Clear Filters indicator */}
        {(searchQuery || statusFilter !== 'All' || roleFilter !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setRoleFilter('All');
            }}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-2 py-1"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Floating Bulk Action Bar when rows are selected */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-gradient-to-r from-blue-900/60 to-slate-900/90 border border-blue-500/40 rounded-xl flex items-center justify-between text-xs animate-in fade-in shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-bold text-white">{selectedIds.length} user{selectedIds.length > 1 ? 's' : ''} selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange('Active')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 font-semibold transition"
            >
              Activate
            </button>
            <button
              onClick={() => handleBulkStatusChange('Suspended')}
              className="px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-300 font-semibold transition"
            >
              Suspend
            </button>
            <button
              onClick={() => handleBulkStatusChange('Banned')}
              className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-300 font-semibold transition"
            >
              Ban
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition"
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Data Table (Image 1 Parity) */}
      <div className="rounded-xl border border-slate-800 bg-[#0e1424] overflow-visible shadow-xl">
        <div className="overflow-x-auto overflow-y-visible min-h-[460px]">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#12192c] text-xs uppercase font-semibold text-slate-400 border-b border-slate-800 tracking-wider">
              <tr>
                <th scope="col" className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={filteredUsers.length > 0 && filteredUsers.every(u => selectedIds.includes(u.id))}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                  />
                </th>
                <th scope="col" className="px-4 py-3.5">ID</th>
                <th scope="col" className="px-4 py-3.5">AVATAR</th>
                <th scope="col" className="px-4 py-3.5">FULL NAME</th>
                <th scope="col" className="px-4 py-3.5">EMAIL ADDRESS</th>
                <th scope="col" className="px-4 py-3.5">ROLE</th>
                <th scope="col" className="px-4 py-3.5">STATUS</th>
                <th scope="col" className="px-4 py-3.5">LAST LOGIN</th>
                <th scope="col" className="px-4 py-3.5 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-normal">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400 text-sm">
                    No users matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = selectedIds.includes(user.id);
                  const isMenuOpen = activeMenuUserId === user.id;

                  return (
                    <tr 
                      key={user.id}
                      onClick={() => toggleSelect(user.id)}
                      className={`transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-950/30 hover:bg-blue-950/40 border-l-4 border-l-blue-500' 
                          : 'hover:bg-slate-800/30'
                      }`}
                    >
                      {/* Select Checkbox */}
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(user.id)}
                          className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      {/* ID */}
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">
                        {user.code}
                      </td>

                      {/* Avatar */}
                      <td className="px-4 py-3">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-700 shadow-sm"
                        />
                      </td>

                      {/* Full Name */}
                      <td className="px-4 py-3 font-medium text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {user.kycVerified && (
                            <span title="KYC Verified" className="inline-flex">
                              <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 text-slate-300 font-mono text-xs">
                        {user.email}
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        {renderRoleBadge(user.role)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        {renderStatusBadge(user.status)}
                      </td>

                      {/* Last Login */}
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {user.lastLogin}
                      </td>

                      {/* Actions Icons & Context Menu (Image 1 Parity) */}
                      <td className="px-4 py-3 text-center relative" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2 text-slate-400">
                          {/* Edit Action */}
                          <button 
                            onClick={() => openEditModal(user)}
                            title="Edit User" 
                            className="p-1 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Action */}
                          <button 
                            onClick={() => setShowDeleteConfirm(user)}
                            title="Delete User" 
                            className="p-1 hover:text-rose-400 hover:bg-rose-500/10 rounded transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {/* 3-dots Context Menu Trigger */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuUserId(isMenuOpen ? null : user.id);
                            }}
                            className={`p-1 rounded transition cursor-pointer ${isMenuOpen ? 'text-white bg-slate-800' : 'hover:text-white hover:bg-slate-800'}`}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Context Menu Popup (Image 1 Exact Parity) */}
                        {isMenuOpen && (
                          <div 
                            className="absolute right-4 top-10 w-48 rounded-xl bg-white text-slate-900 shadow-2xl border border-slate-200 py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Suspend ID */}
                            <button
                              onClick={() => handleSuspend(user)}
                              className="w-full px-3.5 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 flex items-center gap-2 transition cursor-pointer"
                            >
                              <AlertTriangle className="w-4 h-4 text-amber-600 fill-amber-100" />
                              <span>{user.status === 'Suspended' ? 'REACTIVATE ID' : 'SUSPEND ID'}</span>
                            </button>

                            {/* Ban User */}
                            <button
                              onClick={() => handleBan(user)}
                              className="w-full px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition cursor-pointer"
                            >
                              <Ban className="w-4 h-4 text-rose-600" />
                              <span>{user.status === 'Banned' ? 'UNBAN USER' : 'BAN USER'}</span>
                            </button>

                            <div className="h-px bg-slate-200 my-1" />

                            {/* View Details */}
                            <button
                              onClick={() => {
                                setShowDetailsModal(user);
                                setActiveMenuUserId(null);
                              }}
                              className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>View Details</span>
                            </button>

                            {/* Edit User */}
                            <button
                              onClick={() => {
                                openEditModal(user);
                                setActiveMenuUserId(null);
                              }}
                              className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                              <span>Edit User</span>
                            </button>

                            {/* Change Role */}
                            <button
                              onClick={() => handleCycleRole(user)}
                              className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                              <span>Change Role</span>
                            </button>

                            {/* Reset Password */}
                            <button
                              onClick={() => handleResetPassword(user)}
                              className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition cursor-pointer"
                            >
                              <Key className="w-3.5 h-3.5 text-slate-500" />
                              <span>Reset Password</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Add New User */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                Add New User
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 bg-[#0b0f19] border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. john@email.com"
                  className="w-full px-3.5 py-2.5 bg-[#0b0f19] border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#0b0f19] border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Member">Member</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Status</label>
                  <select
                    value={newUserStatus}
                    onChange={(e) => setNewUserStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#0b0f19] border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Coins</label>
                  <input
                    type="number"
                    value={newUserCoins}
                    onChange={(e) => setNewUserCoins(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#0b0f19] border border-slate-800 rounded-lg text-sm text-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Diamonds</label>
                  <input
                    type="number"
                    value={newUserDiamonds}
                    onChange={(e) => setNewUserDiamonds(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#0b0f19] border border-slate-800 rounded-lg text-sm text-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Avatar Profile</label>
                <div className="flex items-center gap-3">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
                  ].map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewUserAvatar(url)}
                      className={`relative rounded-full p-0.5 border-2 transition ${
                        newUserAvatar === url ? 'border-blue-500 ring-2 ring-blue-500/40' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="preset" className="w-10 h-10 rounded-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-600/30"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: View User Details */}
      {showDetailsModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowDetailsModal(null)}
        >
          <div 
            className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">User Profile</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                  {showDetailsModal.code}
                </span>
              </div>
              <button onClick={() => setShowDetailsModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User identity strip */}
            <div className="mt-4 flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-4">
                <img src={showDetailsModal.avatar} alt={showDetailsModal.name} className="w-14 h-14 rounded-full border-2 border-blue-500 object-cover shadow" />
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    {showDetailsModal.name}
                    {showDetailsModal.kycVerified && (
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-bold">
                        VERIFIED
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">{showDetailsModal.email}</p>
                  <div className="mt-1 flex items-center gap-2">
                    {renderRoleBadge(showDetailsModal.role)}
                    {renderStatusBadge(showDetailsModal.status)}
                  </div>
                </div>
              </div>

              {/* Toggle KYC Action */}
              <button
                onClick={handleToggleKyc}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  showDetailsModal.kycVerified 
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25' 
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {showDetailsModal.kycVerified ? 'KYC Verified ✓' : 'Verify KYC'}
              </button>
            </div>

            {/* Wallet Balances & Live adjustment controls */}
            <div className="mt-4 p-4 rounded-xl bg-[#0b0f19] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  Live Wallet Balances
                </span>
                <span className="text-[11px] text-slate-400">Instant credit/debit</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                  <span className="text-[11px] text-slate-400">Total Coins</span>
                  <p className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                    {showDetailsModal.coins.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                  <span className="text-[11px] text-slate-400">Total Diamonds</span>
                  <p className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                    {showDetailsModal.diamonds.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Quick Adjustment Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleAdjustDetailsBalance(5000, 0)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
                >
                  +5,000 Coins
                </button>
                <button
                  onClick={() => handleAdjustDetailsBalance(25000, 0)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
                >
                  +25,000 Coins
                </button>
                <button
                  onClick={() => handleAdjustDetailsBalance(0, 1000)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition"
                >
                  +1,000 Diamonds
                </button>
                <button
                  onClick={() => handleAdjustDetailsBalance(-1000, 0)}
                  className="py-1.5 px-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
                >
                  -1k
                </button>
              </div>
            </div>

            {/* Device & Security telemetry */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[11px] text-slate-400">Device Hardware</span>
                <p className="text-white font-medium mt-0.5">{showDetailsModal.device || 'iOS Device'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[11px] text-slate-400">Phone Contact</span>
                <p className="text-white font-mono mt-0.5">{showDetailsModal.phone || 'N/A'}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => {
                  const target = showDetailsModal;
                  setShowDetailsModal(null);
                  openEditModal(target);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
              >
                Edit Account Details
              </button>

              <button
                onClick={() => setShowDetailsModal(null)}
                className="px-5 py-2 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit User Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowEditModal(null)}
        >
          <div 
            className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-400" />
                Edit User: {showEditModal.code}
              </h3>
              <button onClick={() => setShowEditModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0b0f19] border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0b0f19] border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#0b0f19] border border-slate-800 rounded-lg text-sm text-white"
                  >
                    <option value="Member">Member</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#0b0f19] border border-slate-800 rounded-lg text-sm text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Banned">Banned</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Coins Balance</label>
                  <input
                    type="number"
                    value={editCoins}
                    onChange={(e) => setEditCoins(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#0b0f19] border border-slate-800 rounded-lg text-sm text-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Diamonds Balance</label>
                  <input
                    type="number"
                    value={editDiamonds}
                    onChange={(e) => setEditDiamonds(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#0b0f19] border border-slate-800 rounded-lg text-sm text-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(null)}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Delete User Confirmation */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div 
            className="bg-[#0f172a] border border-rose-500/40 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-white">Delete User Account?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete user <span className="font-bold text-white">{showDeleteConfirm.name}</span> ({showDeleteConfirm.code})? This will wipe their live room seats, wallet balances, and auth credentials.
            </p>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-semibold text-white shadow-lg shadow-red-600/30"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
