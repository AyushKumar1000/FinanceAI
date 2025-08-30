import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Trophy, Calendar, TrendingUp, Brain } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import GoalCard from '../components/Goals/GoalCard';
import GoalForm from '../components/Goals/GoalForm';
import GoalInsights from '../components/Goals/GoalInsights';
import { useFinancialData } from '../hooks/useFinancialData';

const Goals: React.FC = () => {
  const { goals, transactions, addGoal, updateGoalProgress } = useFinancialData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'emergency' | 'savings' | 'debt' | 'investment'>('all');

  console.log('Goals page data:', { goals, transactions });

  const filteredGoals = goals.filter(goal => 
    filterCategory === 'all' || goal.category === filterCategory
  );

  const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount);
  const activeGoals = goals.filter(g => g.currentAmount < g.targetAmount);
  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  const deleteGoal = (goalId: string) => {
    // In a real app, this would be implemented in the hook
    console.log('Delete goal:', goalId);
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent mb-2">
                Financial Goals
              </h1>
              <p className="text-gray-400">
                Track progress and achieve your financial milestones
              </p>
            </div>
            <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Goal</span>
            </Button>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Goals</p>
                  <p className="text-2xl font-bold text-white">{goals.length}</p>
                </div>
                <Target className="h-8 w-8 text-green-400" />
              </div>
            </Card>
            
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-green-400">{completedGoals.length}</p>
                </div>
                <Trophy className="h-8 w-8 text-green-400" />
              </div>
            </Card>
            
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Overall Progress</p>
                  <p className="text-2xl font-bold text-white">{overallProgress.toFixed(0)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </Card>
            
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Saved</p>
                  <p className="text-2xl font-bold text-green-400">${totalCurrentAmount.toLocaleString()}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-400" />
              </div>
            </Card>
          </div>

          {/* Category Filter */}
          <Card>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Goals' },
                { value: 'emergency', label: 'Emergency' },
                { value: 'savings', label: 'Savings' },
                { value: 'debt', label: 'Debt' },
                { value: 'investment', label: 'Investment' }
              ].map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setFilterCategory(filter.value as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterCategory === filter.value
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {goals.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Goals Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGoals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GoalCard
                      goal={goal}
                      onUpdateProgress={updateGoalProgress}
                      onDelete={deleteGoal}
                    />
                  </motion.div>
                ))}
              </div>

              {filteredGoals.length === 0 && (
                <Card>
                  <div className="text-center py-12">
                    <Target className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">No goals in this category</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Try selecting a different category or create a new goal
                    </p>
                    <Button onClick={() => setShowAddForm(true)}>
                      Create New Goal
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Insights Sidebar */}
            <div>
              <GoalInsights goals={goals} transactions={transactions} />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="p-6 bg-green-500/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Target className="h-12 w-12 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Set Your Financial Goals
              </h2>
              <p className="text-gray-400 mb-8">
                Define clear financial targets and let our AI coach help you achieve them. 
                Whether it's building an emergency fund or saving for a major purchase, we'll guide you every step of the way.
              </p>
              <div className="space-y-4">
                <Button onClick={() => setShowAddForm(true)} size="lg" className="w-full">
                  Create Your First Goal
                </Button>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <Trophy className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300 font-medium">Track Progress</p>
                    <p className="text-xs text-gray-500">Visual progress tracking</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <Brain className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300 font-medium">AI Guidance</p>
                    <p className="text-xs text-gray-500">Personalized recommendations</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {showAddForm && (
            <GoalForm
              onAdd={addGoal}
              onClose={() => setShowAddForm(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Goals;