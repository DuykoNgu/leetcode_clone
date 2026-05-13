"use client";

import ImportProblem from "./components/ImportProblem";

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 px-4">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-lg text-gray-600 mb-12">Quản lý và cập nhật dữ liệu hệ thống.</p>
            
            <ImportProblem />
        </div>
    );
}

