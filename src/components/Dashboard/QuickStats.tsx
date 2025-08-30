import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank,
  AlertTriangle,
  Target
} from 'lucide-react';
import Card from '../UI/Card';
import { Transaction, Goal } from '../../types';

interface QuickStatsProps {
  transactions: Transaction[];
  goals: Goal[];
}

const QuickStats: React.FC<QuickStatsProps> = ({ transactions, goals }) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentTransactions = transactions.filter(
    t => new Date(t.date) >= thirtyDaysAgo
  );

  const monthlyIncome = recentTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = recentTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = monthlyIncome - monthlyExpenses;

  const totalSavings = goals
    .filter(g => g.category === 'savings' || g.category === 'emergency')
    .reduce((sum, g) => sum + g.currentAmount, 0);

  const activeGoals = goals.filter(g => g.currentAmount < g.targetAmount).length;

  const stats = [
    {
      title: 'Monthly Income',
      value: `$${monthlyIncome.toLocaleString()}`,
      icon: DollarSign,
      change: '+12%',
      positive: true,
      description: 'Last 30 days'
    },
    {
      title: 'Monthly Expenses',
      value: `$${monthlyExpenses.toLocaleString()}`,
      icon: TrendingDown,
      change: '-5%',
      positive: true,
      description: 'Reduced from last month'
    },
    {
      title: 'Net Income',
      value: `$${netIncome.toLocaleString()}`,
      icon: netIncome >= 0 ? TrendingUp : AlertTriangle,
      change: netIncome >= 0 ? '+' : '',
      positive: netIncome >= 0,
      description: 'Income - Expenses'
    },
    {
      title: 'Total Savings',
      value: `$${totalSavings.toLocaleString()}`,
      icon: PiggyBank,
      change: '+8%',
      positive: true,
      description: 'All savings goals'
    },
    {
      title: 'Active Goals',
      value: activeGoals.toString(),
      icon: Target,
      change: `${goals.length - activeGoals} completed`,
      positive: true,
      description: 'Goals in progress'
    }
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <stat.icon className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
              <div className="text-right">
                {stat.change && (
                  <div className={`text-sm font-medium ${
                    stat.positive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.change}
                  </div>
                )}
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </>
  );
};

export default QuickStats;