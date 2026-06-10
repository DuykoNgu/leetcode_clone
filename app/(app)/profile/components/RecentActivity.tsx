import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Bookmark, Code2, MessageSquare, Loader2 } from 'lucide-react';
import type { AuthUser } from "@/lib/types";
import { getSavedProblems, getUserSubmissions, getUserDiscussions } from "@/lib/api/auth";
import { SubmissionModal } from './SubmissionModal';

interface RecentActivityProps {
  user: AuthUser;
}

type TabData = {
  key: string;
  label: string;
  icon: typeof CheckCircle2;
};

const TABS: TabData[] = [
  { key: 'recent-ac', label: 'Recent AC', icon: CheckCircle2 },
  { key: 'list',       label: 'List',       icon: Bookmark },
  { key: 'solutions',  label: 'Solutions',  icon: Code2 },
  { key: 'discuss',    label: 'Discuss',    icon: MessageSquare },
];

export function RecentActivity({ user }: RecentActivityProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('recent-ac');
  const [data, setData] = useState<{ total: number; items: any[] }>({ total: 0, items: [] });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const pageSize = 20;

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

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      accepted: 'Accepted',
      wrong_answer: 'Wrong Answer',
      time_limit_exceeded: 'TLE',
      memory_limit_exceeded: 'MLE',
      runtime_error: 'Runtime Error',
      compile_error: 'Compile Error',
      pending: 'Pending',
    };
    return map[status] || status;
  };

  const statusColor = (status: string) => {
    if (status === 'accepted') return 'text-green-600';
    return 'text-red-500';
  };

  const fetchData = useCallback(async (tab: string, p: number) => {
    setLoading(true);
    try {
      let result: any;
      if (tab === 'list') {
        result = await getSavedProblems(p, pageSize);
      } else if (tab === 'solutions') {
        result = await getUserSubmissions(p, pageSize);
      } else if (tab === 'discuss') {
        result = await getUserDiscussions(p, pageSize);
      } else {
        setData({ total: 0, items: [] });
        setLoading(false);
        return;
      }
      setData({
        total: result.total ?? 0,
        items: result.data ?? [],
      });
    } catch {
      setData({ total: 0, items: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'recent-ac') {
      setPage(1);
      fetchData(activeTab, 1);
    } else {
      setData({ total: 0, items: [] });
    }
  }, [activeTab, fetchData]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setPage(1);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(activeTab, nextPage);
  };

  const totalPages = Math.ceil(data.total / pageSize);

  const renderItem = (item: any, i: number) => {
    if (activeTab === 'list') {
      const prob = item.problem;
      if (!prob) return null;
      const diffLabel = ['Easy', 'Medium', 'Hard'][prob.difficulty] || 'Medium';
      const diffColor = ['text-cyan-400', 'text-orange-400', 'text-red-400'][prob.difficulty] || 'text-orange-400';
      return (
        <button
          key={i}
          type="button"
          onClick={() => router.push(`/problems/${prob.slug}`)}
          className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-full bg-amber-50 p-1.5 shrink-0">
              <Bookmark className="h-4 w-4 text-amber-600" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-medium text-gray-900 hover:text-orange-600 truncate">
                {prob.title}
              </h4>
              <span className={`text-[10px] uppercase font-medium ${diffColor}`}>{diffLabel}</span>
            </div>
          </div>
        </button>
      );
    }
    if (activeTab === 'solutions') {
      return (
        <button
          key={i}
          type="button"
          onClick={() => setSelectedSubmissionId(item.id)}
          className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-full bg-blue-50 p-1.5 shrink-0">
              <Code2 className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-medium text-gray-900 hover:text-orange-600 truncate">
                {item.problem?.title ?? 'Unknown Problem'}
              </h4>
              <span className={`text-[10px] font-medium uppercase ${statusColor(item.status)}`}>
                {statusLabel(item.status)}
              </span>
            </div>
          </div>
          <span className="text-xs text-gray-500 shrink-0 ml-3">{formatDate(item.submittedAt)}</span>
        </button>
      );
    }
    if (activeTab === 'discuss') {
      return (
        <button
          key={i}
          type="button"
          onClick={() => router.push(`/discuss/${item.id}`)}
          className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-full bg-purple-50 p-1.5 shrink-0">
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-medium text-gray-900 hover:text-orange-600 truncate">
                {item.title}
              </h4>
              <p className="text-[10px] text-gray-400">
                {item.problem?.title ?? 'General discussion'} · {item._count?.comments ?? 0} comments
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-500 shrink-0 ml-3">{formatDate(item.createdAt)}</span>
        </button>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex border-b border-gray-200 bg-gray-50/50 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              type="button"
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-b-2 border-orange-500 text-gray-900 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-2">
        {activeTab === 'recent-ac' && (
          <div className="space-y-1">
            {user.recentAC && user.recentAC.length > 0 ? (
              user.recentAC.map((activity, i) => (
                <button 
                  key={i} 
                  type="button"
                  onClick={() => router.push(`/problems/${activity.problem.slug}`)}
                  className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="rounded-full bg-green-50 p-1.5 shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 hover:text-orange-600 truncate">
                        {activity.problem?.title ?? 'Unknown Problem'}
                      </h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Accepted</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0 ml-3">{formatDate(activity.submittedAt)}</span>
                </button>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        )}
        {activeTab !== 'recent-ac' && (
          <div className="space-y-1">
            {loading && data.items.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : data.items.length > 0 ? (
              <>
                {data.items.map((item, i) => renderItem(item, i))}
                {data.total > data.items.length && page < totalPages && (
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={loading}
                    className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {loading ? 'Loading...' : `Xem thêm (${data.items.length}/${data.total})`}
                  </button>
                )}
              </>
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-500">Không có dữ liệu</p>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedSubmissionId && (
        <SubmissionModal
          submissionId={selectedSubmissionId}
          onClose={() => setSelectedSubmissionId(null)}
        />
      )}
    </div>
  );
}
