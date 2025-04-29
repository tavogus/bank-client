import axios from 'axios';
import { 
    AccountCredentialsDTO, 
    AccountDTO, 
    AccountOperationDTO, 
    CardCreationDTO, 
    CardDTO, 
    CardPurchaseDTO, 
    InvoiceDTO, 
    PageResponse,
    TokenDTO, 
    TransactionRequestDTO, 
    TransactionResponseDTO, 
    UserDTO, 
    UserRegistrationDTO 
} from '@/types/bank';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    // Skip token for auth routes
    if (config.url?.includes('/api/auth')) {
        return config;
    }

    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    register: (data: UserRegistrationDTO) => 
        api.post<UserDTO>('/api/auth/register', data),
    login: (data: AccountCredentialsDTO) => 
        api.post<TokenDTO>('/api/auth/login', data),
};

export const accountApi = {
    createAccount: () => 
        api.post<AccountDTO>('/api/accounts'),
    deposit: (data: AccountOperationDTO) => 
        api.post<AccountDTO>('/api/accounts/deposit', data),
    withdraw: (data: AccountOperationDTO) => 
        api.post<AccountDTO>('/api/accounts/withdraw', data),
    getAccountByUserId: () => 
        api.get<AccountDTO>('/api/accounts/user'),
};

export const cardApi = {
    createCard: (data: CardCreationDTO) => 
        api.post<CardDTO>('/api/cards', data),
    getCardsByUserId: () => 
        api.get<CardDTO[]>('/api/cards/user'),
    getCardById: (id: number) => 
        api.get<CardDTO>(`/api/cards/${id}`),
    purchase: (data: CardPurchaseDTO) => 
        api.post<TransactionResponseDTO>('/api/cards/purchase', data),
};

export const transactionApi = {
    transfer: (data: TransactionRequestDTO) => 
        api.post<TransactionResponseDTO>('/api/transactions/transfer', data),
    getUserTransactions: (page: number = 0, size: number = 10) => 
        api.get<PageResponse<TransactionResponseDTO>>(`/api/transactions/user?page=${page}&size=${size}`),
};

export const invoiceApi = {
    getCardInvoices: (cardId: number) => 
        api.get<InvoiceDTO[]>(`/api/invoices/card/${cardId}`),
    payInvoice: (invoiceId: number) => 
        api.post(`/api/invoices/${invoiceId}/pay`),
    closeInvoice: (invoiceId: number) => 
        api.post(`/api/invoices/${invoiceId}/close`),
}; 