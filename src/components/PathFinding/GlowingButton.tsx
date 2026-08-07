"use client";

import React, { useRef, useEffect } from 'react';
import styles from './GlowingButton.module.scss';

interface GlowingButtonProps {
  children: React.ReactNode;
  color: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const GlowingButton: React.FC<GlowingButtonProps> = ({
  children,
  color = '#0f0',
  onClick,
  className = '',
  disabled = false
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      button.style.setProperty('--x', `${x}px`);
      button.style.setProperty('--y', `${y}px`);
    };

    button.addEventListener('mousemove', handleMouseMove);
    return () => button.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`${styles.glowingButton} ${className}`}
      style={{ '--clr': color } as React.CSSProperties}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{children}</span>
    </button>
  );
};

export default GlowingButton;
