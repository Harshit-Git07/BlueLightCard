import SkipToContent from '@/ui/SkipToContent';
import Announcement from '@/ui/Announcement';
import Header from '@/ui/header';
import Footer from '@/ui/footer';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity';
import '@/styles/app.css';
import type { Metadata } from 'next';
import { Open_Sans as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { getBrand } from './actions';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  icons: {
    icon: 'https://fav.farm/🖤',
  },
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const selectedBrand = await getBrand();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased bg-canvas text-ink',
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" themes={['blcUk', 'blcAu', 'dds']}>
          <SkipToContent />
          <Header brand={selectedBrand} />
          <Announcement brand={selectedBrand} />
          <main id="main-content banana" tabIndex={-1}>
            {children}
          </main>
          <Footer brand={selectedBrand} />
          {draftMode().isEnabled && <VisualEditing />}
        </ThemeProvider>
      </body>
    </html>
  );
}
