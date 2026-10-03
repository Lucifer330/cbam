import React from 'react';
import type { CBAMDocument, CalculationTrace } from '../../types/cbam';
import { MetricStrip } from '../common/MetricStrip';
import { StatusBadge } from '../common/StatusBadge';
import { SplineHeroContainer } from '../common/SplineHeroContainer';
import { Merkle3DCube } from '../common/Merkle3DCube';
import { SeamlessInputSwitcher } from '../document/SeamlessInputSwitcher';
import { vakhService } from '../../services/vakhService';
import { 
  ShieldCheck, 
  Upload, 
  Calculator,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

interface OverviewViewProps {
  documents: CBAMDocument[];
  calculations: CalculationTrace[];
  onNavigateTab: (tab: string) => void;
  onSelectDocument: (doc: CBAMDocument) => void;
  onOpenUpload: () => void;
  onTraceClick: (trace: CalculationTrace) => void;
  splineUrl: string;
  onUpdateSplineUrl: (url: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  documents,
  calculations,
  onNavigateTab,
  onSelectDocument,
  onOpenUpload,
  onTraceClick,
  splineUrl,
  onUpdateSplineUrl,
}) => {
  const awaitingCount = documents.filter((d) => d.status === 'Needs verification').length;
  const verifiedInputsCount = documents.reduce(
    (acc, d) => acc + d.extractedFields.filter((f) => f.status === 'human_confirmed' || f.status === 'edited').length,
    0
  );
  const traceableCount = calculations.length;

  const featuredCalculation = calculations[0];

  return (
    <div className="space-y-6">
      {/* 3D Command Header Banner */}
      <div className="relative rounded-[12px] bg-[#0c1219]/90 border border-[#1e293b] p-6 shadow-xl overflow-hidden backdrop-blur-md">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#34d399] mb-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" />
              <span>EU Customs Verified · Carbon Border Adjustment Mechanism</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>Compliance Intelligence Workspace</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40 font-semibold">
                3D LIVE
              </span>
            </h1>
            <p className="text-xs text-[#94a3b8] mt-1.5 max-w-2xl leading-relaxed">
              Every embedded emission value is mathematically anchored to supplier commercial invoices, mill test certs, and EPD bounding box coordinates. AI proposes; human gatekeepers verify; deterministic engines calculate.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[6px] bg-[#10b981] hover:bg-[#059669] text-[#022c22] text-xs font-bold transition-all shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.5)] active:scale-95 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#022c22]" />
              <span>Ingest Evidence File</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D Hero Section (Interactive 3D Globe / 3D Shield / Spline Scene) */}
      <SplineHeroContainer
        splineUrl={splineUrl}
        onUpdateSplineUrl={onUpdateSplineUrl}
        onNavigateToTrace={() => onNavigateTab('calculations')}
      />

      {/* 3D Realistic Metric Strip */}
      <MetricStrip
        documentsCount={documents.length}
        awaitingCount={awaitingCount}
        verifiedCount={verifiedInputsCount}
        traceableCount={traceableCount}
        onMetricClick={onNavigateTab}
        onTraceClick={() => featuredCalculation && onTraceClick(featuredCalculation)}
      />

      {/* Seamless Input Switcher: Drag-and-Drop Dropzone & Pre-filled Demo Loader */}
      <SeamlessInputSwitcher
        onLoadPreFilledDemo={() => {
          vakhService.seedVakhSpace();
          setTimeout(() => {
            if (documents.length > 0) {
              onSelectDocument(documents[0]);
            }
            onNavigateTab('split-view');
          }, 300);
        }}
        onDocumentUploaded={(newDoc) => {
          onSelectDocument(newDoc);
          onNavigateTab('split-view');
        }}
      />

      {/* 3D Featured Provenance Spotlight with Spinning Merkle Cube */}
      {featuredCalculation && (
        <div className="relative p-5 rounded-[12px] bg-[#0c1219]/90 border border-[#1e293b] hover:border-[#10b981]/50 transition-all flex flex-wrap items-center justify-between gap-5 shadow-2xl backdrop-blur-md preserve-3d">
          <div className="flex items-center gap-4">
            {/* Spinning 3D Merkle Block */}
            <div className="shrink-0 flex items-center justify-center p-2 rounded-[8px] bg-[#070a0e] border border-[#1e293b]">
              <Merkle3DCube size={64} onClick={() => onTraceClick(featuredCalculation)} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#38bdf8]" />
                  Active Provenance Ledger:
                </span>
                <span className="font-mono text-base font-extrabold text-[#34d399] drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                  {featuredCalculation.resultValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} {featuredCalculation.resultUnit}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e293b] text-[#38bdf8] border border-[#334155]">
                  {featuredCalculation.ruleVersion}
                </span>
              </div>

              <div className="text-xs text-[#94a3b8] mt-1.5 font-mono">
                Formula: <code className="text-white bg-[#1e293b] px-1.5 py-0.5 rounded border border-[#334155]">{featuredCalculation.formulaDisplay}</code> · Linked to <span className="font-semibold text-white">{featuredCalculation.documentName}</span> (Page 1 · x=132, y=418)
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onTraceClick(featuredCalculation)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-mono font-semibold transition-all border border-[#334155] hover:border-[#38bdf8] shadow-md group cursor-pointer"
          >
            <span>Trace 3D Provenance</span>
            <ArrowRight className="w-4 h-4 text-[#38bdf8] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Recent Compliance Activity Table (3D Glass Styled) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold font-mono text-white tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
            Recent Ingestion Stream
          </h2>
          <button
            type="button"
            onClick={() => onNavigateTab('documents')}
            className="text-xs text-[#38bdf8] hover:text-[#7dd3fc] font-mono font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View All Registry Documents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-[#0c1219]/90 border border-[#1e293b] rounded-[10px] overflow-hidden shadow-xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#070a0e] border-b border-[#1e293b] text-[10px] font-mono font-semibold text-[#94a3b8] uppercase tracking-wider">
                  <th className="py-3 px-4">Document</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Updated</th>
                  <th className="py-3 px-4">Traceability</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b] text-xs font-mono">
                {documents.slice(0, 5).map((doc) => (
                  <tr 
                    key={doc.id}
                    onClick={() => onSelectDocument(doc)}
                    className="hover:bg-[#16202e]/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white group-hover:text-[#38bdf8] transition-colors">
                        {doc.filename}
                      </div>
                      <div className="text-[10px] text-[#64748b] truncate max-w-[200px]">
                        SHA-256: {doc.sha256}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#cbd5e1]">
                      {doc.supplier}
                    </td>
                    <td className="py-3 px-4 text-[#94a3b8]">
                      {doc.productName}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="py-3 px-4 text-[#64748b]">
                      {doc.updatedAt}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                            style={{ width: `${doc.traceabilityPercent}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-white">
                          {doc.traceabilityPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-xs text-[#38bdf8] group-hover:text-white transition-colors">
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
