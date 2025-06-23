import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`
      bg-white border-4 border-black rounded-none p-6
      shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
      ${className}
    `}>
      {title && (
        <h3 className="text-xl font-black text-primary mb-4 border-b-2 border-black pb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;