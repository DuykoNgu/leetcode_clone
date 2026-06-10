"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Cpu, HardDrive, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { getSubmissionDetail } from '@/lib/api/auth';

interface SubmissionModalProps {
  submissionId: string;
  onClose: () => void;
}

export function SubmissionModal({ submissionId, onClose }: SubmissionModalProps) {
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubmissionDetail(submissionId)
      .then((res) => setSub(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [submissionId]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const statusColor = (s: string) => {
    if (s === 'accepted') return 'text-green-600 bg-green-50 border-green-200';
    if (s === 'wrong_answer' || s === 'runtime_error' || s === 'compile_error') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  const statusIcon = (s: string) => {
    if (s === 'accepted') return <CheckCircle2 className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      accepted: 'Accepted',
      wrong_answer: 'Wrong Answer',
      time_limit_exceeded: 'Time Limit Exceeded',
      memory_limit_exceeded: 'Memory Limit Exceeded',
      runtime_error: 'Runtime Error',
      compile_error: 'Compile Error',
      pending: 'Pending',
    };
    return map[s] || s;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-2xl rounded-lg border border-gray-200 bg-white shadow-2xl flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">Submission Detail</h2>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub.problem?.title}</p>}
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : !sub ? (
          <div className="py-10 text-center text-sm text-gray-500">Không tìm thấy submission</div>
        ) : (
          <div className="overflow-y-auto p-5 space-y-4">
            {/* Status + Meta */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusColor(sub.status)}`}>
                {statusIcon(sub.status)}
                {statusLabel(sub.status)}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                {new Date(sub.submittedAt).toLocaleString('vi-VN')}
              </span>
              <span className="text-xs uppercase font-mono text-gray-400">{sub.language}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 text-center">
                <Cpu className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                <div className="text-xs text-gray-500">Runtime</div>
                <div className="text-sm font-bold text-gray-900">{sub.runtimeMs ?? '—'} ms</div>
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 text-center">
                <HardDrive className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                <div className="text-xs text-gray-500">Memory</div>
                <div className="text-sm font-bold text-gray-900">{sub.memoryKb ? `${(sub.memoryKb / 1024).toFixed(1)} MB` : '—'}</div>
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 text-center">
                <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                <div className="text-xs text-gray-500">Testcases</div>
                <div className="text-sm font-bold text-gray-900">{sub.passedCases}/{sub.totalCases}</div>
              </div>
            </div>

            {/* Error message */}
            {sub.errorMessage && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <div className="text-xs font-bold text-red-700 mb-1">Error:</div>
                <pre className="text-xs text-red-600 whitespace-pre-wrap font-mono leading-relaxed">{sub.errorMessage}</pre>
              </div>
            )}

            {/* Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Code</span>
                <span className="text-[10px] font-mono text-gray-400">{sub.language}</span>
              </div>
              <pre className="rounded-lg bg-gray-900 p-4 text-xs text-gray-100 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed max-h-72">{sub.code}</pre>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
