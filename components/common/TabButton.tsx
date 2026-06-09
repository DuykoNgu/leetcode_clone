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
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all duration-150",
        active 
          ? "text-slate-900" 
          : "text-slate-400 hover:text-slate-600"
      )}
    >
      <span className={cn(
        "transition-colors duration-150",
        active ? "text-brand-orange" : "text-slate-400 group-hover:text-slate-500"
      )}>
        {icon}
      </span>
      {label}
      {/* Active indicator */}
      <span className={cn(
        "absolute bottom-0 left-2 right-2 h-[2.5px] rounded-full transition-all duration-150",
        active ? "bg-brand-orange scale-x-100" : "bg-transparent scale-x-0 group-hover:bg-slate-300 group-hover:scale-x-100"
      )} />
    </button>
  );
}
