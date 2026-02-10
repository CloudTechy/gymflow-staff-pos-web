import { create } from 'zustand';

interface NetworkState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  setOnline: (online: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setLastSyncTime: (time: Date) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isSyncing: false,
  lastSyncTime: null,
  setOnline: (online) => set({ isOnline: online }),
  setSyncing: (syncing) => set({ isSyncing: syncing }),
  setLastSyncTime: (time) => set({ lastSyncTime: time }),
}));
