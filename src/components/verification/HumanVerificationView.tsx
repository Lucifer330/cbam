import React, { useState } from 'react';
import type { CBAMDocument, ExtractedField } from '../../types/cbam';
import { VerificationStateBadge } from '../common/StatusBadge';
import { Card3D } from '../common/Card3D';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Edit3, 
  MapPin, 
  FileText, 
  AlertTriangle, 
  ArrowRight,
  ExternalLink,
  Save,
  X,
  XCircle,
  Filter,
  Cpu,
  Lock,
  Sparkles
} from 'lucide-react';

interface HumanVerificationViewProps {
  documents: CBAMDocument[];
  onConfirmField: (documentId: string, fieldId: string) => void;
  onEditField: (documentId: string, fieldId: string, newValue: string, notes: string) => void;
  onRejectField: (documentId: string, fieldId: string) => void;
  onOpenDocumentViewer: (documentId: string, fieldKey?: string) => void;
}

export const HumanVerificationView: React.FC<HumanVerificationViewProps> = ({
  documents,
  onConfirmField,
  onEditField,
  onRejectField,
  onOpenDocumentViewer,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  // Flatten all fields across documents
  const allFieldItems: { document: CBAMDocument; field: ExtractedField }[] = [];
  documents.forEach((doc) => {
    doc.extractedFields.forEach((field) => {
      allFieldItems.push({ document: doc, field });
    });
  });

  const filteredItems = allFieldItems.filter((item) => {
    if (filterMode === 'pending') return item.field.status === 'ai_proposed';
    if (filterMode === 'confirmed') return item.field.status === 'human_confirmed' || item.field.status === 'edited';
    return true;
  });

  const pendingCount = allFieldItems.filter((i) => i.field.status === 'ai_proposed').length;
  const confirmedCount = allFieldItems.filter(
    (i) => i.field.status === 'human_confirmed' || i.field.status === 'edited'
  ).length;

  const handleStartEdit = (field: ExtractedField) => {
    setEditingFieldId(field.id);
    setEditValue(field.value);
    setEditNotes(field.notes || '');
  };

  const handleSaveEdit = (documentId: string, fieldId: string) => {
    onEditField(documentId, fieldId, editValue, editNotes);
    setEditingFieldId(null);
  };

  const verificationPercent = Math.round((confirmedCount / (allFieldItems.length || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* 3D Gatekeeper Header */}
      <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 backdrop-blur-md shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-32 bg-radial from-[var(--cyber-emerald)]/15 via-transparent to-transparent pointer-events-none blur-2xl" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-[var(--cyber-emerald)] uppercase mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Compliance Gatekeeper Protocol</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyber-emerald)] animate-pulse" />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
              Human Evidence Sign-off
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              EU CBAM Implementing Act requires explicit human verification for every supplier field before the deterministic engine executes.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-subtle)] p-1">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filterMode === 'all'
                  ? 'bg-[var(--cyber-cyan)] text-black font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              All ({allFieldItems.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('pending')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filterMode === 'pending'
                  ? 'bg-[var(--cyber-amber)] text-black font-bold shadow-sm'
                  : 'text-[var(--cyber-amber)] hover:text-[var(--cyber-amber)]/80'
              }`}
            >
              Awaiting Audit ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('confirmed')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filterMode === 'confirmed'
                  ? 'bg-[var(--cyber-emerald)] text-black font-bold shadow-sm'
                  : 'text-[var(--cyber-emerald)] hover:text-[var(--cyber-emerald)]/80'
              }`}
            >
              Verified Inputs ({confirmedCount})
            </button>
          </div>
        </div>

        {/* Verification Progress Bar */}
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-4 text-xs">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[var(--text-secondary)] text-[11px] font-mono">
                Audit Clearance Progress: {confirmedCount} of {allFieldItems.length} items locked
              </span>
              <span className="font-mono font-bold text-[var(--cyber-emerald)]">
                {verificationPercent}% Complete
              </span>
            </div>
            <div className="h-2 w-full bg-[var(--surface-sunken)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
              <div
                className="h-full bg-gradient-to-r from-[var(--cyber-cyan)] via-[var(--cyber-emerald)] to-[var(--cyber-emerald)] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                style={{ width: `${verificationPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Verification Items List with 3D Tilt Cards */}
      <div className="space-y-4">
        {filteredItems.map(({ document, field }) => {
          const isEditing = editingFieldId === field.id;
          const isVerified = field.status === 'human_confirmed' || field.status === 'edited';

          return (
            <Card3D
              key={`${document.id}-${field.id}`}
              depth={10}
              maxRotation={5}
              className={`p-5 rounded-xl border transition-all ${
                isVerified
                  ? 'border-[var(--cyber-emerald)]/30 hover:border-[var(--cyber-emerald)]/60 bg-[var(--surface)]'
                  : field.lowConfidenceFlag
                  ? 'border-[var(--cyber-amber)]/40 hover:border-[var(--cyber-amber)]/70 bg-[var(--surface)]'
                  : 'border-[var(--border-subtle)] hover:border-[var(--cyber-cyan)]/40 bg-[var(--surface)]'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Column 1: Field details & Label */}
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-[var(--text-primary)]">{field.label}</span>
                    {field.lowConfidenceFlag && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[var(--cyber-amber)] bg-[var(--cyber-amber)]/10 px-2 py-0.5 rounded border border-[var(--cyber-amber)]/30">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Flagged Anomaly
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-1 font-mono">
                    <span className="text-[var(--cyber-cyan)]">{field.fieldKey}</span>
                    <span>•</span>
                    <span>Confidence: {Math.round(field.confidence * 100)}%</span>
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-0.5 flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-[var(--cyber-cyan)]" />
                    <span>{document.productName} · {document.supplier}</span>
                  </div>
                </div>

                {/* Column 2: Extracted Value / Edit form */}
                <div className="lg:col-span-3">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="Value"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--cyber-cyan)] text-xs font-mono font-medium text-[var(--text-primary)] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Audit justification..."
                        className="w-full px-2.5 py-1 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-primary)] focus:outline-none"
                      />
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(document.id, field.id)}
                          className="px-2.5 py-1 rounded bg-[var(--cyber-cyan)] text-black text-xs font-bold"
                        >
                          <Save className="w-3 h-3 inline mr-1" />
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingFieldId(null)}
                          className="px-2.5 py-1 rounded bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[10px] uppercase font-mono font-bold text-[var(--text-muted)] tracking-wider mb-0.5">
                        Extracted Value
                      </div>
                      <div className="font-mono text-base font-bold text-[var(--text-primary)]">
                        {field.value}
                      </div>
                      {field.notes && (
                        <div className="text-[11px] text-[var(--text-secondary)] italic mt-0.5">
                          {field.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Column 3: Source Location */}
                <div className="lg:col-span-2 text-xs">
                  <div className="text-[10px] uppercase font-mono font-bold text-[var(--text-muted)] tracking-wider mb-0.5">
                    Source Coordinate
                  </div>
                  <div className="font-mono text-xs text-[var(--cyber-cyan)] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Page {field.boundingBox.page}</span>
                  </div>
                  <div className="font-mono text-[11px] text-[var(--text-muted)]">
                    x={field.boundingBox.x}, y={field.boundingBox.y}
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenDocumentViewer(document.id, field.fieldKey)}
                    className="inline-flex items-center gap-1 text-[11px] text-[var(--cyber-cyan)] hover:underline font-mono font-medium mt-1"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    Inspect on PDF
                  </button>
                </div>

                {/* Column 4: Verification Gatekeeper Actions */}
                <div className="lg:col-span-3 flex flex-col items-end gap-2">
                  <VerificationStateBadge status={field.status} verifiedBy={field.verifiedBy} />

                  {!isEditing && (
                    <div className="flex items-center gap-2">
                      {field.status !== 'human_confirmed' ? (
                        <button
                          type="button"
                          onClick={() => onConfirmField(document.id, field.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-emerald)] text-black hover:opacity-90 shadow-sm transition-all hover:scale-105 active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm</span>
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-[var(--cyber-emerald)] font-semibold bg-[var(--cyber-emerald)]/10 px-2.5 py-1 rounded-md border border-[var(--cyber-emerald)]/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleStartEdit(field)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface-sunken)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--cyber-cyan)] transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>

                      {field.status !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => onRejectField(document.id, field.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"
                          title="Reject unverified field"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card3D>
          );
        })}
      </div>
    </div>
  );
};

