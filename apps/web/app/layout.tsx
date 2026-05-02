import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ADHD-Prep | Prepare for your ADHD evaluation',
  description: 'Structured assessment preparation for ADHD diagnostic evaluation',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-gray-200">
            <nav className="max-w-7xl mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold">ADHD-Prep</h1>
            </nav>
          </header>
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
