import React, { useState, useEffect } from 'react';
import type { CalculationTrace } from '../../types/cbam';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  GitBranch, 
  CheckCircle2, 
  Copy, 
  Check, 
  Binary,
  MapPin
} from 'lucide-react';

interface ProvenanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trace: CalculationTrace | null;
  onOpenDocument?: (documentId: string, focusFieldKey?: string) => void;
}

export const ProvenanceDrawer: React.FC<ProvenanceDrawerProps> = ({
  isOpen,
  onClose,
  trace,
  onOpenDocument
}) => {
  const [copied, setCopied] = React.useState(false);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !trace) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(trace, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const primaryInput = trace.verifiedInputs[1] || trace.verifiedInputs[0];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="provenance-title">
      {/* Dimmed backdrop with light-dismiss */}
      <div 
        className="fixed inset-0 bg-[#121614]/40 transition-opacity backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#ffffff] border-l border-[#e2e2dc] shadow-xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#e5e5de] bg-[#fbfbfa] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[4px] bg-[#eaf0eb] border border-[#c8e6ce] flex items-center justify-center text-[#1b6830]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 id="provenance-title" className="text-sm font-semibold text-[#191c1e] tracking-tight">
                  Cryptographic Provenance
                </h2>
                <p className="text-xs text-[#5a6065]">
                  Full audit lineage for calculated value
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-[4px] text-[#5a6065] hover:text-[#191c1e] hover:bg-[#f0f0eb] transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subheader Banner */}
          <div className="px-6 py-2.5 bg-[#f6f6f3] border-b border-[#e5e5de] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#5a6065]">Trace ID:</span>
              <span className="font-mono text-[#191c1e] font-medium">{trace.id}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[#1b6830] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Fully Verified
            </span>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Step 1: The Result */}
            <div className="p-4 rounded-[6px] bg-[#fdfdfc] border border-[#e5e5de]">
              <div className="flex items-center justify-between text-xs text-[#5a6065] mb-1">
                <span className="font-medium uppercase tracking-wider text-[11px] text-[#848a90]">Step 1 · Traceable Result</span>
                <span className="text-[11px] font-mono text-[#3d5042] bg-[#eaf0eb] px-1.5 py-0.5 rounded">EU Reg 2023/956 Art. 7</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight text-[#191c1e] font-mono">
                  {trace.resultValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-sm font-medium text-[#5a6065] font-mono">
                  {trace.resultUnit}
                </span>
              </div>
              <div className="text-xs text-[#5a6065] mt-1">
                {trace.resultLabel} (Direct: {trace.directEmissionsTonnes.toLocaleString()} t + Indirect: {trace.indirectEmissionsTonnes.toLocaleString()} t)
              </div>
            </div>

            {/* Lineage Steps Connector */}
            <div className="space-y-4">
              <div className="text-[11px] font-semibold tracking-wider text-[#848a90] uppercase">
                Deterministic Audit Chain
              </div>

              {/* Step 2: Formula */}
              <div className="relative pl-6 pb-2 border-l-2 border-[#d2d2c8]">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#fbfbfa] border-2 border-[#3d5042] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3d5042]" />
                </div>
                <div className="text-xs font-medium text-[#848a90]">FORMULA (DETERMINISTIC)</div>
                <div className="mt-1 font-mono text-sm font-medium text-[#191c1e] bg-[#f6f6f3] px-3 py-2 rounded-[4px] border border-[#e5e5de]">
                  {trace.formulaDisplay}
                </div>
                <div className="text-xs text-[#5a6065] mt-1 font-mono">
                  {trace.formula}
                </div>
              </div>

              {/* Step 3: Rule Version */}
              <div className="relative pl-6 pb-2 border-l-2 border-[#d2d2c8]">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#fbfbfa] border-2 border-[#3d5042] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3d5042]" />
                </div>
                <div className="text-xs font-medium text-[#848a90]">RULE VERSION APPLIED</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-[4px] bg-[#eaf0eb] text-[#2c3d31] border border-[#c5d3c8]">
                    <GitBranch className="w-3 h-3 text-[#3d5042]" />
                    {trace.ruleVersion}
                  </span>
                  <span className="text-xs font-medium text-[#191c1e]">{trace.ruleName}</span>
                </div>
                <div className="text-xs text-[#5a6065] mt-1">
                  Legal Reference: {trace.regulationReference}
                </div>
              </div>

              {/* Step 4: Verified Inputs */}
              <div className="relative pl-6 pb-2 border-l-2 border-[#d2d2c8]">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#fbfbfa] border-2 border-[#3d5042] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3d5042]" />
                </div>
                <div className="text-xs font-medium text-[#848a90]">VERIFIED INPUTS (HUMAN GATEKEEPER)</div>
                <div className="mt-2 space-y-2">
                  {trace.verifiedInputs.map((input, idx) => (
                    <div key={idx} className="p-2.5 rounded-[4px] bg-[#fbfbfa] border border-[#e5e5de] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#191c1e]">{input.label}</span>
                        <span className="font-mono font-semibold text-[#191c1e]">{input.value}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#5a6065]">
                        <span className="text-[#1b6830] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {input.verifiedBy}
                        </span>
                        <span className="font-mono text-[#848a90]">{input.verifiedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 5: Source Field Coordinates */}
              <div className="relative pl-6 pb-2 border-l-2 border-[#d2d2c8]">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#fbfbfa] border-2 border-[#3d5042] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3d5042]" />
                </div>
                <div className="text-xs font-medium text-[#848a90]">SOURCE FIELD IN DOCUMENT</div>
                <div className="mt-1 p-3 rounded-[4px] bg-[#f6f6f3] border border-[#e5e5de] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#5a6065]">Field Key:</span>
                    <span className="font-mono font-medium text-[#191c1e]">{primaryInput.sourceFieldKey}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#5a6065]">Document Locator:</span>
                    <span className="inline-flex items-center gap-1 font-mono text-[#3d5042] bg-white px-2 py-0.5 rounded border border-[#e2e2dc]">
                      <MapPin className="w-3 h-3 text-[#3d5042]" />
                      Page {primaryInput.boundingBox.page} · x={primaryInput.boundingBox.x} · y={primaryInput.boundingBox.y}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#848a90]">
                    <span>Bounding Box Dimension:</span>
                    <span className="font-mono">{primaryInput.boundingBox.width}px × {primaryInput.boundingBox.height}px</span>
                  </div>
                </div>
              </div>

              {/* Step 6: Supplier Document */}
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#3d5042] flex items-center justify-center">
                  <FileText className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="text-xs font-medium text-[#848a90]">SUPPLIER DOCUMENT & CRYPTOGRAPHIC HASH</div>
                <div className="mt-1 p-3 rounded-[4px] bg-[#fbfbfa] border border-[#e5e5de] space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#3d5042] shrink-0" />
                    <span className="text-xs font-medium text-[#191c1e] truncate">{trace.documentName}</span>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#848a90] mb-0.5">SHA-256 Evidence Hash</div>
                    <div className="font-mono text-[10px] text-[#5a6065] break-all bg-white p-1.5 rounded border border-[#e5e5de]">
                      {trace.documentHash}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action to Document Viewer */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenDocument) {
                    onOpenDocument(trace.documentId, primaryInput.sourceFieldKey);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-[4px] bg-[#191c1e] text-white hover:bg-[#2d3134] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Inspect Exact Coordinates in Document Viewer
              </button>
            </div>
          </div>

          {/* Footer with JSON copy */}
          <div className="p-4 border-t border-[#e5e5de] bg-[#fbfbfa] flex items-center justify-between text-xs">
            <span className="text-[#5a6065] flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5 text-[#3d5042]" />
              Immutable provenance record
            </span>
            <button
              type="button"
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[4px] bg-white border border-[#e5e5de] text-[#191c1e] hover:bg-[#f6f6f3] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#1b6830]" />
                  <span>Copied JSON</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#5a6065]" />
                  <span>Copy Audit JSON</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
