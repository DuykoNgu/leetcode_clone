import { cn } from "@/lib/utils";

export function TabButton({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all",
        active 
          ? "border-brand-orange text-slate-900 bg-white" 
          : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
