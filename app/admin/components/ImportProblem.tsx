"use client";

import React, { useState } from 'react';

const ImportProblem = () => {
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0, currentName: '' });
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

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

        const response = await fetch('/api/leetcode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { titleSlug: targetSlug } }),
        });

        if (!response.ok) throw new Error('Proxy lỗi hoặc mạng không ổn định');
        
        const json = await response.json();
        if (!json || !json.data || !json.data.question) {
            console.error('Invalid detail response:', json);
            return null;
        }

        return json.data.question;
    };


    const sendToBackend = async (detail: any, targetSlug: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(detail.content, 'text/html');
        
        // Bóc tách Test Cases để lưu vào bảng TestCase riêng
        const extractedTestCases: any[] = [];
        const preTags = doc.querySelectorAll('pre');
        
        preTags.forEach((pre, index) => {
            const text = pre.textContent || '';
            if (text.includes('Input:')) {
                const inputRaw = text.split('Input:')[1]?.split('Output:')[0]?.trim() || '';
                const output = text.split('Output:')[1]?.split('Explanation:')[0]?.trim() || '';
                
                // Làm sạch input (bỏ tên biến) để máy chấm dễ dùng
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
            description: detail.content, // Gửi HTML thô, BE sẽ tự xử lý thành JSON
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



        const result = await fetch('http://localhost:5000/api/problems/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formattedData),
        });

        return await result.json();
    };


    const handleImportSingle = async () => {
        if (!slug) return;
        setLoading(true);
        setStatus({ type: 'info', message: `Đang import: ${slug}...` });

        try {
            const detail = await fetchProblemDetail(slug.trim());
            if (!detail) throw new Error('Không tìm thấy bài tập');
            await sendToBackend(detail, slug.trim());
            setStatus({ type: 'success', message: 'Import thành công!' });
            setSlug('');
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleCrawlAll = async () => {
        setLoading(true);
        setStatus({ type: 'info', message: 'Đang lấy danh sách bài tập từ LeetCode...' });
        
        try {
            // 1. Lấy danh sách 50 bài đầu tiên
            const listQuery = `
            query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
              problemsetQuestionList: questionList(
                categorySlug: $categorySlug
                limit: $limit
                skip: $skip
                filters: $filters
              ) {
                data { titleSlug isPaidOnly }
              }
            }`;

            const response = await fetch('/api/leetcode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    query: listQuery, 
                    variables: { 
                        categorySlug: "", // Mặc định là thuật toán
                        limit: 5, 
                        skip: 0,
                        filters: {} 
                    } 
                }),
            });


            const json = await response.json();
            
            // Kiểm tra từng cấp độ dữ liệu
            const questions = json?.data?.problemsetQuestionList?.data;
            
            if (!questions) {
                console.error('Cấu trúc JSON không đúng:', json);
                throw new Error(json?.error || json?.errors?.[0]?.message || 'Không thể lấy danh sách bài tập (Dữ liệu trống)');
            }

            const freeQuestions = questions.filter((q: any) => !q.isPaidOnly);


            
            setProgress({ current: 0, total: freeQuestions.length, currentName: '' });

            // 2. Lặp qua từng bài để cào chi tiết
            for (let i = 0; i < freeQuestions.length; i++) {
                const q = freeQuestions[i];
                setProgress(prev => ({ ...prev, current: i + 1, currentName: q.titleSlug }));
                
                try {
                    const detail = await fetchProblemDetail(q.titleSlug);
                    if (detail && detail.content) {
                        await sendToBackend(detail, q.titleSlug);
                    }
                    // Nghỉ 1s giữa mỗi bài để tránh bị ban
                    await sleep(1000);
                } catch (e) {
                    console.error(`Lỗi khi cào bài ${q.titleSlug}:`, e);
                }
            }

            setStatus({ type: 'success', message: `Đã cào xong ${freeQuestions.length} bài tập!` });
        } catch (err: any) {
            setStatus({ type: 'error', message: 'Lỗi cào dữ liệu: ' + err.message });
        } finally {
            setLoading(false);
            setProgress({ current: 0, total: 0, currentName: '' });
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-2xl w-full">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center gap-3">
                <span className="bg-blue-600 text-white p-2 rounded-lg">🚀</span> 
                LeetCode Data Manager
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Single Import */}
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <h3 className="font-bold text-blue-800 mb-2">Import Single</h3>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="e.g. two-sum"
                        className="w-full px-4 py-2 mb-3 border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={handleImportSingle}
                        disabled={loading || !slug}
                        className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300"
                    >
                        Import Slug
                    </button>
                </div>

                {/* Crawl All */}
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-purple-800 mb-1">Crawl Everything</h3>
                        <p className="text-xs text-purple-600 mb-4">Tự động lấy danh sách và cào bài tập miễn phí.</p>
                    </div>
                    <button
                        onClick={handleCrawlAll}
                        disabled={loading}
                        className="w-full py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:bg-gray-300"
                    >
                        {loading && progress.total > 0 ? 'Crawling...' : 'Start Crawl All'}
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            {progress.total > 0 && (
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-600">Đang cào: <span className="text-purple-600 font-bold">{progress.currentName}</span></span>
                        <span className="text-gray-500">{progress.current} / {progress.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                            className="bg-purple-600 h-full transition-all duration-300 shadow-[0_0_10px_rgba(147,51,234,0.5)]" 
                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {status && (
                <div className={`p-4 rounded-2xl text-sm font-medium mb-4 ${
                    status.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
                    status.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' :
                    'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                    {status.message}
                </div>
            )}

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-700">
                <p className="font-bold mb-1">⚠️ Lưu ý quan trọng:</p>
                <ul className="list-disc ml-4 space-y-1">
                    <li>Bạn phải cài Extension **Allow CORS** trên trình duyệt để FE có thể gọi API LeetCode.</li>
                    <li>Quá trình này cào 50 bài tập miễn phí mới nhất. Bạn có thể thay đổi số lượng trong code.</li>
                    <li>Giữ trình duyệt luôn mở trong khi đang cào.</li>
                </ul>
            </div>
        </div>
    );
};

export default ImportProblem;

