import React, { useState } from 'react';
import type { CBAMDocument } from '../../types/cbam';
import { StatusBadge } from '../common/StatusBadge';
import { Card3D } from '../common/Card3D';
import { 
  Search, 
  ArrowUpDown, 
  FileText, 
  Upload, 
  Globe,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRight,
  Cpu
} from 'lucide-react';

interface DocumentTableProps {
  documents: CBAMDocument[];
  onSelectDocument: (doc: CBAMDocument) => void;
  onOpenUpload: () => void;
  onViewProvenance?: (docId: string) => void;
  onOpenVakhPortal?: () => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  onSelectDocument,
  onOpenUpload,
  onViewProvenance,
  onOpenVakhPortal,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'uploadedAt' | 'traceabilityPercent' | 'supplier'>('uploadedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'3d_cards' | 'table'>('3d_cards');

  const filteredDocs = documents
    .filter((doc) => {
      const matchesSearch =
        doc.filename.toLowerCase().includes(search.toLowerCase()) ||
        doc.supplier.toLowerCase().includes(search.toLowerCase()) ||
        doc.productName.toLowerCase().includes(search.toLowerCase()) ||
        doc.cnCode.includes(search);
      const matchesType = typeFilter === 'ALL' || doc.documentType === typeFilter;
      const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'traceabilityPercent') {
        comparison = a.traceabilityPercent - b.traceabilityPercent;
      } else if (sortField === 'supplier') {
        comparison = a.supplier.localeCompare(b.supplier);
      } else {
        comparison = a.id.localeCompare(b.id);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const toggleSort = (field: 'uploadedAt' | 'traceabilityPercent' | 'supplier') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const verifiedCount = documents.filter(d => d.status === 'Verified' || d.status === 'Calculated').length;
  const pendingCount = documents.filter(d => d.status === 'Needs verification').length;

  return (
    <div className="space-y-6">
      {/* 3D Command Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 backdrop-blur-md shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-32 bg-radial from-[var(--cyber-cyan)]/15 via-transparent to-transparent pointer-events-none blur-2xl" />
        
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-[var(--cyber-cyan)] uppercase mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>Evidence Ledger Repository</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyber-cyan)] animate-ping" />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
              <span>Supplier Compliance Evidence</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[var(--cyber-cyan)]/10 text-[var(--cyber-cyan)] border border-[var(--cyber-cyan)]/25">
                {documents.length} Files Active
              </span>
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Cryptographically hashed commercial invoices, mill test certs, and EPD disclosures undergoing deterministic verification.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            {onOpenVakhPortal && (
              <button
                type="button"
                onClick={onOpenVakhPortal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--cyber-emerald)]/10 text-[var(--cyber-emerald)] border border-[var(--cyber-emerald)]/30 text-xs font-semibold hover:bg-[var(--cyber-emerald)]/20 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <Globe className="w-3.5 h-3.5 text-[var(--cyber-emerald)]" />
                <span>Collect via Vakh Portal</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-[var(--cyber-emerald)] text-black">
                  Vakh
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-emerald)] text-black text-xs font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Register New Evidence</span>
            </button>
          </div>
        </div>

        {/* Quick Telemetry Chips */}
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-sunken)] border border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)]">Verified Rate:</span>
            <span className="font-mono font-bold text-[var(--cyber-emerald)]">
              {Math.round((verifiedCount / (documents.length || 1)) * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-sunken)] border border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)]">Pending Audit:</span>
            <span className="font-mono font-bold text-[var(--cyber-amber)]">{pendingCount}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-sunken)] border border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)]">Origins:</span>
            <span className="font-mono font-medium text-[var(--text-primary)]">India, Turkey, China, Brazil</span>
          </div>
        </div>
      </div>

      {/* Filter, Search and View Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl backdrop-blur-md">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename, supplier, product, or CN code..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--cyber-cyan)] focus:ring-1 focus:ring-[var(--cyber-cyan)] transition-all font-mono"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyber-cyan)]"
          >
            <option value="ALL">All Document Types</option>
            <option value="Invoice">Invoice</option>
            <option value="EPD">EPD</option>
            <option value="Emissions statement">Emissions statement</option>
            <option value="Mill test cert">Mill test cert</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyber-cyan)]"
          >
            <option value="ALL">All Statuses</option>
            <option value="Needs verification">Needs verification</option>
            <option value="Verified">Verified</option>
            <option value="Calculated">Calculated</option>
            <option value="Flagged anomaly">Flagged anomaly</option>
          </select>

          {/* View Mode Toggle: 3D Cards vs Table */}
          <div className="flex items-center rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-subtle)] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('3d_cards')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === '3d_cards'
                  ? 'bg-[var(--cyber-cyan)] text-black font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Interactive 3D Holographic Cards"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>3D Deck</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-[var(--cyber-cyan)] text-black font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Matrix Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: 3D CARDS GRID */}
      {viewMode === '3d_cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <Card3D
              key={doc.id}
              depth={20}
              maxRotation={12}
              className="p-5 flex flex-col justify-between group cursor-pointer border border-[var(--border-subtle)] hover:border-[var(--cyber-cyan)]/50 transition-colors"
              onClick={() => onSelectDocument(doc)}
            >
              <div>
                {/* Card Top: Type & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                    {doc.documentType}
                  </span>
                  <StatusBadge status={doc.status} size="sm" />
                </div>

                {/* Document Name */}
                <div className="flex items-start gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--cyber-cyan)]/10 border border-[var(--cyber-cyan)]/30 flex items-center justify-center shrink-0 text-[var(--cyber-cyan)] group-hover:scale-110 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[var(--text-primary)] group-hover:text-[var(--cyber-cyan)] transition-colors line-clamp-1" title={doc.filename}>
                      {doc.filename}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">
                      {doc.supplier} ({doc.supplierCountry})
                    </p>
                  </div>
                </div>

                {/* Product & CN Code */}
                <div className="p-2.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-subtle)] mb-3 text-xs">
                  <div className="text-[11px] text-[var(--text-muted)]">Product Target:</div>
                  <div className="font-medium text-[var(--text-primary)] line-clamp-1" title={doc.productName}>
                    {doc.productName}
                  </div>
                  <div className="font-mono text-[11px] text-[var(--cyber-cyan)] mt-1 flex items-center justify-between">
                    <span>CN {doc.cnCode}</span>
                    <span className="text-[var(--text-muted)]">{doc.fileSize}</span>
                  </div>
                </div>

                {/* Traceability Gauge */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)] text-[11px]">Audit Traceability:</span>
                    <span className="font-mono font-bold text-[var(--text-primary)]">
                      {doc.traceabilityPercent}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--surface-sunken)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        doc.traceabilityPercent === 100
                          ? 'bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-emerald)] shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                          : 'bg-gradient-to-r from-[var(--cyber-amber)] to-[var(--cyber-cyan)]'
                      }`}
                      style={{ width: `${doc.traceabilityPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer: Hash & Quick Triggers */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2 text-xs">
                <span className="font-mono text-[10px] text-[var(--text-muted)] truncate max-w-[120px]" title={doc.sha256}>
                  sha256:{doc.sha256.slice(0, 8)}...
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDocument(doc);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--surface-sunken)] hover:bg-[var(--cyber-cyan)] hover:text-black border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] transition-all"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  {doc.status === 'Calculated' && onViewProvenance && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProvenance(doc.id);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[var(--cyber-emerald)]/15 text-[var(--cyber-emerald)] border border-[var(--cyber-emerald)]/30 hover:bg-[var(--cyber-emerald)]/25 text-xs font-medium transition-all"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Trace</span>
                    </button>
                  )}
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      ) : (
        /* VIEW MODE 2: 3D CYBER HUD TABLE */
        <div className="glass-3d rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--surface-sunken)] border-b border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  <th className="py-3 px-4">Document</th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-[var(--text-primary)] transition-colors"
                    onClick={() => toggleSort('supplier')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Supplier</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Product / CN Code</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Verification</th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-[var(--text-primary)] transition-colors"
                    onClick={() => toggleSort('traceabilityPercent')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Traceability</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-xs">
                {filteredDocs.map((doc) => (
                  <tr 
                    key={doc.id}
                    onClick={() => onSelectDocument(doc)}
                    className="hover:bg-[var(--cyber-cyan)]/5 transition-colors cursor-pointer group"
                  >
                    {/* Document Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[var(--cyber-cyan)] shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--cyber-cyan)] transition-colors">
                            {doc.filename}
                          </div>
                          <div className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
                            <span>{doc.fileSize}</span>
                            <span>•</span>
                            <span title={doc.sha256} className="truncate max-w-[120px]">
                              {doc.sha256.slice(0, 14)}...
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Supplier Column */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[var(--text-primary)]">{doc.supplier}</div>
                      <div className="text-[11px] text-[var(--text-secondary)]">{doc.supplierCountry}</div>
                    </td>

                    {/* Product / CN Code */}
                    <td className="py-3.5 px-4">
                      <div className="text-[var(--text-primary)] font-medium truncate max-w-[200px]" title={doc.productName}>
                        {doc.productName}
                      </div>
                      <div className="font-mono text-[11px] text-[var(--cyber-cyan)]">{doc.cnCode}</div>
                    </td>

                    {/* Document Type */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)]">
                        {doc.documentType}
                      </span>
                    </td>

                    {/* Verification Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={doc.status} size="sm" />
                    </td>

                    {/* Traceability */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[var(--surface-sunken)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${
                              doc.traceabilityPercent === 100 ? 'bg-[var(--cyber-emerald)]' : 'bg-[var(--cyber-amber)]'
                            }`}
                            style={{ width: `${doc.traceabilityPercent}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                          {doc.traceabilityPercent}%
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectDocument(doc)}
                          className="px-2.5 py-1 rounded bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] hover:border-[var(--cyber-cyan)] hover:text-[var(--cyber-cyan)] transition-colors"
                          title="Open in Split Document Viewer"
                        >
                          Inspect
                        </button>

                        {doc.status === 'Calculated' && onViewProvenance && (
                          <button
                            type="button"
                            onClick={() => onViewProvenance(doc.id)}
                            className="px-2.5 py-1 rounded bg-[var(--cyber-emerald)]/15 border border-[var(--cyber-emerald)]/30 text-xs font-medium text-[var(--cyber-emerald)] hover:bg-[var(--cyber-emerald)]/25 transition-colors"
                            title="View Deterministic Provenance"
                          >
                            Trace
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

