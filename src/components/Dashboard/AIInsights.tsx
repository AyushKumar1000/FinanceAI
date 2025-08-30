import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Lightbulb, TrendingUp, AlertTriangle, Trophy, Loader2, RefreshCw, X } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { AIInsight, Transaction, Budget, Goal } from '../../types';
import { getInsightIcon, getInsightColor } from '../../utils/insights';
import { OpenAIService } from '../../services/openaiService';

interface AIInsightsProps {
  insights: AIInsight[];
  onDismiss: (id: string) => void;
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ insights, onDismiss, transactions, budgets, goals }) => {
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  const generateAIInsights = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      // Generate multiple types of insights
      const [spendingAnalysis, goalAdvice, budgetAdvice] = await Promise.all([
        OpenAIService.analyzeSpending(transactions),
        OpenAIService.getGoalAdvice(goals, calculateMonthlyIncome()),
        OpenAIService.getBudgetAdvice(transactions, budgets, calculateMonthlyIncome())
      ]);

      const newInsights: AIInsight[] = [];

      // Add spending analysis insights
      if (spendingAnalysis.insights && spendingAnalysis.insights.length > 0) {
        spendingAnalysis.insights.forEach((insight, index) => {
          newInsights.push({
            id: `ai-spending-${Date.now()}-${index}`,
            type: 'tip',
            title: 'Spending Analysis',
            message: insight,
            actionable: true,
            priority: 7,
            createdAt: new Date()
          });
        });
      }

      // Add goal advice insights
      if (goalAdvice.insights && goalAdvice.insights.length > 0) {
        goalAdvice.insights.forEach((insight, index) => {
          newInsights.push({
            id: `ai-goal-${Date.now()}-${index}`,
            type: 'recommendation',
            title: 'Goal Planning',
            message: insight,
            actionable: true,
            priority: 8,
            createdAt: new Date()
          });
        });
      }

      // Add budget advice insights
      if (budgetAdvice.insights && budgetAdvice.insights.length > 0) {
        budgetAdvice.insights.forEach((insight, index) => {
          newInsights.push({
            id: `ai-budget-${Date.now()}-${index}`,
            type: 'tip',
            title: 'Budget Optimization',
            message: insight,
            actionable: true,
            priority: 6,
            createdAt: new Date()
          });
        });
      }

      setAiInsights(newInsights);
      setLastGenerated(new Date());
    } catch (error) {
      console.error('Error generating AI insights:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateMonthlyIncome = (): number => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return transactions
      .filter(t => t.type === 'income' && new Date(t.date) >= thirtyDaysAgo)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const allInsights = [...insights, ...aiInsights];
  const topInsights = allInsights.slice(0, 3);

  useEffect(() => {
    // Generate initial AI insights when component mounts
    if (transactions.length > 0 && !lastGenerated) {
      generateAIInsights();
    }
  }, [transactions, budgets, goals]);

  return (
    <Card className="col-span-1 md:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-green-400" />
          <h3 className="text-xl font-bold text-green-400">AI Coach Insights</h3>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-400">
            {allInsights.length} insights available
          </div>
          <Button
            onClick={generateAIInsights}
            variant="outline"
            size="sm"
            disabled={isGenerating}
            className="flex items-center space-x-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span>Generate AI Insights</span>
          </Button>
        </div>
      </div>

      {lastGenerated && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-400">
              Last AI insights generated: {lastGenerated.toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {topInsights.map((insight, index) => {
            const Icon = getInsightIcon(insight.type);
            const isAIGenerated = insight.id.includes('ai-');
            
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative border rounded-lg p-4 
                  ${getInsightColor(insight.type)}
                  ${isAIGenerated ? 'border-purple-500/30 bg-purple-500/5' : ''}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-white text-sm">
                          {insight.title}
                        </h4>
                        {isAIGenerated && (
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                            AI Generated
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300">
                        {insight.message}
                      </p>
                      {insight.actionable && (
                        <div className="mt-2">
                          <Button size="sm" variant="outline">
                            Take Action
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onDismiss(insight.id)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {allInsights.length === 0 && (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              Your AI coach is analyzing your financial data. Check back soon for personalized insights!
            </p>
          </div>
        )}

        {allInsights.length > 3 && (
          <div className="text-center pt-4 border-t border-green-500/20">
            <Button variant="ghost" size="sm">
              View All Insights ({allInsights.length - 3} more)
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AIInsights;