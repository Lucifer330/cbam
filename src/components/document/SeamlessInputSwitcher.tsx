import React, { useState, useRef } from 'react';
import type { CBAMDocument } from '../../types/cbam';
import { vakhService } from '../../services/vakhService';
import { 
  UploadCloud, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Zap, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface SeamlessInputSwitcherProps {
  onLoadPreFilledDemo: () => void;
  onDocumentUploaded: (newDoc: CBAMDocument) => void;
  className?: string;
}

export const SeamlessInputSwitcher: React.FC<SeamlessInputSwitcherProps> = ({
  onLoadPreFilledDemo,
  onDocumentUploaded,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    // Generate pseudo SHA-256 fingerprint
    const pseudoHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    // Create new CBAM Document with Vakh schema coordinates
    const newDoc: CBAMDocument = {
      id: `doc-upload-${Date.now()}`,
      vakhItemId: `vakh_item_upload_${Date.now()}`,
      vakhBoardId: vakhService.getConfig().boardId,
      vakhSpaceId: vakhService.getConfig().spaceId,
      filename: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      sha256: pseudoHash,
      supplier: 'Salzgitter AG Euro-Mills',
      supplierCountry: 'DE (Germany)',
      importer: 'Alpine Metal Works AG [AT83920192]',
      productName: 'Structural Steel Heavy Sections (HEB 300)',
      cnCode: '7216 32 00',
      goodsCategory: 'Iron & Steel',
      documentType: 'Mill test cert',
      uploadedAt: 'Just now',
      updatedAt: 'Just now',
      status: 'Needs verification',
      auditStatus: 'Needs Review',
      auditNotes: 'Awaiting primary auditor bounding box confirmation.',
      traceabilityPercent: 75,
      installationName: 'Salzgitter Flachstahl Smelter #3',
      installationCountry: 'DE',
      productionRoute: 'Electric Arc Furnace (EAF) + DRI',
      extractedFields: [
        {
          id: `fld-${Date.now()}-1`,
          fieldKey: 'net_mass',
          label: 'Net mass',
          value: '850 t',
          numericValue: 850,
          unit: 't',
          confidence: 0.98,
          status: 'ai_proposed',
          pdfPage: 1,
          highlightBox: { top: 382, left: 140, width: 140, height: 26 },
          boundingBox: { page: 1, x: 140, y: 382, width: 140, height: 26 },
          notes: 'Extracted from Mill test delivery slip summary'
        },
        {
          id: `fld-${Date.now()}-2`,
          fieldKey: 'emissions_direct',
          label: 'Direct specific emissions',
          value: '1.42 tCO₂e/t',
          numericValue: 1.42,
          unit: 'tCO₂e/t',
          confidence: 0.92,
          status: 'ai_proposed',
          pdfPage: 1,
          highlightBox: { top: 418, left: 132, width: 160, height: 26 },
          boundingBox: { page: 1, x: 132, y: 418, width: 160, height: 26 },
          notes: 'Scope 1 certified by TÜV NORD'
        },
        {
          id: `fld-${Date.now()}-3`,
          fieldKey: 'emissions_indirect',
          label: 'Indirect specific emissions',
          value: '0.22 tCO₂e/t',
          numericValue: 0.22,
          unit: 'tCO₂e/t',
          confidence: 0.91,
          status: 'ai_proposed',
          pdfPage: 1,
          highlightBox: { top: 452, left: 132, width: 160, height: 26 },
          boundingBox: { page: 1, x: 132, y: 452, width: 160, height: 26 },
          notes: 'German renewable electricity mix factor'
        }
      ]
    };

    setTimeout(() => {
      setIsProcessing(false);
      onDocumentUploaded(newDoc);
    }, 450);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 ${className}`}>
      {/* 1. Drag & Drop PDF Dropzone (7 cols) */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`md:col-span-7 p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-md ${
          isDragging
            ? 'border-[var(--cyber-cyan)] bg-[var(--cyber-cyan)]/10 shadow-lg shadow-[var(--cyber-cyan)]/20 scale-[1.01]'
            : 'border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--cyber-cyan)]/50 hover:bg-[var(--surface-sunken)]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--cyber-cyan)]/20 to-[var(--cyber-purple)]/20 border border-[var(--cyber-cyan)]/30 flex items-center justify-center mb-3">
          <UploadCloud className="w-6 h-6 text-[var(--cyber-cyan)] animate-bounce" />
        </div>

        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">
          {isProcessing ? 'Fingerprinting & Parsing Coordinates...' : 'Drop CBAM Evidence PDF (Invoice, EPD, Cert)'}
        </h3>
        <p className="text-xs text-[var(--text-secondary)] max-w-sm mb-3">
          Automatic SHA-256 fingerprinting & instant Vakh coordinate OCR bounding box ingestion.
        </p>

        <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface-sunken)] px-3 py-1 rounded-full border border-[var(--border-subtle)]">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Strict EU Implementing Regulation 2023/1773</span>
        </div>
      </div>

      {/* 2. High-Visibility Demo Data Quick Trigger (5 cols) */}
      <div className="md:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-[var(--surface)] via-[var(--surface-sunken)] to-[#121820] border border-[var(--cyber-cyan)]/30 flex flex-col justify-between shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--cyber-cyan)]/10 rounded-full blur-2xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--cyber-cyan)] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[var(--cyber-cyan)]" /> Quick Hackathon Launcher
            </span>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
              Instant
            </span>
          </div>

          <h4 className="text-base font-bold text-[var(--text-primary)] tracking-tight mb-1">
            Load Pre-filled CBAM Demo Data
          </h4>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
            Instantaneously stream fully resolved European customs declarations, Vakh coordinates, and sector benchmark metrics into the Split-Pane.
          </p>
        </div>

        <button
          type="button"
          onClick={onLoadPreFilledDemo}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[var(--cyber-cyan)] via-emerald-400 to-[var(--cyber-purple)] text-black text-xs font-bold flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-[var(--cyber-cyan)]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>Load Pre-filled CBAM Demo Data</span>
          <ArrowRight className="w-3.5 h-3.5 text-black" />
        </button>
      </div>
    </div>
  );
};
