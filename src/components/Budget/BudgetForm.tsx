import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { Budget } from '../../types';

interface BudgetFormProps {
  onAdd: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  onClose: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    category: '',
    allocated: '',
    period: 'monthly' as 'weekly' | 'monthly',
    isFlexible: false
  });

  const categories = [
    'housing', 'food', 'transportation', 'utilities', 'healthcare',
    'entertainment', 'shopping', 'education', 'savings', 'debt', 'other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.allocated) return;

    onAdd({
      category: formData.category,
      allocated: parseFloat(formData.allocated),
      period: formData.period,
      isFlexible: formData.isFlexible
    });

    setFormData({
      category: '',
      allocated: '',
      period: 'monthly',
      isFlexible: false
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="w-full max-w-md"
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-green-400">Create Budget</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-800 border border-green-500/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
                required
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Budget Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.allocated}
                onChange={(e) => setFormData(prev => ({ ...prev, allocated: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-800 border border-green-500/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Budget Period
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, period: 'weekly' }))}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                    formData.period === 'weekly'
                      ? 'border-green-500 bg-green-500/10 text-green-400'
                      : 'border-gray-600 text-gray-300'
                  }`}
                >
                  Weekly
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, period: 'monthly' }))}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                    formData.period === 'monthly'
                      ? 'border-green-500 bg-green-500/10 text-green-400'
                      : 'border-gray-600 text-gray-300'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="flexible"
                checked={formData.isFlexible}
                onChange={(e) => setFormData(prev => ({ ...prev, isFlexible: e.target.checked }))}
                className="w-4 h-4 text-green-400 bg-gray-800 border-green-500/30 rounded focus:ring-green-400"
              />
              <label htmlFor="flexible" className="text-sm text-gray-300">
                Flexible budget (can exceed when needed)
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1">
                Create Budget
              </Button>
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default BudgetForm;