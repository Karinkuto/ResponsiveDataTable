import { useMedia } from 'react-use';

/**
 * Hook for detecting responsive breakpoints
 * Uses react-use's useMedia to handle SSR and proper cleanup
 * 
 * @param breakpoint - The max-width breakpoint in pixels for mobile detection
 * @param defaultState - Optional default state for SSR (defaults to false for desktop-first approach)
 */
export function useResponsive(breakpoint = 768, defaultState = false) {
  // useMedia returns true if the media query matches
  // defaultState is used during SSR to prevent hydration mismatches
  const isMobile = useMedia(`(max-width: ${breakpoint}px)`, defaultState);
  return { isMobile };
} 