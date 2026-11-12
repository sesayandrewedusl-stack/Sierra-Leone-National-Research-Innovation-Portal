import React from 'react';

interface SierraLeoneFlagProps {
  className?: string;
}

export const SierraLeoneFlag: React.FC<SierraLeoneFlagProps> = ({ className = 'h-4 w-6' }) => {
  return (
    <div
      className={`inline-flex flex-col overflow-hidden rounded shadow-sm border border-slate-300/60 select-none flex-shrink-0 ${className}`}
      title="Flag of the Republic of Sierra Leone"
      aria-label="Flag of Sierra Leone"
    >
      {/* Top: Light Green */}
      <div className="h-1/3 w-full bg-[#1EB53A]" />
      {/* Middle: White */}
      <div className="h-1/3 w-full bg-[#FFFFFF]" />
      {/* Bottom: Cobalt Blue */}
      <div className="h-1/3 w-full bg-[#0072C6]" />
    </div>
  );
};
