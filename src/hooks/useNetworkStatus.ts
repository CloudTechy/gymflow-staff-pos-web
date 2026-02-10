import { useEffect } from 'react';
import { useNetworkStore } from '@/store/networkStore';
import { syncService } from '@/utils/syncService';

export function useNetworkStatus() {
  const { isOnline, setOnline } = useNetworkStore();

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      // Trigger sync when coming back online
      syncService.syncPendingTransactions();
    };

    const handleOffline = () => {
      setOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline]);

  return isOnline;
}
