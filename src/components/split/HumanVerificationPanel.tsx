import React, { useState } from 'react';
import type { CBAMDocument, ExtractedField } from '../../types/cbam';
import { VerificationStateBadge } from '../common/StatusBadge';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Edit3, 
  MapPin, 
  ArrowRight, 
  AlertTriangle, 
  Calculator, 
  Save, 
  X,
  Sparkles
} from 'lucide-react';

export interface HumanVerificationPanelProps {
  document: CBAMDocument;
  highlightedFieldKey?: string | null;
  onHoverField?: (fieldKey: string | null) => void;
  onSelectField?: (fieldKey: string) => void;
  onConfirmField: (fieldId: string) => void;
  onEditField: (fieldId: string, newValue: string, notes: string) => void;
  onRejectField: (fieldId: string) => void;
  onRunCalculation: (documentId: string) => void;
}

export const HumanVerificationPanel: React.FC<HumanVerificationPanelProps> = ({
  document,
  highlightedFieldKey,
  onHoverField,
  onSelectField,
  onConfirmField,
  onEditField,
  onRejectField,
  onRunCalculation,
}) => {
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  const confirmedCount = document.extractedFields.filter(
    (f) => f.status === 'human_confirmed' || f.status === 'edited'
  ).length;
  const totalCount = document.extractedFields.length;
  const allConfirmed = confirmedCount === totalCount;

  const startEdit = (field: ExtractedField) => {
    setEditingFieldId(field.id);
    setEditValue(field.value);
    setEditNotes(field.notes || '');
  };

  const saveEdit = (fieldId: string) => {
    onEditField(fieldId, editValue, editNotes);
    setEditingFieldId(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#ffffff] dark:bg-slate-950 border border-[#e2e2dc] dark:border-slate-800 rounded-[6px] overflow-hidden">
      {/* Panel Header */}
      <div className="px-5 py-3.5 bg-[#fbfbfa] dark:bg-slate-900/80 border-b border-[#e5e5de] dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#191c1e] dark:text-slate-100 tracking-tight">
            Extracted Fields & Verification
          </h2>
          <p className="text-xs text-[#5a6065] dark:text-slate-400">
            Evidence for {document.productName} ({document.cnCode})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#5a6065] dark:text-slate-400">
            {confirmedCount}/{totalCount} Confirmed
          </span>
          <div className="w-16 h-1.5 bg-[#ecece6] dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1b6830] dark:bg-emerald-500 transition-all duration-300"
              style={{ width: `${(confirmedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mandatory Non-Autonomous Notice Banner */}
      <div className="p-3.5 bg-[#fef8eb] dark:bg-amber-950/30 border-b border-[#f8dfaa] dark:border-amber-800/40 flex items-start gap-2.5 text-xs text-[#9e5d03] dark:text-amber-300">
        <ShieldAlert className="w-4 h-4 text-[#b46908] dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-[#804b02] dark:text-amber-200">AI proposed these candidate values. </span>
          Human verification is strictly required by the compliance gatekeeper before the deterministic rules engine can calculate embedded emissions.
        </div>
      </div>

      {/* Field List Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {document.extractedFields.map((field) => {
          const isSelected = highlightedFieldKey === field.fieldKey;
          const isEditing = editingFieldId === field.id;

          return (
            <div
              key={field.id}
              onMouseEnter={() => onHoverField && onHoverField(field.fieldKey)}
              onMouseLeave={() => onHoverField && onHoverField(null)}
              onClick={() => onSelectField && onSelectField(field.fieldKey)}
              className={`p-4 flex flex-col justify-between gap-3 rounded-[6px] border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#f7f9f7] dark:bg-[#102018] border-[#3d5042] dark:border-emerald-500/60 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-[#ffffff] dark:bg-[#0c1219] border-[#e5e5de] dark:border-[#1e293b] hover:border-[#d2d2c8] dark:hover:border-[#334155]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#191c1e] dark:text-[#f1f5f9]">{field.label}</span>
                    {field.lowConfidenceFlag && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-[#a82323] bg-[#fdf2f2] dark:bg-red-950/40 dark:text-red-400 px-1.5 py-0.2 rounded border border-[#f7cece] dark:border-red-900/40">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Low Confidence
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="font-mono text-[10px] text-[#5a6065] dark:text-[#94a3b8] flex items-center gap-1 bg-[#f0f0eb] dark:bg-[#16202e] px-1.5 py-0.5 rounded border border-[#e0e0d8] dark:border-[#334155]">
                      <MapPin className="w-2.5 h-2.5 text-[var(--cyber-cyan)]" />
                      Vakh Coords: P.{field.pdfPage ?? field.boundingBox.page} (Top: {field.highlightBox?.top ?? field.boundingBox.y}px, Left: {field.highlightBox?.left ?? field.boundingBox.x}px)
                    </span>
                    <span className="text-[10px] font-mono text-[#5a6065] dark:text-[#94a3b8]">
                      Confidence: {Math.round(field.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <VerificationStateBadge status={field.status} verifiedBy={field.verifiedBy} />
              </div>

              {/* Field Value Display or Edit Input */}
              {isEditing ? (
                <div className="p-3 rounded-[4px] bg-[#fbfbfa] dark:bg-[#16202e] border border-[#e2e2dc] dark:border-[#334155] space-y-2.5 text-xs">
                  <div>
                    <label htmlFor={`edit-val-${field.id}`} className="text-[11px] text-[#5a6065] dark:text-[#94a3b8] font-medium block mb-1">
                      Auditor Corrected Value:
                    </label>
                    <input
                      id={`edit-val-${field.id}`}
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-[4px] bg-white dark:bg-[#0c1219] border border-[#d8d8ce] dark:border-[#334155] text-xs font-mono font-medium text-[#191c1e] dark:text-white focus:outline-none focus:border-[#3d5042]"
                    />
                  </div>
                  <div>
                    <label htmlFor={`edit-notes-${field.id}`} className="text-[11px] text-[#5a6065] dark:text-[#94a3b8] font-medium block mb-1">
                      Compliance Audit Justification (Synced with Vakh Space):
                    </label>
                    <input
                      id={`edit-notes-${field.id}`}
                      type="text"
                      value={editNotes}
                      placeholder="e.g. Cross-referenced against customs bill of lading"
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-[4px] bg-white dark:bg-[#0c1219] border border-[#d8d8ce] dark:border-[#334155] text-xs text-[#191c1e] dark:text-white focus:outline-none focus:border-[#3d5042]"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingFieldId(null)}
                      className="px-2.5 py-1 rounded-[4px] bg-white dark:bg-[#1e293b] border border-[#e5e5de] dark:border-[#334155] text-xs text-[#5a6065] dark:text-[#cbd5e1] hover:text-[#191c1e]"
                    >
                      <X className="w-3 h-3 inline mr-1" />
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => saveEdit(field.id)}
                      className="px-2.5 py-1 rounded-[4px] bg-[#191c1e] dark:bg-[#10b981] text-white dark:text-[#022c22] text-xs font-bold hover:bg-[#2d3134] dark:hover:bg-[#059669]"
                    >
                      <Save className="w-3 h-3 inline mr-1" />
                      Save & Sync to Vakh
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#f0f0eb] dark:border-[#1e293b]">
                  <div className="font-mono text-sm font-bold text-[#191c1e] dark:text-[#f8fafc]">
                    {field.value}
                  </div>

                  {/* Actions: Trace Source, Confirm, Edit */}
                  <div className="flex flex-wrap items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onSelectField && onSelectField(field.fieldKey)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] text-xs font-medium bg-[#f0f4f8] text-[#1b4368] border border-[#cbd9e7] hover:bg-[#e1ecf7] transition-colors cursor-pointer"
                      title="Trace source coordinates from Vakh payload"
                    >
                      <Sparkles className="w-3 h-3 text-[var(--cyber-cyan)]" />
                      Trace Source
                    </button>

                    {field.status !== 'human_confirmed' ? (
                      <button
                        type="button"
                        onClick={() => onConfirmField(field.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] text-xs font-medium bg-[#ecf7ef] text-[#1b6830] border border-[#c8e6ce] hover:bg-[#dff2e3] transition-colors cursor-pointer"
                        title="Sign off as verified input and sync to Vakh"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Confirm
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#1b6830] dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => startEdit(field)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] text-xs font-medium bg-white dark:bg-[#1e293b] text-[#5a6065] dark:text-[#cbd5e1] border border-[#e5e5de] dark:border-[#334155] hover:text-[#191c1e] dark:hover:text-white transition-colors cursor-pointer"
                      title="Edit value and document justification"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                </div>
              )}

              {field.notes && !isEditing && (
                <div className="p-2.5 bg-[#f8fafc] dark:bg-slate-900/60 rounded border border-[#e2e8f0] dark:border-slate-800 text-[11px] text-[#64748b] dark:text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-600 dark:text-slate-300 not-italic">Auditor Note: </span>
                  {field.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Footer Calculation Trigger */}
      <div className="sticky bottom-0 bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-md py-3 px-4 border-t border-slate-800 z-20 shadow-lg space-y-2">
        <button
          type="button"
          onClick={() => onRunCalculation(document.id)}
          disabled={!allConfirmed}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[4px] text-xs font-semibold transition-all ${
            allConfirmed
              ? 'bg-[#10b981] hover:bg-[#059669] text-[#022c22] font-bold shadow-md shadow-emerald-500/20 cursor-pointer'
              : 'bg-[#f0f0eb] dark:bg-[#16202e] text-[#848a90] dark:text-[#64748b] border border-[#e2e2dc] dark:border-[#334155] cursor-not-allowed'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>
            {allConfirmed
              ? 'Execute Deterministic Rule Engine (v2026.1)'
              : `Confirm All Fields to Unlock Calculation (${confirmedCount}/${totalCount})`}
          </span>
          {allConfirmed && <ArrowRight className="w-3.5 h-3.5" />}
        </button>

        <p className="text-[11px] text-[#848a90] dark:text-[#64748b] text-center font-mono">
          Calculations are strictly deterministic under EU Implementing Act 2023/1773.
        </p>
      </div>
    </div>
  );
};

export { HumanVerificationPanel as ExtractionPanel };
