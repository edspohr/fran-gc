import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';

export interface AdminNotifications {
  pendingClients: number;
  newOrders: number;
  loading: boolean;
}

export function useAdminNotifications(): AdminNotifications {
  const [pendingClients, setPendingClients] = useState(0);
  const [newOrders, setNewOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsubClients = onSnapshot(
      query(collection(db, 'clients'), where('status', '==', 'por-verificar')),
      (snap) => setPendingClients(snap.size),
    );
    const unsubOrders = onSnapshot(
      query(collection(db, 'orders'), where('status', '==', 'confirmado')),
      (snap) => {
        setNewOrders(snap.size);
        setLoading(false);
      },
    );
    return () => {
      unsubClients();
      unsubOrders();
    };
  }, []);

  return { pendingClients, newOrders, loading };
}
