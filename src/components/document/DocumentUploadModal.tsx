import React, { useState, useEffect } from 'react';
import type { CBAMDocument, DocumentType } from '../../types/cbam';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  Hash,
  ShieldCheck,
  Globe
} from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (newDoc: CBAMDocument) => void;
  onOpenVakhPortal?: () => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentAdded,
  onOpenVakhPortal,
}) => {
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: DocumentType;
    supplier: string;
    cnCode: string;
    productName: string;
  } | null>(null);

  const [uploadStage, setUploadStage] = useState<'idle' | 'received' | 'extracting' | 'preparing' | 'completed'>('idle');
  const [stageProgress, setStageProgress] = useState(0);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setUploadStage('idle');
      setStageProgress(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateUpload = (presetIndex: number) => {
    const presets = [
      {
        name: 'tata_steel_plate_inv992.pdf',
        size: '2.4 MB',
        type: 'Invoice' as DocumentType,
        supplier: 'Tata Steel Nederland BV',
        cnCode: '7208 51 20',
        productName: 'Heavy flat-rolled structural steel plate'
      },
      {
        name: 'alunorte_alumina_epd_2026.pdf',
        size: '3.1 MB',
        type: 'EPD' as DocumentType,
        supplier: 'Hydro Alunorte Refineries',
        cnCode: '2818 20 00',
        productName: 'Calcined metallurgical alumina'
      },
      {
        name: 'cemex_clinker_emissions_cert.pdf',
        size: '1.6 MB',
        type: 'Emissions statement' as DocumentType,
        supplier: 'CEMEX Mediterranean Clinker Works',
        cnCode: '2523 10 00',
        productName: 'Grey Portland cement clinker'
      }
    ];

    const file = presets[presetIndex];
    setSelectedFile(file);
    setUploadStage('received');
    setStageProgress(25);

    // Stage 1 -> Stage 2
    setTimeout(() => {
      setUploadStage('extracting');
      setStageProgress(65);
    }, 1200);

    // Stage 2 -> Stage 3
    setTimeout(() => {
      setUploadStage('preparing');
      setStageProgress(90);
    }, 2400);

    // Stage 3 -> Completed
    setTimeout(() => {
      setUploadStage('completed');
      setStageProgress(100);

      // Create new document
      const newDoc: CBAMDocument = {
        id: `doc-${Date.now()}`,
        filename: file.name,
        fileSize: file.size,
        sha256: 'e8b417c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6',
        supplier: file.supplier,
        supplierCountry: 'NL / EU Border Gate',
        importer: 'ThyssenKrupp Euro-Import S.A. [DE94827103]',
        productName: file.productName,
        cnCode: file.cnCode,
        goodsCategory: 'Iron & Steel',
        documentType: file.type,
        uploadedAt: 'Just now',
        updatedAt: 'Just now',
        status: 'Needs verification',
        traceabilityPercent: 50,
        installationName: 'IJmuiden Oxygen Steel Works #2',
        installationCountry: 'NL',
        productionRoute: 'BF-BOF route with scrap optimization',
        extractedFields: [
          {
            id: `f-${Date.now()}-1`,
            fieldKey: 'net_mass',
            label: 'Net mass',
            value: '1,250 t',
            numericValue: 1250,
            unit: 't',
            confidence: 0.98,
            boundingBox: { page: 1, x: 140, y: 340, width: 130, height: 25 },
            status: 'ai_proposed',
            notes: 'Extracted from commercial delivery receipt'
          },
          {
            id: `f-${Date.now()}-2`,
            fieldKey: 'cn_code',
            label: 'CN code',
            value: file.cnCode,
            confidence: 0.96,
            boundingBox: { page: 1, x: 120, y: 250, width: 120, height: 24 },
            status: 'ai_proposed'
          },
          {
            id: `f-${Date.now()}-3`,
            fieldKey: 'emissions_direct',
            label: 'Direct specific emissions',
            value: '1.74 tCO₂e/t',
            numericValue: 1.74,
            unit: 'tCO₂e/t',
            confidence: 0.92,
            boundingBox: { page: 1, x: 135, y: 415, width: 150, height: 26 },
            status: 'ai_proposed',
            notes: 'Scope 1 direct process & fuel combustion'
          },
          {
            id: `f-${Date.now()}-4`,
            fieldKey: 'emissions_indirect',
            label: 'Indirect specific emissions',
            value: '0.22 tCO₂e/t',
            numericValue: 0.22,
            unit: 'tCO₂e/t',
            confidence: 0.89,
            boundingBox: { page: 1, x: 135, y: 445, width: 150, height: 26 },
            status: 'ai_proposed',
            notes: 'Grid factor applied under Annex III'
          }
        ]
      };

      setTimeout(() => {
        onDocumentAdded(newDoc);
        onClose();
      }, 800);
    }, 3400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="upload-modal-title">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#121614]/40 transition-opacity backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-xl rounded-[8px] bg-white border border-[#e2e2dc] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#e5e5de] bg-[#fbfbfa] flex items-center justify-between">
            <div>
              <h2 id="upload-modal-title" className="text-sm font-semibold text-[#191c1e] tracking-tight">
                Add Supplier Evidence
              </h2>
              <p className="text-xs text-[#5a6065]">
                Supported: Commercial Invoices, EPDs, and Accredited Emissions Statements
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-[#5a6065] hover:text-[#191c1e] hover:bg-[#f0f0eb]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {uploadStage === 'idle' ? (
              <>
                {/* Drag and Drop Box */}
                <div 
                  onClick={() => handleSimulateUpload(0)}
                  className="border-2 border-dashed border-[#d8d8ce] hover:border-[#3d5042] rounded-[6px] p-8 text-center bg-[#fbfbfa] hover:bg-[#f6f6f3] transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#eaf0eb] border border-[#c8e6ce] flex items-center justify-center text-[#3d5042] group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-semibold text-[#191c1e]">
                    Click to browse or drop supplier document here
                  </div>
                  <div className="text-[11px] text-[#5a6065] mt-1">
                    Accepts PDF, XML (TARIC declaration), or EPD files up to 25 MB
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-white border border-[#e5e5de] font-mono text-[10px] text-[#5a6065]">
                    <ShieldCheck className="w-3 h-3 text-[#1b6830]" />
                    Automatic SHA-256 evidence fingerprinting on ingestion
                  </div>
                </div>

                {/* Preset Fast-Test Demonstrations */}
                <div>
                  <div className="text-[11px] font-semibold text-[#848a90] uppercase tracking-wider mb-2">
                    Or select pre-staged supplier evidence file:
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSimulateUpload(0)}
                      className="p-3 text-left rounded-[4px] bg-[#fbfbfa] border border-[#e5e5de] hover:border-[#3d5042] hover:bg-white transition-all text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#3d5042]" />
                        <div>
                          <div className="font-medium text-[#191c1e]">Tata Steel Plate (Heavy Structural)</div>
                          <div className="text-[11px] text-[#5a6065]">Invoice · CN 7208 51 20 · 1,250 t</div>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-[#3d5042]">Simulate Ingest →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateUpload(1)}
                      className="p-3 text-left rounded-[4px] bg-[#fbfbfa] border border-[#e5e5de] hover:border-[#3d5042] hover:bg-white transition-all text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#3d5042]" />
                        <div>
                          <div className="font-medium text-[#191c1e]">Hydro Alunorte Alumina EPD 2026</div>
                          <div className="text-[11px] text-[#5a6065]">EPD · CN 2818 20 00 · 850 t</div>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-[#3d5042]">Simulate Ingest →</span>
                    </button>
                  </div>
                </div>

                {/* Vakh Alternative Banner */}
                {onOpenVakhPortal && (
                  <div className="p-3.5 rounded-[6px] bg-[#f0f4f1] border border-[#c8e6ce] flex items-center justify-between text-xs mt-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-[4px] bg-[#1b6830] text-white flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#191c1e] flex items-center gap-1.5">
                          <span>Need overseas suppliers to self-declare?</span>
                          <span className="text-[10px] px-1 py-0.2 rounded font-mono font-bold bg-[#1b6830] text-white">Vakh</span>
                        </div>
                        <div className="text-[11px] text-[#5a6065]">
                          Dispatches a no-code Vakh Form to foreign mills to report verified EAF/blast furnace metrics.
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenVakhPortal();
                      }}
                      className="px-3 py-1.5 rounded-[4px] bg-[#1b6830] hover:bg-[#155426] text-white text-xs font-semibold whitespace-nowrap transition-colors"
                    >
                      Open Vakh Portal →
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* PROGRESS STAGES VIEW */
              <div className="space-y-6 py-4">
                {/* Uploaded File Info */}
                {selectedFile && (
                  <div className="p-4 rounded-[6px] bg-[#fbfbfa] border border-[#e5e5de] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#3d5042]" />
                      <div>
                        <div className="font-semibold text-[#191c1e]">{selectedFile.name}</div>
                        <div className="text-[11px] text-[#5a6065]">
                          {selectedFile.size} · Uploaded 09:42 CET · {selectedFile.supplier}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-[#1b6830] bg-[#ecf7ef] px-2 py-0.5 rounded border border-[#c8e6ce]">
                      SHA-256 Generated
                    </span>
                  </div>
                )}

                {/* Progress bar */}
                <div className="w-full bg-[#ecece6] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#3d5042] h-full transition-all duration-500 ease-out"
                    style={{ width: `${stageProgress}%` }}
                  />
                </div>

                {/* Stages List */}
                <div className="space-y-3 text-xs">
                  {/* Stage 1 */}
                  <div className="flex items-center justify-between p-3 rounded-[4px] bg-white border border-[#e5e5de]">
                    <div className="flex items-center gap-2.5">
                      {stageProgress >= 25 ? (
                        <CheckCircle2 className="w-4 h-4 text-[#1b6830]" />
                      ) : (
                        <Clock className="w-4 h-4 text-[#848a90]" />
                      )}
                      <span className="font-medium text-[#191c1e]">1. Document received & hash locked</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#848a90]">
                      {stageProgress >= 25 ? 'Complete' : 'Pending'}
                    </span>
                  </div>

                  {/* Stage 2 */}
                  <div className="flex items-center justify-between p-3 rounded-[4px] bg-white border border-[#e5e5de]">
                    <div className="flex items-center gap-2.5">
                      {stageProgress >= 65 ? (
                        <CheckCircle2 className="w-4 h-4 text-[#1b6830]" />
                      ) : uploadStage === 'extracting' ? (
                        <Sparkles className="w-4 h-4 text-[#9e5d03] animate-pulse" />
                      ) : (
                        <Clock className="w-4 h-4 text-[#848a90]" />
                      )}
                      <span className="font-medium text-[#191c1e]">2. Extracting fields & coordinate mapping</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#848a90]">
                      {stageProgress >= 65 ? 'Complete (4 fields proposed)' : uploadStage === 'extracting' ? 'Extracting...' : 'Waiting'}
                    </span>
                  </div>

                  {/* Stage 3 */}
                  <div className="flex items-center justify-between p-3 rounded-[4px] bg-white border border-[#e5e5de]">
                    <div className="flex items-center gap-2.5">
                      {stageProgress >= 100 ? (
                        <CheckCircle2 className="w-4 h-4 text-[#1b6830]" />
                      ) : uploadStage === 'preparing' ? (
                        <Clock className="w-4 h-4 text-[#3d5042] animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4 text-[#848a90]" />
                      )}
                      <span className="font-medium text-[#191c1e]">3. Preparing human verification queue</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#848a90]">
                      {stageProgress >= 100 ? 'Ready for Auditor' : uploadStage === 'preparing' ? 'Finalizing...' : 'Waiting'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
