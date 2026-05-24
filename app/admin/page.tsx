import React, { Suspense } from 'react';
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AdminPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center text-sm text-gray-400">
                Loading Dashboard...
            </div>
        }>
            <ProtectedRoute role="admin">
                <AdminDashboard />
            </ProtectedRoute>
        </Suspense>
    );
}
