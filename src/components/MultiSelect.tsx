import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label: string;
  selectedValues: string[];
  onChange: (values: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  selectedValues,
  onChange,
  options,
  placeholder = 'Select options',
  required = false,
  error,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const selectedLabels = options
    .filter(option => selectedValues.includes(option.value))
    .map(option => option.label);

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-bold text-primary mb-2">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-4 py-3 border-2 border-black rounded-none font-medium text-left
            focus:outline-none focus:ring-0 focus:border-accent
            ${error ? 'border-error bg-red-50' : 'bg-white'}
            shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
            flex items-center justify-between
          `}
        >
          <span className={selectedLabels.length ? 'text-primary' : 'text-gray-500'}>
            {selectedLabels.length ? selectedLabels.join(', ') : placeholder}
          </span>
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="max-h-48 overflow-y-auto">
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleToggle(option.value)}
                    className={`
                      w-full px-4 py-3 text-left flex items-center justify-between
                      hover:bg-gray-100 transition-colors border-b border-gray-200
                      ${isSelected ? 'bg-accent text-white hover:bg-blue-700' : ''}
                    `}
                  >
                    <span className="font-medium">{option.label}</span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-error font-medium">{error}</p>
      )}
    </div>
  );
};

export default MultiSelect;