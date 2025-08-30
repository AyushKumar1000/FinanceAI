import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import Card from '../UI/Card';
import { Transaction } from '../../types';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface FinancialAnalysisProps {
  transactions: Transaction[];
}

const FinancialAnalysis: React.FC<FinancialAnalysisProps> = ({ transactions }) => {
  // Generate daily balance data for the last 30 days
  const generateDailyData = () => {
    const endDate = new Date();
    const startDate = subDays(endDate, 30);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map(day => {
      const dayTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.toDateString() === day.toDateString();
      });

      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        date: format(day, 'MMM dd'),
        income,
        expenses,
        net: income - expenses
      };
    });
  };

  // Generate spending by category data
  const generateCategoryData = () => {
    const categorySpending = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(categorySpending)
      .map(([category, amount]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount,
        percentage: (amount / Object.values(categorySpending).reduce((a, b) => a + b, 0)) * 100
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  // Calculate financial metrics
  const calculateMetrics = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const avgDailySpending = totalExpenses / 30;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Income volatility
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const avgIncome = incomeTransactions.length > 0 ? totalIncome / incomeTransactions.length : 0;
    const incomeVariance = incomeTransactions.reduce((acc, t) => acc + Math.pow(t.amount - avgIncome, 2), 0) / incomeTransactions.length;
    const incomeVolatility = Math.sqrt(incomeVariance) / avgIncome * 100;

    return {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      avgDailySpending,
      savingsRate,
      incomeVolatility: isNaN(incomeVolatility) ? 0 : incomeVolatility
    };
  };

  const dailyData = generateDailyData();
  const categoryData = generateCategoryData();
  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            title: 'Net Income',
            value: `$${metrics.netIncome.toLocaleString()}`,
            change: metrics.netIncome >= 0 ? '+' : '',
            positive: metrics.netIncome >= 0,
            icon: DollarSign
          },
          {
            title: 'Savings Rate',
            value: `${metrics.savingsRate.toFixed(1)}%`,
            change: metrics.savingsRate >= 20 ? 'Excellent' : metrics.savingsRate >= 10 ? 'Good' : 'Low',
            positive: metrics.savingsRate >= 10,
            icon: TrendingUp
          },
          {
            title: 'Daily Spending',
            value: `$${metrics.avgDailySpending.toFixed(0)}`,
            change: 'Average',
            positive: true,
            icon: PieChart
          },
          {
            title: 'Income Volatility',
            value: `${metrics.incomeVolatility.toFixed(1)}%`,
            change: metrics.incomeVolatility < 20 ? 'Stable' : metrics.incomeVolatility < 40 ? 'Moderate' : 'High',
            positive: metrics.incomeVolatility < 30,
            icon: TrendingDown
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{metric.title}</p>
                  <p className="text-xl font-bold text-white">{metric.value}</p>
                  <p className={`text-xs ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change}
                  </p>
                </div>
                <metric.icon className="h-8 w-8 text-green-400" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Income vs Expenses Chart */}
      <Card>
        <h3 className="text-xl font-bold text-green-400 mb-6">Income vs Expenses (30 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
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
              <Area
                type="monotone"
                dataKey="income"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stackId="2"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Spending Analysis */}
      <Card className="lg:col-span-2">
        <h3 className="text-xl font-bold text-green-400 mb-6">Spending Analysis</h3>
        <div className="space-y-4">
          {categoryData.slice(0, 6).map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-white font-medium">{category.category}</span>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">${category.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{category.percentage.toFixed(1)}%</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <h3 className="text-lg font-bold text-green-400 mb-4">Smart Recommendations</h3>
        <div className="space-y-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="font-medium text-blue-400 text-sm mb-1">Income Smoothing</h4>
            <p className="text-xs text-gray-300">
              Set aside 30% of high-income days for low-income periods
            </p>
          </div>
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <h4 className="font-medium text-green-400 text-sm mb-1">Expense Optimization</h4>
            <p className="text-xs text-gray-300">
              Your food spending is efficient. Consider meal prep to save more
            </p>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <h4 className="font-medium text-purple-400 text-sm mb-1">Goal Acceleration</h4>
            <p className="text-xs text-gray-300">
              Increase emergency fund contributions by $50/week
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinancialAnalysis;