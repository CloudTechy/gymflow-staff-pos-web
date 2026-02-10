'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { dbHelpers } from '@/lib/db';
import NetworkStatus from '@/components/NetworkStatus';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { staff, currentShift, isAuthenticated, setCurrentShift } = useAuthStore();
  const [startingCash, setStartingCash] = useState('100.00');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const checkActiveShift = async () => {
      if (!staff) return;
      
      const activeShift = await dbHelpers.getActiveShift(staff.id);
      if (activeShift) {
        setCurrentShift(activeShift);
      }
    };

    checkActiveShift();
  }, [isAuthenticated, staff, router, setCurrentShift]);

  const handleStartShift = async () => {
    if (!staff) return;
    
    setLoading(true);
    try {
      const shift = {
        id: `shift-${Date.now()}`,
        staffId: staff.id,
        staffName: staff.name,
        startTime: new Date(),
        startingCash: parseFloat(startingCash),
        totalSales: 0,
        salesCount: 0,
        status: 'active' as const,
        synced: false,
      };

      await dbHelpers.addShift(shift);
      setCurrentShift(shift);
      toast.success('Shift started successfully!');
      router.push('/pos');
    } catch (error) {
      toast.error('Failed to start shift');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndShift = async () => {
    if (!currentShift) return;
    
    setLoading(true);
    try {
      const sales = await dbHelpers.getSalesByShift(currentShift.id);
      const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
      
      await dbHelpers.updateShift(currentShift.id, {
        endTime: new Date(),
        totalSales,
        salesCount: sales.length,
        status: 'closed',
      });

      setCurrentShift(null);
      toast.success('Shift ended successfully!');
    } catch (error) {
      toast.error('Failed to end shift');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <NetworkStatus />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Welcome, {staff?.name}!</h2>
          <p className="text-gray-600">Role: {staff?.role}</p>
        </div>

        {!currentShift ? (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Start Your Shift</h3>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Cash Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={startingCash}
                onChange={(e) => setStartingCash(e.target.value)}
                className="input-field mb-4"
                placeholder="100.00"
              />
              <button
                onClick={handleStartShift}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Starting...' : 'Start Shift'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="card bg-green-50 border-2 border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Active Shift
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Started:</p>
                  <p className="font-semibold">
                    {new Date(currentShift.startTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Starting Cash:</p>
                  <p className="font-semibold">
                    ${currentShift.startingCash.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Sales Count:</p>
                  <p className="font-semibold">{currentShift.salesCount}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Sales:</p>
                  <p className="font-semibold">
                    ${currentShift.totalSales.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/pos')}
                className="btn-primary py-6 text-lg"
              >
                Open POS
              </button>
              <button
                onClick={handleEndShift}
                disabled={loading}
                className="btn-danger py-6 text-lg"
              >
                {loading ? 'Ending...' : 'End Shift'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
