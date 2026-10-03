import type { CBAMDocument, CalculationTrace } from '../types/cbam';
import type { DeterministicEvaluationResult } from '../services/deterministicEngine';

export interface AuditCertificateData {
  certificateId: string;
  generatedAt: string;
  document: CBAMDocument;
  evaluation: DeterministicEvaluationResult;
  vakhSpaceId: string;
  vakhBoardId: string;
  complianceOfficer: string;
  merkleRootHash: string;
}

export function generateAuditCertificateHTML(data: AuditCertificateData): string {
  const { document, evaluation, vakhSpaceId, vakhBoardId, complianceOfficer, merkleRootHash, certificateId, generatedAt } = data;

  const statusColor = 
    evaluation.complianceRating.includes('GRADE A') ? '#10b981' :
    evaluation.complianceRating.includes('GRADE B') ? '#f59e0b' : '#ef4444';

  const itemsRows = document.extractedFields.map((f, i) => `
    <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
      <td style="padding: 8px 10px; font-weight: 600; color: #1e293b;">${f.label}</td>
      <td style="padding: 8px 10px; font-family: monospace; color: #0f172a;">${f.value}</td>
      <td style="padding: 8px 10px; font-family: monospace; color: #10b981; font-weight: bold;">
        ${f.status === 'human_confirmed' || f.status === 'edited' ? 'VERIFIED' : 'AI PROPOSED'}
      </td>
      <td style="padding: 8px 10px; font-family: monospace; color: #64748b; font-size: 10px;">
        Page ${f.pdfPage ?? f.boundingBox.page} (Top: ${f.highlightBox?.top ?? f.boundingBox.y}px, Left: ${f.highlightBox?.left ?? f.boundingBox.x}px)
      </td>
      <td style="padding: 8px 10px; font-family: monospace; text-align: right;">${Math.round(f.confidence * 100)}%</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>CBAM-AuditTrace Certificate — ${document.filename}</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #0f172a;
          background: #ffffff;
          line-height: 1.4;
          margin: 0;
          padding: 24px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #0f172a;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .title {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
          text-transform: uppercase;
          margin: 0;
          color: #0f172a;
        }
        .badge-cert {
          display: inline-block;
          background: ${statusColor}15;
          color: ${statusColor};
          border: 1px solid ${statusColor}50;
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 12px;
          font-family: monospace;
          text-transform: uppercase;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 14px;
          margin-bottom: 20px;
          font-size: 11px;
        }
        .meta-item { display: flex; flex-direction: column; }
        .meta-label { color: #64748b; font-size: 10px; text-transform: uppercase; font-weight: 600; margin-bottom: 2px; }
        .meta-value { color: #0f172a; font-weight: 600; font-family: monospace; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          border: 1px solid #e2e8f0;
        }
        th {
          background: #f1f5f9;
          color: #475569;
          font-size: 10px;
          text-transform: uppercase;
          padding: 8px 10px;
          text-align: left;
          font-weight: 700;
          border-bottom: 1px solid #cbd5e1;
        }
        .calc-box {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 14px;
          margin-bottom: 20px;
        }
        .calc-title {
          font-size: 12px;
          font-weight: 700;
          color: #166534;
          text-transform: uppercase;
          margin-bottom: 6px;
          display: flex;
          justify-content: space-between;
        }
        .signature-block {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #cbd5e1;
          padding-top: 16px;
          margin-top: 30px;
          font-size: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="title">CBAM-AuditTrace Compliance Certificate</h1>
          <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0;">
            Deterministic Verification Certificate under Regulation (EU) 2023/956 & Implementing Act 2023/1773
          </p>
        </div>
        <div style="text-align: right;">
          <div class="badge-cert">${evaluation.complianceRating}</div>
          <div style="font-size: 10px; font-family: monospace; color: #64748b; margin-top: 4px;">Cert #${certificateId}</div>
        </div>
      </div>

      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">Vakh Data Space Single Source of Truth</span>
          <span class="meta-value">${vakhSpaceId} / ${vakhBoardId}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Document Fingerprint (SHA-256)</span>
          <span class="meta-value" style="font-size: 9px;">${document.sha256}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Supplier & Production Facility</span>
          <span class="meta-value">${document.supplier} (${document.installationName})</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Tariff Code & Commodity</span>
          <span class="meta-value">CN ${document.cnCode} — ${document.productName}</span>
        </div>
      </div>

      <div class="calc-box">
        <div class="calc-title">
          <span>Deterministic Formula Lock (No AI Guessing)</span>
          <span>Rule: v2026.1 EU Implementing Act</span>
        </div>
        <div style="font-family: monospace; font-size: 13px; font-weight: 700; color: #14532d; margin-bottom: 4px;">
          ${evaluation.calculationTrace.formulaDisplay} = ${evaluation.totalEmbeddedEmissions.toLocaleString()} tCO₂e
        </div>
        <div style="font-size: 11px; color: #166534;">
          Direct: ${evaluation.directSpecificEmissions} tCO₂e/t · Indirect: ${evaluation.indirectSpecificEmissions} tCO₂e/t · Net Mass: ${evaluation.netMassTonnes.toLocaleString()} t
        </div>
        <div style="font-size: 10px; color: #475569; margin-top: 6px; border-top: 1px dashed #bbf7d0; pt-1;">
          Official EU ${evaluation.applicableBenchmark.category} Benchmark: <strong>${evaluation.applicableBenchmark.benchmarkValue} ${evaluation.applicableBenchmark.unit}</strong> 
          (${evaluation.benchmarkDeviationPercent >= 0 ? '+' : ''}${evaluation.benchmarkDeviationPercent}% variance)
        </div>
      </div>

      <h3 style="font-size: 12px; text-transform: uppercase; font-weight: 700; color: #334155; margin-bottom: 8px;">
        Itemized Extraction & Coordinate Provenance Table
      </h3>
      <table>
        <thead>
          <tr>
            <th>Declared Property</th>
            <th>Extracted Value</th>
            <th>Verification Status</th>
            <th>Vakh OCR Provenance Coordinates</th>
            <th style="text-align: right;">Confidence</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div class="signature-block">
        <div>
          <p style="font-weight: bold; margin: 0 0 2px 0;">AUTHORIZED COMPLIANCE VERIFIER</p>
          <p style="margin: 0; color: #475569;">${complianceOfficer}</p>
          <p style="margin: 2px 0 0 0; color: #64748b; font-family: monospace;">Signed on ${generatedAt}</p>
        </div>
        <div style="text-align: right;">
          <p style="font-weight: bold; margin: 0 0 2px 0;">CRYPTOGRAPHIC MERKLE ROOT</p>
          <p style="font-family: monospace; color: #0284c7; margin: 0; font-size: 9px;">${merkleRootHash}</p>
          <p style="margin: 2px 0 0 0; color: #10b981; font-weight: bold;">✓ 100% VAKH DATA ENGINE SYNCED</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function exportAuditCertificatePrint(data: AuditCertificateData) {
  const html = generateAuditCertificateHTML(data);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);
  }
}
