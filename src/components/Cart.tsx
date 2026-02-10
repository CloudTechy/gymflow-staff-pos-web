'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { dbHelpers } from '@/lib/db';
import { syncService } from '@/utils/syncService';
import { generateReceipt, printReceipt } from '@/utils/receipt';
import type { Sale } from '@/types';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const { staff, currentShift } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile'>('cash');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!staff || !currentShift || items.length === 0) {
      toast.error('Cannot complete checkout');
      return;
    }

    setIsProcessing(true);
    try {
      const sale: Sale = {
        id: `sale-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        items,
        total: getTotal(),
        paymentMethod,
        staffId: staff.id,
        shiftId: currentShift.id,
        createdAt: new Date(),
        synced: false,
      };

      // Save to IndexedDB
      await dbHelpers.addSale(sale);

      // Add to sync queue
      await syncService.addSaleToQueue(sale);

      // Update shift statistics
      await dbHelpers.updateShift(currentShift.id, {
        totalSales: currentShift.totalSales + sale.total,
        salesCount: currentShift.salesCount + 1,
      });

      // Generate and print receipt
      const receipt = generateReceipt(sale);
      printReceipt(receipt);

      // Clear cart
      clearCart();
      toast.success('Sale completed successfully!');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to complete sale');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      
      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Cart is empty</p>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{item.product.name}</h4>
                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  
                  <span className="w-20 text-right font-semibold">
                    ${item.subtotal.toFixed(2)}
                  </span>
                  
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'cash'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Cash
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Card
              </button>
              <button
                onClick={() => setPaymentMethod('mobile')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'mobile'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Mobile
              </button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold">Total:</span>
              <span className="text-2xl font-bold text-primary-600">
                ${getTotal().toFixed(2)}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={clearCart} 
                className="btn-secondary flex-1"
                disabled={isProcessing}
              >
                Clear Cart
              </button>
              <button 
                onClick={handleCheckout}
                className="btn-primary flex-1"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
