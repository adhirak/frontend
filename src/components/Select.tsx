import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required = false,
  error,
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-bold text-primary mb-2">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`
          w-full px-4 py-3 border-2 border-black rounded-none font-medium
          focus:outline-none focus:ring-0 focus:border-accent
          ${error ? 'border-error bg-red-50' : 'bg-white'}
          shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-2 text-sm text-error font-medium">{error}</p>
      )}
    </div>
  );
};

export default Select;