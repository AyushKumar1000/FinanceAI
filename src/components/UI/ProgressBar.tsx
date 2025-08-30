import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  color?: 'green' | 'yellow' | 'red';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '', 
  showPercentage = true,
  color = 'green'
}) => {
  const colors = {
    green: 'from-green-600 to-green-400',
    yellow: 'from-yellow-600 to-yellow-400',
    red: 'from-red-600 to-red-400'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        {showPercentage && (
          <span className="text-sm font-medium text-gray-300">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <motion.div
          className={`h-2.5 rounded-full bg-gradient-to-r ${colors[color]} shadow-sm`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;