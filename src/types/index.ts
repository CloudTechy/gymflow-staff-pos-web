// Core types for the POS system

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
  barcode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  tax?: number;
  discount?: number;
  paymentMethod: 'cash' | 'card' | 'mobile';
  staffId: string;
  shiftId: string;
  customerId?: string;
  createdAt: Date;
  synced: boolean;
}

export interface ShiftSession {
  id: string;
  staffId: string;
  staffName: string;
  startTime: Date;
  endTime?: Date;
  startingCash: number;
  endingCash?: number;
  totalSales: number;
  salesCount: number;
  status: 'active' | 'closed';
  synced: boolean;
}

export interface Staff {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'cashier' | 'manager' | 'admin';
  isActive: boolean;
}

export interface SyncQueueItem {
  id: string;
  type: 'sale' | 'shift' | 'product';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: Date;
  retryCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface AttendanceAlert {
  id: string;
  memberId: string;
  memberName: string;
  checkInTime: Date;
  type: 'check-in' | 'check-out';
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
