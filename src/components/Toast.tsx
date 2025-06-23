import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icon = type === 'success' ? CheckCircle : AlertCircle;
  const bgColor = type === 'success' ? 'bg-success' : 'bg-error';
  const Icon = icon;

  return (
    <div className={`
      fixed top-4 right-4 z-50 p-4 ${bgColor} text-white border-2 border-black
      shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-slide-in
      max-w-md flex items-center
    `}>
      <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
      <p className="font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="ml-3 hover:opacity-75 transition-opacity"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast;