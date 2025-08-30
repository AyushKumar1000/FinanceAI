import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button'
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400/50';
  
  const variants = {
    primary: 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-black shadow-lg hover:shadow-green-500/25',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-green-400 border border-green-500/30 hover:border-green-400/50',
    outline: 'border-2 border-green-500 text-green-400 hover:bg-green-500/10 hover:border-green-400',
    ghost: 'text-green-400 hover:bg-green-500/10'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

export default Button;