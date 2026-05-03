import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sentry Example Page',
  description: 'Example page to verify Sentry error reporting',
};

export default function SentryExamplePage() {
  return (
    <div>
      <h1>Sentry Example Page</h1>
      <p>This page is used to test Sentry error reporting.</p>
      <button onClick={() => {
        throw new Error('This is a test error from Sentry example page');
      }}>
        Trigger Test Error
      </button>
    </div>
  );
}