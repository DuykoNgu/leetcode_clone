"use client";

import React, { useState } from 'react';
import { Rocket, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from "@/lib/api/client";

const ImportProblem = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0, currentName: '' });

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchProblemDetail = async (targetSlug: string) => {
        const query = `
        query questionContent($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId title content difficulty
            topicTags { name slug }
            codeSnippets { lang code }
          }
        }`;

        try {
            const response = await fetch('/api/leetcode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, variables: { titleSlug: targetSlug } }),
            });
            if (!response.ok) throw new Error('Network error');
            const json = await response.json();
            return json?.data?.question || null;
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    };

    const sendToBackend = async (detail: any, targetSlug: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(detail.content, 'text/html');
        const extractedTestCases: any[] = [];
        const preTags = doc.querySelectorAll('pre');
        
        preTags.forEach((pre, index) => {
            const text = pre.textContent || '';
            if (text.includes('Input:')) {
                const inputRaw = text.split('Input:')[1]?.split('Output:')[0]?.trim() || '';
                const output = text.split('Output:')[1]?.split('Explanation:')[0]?.trim() || '';
                const inputClean = inputRaw.replace(/[a-zA-Z_]+\s*=\s*/g, '').trim();
                extractedTestCases.push({
                    input: inputClean,
                    expectedOutput: output,
                    orderIndex: index,
                    isHidden: false
                });
            }
        });

        const diffMap: Record<string, number> = { "Easy": 0, "Medium": 1, "Hard": 2 };
        const langMap: Record<string, string> = {
            'javascript': 'javascript', 'cpp': 'cpp', 'java': 'java',
            'python3': 'python', 'typescript': 'typescript', 'golang': 'go', 'rust': 'rust'
        };

        const formattedData = {
            title: detail.title,
            slug: targetSlug,
            description: detail.content,
            difficulty: diffMap[detail.difficulty] ?? 1,
            testCases: extractedTestCases,
            problemTags: detail.topicTags.map((tag: any) => ({ tag: { name: tag.name, slug: tag.slug } })),
            codeTemplates: detail.codeSnippets
                .filter((s: any) => langMap[s.lang.toLowerCase()])
                .map((s: any) => ({
                    language: langMap[s.lang.toLowerCase()],
                    starterCode: s.code
                }))
        };

        await apiClient.post('/problems/import', formattedData);
    };

    const handleCrawlAll = async () => {
        setLoading(true);
        toast.info('Đang cào dữ liệu LeetCode...');
        
        try {
            const listQuery = `
            query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
              problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
                data { titleSlug isPaidOnly }
              }
            }`;

            const response = await fetch('/api/leetcode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    query: listQuery, 
                    variables: { categorySlug: "", limit: 5, skip: 0, filters: {} } 
                }),
            });

            const json = await response.json();
            const questions = json?.data?.problemsetQuestionList?.data;
            if (!questions) throw new Error('Không thể lấy danh sách bài tập');

            const freeQuestions = questions.filter((q: any) => !q.isPaidOnly);
            setProgress({ current: 0, total: freeQuestions.length, currentName: '' });

            for (let i = 0; i < freeQuestions.length; i++) {
                const q = freeQuestions[i];
                setProgress(prev => ({ ...prev, current: i + 1, currentName: q.titleSlug }));
                
                try {
                    const detail = await fetchProblemDetail(q.titleSlug);
                    if (detail?.content) {
                        await sendToBackend(detail, q.titleSlug);
                    }
                    await sleep(1000);
                } catch (e) {
                    console.error(`Lỗi khi cào ${q.titleSlug}:`, e);
                }
            }

            toast.success(`Đã cào xong ${freeQuestions.length} bài tập!`);
        } catch (err: any) {
            toast.error('Lỗi: ' + err.message);
        } finally {
            setLoading(false);
            setProgress({ current: 0, total: 0, currentName: '' });
        }
    };

    return (
        <div className="flex flex-col gap-2 items-start">
            <button
                onClick={handleCrawlAll}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30"
            >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Rocket size={18} />}
                {loading ? `Đang cào (${progress.current}/${progress.total})...` : 'Crawl Top 5 LeetCode'}
            </button>
            
            {loading && progress.total > 0 && (
                <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium animate-pulse ml-1">
                    Đang xử lý: <span className="text-blue-600 dark:text-blue-400">{progress.currentName}</span>
                </div>
            )}
        </div>
    );
};

export default ImportProblem;



