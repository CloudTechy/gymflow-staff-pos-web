import { dbHelpers } from '@/lib/db';
import { apiClient } from '@/lib/api';
import { useNetworkStore } from '@/store/networkStore';
import type { Product, Sale, ShiftSession, SyncQueueItem } from '@/types';

export const syncService = {
  async syncProducts(): Promise<boolean> {
    try {
      const response = await apiClient.getProducts();
      if (response.success && response.data) {
        await dbHelpers.syncProducts(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to sync products:', error);
      return false;
    }
  },

  async syncPendingTransactions(): Promise<void> {
    const { setSyncing, setLastSyncTime } = useNetworkStore.getState();
    setSyncing(true);

    try {
      const pendingItems = await dbHelpers.getPendingSyncItems();

      for (const item of pendingItems) {
        try {
          await dbHelpers.updateSyncItem(item.id, { status: 'processing' });

          if (item.type === 'sale') {
            const response = await apiClient.createSale(item.data);
            if (response.success) {
              await dbHelpers.markSaleSynced(item.data.id);
              await dbHelpers.removeSyncItem(item.id);
            } else {
              throw new Error(response.error);
            }
          } else if (item.type === 'shift') {
            // Handle shift sync
            await dbHelpers.removeSyncItem(item.id);
          }
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          await dbHelpers.updateSyncItem(item.id, {
            status: 'failed',
            retryCount: item.retryCount + 1,
          });
        }
      }

      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  },

  async addSaleToQueue(sale: Sale): Promise<void> {
    // Generate a UUID-like ID for better uniqueness
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 11);
    const queueItem: SyncQueueItem = {
      id: `sync-${timestamp}-${random}`,
      type: 'sale',
      action: 'create',
      data: sale,
      timestamp: new Date(),
      retryCount: 0,
      status: 'pending',
    };
    await dbHelpers.addToSyncQueue(queueItem);
  },
};
