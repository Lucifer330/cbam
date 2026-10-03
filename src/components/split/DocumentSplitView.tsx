import React, { useState } from 'react';
import type { CBAMDocument, VakhAuditTag } from '../../types/cbam';
import { DocumentViewer } from '../document/DocumentViewer';
import { ExtractionPanel } from '../extraction/ExtractionPanel';
import { VakhLiveBadge } from '../common/VakhLiveBadge';
import { VakhConnectingState } from '../vakh/VakhConnectingState';
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
  Sparkles
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
            className="px-2.5 py-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--cyber-cyan)] bg-[var(--surface-sunken)] border border-[var(--border-subtle)] flex items-center gap-1.5 text-xs font-semibold"
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
            // Re-fetch live stream
            vakhService.fetchLivePayload(200);
          }} 
        />
      </div>
    );
  }

  const currentDoc = documents.find((d) => d.id === currentDocumentId) || documents[0];
  const [highlightedFieldKey, setHighlightedFieldKey] = useState<string | null>(initialFocusedFieldKey || null);
  const [auditNotesInput, setAuditNotesInput] = useState<string>(currentDoc.auditNotes || '');
  const [isPatchingStatus, setIsPatchingStatus] = useState<boolean>(false);

  // Bi-directional status toggle handler
  const handleStatusToggle = async (newStatus: VakhAuditTag) => {
    setIsPatchingStatus(true);
    try {
      // Fire immediate patch request back to Vakh Board API
      await vakhService.patchRecordStatus(currentDoc.id, newStatus, auditNotesInput);
      if (onUpdateAuditStatus) {
        onUpdateAuditStatus(currentDoc.id, newStatus, auditNotesInput);
      }
    } catch (err) {
      console.error('Failed to patch Vakh record status:', err);
    } finally {
      setIsPatchingStatus(false);
    }
  };

  const handleSaveAuditNotes = async () => {
    setIsPatchingStatus(true);
    try {
      await vakhService.patchRecordStatus(
        currentDoc.id, 
        currentDoc.auditStatus || 'Needs Review', 
        auditNotesInput
      );
      if (onUpdateAuditStatus) {
        onUpdateAuditStatus(currentDoc.id, currentDoc.auditStatus || 'Needs Review', auditNotesInput);
      }
    } catch (err) {
      console.error('Failed to save audit notes to Vakh:', err);
    } finally {
      setIsPatchingStatus(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[640px] space-y-3">
      {/* 3D Cyber Sub-header with document switcher, Vakh Live Badge, and Bi-Directional Tags */}
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

        {/* Right: Live Vakh Sync Visual Badge */}
        <div className="flex items-center gap-3">
          <VakhLiveBadge />
        </div>
      </div>

      {/* Split-screen container: Left = Document Viewer with Provenance Coordinates, Right = Extraction Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Left Side: Document Viewer (7 cols on lg) */}
        <div className="lg:col-span-7 h-full overflow-hidden rounded-xl border border-[var(--border-subtle)] shadow-xl bg-[var(--surface)]">
          <DocumentViewer
            document={currentDoc}
            highlightedFieldKey={highlightedFieldKey}
            onSelectField={(fieldKey) => setHighlightedFieldKey(fieldKey)}
          />
        </div>

        {/* Right Side: Extraction Panel (5 cols on lg) with Bi-Directional Sync */}
        <div className="lg:col-span-5 h-full overflow-hidden rounded-xl border border-[var(--border-subtle)] shadow-xl bg-[var(--surface)]">
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
        </div>
      </div>
    </div>
  );
};
