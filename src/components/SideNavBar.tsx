import React from 'react';

export default function SideNavBar() {
  return (
    <aside className="fixed right-0 top-0 h-full z-40 flex flex-col bg-[#0d0d16]/90 backdrop-blur-2xl w-80 border-l border-[#ff51fa]/20 shadow-[-10px_0_30px_rgba(255,81,250,0.05)] transform transition-transform duration-300">
      <div className="pt-20 px-6 pb-6 flex-grow flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-headline text-lg font-bold text-[#ff51fa]">COMMS_LINK</h2>
            <p className="font-label text-[10px] text-[#f2effb]/40 uppercase tracking-widest">Signal Strength: 100%</p>
          </div>
          <button className="text-[#ff51fa] hover:bg-secondary/10 p-2 rounded-lg transition-colors">
            <span className="material-symbols-outlined">dock_to_right</span>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-grow overflow-y-auto space-y-4 pr-2 mb-6">
          {/* Message 1 */}
          <div className="flex flex-col gap-1 items-start">
            <span className="text-[9px] font-bold text-primary ml-1 uppercase">Moxie_R</span>
            <div className="bg-surface-container-high px-3 py-2 rounded-xl rounded-tl-none border-l-2 border-primary text-xs text-on-surface-variant">
              Heading for that Energy Beam at 65! 🚀
            </div>
          </div>
          
          {/* Message 2 */}
          <div className="flex flex-col gap-1 items-end">
            <span className="text-[9px] font-bold text-secondary mr-1 uppercase">YOU</span>
            <div className="bg-secondary/10 px-3 py-2 rounded-xl rounded-tr-none border-r-2 border-secondary text-xs text-secondary-dim">
              Not if I hit the Gravity Well first... 💀
            </div>
          </div>

          {/* Message 3 */}
          <div className="flex flex-col gap-1 items-start">
            <span className="text-[9px] font-bold text-on-surface-variant ml-1 uppercase">Neon_Soul</span>
            <div className="bg-surface-container-high px-3 py-2 rounded-xl rounded-tl-none border-l-2 border-outline text-xs text-on-surface-variant">
              Luck Meter is critical. Need a 6.
            </div>
          </div>

          {/* Message 4 */}
          <div className="flex flex-col gap-1 items-start">
            <span className="text-[9px] font-bold text-primary ml-1 uppercase">Vapor_01</span>
            <div className="bg-surface-container-high px-3 py-2 rounded-xl rounded-tl-none border-l-2 border-primary text-xs text-on-surface-variant">
              Calculated moves only.
            </div>
          </div>
        </div>

        {/* Footer Quick Actions */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container-highest border border-error/20 hover:border-error/50 transition-all active:scale-95">
              <span className="text-sm font-bold font-label uppercase text-error">🔥 Stinker</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container-highest border border-primary/20 hover:border-primary/50 transition-all active:scale-95">
              <span className="text-sm font-bold font-label uppercase text-primary">🙌 Props</span>
            </button>
          </div>
          <div className="relative">
            <input className="w-full bg-surface-container-lowest border border-[#ff51fa]/20 rounded-xl py-3 px-4 text-xs font-label text-secondary placeholder:text-secondary/30 focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all" placeholder="ENCRYPTED_SEND" type="text" />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary">
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
