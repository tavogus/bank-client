'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { isAuthenticated, logout } = useAuth();
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/" className="text-xl font-bold text-indigo-600">
                                    Digital Bank
                                </Link>
                            </div>
                            {isAuthenticated && (
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    <Link
                                        href="/dashboard"
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                            isActive('/dashboard')
                                                ? 'border-indigo-500 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/cards"
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                            isActive('/cards')
                                                ? 'border-indigo-500 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                    >
                                        Cards
                                    </Link>
                                    <Link
                                        href="/transactions"
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                            isActive('/transactions')
                                                ? 'border-indigo-500 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                    >
                                        Transactions
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center">
                            {isAuthenticated ? (
                                <button
                                    onClick={logout}
                                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Logout
                                </button>
                            ) : (
                                <div className="flex space-x-4">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
} 