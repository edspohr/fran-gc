import { useState } from 'react';

interface ProductImageProps {
  src?: string;
  alt: string;
  name: string;
  className?: string;
}

export default function ProductImage({ src, alt, name, className = '' }: ProductImageProps) {
  const [errored, setErrored] = useState(false);
  const showImage = src && !errored;

  return (
    <div
      className={`relative overflow-hidden bg-surface-1 aspect-square ${className}`}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setErrored(true)}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      ) : (
        <Placeholder name={name} />
      )}
    </div>
  );
}

function Placeholder({ name }: { name: string }) {
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-surface-1 to-surface-2 px-6 text-center">
      <span
        aria-hidden="true"
        className="absolute top-4 left-1/2 -translate-x-1/2 font-display uppercase text-[0.6rem] tracking-eyebrow text-gold/70"
      >
        Fran GC
      </span>
      <span className="block h-px w-10 bg-gold/50 mb-3" aria-hidden="true" />
      <p className="font-serif text-cream text-xl leading-tight">{name}</p>
      <span className="block h-px w-10 bg-gold/50 mt-3" aria-hidden="true" />
    </div>
  );
}
