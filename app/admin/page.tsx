import React, { Suspense } from 'react';
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AdminPage() {
    return (
        <ProtectedRoute role="admin">
            <Suspense fallback={
                <div className="h-screen flex items-center justify-center text-sm text-gray-400">
                    Loading Dashboard...
                </div>
            }>
                <AdminDashboard />
            </Suspense>
        </ProtectedRoute>
    );
}
