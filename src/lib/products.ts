import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product, ProductInput } from '@/types/product';

const COLLECTION = 'products';

function fromSnap(snap: QueryDocumentSnapshot): Product {
  const data = snap.data() as Omit<Product, 'id'>;
  return { id: snap.id, ...data };
}

export async function listPublicProducts(): Promise<Product[]> {
  const q = query(
    collection(db, COLLECTION),
    where('visible', '==', true),
    orderBy('order', 'asc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map(fromSnap);
}

export async function getPublicProductBySlug(slug: string): Promise<Product | null> {
  const ref = doc(db, COLLECTION, slug);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as Omit<Product, 'id'>;
  if (!data.visible) return null;
  return { id: snap.id, ...data };
}

export function subscribeAdminProducts(
  onChange: (products: Product[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map(fromSnap)),
    (err) => onError?.(err),
  );
}

export async function createProduct(input: ProductInput): Promise<void> {
  const ref = doc(db, COLLECTION, input.slug);
  await setDoc(ref, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProduct(
  id: string,
  patch: Partial<ProductInput>,
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}

export async function reorderProducts(orderedIds: string[]): Promise<void> {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, COLLECTION, id), {
      order: index,
      updatedAt: serverTimestamp(),
    });
  });
  await batch.commit();
}
