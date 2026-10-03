import React, { useState, Suspense, lazy } from 'react';
import { Layers, ShieldCheck, Globe, Sparkles, Move3d } from 'lucide-react';
import { CBAM3DLogo } from './CBAM3DLogo';
import { Globe3D } from './Globe3D';

// Lazy-load Spline to prevent blocking and optimize bundle performance
const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineHeroContainerProps {
  splineUrl?: string;
  onUpdateSplineUrl?: (url: string) => void;
  onNavigateToTrace?: () => void;
}

export const SplineHeroContainer: React.FC<SplineHeroContainerProps> = ({
  splineUrl = 'https://prod.spline.design/rU-1iN643EB-IlsO/scene.splinecode',
  onNavigateToTrace,
}) => {
  const [activeTab, setActiveTab] = useState<'globe' | 'shield' | 'spline' | 'visualizer'>('globe');
  const [isHoveredNode, setIsHoveredNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [splineFailed, setSplineFailed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <div className="relative rounded-[12px] bg-[#070a0e] border border-[#1e293b] overflow-hidden shadow-2xl preserve-3d">
      {/* Top 3D Control Bar with Mode Switcher */}
      <div className="px-5 py-3 border-b border-[#1e293b] bg-[#0c1219]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 z-20 relative">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="text-xs font-semibold font-mono text-[#f1f5f9] tracking-tight uppercase">
            3D Carbon Audit Cockpit · EU 2023/956
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono text-[#38bdf8] bg-[#0f172a] px-2 py-0.5 rounded border border-[#334155]">
            Hardware Accelerated 3D Engine
          </span>
        </div>

        {/* Tab switcher for 3D Views */}
        <div className="inline-flex rounded-[7px] bg-[#111827] p-1 border border-[#1f2937] text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('globe')}
            className={`px-3 py-1.5 rounded-[5px] font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'globe'
                ? 'bg-[#10b981] text-[#022c22] font-bold shadow-md'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3D Global Origin</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shield')}
            className={`px-3 py-1.5 rounded-[5px] font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'shield'
                ? 'bg-[#10b981] text-[#022c22] font-bold shadow-md'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3D Compliance Shield</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('spline')}
            className={`px-3 py-1.5 rounded-[5px] font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'spline'
                ? 'bg-[#0ea5e9] text-white font-bold shadow-md'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spline 3D Scene</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('visualizer')}
            className={`px-3 py-1.5 rounded-[5px] font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'visualizer'
                ? 'bg-[#334155] text-white shadow-md'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Lineage Topology</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas / Viewport */}
      <div className="relative min-h-[460px] md:min-h-[500px] flex items-center justify-center bg-[#070a0e] overflow-hidden">
        {/* Subtle Cyber Blueprint Background Matrix */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)',
            backgroundSize: '24px 24px, 48px 48px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        />

        {/* Ambient Corner Plasma Lights */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. 3D GLOBAL CARBON ORIGIN GLOBE */}
        {activeTab === 'globe' && (
          <div className="w-full h-full z-10">
            <Globe3D />
          </div>
        )}

        {/* 2. 3D COMPLIANCE SHIELD */}
        {activeTab === 'shield' && (
          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            className="w-full h-full flex flex-col items-center justify-center p-6 z-10"
          >
            <div className="absolute top-4 left-5 z-10 flex items-center gap-2 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] bg-[#0f172a]/90 border border-[#334155] text-[11px] font-mono text-[#f1f5f9] shadow-sm backdrop-blur-md">
                <Move3d className="w-3.5 h-3.5 text-[#34d399]" />
                Interactive 3D Specular Tilt · Hover to inspect angles
              </span>
            </div>

            <CBAM3DLogo 
              tiltX={-mousePos.y * 24} 
              tiltY={mousePos.x * 24} 
              onTraceClick={onNavigateToTrace} 
            />
          </div>
        )}

        {/* 3. SPLINE 3D SCENE (With graceful fallback) */}
        {activeTab === 'spline' && (
          <div className="w-full h-[480px] relative z-10 flex items-center justify-center">
            {!splineFailed ? (
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
                    <span className="text-xs font-mono text-[#94a3b8]">Initializing Spline 3D Scene Runtime...</span>
                  </div>
                }
              >
                <Spline
                  scene={splineUrl}
                  className="w-full h-full"
                  onError={() => setSplineFailed(true)}
                />
              </Suspense>
            ) : (
              <div className="text-center p-8 max-w-md">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-semibold text-white">Spline 3D Scene Offline</h4>
                <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
                  Remote Spline connection was throttled. You can use our built-in hardware-accelerated 3D Globe and 3D Shield engines seamlessly!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('globe')}
                  className="mt-4 px-4 py-1.5 rounded-[5px] bg-[#10b981] text-[#022c22] font-semibold text-xs transition-all hover:bg-[#059669]"
                >
                  Switch to 3D Globe
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. LINEAGE TOPOLOGY */}
        {activeTab === 'visualizer' && (
          <div className="w-full h-full p-6 z-10 flex flex-col justify-center">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Node 1 */}
              <div
                onMouseEnter={() => setIsHoveredNode('node-1')}
                onMouseLeave={() => setIsHoveredNode(null)}
                className={`p-4 rounded-[8px] transition-all border backdrop-blur-md ${
                  isHoveredNode === 'node-1'
                    ? 'bg-[#1e293b]/90 border-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.25)] translate-y-[-2px]'
                    : 'bg-[#0f172a]/70 border-[#1e293b]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-[#64748b] font-mono mb-2">
                  <span>STAGE 01</span>
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                </div>
                <div className="text-xs font-semibold text-white mb-1">Supplier Evidence</div>
                <div className="text-[11px] text-[#94a3b8] leading-normal mb-2">
                  Invoices & EPDs fingerprinted with SHA-256 upon arrival.
                </div>
                <div className="font-mono text-[10px] text-[#34d399] bg-[#022c22]/50 p-1.5 rounded border border-[#10b981]/30">
                  SHA256: 4a8f9c...0c85
                </div>
              </div>

              {/* Node 2 */}
              <div
                onMouseEnter={() => setIsHoveredNode('node-2')}
                onMouseLeave={() => setIsHoveredNode(null)}
                className={`p-4 rounded-[8px] transition-all border backdrop-blur-md ${
                  isHoveredNode === 'node-2'
                    ? 'bg-[#1e293b]/90 border-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.25)] translate-y-[-2px]'
                    : 'bg-[#0f172a]/70 border-[#1e293b]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-[#64748b] font-mono mb-2">
                  <span>STAGE 02</span>
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
                </div>
                <div className="text-xs font-semibold text-white mb-1">Candidate Proposals</div>
                <div className="text-[11px] text-[#94a3b8] leading-normal mb-2">
                  OCR extracts coordinates & values. Marked as proposals.
                </div>
                <div className="font-mono text-[10px] text-[#f59e0b] bg-[#451a03]/40 p-1.5 rounded border border-[#f59e0b]/30">
                  x=132, y=418 (91% conf)
                </div>
              </div>

              {/* Node 3 */}
              <div
                onMouseEnter={() => setIsHoveredNode('node-3')}
                onMouseLeave={() => setIsHoveredNode(null)}
                className={`p-4 rounded-[8px] transition-all border backdrop-blur-md ${
                  isHoveredNode === 'node-3'
                    ? 'bg-[#1e293b]/90 border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.25)] translate-y-[-2px]'
                    : 'bg-[#0f172a]/70 border-[#1e293b]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-[#64748b] font-mono mb-2">
                  <span>STAGE 03</span>
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                </div>
                <div className="text-xs font-semibold text-white mb-1">Human Gatekeeper</div>
                <div className="text-[11px] text-[#94a3b8] leading-normal mb-2">
                  Customs declarant confirms or edits values manually.
                </div>
                <div className="font-mono text-[10px] text-[#34d399] bg-[#022c22]/50 p-1.5 rounded border border-[#10b981]/30">
                  E. Moreau · 09:44 CET
                </div>
              </div>

              {/* Node 4 */}
              <div
                onMouseEnter={() => setIsHoveredNode('node-4')}
                onMouseLeave={() => setIsHoveredNode(null)}
                className={`p-4 rounded-[8px] transition-all border backdrop-blur-md ${
                  isHoveredNode === 'node-4'
                    ? 'bg-[#1e293b]/90 border-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.25)] translate-y-[-2px]'
                    : 'bg-[#0f172a]/70 border-[#1e293b]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-[#64748b] font-mono mb-2">
                  <span>STAGE 04</span>
                  <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
                </div>
                <div className="text-xs font-semibold text-white mb-1">Deterministic Result</div>
                <div className="text-[11px] text-[#94a3b8] leading-normal mb-2">
                  Locked formula v2026.1. Zero math hallucination.
                </div>
                <div className="font-mono text-[10px] text-white font-bold bg-[#0c131d] p-1.5 rounded border border-[#334155] flex items-center justify-between">
                  <span>1,900.00 tCO₂e</span>
                  <span className="text-[#38bdf8]">v2026.1</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
