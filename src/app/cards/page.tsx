'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cardApi } from '@/lib/api';
import { CardDTO } from '@/types/bank';
import toast from 'react-hot-toast';

export default function CardsPage() {
    const { isAuthenticated } = useAuth();
    const [cards, setCards] = useState<CardDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newCardName, setNewCardName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchCards = async () => {
            try {
                const response = await cardApi.getCardsByUserId();
                setCards(response.data);
            } catch (error) {
                toast.error('Failed to load cards');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCards();
    }, [isAuthenticated]);

    const handleCreateCard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCardName.trim()) return;

        setIsCreating(true);
        try {
            const response = await cardApi.createCard({ cardHolderName: newCardName });
            setCards((prev) => [...prev, response.data]);
            setNewCardName('');
            toast.success('Card created successfully');
        } catch (error) {
            toast.error('Failed to create card');
        } finally {
            setIsCreating(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Please log in to view your cards</h2>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cards</h2>
                
                <form onSubmit={handleCreateCard} className="mb-6">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newCardName}
                            onChange={(e) => setNewCardName(e.target.value)}
                            placeholder="Enter cardholder name"
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isCreating ? 'Creating...' : 'Create New Card'}
                        </button>
                    </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white shadow-lg"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">{card.cardHolderName}</h3>
                                    <p className="text-sm opacity-75">Card Number</p>
                                    <p className="text-xl tracking-wider">{card.cardNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm opacity-75">Expires</p>
                                    <p className="text-sm">
                                        {new Date(card.expirationDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm opacity-75">Created</p>
                                <p className="text-sm">
                                    {new Date(card.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 