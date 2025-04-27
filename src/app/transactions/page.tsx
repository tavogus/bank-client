'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { transactionApi } from '@/lib/api';
import { TransactionResponseDTO } from '@/types/bank';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function TransactionsPage() {
    const { isAuthenticated } = useAuth();
    const [transactions, setTransactions] = useState<TransactionResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTransferring, setIsTransferring] = useState(false);
    const [transferData, setTransferData] = useState({
        destinationAccountNumber: '',
        amount: '',
        description: '',
    });

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

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsTransferring(true);

        try {
            await transactionApi.transfer({
                destinationAccountNumber: transferData.destinationAccountNumber,
                amount: parseFloat(transferData.amount),
                description: transferData.description,
            });

            // Refresh transactions
            const response = await transactionApi.getUserTransactions();
            setTransactions(response.data);

            // Reset form
            setTransferData({
                destinationAccountNumber: '',
                amount: '',
                description: '',
            });

            toast.success('Transfer completed successfully');
        } catch (error) {
            toast.error('Transfer failed. Please check the details and try again.');
        } finally {
            setIsTransferring(false);
        }
    };

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
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Make a Transfer</h2>
                <form onSubmit={handleTransfer} className="space-y-4">
                    <div>
                        <label htmlFor="destinationAccount" className="block text-sm font-medium text-gray-700">
                            Destination Account Number
                        </label>
                        <input
                            type="text"
                            id="destinationAccount"
                            value={transferData.destinationAccountNumber}
                            onChange={(e) =>
                                setTransferData((prev) => ({
                                    ...prev,
                                    destinationAccountNumber: e.target.value,
                                }))
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            value={transferData.amount}
                            onChange={(e) =>
                                setTransferData((prev) => ({
                                    ...prev,
                                    amount: e.target.value,
                                }))
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                            min="0.01"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description (Optional)
                        </label>
                        <input
                            type="text"
                            id="description"
                            value={transferData.description}
                            onChange={(e) =>
                                setTransferData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isTransferring}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isTransferring ? 'Processing...' : 'Transfer'}
                    </button>
                </form>
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