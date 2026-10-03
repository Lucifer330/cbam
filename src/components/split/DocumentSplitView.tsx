import React, { useState } from 'react';
import type { CBAMDocument, VakhAuditTag } from '../../types/cbam';
import { DocumentViewer } from '../document/DocumentViewer';
import { ExtractionPanel } from '../extraction/ExtractionPanel';
import { VakhLiveBadge } from '../common/VakhLiveBadge';
import { VakhConnectingState } from '../vakh/VakhConnectingState';
import { DiscrepancyJustificationPanel } from '../audit/DiscrepancyJustificationPanel';
import { AuditCertificateModal } from '../export/AuditCertificateModal';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { DeterministicCalculationEngine, type DeterministicEvaluationResult } from '../../services/deterministicEngine';
import { vakhService } from '../../services/vakhService';
import { 
  ArrowLeft, 
  FileText, 
  ChevronDown, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Tag, 
  Send,
  Database,
  Layers,
  Sparkles,
  Download,
  FileCheck,
  Scale,
  Zap,
  RotateCcw
} from 'lucide-react';

interface DocumentSplitViewProps {
  documents: CBAMDocument[];
  currentDocumentId: string;
  onSelectDocumentId: (id: string) => void;
  onBack: () => void;
  onConfirmField: (documentId: string, fieldId: string) => void;
  onEditField: (documentId: string, fieldId: string, newValue: string, notes: string) => void;
  onRejectField: (documentId: string, fieldId: string) => void;
  onRunCalculation: (documentId: string) => void;
  onUpdateAuditStatus?: (documentId: string, status: VakhAuditTag, notes?: string) => void;
  initialFocusedFieldKey?: string | null;
  isVakhLoading?: boolean;
}

