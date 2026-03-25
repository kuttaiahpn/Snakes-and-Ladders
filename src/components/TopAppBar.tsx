import React from 'react';

export default function TopAppBar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#0d0d16]/80 backdrop-blur-xl border-b border-[#96f8ff]/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-black text-[#96f8ff] drop-shadow-[0_0_10px_rgba(150,248,255,0.5)] font-['Space_Grotesk'] tracking-tight uppercase">SNAKES & LADDERS</span>
      </div>

      {/* Top Bar Leaderboard Integration */}
      <div className="hidden lg:flex items-center gap-6 px-4 py-1 glass-panel rounded-full border border-primary/20">
        {/* Player 1 (Active) */}
        <div className="flex items-center gap-3 px-3 py-1 border-r border-outline-variant/30">
          <div className="relative w-8 h-8 rounded-full border-2 border-primary neon-glow-primary overflow-hidden">
            <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxCiLh-hMq9fmX0fKdhiPqILokcEKtcUXMT_WhGogzegehbZplz1o-j3r7sb2MVp5HFTw0AS0howSzTU4p3uosaR-Om2SLuNntabvFB0EcYS1ZTR5edG9waa0AoxR_NJg5HGajK1JVaDGE2mgijrihsGJvEAuzfBGRUAEwdtZmoSN_WHVSjMSfs0fLwaWYEAFn_2AjjlwxS3uFgqd1GtWLqwbYBYOqZ0TTO4yjitjWN_rzxGoAtQo72CP_Gh3S4648m8qilZLJw5I" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold font-label uppercase text-primary">Vapor_01</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-on-background">42</span>
              <div className="w-[50px] h-1 bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-secondary to-primary" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Player 2 */}
        <div className="flex items-center gap-3 px-3 py-1 border-r border-outline-variant/30">
          <div className="relative w-8 h-8 rounded-full border-2 border-outline-variant overflow-hidden">
            <img alt="User" className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjjlqM4pNc7hj1gttu4dmGpIT_v5DSLAfRnp72zY4LXvYSO1Y0YmBODw0aQgvXmLOK-LrxRT2-NBvYOlkgXpd6V5mCz_UpKfOiq2i06FpzWHXhMAI-vUrN-cVFjH2q1p4-NboFpElxuFkXmvw9H8vFPnuXzV5lzgrHjtC1mERyr2dT-6nnHPmBaoWhdkk35DWhAptqNHo8OF7ITdEUrYpV1XO1WBPc_96MNbqP6M0ZqXlornbsVoIRUUAgbQdXgDKdlz2gzG6-4J8" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold font-label uppercase text-on-surface-variant">Neon_Soul</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-on-surface-variant">28</span>
              <div className="w-[50px] h-1 bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-secondary to-primary" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Player 3 */}
        <div className="flex items-center gap-3 px-3 py-1 border-r border-outline-variant/30">
          <div className="relative w-8 h-8 rounded-full border-2 border-outline-variant overflow-hidden">
            <img alt="User" className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1ljG13B6ysMft7G0U3Gb-VI4BZPDt7pTyG8iyNYqoM4RR0VD6xCvxdjZaDiyG2aeeRvOYC-pxORb81J64NltiqSXeR0mqeIunm2pPZoGSjTD2aJ8rdpRt3tAsBPccMaNIfP73O4Cmi9SgK2ILqBoXyZf48g5YojEB5Hye8KmM6bwH7-w4JJN1qXor0HiVAl7lNXC7f8Yw83DBXkzOL_QmP2fh1Y-qf8J-WmR9B_ZnmGDrLl-4BcBd8A4aQh0z7Qb6T6XlyVBGX64" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold font-label uppercase text-on-surface-variant">D_Glich</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-on-surface-variant">15</span>
              <div className="w-[50px] h-1 bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-secondary to-primary" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Player 4 */}
        <div className="flex items-center gap-3 px-3 py-1 border-r border-outline-variant/30">
          <div className="relative w-8 h-8 rounded-full border-2 border-outline-variant overflow-hidden">
            <img alt="User" className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDtdaWK8F0615sQMxP3VnFH7PqX8hfukTQNdFqCfI0mUAGilcNj76KgNop22uZqfNRn-jH46-xw39aZePvhuT64kc6lEWxlEaiTMdm6hgncgEyNaf-lSk5NFIcN9_SVUBD4idtu1DnxHfPQhsKLEWgqr25gU_pO3wc2uuGkwJBI044jn9sTK2wkbTS1iYD6ic1-rFv9O1Z9BosmanRyMwtbTVeYvjFUxNizCfFZ83xjUq4s697-1ctZJJ-jxHUzr1xDcyMC3DZ5pc" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold font-label uppercase text-on-surface-variant">Moxie_R</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-on-surface-variant">67</span>
              <div className="w-[50px] h-1 bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-secondary to-primary" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Player 5 */}
        <div className="flex items-center gap-3 px-3 py-1">
          <div className="relative w-8 h-8 rounded-full border-2 border-outline-variant overflow-hidden">
            <img alt="User" className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaO49JdGQOyJUExXjFqpC_XEXBnOkttIg1dd5Jx1iwbcjcfLOWCX4ftI5xWfFsVQgVr6iF4_9HQvlFoMlRcP2oWQoBrj7YS4DxAteITqkb9lGG7se1Z6w_xa_FHPEblRfGMhKotcd-bImO-mOcdF16LcHd5dgByXLfbj5twZ_ch1VlBs9S7iUhxEDjQflhlTmfdk_YYRm1zvtJlGgWUpi-JhdCoBYMr0vb7ud48bnsKfyqr3GTGGXqzQt-gLtnicXs6rlw0Mkyn10" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold font-label uppercase text-on-surface-variant">Zero_K</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-on-surface-variant">04</span>
              <div className="w-[50px] h-1 bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-secondary to-primary" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-[#f2effb]/60 hover:text-[#96f8ff] hover:bg-[#96f8ff]/5 transition-all p-2 rounded-lg">
          <span className="material-symbols-outlined">leaderboard</span>
        </button>
        <button className="text-[#f2effb]/60 hover:text-[#96f8ff] hover:bg-[#96f8ff]/5 transition-all p-2 rounded-lg">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="w-10 h-10 rounded-full border-2 border-[#96f8ff]/40 overflow-hidden cursor-pointer active:scale-95 duration-200">
          <img alt="User Power Core" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyYmnBaNe-nfYBnas5r-w-VkX9qXIkBaax_lPTl1-h5Oj4Spm7ZCW1yTt_XjwsIPzhvuNDv7akNwxATD9jO-osCzfq6YZFGHlJ61yYXy2byXFdw7QN8SHAFdpsxYYlS_2FH0z93fAwgdGDg_9e_yf_97d4CX-LTGwYhk0RjbSVv5PMxsRr7W0IccPJYHO5_v6XlZIwfNssRAQDJ1R58G-nUPCpEK_Y2DUFo1Ah1MhN2O_WntEDtso_eTRztzpGb2dBoNtlDXyTnws" />
        </div>
      </div>
    </header>
  );
}
