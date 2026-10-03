import React, { useState, useRef } from 'react';

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxRotation?: number; // max tilt degrees (default 12)
  depth?: number; // translateZ on hover in px (default 10)
  glowColor?: string; // e.g. 'rgba(16, 185, 129, 0.25)'
  className?: string;
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  maxRotation = 10,
  depth = 12,
  glowColor = 'rgba(16, 185, 129, 0.2)',
  className = '',
  onClick,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width - 0.5) * 2; // -1 to 1
    const normY = (y / rect.height - 0.5) * 2; // -1 to 1

    setRotate({
      x: -normY * maxRotation,
      y: normX * maxRotation,
    });

    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.6,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative rounded-[10px] transition-transform duration-150 ease-out preserve-3d cursor-pointer ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${
          isHovered ? `translateZ(${depth}px)` : 'translateZ(0px)'
        }`,
        boxShadow: isHovered
          ? `0 20px 35px -10px rgba(0, 0, 0, 0.5), 0 0 25px -5px ${glowColor}`
          : '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
      {...rest}
    >
      {/* Dynamic Specular Sheen Glare */}
      <div
        className="absolute inset-0 rounded-[10px] pointer-events-none transition-opacity duration-200 z-20"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.18) 0%, transparent 65%)`,
          opacity: glare.opacity,
        }}
      />

      {/* 3D Depth Layer Container */}
      <div className="relative z-10 w-full h-full preserve-3d">
        {children}
      </div>
    </div>
  );
};
