'use client';

import { useState } from 'react';

export default function SentryExamplePage() {
  const [triggered, setTriggered] = useState(false);

  const triggerError = () => {
    setTriggered(true);
    throw new Error('This is a test error from Sentry example page');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Sentry Example Page</h1>
      <p className="text-gray-600 mb-6">This page is used to test Sentry error reporting.</p>
      <button
        onClick={triggerError}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Trigger Test Error
      </button>
      {triggered && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded text-red-800">
          Error triggered! Check your Sentry dashboard for the error report.
        </div>
      )}
    </div>
  );
}