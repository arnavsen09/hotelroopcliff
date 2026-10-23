import React from 'react';
import { Link } from 'react-router-dom';

interface HotelLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'footer';
  theme?: 'dark' | 'light' | 'gold' | 'natural';
  showLocation?: boolean;
  showSubtitle?: boolean;
  linkToHome?: boolean;
  className?: string;
}

export const HotelLogo: React.FC<HotelLogoProps> = ({
  size = 'md',
  theme = 'gold',
  showLocation = false,
  linkToHome = true,
  className = '',
}) => {
  // Balanced height definitions to ensure proper logo sizing across all devices
  const heights = {
    sm: '28px',
    md: '38px',
    lg: '52px',
    hero: '68px',
    footer: '54px',
  }[size];

  // Pick the clean, transparent logo asset without any fragile CSS color-distortion filters
  const logoSrc = {
    gold: '/logo-gold.png',
    light: '/logo-white.png',
    dark: '/logo-transparent.png',
    natural: '/logo-transparent.png',
  }[theme];

  const content = (
    <div
      className={`inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <img
        src={logoSrc}
        alt="Roop Cliff Hotel Bhopal Crest Logo"
        style={{
          height: heights,
          maxHeight: heights,
          width: 'auto',
          maxWidth: '180px',
          objectFit: 'contain',
          display: 'block',
        }}
        className="shrink-0 transition-transform duration-300 hover:scale-[1.02]"
      />
      {showLocation && (
        <span
          className="tracking-[0.24em] font-medium uppercase text-[8px] mt-1.5"
          style={{
            fontFamily: 'Manrope, sans-serif',
            color: theme === 'gold' ? '#D4AF37' : theme === 'light' ? 'rgba(255,255,255,0.75)' : '#142E25',
          }}
        >
          ZONE-I MP NAGAR · BHOPAL
        </span>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link
        to="/"
        aria-label="Roop Cliff Hotel - Return to Homepage"
        className="inline-flex items-center justify-center outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] rounded transition-opacity hover:opacity-95"
      >
        {content}
      </Link>
    );
  }

  return content;
};
