import type { Timestamp } from 'firebase/firestore';
import type { UnitType } from './product';

export const ORDER_STATUSES = ['borrador', 'confirmado', 'en-preparacion', 'entregado'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const orderStatusLabel = (s: OrderStatus): string => {
  switch (s) {
    case 'borrador':
      return 'Borrador';
    case 'confirmado':
      return 'Confirmado';
    case 'en-preparacion':
      return 'En preparación';
    case 'entregado':
      return 'Entregado';
  }
};

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  presentation: string;
  unitType: UnitType;
  quantity: number;
  priceAtOrder?: number;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  at: Timestamp;
  by: string;
  byRole: 'cliente' | 'admin';
  note?: string;
}

export interface OrderClientSnapshot {
  email: string;
  name: string;
  company: string;
  comuna: string;
  phone: string;
}

export interface Order {
  id: string;
  clientId: string;
  clientSnapshot: OrderClientSnapshot;
  items: OrderItem[];
  deliveryDate: Timestamp;
  notes?: string;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  placedBy: 'cliente' | 'admin';
  placedByUid: string;
  hasDifference: boolean;
  differenceNotes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const countItems = (items: OrderItem[]): number =>
  items.reduce((sum, i) => sum + i.quantity, 0);

export const canTransition = (from: OrderStatus, to: OrderStatus): boolean => {
  const transitions: Record<OrderStatus, OrderStatus[]> = {
    borrador: ['confirmado'],
    confirmado: ['en-preparacion', 'borrador'],
    'en-preparacion': ['entregado', 'confirmado'],
    entregado: [],
  };
  return transitions[from].includes(to);
};
