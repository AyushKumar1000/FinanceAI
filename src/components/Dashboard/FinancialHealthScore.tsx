import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Shield, Wallet, Target } from 'lucide-react';
import Card from '../UI/Card';
import ProgressBar from '../UI/ProgressBar';
import { FinancialHealth } from '../../types';

interface FinancialHealthScoreProps {
  health: FinancialHealth;
}

const FinancialHealthScore: React.FC<FinancialHealthScoreProps> = ({ health }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Needs Improvement';
    return 'Critical';
  };

  const factors = [
    {
      key: 'emergencyFund',
      label: 'Emergency Fund',
      icon: Shield,
      value: health.factors.emergencyFund,
      description: 'Protection against unexpected expenses'
    },
    {
      key: 'debtRatio',
      label: 'Debt Management',
      icon: TrendingUp,
      value: health.factors.debtRatio,
      description: 'Debt-to-income ratio health'
    },
    {
      key: 'savingsRate',
      label: 'Savings Rate',
      icon: Wallet,
      value: health.factors.savingsRate,
      description: 'Percentage of income saved'
    },
    {
      key: 'budgetAdherence',
      label: 'Budget Control',
      icon: Target,
      value: health.factors.budgetAdherence,
      description: 'How well you stick to budgets'
    },
    {
      key: 'incomeStability',
      label: 'Income Stability',
      icon: Activity,
      value: health.factors.incomeStability,
      description: 'Consistency of income streams'
    }
  ];

  return (
    <Card glow className="col-span-1 md:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-green-400">Financial Health Score</h3>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getScoreColor(health.score)}`}>
            {health.score}/100
          </div>
          <div className="text-sm text-gray-400">
            {getScoreDescription(health.score)}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <ProgressBar 
          progress={health.score} 
          color={health.score >= 70 ? 'green' : health.score >= 50 ? 'yellow' : 'red'}
          showPercentage={false}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {factors.map(({ key, label, icon: Icon, value, description }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-lg p-4 border border-green-500/10"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-gray-300">{label}</span>
              </div>
              <span className={`text-sm font-bold ${getScoreColor(value)}`}>
                {Math.round(value)}%
              </span>
            </div>
            <div className="mb-2">
              <ProgressBar 
                progress={value} 
                color={value >= 70 ? 'green' : value >= 50 ? 'yellow' : 'red'}
                showPercentage={false}
              />
            </div>
            <p className="text-xs text-gray-500">{description}</p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default FinancialHealthScore;