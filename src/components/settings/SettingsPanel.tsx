import React, { useState } from 'react';
import type { RuleVersion } from '../../types/cbam';
import { 
  Building2, 
  GitBranch, 
  Users, 
  ShieldCheck, 
  Box, 
  Save, 
  Check, 
  Lock, 
  ExternalLink,
  Sliders
} from 'lucide-react';

interface SettingsPanelProps {
  ruleVersions: RuleVersion[];
  activeRuleId: string;
  onSelectRuleVersion: (id: string) => void;
  splineUrl: string;
  onUpdateSplineUrl: (url: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  ruleVersions,
  activeRuleId,
  onSelectRuleVersion,
  splineUrl,
  onUpdateSplineUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'workspace' | 'rules' | 'users' | 'spline'>('workspace');
  const [currentSplineUrl, setCurrentSplineUrl] = useState(splineUrl);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSaveSpline = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSplineUrl(currentSplineUrl);
    setSavedMessage('Spline 3D Hero configuration saved successfully.');
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#e5e5de] pb-4">
        <h1 className="text-xl font-semibold text-[#191c1e] tracking-tight">
          Compliance Configuration & Settings
        </h1>
        <p className="text-xs text-[#5a6065] mt-1">
          Manage workspace declarant parameters, deterministic rule versions, authorized gatekeepers, and UI integrations.
        </p>
      </div>

      {savedMessage && (
        <div className="p-3 rounded-[4px] bg-[#ecf7ef] border border-[#c8e6ce] text-xs text-[#1b6830] flex items-center gap-2">
          <Check className="w-4 h-4" />
          {savedMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#e5e5de] gap-6 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('workspace')}
          className={`pb-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'workspace'
              ? 'border-[#3d5042] text-[#191c1e]'
              : 'border-transparent text-[#5a6065] hover:text-[#191c1e]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Workspace & EORI
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rules')}
          className={`pb-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'rules'
              ? 'border-[#3d5042] text-[#191c1e]'
              : 'border-transparent text-[#5a6065] hover:text-[#191c1e]'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          Rule Versions (EU Regs)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`pb-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'border-[#3d5042] text-[#191c1e]'
              : 'border-transparent text-[#5a6065] hover:text-[#191c1e]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Authorized Verifiers
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('spline')}
          className={`pb-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'spline'
              ? 'border-[#3d5042] text-[#191c1e]'
              : 'border-transparent text-[#5a6065] hover:text-[#191c1e]'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          Hero 3D (Spline Slot)
        </button>
      </div>

      {/* Tab 1: Workspace */}
      {activeTab === 'workspace' && (
        <div className="bg-white border border-[#e5e5de] rounded-[6px] p-6 space-y-4 max-w-2xl text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="company-name" className="text-[#5a6065] font-medium block mb-1">Company / Importer Name</label>
              <input
                id="company-name"
                type="text"
                disabled
                defaultValue="ThyssenKrupp Euro-Import S.A."
                className="w-full px-3 py-1.5 rounded-[4px] bg-[#fbfbfa] border border-[#d8d8ce] text-xs text-[#191c1e]"
              />
            </div>
            <div>
              <label htmlFor="eori-number" className="text-[#5a6065] font-medium block mb-1">EORI Number (Customs ID)</label>
              <input
                id="eori-number"
                type="text"
                disabled
                defaultValue="DE94827103"
                className="w-full px-3 py-1.5 rounded-[4px] bg-[#fbfbfa] border border-[#d8d8ce] text-xs font-mono text-[#191c1e]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="declarant-country" className="text-[#5a6065] font-medium block mb-1">Declarant Member State</label>
              <input
                id="declarant-country"
                type="text"
                disabled
                defaultValue="Germany (DE) — Federal Environment Agency"
                className="w-full px-3 py-1.5 rounded-[4px] bg-[#fbfbfa] border border-[#d8d8ce] text-xs text-[#191c1e]"
              />
            </div>
            <div>
              <label htmlFor="cbam-auth-id" className="text-[#5a6065] font-medium block mb-1">CBAM Authorisation Status</label>
              <input
                id="cbam-auth-id"
                type="text"
                disabled
                defaultValue="Authorised CBAM Declarant (Art. 17 EU 2023/956)"
                className="w-full px-3 py-1.5 rounded-[4px] bg-[#fbfbfa] border border-[#d8d8ce] text-xs text-[#1b6830] font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Rule Versions */}
      {activeTab === 'rules' && (
        <div className="space-y-4 max-w-3xl">
          <div className="text-xs text-[#5a6065]">
            Deterministic engine formulas are strictly version-controlled. Only active verified rule engines can execute calculations.
          </div>
          <div className="space-y-3">
            {ruleVersions.map((rule) => {
              const isActive = rule.id === activeRuleId;
              return (
                <div
                  key={rule.id}
                  className={`p-4 rounded-[6px] border transition-all ${
                    isActive
                      ? 'bg-white border-[#3d5042] shadow-xs'
                      : 'bg-[#fbfbfa] border-[#e5e5de]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#eaf0eb] text-[#2c3d31] border border-[#c8e6ce]">
                        {rule.version}
                      </span>
                      <span className="text-xs font-semibold text-[#191c1e]">{rule.title}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                      rule.status === 'ACTIVE'
                        ? 'bg-[#ecf7ef] text-[#1b6830] border border-[#c8e6ce]'
                        : 'bg-[#f0f0eb] text-[#848a90]'
                    }`}>
                      {rule.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#5a6065] mt-2">
                    {rule.description}
                  </div>
                  <div className="text-[11px] font-mono text-[#848a90] mt-1.5">
                    Legal Basis: {rule.regulationCode}
                  </div>
                  {!isActive && (
                    <div className="mt-3 pt-2 border-t border-[#f0f0eb] flex justify-end">
                      <button
                        type="button"
                        onClick={() => onSelectRuleVersion(rule.id)}
                        className="px-2.5 py-1 text-xs font-medium rounded-[4px] bg-white border border-[#d8d8ce] text-[#191c1e] hover:bg-[#f6f6f3]"
                      >
                        Switch to {rule.version}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Users / Verifiers */}
      {activeTab === 'users' && (
        <div className="bg-white border border-[#e5e5de] rounded-[6px] p-6 max-w-2xl text-xs space-y-3">
          <div className="font-semibold text-[#191c1e] mb-1">
            Designated Human Gatekeepers & Sign-Off Officers
          </div>
          <div className="divide-y divide-[#e5e5de]">
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <div className="font-medium text-[#191c1e]">E. Moreau</div>
                <div className="text-[11px] text-[#5a6065]">Lead CBAM Officer · Authorized Customs Verifier</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#ecf7ef] text-[#1b6830] border border-[#c8e6ce] text-[10px] font-mono">
                ACTIVE GATEKEEPER
              </span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <div className="font-medium text-[#191c1e]">H. Lindqvist</div>
                <div className="text-[11px] text-[#5a6065]">Senior Auditor · Technical Verifier</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#ecf7ef] text-[#1b6830] border border-[#c8e6ce] text-[10px] font-mono">
                ACTIVE GATEKEEPER
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Spline 3D Integration Slot */}
      {activeTab === 'spline' && (
        <div className="bg-white border border-[#e5e5de] rounded-[6px] p-6 max-w-2xl text-xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-[4px] bg-[#eaf0eb] border border-[#c8e6ce] flex items-center justify-center text-[#3d5042] shrink-0 mt-0.5">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#191c1e]">
                Hero 3D Visualizer (Spline Slot)
              </h2>
              <p className="text-xs text-[#5a6065] mt-0.5 leading-relaxed">
                Connect your custom 3D scene from Spline.design into the compliance hero section.
                Leave blank to use the built-in SVG European Lineage Topology.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSpline} className="space-y-3 pt-2">
            <div>
              <label htmlFor="spline-embed-url" className="text-[#5a6065] font-medium block mb-1">
                Spline Export / Viewer URL:
              </label>
              <input
                id="spline-embed-url"
                type="url"
                value={currentSplineUrl}
                onChange={(e) => setCurrentSplineUrl(e.target.value)}
                placeholder="https://my.spline.design/your-scene-id/"
                className="w-full px-3 py-2 rounded-[4px] bg-white border border-[#d8d8ce] text-xs font-mono text-[#191c1e] focus:outline-none focus:border-[#3d5042]"
              />
              <p className="text-[11px] text-[#848a90] mt-1">
                How it works: In Spline, click <strong>Export → Viewer Link</strong> or Public URL and paste it here.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-[4px] bg-[#191c1e] text-white text-xs font-medium hover:bg-[#2d3134] transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Save Spline Settings
              </button>
              {currentSplineUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentSplineUrl('');
                    onUpdateSplineUrl('');
                  }}
                  className="px-3 py-2 rounded-[4px] bg-white border border-[#d8d8ce] text-xs text-[#a82323] hover:bg-[#fdf2f2]"
                >
                  Clear URL
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
