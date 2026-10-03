import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Calculator, 
  History, 
  Download, 
  Settings, 
  ChevronDown, 
  Building2, 
  Layers,
  Upload,
  Globe,
  Sun,
  Moon,
  Sparkles,
  Lock
} from 'lucide-react';
import { VakhLiveBadge } from './VakhLiveBadge';

interface AppShellProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  awaitingVerificationCount: number;
  onOpenUpload: () => void;
  activeRuleVersion: string;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onTabChange,
  awaitingVerificationCount,
  onOpenUpload,
  activeRuleVersion,
  children,
}) => {
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('ThyssenKrupp Euro-Import S.A. [DE94827103]');
  const [themeMode, setThemeMode] = useState<'cyber' | 'studio'>('cyber');

  // Sync theme attribute to document element
  useEffect(() => {
    if (themeMode === 'studio') {
      document.documentElement.setAttribute('data-theme', 'studio');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [themeMode]);

  const workspaces = [
    'ThyssenKrupp Euro-Import S.A. [DE94827103]',
    'ArcelorMittal Distribution Europe [LU10928341]',
    'Salzgitter AG Trading [DE29103847]'
  ];

  const navItems = [
    { id: 'overview', label: '3D Overview', icon: Layers },
    { 
      id: 'vakh-portal', 
      label: 'Supplier Portal', 
      icon: Globe,
      badge: 'Vakh'
    },
    { id: 'documents', label: 'Documents', icon: FileText },
    { 
      id: 'verification', 
      label: 'Human Verification', 
      icon: CheckCircle2,
      badge: awaitingVerificationCount > 0 ? awaitingVerificationCount : null
    },
    { id: 'calculations', label: 'Calculations', icon: Calculator },
    { id: 'audit', label: 'Audit Trail', icon: History },
    { id: 'exports', label: 'Exports', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      themeMode === 'cyber' ? 'bg-[#06090e] text-[#f8fafc]' : 'bg-[#f5f6f8] text-[#0f172a]'
    }`}>
      {/* Topmost Official Cryptographic Compliance Ribbon */}
      <div className="bg-[#030609] text-white px-6 py-2 text-[11px] font-mono flex flex-wrap items-center justify-between border-b border-[#1e293b]/80 relative z-40">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-[#34d399] tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_6px_#10b981]" />
            EU Reg (EU) 2023/956 Live Node
          </span>
          <span className="text-[#334155] hidden md:inline">|</span>
          <span className="text-[#94a3b8] hidden md:inline">
            Implementing Regulation (EU) 2023/1773 Transitional Engine
          </span>
        </div>

        <div className="flex items-center gap-4 text-[#94a3b8]">
          <span className="flex items-center gap-1 text-[#38bdf8]">
            <Lock className="w-3 h-3" />
            <span>Deterministic Engine: {activeRuleVersion}</span>
          </span>
          <span className="text-[#334155]">|</span>
          <span className="text-[10px] text-[#64748b] bg-[#0c1219] px-2 py-0.5 rounded border border-[#1e293b]">
            Zero Math Hallucination Ledger
          </span>
        </div>
      </div>

      {/* Main 3D Holographic Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/90 border-b border-slate-800 px-6 py-3.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Brand & Tagline with 3D Shield */}
          <div className="flex flex-wrap items-center gap-3.5">
            <div className="w-9 h-9 rounded-[8px] bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-[#34d399]/40">
              <ShieldCheck className="w-5 h-5 text-white filter drop-shadow-sm" />
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

          {/* Top-Right: 3D Mode Switcher, Vakh Portal, Upload, Workspace & Profile */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 3D Theme Mode Toggle (Cyber vs Studio) */}
            <button
              type="button"
              onClick={() => setThemeMode(themeMode === 'cyber' ? 'studio' : 'cyber')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#1e293b]/80 hover:bg-[#334155] border border-[#334155] text-xs font-mono font-semibold text-[#f1f5f9] transition-all shadow-sm cursor-pointer"
              title="Toggle between 3D Cyber HUD and 3D Studio Slate"
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

            {/* Vakh Live Sync Badge */}
            <VakhLiveBadge />

            {/* Vakh Supplier Portal Button */}
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

            {/* Quick Upload Action */}
            <button
              type="button"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[6px] bg-[#10b981] hover:bg-[#059669] text-[#022c22] text-xs font-mono font-bold transition-all shadow-[0_2px_10px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Add Evidence</span>
            </button>

            {/* Workspace Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[#16202e] border border-[#334155] text-xs font-mono font-medium text-white hover:bg-[#1e293b] transition-colors max-w-[200px] truncate cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                <span className="truncate">{selectedWorkspace.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-[#94a3b8] shrink-0" />
              </button>

              {workspaceMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-[8px] bg-[#0c1219] border border-[#334155] shadow-2xl py-1.5 z-50 text-xs backdrop-blur-xl">
                  <div className="px-3.5 py-1.5 font-bold text-[#64748b] text-[10px] font-mono uppercase tracking-wider border-b border-[#1e293b]">
                    Active Declarant Workspace
                  </div>
                  {workspaces.map((ws) => (
                    <button
                      key={ws}
                      type="button"
                      onClick={() => {
                        setSelectedWorkspace(ws);
                        setWorkspaceMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs font-mono hover:bg-[#16202e] flex items-center justify-between cursor-pointer ${
                        selectedWorkspace === ws ? 'font-bold text-[#34d399] bg-[#10b981]/10' : 'text-[#cbd5e1]'
                      }`}
                    >
                      <span className="truncate">{ws}</span>
                      {selectedWorkspace === ws && <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Clearance Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#334155]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1e293b] to-[#334155] border border-[#38bdf8]/40 flex items-center justify-center text-xs font-mono font-bold text-[#38bdf8] shadow-sm">
                EM
              </div>
              <div className="hidden xl:block text-left text-xs leading-tight font-mono">
                <div className="font-semibold text-white">E. Moreau</div>
                <div className="text-[10px] text-[#34d399]">Lead Verifier</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Embossed Navigation Bar */}
        <div className="max-w-7xl mx-auto mt-3.5 pt-2 border-t border-[#1e293b]/70">
          <nav className="flex items-center gap-1.5 overflow-x-auto text-xs py-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] font-mono text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#10b981] text-[#022c22] shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-102 font-bold'
                      : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      item.badge === 'Vakh'
                        ? isActive
                          ? 'bg-[#022c22] text-[#34d399]'
                          : 'bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30'
                        : isActive
                          ? 'bg-[#022c22] text-[#f59e0b]'
                          : 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 relative">
        {children}
      </main>

      {/* 3D Cyber Industrial Compliance Footer */}
      <footer className="bg-[#0c1219]/90 border-t border-[#1e293b] px-6 py-4 text-xs font-mono text-[#64748b] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white">CBAM-AuditTrace</span>
            <span>·</span>
            <span>Regulation (EU) 2023/956 3D Compliance Console</span>
            <span>·</span>
            <span className="text-[#34d399]">Rule Engine {activeRuleVersion}</span>
          </div>

          <div className="text-[11px] text-[#475569]">
            Cryptographic SHA-256 Provenance Ledger · Zero Math Hallucination
          </div>
        </div>
      </footer>
    </div>
  );
};
