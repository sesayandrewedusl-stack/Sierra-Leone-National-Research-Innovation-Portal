import React from 'react';

interface SLNRIPLogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export const SLNRIPLogo: React.FC<SLNRIPLogoProps> = ({
  className = 'h-12',
  showText = true,
  variant = 'light',
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto aspect-square flex-shrink-0"
        aria-label="SLNRIP Official Logo"
      >
        {/* Emerald Crescent Arc (#1EB53A) */}
        <path
          d="M 285 70 C 205 60 145 110 145 200 C 145 250 170 285 200 305 L 200 245 C 185 235 175 215 175 195 C 175 135 220 95 285 105 Z"
          fill="#1EB53A"
        />

        {/* Discovery Star Sparkle (#10243A) */}
        <path
          d="M 330 100 Q 330 80 340 70 Q 350 80 350 100 Q 350 120 340 130 Q 330 120 330 100 Z"
          fill={variant === 'dark' ? '#FFFFFF' : '#10243A'}
        />

        {/* Pillar 1 */}
        <path d="M 200 280 L 230 270 L 230 420 L 200 430 Z" fill="#005A9E" />
        <path d="M 200 280 L 230 270 L 230 250 L 200 260 Z" fill="#0072C6" />

        {/* Pillar 2 */}
        <path d="M 235 240 L 265 230 L 265 400 L 235 410 Z" fill="#0066B3" />
        <path d="M 235 240 L 265 230 L 265 210 L 235 220 Z" fill="#0072C6" />

        {/* Pillar 3 */}
        <path d="M 270 200 L 300 190 L 300 380 L 270 390 Z" fill="#0072C6" />
        <path d="M 270 200 L 300 190 L 300 170 L 270 180 Z" fill="#1685D8" />

        {/* Pillar 4 */}
        <path d="M 305 165 L 335 155 L 335 345 L 305 355 Z" fill="#0072C6" />
        <path d="M 305 165 L 335 155 L 335 135 L 305 145 Z" fill="#2B97EB" />

        {/* Dynamic Growth Arrow */}
        <path
          d="M 180 440 C 270 430 330 370 360 250 L 340 265 L 370 180 L 415 250 L 385 245 C 360 385 285 450 180 440 Z"
          fill="#005696"
        />
      </svg>

      {showText && (
        <div className="flex flex-col text-left">
          <span
            className={`font-serif font-extrabold text-sm md:text-base leading-tight tracking-tight ${
              variant === 'dark' ? 'text-white' : 'text-[#10243A]'
            }`}
          >
            Sierra Leone National Research
          </span>
          <span className="font-sans font-bold text-xs md:text-sm leading-tight text-[#0072C6] tracking-wide">
            &amp; Innovation Portal
          </span>
        </div>
      )}
    </div>
  );
};
