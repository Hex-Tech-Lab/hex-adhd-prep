import { Inter } from 'next/font/google';
import { Poppins } from 'next/font/google';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata = {
  title: 'ADHD-Prep | Assessment & Preparation Tool',
  description: 'Comprehensive ADHD assessment platform to prepare for diagnostic interviews',
  robots: 'index, follow',
};

export const viewport = 'width=device-width, initial-scale=1';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-warm-cream text-dark-gray">
        {children}
      </body>
    </html>
  );
}
