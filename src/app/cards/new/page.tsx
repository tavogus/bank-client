'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cardApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function NewCardPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [newCardName, setNewCardName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateCard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCardName.trim()) return;

        setIsCreating(true);
        try {
            await cardApi.createCard({ cardHolderName: newCardName });
            toast.success('Card created successfully');
            router.push('/cards');
        } catch (error) {
            toast.error('Failed to create card');
        } finally {
            setIsCreating(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Please log in to create a card</h2>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Card</h2>
                
                <form onSubmit={handleCreateCard} className="space-y-4">
                    <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                            Cardholder Name
                        </label>
                        <input
                            type="text"
                            id="cardName"
                            value={newCardName}
                            onChange={(e) => setNewCardName(e.target.value)}
                            placeholder="Enter cardholder name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => router.push('/cards')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isCreating ? 'Creating...' : 'Create Card'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 