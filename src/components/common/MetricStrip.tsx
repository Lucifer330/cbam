import React from 'react';
import { FileText, Clock, CheckCircle2, Calculator, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import { Card3D } from './Card3D';

interface MetricStripProps {
  documentsCount: number;
  awaitingCount: number;
  verifiedCount: number;
  traceableCount: number;
  onMetricClick?: (tab: string) => void;
  onTraceClick?: () => void;
}

export const MetricStrip: React.FC<MetricStripProps> = ({
  documentsCount,
  awaitingCount,
  verifiedCount,
  traceableCount,
  onMetricClick,
  onTraceClick,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 perspective-1000">
      {/* 3D Metric 1: Registered Documents */}
      <Card3D
        onClick={() => onMetricClick && onMetricClick('documents')}
        glowColor="rgba(56, 189, 248, 0.3)"
        className="p-5 rounded-[12px] bg-[#0c131d]/90 border border-[#1e293b] hover:border-[#38bdf8]/60 transition-colors backdrop-blur-md group"
      >
        <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-2 preserve-3d" style={{ transform: 'translateZ(15px)' }}>
          <span className="font-mono text-[11px] font-semibold text-[#94a3b8] tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
            Documents
          </span>
          <div className="w-7 h-7 rounded-[6px] bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] group-hover:scale-110 transition-transform preserve-3d" style={{ transform: 'translateZ(25px)' }}>
            <FileText className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 preserve-3d" style={{ transform: 'translateZ(25px)' }}>
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono drop-shadow-[0_2px_8px_rgba(56,189,248,0.3)]">
            {documentsCount}
          </span>
          <span className="text-[10px] font-mono text-[#38bdf8] bg-[#38bdf8]/10 px-1.5 py-0.5 rounded border border-[#38bdf8]/20">
            EVIDENCE FILES
          </span>
        </div>

        <div className="text-[11px] text-[#64748b] mt-2 flex items-center justify-between border-t border-[#1e293b] pt-2 preserve-3d" style={{ transform: 'translateZ(10px)' }}>
          <span>Invoices & Mill Certs</span>
          <span className="font-mono text-[#94a3b8] text-[10px]">100% SHA-256</span>
        </div>
      </Card3D>

      {/* 3D Metric 2: Awaiting Human Verification */}
      <Card3D
        onClick={() => onMetricClick && onMetricClick('verification')}
        glowColor="rgba(245, 158, 11, 0.35)"
        className="p-5 rounded-[12px] bg-[#0c131d]/90 border border-[#1e293b] hover:border-[#f59e0b]/60 transition-colors backdrop-blur-md group"
      >
        <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-2 preserve-3d" style={{ transform: 'translateZ(15px)' }}>
          <span className="font-mono text-[11px] font-semibold text-[#f59e0b] tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-ping" />
            Human Review Gate
          </span>
          <div className="w-7 h-7 rounded-[6px] bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b] group-hover:scale-110 transition-transform preserve-3d" style={{ transform: 'translateZ(25px)' }}>
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 preserve-3d" style={{ transform: 'translateZ(25px)' }}>
          <span className="text-3xl font-extrabold tracking-tight text-[#f59e0b] font-mono drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)]">
            {awaitingCount}
          </span>
          <span className="text-[10px] font-mono text-[#f59e0b] bg-[#f59e0b]/10 px-1.5 py-0.5 rounded border border-[#f59e0b]/30">
            ACTION NEEDED
          </span>
        </div>

        <div className="text-[11px] text-[#f59e0b]/80 mt-2 flex items-center justify-between border-t border-[#1e293b] pt-2 preserve-3d" style={{ transform: 'translateZ(10px)' }}>
          <span>Officer sign-off required</span>
          <span className="font-mono text-[10px]">Zero AI Auto-Pass</span>
        </div>
      </Card3D>

      {/* 3D Metric 3: Verified Inputs */}
      <Card3D
        onClick={() => onMetricClick && onMetricClick('verification')}
        glowColor="rgba(16, 185, 129, 0.35)"
        className="p-5 rounded-[12px] bg-[#0c131d]/90 border border-[#1e293b] hover:border-[#10b981]/60 transition-colors backdrop-blur-md group"
      >
        <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-2 preserve-3d" style={{ transform: 'translateZ(15px)' }}>
          <span className="font-mono text-[11px] font-semibold text-[#34d399] tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            Verified Inputs
          </span>
          <div className="w-7 h-7 rounded-[6px] bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-[#34d399] group-hover:scale-110 transition-transform preserve-3d" style={{ transform: 'translateZ(25px)' }}>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 preserve-3d" style={{ transform: 'translateZ(25px)' }}>
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
            {verifiedCount}
          </span>
          <span className="text-[10px] font-mono text-[#34d399] bg-[#10b981]/15 px-1.5 py-0.5 rounded border border-[#10b981]/30">
            BOUNDING BOXES
          </span>
        </div>

        <div className="text-[11px] text-[#64748b] mt-2 flex items-center justify-between border-t border-[#1e293b] pt-2 preserve-3d" style={{ transform: 'translateZ(10px)' }}>
          <span>Exact PDF locators</span>
          <span className="font-mono text-[#34d399] text-[10px]">x,y stamped</span>
        </div>
      </Card3D>

      {/* 3D Metric 4: Traceable Results */}
      <Card3D
        onClick={() => {
          if (onTraceClick) onTraceClick();
          else if (onMetricClick) onMetricClick('calculations');
        }}
        glowColor="rgba(168, 85, 247, 0.35)"
        className="p-5 rounded-[12px] bg-[#0c131d]/90 border border-[#1e293b] hover:border-[#a855f7]/60 transition-colors backdrop-blur-md group"
      >
        <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-2 preserve-3d" style={{ transform: 'translateZ(15px)' }}>
          <span className="font-mono text-[11px] font-semibold text-[#c084fc] tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-pulse" />
            Deterministic Results
          </span>
          <div className="w-7 h-7 rounded-[6px] bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center text-[#c084fc] group-hover:scale-110 transition-transform preserve-3d" style={{ transform: 'translateZ(25px)' }}>
            <Calculator className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 preserve-3d" style={{ transform: 'translateZ(25px)' }}>
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono drop-shadow-[0_2px_8px_rgba(168,85,247,0.3)]">
            {traceableCount}
          </span>
          <span className="text-[10px] font-mono text-[#c084fc] bg-[#a855f7]/15 px-2 py-0.5 rounded border border-[#a855f7]/30 flex items-center gap-1">
            <span>Click to Trace</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>

        <div className="text-[11px] text-[#64748b] mt-2 flex items-center justify-between border-t border-[#1e293b] pt-2 preserve-3d" style={{ transform: 'translateZ(10px)' }}>
          <span>Bi-directional audit</span>
          <span className="font-mono text-[#c084fc] text-[10px]">Rule v2026.1</span>
        </div>
      </Card3D>
    </div>
  );
};
