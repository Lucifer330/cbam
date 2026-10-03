import React, { useState } from 'react';
import type { CalculationTrace } from '../../types/cbam';
import { TraceChain } from './TraceChain';
import { ProvenanceDrawer } from '../common/ProvenanceDrawer';
import { 
  Calculator, 
  ShieldCheck, 
  GitBranch, 
  FileText, 
  Layers, 
  ExternalLink,
  ChevronDown,
  Cpu,
  Sparkles
} from 'lucide-react';

interface CalculationViewProps {
  calculations: CalculationTrace[];
  onOpenDocumentViewer?: (documentId: string, fieldKey?: string) => void;
  selectedTraceId?: string | null;
}

export const CalculationView: React.FC<CalculationViewProps> = ({
  calculations,
  onOpenDocumentViewer,
  selectedTraceId,
}) => {
  const [activeTraceId, setActiveTraceId] = useState<string>(
    selectedTraceId || calculations[0]?.id || ''
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const activeTrace = calculations.find((c) => c.id === activeTraceId) || calculations[0];

  const handleStepClick = () => {
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 3D Command Header */}
      <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 backdrop-blur-md shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-32 bg-radial from-[var(--cyber-cyan)]/15 via-transparent to-transparent pointer-events-none blur-2xl" />

        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-[var(--cyber-cyan)] uppercase mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>Signature Deterministic Engine</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyber-cyan)] animate-ping" />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
              Traceable 3D Emission Lineage
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Every calculated number links backwards through formula, locked rule v2026.1, verified inputs, and source PDF coordinates.
            </p>
          </div>

          {/* Calculation Switcher */}
          {calculations.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-secondary)] font-mono">Select Trace:</span>
              <select
                value={activeTrace?.id}
                onChange={(e) => setActiveTraceId(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-xs font-mono font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyber-cyan)]"
              >
                {calculations.map((calc) => (
                  <option key={calc.id} value={calc.id}>
                    {calc.documentName} ({calc.resultValue.toLocaleString()} {calc.resultUnit})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main 3D Calculation Stage */}
      {activeTrace ? (
        <div className="glass-3d rounded-xl border border-[var(--border-subtle)] p-6 shadow-2xl relative">
          {/* Top Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[var(--border-subtle)] text-xs">
            <div className="flex items-center gap-3">
              <span className="text-[var(--text-secondary)] font-mono">Evidence File:</span>
              <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5 font-mono">
                <FileText className="w-3.5 h-3.5 text-[var(--cyber-cyan)]" />
                {activeTrace.documentName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[var(--text-secondary)] bg-[var(--surface-sunken)] px-2.5 py-0.5 rounded border border-[var(--border-subtle)]">
                Rule Engine: {activeTrace.ruleVersion}
              </span>
              <span className="text-[11px] text-[var(--cyber-emerald)] font-mono font-bold bg-[var(--cyber-emerald)]/10 px-2.5 py-0.5 rounded border border-[var(--cyber-emerald)]/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Human Verified</span>
              </span>
            </div>
          </div>

          {/* Interactive Provenance Chain */}
          <TraceChain
            trace={activeTrace}
            onStepClick={handleStepClick}
            onOpenDocumentViewer={onOpenDocumentViewer}
          />

          {/* Disclaimer at bottom */}
          <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)] font-mono">
            Deterministic engine executed under EU Regulation (EU) 2023/956 & Implementing Regulation 2023/1773.
            Zero non-deterministic AI generation used in emissions arithmetic.
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-[var(--text-secondary)] bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl font-mono">
          No calculation traces generated yet. Confirm document fields to execute calculation.
        </div>
      )}

      {/* Slide-in Provenance Drawer */}
      <ProvenanceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        trace={activeTrace}
        onOpenDocument={onOpenDocumentViewer}
      />
    </div>
  );
};

