import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sentry Test Page',
  description: 'Test page to verify Sentry error reporting',
};

export default function SentryTestPage() {
  // Trigger an error to test Sentry
  // myUndefinedFunction(); // This would cause a ReferenceError

  // Instead, let's throw an error directly for testing
  // We'll do it in a useEffect to avoid breaking the page during render
  // But for simplicity in this test, we'll just throw on mount in a client component.

  // Since we are in a server component by default in Next.js app router, we need to make this a client component.
  // Let's change the approach: we'll create a client component that throws an error on click.
  // However, for the purpose of the Sentry wizard verification, we can just have a button that throws.

  // But note: the Sentry wizard expects a page at `/sentry-example-page` that has a button to trigger an error.
  // Let's follow that pattern.

  return (
    <div>
      <h1>Sentry Test Page</h1>
      <p>This page is used to test Sentry error reporting.</p>
      <button onClick={() => {
        throw new Error('This is a test error from Sentry test page');
      }}>
        Trigger Test Error
      </button>
    </div>
  );
}