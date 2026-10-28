import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Network, 
  X, 
  ChevronRight,
  Info,
  CheckCircle2,
  Lock,
  Unlock,
  Sliders,
  Check,
  UserCheck
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  avatar: string;
  staffId: string; // e.g. ID: 1001
  username: string;
  assignedRole: 'Admin' | 'S-VIP' | 'Moderator' | 'Support';
  permissions: string[];
}

interface SuperAdminStaffManagementProps {
  onNavigateToDashboard?: () => void;
}

const ALL_SYSTEM_PERMISSIONS = [
  'User Ban/Unban',
  'Room Force Close',
  'Financial Ledger View',
  'Gift Creation & Pricing',
  'Role Assignment',
  'LiveKit SFU Node Control',
  'Mic Mute & Kick Seat',
  'Chat Warning & Moderation',
  'Ticket Resolution Helpdesk',
  'Device Verification & Logs'
];

export const SuperAdminStaffManagement: React.FC<SuperAdminStaffManagementProps> = ({
  onNavigateToDashboard
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredTooltipId, setHoveredTooltipId] = useState<string | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Realistic operations team for Mizo Live
  const [staffList, setStaffList] = useState<StaffMember[]>([
    // Page 1
    {
      id: 's1',
      name: 'Kamal Al-Din',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-101',
      username: 'kamal.admin',
      assignedRole: 'Admin',
      permissions: ['User Ban/Unban', 'Room Force Close', 'Financial Ledger View', 'Gift Creation & Pricing', 'Role Assignment']
    },
    {
      id: 's2',
      name: 'Zeina Al-Harbi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-102',
      username: 'zeina.svip',
      assignedRole: 'S-VIP',
      permissions: ['Super VIP Lounge Access', 'Global Gift Broadcast', 'Role Assignment']
    },
    {
      id: 's3',
      name: 'Tariq Al-Badr',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-103',
      username: 'tariq.mod',
      assignedRole: 'Moderator',
      permissions: ['Mic Mute & Kick Seat', 'Chat Warning & Moderation', 'Report Review']
    },
    {
      id: 's4',
      name: 'Nour El-Sherif',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-104',
      username: 'nour.support',
      assignedRole: 'Support',
      permissions: ['Ticket Resolution Helpdesk', 'Device Verification & Logs', 'Wallet Balance Check']
    },
    {
      id: 's5',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-105',
      username: 'marcus.tech',
      assignedRole: 'Admin',
      permissions: ['LiveKit SFU Node Control', 'Financial Ledger View', 'User Ban/Unban', 'Room Force Close']
    },
    {
      id: 's6',
      name: 'Lina Al-Qasim',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-106',
      username: 'lina.help',
      assignedRole: 'Support',
      permissions: ['Ticket Resolution Helpdesk', 'User Unblock Helpdesk']
    },
    // Page 2
    {
      id: 's7',
      name: 'Sami Al-Khaled',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-107',
      username: 'sami.k',
      assignedRole: 'Moderator',
      permissions: ['Mic Mute & Kick Seat', 'Chat Warning & Moderation']
    },
    {
      id: 's8',
      name: 'Layla Haddad',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-108',
      username: 'layla.h',
      assignedRole: 'Admin',
      permissions: ['Financial Ledger View', 'Gift Creation & Pricing', 'User Ban/Unban']
    },
    {
      id: 's9',
      name: 'Fahad Al-Otaibi',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-109',
      username: 'fahad.vip',
      assignedRole: 'S-VIP',
      permissions: ['Super VIP Lounge Access', 'Global Gift Broadcast']
    },
    {
      id: 's10',
      name: 'Amina Mansour',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-110',
      username: 'amina.care',
      assignedRole: 'Support',
      permissions: ['Ticket Resolution Helpdesk', 'Device Verification & Logs']
    },
    {
      id: 's11',
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-111',
      username: 'david.c',
      assignedRole: 'Moderator',
      permissions: ['Mic Mute & Kick Seat', 'Room Force Close']
    },
    {
      id: 's12',
      name: 'Maya Al-Zahrani',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-112',
      username: 'maya.z',
      assignedRole: 'Support',
      permissions: ['Ticket Resolution Helpdesk']
    },
    // Page 3
    {
      id: 's13',
      name: 'Omar Farooq',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-113',
      username: 'omar.infra',
      assignedRole: 'Admin',
      permissions: ['LiveKit SFU Node Control', 'Role Assignment', 'Financial Ledger View']
    },
    {
      id: 's14',
      name: 'Yara Salameh',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-114',
      username: 'yara.s',
      assignedRole: 'Moderator',
      permissions: ['Mic Mute & Kick Seat', 'Chat Warning & Moderation']
    },
    {
      id: 's15',
      name: 'Hassan Al-Tamimi',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-115',
      username: 'hassan.t',
      assignedRole: 'S-VIP',
      permissions: ['Super VIP Lounge Access']
    },
    {
      id: 's16',
      name: 'Sophie Laurent',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-116',
      username: 'sophie.intl',
      assignedRole: 'Support',
      permissions: ['Ticket Resolution Helpdesk', 'Device Verification & Logs']
    },
    {
      id: 's17',
      name: 'Rashed Al-Ghamdi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-117',
      username: 'rashed.g',
      assignedRole: 'Moderator',
      permissions: ['Mic Mute & Kick Seat']
    },
    {
      id: 's18',
      name: 'Ziad Al-Qudsi',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      staffId: 'ID: MZ-118',
      username: 'ziad.ops',
      assignedRole: 'Admin',
      permissions: ['User Ban/Unban', 'Room Force Close', 'Financial Ledger View']
    }
  ]);

  // Modal states
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [permissionsStaff, setPermissionsStaff] = useState<StaffMember | null>(null);
  const [activePermissionsList, setActivePermissionsList] = useState<string[]>([]);
  const [deleteConfirmStaff, setDeleteConfirmStaff] = useState<StaffMember | null>(null);

  // New staff form state
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffUsername, setNewStaffUsername] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'Admin' | 'S-VIP' | 'Moderator' | 'Support'>('Support');
  const [newStaffPermissions, setNewStaffPermissions] = useState<string[]>([
    'Mic Mute & Kick Seat',
    'Chat Warning & Moderation'
  ]);

  // Filter staff by search query
  const filteredStaff = staffList.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.staffId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic (6 per page matching Image 3)
  const pageSize = 6;
  const totalPages = Math.ceil(filteredStaff.length / pageSize) || 1;
  const paginatedStaff = filteredStaff.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDeleteStaff = (staff: StaffMember) => {
    setStaffList(prev => prev.filter(s => s.id !== staff.id));
    setDeleteConfirmStaff(null);
    showToast(`Staff member ${staff.name} deleted.`);
  };

  const handleSaveRole = (newRole: 'Admin' | 'S-VIP' | 'Moderator' | 'Support') => {
    if (!editingStaff) return;
    setStaffList(prev => prev.map(s => s.id === editingStaff.id ? { ...s, assignedRole: newRole } : s));
    showToast(`Role for ${editingStaff.name} updated to ${newRole}.`);
    setEditingStaff(null);
  };

  // Open permissions editor
  const openPermissionsModal = (staff: StaffMember) => {
    setPermissionsStaff(staff);
    setActivePermissionsList([...staff.permissions]);
  };

  // Toggle single permission inside modal
  const togglePermission = (perm: string) => {
    setActivePermissionsList(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  // Save permissions
  const handleSavePermissions = () => {
    if (!permissionsStaff) return;
    setStaffList(prev => prev.map(s => s.id === permissionsStaff.id ? { ...s, permissions: activePermissionsList } : s));
    showToast(`Updated ${activePermissionsList.length} permissions for ${permissionsStaff.name}.`);
    setPermissionsStaff(null);
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffUsername.trim()) return;
    const newStaff: StaffMember = {
      id: `s_${Date.now()}`,
      name: newStaffName.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      staffId: `ID: ${1000 + staffList.length + 1}`,
      username: newStaffUsername.trim().toLowerCase(),
      assignedRole: newStaffRole,
      permissions: newStaffPermissions
    };
    setStaffList(prev => [newStaff, ...prev]);
    setShowAddStaffModal(false);
    setNewStaffName('');
    setNewStaffUsername('');
    showToast(`Staff member ${newStaff.name} (${newStaff.staffId}) created.`);
  };

  // Role Pill styling matching Image 3
  const renderRolePill = (role: StaffMember['assignedRole']) => {
    switch (role) {
      case 'Admin':
        return (
          <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            Admin
          </span>
        );
      case 'S-VIP':
        return (
          <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            S-VIP
          </span>
        );
      case 'Moderator':
        return (
          <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Moderator
          </span>
        );
      case 'Support':
        return (
          <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-300 border border-slate-500/30">
            Support
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans pb-12 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0f172a] border border-cyan-500/50 shadow-2xl text-xs font-semibold text-white animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Breadcrumbs (Image 3 Parity) */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <button 
          onClick={onNavigateToDashboard}
          className="hover:text-cyan-400 transition cursor-pointer"
        >
          Dashboard
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span>Team</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-semibold">Staff Management</span>
      </div>

      {/* 2. Title, Counter Badge & Add Button (Image 3 Parity) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-white">Staff Management</h2>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700">
            42 Staff Members
          </span>
        </div>

        <button
          onClick={() => setShowAddStaffModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Staff Member</span>
        </button>
      </div>

      {/* 3. Search Bar (Image 3 Parity) */}
      <div className="relative w-full max-w-lg">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search staff by name, ID or username..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2.5 bg-[#0f172a] border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 4. Staff Management Table (Image 3 Parity) */}
      <div className="rounded-xl border border-slate-800 bg-[#0e1424] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#12192c] text-xs uppercase font-semibold text-slate-400 border-b border-slate-800 tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4">NAME</th>
                <th scope="col" className="px-6 py-4">STAFF ID</th>
                <th scope="col" className="px-6 py-4">USERNAME</th>
                <th scope="col" className="px-6 py-4">ASSIGNED ROLE</th>
                <th scope="col" className="px-6 py-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {paginatedStaff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 text-sm">
                    No staff found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                paginatedStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-800/30 transition-colors">
                    
                    {/* Name + Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={staff.avatar} 
                          alt={staff.name} 
                          className="w-9 h-9 rounded-full object-cover border border-slate-700 shadow-sm"
                        />
                        <span className="font-semibold text-white">{staff.name}</span>
                      </div>
                    </td>

                    {/* Staff ID */}
                    <td className="px-6 py-4 font-mono text-xs text-slate-400 font-medium">
                      {staff.staffId}
                    </td>

                    {/* Username */}
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">
                      {staff.username}
                    </td>

                    {/* Assigned Role */}
                    <td className="px-6 py-4">
                      {renderRolePill(staff.assignedRole)}
                    </td>

                    {/* Actions (Image 3 Parity) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Role Button */}
                        <button
                          onClick={() => setEditingStaff(staff)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-xs font-medium text-slate-200 transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                          <span>Edit Role</span>
                        </button>

                        {/* Permissions Button with Tooltip (Image 3 Parity) */}
                        <div className="relative">
                          <button
                            onClick={() => openPermissionsModal(staff)}
                            onMouseEnter={() => setHoveredTooltipId(staff.id)}
                            onMouseLeave={() => setHoveredTooltipId(null)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-xs font-medium text-slate-200 transition cursor-pointer"
                          >
                            <Network className="w-3.5 h-3.5 text-slate-400" />
                            <span>Permissions</span>
                          </button>

                          {/* Tooltip on hover (Image 3 Exact Parity) */}
                          {hoveredTooltipId === staff.id && (
                            <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2.5 py-1 bg-black text-white text-[11px] font-medium rounded-md whitespace-nowrap shadow-xl border border-slate-700 z-50 pointer-events-none animate-in fade-in">
                              Tooltips Permissions
                            </div>
                          )}
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteConfirmStaff(staff)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-rose-950/40 hover:border-rose-800 text-xs font-medium text-rose-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination (Image 3 Parity) */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800/80 bg-[#0e1424]">
          <span className="text-xs text-slate-400">
            Showing page <span className="font-semibold text-white">{currentPage}</span> of {totalPages} ({filteredStaff.length} total)
          </span>

          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
            >
              Prev
            </button>
            
            {[1, 2, 3].slice(0, totalPages).map((p) => (
              <button 
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentPage === p ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}

            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* MODAL 1: Edit Role */}
      {editingStaff && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setEditingStaff(null)}
        >
          <div 
            className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Role for {editingStaff.name}</h3>
              <button onClick={() => setEditingStaff(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-3 mb-4">
              Select the administrative level and privileges for this team member:
            </p>

            <div className="space-y-2">
              {(['Admin', 'S-VIP', 'Moderator', 'Support'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => handleSaveRole(r)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-semibold transition cursor-pointer ${
                    editingStaff.assignedRole === r 
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-md' 
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {renderRolePill(r)}
                    <span className="text-slate-300 font-normal text-[11px]">
                      {r === 'Admin' ? 'Root control' : r === 'S-VIP' ? 'VIP VIP lounge manager' : r === 'Moderator' ? 'Stage voice control' : 'Helpdesk & tickets'}
                    </span>
                  </div>
                  {editingStaff.assignedRole === r && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                </button>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setEditingStaff(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Interactive Permissions Editor */}
      {permissionsStaff && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPermissionsStaff(null)}
        >
          <div 
            className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Staff Permissions
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{permissionsStaff.name} ({permissionsStaff.staffId})</p>
              </div>
              <button onClick={() => setPermissionsStaff(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto space-y-2 pr-1">
              {ALL_SYSTEM_PERMISSIONS.map((perm) => {
                const isEnabled = activePermissionsList.includes(perm);
                return (
                  <div 
                    key={perm}
                    onClick={() => togglePermission(perm)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
                      isEnabled 
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-white' 
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className={`w-4 h-4 ${isEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="font-medium">{perm}</span>
                    </div>

                    {/* Interactive Switch */}
                    <div className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${
                      isEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                        isEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-mono">
                {activePermissionsList.length} of {ALL_SYSTEM_PERMISSIONS.length} active
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPermissionsStaff(null)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-600/30"
                >
                  Save Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Add New Staff Member */}
      {showAddStaffModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowAddStaffModal(false)}
        >
          <div 
            className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                Add New Staff Member
              </h3>
              <button onClick={() => setShowAddStaffModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. David Brown"
                  className="w-full px-3.5 py-2.5 bg-[#0b0f19] border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Username *</label>
                <input
                  type="text"
                  value={newStaffUsername}
                  onChange={(e) => setNewStaffUsername(e.target.value)}
                  placeholder="e.g. david.b"
                  className="w-full px-3.5 py-2.5 bg-[#0b0f19] border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Role</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-[#0b0f19] border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Support">Support</option>
                  <option value="Moderator">Moderator</option>
                  <option value="S-VIP">S-VIP</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Initial Permissions</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {ALL_SYSTEM_PERMISSIONS.slice(0, 5).map((perm) => (
                    <label key={perm} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStaffPermissions.includes(perm)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewStaffPermissions([...newStaffPermissions, perm]);
                          } else {
                            setNewStaffPermissions(newStaffPermissions.filter(p => p !== perm));
                          }
                        }}
                        className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
                      />
                      <span>{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-600/30"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Delete Staff Confirmation */}
      {deleteConfirmStaff && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setDeleteConfirmStaff(null)}
        >
          <div 
            className="bg-[#0f172a] border border-rose-500/40 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-white">Delete Staff Member?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Remove <span className="font-bold text-white">{deleteConfirmStaff.name}</span> ({deleteConfirmStaff.staffId}) from the staff team? Their administrative privileges will be immediately revoked.
            </p>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmStaff(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteStaff(deleteConfirmStaff)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-semibold text-white shadow-lg shadow-red-600/30"
              >
                Delete Staff
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
