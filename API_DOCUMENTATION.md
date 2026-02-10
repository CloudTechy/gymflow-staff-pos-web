# API Documentation

This document outlines the expected Django REST API endpoints for the GymFlow Staff POS application.

## Base URL

```
http://localhost:8000/api
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/login

Login a staff member.

**Request Body:**
```json
{
  "username": "staff",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "staff": {
    "id": "staff-123",
    "username": "staff",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "cashier",
    "isActive": true
  }
}
```

#### POST /auth/logout

Logout the current staff member.

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### Products

#### GET /products

Get all products.

**Response (200 OK):**
```json
[
  {
    "id": "prod-1",
    "name": "Protein Shake",
    "description": "High-quality whey protein shake",
    "price": 5.99,
    "category": "Supplements",
    "imageUrl": "https://example.com/image.jpg",
    "stock": 50,
    "barcode": "1234567890123",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /products/:id

Get a specific product by ID.

**Response (200 OK):**
```json
{
  "id": "prod-1",
  "name": "Protein Shake",
  "description": "High-quality whey protein shake",
  "price": 5.99,
  "category": "Supplements",
  "imageUrl": "https://example.com/image.jpg",
  "stock": 50,
  "barcode": "1234567890123",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

### Sales

#### POST /sales

Create a new sale.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "prod-1",
      "product": { "id": "prod-1", "name": "Protein Shake", "price": 5.99, ... },
      "quantity": 2,
      "price": 5.99,
      "subtotal": 11.98
    }
  ],
  "total": 11.98,
  "tax": 0,
  "discount": 0,
  "paymentMethod": "cash",
  "staffId": "staff-123",
  "shiftId": "shift-456",
  "customerId": null,
  "synced": false
}
```

**Response (201 Created):**
```json
{
  "id": "sale-789",
  "items": [...],
  "total": 11.98,
  "tax": 0,
  "discount": 0,
  "paymentMethod": "cash",
  "staffId": "staff-123",
  "shiftId": "shift-456",
  "customerId": null,
  "createdAt": "2024-01-01T12:00:00Z",
  "synced": true
}
```

#### GET /sales

Get sales with optional filters.

**Query Parameters:**
- `startDate` (optional): ISO 8601 date string
- `endDate` (optional): ISO 8601 date string
- `shiftId` (optional): Filter by shift ID

**Response (200 OK):**
```json
[
  {
    "id": "sale-789",
    "items": [...],
    "total": 11.98,
    "paymentMethod": "cash",
    "staffId": "staff-123",
    "shiftId": "shift-456",
    "createdAt": "2024-01-01T12:00:00Z",
    "synced": true
  }
]
```

---

### Shifts

#### POST /shifts/start

Start a new shift.

**Request Body:**
```json
{
  "staffId": "staff-123",
  "startingCash": 100.00
}
```

**Response (201 Created):**
```json
{
  "id": "shift-456",
  "staffId": "staff-123",
  "staffName": "John Doe",
  "startTime": "2024-01-01T08:00:00Z",
  "startingCash": 100.00,
  "totalSales": 0,
  "salesCount": 0,
  "status": "active",
  "synced": true
}
```

#### POST /shifts/:id/end

End an active shift.

**Request Body:**
```json
{
  "endingCash": 350.00
}
```

**Response (200 OK):**
```json
{
  "id": "shift-456",
  "staffId": "staff-123",
  "staffName": "John Doe",
  "startTime": "2024-01-01T08:00:00Z",
  "endTime": "2024-01-01T16:00:00Z",
  "startingCash": 100.00,
  "endingCash": 350.00,
  "totalSales": 250.00,
  "salesCount": 15,
  "status": "closed",
  "synced": true
}
```

#### GET /shifts/active/:staffId

Get the active shift for a staff member.

**Response (200 OK):**
```json
{
  "id": "shift-456",
  "staffId": "staff-123",
  "staffName": "John Doe",
  "startTime": "2024-01-01T08:00:00Z",
  "startingCash": 100.00,
  "totalSales": 150.00,
  "salesCount": 8,
  "status": "active",
  "synced": true
}
```

**Response (404 Not Found):**
```json
{
  "error": "No active shift found"
}
```

---

### Health

#### GET /health

Check API health status.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## WebSocket Events

The application connects to WebSocket server at `ws://localhost:8000` (or configured URL).

### Connection

```javascript
socket.io-client connects with:
{
  auth: { token: "<jwt-token>" },
  transports: ['websocket']
}
```

### Events Received from Server

#### attendance-alert

Real-time notification when a member checks in or out.

**Payload:**
```json
{
  "id": "alert-123",
  "memberId": "member-456",
  "memberName": "Jane Smith",
  "checkInTime": "2024-01-01T09:30:00Z",
  "type": "check-in",
  "message": "Jane Smith checked in"
}
```

#### sync-required

Server requests the client to sync pending data.

**Payload:** (empty or minimal)

### Events Sent to Server

None currently - all communication is server-to-client for notifications.

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message",
  "details": "Additional details if available"
}
```

Common HTTP status codes:
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Notes

1. All timestamps should be in ISO 8601 format
2. All monetary values are in USD with 2 decimal places
3. Product stock is updated automatically when sales are created
4. The POS app works offline and queues transactions for sync
5. When online, the app periodically syncs with the server
