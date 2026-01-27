'use client';

import React, { useEffect, useState, useRef } from 'react';
import { tokens } from '../tokens';

interface KeyboardAwareContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  enableOnMobile?: boolean;
}

export const KeyboardAwareContainer: React.FC<KeyboardAwareContainerProps> = ({
  children,
  style = {},
  className,
  enableOnMobile = true,
}) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on mobile devices and when requested
    if (!enableOnMobile || typeof window === 'undefined') return;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (!isMobile) return;

    let initialViewportHeight = window.innerHeight;

    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDiff = initialViewportHeight - currentHeight;

      // Consider keyboard visible if height difference is significant (> 150px)
      if (heightDiff > 150) {
        setKeyboardHeight(heightDiff);
        setIsKeyboardVisible(true);
      } else {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
        initialViewportHeight = window.innerHeight;
      }
    };

    const handleFocus = (e: FocusEvent) => {
      // Small delay to allow keyboard to appear
      setTimeout(() => {
        const target = e.target as HTMLElement;
        if (target && containerRef.current) {
          // Scroll the focused element into view
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 300);
    };

    // Listen for visual viewport changes (keyboard show/hide)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    }

    // Fallback for older browsers
    window.addEventListener('resize', handleViewportChange);

    // Listen for focus events on inputs
    document.addEventListener('focusin', handleFocus);

    // Reset initial height on orientation change
    const handleOrientationChange = () => {
      setTimeout(() => {
        initialViewportHeight = window.innerHeight;
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
      window.removeEventListener('resize', handleViewportChange);
      document.removeEventListener('focusin', handleFocus);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [enableOnMobile]);

  const containerStyle: React.CSSProperties = {
    ...style,
    // Add bottom padding when keyboard is visible to prevent overlap
    paddingBottom: isKeyboardVisible ? `${keyboardHeight + tokens.spacing[4]}px` : style.paddingBottom,
    // Ensure smooth transitions
    transition: 'padding-bottom 0.3s ease-in-out',
  };

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className={className}
      data-keyboard-visible={isKeyboardVisible}
      data-keyboard-height={keyboardHeight}
    >
      {children}
    </div>
  );
};