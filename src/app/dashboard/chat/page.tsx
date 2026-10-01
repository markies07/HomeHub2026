'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { 
  Send, Search, MessageSquare, User, Phone, 
  Building2, CheckCheck, Paperclip, Sparkles,
  ShieldCheck, ArrowLeft
} from 'lucide-react';

export default function ChatInboxPage() {
  const { chatSessions, getMessagesForChat, sendMessage, markChatAsRead } = useData();
  const { user } = useAuth();

  const [activeChatId, setActiveChatId] = useState<string>(chatSessions[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = chatSessions.find(c => c.id === activeChatId) || chatSessions[0];
  const messages = activeSession ? getMessagesForChat(activeSession.id) : [];

  useEffect(() => {
    if (activeSession) {
      markChatAsRead(activeSession.id, 'super_admin');
    }
  }, [activeSession?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, activeChatId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeSession) return;

    sendMessage(
      activeSession.id,
      activeSession.house_no,
      user?.uid || 'superadmin-1',
      user?.fullname || 'Property Owner (HomeHub)',
      'super_admin',
      inputText.trim()
    );

    setInputText('');
  };

  const filteredSessions = chatSessions.filter(c =>
    c.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.house_no.toString().includes(searchQuery)
  );

  return (
    <div className="h-[calc(100vh-10rem)] min-h-[550px] flex rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-sm">
      
      {/* LEFT COLUMN: Channels / Tenant List */}
      <div className="w-full sm:w-80 border-r border-slate-200/80 flex flex-col shrink-0 bg-white">
        
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Resident Messages</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Real-Time
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tenant or unit #..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredSessions.map(session => {
            const isActive = session.id === activeSession?.id;
            return (
              <button
                key={session.id}
                onClick={() => setActiveChatId(session.id)}
                className={`w-full text-left p-4 transition-all flex items-start gap-3 cursor-pointer ${
                  isActive ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200/80 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                  <img src="/icons/tenant.png" alt="" className="w-full h-full object-contain" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-xs truncate ${isActive ? 'font-black text-slate-900' : 'font-bold text-slate-800'}`}>
                      {session.tenantName}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 shrink-0">
                      Unit {session.house_no}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{session.lastMessage}</p>
                </div>

                {session.ownerUnreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                    {session.ownerUnreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* RIGHT COLUMN: Active Chat Room */}
      {activeSession ? (
        <div className="hidden sm:flex flex-1 flex-col bg-slate-50/50">
          
          {/* Thread Header */}
          <div className="p-4 px-6 border-b border-slate-200/80 bg-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200/80 p-1.5 flex items-center justify-center shadow-xs">
                <img src="/icons/tenant.png" alt="" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>{activeSession.tenantName}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Unit {activeSession.house_no} Resident
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Verified Resident Channel · Zero Cost Real-Time</span>
                </p>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map(msg => {
              const isOwner = msg.senderRole === 'super_admin' || msg.senderRole === 'admin';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] font-semibold text-slate-400">
                      {isOwner ? 'HomeHub Management' : msg.senderName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isOwner
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-tr-xs shadow-sm'
                        : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {isOwner && (
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-semibold px-1">
                      <CheckCheck className="w-3 h-3" />
                      <span>Sent</span>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-200/80 bg-white flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Message ${activeSession.tenantName} (Unit ${activeSession.house_no})...`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <Button
              type="submit"
              variant="primary"
              rightIcon={<Send className="w-4 h-4" />}
              className="py-2.5 px-5 shadow-sm"
            >
              Send
            </Button>
          </form>

        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
          Select a resident conversation from the list
        </div>
      )}

    </div>
  );
}
