import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import StickyWhatsApp from './StickyWhatsApp';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-ink text-cream">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <StickyWhatsApp />
    </div>
  );
}
