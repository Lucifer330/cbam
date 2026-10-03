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

interface ExtractionPanelProps {
  document: CBAMDocument;
  highlightedFieldKey?: string | null;
  onHoverField?: (fieldKey: string | null) => void;
  onSelectField?: (fieldKey: string) => void;
  onConfirmField: (fieldId: string) => void;
  onEditField: (fieldId: string, newValue: string, notes: string) => void;
  onRejectField: (fieldId: string) => void;
  onRunCalculation: (documentId: string) => void;
}

export const ExtractionPanel: React.FC<ExtractionPanelProps> = ({
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
    <div className="flex flex-col h-full bg-[#ffffff] border border-[#e2e2dc] rounded-[6px] overflow-hidden">
      {/* Panel Header */}
      <div className="px-5 py-3.5 bg-[#fbfbfa] border-b border-[#e5e5de] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#191c1e] tracking-tight">
            Extracted Fields & Verification
          </h2>
          <p className="text-xs text-[#5a6065]">
            Evidence for {document.productName} ({document.cnCode})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#5a6065]">
            {confirmedCount}/{totalCount} Confirmed
          </span>
          <div className="w-16 h-1.5 bg-[#ecece6] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1b6830] transition-all duration-300"
              style={{ width: `${(confirmedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mandatory Non-Autonomous Notice Banner */}
      <div className="p-3.5 bg-[#fef8eb] border-b border-[#f8dfaa] flex items-start gap-2.5 text-xs text-[#9e5d03]">
        <ShieldAlert className="w-4 h-4 text-[#b46908] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-[#804b02]">AI proposed these candidate values. </span>
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
              className={`p-3.5 rounded-[5px] border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#f7f9f7] border-[#3d5042] shadow-xs'
                  : 'bg-[#ffffff] border-[#e5e5de] hover:border-[#d2d2c8]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-[#191c1e]">{field.label}</span>
                    {field.lowConfidenceFlag && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-[#a82323] bg-[#fdf2f2] px-1.5 py-0.2 rounded border border-[#f7cece]">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Low Confidence
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[10px] text-[#5a6065] flex items-center gap-1 bg-[#f0f0eb] px-1.5 py-0.5 rounded border border-[#e0e0d8]">
                      <MapPin className="w-2.5 h-2.5 text-[var(--cyber-cyan)]" />
                      Vakh Coords: P.{field.pdfPage ?? field.boundingBox.page} (Top: {field.highlightBox?.top ?? field.boundingBox.y}px, Left: {field.highlightBox?.left ?? field.boundingBox.x}px)
                    </span>
                    <span className="text-[10px] font-mono text-[#5a6065]">
                      Confidence: {Math.round(field.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <VerificationStateBadge status={field.status} verifiedBy={field.verifiedBy} />
              </div>

              {/* Field Value Display or Edit Input */}
              {isEditing ? (
                <div className="mt-2 p-2.5 rounded-[4px] bg-[#fbfbfa] border border-[#e2e2dc] space-y-2 text-xs">
                  <div>
                    <label htmlFor={`edit-val-${field.id}`} className="text-[11px] text-[#5a6065] font-medium block mb-1">
                      Auditor Corrected Value:
                    </label>
                    <input
                      id={`edit-val-${field.id}`}
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-[4px] bg-white border border-[#d8d8ce] text-xs font-mono font-medium text-[#191c1e] focus:outline-none focus:border-[#3d5042]"
                    />
                  </div>
                  <div>
                    <label htmlFor={`edit-notes-${field.id}`} className="text-[11px] text-[#5a6065] font-medium block mb-1">
                      Compliance Audit Justification (Synced with Vakh Space):
                    </label>
                    <input
                      id={`edit-notes-${field.id}`}
                      type="text"
                      value={editNotes}
                      placeholder="e.g. Cross-referenced against customs bill of lading"
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-[4px] bg-white border border-[#d8d8ce] text-xs text-[#191c1e] focus:outline-none focus:border-[#3d5042]"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingFieldId(null)}
                      className="px-2.5 py-1 rounded-[4px] bg-white border border-[#e5e5de] text-xs text-[#5a6065] hover:text-[#191c1e]"
                    >
                      <X className="w-3 h-3 inline mr-1" />
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => saveEdit(field.id)}
                      className="px-2.5 py-1 rounded-[4px] bg-[#191c1e] text-white text-xs font-medium hover:bg-[#2d3134]"
                    >
                      <Save className="w-3 h-3 inline mr-1" />
                      Save & Sync to Vakh
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex items-center justify-between">
                  <div className="font-mono text-sm font-semibold text-[#191c1e]">
                    {field.value}
                  </div>

                  {/* Actions: Trace Source, Confirm, Edit */}
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onSelectField && onSelectField(field.fieldKey)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-[4px] text-xs font-medium bg-[#f0f4f8] text-[#1b4368] border border-[#cbd9e7] hover:bg-[#e1ecf7] transition-colors"
                      title="Trace source coordinates from Vakh payload"
                    >
                      <Sparkles className="w-3 h-3 text-[var(--cyber-cyan)]" />
                      Trace Source
                    </button>

                    {field.status !== 'human_confirmed' ? (
                      <button
                        type="button"
                        onClick={() => onConfirmField(field.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] text-xs font-medium bg-[#ecf7ef] text-[#1b6830] border border-[#c8e6ce] hover:bg-[#dff2e3] transition-colors"
                        title="Sign off as verified input and sync to Vakh"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Confirm
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#1b6830] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => startEdit(field)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-[4px] text-xs font-medium bg-white text-[#5a6065] border border-[#e5e5de] hover:text-[#191c1e] hover:bg-[#f6f6f3] transition-colors"
                      title="Edit value and document justification"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                </div>
              )}

              {field.notes && !isEditing && (
                <div className="mt-1.5 pt-1.5 border-t border-[#f0f0eb] text-[11px] text-[#5a6065] italic">
                  Note: {field.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Calculation Trigger */}
      <div className="p-4 bg-[#fbfbfa] border-t border-[#e5e5de] space-y-2">
        <button
          type="button"
          onClick={() => onRunCalculation(document.id)}
          disabled={!allConfirmed}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[4px] text-xs font-medium transition-all ${
            allConfirmed
              ? 'bg-[#191c1e] text-white hover:bg-[#2d3134] shadow-xs cursor-pointer'
              : 'bg-[#f0f0eb] text-[#848a90] border border-[#e2e2dc] cursor-not-allowed'
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

        <p className="text-[11px] text-[#848a90] text-center">
          Calculations are strictly deterministic under EU Implementing Act 2023/1773.
        </p>
      </div>
    </div>
  );
};
