import React from 'react';
import { motion } from 'framer-motion';
import FinancialHealthScore from '../components/Dashboard/FinancialHealthScore';
import QuickStats from '../components/Dashboard/QuickStats';
import AIInsights from '../components/Dashboard/AIInsights';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import { useFinancialData } from '../hooks/useFinancialData';

const Dashboard: React.FC = () => {
  const { 
    transactions, 
    budgets,
    goals, 
    insights, 
    financialHealth,
    dismissInsight,
    loading 
  } = useFinancialData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-green-400">Loading your financial data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent mb-2">
            Financial Dashboard
          </h1>
          <p className="text-gray-400">
            Your AI-powered financial overview and insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <QuickStats transactions={transactions} goals={goals} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {financialHealth && (
            <FinancialHealthScore health={financialHealth} />
          )}
          <RecentTransactions transactions={transactions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <AIInsights 
            insights={insights} 
            onDismiss={dismissInsight}
            transactions={transactions}
            budgets={budgets}
            goals={goals}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;