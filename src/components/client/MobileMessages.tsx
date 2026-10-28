import React, { useState } from 'react';
import { 
  Search, 
  ArrowLeft, 
  Send, 
  CheckCheck, 
  Bell, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare,
  Smile,
  MoreVertical,
  Check
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  roleBadge?: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean;
  messages: ChatMessage[];
}

export const MobileMessages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'c1',
      name: 'Mizo Official Assistant',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
      roleBadge: 'OFFICIAL',
      lastMessage: 'Welcome to Mizo Live! Promo code MIZO-DEMO gives +10,000 Coins.',
      time: 'Just now',
      unreadCount: 1,
      online: true,
      messages: [
        { id: 'm1', sender: 'them', text: 'Welcome to Mizo Live Voice & Party Rooms!', time: '10:00 AM' },
        { id: 'm2', sender: 'them', text: 'Use code MIZO-DEMO in your Profile tab to claim 10,000 free coins.', time: '10:01 AM' }
      ]
    },
    {
      id: 'c2',
      name: 'Reem Al-Fahad',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      roleBadge: 'HOST',
      lastMessage: 'Thank you for supporting our Royal Gulf Majlis room! ✨',
      time: '3m ago',
      unreadCount: 2,
      online: true,
      messages: [
        { id: 'm1', sender: 'them', text: 'Hey Eyad! Amazing energy on the mic today.', time: '11:15 AM' },
        { id: 'm2', sender: 'them', text: 'Thank you for supporting our Royal Gulf Majlis room! ✨', time: '11:18 AM' }
      ]
    },
    {
      id: 'c3',
      name: 'Tariq Al-Mansoor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      roleBadge: 'SVIP',
      lastMessage: 'See you in the evening session brother!',
      time: '1h ago',
      unreadCount: 0,
      online: false,
      messages: [
        { id: 'm1', sender: 'them', text: 'Are you taking the Boss Mic tonight?', time: '09:30 AM' },
        { id: 'm2', sender: 'me', text: 'Yes, around 9:00 PM!', time: '09:32 AM' },
        { id: 'm3', sender: 'them', text: 'See you in the evening session brother!', time: '09:35 AM' }
      ]
    },
    {
      id: 'c4',
      name: 'Agency Support Hub',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
      roleBadge: 'VERIFIED',
      lastMessage: 'Your diamond commission withdrawal was approved.',
      time: '4h ago',
      unreadCount: 0,
      online: true,
      messages: [
        { id: 'm1', sender: 'them', text: 'Your diamond commission withdrawal was approved.', time: '07:20 AM' }
      ]
    }
  ]);

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const activeChat = conversations.find(c => c.id === activeConversationId);

  const openChat = (id: string) => {
    setActiveConversationId(id);
    // Clear unread count on open
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConversationId) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'me',
      text: replyText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConversationId) {
        return {
          ...c,
          lastMessage: newMsg.text,
          time: 'Just now',
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setReplyText('');
  };

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div dir="ltr" className="w-full h-full bg-[#0a0f1d] text-slate-100 flex flex-col font-sans select-none">
      
      {/* View 1: Active Chat Detail */}
      {activeChat ? (
        <div className="flex flex-col h-full">
          {/* Chat Top Header */}
          <div className="px-3.5 py-3 border-b border-slate-800 bg-[#0e1424] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setActiveConversationId(null)}
                className="p-1 hover:bg-slate-800 rounded-full transition text-slate-300"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="relative">
                <img 
                  src={activeChat.avatar} 
                  alt={activeChat.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700" 
                />
                {activeChat.online && (
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0e1424]" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white leading-tight">{activeChat.name}</span>
                  {activeChat.roleBadge && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                      {activeChat.roleBadge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">{activeChat.online ? 'Active now' : 'Offline'}</p>
              </div>
            </div>

            <button className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Bubble Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 text-xs bg-[#070a14]">
            {activeChat.messages.map((m) => (
              <div 
                key={m.id}
                className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[78%] px-3.5 py-2 rounded-2xl ${
                    m.sender === 'me' 
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-medium rounded-tr-none shadow-md' 
                      : 'bg-slate-800/90 text-slate-100 rounded-tl-none border border-slate-700/60 shadow'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                </div>
                <span className="text-[9px] text-slate-500 mt-1 font-mono">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Chat Reply Input Bar */}
          <form 
            onSubmit={handleSendReply}
            className="p-2.5 border-t border-slate-800 bg-[#0e1424] flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Type a message..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-full text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black flex items-center justify-center transition shadow-md shadow-cyan-500/20 shrink-0"
            >
              <Send className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </form>
        </div>
      ) : (
        /* View 2: Conversations List */
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-4 pt-4 pb-2.5 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-[#0c101d]">
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Messages</h2>
              <p className="text-[10px] text-slate-400">Direct chats, system alerts & room invites</p>
            </div>
            
            <button 
              onClick={() => setConversations(prev => prev.map(c => ({ ...c, unreadCount: 0 })))}
              className="text-[10px] font-semibold text-cyan-400 hover:text-cyan-300"
              title="Mark all as read"
            >
              Mark all read
            </button>
          </div>

          {/* Quick Search */}
          <div className="p-3 shrink-0 bg-[#0c101d]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search chats..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Conversation Rows */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
            {filteredConversations.map((c) => (
              <div
                key={c.id}
                onClick={() => openChat(c.id)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/50 cursor-pointer transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img 
                      src={c.avatar} 
                      alt={c.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-sm"
                    />
                    {c.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0c101d]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">{c.name}</span>
                      {c.roleBadge && (
                        <span className="text-[8px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold shrink-0">
                          {c.roleBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                  <span className="text-[10px] text-slate-500 font-mono">{c.time}</span>
                  {c.unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
