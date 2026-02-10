# GymFlow Staff POS Web

Offline-first Staff Point of Sale for GymFlow SaaS built with Next.js, IndexedDB, and WebSockets.

## Features

- **Offline-First Architecture**: Full functionality even without internet connection
- **Product Sales**: Browse products, add to cart, and complete transactions
- **Cart Management**: Add, remove, and update quantities
- **Shift Sessions**: Start/end shifts with cash tracking
- **IndexedDB Storage**: Local data persistence for offline usage
- **Auto-Sync**: Automatic synchronization when connection is restored
- **WebSocket Alerts**: Real-time attendance notifications
- **Responsive Design**: Works on desktop and tablet devices

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Offline Storage**: Dexie.js (IndexedDB wrapper)
- **API Client**: Axios
- **Real-time**: Socket.io-client
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Django REST API backend (running on port 8000)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CloudTechy/gymflow-staff-pos-web.git
cd gymflow-staff-pos-web
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update the `.env.local` file with your API URLs:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=http://localhost:8000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

For testing purposes:
- Username: `staff`
- Password: `demo123`

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Login page
│   ├── pos/               # POS interface
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Cart.tsx           # Shopping cart component
│   ├── NetworkStatus.tsx  # Network status indicator
│   └── ProductCard.tsx    # Product display card
├── lib/                   # Core libraries
│   ├── api.ts             # API client with offline fallback
│   ├── db.ts              # IndexedDB wrapper (Dexie)
│   └── websocket.ts       # WebSocket client
├── store/                 # Zustand state stores
│   ├── authStore.ts       # Authentication state
│   ├── cartStore.ts       # Shopping cart state
│   └── networkStore.ts    # Network status state
├── types/                 # TypeScript type definitions
│   └── index.ts           # Core types
├── hooks/                 # Custom React hooks
│   └── useNetworkStatus.ts # Network monitoring hook
└── utils/                 # Utility functions
    └── syncService.ts     # Data synchronization service
```

## How It Works

### Offline-First Approach

1. **Data Storage**: All products, sales, and shift data are stored in IndexedDB
2. **API Sync**: When online, data syncs with the Django backend
3. **Queue System**: Offline transactions are queued and synced when connection restores
4. **State Persistence**: User authentication and shift state persist across sessions

### Key Workflows

#### Starting a Shift
1. Staff logs in
2. Navigates to dashboard
3. Enters starting cash amount
4. Starts shift (stored locally and synced to backend)

#### Making a Sale
1. Browse/search products
2. Add items to cart
3. Adjust quantities as needed
4. Complete checkout
5. Generate receipt (stored locally)
6. Auto-sync to backend when online

#### Ending a Shift
1. Review shift statistics
2. Enter ending cash count
3. End shift (calculated totals saved)
4. Sync to backend

### WebSocket Features

- Real-time attendance check-in/check-out notifications
- Sync triggers from backend
- Connection status monitoring

## API Integration

The app expects a Django REST API with the following endpoints:

### Authentication
- `POST /api/auth/login` - Staff login
- `POST /api/auth/logout` - Staff logout

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details

### Sales
- `POST /api/sales` - Create a sale
- `GET /api/sales` - List sales (with filters)

### Shifts
- `POST /api/shifts/start` - Start a shift
- `POST /api/shifts/:id/end` - End a shift
- `GET /api/shifts/active/:staffId` - Get active shift

### Health
- `GET /api/health` - API health check

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Testing Offline Mode

1. Open the app in your browser
2. Open DevTools > Network tab
3. Select "Offline" from the throttling dropdown
4. Continue using the app - all functionality should work
5. Go back online - data will auto-sync

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
