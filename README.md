# FRAN GC — Sitio web y catálogo digital

Catálogo digital B2B de **FRAN GC SpA**, representante en la V Región de La Charcutería Artesanal. Este es un catálogo mayorista **sin precios en línea**; la conversión ocurre por WhatsApp.

**Producción:** https://fran-gc.web.app (dominio final: fran-gc.cl, pendiente de conectar)

- Vite + React + TypeScript (strict) + Tailwind CSS
- Firebase Hosting + Firestore (productos) + Auth (admin) + Storage (imágenes)
- Todo el contenido público está en español chileno (usted). Código, comentarios y commits en inglés.

---

## Requisitos

- **Node.js 20 o superior** (`.nvmrc` fija 22). Recomendado: `nvm use`.
- **Firebase CLI**: `npm install -g firebase-tools` (o `npx firebase`).
- **Java 11+** — sólo si va a correr los emuladores locales (`firebase emulators:start`). Instale desde https://adoptium.net.
- Una cuenta Google con permisos para crear proyectos de Firebase.

---

## Puesta en marcha rápida (desarrollo)

```bash
nvm use               # activa Node 22
npm install
cp .env.example .env.local   # complete VITE_FIREBASE_* después de crear el proyecto
npm run dev           # http://localhost:5173
```

Sin Firebase configurado, el sitio funciona en **modo preview**: `usePublicProducts` sirve los datos del `scripts/seed-data.ts` con las imágenes generadas en `public/preview-crops/`. Verá un aviso "[Preview]" en el catálogo y el admin.

---

## Configurar Firebase (una sola vez)

1. **Crear proyecto** en https://console.firebase.google.com.
   - ID sugerido: `fran-gc` (coincide con `.firebaserc`; si usa otro ID edítelo).
   - Región Firestore: `southamerica-west1` (Santiago), para menor latencia en Chile.
   - Active **plan Blaze** (necesario para Cloud Storage, uso dentro del free tier).

2. **Habilitar servicios**:
   - Authentication → Sign-in method → **Google** (habilitado). El acceso al admin se controla por allowlist de correos en `src/lib/admin.ts` (edite ahí para agregar/quitar admins).
   - Firestore Database → Create database → Producción.
   - Storage → Get started (mantenga las reglas por defecto; se sobrescribirán al desplegar).

3. **Registrar la web app** en Project Settings → Your apps → Add app (Web).
   - Copie el objeto `firebaseConfig` a `.env.local` (y luego a `.env.production`):
     ```
     VITE_FIREBASE_API_KEY=...
     VITE_FIREBASE_AUTH_DOMAIN=fran-gc.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=fran-gc
     VITE_FIREBASE_STORAGE_BUCKET=fran-gc.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=...
     VITE_FIREBASE_APP_ID=...
     ```

4. **Definir administradores**: edite `src/lib/admin.ts` (`ADMIN_EMAILS`) para incluir los correos Google autorizados. La lista también está espejada en `firestore.rules` y `storage.rules` (mantenga las tres sincronizadas).

5. **Login CLI**: `firebase login` (una sola vez).

6. **Vincular proyecto local**:
   ```bash
   firebase use fran-gc
   ```

7. **Cuenta de servicio para el seed**: Project Settings → Service accounts → Generate new private key. Guarde el JSON fuera del repo, por ejemplo en `~/.frangc-service-account.json`, y expórtelo antes de correr `npm run seed`:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=~/.frangc-service-account.json
   ```

---

## Scripts principales

| Comando | Qué hace |
|---|---|
| `npm run dev` | Vite dev server con HMR |
| `npm run build` | Build de producción (genera `sitemap.xml` en `prebuild`) |
| `npm run preview` | Sirve `dist/` para revisar el build antes de deploy |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm run lint` | ESLint |
| `npm run seed` | Upsert de los ~50 productos en Firestore real |
| `npm run seed:emu` | Igual, pero contra el emulador local |
| `npm run seed -- --purge` | Además borra docs cuyo slug no está en `seed-data.ts` |
| `npm run images:crop` | Extrae 31 imágenes desde `info-lacharcuteria/` a `scripts/generated-crops/` |
| `npm run images:upload` | Sube los crops a Storage y actualiza `imageUrl`/`imagePath` |
| `npm run images:upload:emu` | Igual, contra los emuladores |
| `npm run og` | Regenera `public/og-default.png` |
| `npm run emulate` | Levanta emuladores (Firestore, Auth, Storage) |

---

## Sembrar el catálogo por primera vez

