import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Product } from '@/types/product';
import { categoryLabel } from '@/types/product';

interface Props {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  onReorder: (orderedIds: string[]) => void;
}

export default function ProductTable({ products, onEdit, onDelete, onReorder }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(products, oldIndex, newIndex);
    onReorder(next.map((p) => p.id));
  };

  return (
    <div className="border border-gold/15 rounded overflow-hidden">
      <div className="hidden md:grid grid-cols-[24px_1.5fr_1fr_1fr_100px_140px] gap-3 px-4 py-2 bg-surface-1 text-xs uppercase tracking-eyebrow text-cream-muted">
        <span aria-hidden="true"></span>
        <span>Producto</span>
        <span>Categoría</span>
        <span>Presentación</span>
        <span>Estado</span>
        <span>Acciones</span>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={products.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <ul>
            {products.map((p) => (
              <Row key={p.id} product={p} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function Row({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-[24px_1.5fr_1fr_1fr_100px_140px] gap-3 px-4 py-3 border-t border-gold/10 items-center bg-ink"
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="Reordenar"
        className="cursor-grab text-cream-muted hover:text-cream"
      >
        ≡
      </button>
      <div>
        <p className="text-sm text-cream">{product.name}</p>
        <p className="text-xs text-cream-muted">/{product.slug}</p>
      </div>
      <span className="text-xs text-cream-muted">{categoryLabel(product.category)}</span>
      <span className="text-xs text-cream-muted">{product.presentation}</span>
      <div className="flex flex-col gap-1">
        {product.visible ? (
          <span className="text-xs text-gold">Visible</span>
        ) : (
          <span className="text-xs text-wine">Oculto</span>
        )}
        {product.featured && <span className="text-[0.65rem] text-cream-muted">Destacado</span>}
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="text-xs text-gold hover:text-gold-hover"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => onDelete(product)}
          className="text-xs text-cream-muted hover:text-wine"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}
