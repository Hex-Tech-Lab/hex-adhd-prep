'use client';

import { useEffect, useState } from 'react';

interface Metrics {
  interviewCompletions: number;
  averageResponseTime: number;
  errorRate: number;
  claudeApiUsage: number;
}

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<Metrics>({
    interviewCompletions: 0,
    averageResponseTime: 0,
    errorRate: 0,
    claudeApiUsage: 0,
  });

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, showing mock data
    const mockMetrics = {
      interviewCompletions: 42,
      averageResponseTime: 1.2,
      errorRate: 0.05,
      claudeApiUsage: 156,
    };

    setMetrics(mockMetrics);
    setLastUpdated(new Date());
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Monitoring Dashboard</h1>
        <p className="text-gray-600">
          Real-time metrics for the interview engine and Claude AI integration.
        </p>
        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Interview Completions</h3>
          <div className="text-3xl font-bold text-blue-600">{metrics.interviewCompletions}</div>
          <p className="text-sm text-gray-600 mt-1">Total completed interviews</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg Response Time</h3>
          <div className="text-3xl font-bold text-green-600">{metrics.averageResponseTime}s</div>
          <p className="text-sm text-gray-600 mt-1">Claude API response time</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Rate</h3>
          <div className="text-3xl font-bold text-red-600">{(metrics.errorRate * 100).toFixed(1)}%</div>
          <p className="text-sm text-gray-600 mt-1">API error percentage</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Claude API Usage</h3>
          <div className="text-3xl font-bold text-purple-600">{metrics.claudeApiUsage}</div>
          <p className="text-sm text-gray-600 mt-1">API calls this month</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium">Interview completed</p>
              <p className="text-sm text-gray-600">Assessment ID: abc-123</p>
            </div>
            <span className="text-sm text-green-600">2 minutes ago</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium">Follow-up question generated</p>
              <p className="text-sm text-gray-600">Claude API call successful</p>
            </div>
            <span className="text-sm text-blue-600">5 minutes ago</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium">Error: API timeout</p>
              <p className="text-sm text-gray-600">Fallback activated</p>
            </div>
            <span className="text-sm text-red-600">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}