import { useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import ProductTable from '@/components/admin/ProductTable';
import ProductForm from '@/components/admin/ProductForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useAdminProducts } from '@/hooks/useProducts';
import {
  createProduct,
  deleteProduct,
  reorderProducts,
  updateProduct,
} from '@/lib/products';
import type { Product, ProductInput } from '@/types/product';
import { useSeo } from '@/lib/seo';

type Mode = { kind: 'closed' } | { kind: 'create' } | { kind: 'edit'; product: Product };

export default function AdminProducts() {
  const { products, loading, error, isPreview } = useAdminProducts();
  const [mode, setMode] = useState<Mode>({ kind: 'closed' });
  const [busy, setBusy] = useState(false);

  useSeo({ title: 'Productos · Admin FRAN GC', noindex: true });

  const handleSubmit = async (input: ProductInput) => {
    if (mode.kind === 'edit') {
      await updateProduct(mode.product.id, input);
    } else {
      await createProduct(input);
    }
    setMode({ kind: 'closed' });
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(`¿Eliminar "${product.name}" del catálogo?`);
    if (!confirmed) return;
    setBusy(true);
    try {
      await deleteProduct(product.id);
    } finally {
      setBusy(false);
    }
  };

  const handleReorder = async (ids: string[]) => {
    setBusy(true);
    try {
      await reorderProducts(ids);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminShell>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl">Catálogo · Productos</h1>
          <p className="text-cream-muted text-sm mt-1">
            {products.length} producto{products.length === 1 ? '' : 's'} · arrastre para reordenar.
          </p>
          {isPreview && (
            <p className="text-xs text-wine mt-2">
              [Preview] Firebase no está configurado. Los cambios no se persisten.
            </p>
          )}
        </div>
        <Button onClick={() => setMode({ kind: 'create' })}>+ Nuevo producto</Button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-cream-muted">Cargando productos…</div>
      ) : error ? (
        <div className="py-16 text-center text-wine">Error: {error.message}</div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center text-cream-muted">
          No hay productos aún. Cree el primero con el botón «+ Nuevo producto».
        </div>
      ) : (
        <ProductTable
          products={products}
          onEdit={(p) => setMode({ kind: 'edit', product: p })}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      )}

      {busy && <div className="mt-4 text-xs text-cream-muted text-right">Guardando…</div>}

      <Modal
        open={mode.kind !== 'closed'}
        onClose={() => setMode({ kind: 'closed' })}
        labelledBy="admin-form-title"
      >
        <div className="p-6 md:p-8">
          <h2 id="admin-form-title" className="font-serif text-2xl mb-4">
            {mode.kind === 'edit' ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          {mode.kind !== 'closed' && (
            <ProductForm
              initial={mode.kind === 'edit' ? mode.product : undefined}
              onSubmit={handleSubmit}
              onCancel={() => setMode({ kind: 'closed' })}
            />
          )}
        </div>
      </Modal>
    </AdminShell>
  );
}
