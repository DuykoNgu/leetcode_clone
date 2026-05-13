import type { AuthUser } from "@/lib/types";

export function ProfileStats({ user }: { user: AuthUser }) {
  const stats = [
    { 
      label: "Easy", 
      solved: user.difficultyStats?.Easy.solved ?? 0, 
      total: user.difficultyStats?.Easy.total ?? 0, 
      color: "text-cyan-400" 
    },
    { 
      label: "Med.", 
      solved: user.difficultyStats?.Medium.solved ?? 0, 
      total: user.difficultyStats?.Medium.total ?? 0, 
      color: "text-orange-400" 
    },
    { 
      label: "Hard", 
      solved: user.difficultyStats?.Hard.solved ?? 0, 
      total: user.difficultyStats?.Hard.total ?? 0, 
      color: "text-red-400" 
    },
  ];

  const totalSolved = stats.reduce((acc, stat) => acc + stat.solved, 0);
  const totalQuestions = stats.reduce((acc, stat) => acc + stat.total, 0);
  const percentage = totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0;

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Solved Problems Card */}
      <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        {/* Circular Progress */}
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
          <svg className="h-full w-full -rotate-90 transform">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-gray-100"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={364}
              strokeDashoffset={364 - (364 * percentage) / 100}
              strokeLinecap="round"
              className="text-orange-500 transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{totalSolved}</span>
            <span className="text-[10px] text-gray-400">Solved</span>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="flex flex-1 flex-col gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <div className="flex items-center justify-between text-xs">
                <span className={stat.color}>{stat.label}</span>
                <span className="text-gray-500">
                  <span className="font-bold text-gray-900">{stat.solved}</span>/{stat.total}
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${stat.color.replace('text-', 'bg-')}`}
                  style={{ width: `${(stat.solved / stat.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
