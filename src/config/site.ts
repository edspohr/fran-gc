export const WHATSAPP_NUMBER = '56935913941';
export const WHATSAPP_DISPLAY = '+56 9 3591 3941';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export const SITE_URL = 'https://fran-gc.web.app';

export const LEGAL_NAME = 'FRAN GC SpA';
export const BRAND_NAME = 'FRAN GC';
export const BRAND_TAGLINE = 'Venta de Charcutería Fina';
export const BRAND_ROLE = 'Representante V Región';

export const COVERAGE = 'V Región de Valparaíso, Chile';

export const COMUNAS = [
  'Valparaíso',
  'Viña del Mar',
  'Concón',
  'Reñaca',
  'Quilpué',
  'Villa Alemana',
  'Casablanca',
  'Litoral central',
];

export const SUPPLIER_NAME = 'La Charcutería Artesanal';
export const SUPPLIER_ORIGIN = 'Barrio Franklin, Santiago';

export const NAV_PUBLIC = [
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/como-trabajamos', label: 'Cómo trabajamos' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
] as const;

export const PUBLIC_ROUTES = [
  '/',
  '/catalogo',
  '/como-trabajamos',
  '/nosotros',
  '/contacto',
  '/politica-de-privacidad',
  '/terminos',
] as const;

export const SEO_DEFAULTS = {
  title: 'FRAN GC · Charcutería fina para su negocio',
  description:
    'FRAN GC SpA — Representante exclusivo en la V Región de La Charcutería Artesanal. Distribución mayorista para HORECA y retail especializado en Valparaíso, Viña del Mar y toda la región.',
  ogImage: '/og-default.png',
} as const;
