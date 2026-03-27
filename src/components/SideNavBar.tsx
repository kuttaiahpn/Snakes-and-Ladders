import React, { useState } from 'react';

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  isAI?: boolean;
}

interface SideNavBarProps {
  messages: ChatMessage[];
  hasNewMessage?: boolean;
}

export default function SideNavBar({ messages, hasNewMessage }: SideNavBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button — Bottom Left to avoid UI overlap */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-50 p-2 rounded-xl transition-all duration-300 shadow-lg ${
          isOpen
            ? 'bottom-20 left-[17rem] md:left-[18.5rem] bg-secondary/20 text-secondary'
            : 'bottom-20 left-4 bg-[#ff51fa]/20 text-[#ff51fa] hover:bg-[#ff51fa]/30'
        }`}
      >
        <span className="material-symbols-outlined text-xl">
          {isOpen ? 'close' : 'chat_bubble'}
        </span>
        {!isOpen && hasNewMessage && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
          </span>
        )}
      </button>

      {/* Sidebar panel — slides from Left now to keep toggle consistent */}
      <aside className={`fixed right-0 top-0 h-full z-40 flex flex-col bg-[#0d0d16]/95 backdrop-blur-2xl w-[16rem] md:w-72 border-l border-[#ff51fa]/20 shadow-[-10px_0_30px_rgba(255,81,250,0.05)] transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="pt-20 px-4 md:px-6 pb-6 flex-grow flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-headline text-base font-bold flex items-center gap-2 text-[#ff51fa]">
                Chat Zone
              </h2>
              <p className="font-label text-[9px] text-[#f2effb]/40 uppercase tracking-widest">Signal: 100%</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="md:hidden text-[#ff51fa]">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto space-y-3 pr-1 mb-4 flex flex-col justify-end scrollbar-hide">
            {messages.length === 0 && (
              <div className="text-center text-[10px] text-on-surface-variant/30 uppercase tracking-widest py-4">
                No transmissions yet...
              </div>
            )}
            {messages.map((msg) => {
              const isMe = msg.sender === 'YOU';
              const isAI = msg.isAI || msg.sender.includes('AI');

              return (
                <div key={msg.id} className={`flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className={`text-[8px] font-bold uppercase ${isMe ? 'text-secondary mr-1' : isAI ? 'text-error ml-1' : 'text-primary ml-1'}`}>
                    {msg.sender}
                  </span>
                  <div className={`px-2.5 py-1.5 rounded-xl text-[11px] max-w-[90%] ${
                    isMe
                      ? 'bg-secondary/10 rounded-tr-none border-r-2 border-secondary text-secondary-dim'
                      : isAI
                        ? 'bg-error/10 rounded-tl-none border-l-2 border-error text-error-container font-semibold drop-shadow-[0_0_5px_rgba(255,113,108,0.5)]'
                        : 'bg-surface-container-high rounded-tl-none border-l-2 border-primary text-on-surface-variant'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Quick Actions */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-1 py-2 rounded-xl bg-surface-container-highest border border-error/20 hover:border-error/50 transition-all active:scale-95">
                <span className="text-xs font-bold font-label uppercase text-error">🔥 Stinker</span>
              </button>
              <button className="flex items-center justify-center gap-1 py-2 rounded-xl bg-surface-container-highest border border-primary/20 hover:border-primary/50 transition-all active:scale-95">
                <span className="text-xs font-bold font-label uppercase text-primary">🙌 Props</span>
              </button>
            </div>
            <div className="relative">
              <input className="w-full bg-surface-container-lowest border border-[#ff51fa]/20 rounded-xl py-2.5 px-3 text-[11px] font-label text-secondary placeholder:text-secondary/30 focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="ENCRYPTED_SEND" type="text" />
              <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary">
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
