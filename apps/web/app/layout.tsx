import './globals.css';

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
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
        {children}
      </body>
    </html>
  );
}
