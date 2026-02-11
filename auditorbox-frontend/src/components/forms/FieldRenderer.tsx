import React from 'react';
import {
  DollarSign,
  Calendar,
  ToggleLeft,
  ToggleRight,
  FileText,
  Signature,
  Link as LinkIcon,
  CheckSquare,
  Info,
  Lock
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface FieldProps {
  field: {
    name: string;
    type: string;
    section: string;
    validation: {
      format?: string;
      min?: number;
      max?: number;
      required: boolean;
    };
    access: {
      preparer: string;
      reviewer: string;
      partner: string;
    };
  };
  value: any;
  onChange: (value: any) => void;
  role?: 'preparer' | 'reviewer' | 'partner';
  hideLabel?: boolean;
}

const isDisabled = (field: FieldProps['field'], role: FieldProps['role']) => {
  if (!field.access || !role) return false;
  // Metadata fields should always be editable since there's no backend auto-populating them
  if (field.type === 'metadata') return false;
  const accessLevel = field.access[role];
  return accessLevel === 'view' || accessLevel === 'read-only';
};

const getValidationMessage = (field: FieldProps['field'], value: any) => {
  if (!field.validation) return null;
  const { required, min, max } = field.validation;

  // Check required
  if (required && (value === undefined || value === null || value === '')) {
    return 'This field is required';
  }

  // Check min/max for numeric types
  if (value !== undefined && value !== '' && !isNaN(Number(value))) {
    const numValue = Number(value);
    if (min !== undefined && numValue < min) {
      return `Value must be at least ${min}`;
    }
    if (max !== undefined && numValue > max) {
      return `Value must be at most ${max}`;
    }
  }

  return null;
};

export const FieldRenderer: React.FC<FieldProps> = ({ field, value, onChange, role = 'preparer', hideLabel = false }) => {
  const [localValue, setLocalValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const disabled = isDisabled(field, role);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Validate on change
  useEffect(() => {
    setError(getValidationMessage(field, localValue));
  }, [localValue, field]);

  const handleValueChange = (newValue: any) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  const renderInput = () => {
    const baseClasses = "w-full bg-slate-900 border border-slate-700 rounded-sm text-sm text-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-inflo-blue focus:border-inflo-blue transition-all shadow-sm placeholder-slate-600";
    const errorClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";
    const disabledClasses = disabled ? "bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700" : "";
    const inputClasses = `${baseClasses} ${errorClasses} ${disabledClasses}`;

    switch (field.type) {
      case 'currency':
        return (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="text"
              value={localValue}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={disabled}
              className={`${inputClasses} pl-9 font-mono text-right`}
              placeholder="0.00"
              step="0.01"
            />
          </div>
        );

      case 'text':
        return (
          <input
            type="text"
            value={localValue || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={disabled}
            className={inputClasses}
            placeholder="Type here..."
          />
        );

      case 'text_long':
        return (
          <textarea
            rows={3}
            value={localValue || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={disabled}
            className={`${inputClasses} resize-none`}
            placeholder="Enter full details here..."
          />
        );

      case 'date':
        return (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="date"
              value={localValue || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={disabled}
              className={`${inputClasses} pl-9`}
            />
          </div>
        );

      case 'boolean':
        return (
          <button
            type="button"
            onClick={() => !disabled && handleValueChange(!localValue)}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-inflo-blue focus:ring-offset-2 focus:ring-offset-slate-900 ${localValue ? 'bg-emerald-600' : 'bg-slate-700'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`${localValue ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow`}
            />
          </button>
        );

      case 'integer':
        return (
          <input
            type="number"
            value={localValue ?? ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={disabled}
            className={inputClasses}
            step={1}
          />
        );

      case 'percentage':
        return (
          <div className="relative">
            <input
              type="number"
              value={localValue}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={disabled}
              className={`${inputClasses} pr-8 text-right`}
              min={0}
              max={100}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-slate-500 text-xs">%</span>
            </div>
          </div>
        );

      case 'dropdown':
        const options = field.validation.format?.split(',').map(opt => opt.trim()) || [];
        return (
          <div className="relative">
            <select
              value={localValue || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={disabled}
              className={`${inputClasses} appearance-none pr-8 bg-slate-900`}
            >
              <option value="" disabled>Select an option</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="material-icons text-slate-500 text-sm">expand_more</span>
            </div>
          </div>
        );

      case 'signature':
        return (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Signature className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="text"
              value={localValue || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={disabled}
              className={`${inputClasses} pl-9 italic font-serif text-slate-300`}
              placeholder="Sign electronically"
            />
          </div>
        );

      case 'reference':
        return (
          <a
            href={localValue || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-inflo-blue hover:text-blue-400 flex items-center gap-1 text-sm font-medium"
          >
            <LinkIcon className="h-3.5 w-3.5" />
            {localValue || 'No reference'}
          </a>
        );

      case 'metadata':
        return (
          <input
            type="text"
            value={localValue || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={disabled}
            className={`${inputClasses} bg-slate-800 text-slate-400`}
            placeholder="Metadata value"
          />
        );

      case 'account_code':
        return (
          <input
            type="text"
            value={localValue || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={disabled}
            className={`${inputClasses} font-mono`}
            placeholder="XXXX-XX"
          />
        );

      case 'procedure_step':
        return null;

      default:
        return (
          <input
            type="text"
            value={localValue || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={disabled}
            className={inputClasses}
          />
        );
    }
  };

  if (hideLabel) {
    return (
      <div className="w-full">
        {renderInput()}
        {error && (
          <div className="flex items-center gap-1 mt-1 text-red-400 text-[10px] font-medium animate-pulse">
            <Info className="h-3 w-3" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          {field.name}
          {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {disabled && (
          <Lock className="h-3 w-3 text-slate-500" />
        )}
      </div>
      {renderInput()}
      {error && (
        <div className="flex items-center gap-1 mt-1 text-red-500 text-[10px] font-medium animate-pulse">
          <Info className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
