import type { Metadata, ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'ADHD-Prep | Assessment & Preparation Tool',
  description: 'Comprehensive ADHD assessment platform to prepare for diagnostic interviews',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
        {children}
      </body>
    </html>
  );
}
