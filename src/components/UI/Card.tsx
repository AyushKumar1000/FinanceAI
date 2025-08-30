import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  glow = false 
}) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      className={`
        bg-gray-900/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6
        ${glow ? 'shadow-lg shadow-green-500/10' : ''}
        ${hover ? 'hover:border-green-500/40 hover:shadow-green-500/20' : ''}
        transition-all duration-300 ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;