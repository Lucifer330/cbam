import React from 'react';
import { ShieldCheck, GitBranch } from 'lucide-react';

interface RuleVersionBadgeProps {
  version: string;
  isClickable?: boolean;
  onClick?: () => void;
  subtle?: boolean;
}

export const RuleVersionBadge: React.FC<RuleVersionBadgeProps> = ({
  version,
  isClickable = false,
  onClick,
  subtle = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isClickable}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-[4px] transition-colors ${
        subtle
          ? 'bg-[#f4f4f0] text-[#3d5042] border border-[#d8dcd9]'
          : 'bg-[#eaf0eb] text-[#2c3d31] border border-[#c5d3c8]'
      } ${isClickable ? 'hover:bg-[#dce6dd] cursor-pointer' : 'cursor-default'}`}
      title="Deterministic Rule Engine version applied under EU Reg 2023/956"
    >
      <GitBranch className="w-3 h-3 text-[#3d5042]" />
      <span>Rule {version}</span>
      <ShieldCheck className="w-3 h-3 text-[#1b6830]" />
    </button>
  );
};
