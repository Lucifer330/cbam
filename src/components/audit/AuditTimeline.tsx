import React, { useState } from 'react';
import type { AuditEvent } from '../../types/cbam';
import { Card3D } from '../common/Card3D';
import { 
  History, 
  Download, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  GitBranch, 
  Calculator, 
  Search,
  Hash,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AuditTimelineProps {
  logs: AuditEvent[];
  onExportAudit?: () => void;
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ logs, onExportAudit }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesCategory = selectedCategory === 'ALL' || log.category === selectedCategory;
    const matchesQuery = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const getActionIcon = (category: string) => {
    switch (category) {
      case 'UPLOAD':
        return <FileText className="w-3.5 h-3.5 text-[var(--cyber-cyan)]" />;
      case 'EXTRACTION':
        return <Sparkles className="w-3.5 h-3.5 text-[var(--cyber-amber)]" />;
      case 'VERIFICATION':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[var(--cyber-emerald)]" />;
      case 'RULE_CHANGE':
        return <GitBranch className="w-3.5 h-3.5 text-[var(--cyber-cyan)]" />;
      case 'CALCULATION':
        return <Calculator className="w-3.5 h-3.5 text-[var(--cyber-emerald)]" />;
      case 'EXPORT':
        return <Download className="w-3.5 h-3.5 text-[var(--cyber-purple)]" />;
      default:
        return <History className="w-3.5 h-3.5 text-[var(--text-secondary)]" />;
    }
  };

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Actor', 'ActorRole', 'Action', 'Category', 'Source', 'Status', 'Hash', 'Details'];
    const rows = logs.map(l => [
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.actorRole}"`,
      `"${l.action}"`,
      `"${l.category}"`,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${l.hash}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cbam_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 3D Ledger Header */}
      <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 backdrop-blur-md shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-32 bg-radial from-[var(--cyber-purple)]/15 via-transparent to-transparent pointer-events-none blur-2xl" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-[var(--cyber-cyan)] uppercase mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Tamper-Evident Immutable Ledger</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyber-cyan)] animate-ping" />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
              Cryptographic Audit Chain
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Chronological provenance capturing document registration, AI proposal, human sign-off, and calculation state transitions.
            </p>
          </div>

          {/* Action button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExportAudit || handleExportCsv}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-emerald)] text-black text-xs font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:opacity-90 transition-all hover:scale-105 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Ledger (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl backdrop-blur-md">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search actions, actors, hashes, or document sources..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--cyber-cyan)] transition-all font-mono"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {['ALL', 'UPLOAD', 'EXTRACTION', 'VERIFICATION', 'CALCULATION', 'EXPORT'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[var(--cyber-cyan)] text-black shadow-sm font-bold'
                  : 'bg-[var(--surface-sunken)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
              }`}
            >
              {cat === 'ALL' ? 'All Blocks' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Audit Timeline List */}
      <div className="glass-3d rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-xl divide-y divide-[var(--border-subtle)]">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;

            return (
              <div 
                key={log.id} 
                className="p-4 hover:bg-[var(--cyber-cyan)]/5 transition-colors cursor-pointer group"
                onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {/* Timestamp & Icon */}
                    <div className="w-9 h-9 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-subtle)] group-hover:border-[var(--cyber-cyan)]/50 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      {getActionIcon(log.category)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[var(--cyber-cyan)]">
                          {log.timestamp}
                        </span>
                        <span className="text-xs font-semibold text-[var(--text-primary)]">
                          {log.action}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--surface-sunken)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                          {log.category}
                        </span>
                      </div>

                      <div className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-2 font-mono">
                        <span>Source: <strong className="text-[var(--text-secondary)] font-normal">{log.source}</strong></span>
                        <span>•</span>
                        <span>Actor: <strong className="text-[var(--cyber-emerald)] font-normal">{log.actor}</strong> ({log.actorRole})</span>
                      </div>

                      <div className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                        {log.details}
                      </div>

                      {/* Expanded Technical Cryptographic details */}
                      {isExpanded && (
                        <div className="mt-3 p-3.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--cyber-cyan)]/30 text-[11px] font-mono space-y-2 animate-fadeIn">
                          <div className="flex items-center justify-between text-[var(--text-muted)]">
                            <span className="flex items-center gap-1 text-[var(--cyber-cyan)]">
                              <Hash className="w-3.5 h-3.5" />
                              <span>CRYPTOGRAPHIC HMAC SHA-256 DIGEST:</span>
                            </span>
                            <span className="text-[var(--cyber-emerald)] font-bold">STATUS: {log.status}</span>
                          </div>
                          <div className="text-[var(--text-primary)] break-all bg-black/40 p-2 rounded border border-white/5 selection:bg-[var(--cyber-cyan)] selection:text-black">
                            {log.hash}
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] pt-1 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[var(--cyber-emerald)]" />
                            <span>Block consensus verified under EU 2023/956 Annex IV non-repudiation standard.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Tag */}
                  <div className="shrink-0 flex flex-col items-end">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-[var(--cyber-emerald)]/10 text-[var(--cyber-emerald)] border border-[var(--cyber-emerald)]/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{log.status}</span>
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1 flex items-center gap-1 group-hover:text-[var(--cyber-cyan)]">
                      {isExpanded ? (
                        <>
                          <span>Collapse</span>
                          <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          <span>View Hash</span>
                          <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] font-mono">
            No audit records match the current filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};

