// Simple card component
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  // Add any custom props here
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => {
    const baseStyles = 'rounded-lg border border-gray-200 bg-white shadow-sm';
    const combinedClassName = `${baseStyles} ${className}`;
    
    return (
      <div
        className={combinedClassName}
        ref={ref}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export { Card };
