import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Shield
} from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import ProgressBar from '../UI/ProgressBar';
import { Goal } from '../../types';
import { format, differenceInDays } from 'date-fns';

interface GoalCardProps {
  goal: Goal;
  onUpdateProgress: (goalId: string, amount: number) => void;
  onDelete?: (goalId: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdateProgress, onDelete }) => {
  const [showAddProgress, setShowAddProgress] = useState(false);
  const [progressAmount, setProgressAmount] = useState('');

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const daysLeft = differenceInDays(new Date(goal.deadline), new Date());
  const isCompleted = progress >= 100;
  const isOverdue = daysLeft < 0 && !isCompleted;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency': return Shield;
      case 'savings': return DollarSign;
      case 'debt': return TrendingUp;
      case 'investment': return Target;
      default: return Target;
    }
  };

  const CategoryIcon = getCategoryIcon(goal.category);

  const handleAddProgress = () => {
    if (progressAmount && parseFloat(progressAmount) > 0) {
      onUpdateProgress(goal.id, parseFloat(progressAmount));
      setProgressAmount('');
      setShowAddProgress(false);
    }
  };

  const dailySavingsNeeded = daysLeft > 0 ? remaining / daysLeft : 0;

  return (
    <Card className={`${isCompleted ? 'border-green-500/50 bg-green-500/5' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${
            isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
          }`}>
            {isCompleted ? <CheckCircle className="h-5 w-5" /> : <CategoryIcon className="h-5 w-5" />}
          </div>
          <div>
            <h3 className={`font-bold ${isCompleted ? 'text-green-400' : 'text-white'}`}>
              {goal.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(goal.priority)}`}>
                {goal.priority} priority
              </span>
              <span className="text-xs text-gray-400 capitalize">
                {goal.category}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddProgress(!showAddProgress)}
            className="text-gray-400 hover:text-green-400 transition-colors"
            disabled={isCompleted}
          >
            <Plus className="h-4 w-4" />
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(goal.id)}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-medium text-white">
            ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
          </span>
        </div>
        <ProgressBar 
          progress={progress}
          color={isCompleted ? 'green' : progress >= 75 ? 'green' : progress >= 50 ? 'yellow' : 'red'}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-800/30 rounded-lg">
          <p className="text-lg font-bold text-white">${remaining.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Remaining</p>
        </div>
        <div className="text-center p-3 bg-gray-800/30 rounded-lg">
          <p className={`text-lg font-bold ${isOverdue ? 'text-red-400' : 'text-white'}`}>
            {Math.abs(daysLeft)} days
          </p>
          <p className="text-xs text-gray-400">
            {isOverdue ? 'Overdue' : 'Remaining'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4" />
          <span>Due: {format(new Date(goal.deadline), 'MMM dd, yyyy')}</span>
        </div>
        {!isCompleted && daysLeft > 0 && (
          <span className="text-green-400">
            ${dailySavingsNeeded.toFixed(2)}/day needed
          </span>
        )}
      </div>

      {showAddProgress && !isCompleted && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-green-500/20 pt-4"
        >
          <div className="flex space-x-2">
            <input
              type="number"
              step="0.01"
              value={progressAmount}
              onChange={(e) => setProgressAmount(e.target.value)}
              placeholder="Amount to add"
              className="flex-1 px-3 py-2 bg-gray-800 border border-green-500/30 rounded-lg text-white text-sm focus:border-green-400 focus:outline-none"
            />
            <Button size="sm" onClick={handleAddProgress}>
              Add
            </Button>
          </div>
        </motion.div>
      )}

      {isCompleted && (
        <div className="border-t border-green-500/20 pt-4">
          <div className="flex items-center justify-center space-x-2 text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Goal Completed!</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default GoalCard;