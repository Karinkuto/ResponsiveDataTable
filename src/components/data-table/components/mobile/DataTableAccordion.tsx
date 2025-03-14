import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
// Import types from the shared types directory
import { DataTableAccordionProps } from "../../types/table.types";

// Remove interface since it's now in the types file
// interface DataTableAccordionProps {...}

export function DataTableAccordion({ isOpen, onToggle, summary, children }: DataTableAccordionProps) {
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full px-4 py-3",
          "hover:bg-muted/50 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "relative"
        )}
      >
        <div className="flex-1">{summary}</div>
        <div className="absolute bottom-3 right-4">
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
          >
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </motion.div>
        </div>
      </button>
      <AnimatePresence mode="sync" initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ 
              height: "auto",
              transition: {
                duration: 0.25,
                ease: [0.4, 0.0, 0.2, 1]
              }
            }}
            exit={{ 
              height: 0,
              transition: {
                duration: 0.25,
                ease: [0.4, 0.0, 0.2, 1]
              }
            }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 