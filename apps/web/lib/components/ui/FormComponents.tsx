// src/components/ui/FormSection.tsx
import React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, children, className = '' }: FormSectionProps) {
  return (
    <div className={`mb-8 pb-6 border-b border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

// src/components/ui/Input.tsx
interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  className?: string;
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  className = '',
}: InputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

// src/components/ui/TextArea.tsx
interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  className = '',
}: TextAreaProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
      />
    </div>
  );
}

// src/components/ui/RadioGroup.tsx
interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export function RadioGroup({
  label,
  options,
  value,
  onChange,
  required = false,
  className = '',
}: RadioGroupProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center cursor-pointer">
            <input
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              required={required}
              className="mr-3 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-900">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// src/components/ui/SubmitButton.tsx
interface SubmitButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function SubmitButton({
  children,
  disabled = false,
  loading = false,
  className = '',
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {loading ? 'Submitting...' : children}
    </button>
  );
}