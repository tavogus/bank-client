'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { transactionApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function NewTransferPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [isTransferring, setIsTransferring] = useState(false);
    const [transferData, setTransferData] = useState({
        destinationAccountNumber: '',
        amount: '',
        description: '',
    });

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsTransferring(true);

        try {
            await transactionApi.transfer({
                destinationAccountNumber: transferData.destinationAccountNumber,
                amount: parseFloat(transferData.amount),
                description: transferData.description,
            });

            toast.success('Transfer completed successfully');
            router.push('/transactions');
        } catch (error) {
            toast.error('Transfer failed. Please check the details and try again.');
        } finally {
            setIsTransferring(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Please log in to make transfers</h2>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto">
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
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => router.push('/transactions')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isTransferring}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isTransferring ? 'Processing...' : 'Transfer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 