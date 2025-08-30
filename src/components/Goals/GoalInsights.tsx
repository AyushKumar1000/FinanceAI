import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import Card from '../UI/Card';
import { Goal, Transaction } from '../../types';
import { differenceInDays, format } from 'date-fns';

interface GoalInsightsProps {
  goals: Goal[];
  transactions: Transaction[];
}

const GoalInsights: React.FC<GoalInsightsProps> = ({ goals, transactions }) => {
  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const generateInsights = () => {
    const insights = [];

    // Goal completion timeline analysis
    const activeGoals = goals.filter(g => g.currentAmount < g.targetAmount);
    const totalRemaining = activeGoals.reduce((sum, g) => sum + (g.targetAmount - g.currentAmount), 0);
    
    if (activeGoals.length > 0 && monthlyIncome > 0) {
      const monthsNeeded = totalRemaining / (monthlyIncome * 0.2); // Assuming 20% savings rate
      insights.push({
        type: 'timeline',
        title: 'Goal Completion Timeline',
        message: `At a 20% savings rate, you'll complete all goals in ${monthsNeeded.toFixed(1)} months`,
        icon: Calendar,
        color: 'text-blue-400'
      });
    }

    // Priority recommendations
    const highPriorityGoals = goals.filter(g => g.priority === 'high' && g.currentAmount < g.targetAmount);
    if (highPriorityGoals.length > 1) {
      insights.push({
        type: 'priority',
        title: 'Focus Your Efforts',
        message: `You have ${highPriorityGoals.length} high-priority goals. Consider focusing on one at a time for faster progress.`,
        icon: Target,
        color: 'text-yellow-400'
      });
    }

    // Emergency fund check
    const emergencyGoal = goals.find(g => g.category === 'emergency');
    if (!emergencyGoal) {
      insights.push({
        type: 'emergency',
        title: 'Missing Emergency Fund',
        message: 'As a gig worker, an emergency fund should be your top priority. Start with $1,000.',
        icon: AlertTriangle,
        color: 'text-red-400'
      });
    } else if (emergencyGoal.currentAmount < monthlyIncome * 3) {
      insights.push({
        type: 'emergency',
        title: 'Boost Emergency Fund',
        message: 'Your emergency fund should cover 6 months of expenses. Consider increasing contributions.',
        icon: AlertTriangle,
        color: 'text-orange-400'
      });
    }

    // Overdue goals
    const overdueGoals = goals.filter(g => {
      const daysLeft = differenceInDays(new Date(g.deadline), new Date());
      return daysLeft < 0 && g.currentAmount < g.targetAmount;
    });

    if (overdueGoals.length > 0) {
      insights.push({
        type: 'overdue',
        title: 'Overdue Goals',
        message: `${overdueGoals.length} goal(s) are past their deadline. Consider extending deadlines or adjusting targets.`,
        icon: AlertTriangle,
        color: 'text-red-400'
      });
    }

    // Savings rate analysis
    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
    
    if (savingsRate < 10) {
      insights.push({
        type: 'savings',
        title: 'Low Savings Rate',
        message: `Your savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 20% to reach your goals faster.`,
        icon: TrendingUp,
        color: 'text-yellow-400'
      });
    } else if (savingsRate >= 20) {
      insights.push({
        type: 'savings',
        title: 'Excellent Savings Rate',
        message: `Your ${savingsRate.toFixed(1)}% savings rate is outstanding! You're on track to achieve your goals.`,
        icon: TrendingUp,
        color: 'text-green-400'
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <Card>
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="h-6 w-6 text-green-400" />
        <h3 className="text-xl font-bold text-green-400">Goal Insights</h3>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3 p-4 bg-gray-800/30 rounded-lg border border-green-500/10"
          >
            <div className="mt-0.5">
              <insight.icon className={`h-5 w-5 ${insight.color}`} />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
              <p className="text-sm text-gray-300">{insight.message}</p>
            </div>
          </motion.div>
        ))}

        {insights.length === 0 && (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              Add some goals to get personalized insights and recommendations
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default GoalInsights;