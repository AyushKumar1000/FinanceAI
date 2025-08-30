import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Target, Calendar, DollarSign, Flag } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { Goal } from '../../types';

interface GoalFormProps {
  onAdd: (goal: Omit<Goal, 'id'>) => void;
  onClose: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: 'savings' as 'emergency' | 'savings' | 'debt' | 'investment'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.targetAmount || !formData.deadline) return;

    onAdd({
      title: formData.title,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      deadline: new Date(formData.deadline),
      priority: formData.priority,
      category: formData.category
    });

    setFormData({
      title: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      priority: 'medium',
      category: 'savings'
    });
    onClose();
  };

  const goalTemplates = [
    { title: 'Emergency Fund', amount: 5000, category: 'emergency', priority: 'high' },
    { title: 'New Laptop', amount: 1500, category: 'savings', priority: 'medium' },
    { title: 'Pay Off Credit Card', amount: 3000, category: 'debt', priority: 'high' },
    { title: 'Investment Portfolio', amount: 10000, category: 'investment', priority: 'low' },
    { title: 'Vacation Fund', amount: 2000, category: 'savings', priority: 'low' },
    { title: 'Car Down Payment', amount: 5000, category: 'savings', priority: 'medium' }
  ];

  const applyTemplate = (template: typeof goalTemplates[0]) => {
    setFormData(prev => ({
      ...prev,
      title: template.title,
      targetAmount: template.amount.toString(),
      category: template.category as any,
      priority: template.priority as any
    }));
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
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-green-400">Create Financial Goal</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Templates */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Quick Templates</h3>
            <div className="grid grid-cols-2 gap-2">
              {goalTemplates.map((template, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => applyTemplate(template)}
                  className="text-left p-3 bg-gray-800/50 hover:bg-gray-800 border border-green-500/20 hover:border-green-500/40 rounded-lg transition-colors"
                >
                  <p className="text-sm font-medium text-white">{template.title}</p>
                  <p className="text-xs text-gray-400">${template.amount.toLocaleString()}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Goal Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-800 border border-green-500/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
                placeholder="e.g., Emergency Fund"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-green-500/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-green-500/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Date
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-800 border border-green-500/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'emergency', label: 'Emergency Fund', icon: '🛡️' },
                  { value: 'savings', label: 'Savings', icon: '💰' },
                  { value: 'debt', label: 'Debt Payment', icon: '📉' },
                  { value: 'investment', label: 'Investment', icon: '📈' }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: option.value as any }))}
                    className={`p-3 text-left border rounded-lg transition-colors ${
                      formData.category === option.value
                        ? 'border-green-500 bg-green-500/10 text-green-400'
                        : 'border-gray-600 text-gray-300 hover:border-green-500/50'
                    }`}
                  >
                    <div className="text-sm font-medium">{option.icon} {option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority Level
              </label>
              <div className="flex space-x-2">
                {[
                  { value: 'high', label: 'High', color: 'border-red-500 bg-red-500/10 text-red-400' },
                  { value: 'medium', label: 'Medium', color: 'border-yellow-500 bg-yellow-500/10 text-yellow-400' },
                  { value: 'low', label: 'Low', color: 'border-green-500 bg-green-500/10 text-green-400' }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority: option.value as any }))}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                      formData.priority === option.value
                        ? option.color
                        : 'border-gray-600 text-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1">
                Create Goal
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

export default GoalForm;