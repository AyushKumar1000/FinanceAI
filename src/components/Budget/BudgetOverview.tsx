import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../UI/Card';
import ProgressBar from '../UI/ProgressBar';
import { Budget } from '../../types';

interface BudgetOverviewProps {
  budgets: Budget[];
  totalIncome: number;
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({ budgets, totalIncome }) => {
  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remainingIncome = totalIncome - totalAllocated;

  const pieData = budgets.map((budget, index) => ({
    name: budget.category,
    value: budget.allocated,
    spent: budget.spent,
    color: `hsl(${120 + index * 40}, 70%, 50%)`
  }));

  const barData = budgets.map(budget => ({
    category: budget.category.charAt(0).toUpperCase() + budget.category.slice(1),
    allocated: budget.allocated,
    spent: budget.spent,
    remaining: Math.max(0, budget.allocated - budget.spent)
  }));

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.allocated) * 100;
    if (percentage >= 100) return { status: 'over', color: 'text-red-400', icon: AlertCircle };
    if (percentage >= 80) return { status: 'warning', color: 'text-yellow-400', icon: AlertCircle };
    return { status: 'good', color: 'text-green-400', icon: CheckCircle };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card glow>
        <h3 className="text-xl font-bold text-green-400 mb-6">Budget Allocation</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Allocated']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {pieData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-300 capitalize">{item.name}</span>
              </div>
              <span className="text-white font-medium">${item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-green-400 mb-6">Spending vs Budget</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis 
                dataKey="category" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
              />
              <Bar dataKey="allocated" fill="#10b981" name="Allocated" />
              <Bar dataKey="spent" fill="#ef4444" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <h3 className="text-xl font-bold text-green-400 mb-6">Budget Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((budget) => {
            const status = getBudgetStatus(budget);
            const percentage = (budget.spent / budget.allocated) * 100;
            const remaining = budget.allocated - budget.spent;
            
            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800/50 rounded-lg p-4 border border-green-500/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <status.icon className={`h-5 w-5 ${status.color}`} />
                    <span className="font-medium text-white capitalize">{budget.category}</span>
                  </div>
                  <span className="text-sm text-gray-400">{budget.period}</span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">
                      ${budget.spent.toLocaleString()} / ${budget.allocated.toLocaleString()}
                    </span>
                    <span className={status.color}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <ProgressBar 
                    progress={percentage}
                    color={percentage >= 100 ? 'red' : percentage >= 80 ? 'yellow' : 'green'}
                    showPercentage={false}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    {remaining >= 0 ? 'Remaining' : 'Over budget'}
                  </span>
                  <span className={`font-medium ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${Math.abs(remaining).toLocaleString()}
                  </span>
                </div>

                {budget.isFlexible && (
                  <div className="mt-2 text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                    Flexible Budget
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-400">${totalIncome.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Monthly Income</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">${totalAllocated.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total Budgeted</p>
            </div>
            <div>
              <p className={`text-2xl font-bold ${remainingIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${remainingIncome.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">Unallocated</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BudgetOverview;