import { useEffect } from 'react';

interface Props {
  id?: string;
  data: Record<string, unknown>;
}

export default function JsonLd({ id = 'jsonld', data }: Props) {
  useEffect(() => {
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
    return () => {
      el?.remove();
    };
  }, [id, data]);

  return null;
}
