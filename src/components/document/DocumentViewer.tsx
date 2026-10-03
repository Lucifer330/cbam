import React, { useState } from 'react';
import type { CBAMDocument, ExtractedField } from '../../types/cbam';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  FileText, 
  ShieldCheck, 
  Hash, 
  MapPin, 
  Layers
} from 'lucide-react';

interface DocumentViewerProps {
  document: CBAMDocument;
  highlightedFieldKey?: string | null;
  onSelectField?: (fieldKey: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  highlightedFieldKey,
  onSelectField,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showOverlays, setShowOverlays] = useState<boolean>(true);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev: number) => Math.min(Math.max(prev + delta, 70), 160));
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f4f0] border border-[#e2e2dc] rounded-[6px] overflow-hidden">
      {/* Top Document Toolbar */}
      <div className="px-4 py-2.5 bg-[#fbfbfa] border-b border-[#e5e5de] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <FileText className="w-4 h-4 text-[#3d5042] shrink-0" />
          <span className="font-medium text-[#191c1e] truncate" title={document.filename}>
            {document.filename}
          </span>
          <span className="font-mono text-[11px] text-[#5a6065] bg-[#ecece6] px-1.5 py-0.5 rounded">
            {document.fileSize}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Page Selector */}
          <div className="flex items-center gap-1 text-[#5a6065] text-xs">
            <span>Page</span>
            <span className="font-mono font-medium text-[#191c1e]">{currentPage}</span>
            <span>of 2</span>
          </div>

          <div className="h-4 w-px bg-[#e5e5de]" />

          {/* Overlays toggle */}
          <button
            type="button"
            onClick={() => setShowOverlays(!showOverlays)}
            className={`px-2 py-1 rounded-[4px] text-xs font-medium transition-colors flex items-center gap-1 ${
              showOverlays
                ? 'bg-[#eaf0eb] text-[#2c3d31] border border-[#c8e6ce]'
                : 'bg-white text-[#5a6065] border border-[#e5e5de] hover:bg-[#f6f6f3]'
            }`}
            title="Toggle OCR Coordinate Bounding Boxes"
          >
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline">Bounding Boxes</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center rounded-[4px] bg-white border border-[#e5e5de]">
            <button
              type="button"
              onClick={() => handleZoom(-10)}
              className="p-1 text-[#5a6065] hover:text-[#191c1e] hover:bg-[#f6f6f3]"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-[#191c1e] min-w-[42px] text-center">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => handleZoom(10)}
              className="p-1 text-[#5a6065] hover:text-[#191c1e] hover:bg-[#f6f6f3]"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Document Canvas Container */}
      <div className="flex-1 overflow-auto p-4 flex justify-center items-start">
        <div 
          className="relative bg-white shadow-md border border-[#d8d8ce] transition-transform origin-top text-black"
          style={{
            width: '640px',
            minHeight: '860px',
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            marginBottom: zoomLevel > 100 ? `${(zoomLevel - 100) * 8}px` : '0px'
          }}
        >
          {/* Simulated Authentic European Customs Commercial Invoice */}
          <div className="p-8 text-[12px] leading-relaxed select-text font-serif text-[#1e2225]">
            {/* Invoice Header */}
            <div className="border-b-2 border-[#191c1e] pb-4 mb-6 flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#111315] uppercase font-sans">
                  {document.supplier}
                </h1>
                <p className="text-[11px] text-[#555] font-sans mt-0.5">
                  Organized Industrial Zone No. 42, Gebze / Kocaeli, Republic of Turkey
                </p>
                <p className="text-[11px] text-[#555] font-sans">
                  VAT/Tax ID: TR-9402817201 · EORI Equivalent: TR940281
                </p>
              </div>
              <div className="text-right font-sans">
                <div className="inline-block px-2 py-0.5 bg-[#f0f0eb] border border-[#d4d4ca] font-mono text-[10px] font-semibold tracking-wider text-[#333] mb-1">
                  CBAM EVIDENCE INVOICE
                </div>
                <div className="font-mono text-xs font-semibold text-[#111]">
                  INV-2026-TR-0042
                </div>
                <div className="text-[11px] text-[#666]">
                  Date of Issue: 2026-09-30
                </div>
              </div>
            </div>

            {/* Importer / Consignee */}
            <div className="grid grid-cols-2 gap-6 mb-6 font-sans text-xs">
              <div className="p-3 bg-[#fafaf8] border border-[#e5e5de] rounded-[3px]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#777] mb-1">
                  CONSIGNEE (EU IMPORTER / CBAM DECLARANT)
                </div>
                <div className="font-semibold text-[#111]">{document.importer}</div>
                <div className="text-[#555] text-[11px]">Kaiser-Wilhelm-Straße 100</div>
                <div className="text-[#555] text-[11px]">47166 Duisburg, Federal Republic of Germany</div>
                <div className="text-[10px] font-mono text-[#3d5042] font-semibold mt-1">
                  EORI: DE94827103 · Declarant Auth #CBAM-DE-2024-81
                </div>
              </div>

              <div className="p-3 bg-[#fafaf8] border border-[#e5e5de] rounded-[3px]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#777] mb-1">
                  PRODUCTION INSTALLATION DETAILS
                </div>
                <div className="font-semibold text-[#111]">{document.installationName}</div>
                <div className="text-[#555] text-[11px]">Route: {document.productionRoute}</div>
                <div className="text-[#555] text-[11px]">Country: {document.installationCountry} (Installation ID: TR-00912-EAF)</div>
                <div className="text-[10px] text-[#3d5042] font-medium mt-1">
                  Accreditation: ISO 14064-1 & Implementing Reg 2023/1773
                </div>
              </div>
            </div>

            {/* Goods Specification Table */}
            <div className="mb-6 font-sans">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#444] mb-2">
                Line Items & Customs Classification
              </div>
              <table className="w-full border-collapse border border-[#ccc] text-xs">
                <thead>
                  <tr className="bg-[#f0f0ea] border-b border-[#ccc] text-left text-[11px]">
                    <th className="p-2 border-r border-[#ccc]">Item</th>
                    <th className="p-2 border-r border-[#ccc]">Description of Goods</th>
                    <th className="p-2 border-r border-[#ccc]">CN Code (TARIC)</th>
                    <th className="p-2 border-r border-[#ccc] text-right">Net Mass</th>
                    <th className="p-2 text-right">Unit Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#eee]">
                    <td className="p-2 font-mono border-r border-[#eee]">01</td>
                    <td className="p-2 border-r border-[#eee]">
                      <div className="font-semibold">{document.productName}</div>
                      <div className="text-[10px] text-[#666]">Grade EN 10025-2 S235JR · Coils thickness 3.0mm</div>
                    </td>
                    <td className="p-2 font-mono border-r border-[#eee] relative">
                      <span className="font-semibold text-[#111]">{document.cnCode}</span>
                    </td>
                    <td className="p-2 font-mono font-semibold text-right border-r border-[#eee]">
                      1,000.00 MT
                    </td>
                    <td className="p-2 font-mono text-right">
                      EUR 620.00 / t
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CBAM SPECIFIC EMBEDDED EMISSIONS SCHEDULE (ANNEX IV EU 2023/956) */}
            <div className="mb-6 p-4 bg-[#fbfbfa] border-2 border-[#d5d5ca] rounded-[3px] font-sans">
              <div className="flex items-center justify-between border-b border-[#e0e0d6] pb-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#191c1e] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3d5042]" />
                  CBAM Annex IV Embedded Emissions Declaration
                </span>
                <span className="text-[10px] font-mono text-[#555]">
                  Method: Actual Installation Data (Monitoring Period Q3)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-[11px] text-[#666]">Direct Specific Emissions (Attr_Dir_Emiss):</div>
                  <div className="font-mono text-sm font-bold text-[#111] mt-0.5">
                    1.60 tCO₂e / t steel
                  </div>
                  <div className="text-[10px] text-[#777] mt-0.5">Scope 1 combustion & process off-gas</div>
                </div>

                <div>
                  <div className="text-[11px] text-[#666]">Indirect Specific Emissions (Attr_Indir_Emiss):</div>
                  <div className="font-mono text-sm font-bold text-[#111] mt-0.5">
                    0.30 tCO₂e / t steel
                  </div>
                  <div className="text-[10px] text-[#777] mt-0.5">Scope 2 electricity grid factor TR (0.420 kg/kWh)</div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#e0e0d6] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#666]">Total Specific Embedded Emissions: </span>
                  <span className="font-mono font-bold text-[#111]">1.90 tCO₂e / t</span>
                </div>
                <div>
                  <span className="text-[#666]">Effective Carbon Price Paid: </span>
                  <span className="font-mono font-bold text-[#111]">0.00 EUR / t</span>
                </div>
              </div>
            </div>

            {/* Verification Signatures & Stamp */}
            <div className="pt-4 border-t border-[#ccc] flex justify-between items-end font-sans text-[11px]">
              <div>
                <div className="text-[10px] text-[#777] mb-1">SUPPLIER QUALITY & EMISSIONS VERIFIER:</div>
                <div className="font-semibold text-[#111]">Bureau Veritas Certification Turkey</div>
                <div className="text-[#666]">Lead Accredited Auditor: M. Çelebi</div>
                <div className="font-mono text-[9px] text-[#888] mt-0.5">Accreditation #TURKAK-AB-0142-YS</div>
              </div>

              <div className="text-right">
                <div className="w-28 h-16 border border-dashed border-[#999] rounded flex flex-col items-center justify-center bg-[#fdfdfd] p-1 text-center">
                  <div className="text-[9px] font-bold text-[#3d5042] tracking-wider uppercase">CUSTOMS ATTESTATION</div>
                  <div className="text-[8px] text-[#666] mt-0.5">EUR.1 Validated</div>
                  <div className="font-mono text-[8px] text-[#888]">STAMP TR-7102</div>
                </div>
              </div>
            </div>
          </div>

          {/* INTERACTIVE BOUNDING BOX OVERLAYS (Extracted directly from Vakh Item Schema Properties) */}
          {showOverlays && (
            <div className="absolute inset-0 pointer-events-none">
              {document.extractedFields.map((field) => {
                const isSelected = highlightedFieldKey === field.fieldKey;
                // Direct provenance coordinates extracted from Vakh Schema properties
                const top = field.highlightBox?.top ?? field.boundingBox.y;
                const left = field.highlightBox?.left ?? field.boundingBox.x;
                const width = field.highlightBox?.width ?? field.boundingBox.width;
                const height = field.highlightBox?.height ?? field.boundingBox.height;
                const pageNum = field.pdfPage ?? field.boundingBox.page ?? 1;

                return (
                  <div
                    key={field.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectField) onSelectField(field.fieldKey);
                    }}
                    style={{
                      top: `${top}px`,
                      left: `${left}px`,
                      width: `${width}px`,
                      height: `${height}px`,
                    }}
                    className={`absolute pointer-events-auto cursor-pointer rounded-[4px] transition-all flex items-center justify-between px-2 text-[10px] font-mono select-none ${
                      isSelected
                        ? 'source-highlight-active bg-[var(--cyber-cyan)]/25 border-2 border-[var(--cyber-cyan)] text-black z-30 shadow-lg shadow-[var(--cyber-cyan)]/40 ring-4 ring-[var(--cyber-cyan)]/20 animate-pulse'
                        : 'bg-[#3d5042]/15 border border-[#3d5042]/60 hover:bg-[var(--cyber-cyan)]/20 hover:border-[var(--cyber-cyan)] text-[#191c1e] z-10'
                    }`}
                    title={`Vakh Provenance: Page ${pageNum} · Top=${top}px, Left=${left}px, W=${width}px, H=${height}px (${field.label}: ${field.value})`}
                  >
                    <span className="truncate font-semibold">{field.label}</span>
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      <span className="text-[9px] bg-white/90 px-1 py-0.2 rounded border border-black/20 font-bold">
                        {Math.round(field.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Document Footer Bar with Vakh Single Source of Truth Provenance */}
      <div className="px-4 py-2 bg-[#fbfbfa] border-t border-[#e5e5de] flex flex-wrap items-center justify-between gap-2 text-xs text-[#5a6065]">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <Hash className="w-3.5 h-3.5 text-[#848a90]" />
          <span>SHA-256: </span>
          <span className="text-[#191c1e] truncate max-w-[200px]" title={document.sha256}>
            {document.sha256}
          </span>
          {document.vakhItemId && (
            <span className="bg-emerald-500/10 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[10px]">
              Vakh: {document.vakhItemId}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#3d5042] font-medium">
          <MapPin className="w-3.5 h-3.5 text-[var(--cyber-cyan)]" />
          <span>Click any Vakh coordinate region to audit & trace source</span>
        </div>
      </div>
    </div>
  );
};
