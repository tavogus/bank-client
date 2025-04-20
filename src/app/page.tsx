'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full space-y-8 text-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Welcome to Digital Bank
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                        A modern banking experience with secure transactions, easy transfers, and digital cards.
                    </p>
                </div>
                <div className="flex justify-center space-x-4">
                    <Link
                        href="/login"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/register"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                    >
                        Create account
                    </Link>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900">Secure Transactions</h3>
                        <p className="mt-2 text-base text-gray-500">
                            Your money is safe with our advanced security measures.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900">Digital Cards</h3>
                        <p className="mt-2 text-base text-gray-500">
                            Create and manage your digital cards with ease.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900">Instant Transfers</h3>
                        <p className="mt-2 text-base text-gray-500">
                            Send money to anyone, anywhere, instantly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
