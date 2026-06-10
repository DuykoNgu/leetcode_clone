import type { AuthUser } from "@/lib/types";

export function ContributionGraph({ user }: { user: AuthUser }) {
  // Map submissions to a date-based object
  const submissionMap: Record<string, number> = {};
  user.submissions?.forEach(sub => {
    const date = new Date(sub.submittedAt).toISOString().split('T')[0];
    submissionMap[date] = (submissionMap[date] || 0) + 1;
  });

  const weeks = 52;
  const daysPerWeek = 7;
  const totalDays = weeks * daysPerWeek;
  
  // Calculate days for the past year
  const submissionData = Array.from({ length: totalDays }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (totalDays - 1 - i));
    const dateStr = date.toISOString().split('T')[0];
    const count = submissionMap[dateStr] || 0;
    
    // Level 0-3 based on count
    if (count === 0) return 0;
    if (count < 3) return 1;
    if (count < 6) return 2;
    return 3;
  });

  const getColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-100';
      case 1: return 'bg-green-100';
      case 2: return 'bg-green-300';
      case 3: return 'bg-green-500';
      default: return 'bg-gray-100';
    }
  };

  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <h3 className="text-sm font-medium text-gray-700">
          <span className="font-bold">{user.submissions?.length ?? 0}</span> submissions in the past one year
        </h3>
        <div className="flex gap-4 text-[10px] text-gray-400 uppercase tracking-wider">
          <div className="flex items-center gap-1">
            Total active days: <span className="text-gray-900 font-bold">{Object.keys(submissionMap).length}</span>
          </div>
          <div className="flex items-center gap-1">
            Max streak: <span className="text-gray-900 font-bold">{user.streakDays ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            Current: <span className="text-gray-900 font-bold">{user.streakDays ?? 0}</span>
          </div>
        </div>
      </div>
      <div className="relative">
        <div 
          className="grid grid-flow-col gap-1 overflow-x-auto pb-2" 
          style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${daysPerWeek}, minmax(0, 1fr))` }}
        >
          {submissionData.map((level, i) => (
            <div
              key={i}
              className={`h-2.5 w-2.5 rounded-sm ${getColor(level)}`}
              title={`${level} submissions`}
            />
          ))}
        </div>
        
        <div className="mt-2 flex justify-between px-1 text-[10px] text-gray-500">
          {months.map((month, i) => (
            <span key={i}>{month}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
