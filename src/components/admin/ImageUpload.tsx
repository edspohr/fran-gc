import { useState, type ChangeEvent } from 'react';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';

interface Props {
  slug: string;
  currentUrl?: string;
  currentPath?: string;
  onUploaded: (url: string, path: string) => void;
}

export default function ImageUpload({ slug, currentUrl, currentPath, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo excede los 5 MB permitidos.');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const path = `products/${slug}.${ext}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file, {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000, immutable',
      });
      const url = await getDownloadURL(storageRef);
      if (currentPath && currentPath !== path) {
        try {
          await deleteObject(ref(storage, currentPath));
        } catch {
          // ignore missing prior file
        }
      }
      onUploaded(url, path);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {currentUrl && (
        <img
          src={currentUrl}
          alt="Preview"
          className="h-32 w-32 object-cover rounded border border-gold/20"
        />
      )}
      <label className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gold/40 rounded cursor-pointer hover:border-gold/70">
        <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
        <span>{uploading ? 'Subiendo…' : currentUrl ? 'Reemplazar imagen' : 'Subir imagen'}</span>
      </label>
      {error && <p className="text-xs text-wine">{error}</p>}
    </div>
  );
}