export const DocumentSplitView: React.FC<DocumentSplitViewProps> = ({
  documents,
  currentDocumentId,
  onSelectDocumentId,
  onBack,
  onConfirmField,
  onEditField,
  onRejectField,
  onRunCalculation,
  onUpdateAuditStatus,
  initialFocusedFieldKey,
  isVakhLoading = false,
}) => {
  // 1. Dynamic Vakh Ingestion Enforced: Check if payload is resolved from live Vakh endpoint
  const hasValidVakhPayload = documents && documents.length > 0;

  if (!hasValidVakhPayload || isVakhLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] min-h-[640px] space-y-3">
        {/* Sub-header with Vakh Status */}
        <div className="flex items-center justify-between bg-[var(--surface)] px-4 py-2.5 border border-[var(--border-subtle)] rounded-xl backdrop-blur-md">
          <button
            type="button"
            onClick={onBack}
            className="px-2.5 py-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--cyber-cyan)] bg-[var(--surface-sunken)] border border-[var(--border-subtle)] flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>
          <VakhLiveBadge />
        </div>

        {/* Explicit connecting & waiting UI state */}
        <VakhConnectingState 
          syncState="waiting" 
          onIntakeTriggered={() => {
            vakhService.fetchLivePayload(200);
          }} 
        />
      </div>
    );
  }

  const currentDoc = documents.find((d) => d.id === currentDocumentId) || documents[0] || {
    id: 'doc-fallback',
    filename: 'document.pdf',
    supplier: 'Supplier',
    extractedFields: []
  } as any;

  const [highlightedFieldKey, setHighlightedFieldKey] = useState<string | null>(initialFocusedFieldKey || null);
  const [auditNotesInput, setAuditNotesInput] = useState<string>(currentDoc.auditNotes || '');
  const [isPatchingStatus, setIsPatchingStatus] = useState<boolean>(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);
  const [leftTab, setLeftTab] = useState<'metrics_and_audit' | 'discrepancies'>('metrics_and_audit');
  const [toastMessage, setToastMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Live Deterministic Mathematical Engine Evaluation
  const evaluation: DeterministicEvaluationResult = DeterministicCalculationEngine.evaluateDocument(currentDoc);

  // Bi-directional status toggle handler: fires optimistic update + PATCH /api/metrics/:id to update backend in real-time
  const handleStatusToggle = async (newStatus: VakhAuditTag) => {
    const previousStatus = currentDoc.auditStatus || 'Needs Review';
    setIsPatchingStatus(true);

    // 1. Optimistic UI update immediately
    if (onUpdateAuditStatus) {
      onUpdateAuditStatus(currentDoc.id, newStatus, auditNotesInput);
    }

    try {
      // 2. Perform background synchronization
      await vakhService.patchRecordStatus(currentDoc.id, newStatus, auditNotesInput);

      // Also hit the backend API route if available
      try {
        await fetch(`/api/metrics/${currentDoc.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: newStatus,
            justification: auditNotesInput
          })
        });
      } catch {
        // Backend API optional/silent if using in-memory Vakh service
      }

      setToastMessage({ type: 'success', text: `Vakh status synchronized to '${newStatus}'` });
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      console.error('Failed to patch Vakh record status, reverting:', err);
      // 3. Rollback on failure
      if (onUpdateAuditStatus) {
        onUpdateAuditStatus(currentDoc.id, previousStatus, auditNotesInput);
      }
      setToastMessage({ 
        type: 'error', 
        text: `Network sync failed: Reverted status to '${previousStatus}'. (${err?.message || 'Error'})` 
      });
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsPatchingStatus(false);
    }
  };

  // Instant Reset / Seed Demo Data
  const handleLoadDemoData = () => {
    vakhService.seedVakhSpace();
    setTimeout(() => {
      onSelectDocumentId(currentDoc.id);
    }, 200);
  };

  return (
    <div className="pt-4 flex flex-col h-[calc(100vh-80px)] min-h-[680px] space-y-3 relative">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg border shadow-2xl flex items-center gap-2 text-xs font-mono font-semibold transition-all animate-in fade-in slide-in-from-bottom-2 ${
          toastMessage.type === 'error'
            ? 'bg-red-950/90 text-red-300 border-red-500/50'
            : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
        }`}>
          {toastMessage.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}
      {/* 3D Cyber Sub-header with document switcher, Vakh Live Badge, Bi-Directional Tags & Export Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--surface)] px-4 py-2.5 border border-[var(--border-subtle)] rounded-xl backdrop-blur-md shadow-lg">
        {/* Left: Navigation and Document Select */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-2.5 py-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--cyber-cyan)] bg-[var(--surface-sunken)] border border-[var(--border-subtle)] hover:border-[var(--cyber-cyan)]/40 flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>

          <span className="text-[var(--text-muted)] font-mono">/</span>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-secondary)] font-mono">Active Evidence:</span>
            <select
              value={currentDoc.id}
              onChange={(e) => onSelectDocumentId(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyber-cyan)] font-mono cursor-pointer"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.filename} — {doc.supplier} ({doc.auditStatus || doc.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Bi-Directional Vakh Status Tags ("Verified", "Discrepancy", "Needs Review") */}
        <div className="flex items-center gap-1.5 bg-[var(--surface-sunken)] p-1 rounded-lg border border-[var(--border-subtle)]">
          <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] px-2 flex items-center gap-1">
            <Tag className="w-3 h-3 text-[var(--cyber-cyan)]" /> Vakh Status:
          </span>

          {(['Verified', 'Discrepancy', 'Needs Review'] as VakhAuditTag[]).map((tag) => {
            const isActive = (currentDoc.auditStatus || 'Needs Review') === tag;
            let activeClass = '';
            if (tag === 'Verified') activeClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/20';
            else if (tag === 'Discrepancy') activeClass = 'bg-red-500/20 text-red-400 border-red-500/40 shadow-red-500/20';
            else activeClass = 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-500/20';

            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleStatusToggle(tag)}
                disabled={isPatchingStatus}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                  isActive 
                    ? `${activeClass} shadow-sm font-semibold` 
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]'
                }`}
                title={`Patch Vakh Listing status to ${tag}`}
              >
                {tag === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                {tag === 'Discrepancy' && <AlertTriangle className="w-3 h-3" />}
                {tag === 'Needs Review' && <Clock className="w-3 h-3" />}
                <span>{tag}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Quick Demo Seed, Export Audit Certificate & Live Vakh Sync Visual Badge */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleLoadDemoData}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--surface-sunken)] hover:bg-[var(--surface)] border border-[var(--border-subtle)] hover:border-[var(--cyber-cyan)]/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
            title="Reload Pre-filled CBAM Demo Data into database"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reload Demo</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCertModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-[var(--cyber-cyan)] hover:bg-[var(--cyber-cyan)]/90 text-black text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-md shadow-[var(--cyber-cyan)]/20 hover:scale-105 active:scale-95 cursor-pointer"
            title="Export official printable EU CBAM audit certificate with Vakh provenance"
          >
            <FileCheck className="w-3.5 h-3.5 text-black" />
            <span>Export Audit Certificate</span>
          </button>

          <VakhLiveBadge />
        </div>
      </div>

      {/* DUAL-PANE PROVENANCE VIEW: Left Pane = Audit Metrics & Extraction, Right Pane = Document Viewer */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* LEFT PANE: Audit Metric Cards, Status Badges & Discrepancy Tool (5 cols on lg) */}
        <div className="lg:col-span-5 h-full flex flex-col overflow-hidden rounded-xl border border-[var(--border-subtle)] shadow-xl bg-[var(--surface)]">
          {/* Sub-tab Switcher: Metrics & Extraction vs Discrepancies */}
          <div className="px-4 py-2 bg-[var(--surface-sunken)] border-b border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLeftTab('metrics_and_audit')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  leftTab === 'metrics_and_audit'
                    ? 'bg-[var(--surface)] text-[var(--cyber-cyan)] border border-[var(--border-subtle)] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Audit Metrics</span>
              </button>

              <button
                type="button"
                onClick={() => setLeftTab('discrepancies')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  leftTab === 'discrepancies'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : evaluation.discrepancies.length > 0
                    ? 'text-amber-400 hover:bg-amber-500/10'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Discrepancies ({evaluation.discrepancies.length})</span>
              </button>
            </div>

            <span className="text-[10px] text-emerald-400 font-mono">
              EU Benchmark: {evaluation.applicableBenchmark.benchmarkValue} {evaluation.applicableBenchmark.unit}
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
            <ErrorBoundary fallbackTitle="Audit Verification Panel Error">
              {leftTab === 'metrics_and_audit' ? (
                <ExtractionPanel
                  document={currentDoc}
                  highlightedFieldKey={highlightedFieldKey}
                  onHoverField={(fieldKey) => setHighlightedFieldKey(fieldKey)}
                  onSelectField={(fieldKey) => setHighlightedFieldKey(fieldKey)}
                  onConfirmField={(fieldId) => onConfirmField(currentDoc.id, fieldId)}
                  onEditField={(fieldId, val, notes) => onEditField(currentDoc.id, fieldId, val, notes)}
                  onRejectField={(fieldId) => onRejectField(currentDoc.id, fieldId)}
                  onRunCalculation={onRunCalculation}
                />
              ) : (
                <div className="h-full overflow-y-auto p-4 space-y-4">
                  <DiscrepancyJustificationPanel
                    document={currentDoc}
                    discrepancies={evaluation.discrepancies}
                    onUpdateStatus={(status, note) => handleStatusToggle(status)}
                  />
                </div>
              )}
            </ErrorBoundary>
          </div>
        </div>

        {/* RIGHT PANE: Embedded PDF Viewer with Interactive Glowing Neon Coordinate Overlays (7 cols on lg) */}
        <div className="lg:col-span-7 h-full overflow-hidden rounded-xl border border-[var(--border-subtle)] shadow-xl bg-[var(--surface)]">
          <ErrorBoundary fallbackTitle="Document OCR Viewer Error">
            <DocumentViewer
              document={currentDoc}
              highlightedFieldKey={highlightedFieldKey}
              onSelectField={(fieldKey) => setHighlightedFieldKey(fieldKey)}
            />
          </ErrorBoundary>
        </div>
      </div>

      {/* Official Audit Certificate Export Modal */}
      <AuditCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        document={currentDoc}
      />
    </div>
  );
};
