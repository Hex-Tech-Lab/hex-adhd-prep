'use client';

import React from 'react';
import clsx from 'clsx';

export interface ProgressIndicatorProps {
  current: number;
  total: number;
  label: string;
}

export function ProgressIndicator({ current, total, label }: ProgressIndicatorProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-700">
          Step {current} of {total}
        </h3>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
