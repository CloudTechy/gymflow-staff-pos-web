import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Staff, ShiftSession } from '@/types';

interface AuthState {
  staff: Staff | null;
  authToken: string | null;
  isAuthenticated: boolean;
  currentShift: ShiftSession | null;
  login: (staff: Staff, token: string) => void;
  logout: () => void;
  setCurrentShift: (shift: ShiftSession | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      staff: null,
      authToken: null,
      isAuthenticated: false,
      currentShift: null,
      login: (staff, token) => {
        localStorage.setItem('authToken', token);
        set({ staff, authToken: token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('authToken');
        set({ staff: null, authToken: null, isAuthenticated: false, currentShift: null });
      },
      setCurrentShift: (shift) => set({ currentShift: shift }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
