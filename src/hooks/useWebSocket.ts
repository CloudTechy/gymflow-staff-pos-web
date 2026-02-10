import { useEffect } from 'react';
import { wsClient } from '@/lib/websocket';
import { syncService } from '@/utils/syncService';
import type { AttendanceAlert } from '@/types';
import toast from 'react-hot-toast';

export function useWebSocket(authToken: string | null) {
  useEffect(() => {
    if (!authToken) return;

    // Connect WebSocket
    wsClient.connect(authToken);

    // Handle attendance alerts
    const handleAttendanceAlert = (alert: AttendanceAlert) => {
      toast.success(
        `${alert.memberName} ${alert.type === 'check-in' ? 'checked in' : 'checked out'}`,
        { duration: 5000 }
      );
    };

    // Handle sync required
    const handleSyncRequired = () => {
      syncService.syncPendingTransactions();
    };

    wsClient.on('attendance-alert', handleAttendanceAlert);
    wsClient.on('sync-required', handleSyncRequired);

    return () => {
      wsClient.off('attendance-alert', handleAttendanceAlert);
      wsClient.off('sync-required', handleSyncRequired);
      wsClient.disconnect();
    };
  }, [authToken]);
}
