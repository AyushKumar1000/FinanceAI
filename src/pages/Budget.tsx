import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, PieChart, TrendingUp, Brain, Target } from 'lucide-react';
import Button from '../components/UI/Button';
import BudgetOverview from '../components/Budget/BudgetOverview';
import BudgetForm from '../components/Budget/BudgetForm';
import SmartBudgetSuggestions from '../components/Budget/SmartBudgetSuggestions';
import { useFinancialData } from '../hooks/useFinancialData';

const Budget: React.FC = () => {
  const { transactions, budgets, addBudget } = useFinancialData();
  const [showAddForm, setShowAddForm] = useState(false);

  console.log('Budget page data:', { transactions, budgets });

  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleApplySuggestion = (category: string, amount: number) => {
    // Convert suggestion to actual budget
    const budgetCategory = category.toLowerCase().includes('emergency') ? 'emergency' :
                          category.toLowerCase().includes('savings') ? 'savings' :
                          category.toLowerCase().includes('needs') ? 'housing' :
                          category.toLowerCase().includes('wants') ? 'entertainment' :
                          'other';

    addBudget({
      category: budgetCategory,
      allocated: amount,
      period: 'monthly',
      isFlexible: false
    });
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent mb-2">
                Smart Budget Manager
              </h1>
              <p className="text-gray-400">
                AI-powered budgeting that adapts to your variable income
              </p>
            </div>
            <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Budget</span>
            </Button>
          </div>
        </motion.div>

        {budgets.length > 0 ? (
          <>
            <BudgetOverview budgets={budgets} totalIncome={monthlyIncome} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SmartBudgetSuggestions 
                transactions={transactions}
                monthlyIncome={monthlyIncome}
                onApplySuggestion={handleApplySuggestion}
              />
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="p-6 bg-green-500/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <PieChart className="h-12 w-12 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Start Your Smart Budget
              </h2>
              <p className="text-gray-400 mb-8">
                Create budgets that automatically adapt to your variable income. 
                Our AI will help you optimize your spending and reach your financial goals faster.
              </p>
              <div className="space-y-4">
                <Button onClick={() => setShowAddForm(true)} size="lg" className="w-full">
                  Create Your First Budget
                </Button>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <Brain className="h-6 w-6 text-green-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">AI Suggestions</p>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Smart Tracking</p>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <Target className="h-6 w-6 text-green-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Goal Alignment</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {showAddForm && (
            <BudgetForm
              onAdd={addBudget}
              onClose={() => setShowAddForm(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Budget;