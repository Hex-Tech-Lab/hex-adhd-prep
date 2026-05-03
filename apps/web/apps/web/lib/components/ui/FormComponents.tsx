'use client';

import React from 'react';
import clsx from 'clsx';

export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={clsx('pb-6 border-b border-gray-200', className)}>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
      {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
      {children}
    </div>
  );
}

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helpText?: string;
}

export function TextArea({ label, error, helpText, className, ...props }: TextAreaProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        className={clsx(
          'w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
    </div>
  );
}

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export function RadioGroup({ label, options, value, onChange, error, required }: RadioGroupProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export interface CheckboxOption {
  value: string;
  label: string;
}

export interface CheckboxGroupProps {
  label: string;
  options: CheckboxOption[];
  value: string[];
  onChange: (values: string[]) => void;
  error?: string;
}

export function CheckboxGroup({ label, options, value, onChange, error }: CheckboxGroupProps) {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-900">{label}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              value={option.value}
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(e.target.value, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function SubmitButton({ loading, disabled, variant = 'primary', children, ...props }: SubmitButtonProps) {
  const baseStyles = 'w-full py-3 px-4 rounded-md font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100',
  };

  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${disabled || loading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
      {...props}
    >
      {loading ? 'Submitting...' : children}
    </button>
  );
}
