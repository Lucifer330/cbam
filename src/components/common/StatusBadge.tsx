import type { ComplianceStatus } from '../../types/cbam';
import { CheckCircle2, Clock, AlertTriangle, Archive, ShieldAlert } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplianceStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'Needs verification':
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded-[6px] bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/40 shadow-[0_0_8px_rgba(245,158,11,0.2)] ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 shrink-0 animate-pulse text-[#f59e0b]" />
          Needs verification
        </span>
      );
    case 'Verified':
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded-[6px] bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/40 shadow-[0_0_8px_rgba(16,185,129,0.2)] ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#10b981]" />
          Verified
        </span>
      );
    case 'Calculated':
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded-[6px] bg-[#38bdf8]/15 text-[#7dd3fc] border border-[#38bdf8]/40 shadow-[0_0_8px_rgba(56,189,248,0.2)] ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]" />
          Calculated
        </span>
      );
    case 'Flagged anomaly':
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded-[6px] bg-[#ef4444]/15 text-[#f87171] border border-[#ef4444]/40 shadow-[0_0_8px_rgba(239,68,68,0.2)] ${sizeClasses}`}>
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-[#ef4444]" />
          Flagged anomaly
        </span>
      );
    case 'Archived':
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded-[6px] bg-[#334155]/20 text-[#94a3b8] border border-[#334155] ${sizeClasses}`}>
          <Archive className="w-3.5 h-3.5 shrink-0" />
          Archived
        </span>
      );
    default:
      return null;
  }
};

export const VerificationStateBadge: React.FC<{
  status: 'ai_proposed' | 'human_confirmed' | 'edited' | 'rejected';
  verifiedBy?: string;
}> = ({ status, verifiedBy }) => {
  switch (status) {
    case 'ai_proposed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono font-medium rounded-[5px] bg-[#1e293b]/70 text-[#94a3b8] border border-[#334155]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]" />
          AI proposed (Pending review)
        </span>
      );
    case 'human_confirmed':
      return (
        <span 
          title={verifiedBy ? `Verified by ${verifiedBy}` : 'Human confirmed'}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono font-semibold rounded-[5px] bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
        >
          <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
          ✓ Human confirmed
        </span>
      );
    case 'edited':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono font-semibold rounded-[5px] bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
          <AlertTriangle className="w-3 h-3 text-[#f59e0b]" />
          Human corrected
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono font-semibold rounded-[5px] bg-[#ef4444]/15 text-[#f87171] border border-[#ef4444]/40 shadow-[0_0_8px_rgba(239,68,68,0.2)]">
          ✕ Rejected
        </span>
      );
  }
};
