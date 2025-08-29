import React from 'react';

const Logo: React.FC = () => (
  <svg 
    width="240" 
    height="48" 
    viewBox="0 0 240 48" 
    xmlns="http://www.w3.org/2000/svg" 
    className="mx-auto"
    aria-label="ARKTryouts Logo"
  >
    {/* Icon: Stylized 'A' resembling a hanger */}
    <g transform="translate(0, 4)">
      <path 
        d="M10 35 L25 5 L40 35 M16 25 L34 25" 
        stroke="black" 
        strokeWidth="3.5" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </g>
    {/* Text: ARKTryouts */}
    <text 
      x="52" 
      y="32" 
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" 
      fontSize="30" 
      fill="black"
      fontWeight="600"
      letterSpacing="-0.5"
    >
      ARK<tspan fontWeight="300">Tryouts</tspan>
    </text>
  </svg>
);

export default Logo;
