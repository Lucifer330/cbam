import React, { useState } from 'react';
import { ShieldCheck, Lock, Binary, CheckCircle2 } from 'lucide-react';

interface Merkle3DCubeProps {
  size?: number; // size in px
  onClick?: () => void;
}

export const Merkle3DCube: React.FC<Merkle3DCubeProps> = ({ size = 70, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const halfSize = size / 2;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative cursor-pointer select-none group"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        perspective: '600px',
      }}
      title="Click to inspect 3D Merkle Ledger Block"
    >
      {/* 3D Rotating Cube Container */}
      <div
        className={`w-full h-full preserve-3d transition-transform ${
          isHovered ? 'scale-110' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? 'rotateX(-15deg) rotateY(45deg)'
            : undefined,
          animation: isHovered ? 'none' : 'spin-slow-3d 14s linear infinite',
        }}
      >
        {/* Face 1: Front (CBAM Shield) */}
        <div
          className="absolute inset-0 rounded-[6px] bg-[#0c1a14]/90 border border-[#10b981] flex flex-col items-center justify-center p-1.5 shadow-[inset_0_0_12px_rgba(16,185,129,0.3)] backdrop-blur-md"
          style={{ transform: `translateZ(${halfSize}px)` }}
        >
          <ShieldCheck className="w-5 h-5 text-[#34d399]" />
          <span className="text-[8px] font-mono font-bold text-white mt-0.5">CBAM</span>
          <span className="text-[7px] font-mono text-[#a7f3d0]">SHA-256</span>
        </div>

        {/* Face 2: Back (Lock v2026.1) */}
        <div
          className="absolute inset-0 rounded-[6px] bg-[#0d1522]/90 border border-[#38bdf8] flex flex-col items-center justify-center p-1.5 shadow-[inset_0_0_12px_rgba(56,189,248,0.3)] backdrop-blur-md"
          style={{ transform: `rotateY(180deg) translateZ(${halfSize}px)` }}
        >
          <Lock className="w-4 h-4 text-[#38bdf8]" />
          <span className="text-[7px] font-mono text-[#bae6fd] font-bold">LOCKED</span>
          <span className="text-[6px] font-mono text-[#94a3b8]">v2026.1</span>
        </div>

        {/* Face 3: Right (Merkle Ledger) */}
        <div
          className="absolute inset-0 rounded-[6px] bg-[#1a1325]/90 border border-[#a855f7] flex flex-col items-center justify-center p-1.5 shadow-[inset_0_0_12px_rgba(168,85,247,0.3)] backdrop-blur-md"
          style={{ transform: `rotateY(90deg) translateZ(${halfSize}px)` }}
        >
          <Binary className="w-4 h-4 text-[#c084fc]" />
          <span className="text-[7px] font-mono text-white font-bold">MERKLE</span>
          <span className="text-[6px] font-mono text-[#d8b4fe]">PROVENANCE</span>
        </div>

        {/* Face 4: Left (Audit Sign-off) */}
        <div
          className="absolute inset-0 rounded-[6px] bg-[#1c1911]/90 border border-[#f59e0b] flex flex-col items-center justify-center p-1.5 shadow-[inset_0_0_12px_rgba(245,158,11,0.3)] backdrop-blur-md"
          style={{ transform: `rotateY(-90deg) translateZ(${halfSize}px)` }}
        >
          <CheckCircle2 className="w-4 h-4 text-[#fbbf24]" />
          <span className="text-[7px] font-mono text-white font-bold">AUDIT</span>
          <span className="text-[6px] font-mono text-[#fde68a]">OFFICER</span>
        </div>

        {/* Face 5: Top (EU Regulation) */}
        <div
          className="absolute inset-0 rounded-[6px] bg-[#091817]/90 border border-[#10b981] flex flex-col items-center justify-center p-1 shadow-[inset_0_0_12px_rgba(16,185,129,0.3)] backdrop-blur-md"
          style={{ transform: `rotateX(90deg) translateZ(${halfSize}px)` }}
        >
          <span className="text-[7px] font-mono font-bold text-[#34d399]">EU 2023</span>
          <span className="text-[6px] font-mono text-white">REGULATION</span>
        </div>

        {/* Face 6: Bottom (Deterministic) */}
        <div
          className="absolute inset-0 rounded-[6px] bg-[#0c1219]/90 border border-[#334155] flex flex-col items-center justify-center p-1 shadow-[inset_0_0_12px_rgba(0,0,0,0.5)] backdrop-blur-md"
          style={{ transform: `rotateX(-90deg) translateZ(${halfSize}px)` }}
        >
          <span className="text-[7px] font-mono font-bold text-[#94a3b8]">DETERMINISTIC</span>
        </div>
      </div>
    </div>
  );
};
