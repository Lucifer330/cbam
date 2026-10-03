import React, { useState } from 'react';
import { ShieldCheck, GitBranch, Binary, Lock, ArrowUpRight, Scale, CheckCircle2 } from 'lucide-react';

interface CBAM3DLogoProps {
  tiltX?: number; // degrees
  tiltY?: number; // degrees
  onTraceClick?: () => void;
}

export const CBAM3DLogo: React.FC<CBAM3DLogoProps> = ({ tiltX = 0, tiltY = 0, onTraceClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Compute specular sheen translation based on tilt
  const sheenX = Math.min(Math.max(-tiltY * 4, -40), 40);
  const sheenY = Math.min(Math.max(tiltX * 4, -40), 40);

  return (
    <div
      className="flex flex-col items-center justify-center text-center select-none preserve-3d py-4 w-full max-w-2xl mx-auto"
      style={{
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: 'transform 0.12s ease-out',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- 3D MULTI-LAYER SHIELD EMBLEM --- */}
      <div 
        className="relative mb-5 preserve-3d cursor-pointer group"
        style={{ transform: 'translateZ(45px)' }}
        onClick={onTraceClick}
      >
        {/* Soft Ambient Radial Backlight on Dark Canvas */}
        <div 
          className="absolute -inset-10 rounded-full blur-2xl pointer-events-none transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.22) 0%, rgba(14, 165, 233, 0.12) 40%, transparent 70%)',
            opacity: isHovered ? 1 : 0.8,
          }}
        />

        {/* 3D Shield Base Geometry with Metallic Bevel */}
        <div 
          className="relative w-28 h-32 md:w-36 md:h-40 rounded-[24px] flex items-center justify-center p-1.5 preserve-3d transition-transform duration-300 group-hover:scale-105"
          style={{
            background: 'linear-gradient(145deg, #475569 0%, #cbd5e1 30%, #1e293b 65%, #0f172a 100%)',
            boxShadow: `
              0 0 0 1px rgba(255, 255, 255, 0.25),
              0 15px 35px -5px rgba(0, 0, 0, 0.8),
              0 25px 45px -10px rgba(16, 185, 129, 0.25),
              inset 0 2px 4px rgba(255, 255, 255, 0.4),
              inset 0 -2px 4px rgba(0, 0, 0, 0.8)
            `,
          }}
        >
          {/* Inner Recessed Carbon/Emerald Core Shield */}
          <div 
            className="w-full h-full rounded-[20px] relative overflow-hidden flex flex-col items-center justify-between p-3.5 border border-[#34d399]/40 shadow-inner preserve-3d"
            style={{
              background: 'linear-gradient(180deg, #0f1f17 0%, #07120c 45%, #020704 100%)',
            }}
          >
            {/* Dynamic Glass Specular Sheen responding to mouse coordinates */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-40 transition-transform duration-75"
              style={{
                background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.2) 55%, transparent 75%)',
                transform: `translateX(${sheenX}%) translateY(${sheenY}%)`,
              }}
            />

            {/* Subtle High-Tech Blueprint Matrix Grid */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
                backgroundSize: '10px 10px'
              }}
            />

            {/* Top EU Regulation Header Badge */}
            <div className="relative z-10 flex items-center justify-center gap-1.5 pt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span className="font-mono text-[9px] md:text-[10px] font-bold text-[#a7f3d0] tracking-widest uppercase">
                EU 2023/956
              </span>
            </div>

            {/* Center: Main 3D Icon & Bold CBAM Monogram */}
            <div 
              className="relative z-10 flex flex-col items-center justify-center my-auto preserve-3d"
              style={{ transform: 'translateZ(20px)' }}
            >
              <div className="relative mb-1">
                <ShieldCheck className="w-12 h-12 md:w-14 md:h-14 text-[#34d399] filter drop-shadow-[0_4px_10px_rgba(52,211,153,0.5)]" />
                <Scale className="w-4 h-4 text-white absolute bottom-1 right-1 opacity-90 drop-shadow-md" />
              </div>
              <div className="font-mono font-black text-xl md:text-2xl text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                CBAM
              </div>
            </div>

            {/* Bottom Hash / Fingerprint Seal */}
            <div className="relative z-10 flex items-center justify-between w-full px-1 border-t border-[#10b981]/25 pt-1.5">
              <span className="text-[8px] font-mono text-[#6ee7b7] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-[#34d399]" />
                AUDIT SEAL
              </span>
              <span className="text-[8px] font-mono text-[#94a3b8]">
                SEC-2026
              </span>
            </div>

            {/* Corner Decorative Micro-Rivets */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#94a3b8]/70 border border-black/40" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#94a3b8]/70 border border-black/40" />
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#94a3b8]/70 border border-black/40" />
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#94a3b8]/70 border border-black/40" />
          </div>

          {/* Floating Metallic Lock Tag */}
          <div 
            className="absolute -bottom-2.5 -right-3 px-2 py-0.5 rounded-[5px] bg-[#090d10] text-[#34d399] border border-[#34d399]/60 font-mono text-[9px] md:text-[10px] font-bold flex items-center gap-1 shadow-xl"
            style={{ transform: 'translateZ(35px)' }}
          >
            <Lock className="w-3 h-3 text-[#34d399]" />
            <span>v2026.1 LOCKED</span>
          </div>
        </div>
      </div>

      {/* --- CRISP 3D TYPOGRAPHY (Clear & High Contrast on Black) --- */}
      <div 
        className="preserve-3d mt-1 px-4"
        style={{ transform: 'translateZ(35px)' }}
      >
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white uppercase font-sans flex items-center justify-center gap-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          <span className="bg-gradient-to-r from-white via-[#f1f5f9] to-[#94a3b8] bg-clip-text text-transparent">
            CBAM-AuditTrace
          </span>
        </h1>
        <p className="text-xs md:text-sm font-medium text-[#94a3b8] mt-1.5 tracking-normal max-w-lg mx-auto leading-relaxed">
          “Trace every CBAM number back to its source.”
        </p>
      </div>

      {/* --- 3D COMPLIANCE BADGES (Ultra-clean, dark glassmorphism) --- */}
      <div 
        className="mt-4 flex flex-wrap items-center justify-center gap-2 px-3 preserve-3d"
        style={{ transform: 'translateZ(25px)' }}
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] bg-[#131c17] border border-[#10b981]/40 text-[11px] font-mono font-medium text-[#a7f3d0] shadow-sm backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          Regulation (EU) 2023/956
        </span>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] bg-[#111822] border border-[#38bdf8]/40 text-[11px] font-mono font-medium text-[#bae6fd] shadow-sm backdrop-blur-md">
          <GitBranch className="w-3.5 h-3.5 text-[#38bdf8]" />
          Deterministic Rule Engine
        </span>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] bg-[#181a20] border border-[#64748b]/40 text-[11px] font-mono font-medium text-[#e2e8f0] shadow-sm backdrop-blur-md">
          <Binary className="w-3.5 h-3.5 text-[#94a3b8]" />
          SHA-256 Merkle Ledger
        </span>
      </div>

      {/* --- INTERACTIVE ACTION BUTTON --- */}
      {onTraceClick && (
        <div 
          className="mt-4 pointer-events-auto"
          style={{ transform: 'translateZ(30px)' }}
        >
          <button
            type="button"
            onClick={onTraceClick}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[5px] bg-[#10b981] hover:bg-[#059669] text-[#022c22] font-semibold text-xs transition-all shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.5)] group active:scale-95"
          >
            <span>Trace Active Emission Result (1,900.00 tCO₂e)</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#022c22] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};
