import React, { useEffect, useState } from 'react';
import { vakhService } from '../../services/vakhService';
import type { VakhSyncState, VakhSpacePayload } from '../../types/vakh';
import { Database, CheckCircle2, RefreshCw, AlertCircle, Wifi, ExternalLink } from 'lucide-react';

interface VakhLiveBadgeProps {
  className?: string;
  showDetailsModal?: boolean;
}

export const VakhLiveBadge: React.FC<VakhLiveBadgeProps> = ({ className = '' }) => {
  const [syncState, setSyncState] = useState<VakhSyncState>(vakhService.getSyncState());
  const [payload, setPayload] = useState<VakhSpacePayload | null>(vakhService.getCachedPayload());
  const [isHovered, setIsHovered] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Live');

  useEffect(() => {
    const unsubscribe = vakhService.subscribe((state, newPayload) => {
      setSyncState(state);
      if (newPayload) {
        setPayload(newPayload);
        setLastSyncTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    });

    return () => unsubscribe();
  }, []);

  const config = vakhService.getConfig();

  const getStatusBadge = () => {
    switch (syncState) {
      case 'synced':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400 animate-pulse',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'Powered by Vakh Data Space (Live Sync Active)',
          sub: `${payload?.totalRecords ?? 0} items active · ${lastSyncTime}`
        };
      case 'syncing':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
          dot: 'bg-cyan-400 animate-spin',
          icon: <RefreshCw className="w-3.5 h-3.5 text-cyan-300 animate-spin" />,
          label: 'Syncing with Vakh Board...',
          sub: 'Patching auditor modifications in real-time'
        };
      case 'connecting':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          dot: 'bg-amber-400 animate-ping',
          icon: <Wifi className="w-3.5 h-3.5 text-amber-300 animate-pulse" />,
          label: 'Connecting to Vakh Space...',
          sub: 'Handshaking REST & stream gateway'
        };
      case 'waiting':
        return {
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
          dot: 'bg-purple-400 animate-pulse',
          icon: <Database className="w-3.5 h-3.5 text-purple-300" />,
          label: 'Waiting for Vakh Intake',
          sub: 'Awaiting supplier payload stream'
        };
      case 'error':
      default:
        return {
          bg: 'bg-red-500/10 border-red-500/30 text-red-300',
          dot: 'bg-red-400',
          icon: <AlertCircle className="w-3.5 h-3.5 text-red-400" />,
          label: 'Vakh Space Disconnected',
          sub: 'Click to retry connection'
        };
    }
  };

  const status = getStatusBadge();

  return (
    <div 
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        onClick={() => vakhService.fetchLivePayload(200)}
        className={`px-3 py-1.5 rounded-lg border backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-sm ${status.bg}`}
        title="Vakh Data Space single source of truth"
      >
        <div className="relative flex items-center justify-center">
          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
        </div>
        <div className="flex items-center gap-1.5">
          {status.icon}
          <span className="text-xs font-semibold tracking-wide font-sans">{status.label}</span>
        </div>
        <span className="hidden sm:inline-block font-mono text-[10px] opacity-75 border-l border-current/20 pl-2">
          {config.boardId.replace('brd_', '')}
        </span>
      </div>

      {/* Floating Info Tooltip on Hover */}
      {isHovered && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 p-3 bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-xl shadow-2xl backdrop-blur-xl text-left text-xs font-sans space-y-2 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-1.5">
            <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[var(--cyber-cyan)]" />
              Vakh Data Engine
            </span>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Live Gateway
            </span>
          </div>

          <div className="space-y-1 font-mono text-[11px] text-[var(--text-secondary)]">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Space ID:</span>
              <span className="text-[var(--text-primary)] truncate max-w-[140px]">{config.spaceId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Board:</span>
              <span className="text-[var(--text-primary)] truncate max-w-[140px]">{config.boardName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Payload:</span>
              <span className="text-emerald-400 font-semibold">{payload?.totalRecords ?? 0} active records</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Endpoint:</span>
              <span className="text-[var(--cyber-cyan)] truncate max-w-[140px]">vakh.com/v1/spaces</span>
            </div>
          </div>

          <div className="pt-1 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] flex items-center justify-between">
            <span>Bi-directional sync enabled</span>
            <span className="text-emerald-400 flex items-center gap-0.5">
              100% Truth <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