```bash
# Con el proyecto Firebase real
export GOOGLE_APPLICATION_CREDENTIALS=~/.frangc-service-account.json
npm run seed
npm run images:crop
npm run images:upload
```

Idempotente: puede correr `npm run seed` cuantas veces quiera. `--purge` sólo si desea limpiar docs huérfanos.

Con emuladores:
```bash
npm run emulate       # terminal 1
npm run seed:emu      # terminal 2
npm run images:upload:emu   # opcional
VITE_USE_EMULATORS=1 npm run dev   # terminal 3
```

---

## Deploy a producción

```bash
# 1. Confirme .env.production con las credenciales de Firebase
# 2. Confirme SITE_URL en src/config/site.ts (por ahora https://fran-gc.web.app)

npm run build
firebase deploy --only hosting,firestore:rules,firestore:indexes,storage
```

Deploy incremental (solo hosting): `firebase deploy --only hosting`.

Verifique en https://fran-gc.web.app:
- Home carga y muestra 4 destacados (Guanciale, Coppa, Chorizo Español, Fuet Español).
- Catálogo filtra por categoría, tag y búsqueda.
- El carrito persiste al recargar (localStorage) y abre WhatsApp con la lista prellenada.
- `/admin` redirige a `/admin/login` sin sesión. Con las credenciales creadas en Firebase Console, entra al CRUD.
- Meta OG en Facebook Sharing Debugger y `robots.txt` + `sitemap.xml` accesibles en la raíz.

**Lighthouse mobile (Moto G4, Fast 3G):** objetivos ≥ 90 performance, ≥ 95 accesibilidad, ≥ 95 SEO. Corra con `npx lighthouse https://fran-gc.web.app --preset=mobile`.

---

## Conectar dominio propio `fran-gc.cl`

1. Firebase Hosting → Add custom domain → `fran-gc.cl` y `www.fran-gc.cl`.
2. Actualice los registros DNS según indique Firebase (TXT + A/CNAME).
3. Espere el certificado SSL (5–30 min).
4. En el repo:
   ```ts
   // src/config/site.ts
   export const SITE_URL = 'https://fran-gc.cl';
   ```
5. Regenere sitemap y actualice `public/robots.txt` (referencia al nuevo dominio):
   ```
   Sitemap: https://fran-gc.cl/sitemap.xml
   ```
6. `npm run build && firebase deploy --only hosting`.

---

## Estructura del código

```
src/
├── config/site.ts          Fuente única de URL, número de WhatsApp, cobertura
├── lib/                    firebase, products, cart, whatsapp, seo, analytics
├── contexts/               CartContext, AuthContext
├── hooks/                  useCart, useAuth, useProducts, useDebouncedValue
├── types/                  product.ts, cart.ts
├── components/
│   ├── layout/             Navbar, Footer, Layout, StickyWhatsApp
│   ├── ui/                 Button, Chip, Drawer, Modal, HairlineRule, Eyebrow, GrainOverlay
│   ├── catalog/            ProductCard, ProductGrid, ProductDetailModal, FiltersBar, ProductImage
│   ├── cart/               CartButton, CartDrawer, QuantityStepper
│   ├── home/               Hero, FeaturedCarousel, CategoryTiles, HowWeWorkTeaser, TrustCues
│   ├── seo/                JsonLd
│   └── admin/              AdminGate, AdminShell, ProductForm, ProductTable, ImageUpload
├── pages/                  Home, Catalog, HowWeWork, About, Contact, Privacy, Terms, NotFound
│   └── admin/              Login, Products
├── data/preview.ts         Fallback dev sin Firebase
└── styles/index.css        Tailwind layers + fonts
scripts/
├── seed.ts, seed-data.ts   Semilla de Firestore
├── crop-images.ts, image-crops.ts, upload-images.ts  Pipeline de imágenes
├── og-generate.ts          Genera public/og-default.png (una vez)
└── build-sitemap.ts        Genera public/sitemap.xml en prebuild
```

---

## Diseño

- **Paleta:** ink `#121212`, cream `#EDE5D6`, gold `#AE9A79`, wine `#813A38`.
- **Tipografía:** Playfair Display (títulos), Oswald (etiquetas display), Inter (UI/cuerpo). Google Fonts.
- Sitio **dark-first**. Los logotipos van sólo sobre fondos oscuros.

---

## Notas legales

- FRAN GC SpA es distribuidor mayorista; **no vende a consumidor final**.
- **Sin precios en línea**: se comunican por WhatsApp según volumen.
- Páginas `/politica-de-privacidad` y `/terminos` no son requeridas por ley (no se recogen datos personales del público), se incluyen para dar seriedad al canal HORECA.
