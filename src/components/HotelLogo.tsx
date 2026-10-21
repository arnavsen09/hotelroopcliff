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
  // Height definitions for the authentic crest logo
  const heights = {
    sm: '38px',
    md: '52px',
    lg: '76px',
    hero: '110px',
    footer: '95px',
  }[size];

  // Theme styling for the logo image
  // The raw image is black lines on white.
  // 'gold': transforms into warm lustrous imperial gold
  // 'light': pure crisp white for dark backgrounds
  // 'dark': deep rich emerald-onyx for light backgrounds
  // 'natural': unaltered original
  const imageFilter = {
    gold: 'brightness(0) invert(75%) sepia(60%) saturate(650%) hue-rotate(5deg) brightness(105%) contrast(98%) drop-shadow(0 2px 8px rgba(212,175,55,0.25))',
    light: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
    dark: 'brightness(0) saturate(100%) invert(13%) sepia(20%) saturate(1500%) hue-rotate(110deg) brightness(85%) contrast(100%)',
    natural: 'none',
  }[theme];

  const content = (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      <img
        src="/logo.png"
        alt="Roop Cliff Hotel Bhopal Crest"
        style={{
          height: heights,
          width: 'auto',
          objectFit: 'contain',
          filter: imageFilter,
          transition: 'filter 0.3s ease, transform 0.3s ease',
        }}
        className="shrink-0 transition-transform duration-300 hover:scale-[1.03]"
      />
      {showLocation && (
        <span
          className="tracking-[0.32em] font-medium uppercase text-[8px] sm:text-[9px] mt-1.5"
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
        className="inline-flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded p-1 transition-opacity hover:opacity-95"
      >
        {content}
      </Link>
    );
  }

  return content;
};
