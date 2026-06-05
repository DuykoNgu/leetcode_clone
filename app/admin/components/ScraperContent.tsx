"use client";

import ScraperTool from "./ScraperTool";

export function ScraperContent() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Scraper Tool</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Cào bài tập từ LeetCode theo số lượng và danh mục tùy chọn. Hệ thống chạy nền,
          bạn có thể theo dõi tiến độ real-time bên dưới.
        </p>
      </div>
      <ScraperTool />
    </div>
  );
}
