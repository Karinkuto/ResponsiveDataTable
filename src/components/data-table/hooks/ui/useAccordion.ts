import { useState, useCallback, useMemo } from "react";

/**
 * Hook to manage accordion open/close state
 * Used to track which accordion items are open in the mobile view
 * Optimized with proper memoization of functions
 */
export function useAccordion(initialOpenId: string | null = null) {
  const [openItemId, setOpenItemId] = useState<string | null>(initialOpenId);
  
  // Toggle accordion item open/closed - stable function reference with useCallback
  const toggleItem = useCallback((id: string) => {
    setOpenItemId(prev => prev === id ? null : id);
  }, []);
  
  // Check if an item is open - memoized for better performance
  const isOpen = useCallback((id: string) => openItemId === id, [openItemId]);
  
  // Return memoized object to prevent unnecessary re-renders in consuming components
  return useMemo(() => ({ 
    openItemId, 
    toggleItem, 
    isOpen 
  }), [openItemId, toggleItem, isOpen]);
} 