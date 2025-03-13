import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableAccordionProps {
  isOpen: boolean;
  onToggle: () => void;
  summary: React.ReactNode;
  children: React.ReactNode;
}

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
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          !isOpen && "h-0"
        )}
      >
        {children}
      </div>
    </div>
  );
} 