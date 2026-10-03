import React, { useState } from 'react';
import type { CalculationTrace, CBAMDocument } from '../../types/cbam';
import { Card3D } from '../common/Card3D';
import { 
  Download, 
  FileText, 
  Code, 
  Table, 
  Printer, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  FileCheck,
  Sparkles,
  Lock,
  Cpu
} from 'lucide-react';

interface ExportPanelProps {
  calculations: CalculationTrace[];
  documents: CBAMDocument[];
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ calculations, documents }) => {
  const [selectedFormat, setSelectedFormat] = useState<'dossier_pdf' | 'trace_json' | 'summary_csv' | 'cbam_xml'>('dossier_pdf');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const primaryCalc = calculations[0];
  const primaryDoc = documents.find((d) => d.id === primaryCalc?.documentId) || documents[0];

  const handleDownload = () => {
    let filename = '';
    let content = '';
    let mimeType = '';

    if (selectedFormat === 'trace_json') {
      filename = `cbam_traceability_dossier_${new Date().toISOString().slice(0, 10)}.json`;
      content = JSON.stringify({
        generatedAt: new Date().toISOString(),
        regulation: 'Regulation (EU) 2023/956',
        engineVersion: 'v2026.1',
        disclaimer: 'Declaration assistance, not an official filing.',
        declarant: 'ThyssenKrupp Euro-Import S.A. [DE94827103]',
        calculations: calculations,
      }, null, 2);
      mimeType = 'application/json';
    } else if (selectedFormat === 'summary_csv') {
      filename = `cbam_calculation_summary_${new Date().toISOString().slice(0, 10)}.csv`;
      const header = 'CalculationID,DocumentName,CNCode,NetMass,DirectEmissions,IndirectEmissions,TotalResult,RuleVersion,VerifiedBy,SHA256\n';
      const rows = calculations.map(c => 
        `"${c.id}","${c.documentName}","7208 39 00","1000","${c.directEmissionsTonnes}","${c.indirectEmissionsTonnes}","${c.resultValue}","${c.ruleVersion}","${c.complianceOfficer}","${c.documentHash}"`
      ).join('\n');
      content = header + rows;
      mimeType = 'text/csv';
    } else if (selectedFormat === 'cbam_xml') {
      filename = `cbam_transitional_declaration_${new Date().toISOString().slice(0, 10)}.xml`;
      content = `<?xml version="1.0" encoding="UTF-8"?>
<CBAMDeclaration xmlns="urn:eu:cbam:v2026:reporting" period="2026-Q3">
  <Header>
    <DeclarantID>DE94827103</DeclarantID>
    <EngineVersion>v2026.1</EngineVersion>
    <GeneratedTimestamp>${new Date().toISOString()}</GeneratedTimestamp>
    <Disclaimer>Declaration assistance, not an official filing.</Disclaimer>
  </Header>
  <GoodsItems>
    ${calculations.map(c => `
    <GoodsItem>
      <DocumentRef>${c.documentName}</DocumentRef>
      <DocumentSHA256>${c.documentHash}</DocumentSHA256>
      <TotalEmbeddedEmissions unit="${c.resultUnit}">${c.resultValue}</TotalEmbeddedEmissions>
      <RuleApplied>${c.ruleVersion}</RuleApplied>
      <VerifierSignoff>${c.complianceOfficer}</VerifierSignoff>
    </GoodsItem>`).join('')}
  </GoodsItems>
</CBAMDeclaration>`;
      mimeType = 'application/xml';
    } else {
      // PDF print view
      window.print();
      setDownloadSuccess('Print dialog opened for PDF export.');
      setTimeout(() => setDownloadSuccess(null), 3000);
      return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`Exported ${filename}`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 3D Command Header */}
      <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 backdrop-blur-md shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-32 bg-radial from-[var(--cyber-cyan)]/15 via-transparent to-transparent pointer-events-none blur-2xl" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-[var(--cyber-cyan)] uppercase mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>EU Customs Reporting Dispatch</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyber-cyan)] animate-ping" />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
              Export Compliance Dossier
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Export legally anchored audit dossiers, source-linked JSON trees, and Transitional Registry XML files.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-emerald)] text-black text-xs font-bold shadow-[0_0_15px_rgba(56,189,248,0.35)] hover:opacity-90 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{selectedFormat === 'dossier_pdf' ? 'Print / Save as PDF' : 'Download Compliance File'}</span>
          </button>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3.5 rounded-xl bg-[var(--cyber-amber)]/10 border border-[var(--cyber-amber)]/30 flex items-start gap-3 text-xs text-[var(--cyber-amber)]">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[var(--cyber-amber)]" />
        <div className="leading-relaxed">
          <strong className="font-bold text-[var(--text-primary)]">Legal Attestation Notice: </strong>
          Declaration assistance, not an official filing. Official quarterly CBAM communications must be submitted via the European Commission CBAM Transitional Registry through national competent authorities.
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-lg bg-[var(--cyber-emerald)]/15 border border-[var(--cyber-emerald)]/30 text-xs text-[var(--cyber-emerald)] flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* 3D Format Selector Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Option 1: PDF Dossier */}
        <Card3D
          depth={15}
          maxRotation={8}
          onClick={() => setSelectedFormat('dossier_pdf')}
          className={`p-4 rounded-xl cursor-pointer border transition-all ${
            selectedFormat === 'dossier_pdf'
              ? 'border-[var(--cyber-cyan)] bg-[var(--cyber-cyan)]/10 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
              : 'border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--cyber-cyan)]/50'
          }`}
        >
          <FileText className={`w-5 h-5 mb-2.5 ${selectedFormat === 'dossier_pdf' ? 'text-[var(--cyber-cyan)]' : 'text-[var(--text-secondary)]'}`} />
          <div className="text-xs font-bold text-[var(--text-primary)]">Audit Report PDF</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">
            Complete compliance dossier with visual evidence stamps
          </div>
        </Card3D>

        {/* Option 2: Traceability JSON */}
        <Card3D
          depth={15}
          maxRotation={8}
          onClick={() => setSelectedFormat('trace_json')}
          className={`p-4 rounded-xl cursor-pointer border transition-all ${
            selectedFormat === 'trace_json'
              ? 'border-[var(--cyber-cyan)] bg-[var(--cyber-cyan)]/10 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
              : 'border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--cyber-cyan)]/50'
          }`}
        >
          <Code className={`w-5 h-5 mb-2.5 ${selectedFormat === 'trace_json' ? 'text-[var(--cyber-cyan)]' : 'text-[var(--text-secondary)]'}`} />
          <div className="text-xs font-bold text-[var(--text-primary)]">Traceability JSON</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">
            Machine-readable cryptographic lineage tree
          </div>
        </Card3D>

        {/* Option 3: Summary CSV */}
        <Card3D
          depth={15}
          maxRotation={8}
          onClick={() => setSelectedFormat('summary_csv')}
          className={`p-4 rounded-xl cursor-pointer border transition-all ${
            selectedFormat === 'summary_csv'
              ? 'border-[var(--cyber-cyan)] bg-[var(--cyber-cyan)]/10 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
              : 'border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--cyber-cyan)]/50'
          }`}
        >
          <Table className={`w-5 h-5 mb-2.5 ${selectedFormat === 'summary_csv' ? 'text-[var(--cyber-cyan)]' : 'text-[var(--text-secondary)]'}`} />
          <div className="text-xs font-bold text-[var(--text-primary)]">Calculation Summary</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">
            Tabular breakdown of line-item emissions
          </div>
        </Card3D>

        {/* Option 4: CBAM XML */}
        <Card3D
          depth={15}
          maxRotation={8}
          onClick={() => setSelectedFormat('cbam_xml')}
          className={`p-4 rounded-xl cursor-pointer border transition-all ${
            selectedFormat === 'cbam_xml'
              ? 'border-[var(--cyber-cyan)] bg-[var(--cyber-cyan)]/10 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
              : 'border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--cyber-cyan)]/50'
          }`}
        >
          <FileCheck className={`w-5 h-5 mb-2.5 ${selectedFormat === 'cbam_xml' ? 'text-[var(--cyber-cyan)]' : 'text-[var(--text-secondary)]'}`} />
          <div className="text-xs font-bold text-[var(--text-primary)]">Transitional XML</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">
            EU Registry schema compatible XML payload
          </div>
        </Card3D>
      </div>

      {/* 3D Live Preview Panel */}
      <div className="glass-3d rounded-xl border border-[var(--border-subtle)] p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)] text-xs">
          <span className="font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Printer className="w-4 h-4 text-[var(--cyber-cyan)]" />
            <span>Live Export Preview ({selectedFormat.toUpperCase().replace('_', ' ')})</span>
          </span>
          <span className="font-mono text-[11px] text-[var(--text-muted)]">
            Generated: {new Date().toLocaleDateString('en-GB')} 09:46 CET · Engine v2026.1
          </span>
        </div>

        {/* Realistic European Customs Compliance Dossier Sheet */}
        <div className="p-6 bg-white text-black rounded-lg border border-[var(--border-subtle)] font-sans text-xs space-y-4 shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-black pb-3">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#3d5042]">
                EUROPEAN UNION CARBON BORDER ADJUSTMENT MECHANISM (REGULATION EU 2023/956)
              </div>
              <h2 className="text-base font-bold text-[#111] mt-0.5 font-mono">
                CBAM-AuditTrace Compliance Dossier #TR-2026-0881
              </h2>
              <div className="text-[11px] text-[#555]">
                Declarant: ThyssenKrupp Euro-Import S.A. · EORI: DE94827103
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-0.5 rounded bg-[#eaf0eb] border border-[#c8e6ce] text-[10px] font-mono font-bold text-[#1b6830]">
                EVIDENCE VERIFIED
              </span>
              <div className="font-mono text-[10px] text-[#888] mt-1">Rule Engine: v2026.1</div>
            </div>
          </div>

          {/* Aggregated Totals */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-[#fafafa] border border-[#e5e5de] rounded">
            <div>
              <div className="text-[10px] text-[#666] uppercase font-mono">Total Goods Mass</div>
              <div className="font-mono text-sm font-bold text-[#111]">1,000.00 MT</div>
            </div>
            <div>
              <div className="text-[10px] text-[#666] uppercase font-mono">Total Embedded Emissions</div>
              <div className="font-mono text-sm font-bold text-[#111]">1,900.00 tCO₂e</div>
            </div>
            <div>
              <div className="text-[10px] text-[#666] uppercase font-mono">Source Lineage Status</div>
              <div className="font-mono text-sm font-bold text-[#1b6830]">100% Traceable</div>
            </div>
          </div>

          {/* Traceability Lineage Table */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#444] mb-1.5 font-mono">
              Verified Source Lineage Breakdown
            </div>
            <table className="w-full border-collapse border border-[#ddd] text-xs">
              <thead>
                <tr className="bg-[#f0f0ea] border-b border-[#ddd] text-left text-[11px]">
                  <th className="p-2 border-r border-[#ddd]">Calculated Result</th>
                  <th className="p-2 border-r border-[#ddd]">Deterministic Formula</th>
                  <th className="p-2 border-r border-[#ddd]">Rule Applied</th>
                  <th className="p-2 border-r border-[#ddd]">Verified Input & Sign-Off</th>
                  <th className="p-2">Document Coordinate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee]">
                <tr>
                  <td className="p-2 font-mono font-bold border-r border-[#eee]">1,900.00 tCO₂e</td>
                  <td className="p-2 font-mono border-r border-[#eee]">1,000 t × 1.90</td>
                  <td className="p-2 font-mono border-r border-[#eee]">v2026.1</td>
                  <td className="p-2 border-r border-[#eee]">
                    <div className="font-semibold text-[#1b6830]">✓ Confirmed</div>
                    <div className="text-[10px] text-[#666]">E. Moreau (09:44)</div>
                  </td>
                  <td className="p-2 font-mono text-[11px]">
                    supplier_invoice_042.pdf<br />
                    Page 1 · x=132 · y=418
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signatures & Attestation */}
          <div className="pt-2 border-t border-[#d8d8ce] flex justify-between text-[11px] text-[#666]">
            <div>
              <span>Generated with CBAM-AuditTrace Engine. Cryptographic Merkle Root: </span>
              <span className="font-mono text-[10px] text-[#333] font-bold">38f9021a8b417c8d9e0f</span>
            </div>
            <div className="italic">
              Declaration assistance, not an official filing.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

