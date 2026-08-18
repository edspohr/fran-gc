import type { Timestamp } from 'firebase/firestore';

export const CLIENT_STATUSES = ['por-verificar', 'activo', 'suspendido'] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export const clientStatusLabel = (s: ClientStatus): string => {
  switch (s) {
    case 'por-verificar':
      return 'Por verificar';
    case 'activo':
      return 'Activo';
    case 'suspendido':
      return 'Suspendido';
  }
};

export interface Client {
  uid: string;
  email: string;
  name: string;
  company: string;
  comuna: string;
  phone: string;
  rut?: string;
  address?: string;
  adminNotes?: string;
  status: ClientStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ClientInput = Omit<Client, 'uid' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: ClientStatus;
};

export type ClientProfileFields = Pick<
  Client,
  'name' | 'company' | 'comuna' | 'phone' | 'rut' | 'address'
>;
