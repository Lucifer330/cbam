import React, { useState } from 'react';
import type { DiscrepancyDetail } from '../../services/deterministicEngine';
import type { CBAMDocument, VakhAuditTag } from '../../types/cbam';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ArrowUpRight, 
  HelpCircle, 
  Scale, 
  BookOpen, 
  CheckCircle2, 
  Send, 
  FileText,
  Sparkles,
  Info
} from 'lucide-react';

interface DiscrepancyJustificationPanelProps {
  document: CBAMDocument;
  discrepancies: DiscrepancyDetail[];
  onResolveDiscrepancy?: (discrepancyId: string, resolutionNote: string) => void;
  onUpdateStatus?: (status: VakhAuditTag, note: string) => void;
  className?: string;
}

export const DiscrepancyJustificationPanel: React.FC<DiscrepancyJustificationPanelProps> = ({
  document,
  discrepancies,
  onResolveDiscrepancy,
  onUpdateStatus,
  className = '',
}) => {
  const [activeDiscrepancyId, setActiveDiscrepancyId] = useState<string | null>(
    discrepancies.length > 0 ? discrepancies[0].id : null
  );
  const [justificationNote, setJustificationNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (discrepancies.length === 0) {
    return (
      <div className={`p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 ${className}`}>
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
            Zero Regulatory Discrepancies
          </h4>
          <p className="text-[11px] text-emerald-300/80 mt-0.5">
            All extracted parameters strictly comply with EU Sector Benchmarks & Regulation 2023/956.
          </p>
        </div>
      </div>
    );
  }

  const selectedDiscrepancy = discrepancies.find((d) => d.id === activeDiscrepancyId) || discrepancies[0];

  const handleSaveJustification = () => {
    if (!justificationNote.trim()) return;
    setIsSubmitting(true);
    if (onResolveDiscrepancy) {
      onResolveDiscrepancy(selectedDiscrepancy.id, justificationNote);
    }
    if (onUpdateStatus) {
      onUpdateStatus('Discrepancy', `Auditor Note on ${selectedDiscrepancy.ruleCode}: ${justificationNote}`);
    }
    setTimeout(() => {
      setIsSubmitting(false);
      setJustificationNote('');
    }, 300);
  };

  return (
    <div className={`flex flex-col bg-[var(--surface-sunken)] border border-amber-500/30 rounded-xl overflow-hidden shadow-lg ${className}`}>
      {/* Header Banner */}
      <div className="px-4 py-3 bg-gradient-to-r from-amber-500/20 via-red-500/15 to-transparent border-b border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <div>
            <span className="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider">
              {discrepancies.length} Regulatory Discrepanc{discrepancies.length > 1 ? 'ies' : 'y'} Detected
            </span>
            <p className="text-[10px] text-amber-400/80 font-mono">
              Enforced by Deterministic Rule Engine (EU 2023/1773)
            </p>
          </div>
        </div>

        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
          Action Required
        </span>
      </div>

      {/* Discrepancy Selector Tabs if multiple */}
      {discrepancies.length > 1 && (
        <div className="flex border-b border-[var(--border-subtle)] bg-[var(--surface)] overflow-x-auto p-1.5 gap-1.5 text-xs font-mono">
          {discrepancies.map((disc, idx) => (
            <button
              key={disc.id}
              type="button"
              onClick={() => setActiveDiscrepancyId(disc.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all shrink-0 flex items-center gap-1 ${
                selectedDiscrepancy.id === disc.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)]'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Rule #{idx + 1}: +{disc.differencePercentage}%</span>
            </button>
          ))}
        </div>
      )}

      {/* Active Discrepancy Detail Card */}
      <div className="p-4 space-y-3.5 text-xs font-sans">
        {/* Title & Badge */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] leading-snug">
              {selectedDiscrepancy.title}
            </h3>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-mono text-[var(--cyber-cyan)] bg-[var(--cyber-cyan)]/10 px-2 py-0.5 rounded border border-[var(--cyber-cyan)]/25">
              <BookOpen className="w-3 h-3" />
              {selectedDiscrepancy.regulationReference}
            </span>
          </div>

          <div className="text-right shrink-0">
            <span className="inline-block px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/40 text-red-400 font-mono text-xs font-bold">
              +{selectedDiscrepancy.differencePercentage}%
            </span>
            <span className="block text-[9px] text-[var(--text-muted)] font-mono mt-0.5">
              above benchmark
            </span>
          </div>
        </div>

        {/* Quantitative Benchmark Comparison Gauge */}
        <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] space-y-2">
          <div className="flex justify-between text-[11px] font-mono text-[var(--text-secondary)]">
            <span>Observed Extracted Value:</span>
            <span className="font-bold text-red-400">
              {selectedDiscrepancy.observedValue} {selectedDiscrepancy.unit}
            </span>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-[var(--text-secondary)]">
            <span>EU Sector Standard Benchmark:</span>
            <span className="font-bold text-emerald-400">
              {selectedDiscrepancy.benchmarkValue} {selectedDiscrepancy.unit}
            </span>
          </div>

          {/* Visual Progress / Deviation Bar */}
          <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-emerald-500 rounded-full"
              style={{ width: '40%' }}
              title="EU Benchmark Zone"
            />
            <div 
              className="absolute left-[40%] top-0 h-full bg-red-500 rounded-r-full animate-pulse"
              style={{ width: '60%' }}
              title="Discrepancy Excess Zone"
            />
          </div>
        </div>

        {/* Explanation & Action Required */}
        <div className="space-y-1.5 bg-amber-500/5 p-3 rounded-lg border border-amber-500/20 text-[11px] leading-relaxed">
          <p className="text-[var(--text-secondary)]">
            <strong className="text-amber-300">Regulatory Impact: </strong>
            {selectedDiscrepancy.explanation}
          </p>
          <p className="text-[var(--text-muted)] pt-1 border-t border-amber-500/15">
            <strong className="text-[var(--text-primary)]">Mandatory Rectification: </strong>
            {selectedDiscrepancy.actionRequired}
          </p>
        </div>

        {/* Interactive Auditor Justification & Sync to Vakh */}
        <div className="space-y-2 pt-1">
          <label htmlFor={`disc-notes-${selectedDiscrepancy.id}`} className="text-[11px] font-semibold text-[var(--text-primary)] flex items-center justify-between">
            <span>Log Legal Justification or Supplier Rebuttal:</span>
            <span className="text-[10px] text-emerald-400 font-mono">Syncs to Vakh Board</span>
          </label>
          <div className="flex gap-2">
            <input
              id={`disc-notes-${selectedDiscrepancy.id}`}
              type="text"
              value={justificationNote}
              onChange={(e) => setJustificationNote(e.target.value)}
              placeholder="e.g. Supplier submitted accredited ISO 14065 annex justifying site electricity mix..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyber-cyan)] font-sans"
            />
            <button
              type="button"
              onClick={handleSaveJustification}
              disabled={isSubmitting || !justificationNote.trim()}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Log Note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
