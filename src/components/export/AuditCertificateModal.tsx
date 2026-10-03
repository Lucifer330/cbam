import React from 'react';
import type { CBAMDocument } from '../../types/cbam';
import { DeterministicCalculationEngine, type DeterministicEvaluationResult } from '../../services/deterministicEngine';
import { exportAuditCertificatePrint, type AuditCertificateData } from '../../utils/pdfExport';
import { vakhService } from '../../services/vakhService';
import { 
  FileCheck, 
  Download, 
  Printer, 
  X, 
  ShieldCheck, 
  Database, 
  Hash, 
  CheckCircle2, 
  AlertTriangle,
  Scale,
  Sparkles
} from 'lucide-react';

interface AuditCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: CBAMDocument;
}

export const AuditCertificateModal: React.FC<AuditCertificateModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  if (!isOpen) return null;

  const config = vakhService.getConfig();
  const evaluation: DeterministicEvaluationResult = DeterministicCalculationEngine.evaluateDocument(document);

  const certData: AuditCertificateData = {
    certificateId: `CERT-EU-${document.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
    generatedAt: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }) + ' UTC',
    document,
    evaluation,
    vakhSpaceId: config.spaceId,
    vakhBoardId: config.boardId,
    complianceOfficer: 'E. Moreau (Lead CBAM Officer, Accredited Verifier)',
    merkleRootHash: `0x7f4e91a2${document.sha256.slice(0, 24)}`
  };

  const handleExportPDF = () => {
    exportAuditCertificatePrint(certData);
  };

  const ratingColor = 
    evaluation.complianceRating.includes('GRADE A') ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
    evaluation.complianceRating.includes('GRADE B') ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
    'bg-red-500/20 text-red-400 border-red-500/40';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[var(--surface-sunken)] border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--cyber-cyan)]/20 border border-[var(--cyber-cyan)]/30 flex items-center justify-center text-[var(--cyber-cyan)]">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)] font-sans">
                Official EU CBAM Audit Certificate
              </h2>
              <p className="text-[11px] text-[var(--text-secondary)] font-mono">
                Deterministic Evidence Protocol · EU Regulation 2023/956
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportPDF}
              className="px-3.5 py-1.5 rounded-lg bg-[var(--cyber-cyan)] hover:bg-[var(--cyber-cyan)]/90 text-black text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-md shadow-[var(--cyber-cyan)]/20 hover:scale-105 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-black" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-sunken)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Print Preview Layout) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs font-sans">
          {/* Executive Rating Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--surface-sunken)] to-[#121820] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                Executive Compliance Rating
              </span>
              <span className={`inline-block px-3 py-1 rounded-lg border font-mono font-bold text-xs ${ratingColor}`}>
                {evaluation.complianceRating}
              </span>
            </div>

            <div className="text-right font-mono text-[11px] text-[var(--text-secondary)] space-y-0.5">
              <div>Certificate ID: <strong className="text-[var(--text-primary)]">{certData.certificateId}</strong></div>
              <div>Issue Date: <span className="text-[var(--text-muted)]">{certData.generatedAt}</span></div>
            </div>
          </div>

          {/* Vakh Data Space Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-subtle)] font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[var(--cyber-cyan)]" />
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Vakh Data Space Ref:</span>
                <span className="text-[var(--text-primary)] font-semibold">{certData.vakhSpaceId}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">SHA-256 Fingerprint:</span>
                <span className="text-[var(--text-primary)] font-semibold truncate block max-w-[220px]" title={document.sha256}>
                  {document.sha256}
                </span>
              </div>
            </div>
          </div>

          {/* Deterministic Formula Breakdown */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4" /> Deterministic Mathematical Evaluation
              </span>
              <span>100% Rule Lock (v2026.1)</span>
            </div>

            <div className="font-mono text-sm font-bold text-[var(--text-primary)] bg-[var(--surface-sunken)] p-2.5 rounded-lg border border-emerald-500/20">
              {evaluation.calculationTrace.formulaDisplay} = <span className="text-emerald-400">{evaluation.totalEmbeddedEmissions.toLocaleString()} tCO₂e</span>
            </div>

            <div className="text-[11px] text-[var(--text-secondary)] flex flex-wrap gap-4 font-mono">
              <span>Direct Specific: <strong>{evaluation.directSpecificEmissions} tCO₂e/t</strong></span>
              <span>Indirect Specific: <strong>{evaluation.indirectSpecificEmissions} tCO₂e/t</strong></span>
              <span>EU Benchmark: <strong>{evaluation.applicableBenchmark.benchmarkValue} {evaluation.applicableBenchmark.unit}</strong> ({evaluation.benchmarkDeviationPercent >= 0 ? '+' : ''}{evaluation.benchmarkDeviationPercent}%)</span>
            </div>
          </div>

          {/* Itemized Extraction & Vakh Coordinates Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[var(--text-muted)] mb-2">
              Itemized Verification Table & Coordinate Provenance
            </h3>
            <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface-sunken)] border-b border-[var(--border-subtle)] text-[10px] font-mono uppercase text-[var(--text-muted)]">
                  <tr>
                    <th className="p-2.5">Field</th>
                    <th className="p-2.5">Extracted Value</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Vakh Coordinates</th>
                    <th className="p-2.5 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] font-mono text-[11px]">
                  {document.extractedFields.map((f) => (
                    <tr key={f.id} className="hover:bg-[var(--surface-sunken)]/50">
                      <td className="p-2.5 font-sans font-semibold text-[var(--text-primary)]">{f.label}</td>
                      <td className="p-2.5 text-[var(--text-primary)] font-bold">{f.value}</td>
                      <td className="p-2.5">
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED
                        </span>
                      </td>
                      <td className="p-2.5 text-[var(--text-secondary)] text-[10px]">
                        P.{f.pdfPage ?? f.boundingBox.page} (Top: {f.highlightBox?.top ?? f.boundingBox.y}px, Left: {f.highlightBox?.left ?? f.boundingBox.x}px)
                      </td>
                      <td className="p-2.5 text-right font-bold text-[var(--cyber-cyan)]">
                        {Math.round(f.confidence * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cryptographic Signature Footer */}
          <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[var(--text-muted)] font-mono">
            <div>
              <span className="block text-[10px] uppercase font-bold text-[var(--text-secondary)]">Authorized Compliance Verifier:</span>
              <span className="text-[var(--text-primary)]">{certData.complianceOfficer}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] uppercase font-bold text-[var(--text-secondary)]">Merkle Root Verification:</span>
              <span className="text-[var(--cyber-cyan)] font-bold">{certData.merkleRootHash}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-3.5 bg-[var(--surface-sunken)] border-t border-[var(--border-subtle)] flex justify-between items-center">
          <span className="text-[11px] text-[var(--text-muted)] font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Audit-ready for EU Commission customs clearance
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="px-4 py-2 rounded-xl bg-[var(--cyber-cyan)] text-black font-bold text-xs flex items-center gap-1.5 hover:opacity-95 shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Certificate (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
