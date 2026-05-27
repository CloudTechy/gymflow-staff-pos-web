import { dbHelpers } from '@/lib/db';
import type { Product } from '@/types';

export const sampleProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Protein Shake',
    description: 'High-quality whey protein shake',
    price: 5.99,
    category: 'Supplements',
    stock: 50,
    barcode: '1234567890123',
  },
  {
    id: 'prod-2',
    name: 'Energy Drink',
    description: 'Sugar-free energy boost',
    price: 2.99,
    category: 'Beverages',
    stock: 75,
    barcode: '1234567890124',
  },
  {
    id: 'prod-3',
    name: 'Protein Bar',
    description: 'Chocolate peanut butter protein bar',
    price: 3.49,
    category: 'Supplements',
    stock: 100,
    barcode: '1234567890125',
  },
  {
    id: 'prod-4',
    name: 'Gym Towel',
    description: 'Microfiber gym towel',
    price: 12.99,
    category: 'Accessories',
    stock: 30,
    barcode: '1234567890126',
  },
  {
    id: 'prod-5',
    name: 'Water Bottle',
    description: '32oz insulated water bottle',
    price: 19.99,
    category: 'Accessories',
    stock: 25,
    barcode: '1234567890127',
  },
  {
    id: 'prod-6',
    name: 'Pre-Workout',
    description: 'Energy and focus supplement',
    price: 34.99,
    category: 'Supplements',
    stock: 20,
    barcode: '1234567890128',
  },
  {
    id: 'prod-7',
    name: 'Resistance Bands',
    description: 'Set of 3 resistance bands',
    price: 24.99,
    category: 'Equipment',
    stock: 15,
    barcode: '1234567890129',
  },
  {
    id: 'prod-8',
    name: 'Workout Gloves',
    description: 'Padded lifting gloves',
    price: 15.99,
    category: 'Accessories',
    stock: 40,
    barcode: '1234567890130',
  },
  {
    id: 'prod-9',
    name: 'Vitamin C',
    description: '1000mg vitamin C supplement',
    price: 9.99,
    category: 'Supplements',
    stock: 60,
    barcode: '1234567890131',
  },
  {
    id: 'prod-10',
    name: 'Sports Drink',
    description: 'Electrolyte sports drink',
    price: 2.49,
    category: 'Beverages',
    stock: 90,
    barcode: '1234567890132',
  },
  {
    id: 'prod-11',
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat',
    price: 29.99,
    category: 'Equipment',
    stock: 12,
    barcode: '1234567890133',
  },
  {
    id: 'prod-12',
    name: 'Jump Rope',
    description: 'Adjustable speed jump rope',
    price: 8.99,
    category: 'Equipment',
    stock: 35,
    barcode: '1234567890134',
  },
];

export async function seedDatabase(): Promise<void> {
  try {
    const existingProducts = await dbHelpers.getAllProducts();
    
    if (existingProducts.length === 0) {
      await dbHelpers.syncProducts(sampleProducts);
      console.log('Database seeded with sample products');
    }
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}
