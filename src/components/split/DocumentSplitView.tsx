import React, { useState } from 'react';
import type { CBAMDocument } from '../../types/cbam';
import { DocumentViewer } from '../document/DocumentViewer';
import { ExtractionPanel } from '../extraction/ExtractionPanel';
import { ArrowLeft, FileText, ChevronDown, CheckCircle2, ShieldCheck } from 'lucide-react';

interface DocumentSplitViewProps {
  documents: CBAMDocument[];
  currentDocumentId: string;
  onSelectDocumentId: (id: string) => void;
  onBack: () => void;
  onConfirmField: (documentId: string, fieldId: string) => void;
  onEditField: (documentId: string, fieldId: string, newValue: string, notes: string) => void;
  onRejectField: (documentId: string, fieldId: string) => void;
  onRunCalculation: (documentId: string) => void;
  initialFocusedFieldKey?: string | null;
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
  initialFocusedFieldKey,
}) => {
  const currentDoc = documents.find((d) => d.id === currentDocumentId) || documents[0];
  const [highlightedFieldKey, setHighlightedFieldKey] = useState<string | null>(initialFocusedFieldKey || null);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[640px] space-y-3">
      {/* 3D Cyber Sub-header with document switcher & navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--surface)] px-4 py-2.5 border border-[var(--border-subtle)] rounded-xl backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-2.5 py-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--cyber-cyan)] bg-[var(--surface-sunken)] border border-[var(--border-subtle)] hover:border-[var(--cyber-cyan)]/40 flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
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
              className="px-3 py-1.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyber-cyan)] font-mono"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.filename} — {doc.supplier} ({doc.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-[var(--text-secondary)]">
            Product: <strong className="text-[var(--text-primary)] font-semibold">{currentDoc.productName}</strong>
          </span>
          <span className="font-mono text-[11px] bg-[var(--cyber-cyan)]/10 text-[var(--cyber-cyan)] px-2.5 py-0.5 rounded-md border border-[var(--cyber-cyan)]/25">
            CN {currentDoc.cnCode}
          </span>
        </div>
      </div>

      {/* Split-screen container: Left = Document Viewer, Right = Extraction Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Left Side: Document Viewer (7 cols on lg) */}
        <div className="lg:col-span-7 h-full overflow-hidden rounded-xl border border-[var(--border-subtle)] shadow-xl bg-[var(--surface)]">
          <DocumentViewer
            document={currentDoc}
            highlightedFieldKey={highlightedFieldKey}
            onSelectField={(fieldKey) => setHighlightedFieldKey(fieldKey)}
          />
        </div>

        {/* Right Side: Extraction Panel (5 cols on lg) */}
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

