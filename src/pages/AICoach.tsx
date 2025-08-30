import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, MessageSquare, BarChart3, Lightbulb, Target, Shield, X, TrendingUp } from 'lucide-react';
import Card from '../components/UI/Card';
import CoachingDashboard from '../components/AICoach/CoachingDashboard';
import FinancialAnalysis from '../components/AICoach/FinancialAnalysis';
import { useFinancialData } from '../hooks/useFinancialData';
import { getInsightIcon, getInsightColor } from '../utils/insights';

const AICoach: React.FC = () => {
  const { 
    transactions, 
    budgets, 
    goals, 
    insights, 
    financialHealth,
    dismissInsight 
  } = useFinancialData();
  
  const [activeTab, setActiveTab] = useState<'chat' | 'analysis' | 'insights'>('chat');

  const tabs = [
    { id: 'chat', label: 'AI Coach Chat', icon: MessageSquare },
    { id: 'analysis', label: 'Financial Analysis', icon: BarChart3 },
    { id: 'insights', label: 'All Insights', icon: Lightbulb }
  ];

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-full">
              <Brain className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent">
                AI Financial Coach
              </h1>
              <p className="text-gray-400">
                Your personal AI assistant for smarter financial decisions
              </p>
            </div>
          </div>

          {/* Health Score Summary */}
          {financialHealth && (
            <Card className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      financialHealth.score >= 80 ? 'text-green-400' :
                      financialHealth.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {financialHealth.score}
                    </div>
                    <p className="text-sm text-gray-400">Health Score</p>
                  </div>
                  <div className="h-12 w-px bg-green-500/30" />
                  <div>
                    <p className="text-white font-medium">
                      {financialHealth.score >= 80 ? 'Excellent financial health!' :
                       financialHealth.score >= 60 ? 'Good progress, keep it up!' :
                       'Let\'s work together to improve your finances'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {insights.length} active insights • {goals.filter(g => g.currentAmount < g.targetAmount).length} goals in progress
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-400">{goals.filter(g => g.currentAmount >= g.targetAmount).length}</p>
                    <p className="text-xs text-gray-400">Completed Goals</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Tab Navigation */}
          <Card>
            <div className="flex space-x-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'chat' && (
            <CoachingDashboard
              insights={insights}
              transactions={transactions}
              budgets={budgets}
              goals={goals}
              onDismissInsight={dismissInsight}
            />
          )}

          {activeTab === 'analysis' && (
            <FinancialAnalysis transactions={transactions} />
          )}

          {activeTab === 'insights' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-xl font-bold text-green-400 mb-6">All Insights</h3>
                <div className="space-y-4">
                  {insights.map((insight, index) => {
                    const Icon = getInsightIcon(insight.type);
                    return (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <Icon className="h-5 w-5 mt-0.5 text-current" />
                            <div>
                              <h4 className="font-semibold text-white mb-1">
                                {insight.title}
                              </h4>
                              <p className="text-sm text-gray-300">
                                {insight.message}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-xs text-gray-400">
                                  Priority: {insight.priority}/10
                                </span>
                                {insight.actionable && (
                                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                    Actionable
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => dismissInsight(insight.id)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}

                  {insights.length === 0 && (
                    <div className="text-center py-12">
                      <Lightbulb className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No insights available</p>
                      <p className="text-sm text-gray-500">
                        Add more transactions and goals to get personalized insights
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="text-xl font-bold text-green-400 mb-6">Coaching Tips</h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Variable Income Strategy',
                      tip: 'Use percentage-based budgeting instead of fixed amounts to handle income fluctuations',
                      icon: TrendingUp,
                      color: 'text-blue-400'
                    },
                    {
                      title: 'Emergency Fund Priority',
                      tip: 'As a gig worker, aim for 6 months of expenses in your emergency fund',
                      icon: Shield,
                      color: 'text-red-400'
                    },
                    {
                      title: 'Automate Savings',
                      tip: 'Set up automatic transfers on your highest income days',
                      icon: Target,
                      color: 'text-green-400'
                    },
                    {
                      title: 'Track Everything',
                      tip: 'Log all transactions immediately to maintain accurate financial picture',
                      icon: Brain,
                      color: 'text-purple-400'
                    }
                  ].map((tip, index) => (
                    <motion.div
                      key={tip.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-800/30 rounded-lg border border-green-500/10"
                    >
                      <div className="flex items-start space-x-3">
                        <tip.icon className={`h-5 w-5 mt-0.5 ${tip.color}`} />
                        <div>
                          <h4 className="font-medium text-white text-sm mb-1">
                            {tip.title}
                          </h4>
                          <p className="text-xs text-gray-300">
                            {tip.tip}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AICoach;