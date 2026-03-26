// src/components/layout/MainLayout.jsx
import { useState } from 'react';
import { Sidebar } from './Sidebar';   
import { Header } from './Header';
import { Outlet } from "react-router-dom";

export function MainLayout({
    children,
    currentPage = 'dashboard',
    onPageChange,
    onLogout,
    userRole = "Admin",
    currentUser = { permissions: ['products', 'orders'] }
}) {
    const [activePage, setActivePage] = useState(currentPage);

    const handlePageChange = (pageId) => {
        setActivePage(pageId);
        if (onPageChange) onPageChange(pageId);
    };

    const handleLogout = () => {
        if (onLogout) onLogout();
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar
                currentPage={activePage}
                onPageChange={handlePageChange}
                onLogout={handleLogout}
                userRole={userRole}
                currentUser={currentUser}
            />

            {/* Main Area */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-20 group/sidebarcd   ">
                {/* Header */}
                <Header
                    onPageChange={handlePageChange}
                    onLogout={handleLogout}
                    className="
                            sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm 
                            transition-all duration-300
                            lg:group-hover/sidebar:ml-64 lg:ml-20
                        "
                />

                {/* Main Content - children (Dashboard etc.) render here */}
                <main className="flex-1 overflow-y-auto bg-gray-50 ">
                    <div className="w-full mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}