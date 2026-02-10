# Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser Layer                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Login     │  │  Dashboard  │  │   POS UI    │             │
│  │   Page      │  │    Page     │  │   Page      │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                      │
│         └────────────────┴────────────────┘                      │
│                          │                                       │
├──────────────────────────┼───────────────────────────────────────┤
│                          ▼                                       │
│  ┌───────────────────────────────────────────────────┐          │
│  │            React Components Layer                 │          │
│  ├───────────────────────────────────────────────────┤          │
│  │  • Cart Component                                 │          │
│  │  • ProductCard Component                          │          │
│  │  • NetworkStatus Component                        │          │
│  └─────────────────────┬─────────────────────────────┘          │
│                        │                                         │
├────────────────────────┼─────────────────────────────────────────┤
│                        ▼                                         │
│  ┌───────────────────────────────────────────────────┐          │
│  │            State Management Layer (Zustand)       │          │
│  ├───────────────────────────────────────────────────┤          │
│  │  • Auth Store (login, session)                    │          │
│  │  • Cart Store (items, totals)                     │          │
│  │  • Network Store (online, sync status)            │          │
│  └─────────┬──────────────────────┬──────────────────┘          │
│            │                      │                              │
├────────────┼──────────────────────┼──────────────────────────────┤
│            ▼                      ▼                              │
│  ┌──────────────────┐   ┌──────────────────────┐               │
│  │  Custom Hooks    │   │   Utility Services   │               │
│  ├──────────────────┤   ├──────────────────────┤               │
│  │ • useNetwork     │   │ • Sync Service       │               │
│  │   Status         │   │ • Receipt Generator  │               │
│  │ • useWebSocket   │   │ • Seed Data          │               │
│  └────────┬─────────┘   └──────────┬───────────┘               │
│           │                        │                             │
├───────────┼────────────────────────┼─────────────────────────────┤
│           ▼                        ▼                             │
│  ┌──────────────────────────────────────────────────┐           │
│  │            Core Libraries Layer                   │           │
│  ├──────────────────────────────────────────────────┤           │
│  │                                                   │           │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────┐ │           │
│  │  │  API Client │  │   Dexie DB   │  │WebSocket│ │           │
│  │  │   (Axios)   │  │  (IndexedDB) │  │ Client  │ │           │
│  │  └──────┬──────┘  └──────┬───────┘  └────┬────┘ │           │
│  │         │                │                │      │           │
│  └─────────┼────────────────┼────────────────┼──────┘           │
│            │                │                │                   │
└────────────┼────────────────┼────────────────┼───────────────────┘
             │                │                │
             ▼                ▼                ▼
    ┌─────────────┐  ┌──────────────┐  ┌──────────┐
    │   Django    │  │   Browser     │  │WebSocket │
    │   REST API  │  │  IndexedDB    │  │  Server  │
    └─────────────┘  └──────────────┘  └──────────┘
```

## Data Flow Diagrams

### Online Mode - Sale Transaction

```
User adds product
        │
        ▼
Cart Store (add item)
        │
        ▼
User clicks checkout
        │
        ▼
Cart Component
        │
        ├─> Create Sale object
        │
        ├─> Save to IndexedDB ─────────┐
        │                              │
        ├─> Add to Sync Queue          │
        │                              │
        └─> Clear Cart                 │
                │                      │
                ▼                      ▼
        Generate Receipt        IndexedDB Storage
                │                      │
                ▼                      │
        Print Window                   │
                                       │
        Network Online?                │
                │                      │
                Yes                    │
                │                      │
                ▼                      │
        Sync Service ◄─────────────────┘
                │
                ▼
        API Client
                │
                ▼
        Django REST API
                │
                ▼
        Mark as Synced in DB
```

### Offline Mode - Sale Transaction

```
User adds product
        │
        ▼
Cart Store (add item)
        │
        ▼
User clicks checkout
        │
        ▼
Cart Component
        │
        ├─> Create Sale object
        │
        ├─> Save to IndexedDB
        │
        ├─> Add to Sync Queue (pending)
        │
        └─> Clear Cart
                │
                ▼
        Generate Receipt
                │
                ▼
        Print Window

        [Network Offline - Sale queued]
        
        ⏳ Waiting for connection...
        
        Connection restored!
                │
                ▼
        Auto-trigger Sync Service
                │
                ▼
        Process Sync Queue
                │
                ▼
        Send to API
                │
                ▼
        Mark as Synced
```

### Shift Management Flow

```
Staff Logs In
        │
        ▼
Dashboard Page
        │
        ├─> Check for Active Shift
        │   (query IndexedDB)
        │
        ├─ No Active Shift ──> Start Shift Form
        │                            │
        │                            ├─> Enter Starting Cash
        │                            │
        │                            ├─> Create Shift Record
        │                            │
        │                            ├─> Save to IndexedDB
        │                            │
        │                            └─> Update Auth Store
        │
        └─ Active Shift ──> Show Shift Stats
                                  │
                                  ├─> Sales Count
                                  ├─> Total Sales
                                  ├─> Starting Cash
                                  │
                                  └─> Options:
                                       ├─> Open POS
                                       └─> End Shift
                                            │
                                            ├─> Calculate Totals
                                            ├─> Update Shift Record
                                            └─> Close Shift
