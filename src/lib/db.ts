import Dexie, { Table } from 'dexie';
import type { Product, Sale, ShiftSession, SyncQueueItem } from '@/types';

export class POSDatabase extends Dexie {
  products!: Table<Product, string>;
  sales!: Table<Sale, string>;
  shifts!: Table<ShiftSession, string>;
  syncQueue!: Table<SyncQueueItem, string>;

  constructor() {
    super('GymFlowPOS');
    
    this.version(1).stores({
      products: 'id, name, category, barcode',
      sales: 'id, staffId, shiftId, createdAt, synced',
      shifts: 'id, staffId, startTime, status, synced',
      syncQueue: 'id, type, status, timestamp',
    });
  }
}

export const db = new POSDatabase();

// Helper functions for database operations
export const dbHelpers = {
  // Products
  async getAllProducts(): Promise<Product[]> {
    return await db.products.toArray();
  },

  async getProductById(id: string): Promise<Product | undefined> {
    return await db.products.get(id);
  },

  async addProduct(product: Product): Promise<string> {
    return await db.products.add(product);
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<number> {
    return await db.products.update(id, updates);
  },

  async syncProducts(products: Product[]): Promise<void> {
    await db.products.clear();
    await db.products.bulkAdd(products);
  },

  // Sales
  async addSale(sale: Sale): Promise<string> {
    return await db.sales.add(sale);
  },

  async getSalesByShift(shiftId: string): Promise<Sale[]> {
    return await db.sales.where('shiftId').equals(shiftId).toArray();
  },

  async getUnsyncedSales(): Promise<Sale[]> {
    return await db.sales.where('synced').equals(0).toArray();
  },

  async markSaleSynced(id: string): Promise<number> {
    return await db.sales.update(id, { synced: true });
  },

  // Shifts
  async addShift(shift: ShiftSession): Promise<string> {
    return await db.shifts.add(shift);
  },

  async getActiveShift(staffId: string): Promise<ShiftSession | undefined> {
    return await db.shifts
      .where('staffId')
      .equals(staffId)
      .and(shift => shift.status === 'active')
      .first();
  },

  async updateShift(id: string, updates: Partial<ShiftSession>): Promise<number> {
    return await db.shifts.update(id, updates);
  },

  async getShiftById(id: string): Promise<ShiftSession | undefined> {
    return await db.shifts.get(id);
  },

  // Sync Queue
  async addToSyncQueue(item: SyncQueueItem): Promise<string> {
    return await db.syncQueue.add(item);
  },

  async getPendingSyncItems(): Promise<SyncQueueItem[]> {
    return await db.syncQueue
      .where('status')
      .equals('pending')
      .sortBy('timestamp');
  },

  async updateSyncItem(id: string, updates: Partial<SyncQueueItem>): Promise<number> {
    return await db.syncQueue.update(id, updates);
  },

  async removeSyncItem(id: string): Promise<void> {
    await db.syncQueue.delete(id);
  },
};
