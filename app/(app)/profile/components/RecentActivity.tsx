import { CheckCircle2 } from 'lucide-react';
import type { AuthUser } from "@/lib/types";

export function RecentActivity({ user }: { user: AuthUser }) {
  const tabs = ['Recent AC', 'List', 'Solutions', 'Discuss'];
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex border-b border-gray-200 bg-gray-50/50">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              i === 0 
                ? 'border-b-2 border-orange-500 text-gray-900 bg-white' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-2">
        <div className="space-y-1">
          {user.recentAC && user.recentAC.length > 0 ? (
            user.recentAC.map((activity, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-50 p-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 hover:text-orange-600 cursor-pointer">
                      {activity.problem.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Accepted</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{formatDate(activity.submittedAt)}</span>
              </div>
            ))
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
