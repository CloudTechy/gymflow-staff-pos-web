'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/hooks/useWebSocket';
import NetworkStatus from '@/components/NetworkStatus';
import ProductCard from '@/components/ProductCard';
import Cart from '@/components/Cart';
import { dbHelpers } from '@/lib/db';
import { syncService } from '@/utils/syncService';
import type { Product } from '@/types';

export default function POSPage() {
  const { staff, currentShift, isAuthenticated, authToken } = useAuthStore();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Initialize WebSocket connection
  useWebSocket(authToken);

  useEffect(() => {
    if (!isAuthenticated || !currentShift) {
      router.push('/login');
      return;
    }

    loadProducts();
  }, [isAuthenticated, currentShift, router]);

  const loadProducts = async () => {
    try {
      // Try to sync from API first
      await syncService.syncProducts();
    } catch (error) {
      console.log('Using offline data');
    }
    
    // Load from IndexedDB
    const localProducts = await dbHelpers.getAllProducts();
    
    // If no products, seed with sample data
    if (localProducts.length === 0) {
      const { seedDatabase } = await import('@/utils/seedData');
      await seedDatabase();
      const seededProducts = await dbHelpers.getAllProducts();
      setProducts(seededProducts);
    } else {
      setProducts(localProducts);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GymFlow POS</h1>
              <p className="text-sm text-gray-600">
                Staff: {staff?.name} | Shift: {currentShift?.id.slice(0, 8)}
              </p>
            </div>
            <NetworkStatus />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="card mb-4">
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field flex-1"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field w-48"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="card text-center text-gray-500 py-12">
                No products found
              </div>
            )}
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Cart />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