```

## Component Hierarchy

```
App (Root Layout)
├── Toaster (Notifications)
│
├── Home Page (/)
│   └── Redirect to Login or Dashboard
│
├── Login Page (/login)
│   ├── Login Form
│   └── API Auth Call
│
├── Dashboard Page (/dashboard)
│   ├── NetworkStatus Component
│   ├── Shift Information Display
│   ├── Start Shift Form (conditional)
│   └── Action Buttons
│
└── POS Page (/pos)
    ├── NetworkStatus Component
    ├── Product Grid
    │   └── ProductCard Components (mapped)
    │       ├── Product Image
    │       ├── Product Details
    │       └── Add to Cart Button
    │
    └── Cart Component (Sidebar)
        ├── Cart Items List
        │   ├── Quantity Controls
        │   └── Remove Button
        ├── Payment Method Selector
        ├── Total Display
        └── Action Buttons
            ├── Clear Cart
            └── Checkout
```

## State Management Structure

```
┌─────────────────────────────────────┐
│          Zustand Stores             │
├─────────────────────────────────────┤
│                                     │
│  ┌────────────────────────────┐    │
│  │       Auth Store           │    │
│  ├────────────────────────────┤    │
│  │ • staff: Staff | null      │    │
│  │ • authToken: string | null │    │
│  │ • isAuthenticated: boolean │    │
│  │ • currentShift: Shift      │    │
│  │ • login()                  │    │
│  │ • logout()                 │    │
│  │ • setCurrentShift()        │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌────────────────────────────┐    │
│  │       Cart Store           │    │
│  ├────────────────────────────┤    │
│  │ • items: CartItem[]        │    │
│  │ • addItem()                │    │
│  │ • removeItem()             │    │
│  │ • updateQuantity()         │    │
│  │ • clearCart()              │    │
│  │ • getTotal()               │    │
│  │ • getItemCount()           │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌────────────────────────────┐    │
│  │     Network Store          │    │
│  ├────────────────────────────┤    │
│  │ • isOnline: boolean        │    │
│  │ • isSyncing: boolean       │    │
│  │ • lastSyncTime: Date       │    │
│  │ • setOnline()              │    │
│  │ • setSyncing()             │    │
│  │ • setLastSyncTime()        │    │
│  └────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

## IndexedDB Schema

```
┌─────────────────────────────────────┐
│         GymFlowPOS Database         │
├─────────────────────────────────────┤
│                                     │
│  ┌────────────────────────────┐    │
│  │   products (Table)         │    │
│  ├────────────────────────────┤    │
│  │ Indexes:                   │    │
│  │  • id (primary)            │    │
│  │  • name                    │    │
│  │  • category                │    │
│  │  • barcode                 │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌────────────────────────────┐    │
│  │   sales (Table)            │    │
│  ├────────────────────────────┤    │
│  │ Indexes:                   │    │
│  │  • id (primary)            │    │
│  │  • staffId                 │    │
│  │  • shiftId                 │    │
│  │  • createdAt               │    │
│  │  • synced                  │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌────────────────────────────┐    │
│  │   shifts (Table)           │    │
│  ├────────────────────────────┤    │
│  │ Indexes:                   │    │
│  │  • id (primary)            │    │
│  │  • staffId                 │    │
│  │  • startTime               │    │
│  │  • status                  │    │
│  │  • synced                  │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌────────────────────────────┐    │
│  │   syncQueue (Table)        │    │
│  ├────────────────────────────┤    │
│  │ Indexes:                   │    │
│  │  • id (primary)            │    │
│  │  • type                    │    │
│  │  • status                  │    │
│  │  • timestamp               │    │
│  └────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

## Network Sync Architecture

```
┌──────────────────────────────────────┐
│       Network Event Listeners         │
├──────────────────────────────────────┤
│  window.addEventListener('online')   │
│  window.addEventListener('offline')  │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│      useNetworkStatus Hook           │
├──────────────────────────────────────┤
│  • Detect connection changes         │
│  • Update Network Store              │
│  • Trigger sync on reconnect         │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│         Sync Service                 │
├──────────────────────────────────────┤
│  1. Get pending items from queue     │
│  2. Process each item sequentially   │
│  3. Update item status               │
│  4. On success: remove from queue    │
│  5. On failure: increment retry      │
│  6. Update last sync time            │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│         API Client                   │
├──────────────────────────────────────┤
│  • Send HTTP requests                │
│  • Handle responses                  │
│  • Catch network errors              │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│      Django REST API                 │
└──────────────────────────────────────┘
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────┐
│            Presentation Layer                   │
│  • React 19 Components                          │
│  • Tailwind CSS Styling                         │
│  • Next.js App Router                           │
└─────────────────────────────────────────────────┘
                      │
┌─────────────────────────────────────────────────┐
│            Business Logic Layer                 │
│  • Custom Hooks (useNetworkStatus, etc.)        │
│  • Utility Services (syncService, receipt)      │
│  • Type Definitions                             │
└─────────────────────────────────────────────────┘
                      │
┌─────────────────────────────────────────────────┐
│            State Management Layer               │
│  • Zustand Stores (auth, cart, network)        │
│  • Persistent Storage                           │
└─────────────────────────────────────────────────┘
                      │
┌─────────────────────────────────────────────────┐
│            Data Access Layer                    │
│  • API Client (Axios)                           │
│  • IndexedDB Wrapper (Dexie)                    │
│  • WebSocket Client (Socket.io)                 │
└─────────────────────────────────────────────────┘
                      │
┌─────────────────────────────────────────────────┐
│            External Services                    │
│  • Django REST API                              │
│  • WebSocket Server                             │
│  • Browser APIs (IndexedDB, localStorage)       │
└─────────────────────────────────────────────────┘
```

---

**Note**: This architecture ensures:
- ✅ Separation of concerns
- ✅ Scalability
- ✅ Maintainability
- ✅ Testability
- ✅ Offline-first capability
- ✅ Real-time features
