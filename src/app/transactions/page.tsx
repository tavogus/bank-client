'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { transactionApi } from '@/lib/api';
import { TransactionResponseDTO } from '@/types/bank';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function TransactionsPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState<TransactionResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchTransactions = async () => {
            try {
                const response = await transactionApi.getUserTransactions();
                setTransactions(response.data);
            } catch (error) {
                toast.error('Failed to load transactions');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Please log in to view transactions</h2>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={() => router.push('/transactions/new')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    New Transfer
                </button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Transaction History</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    From/To
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(transaction.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {transaction.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {transaction.type === 'TRANSFER'
                                            ? `${transaction.sourceAccountNumber} → ${transaction.destinationAccountNumber}`
                                            : transaction.sourceAccountNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        R$ {transaction.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                transaction.status === 'COMPLETED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : transaction.status === 'PENDING'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {transaction.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 