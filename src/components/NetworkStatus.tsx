'use client';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useNetworkStore } from '@/store/networkStore';
import { format } from 'date-fns';

export default function NetworkStatus() {
  const isOnline = useNetworkStatus();
  const { isSyncing, lastSyncTime } = useNetworkStore();

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-gray-700">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
      
      {isSyncing && (
        <span className="text-blue-600">Syncing...</span>
      )}
      
      {lastSyncTime && (
        <span className="text-gray-500 text-xs">
          Last sync: {format(lastSyncTime, 'HH:mm:ss')}
        </span>
      )}
    </div>
  );
}
