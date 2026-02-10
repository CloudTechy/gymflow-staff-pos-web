'use client';

import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="card hover:shadow-lg transition-shadow cursor-pointer">
      {product.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg mb-4"
        />
      )}
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      {product.description && (
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
      )}
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-primary-600">
          ${product.price.toFixed(2)}
        </span>
        <button
          onClick={() => addItem(product)}
          className="btn-primary text-sm py-1.5 px-3"
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Stock: {product.stock} | Category: {product.category}
      </div>
    </div>
  );
}
