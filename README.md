# Digital Bank - Next.js Client

A modern banking application built with Next.js, TypeScript, and Tailwind CSS. This client application consumes a banking API to provide users with a seamless digital banking experience.

## Features

- User authentication (login/register)
- Account management
- Digital card creation and management
- Money transfers between accounts
- Transaction history
- Modern and responsive UI
- Secure API integration

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Access to the banking API

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd bank-client
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your API URL:
```env
NEXT_PUBLIC_API_URL=http://your-api-url
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── cards/            # Cards management page
│   ├── transactions/     # Transactions page
│   ├── login/           # Login page
│   ├── register/        # Registration page
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/           # Reusable components
├── contexts/            # React contexts
├── lib/                 # Utility functions and API client
├── types/               # TypeScript type definitions
└── middleware.ts        # Route protection middleware
```

## API Integration

The application integrates with a banking API that provides the following endpoints:

- Authentication
  - POST /api/auth/register
  - POST /api/auth/login
- Accounts
  - POST /api/accounts
  - POST /api/accounts/deposit
  - POST /api/accounts/withdraw
  - GET /api/accounts/user
- Cards
  - POST /api/cards
  - GET /api/cards/user
  - GET /api/cards/{id}
  - POST /api/cards/purchase
- Transactions
  - POST /api/transactions/transfer
  - GET /api/transactions/user
- Invoices
  - GET /api/invoices/card/{cardId}
  - POST /api/invoices/{invoiceId}/pay
  - POST /api/invoices/{invoiceId}/close

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- React Query
- Axios
- React Hook Form
- Zod
- React Hot Toast

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
