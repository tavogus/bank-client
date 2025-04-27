'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cardApi, invoiceApi } from '@/lib/api';
import { CardDTO, InvoiceDTO } from '@/types/bank';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CardsPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [cards, setCards] = useState<CardDTO[]>([]);
    const [invoices, setInvoices] = useState<Record<number, InvoiceDTO[]>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchCards = async () => {
            try {
                const response = await cardApi.getCardsByUserId();
                setCards(response.data);
                
                // Fetch invoices for each card
                const invoicePromises = response.data.map(async (card) => {
                    try {
                        const invoiceResponse = await invoiceApi.getCardInvoices(card.id);
                        return { cardId: card.id, invoices: invoiceResponse.data };
                    } catch (error) {
                        console.error(`Failed to fetch invoices for card ${card.id}`);
                        return { cardId: card.id, invoices: [] };
                    }
                });

                const invoiceResults = await Promise.all(invoicePromises);
                const invoiceMap = invoiceResults.reduce((acc, { cardId, invoices }) => {
                    acc[cardId] = invoices;
                    return acc;
                }, {} as Record<number, InvoiceDTO[]>);

                setInvoices(invoiceMap);
            } catch (error) {
                toast.error('Failed to load cards');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCards();
    }, [isAuthenticated]);

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
            <div className="flex justify-end">
                <button
                    onClick={() => router.push('/cards/new')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    New Card
                </button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Cards</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <div key={card.id} className="col-span-1">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">{card.cardHolderName}</h3>
                                        <p className="text-sm opacity-75">Card Number</p>
                                        <p className="text-xl tracking-wider">{card.cardNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm opacity-75">Expires</p>
                                        <p className="text-sm">
                                            {formatDate(card.expirationDate)}
                                        </p>
                                        <p className="text-sm opacity-75 mt-2">CVV</p>
                                        <p className="text-sm">
                                            {card.cvv}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm opacity-75">Created</p>
                                    <p className="text-sm">
                                        {formatDate(card.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {invoices[card.id] && invoices[card.id].length > 0 && (
                                <div className="mt-4 bg-white rounded-lg shadow p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Invoice</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Amount</p>
                                            <p className="text-lg font-medium text-gray-900">
                                                ${invoices[card.id][0].totalAmount.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Due Date</p>
                                            <p className="text-sm text-gray-900">
                                                {formatDate(invoices[card.id][0].dueDate)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Status</p>
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                invoices[card.id][0].status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                invoices[card.id][0].status === 'CLOSED' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {invoices[card.id][0].status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 