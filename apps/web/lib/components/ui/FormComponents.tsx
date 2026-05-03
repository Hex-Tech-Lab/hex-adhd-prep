import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup as ShadcnRadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, children, className = '' }: FormSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

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
  const inputId = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={inputId}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <ShadcnInput
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

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
  const inputId = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={inputId}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
    </div>
  );
}

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
  const groupId = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`space-y-3 ${className}`}>
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <ShadcnRadioGroup value={value} onValueChange={onChange}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${groupId}-${option.value}`} />
            <Label htmlFor={`${groupId}-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </ShadcnRadioGroup>
    </div>
  );
}

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
    <Button
      type="submit"
      disabled={disabled || loading}
      className={className}
    >
      {loading ? 'Submitting...' : children}
    </Button>
  );
}