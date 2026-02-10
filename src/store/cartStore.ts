import { create } from 'zustand';
import type { Product, CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (product, quantity = 1) => {
    const items = get().items;
    const existingItem = items.find(item => item.productId === product.id);
    
    if (existingItem) {
      set({
        items: items.map(item =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * item.price,
              }
            : item
        ),
      });
    } else {
      const newItem: CartItem = {
        productId: product.id,
        product,
        quantity,
        price: product.price,
        subtotal: product.price * quantity,
      };
      set({ items: [...items, newItem] });
    }
  },
  
  removeItem: (productId) => {
    set({ items: get().items.filter(item => item.productId !== productId) });
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    
    set({
      items: get().items.map(item =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              subtotal: item.price * quantity,
            }
          : item
      ),
    });
  },
  
  clearCart: () => set({ items: [] }),
  
  getTotal: () => {
    return get().items.reduce((total, item) => total + item.subtotal, 0);
  },
  
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
