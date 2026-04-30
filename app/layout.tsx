import type { Metadata } from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { OnyxRuntimeProvider } from '@/components/onyx/onyx-runtime';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600']
});

export const metadata: Metadata = {
  title: 'ONYX Paper Trader',
  description: 'ONYX autonomous paper trading research platform.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${plexMono.variable} font-sans antialiased`}>
        <OnyxRuntimeProvider>{children}</OnyxRuntimeProvider>
      </body>
    </html>
  );
}
