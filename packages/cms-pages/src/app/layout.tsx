import Announcement from '@/ui/Announcement';
import '@/styles/app.css';
import type { Metadata } from 'next';
import { getBrand } from './actions';
import Header from '@/ui/header';
import Footer from '@/ui/footer';

export const metadata: Metadata = {
  icons: {
    icon: 'https://fav.farm/🖤',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const selectedBrand = await getBrand();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased bg-canvas text-ink font-typography-body font-typography-body-weight">
        <Header />
        <Announcement brand={selectedBrand} />
        <div className="bg-colour-primary min-h-[100px] flex items-center justify-center">
          <p className="text-colour-onPrimary">
            Verify branding colours using colour-primary and colour-onPrimary colour tokens
          </p>
        </div>
        <main id="main-content banana" tabIndex={-1} className="min-h-[50vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
