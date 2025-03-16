import { useMedia } from 'react-use';
import { useMemo } from 'react';

/**
 * Hook for detecting responsive breakpoints
 * Uses react-use's useMedia to handle SSR and proper cleanup
 * Memoizes the media query to prevent unnecessary calculations
 * 
 * @param breakpoint - The max-width breakpoint in pixels for mobile detection
 * @param defaultState - Optional default state for SSR (defaults to false for desktop-first approach)
 */
export function useResponsive(breakpoint = 768, defaultState = false) {
  // Memoize the media query string to prevent unnecessary re-renders
  const mediaQuery = useMemo(() => `(max-width: ${breakpoint}px)`, [breakpoint]);
  
  // useMedia returns true if the media query matches
  // defaultState is used during SSR to prevent hydration mismatches
  const isMobile = useMedia(mediaQuery, defaultState);
  
  return { isMobile };
} 