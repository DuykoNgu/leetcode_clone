import type { AuthUser } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  CheckCircle, 
  MessageSquare, 
  Star,
} from "lucide-react";

interface ProfileInfoProps {
  user: AuthUser;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  const communityStats = [
    { label: "Views", value: 0, lastWeek: 0, icon: Eye, color: "text-blue-400" },
    { label: "Solution", value: 0, lastWeek: 0, icon: CheckCircle, color: "text-cyan-400" },
    { label: "Discuss", value: 0, lastWeek: 0, icon: MessageSquare, color: "text-emerald-400" },
    { label: "Reputation", value: 0, lastWeek: 0, icon: Star, color: "text-orange-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Basic Info Section */}
      <div className="p-2">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-400">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="mt-4 flex justify-center sm:justify-start gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-900">0</span> Following
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-900">0</span> Followers
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Button className="w-full bg-green-50 text-sm text-green-600 hover:bg-green-100 border border-green-200 shadow-none">
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      {/* Community Stats Section */}
      <div className="p-2">
        <h3 className="mb-4 text-sm font-bold text-gray-900">Community Stats</h3>
        <div className="space-y-4">
          {communityStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <stat.icon className={`h-4 w-4 ${stat.color.replace('text-', 'text-opacity-80 text-')}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{stat.label}</span>
                  <span className="text-sm font-bold text-gray-900">{stat.value}</span>
                </div>
                <div className="text-[10px] text-gray-400">
                  Last week {stat.lastWeek}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
