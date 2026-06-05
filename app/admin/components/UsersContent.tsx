"use client";

export function UsersContent({
  users,
}: {
  users: { id: string; username: string; email: string; role: string }[];
}) {
  return (
    <div className="border rounded-xl border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
          <tr>
            <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">User</th>
            <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Email</th>
            <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Role</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{u.username}</td>
              <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{u.email}</td>
              <td className="px-6 py-4">
                <span className="text-[10px] uppercase font-bold border border-gray-300 dark:border-gray-600 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">
                  {u.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
