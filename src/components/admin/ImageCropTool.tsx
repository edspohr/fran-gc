import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import Button from '@/components/ui/Button';

interface Props {
  slug: string;
  currentUrl?: string;
  currentPath?: string;
  onUploaded: (url: string, path: string) => void;
}

const OUTPUT_SIZE = 800;

export default function ImageCropTool({ slug, currentUrl, currentPath, onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number; size: number } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; cropX: number; cropY: number } | null>(null);

  useEffect(() => {
    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [imgUrl]);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Debe ser una imagen.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('El archivo excede 10 MB.');
      return;
    }
    setError(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    setImgUrl(url);
  };

  const onImgLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    setImgSize({ w, h });
    const size = Math.min(w, h);
    setCrop({ x: (w - size) / 2, y: (h - size) / 2, size });
  };

  const scale = useCallback(() => {
    const img = imgRef.current;
    if (!img || !imgSize) return 1;
    return img.clientWidth / imgSize.w;
  }, [imgSize]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!crop) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, cropX: crop.x, cropY: crop.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !crop || !imgSize) return;
    const s = scale();
    const dx = (e.clientX - dragRef.current.startX) / s;
    const dy = (e.clientY - dragRef.current.startY) / s;
    const x = Math.max(0, Math.min(imgSize.w - crop.size, dragRef.current.cropX + dx));
    const y = Math.max(0, Math.min(imgSize.h - crop.size, dragRef.current.cropY + dy));
    setCrop({ ...crop, x, y });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    dragRef.current = null;
  };

  const setSize = (n: number) => {
    if (!crop || !imgSize) return;
    const size = Math.max(80, Math.min(Math.min(imgSize.w, imgSize.h), n));
    const cx = crop.x + crop.size / 2;
    const cy = crop.y + crop.size / 2;
    const x = Math.max(0, Math.min(imgSize.w - size, cx - size / 2));
    const y = Math.max(0, Math.min(imgSize.h - size, cy - size / 2));
    setCrop({ x, y, size });
  };

  const reset = () => {
    setFile(null);
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    setImgUrl(null);
    setImgSize(null);
    setCrop(null);
  };

  const upload = async () => {
    if (!file || !imgRef.current || !crop) return;
    setUploading(true);
    setError(null);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas no soportado.');
      ctx.drawImage(imgRef.current, crop.x, crop.y, crop.size, crop.size, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('No se pudo generar imagen.'))),
          'image/jpeg',
          0.85,
        ),
      );
      const path = `products/${slug}.jpg`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, blob, {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000, immutable',
      });
      const url = await getDownloadURL(storageRef);
      if (currentPath && currentPath !== path) {
        try { await deleteObject(ref(storage, currentPath)); } catch {
          // ignore missing prior file
        }
      }
      onUploaded(url, path);
      reset();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const s = scale();

  return (
    <div className="space-y-3">
      {currentUrl && !imgUrl && (
        <img
          src={currentUrl}
          alt="Actual"
          className="h-32 w-32 object-cover rounded border border-gold/20"
        />
      )}

      {!imgUrl ? (
        <label className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gold/40 rounded cursor-pointer hover:border-gold/70">
          <input type="file" accept="image/*" onChange={onFile} className="hidden" />
          <span>{currentUrl ? 'Reemplazar imagen' : 'Subir imagen'}</span>
        </label>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-cream-muted">
            Arrastre el cuadro para posicionar el recorte. Ajuste el tamaño con el control.
          </p>
          <div
            ref={containerRef}
            className="relative inline-block max-w-full overflow-hidden border border-gold/30 rounded"
          >
            <img
              ref={imgRef}
              src={imgUrl}
              alt="Preview"
              onLoad={onImgLoad}
              className="block max-w-full max-h-[60vh]"
              draggable={false}
            />
            {crop && imgSize && (
              <div
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                className="absolute cursor-move border-2 border-gold shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] touch-none"
                style={{
                  left: crop.x * s,
                  top: crop.y * s,
                  width: crop.size * s,
                  height: crop.size * s,
                }}
              />
            )}
          </div>
          {crop && imgSize && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-cream-muted whitespace-nowrap">Tamaño</span>
              <input
                type="range"
                min={80}
                max={Math.min(imgSize.w, imgSize.h)}
                value={crop.size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="flex-1 accent-gold"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => void upload()} disabled={uploading}>
              {uploading ? 'Subiendo…' : 'Guardar recorte'}
            </Button>
            <Button type="button" variant="ghost" onClick={reset}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-wine">{error}</p>}
    </div>
  );
}
