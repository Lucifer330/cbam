import React from 'react';
import { ShieldCheck, Sparkles, Sun, Globe } from 'lucide-react';
import { VakhLiveBadge } from '../common/VakhLiveBadge';

interface HeaderProps {
  themeMode?: 'cyber' | 'studio';
  onToggleTheme?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenUpload?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  themeMode = 'cyber',
  onToggleTheme,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/90 border-b border-slate-800 px-6 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="w-9 h-9 rounded-[8px] bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-[#34d399]/40">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white uppercase font-sans flex items-center gap-1.5">
                CBAM-AuditTrace
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[4px] bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40 shadow-xs">
                  3D HUD
                </span>
              </span>
            </div>
            <p className="text-[11px] text-[#94a3b8] font-mono">
              Trace every CBAM number back to its source
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#1e293b]/80 hover:bg-[#334155] border border-[#334155] text-xs font-mono font-semibold text-[#f1f5f9] transition-all cursor-pointer"
            >
              {themeMode === 'cyber' ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span className="hidden sm:inline">3D Cyber HUD</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span className="hidden sm:inline">3D Studio Slate</span>
                </>
              )}
            </button>
          )}

          <VakhLiveBadge />

          {onTabChange && (
            <button
              type="button"
              onClick={() => onTabChange('vakh-portal')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'vakh-portal'
                  ? 'bg-[#10b981] text-[#022c22] shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                  : 'bg-[#1e293b]/70 text-[#cbd5e1] hover:bg-[#334155] border border-[#334155]'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#34d399]" />
              <span className="hidden sm:inline">Supplier Portal</span>
              <span className="text-[9px] px-1 py-0.2 rounded font-mono font-bold bg-[#022c22] text-[#34d399] border border-[#10b981]/40">
                VAKH
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
