export type AccountCredentialsDTO = {
    username: string;
    password: string;
};

export type TokenDTO = {
    username: string;
    authenticated: boolean;
    created: string;
    expiration: string;
    accessToken: string;
    refreshToken: string;
};

export type AccountDTO = {
    id: number;
    accountNumber: string;
    balance: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
};

export type AccountOperationDTO = {
    amount: number;
};

export type CardCreationDTO = {
    cardHolderName: string;
};

export type CardDTO = {
    id: number;
    cardNumber: string;
    cardHolderName: string;
    expirationDate: string;
    cvv: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
};

export type CardPurchaseDTO = {
    cardId: number;
    amount: number;
    description: string;
    paymentType: 'CREDIT' | 'DEBIT' | 'TRANSFER';
};

export type InvoiceDTO = {
    id: number;
    cardId: number;
    dueDate: string;
    closingDate: string;
    totalAmount: number;
    status: 'OPEN' | 'CLOSED' | 'PAID';
    transactions: TransactionResponseDTO[];
};

export type TransactionRequestDTO = {
    destinationAccountNumber: string;
    amount: number;
    description?: string;
};

export type TransactionResponseDTO = {
    id: number;
    sourceAccountNumber: string;
    destinationAccountNumber: string;
    amount: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    type: 'TRANSFER' | 'DEPOSIT' | 'WITHDRAW' | 'CREDIT_CARD';
    paymentType: 'CREDIT' | 'DEBIT' | 'TRANSFER';
    description?: string;
    createdAt: string;
};

export type UserDTO = {
    id: number;
    email: string;
    fullName: string;
    cpf: string;
};

export type UserRegistrationDTO = {
    email: string;
    password: string;
    fullName: string;
    cpf: string;
};

export type PageResponse<T> = {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}; 