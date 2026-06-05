"use client";

export function ProblemsContent({
  problems,
}: {
  problems: { id: string; title: string; difficulty: number; isActive: boolean }[];
}) {
  return (
    <div className="border rounded-xl border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
          <tr>
            <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Title</th>
            <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Difficulty</th>
            <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {problems.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{p.title}</td>
              <td className="px-6 py-4">
                <span
                  className={`text-xs font-medium ${
                    p.difficulty === 0
                      ? "text-green-600 dark:text-green-400"
                      : p.difficulty === 1
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {p.difficulty === 0 ? "Easy" : p.difficulty === 1 ? "Medium" : "Hard"}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 inline-block rounded-full ${
                      p.isActive ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    {p.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
