import Hero from '@/components/home/Hero';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import CategoryTiles from '@/components/home/CategoryTiles';
import HowWeWorkTeaser from '@/components/home/HowWeWorkTeaser';
import TrustCues from '@/components/home/TrustCues';
import { usePublicProducts } from '@/hooks/useProducts';
import { useSeo } from '@/lib/seo';

export default function Home() {
  const { products, loading } = usePublicProducts();
  useSeo({ path: '/' });

  return (
    <>
      <Hero />
      <FeaturedCarousel products={products} loading={loading} />
      <CategoryTiles />
      <HowWeWorkTeaser />
      <TrustCues />
    </>
  );
}
