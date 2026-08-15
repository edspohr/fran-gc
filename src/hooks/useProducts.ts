import { useEffect, useState } from 'react';
import { listPublicProducts, subscribeAdminProducts } from '@/lib/products';
import { previewProducts } from '@/data/preview';
import type { Product } from '@/types/product';

const hasFirebaseConfig = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);
const usePreview = import.meta.env.DEV && !hasFirebaseConfig;

export interface UseProductsState {
  products: Product[];
  loading: boolean;
  error: Error | null;
  isPreview: boolean;
}

export function usePublicProducts(): UseProductsState {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (usePreview) {
      setProducts(previewProducts());
      setLoading(false);
      return;
    }

    listPublicProducts()
      .then((items) => {
        if (!cancelled) setProducts(items);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, error, isPreview: usePreview };
}

export function useAdminProducts(): UseProductsState {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (usePreview) {
      setProducts(previewProducts());
      setLoading(false);
      return;
    }
    const unsub = subscribeAdminProducts(
      (items) => {
        setProducts(items);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  return { products, loading, error, isPreview: usePreview };
}
