
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
import { LanguageProvider } from '@/contexts/language-context';
import { CartProvider } from '@/contexts/cart-context'; // Import CartProvider
import { Toaster } from '@/components/ui/toaster';
import AppHeader from '@/components/layout/app-header';
import AppFooter from '@/components/layout/app-footer';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AquaClean - Premium Detergents & Cleaning Agents',
  description: 'Discover a new standard of clean with AquaClean. High-quality detergents and cleaning solutions for your home.',
  manifest: '/manifest.json', // Added manifest link
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Inter font is loaded via next/font */}
        <meta name="theme-color" content="#49A6DA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AquaClean" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" /> 
      </head>
      <body className={`${inter.variable} font-body antialiased flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <AuthProvider>
            <LanguageProvider>
              <CartProvider> {/* Wrap with CartProvider */}
                <AppHeader />
                <main className="flex-grow container mx-auto px-4 py-10 md:py-12 animate-in fade-in-0 duration-300 ease-out">
                  {children}
                </main>
                <AppFooter />
                <Toaster />
              </CartProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
