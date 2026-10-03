import React from 'react';
import type { CalculationTrace } from '../../types/cbam';
import { 
  ArrowDown, 
  FileText, 
  MapPin, 
  GitBranch, 
  CheckCircle2, 
  ExternalLink,
  Hash,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Card3D } from '../common/Card3D';

interface TraceChainProps {
  trace: CalculationTrace;
  onStepClick: (stepType: 'result' | 'formula' | 'rule' | 'input' | 'source' | 'document') => void;
  onOpenDocumentViewer?: (documentId: string, fieldKey?: string) => void;
}

export const TraceChain: React.FC<TraceChainProps> = ({
  trace,
  onStepClick,
  onOpenDocumentViewer,
}) => {
  const primaryInput = trace.verifiedInputs[1] || trace.verifiedInputs[0];

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto py-4 space-y-4 perspective-1000">
      {/* Node 1: RESULT (3D Floating Output Block) */}
      <Card3D
        onClick={() => onStepClick('result')}
        glowColor="rgba(16, 185, 129, 0.4)"
        className="w-full p-6 rounded-[12px] bg-[#0c1219]/95 border-2 border-[#10b981] shadow-2xl text-center group backdrop-blur-xl"
      >
        <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-2 preserve-3d" style={{ transform: 'translateZ(15px)' }}>
          <span className="font-mono text-[11px] font-bold text-[#34d399] uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#10b981]" />
            STEP 01 · DETERMINISTIC RESULT
          </span>
          <span className="text-[11px] font-mono text-[#34d399] bg-[#10b981]/15 px-2.5 py-0.5 rounded border border-[#10b981]/40 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
            Locked Output
          </span>
        </div>

        <div className="flex items-baseline justify-center gap-2.5 preserve-3d my-1" style={{ transform: 'translateZ(30px)' }}>
          <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            {trace.resultValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-lg font-bold text-[#34d399] font-mono">
            {trace.resultUnit}
          </span>
        </div>

        <div className="text-xs text-[#94a3b8] font-mono mt-1 preserve-3d" style={{ transform: 'translateZ(15px)' }}>
          {trace.resultLabel} (Direct: {trace.directEmissionsTonnes} t + Indirect: {trace.indirectEmissionsTonnes} t)
        </div>

        <div className="mt-3 text-[11px] font-mono font-semibold text-[#38bdf8] flex items-center justify-center gap-1.5 group-hover:underline preserve-3d" style={{ transform: 'translateZ(20px)' }}>
          <span>Click to open cryptographic provenance dossier</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </Card3D>

      {/* Cyber Glowing 3D Down Connector */}
      <div className="flex flex-col items-center">
        <div className="w-0.5 h-5 bg-gradient-to-b from-[#10b981] to-[#38bdf8] shadow-[0_0_6px_#10b981]" />
        <ArrowDown className="w-4 h-4 text-[#38bdf8] my-0.5 animate-bounce" />
      </div>

      {/* Node 2: FORMULA */}
      <Card3D 
        onClick={() => onStepClick('formula')}
        glowColor="rgba(56, 189, 248, 0.3)"
        className="w-full p-4 rounded-[10px] bg-[#0c1219]/90 border border-[#1e293b] hover:border-[#38bdf8] transition-all text-center group backdrop-blur-md"
      >
        <div className="text-[11px] font-mono font-semibold text-[#64748b] uppercase tracking-wider mb-1 preserve-3d" style={{ transform: 'translateZ(10px)' }}>
          STEP 02 · MATHEMATICAL FORMULA
        </div>
        <div className="font-mono text-base font-bold text-white group-hover:text-[#38bdf8] transition-colors preserve-3d" style={{ transform: 'translateZ(20px)' }}>
          {trace.formulaDisplay}
        </div>
        <div className="font-mono text-xs text-[#94a3b8] mt-0.5 preserve-3d" style={{ transform: 'translateZ(12px)' }}>
          {trace.formula}
        </div>
      </Card3D>

      {/* Cyber Connector */}
      <div className="flex flex-col items-center">
        <div className="w-0.5 h-5 bg-gradient-to-b from-[#38bdf8] to-[#a855f7]" />
        <ArrowDown className="w-4 h-4 text-[#a855f7] my-0.5" />
      </div>

      {/* Node 3: RULE VERSION */}
      <Card3D 
        onClick={() => onStepClick('rule')}
        glowColor="rgba(168, 85, 247, 0.3)"
        className="w-full p-4 rounded-[10px] bg-[#0c1219]/90 border border-[#1e293b] hover:border-[#a855f7] transition-all text-center group backdrop-blur-md"
      >
        <div className="text-[11px] font-mono font-semibold text-[#64748b] uppercase tracking-wider mb-1 preserve-3d" style={{ transform: 'translateZ(10px)' }}>
          STEP 03 · RULE SPECIFICATION
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[5px] bg-[#a855f7]/15 text-[#c084fc] border border-[#a855f7]/40 font-mono text-xs font-bold preserve-3d" style={{ transform: 'translateZ(20px)' }}>
          <GitBranch className="w-3.5 h-3.5 text-[#a855f7]" />
          Rule {trace.ruleVersion}
        </div>
        <div className="text-xs text-white font-medium mt-1.5 preserve-3d" style={{ transform: 'translateZ(15px)' }}>
          {trace.ruleName}
        </div>
        <div className="text-[11px] text-[#94a3b8] font-mono preserve-3d" style={{ transform: 'translateZ(10px)' }}>
          {trace.regulationReference}
        </div>
      </Card3D>

      {/* Cyber Connector */}
      <div className="flex flex-col items-center">
        <div className="w-0.5 h-5 bg-gradient-to-b from-[#a855f7] to-[#10b981]" />
        <ArrowDown className="w-4 h-4 text-[#10b981] my-0.5" />
      </div>

      {/* Node 4: VERIFIED INPUT */}
      <Card3D 
        onClick={() => onStepClick('input')}
        glowColor="rgba(16, 185, 129, 0.3)"
        className="w-full p-5 rounded-[10px] bg-[#0c1219]/90 border border-[#1e293b] hover:border-[#10b981] transition-all group backdrop-blur-md"
      >
        <div className="text-center text-[11px] font-mono font-semibold text-[#64748b] uppercase tracking-wider mb-2.5 preserve-3d" style={{ transform: 'translateZ(10px)' }}>
          STEP 04 · VERIFIED INPUT PARAMETERS
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs font-mono preserve-3d" style={{ transform: 'translateZ(20px)' }}>
          <div className="p-3 rounded-[6px] bg-[#070a0e] border border-[#1e293b] text-center">
            <div className="text-[10px] text-[#94a3b8]">Direct Specific Emissions</div>
            <div className="font-mono text-sm font-bold text-white mt-1">
              1.60 tCO₂e/t
            </div>
            <div className="text-[10px] text-[#34d399] font-medium flex items-center justify-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
              Human confirmed
            </div>
          </div>

          <div className="p-3 rounded-[6px] bg-[#070a0e] border border-[#1e293b] text-center">
            <div className="text-[10px] text-[#94a3b8]">Indirect Specific Emissions</div>
            <div className="font-mono text-sm font-bold text-white mt-1">
              0.30 tCO₂e/t
            </div>
            <div className="text-[10px] text-[#34d399] font-medium flex items-center justify-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
              Human confirmed
            </div>
          </div>
        </div>
        <div className="text-center text-[11px] font-mono text-[#64748b] mt-2.5 preserve-3d" style={{ transform: 'translateZ(10px)' }}>
          Verifier: {trace.complianceOfficer} · Signed at {trace.timestamp}
        </div>
      </Card3D>

      {/* Cyber Connector */}
      <div className="flex flex-col items-center">
        <div className="w-0.5 h-5 bg-gradient-to-b from-[#10b981] to-[#38bdf8]" />
        <ArrowDown className="w-4 h-4 text-[#38bdf8] my-0.5" />
      </div>

      {/* Node 5: SOURCE FIELD LOCATOR */}
      <Card3D 
        onClick={() => onStepClick('source')}
        glowColor="rgba(56, 189, 248, 0.3)"
        className="w-full p-4 rounded-[10px] bg-[#0c1219]/90 border border-[#1e293b] hover:border-[#38bdf8] transition-all text-center group backdrop-blur-md"
      >
        <div className="text-[11px] font-mono font-semibold text-[#64748b] uppercase tracking-wider mb-1 preserve-3d" style={{ transform: 'translateZ(10px)' }}>
          STEP 05 · SOURCE PDF COORDINATE LOCATOR
        </div>
        <div className="font-mono text-xs font-semibold text-white preserve-3d" style={{ transform: 'translateZ(15px)' }}>
          emissions_value (Scope 1 & Scope 2 lines)
        </div>
        <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 rounded border border-[#38bdf8]/30 mt-2 preserve-3d" style={{ transform: 'translateZ(25px)' }}>
          <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
          Page {primaryInput.boundingBox.page} · x={primaryInput.boundingBox.x} · y={primaryInput.boundingBox.y}
        </div>
        <div className="text-[10px] font-mono text-[#64748b] mt-1.5 preserve-3d" style={{ transform: 'translateZ(10px)' }}>
          Bounding Box: {primaryInput.boundingBox.width}px × {primaryInput.boundingBox.height}px
        </div>
      </Card3D>

      {/* Cyber Connector */}
      <div className="flex flex-col items-center">
        <div className="w-0.5 h-5 bg-gradient-to-b from-[#38bdf8] to-[#10b981]" />
        <ArrowDown className="w-4 h-4 text-[#10b981] my-0.5" />
      </div>

      {/* Node 6: SUPPLIER DOCUMENT EVIDENCE */}
      <Card3D 
        onClick={() => onStepClick('document')}
        glowColor="rgba(16, 185, 129, 0.35)"
        className="w-full p-5 rounded-[10px] bg-[#0c1219]/90 border border-[#1e293b] hover:border-[#10b981] transition-all text-center group backdrop-blur-md"
      >
        <div className="text-[11px] font-mono font-semibold text-[#64748b] uppercase tracking-wider mb-1 preserve-3d" style={{ transform: 'translateZ(10px)' }}>
          STEP 06 · PHYSICAL SUPPLIER EVIDENCE
        </div>
        <div className="flex items-center justify-center gap-2 text-sm font-bold text-white preserve-3d" style={{ transform: 'translateZ(20px)' }}>
          <FileText className="w-4 h-4 text-[#10b981]" />
          <span>{trace.documentName}</span>
        </div>
        <div className="text-xs font-mono text-[#94a3b8] mt-0.5 preserve-3d" style={{ transform: 'translateZ(12px)' }}>
          Supplier: Steel Components Ltd. (Turkey)
        </div>
        <div className="mt-2.5 font-mono text-[10px] text-[#34d399] bg-[#070a0e] p-2 rounded border border-[#1e293b] break-all preserve-3d" style={{ transform: 'translateZ(15px)' }}>
          <Hash className="w-3 h-3 inline mr-1 text-[#10b981]" />
          SHA-256: {trace.documentHash}
        </div>

        {onOpenDocumentViewer && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDocumentViewer(trace.documentId, primaryInput.sourceFieldKey);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#38bdf8] font-mono font-semibold hover:underline mt-3 cursor-pointer preserve-3d"
            style={{ transform: 'translateZ(20px)' }}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Inspect exact line item on original document
          </button>
        )}
      </Card3D>
    </div>
  );
};
