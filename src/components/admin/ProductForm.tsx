import { useState, type FormEvent } from 'react';
import Button from '../ui/Button';
import ImageUpload from './ImageUpload';
import {
  CATEGORIES,
  TAGS,
  UNIT_TYPES,
  type Category,
  type Product,
  type ProductInput,
  type Tag,
  type UnitType,
} from '@/types/product';
import { slugify } from '@/lib/slug';

interface Props {
  initial?: Product;
  onSubmit: (input: ProductInput) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [category, setCategory] = useState<Category>(initial?.category ?? 'productos-madurados');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [presentation, setPresentation] = useState(initial?.presentation ?? '');
  const [unitType, setUnitType] = useState<UnitType>(initial?.unitType ?? 'kg');
  const [tags, setTags] = useState<Tag[]>(initial?.tags ?? ['horeca']);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [visible, setVisible] = useState(initial?.visible ?? true);
  const [order, setOrder] = useState(initial?.order ?? 999);
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl);
  const [imagePath, setImagePath] = useState(initial?.imagePath);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nameChanged = (val: string) => {
    setName(val);
    if (!initial) setSlug(slugify(val));
  };

  const toggleTag = (t: Tag) => {
    setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !description.trim() || !presentation.trim()) {
      setError('Complete los campos obligatorios.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        slug: slug.trim(),
        category,
        description: description.trim(),
        presentation: presentation.trim(),
        unitType,
        tags,
        featured,
        visible,
        order,
        ...(imageUrl ? { imageUrl } : {}),
        ...(imagePath ? { imagePath } : {}),
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    'w-full bg-ink border border-gold/25 rounded px-3 py-2 text-cream focus:outline-none focus:border-gold/60';
  const labelCls = 'block text-xs uppercase tracking-eyebrow text-cream-muted mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className={labelCls}>Nombre *</span>
          <input value={name} onChange={(e) => nameChanged(e.target.value)} className={inputCls} required />
        </label>
        <label className="block">
          <span className={labelCls}>Slug *</span>
          <input
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            className={inputCls}
            disabled={!!initial}
            required
          />
        </label>
      </div>

      <label className="block">
        <span className={labelCls}>Descripción *</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputCls} resize-none`}
          rows={3}
          required
        />
      </label>

      <div className="grid md:grid-cols-3 gap-4">
        <label className="block">
          <span className={labelCls}>Categoría</span>
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className={inputCls}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelCls}>Presentación *</span>
          <input value={presentation} onChange={(e) => setPresentation(e.target.value)} className={inputCls} required />
        </label>
        <label className="block">
          <span className={labelCls}>Formato de unidad</span>
          <select value={unitType} onChange={(e) => setUnitType(e.target.value as UnitType)} className={inputCls}>
            {UNIT_TYPES.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset>
        <legend className={labelCls}>Uso</legend>
        <div className="flex gap-4 mt-1">
          {TAGS.map((t) => (
            <label key={t.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={tags.includes(t.id)}
                onChange={() => toggleTag(t.id)}
                className="accent-gold"
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid md:grid-cols-3 gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-gold" />
          Destacado (best seller)
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="accent-gold" />
          Visible en el catálogo público
        </label>
        <label className="block">
          <span className={labelCls}>Orden</span>
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className={inputCls} />
        </label>
      </div>

      <div>
        <span className={labelCls}>Imagen</span>
        <ImageUpload
          slug={slug || 'nuevo'}
          currentUrl={imageUrl}
          currentPath={imagePath}
          onUploaded={(url, path) => {
            setImageUrl(url);
            setImagePath(path);
          }}
        />
      </div>

      {error && <p className="text-sm text-wine">{error}</p>}

      <div className="flex gap-3 pt-4 border-t border-gold/15">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Guardando…' : initial ? 'Actualizar producto' : 'Crear producto'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
