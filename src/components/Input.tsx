import React from 'react';

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
  error?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  error,
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-bold text-primary mb-2">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-4 py-3 border-2 border-black rounded-none font-medium
          focus:outline-none focus:ring-0 focus:border-accent
          ${error ? 'border-error bg-red-50' : 'bg-white'}
          shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        `}
      />
      {error && (
        <p className="mt-2 text-sm text-error font-medium">{error}</p>
      )}
    </div>
  );
};

export default Input;