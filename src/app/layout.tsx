import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'NexEngineer • Master Software Engineering',
  description:
    'A Portal for Software Engineers to Master Engineering. Visual DSA learning, system design studio, code challenges playground, and curated engineering reading logs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark antialiased" style={{ colorScheme: 'dark' }}>
      <body className="h-full bg-zinc-950 text-zinc-100 flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
