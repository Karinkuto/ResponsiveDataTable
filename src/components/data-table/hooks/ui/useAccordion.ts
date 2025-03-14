import { useState, useCallback } from "react";

/**
 * Hook to manage accordion open/close state
 * Used to track which accordion items are open in the mobile view
 */
export function useAccordion(initialOpenId: string | null = null) {
  const [openItemId, setOpenItemId] = useState<string | null>(initialOpenId);
  
  // Toggle accordion item open/closed
  const toggleItem = useCallback((id: string) => {
    setOpenItemId(prev => prev === id ? null : id);
  }, []);
  
  // Check if an item is open
  const isOpen = useCallback((id: string) => openItemId === id, [openItemId]);
  
  return { openItemId, toggleItem, isOpen };
} 