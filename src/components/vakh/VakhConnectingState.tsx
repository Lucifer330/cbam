import React, { useState } from 'react';
import { vakhService } from '../../services/vakhService';
import type { VakhSyncState } from '../../types/vakh';
import { 
  Database, 
  Wifi, 
  RefreshCw, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  FileUp, 
  Server,
  Activity,
  CheckCircle2
} from 'lucide-react';

interface VakhConnectingStateProps {
  onIntakeTriggered?: () => void;
  syncState?: VakhSyncState;
}

export const VakhConnectingState: React.FC<VakhConnectingStateProps> = ({
  onIntakeTriggered,
  syncState = 'waiting'
}) => {
  const [isSimulatingIntake, setIsSimulatingIntake] = useState(false);
  const config = vakhService.getConfig();

  const handleTriggerLiveIntake = async () => {
    setIsSimulatingIntake(true);
    // Seed and trigger live fetch
    vakhService.seedVakhSpace();
    setTimeout(() => {
      setIsSimulatingIntake(false);
      if (onIntakeTriggered) onIntakeTriggered();
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[580px] h-[calc(100vh-180px)] w-full p-6 text-center">
      <div className="max-w-2xl w-full bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Cyber Background Glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[var(--cyber-cyan)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[var(--cyber-purple)]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Pulse Radar Animation */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[var(--cyber-cyan)]/15 animate-ping opacity-75" />
          <div className="absolute inset-2 rounded-full bg-[var(--cyber-purple)]/20 animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#121820] to-[#1e293b] border border-[var(--cyber-cyan)]/40 flex items-center justify-center shadow-lg shadow-[var(--cyber-cyan)]/10">
            <Database className="w-8 h-8 text-[var(--cyber-cyan)] animate-pulse" />
          </div>
        </div>

        {/* Mandatory Heading State */}
        <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight mb-2">
          Connecting to Vakh Data Space...
        </h2>
        <p className="text-sm font-medium text-[var(--cyber-cyan)] mb-4 font-mono">
          Waiting for Vakh Structured Intake
        </p>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-lg mx-auto mb-6">
          CBAM-AuditTrace is connected to <span className="text-[var(--text-primary)] font-semibold">vakh.com</span> as its central data engine. 
          The Dual-Pane Split Screen renders strictly when evidence records are resolved from the live Vakh Space endpoint.
        </p>

        {/* Live Vakh Telemetry Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-xl mb-6 text-left text-xs font-mono">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
              <Server className="w-3 h-3 text-[var(--cyber-cyan)]" /> Vakh Space
            </span>
            <span className="font-semibold text-[var(--text-primary)] truncate" title={config.spaceName}>
              {config.spaceId}
            </span>
          </div>

          <div className="flex flex-col gap-0.5 border-t sm:border-t-0 sm:border-l border-[var(--border-subtle)] sm:pl-3 pt-2 sm:pt-0">
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3 text-[var(--cyber-purple)]" /> Target Board
            </span>
            <span className="font-semibold text-[var(--text-primary)] truncate" title={config.boardName}>
              {config.boardId}
            </span>
          </div>

          <div className="flex flex-col gap-0.5 border-t sm:border-t-0 sm:border-l border-[var(--border-subtle)] sm:pl-3 pt-2 sm:pt-0">
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" /> Gateway Status
            </span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              REST Polling Active
            </span>
          </div>
        </div>

        {/* Action Button: Ingest Evidence from Vakh Stream */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleTriggerLiveIntake}
            disabled={isSimulatingIntake}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-purple)] text-black font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg hover:shadow-[var(--cyber-cyan)]/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            {isSimulatingIntake ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>Pulling Vakh Board Stream...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black" />
                <span>Simulate Vakh Supplier Intake (Live Stream)</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => vakhService.fetchLivePayload(200)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-subtle)] hover:border-[var(--cyber-cyan)]/50 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Poll Vakh Endpoint</span>
          </button>
        </div>

        {/* Footnote on Single Source of Truth */}
        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-center gap-2 text-[11px] text-[var(--text-muted)]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Strict EU CBAM Verification: 100% Provenance Bound to Vakh Schema Coordinates</span>
        </div>
      </div>
    </div>
  );
};
