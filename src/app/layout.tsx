import type { Metadata } from 'next';
import { Inter, Outfit, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', display: 'swap' });

export const metadata: Metadata = {
  title: 'HomeHub | Modern Property Management Platform',
  description: 'Next-generation apartment & property management with digital payments, tenant messaging, and lease tracking.',
  icons: {
    icon: [
      { url: '/img/homehub-icon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/img/homehub-icon.png',
    apple: '/img/homehub-icon.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable} scroll-smooth`}>
      <body className="min-h-screen antialiased flex flex-col" style={{ background: '#f8fafc', color: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
