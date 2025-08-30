import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Shield, Zap, Loader2, RefreshCw } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { Transaction } from '../../types';
import { OpenAIService, OpenAIResponse } from '../../services/openaiService';

interface SmartBudgetSuggestionsProps {
  transactions: Transaction[];
  monthlyIncome: number;
  onApplySuggestion: (category: string, amount: number) => void;
}

const SmartBudgetSuggestions: React.FC<SmartBudgetSuggestionsProps> = ({ 
  transactions, 
  monthlyIncome,
  onApplySuggestion 
}) => {
  const [suggestions, setSuggestions] = useState<Array<{
    category: string;
    amount: number;
    reason: string;
    priority: string;
    icon: any;
    color: string;
    aiGenerated?: boolean;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<OpenAIResponse | null>(null);

  useEffect(() => {
    generateBasicSuggestions();
  }, [transactions, monthlyIncome]);

  const generateBasicSuggestions = () => {
    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const basicSuggestions = [];

    // Emergency fund suggestion
    if (monthlyIncome > 0) {
      const emergencyAmount = monthlyIncome * 0.2; // 20% for emergency fund
      basicSuggestions.push({
        category: 'Emergency Fund',
        amount: emergencyAmount,
        reason: 'Build financial security with 20% of income',
        priority: 'high',
        icon: Shield,
        color: 'text-red-400',
        aiGenerated: false
      });
    }

    // 50/30/20 rule suggestions
    if (monthlyIncome > 0) {
      basicSuggestions.push({
        category: 'Needs (Housing, Food, Utilities)',
        amount: monthlyIncome * 0.5,
        reason: 'Essential expenses should be 50% of income',
        priority: 'high',
        icon: Shield,
        color: 'text-green-400',
        aiGenerated: false
      });

      basicSuggestions.push({
        category: 'Wants (Entertainment, Shopping)',
        amount: monthlyIncome * 0.3,
        reason: 'Discretionary spending should be 30% of income',
        priority: 'medium',
        icon: Zap,
        color: 'text-yellow-400',
        aiGenerated: false
      });

      basicSuggestions.push({
        category: 'Savings & Investments',
        amount: monthlyIncome * 0.2,
        reason: 'Save 20% for future goals and investments',
        priority: 'high',
        icon: TrendingUp,
        color: 'text-blue-400',
        aiGenerated: false
      });
    }

    // Category-specific suggestions based on spending patterns
    Object.entries(monthlyExpenses).forEach(([category, amount]) => {
      const percentage = (amount / monthlyIncome) * 100;
      
      if (percentage > 15 && category !== 'housing') {
        basicSuggestions.push({
          category: `Reduce ${category}`,
          amount: amount * 0.8, // Suggest 20% reduction
          reason: `${category} spending is ${percentage.toFixed(0)}% of income - consider reducing`,
          priority: 'medium',
          icon: TrendingUp,
          color: 'text-orange-400',
          aiGenerated: false
        });
      }
    });

    setSuggestions(basicSuggestions.slice(0, 4));
  };

  const generateAISuggestions = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const aiResponse = await OpenAIService.getBudgetAdvice(transactions, [], monthlyIncome);
      setAiAdvice(aiResponse);
      
      // Add AI-generated suggestions
      if (aiResponse.suggestions && aiResponse.suggestions.length > 0) {
        const aiSuggestions = aiResponse.suggestions.slice(0, 2).map((suggestion, index) => ({
          category: `AI Suggestion ${index + 1}`,
          amount: monthlyIncome * 0.1, // Default 10% allocation
          reason: suggestion,
          priority: 'high',
          icon: Brain,
          color: 'text-purple-400',
          aiGenerated: true
        }));
        
        setSuggestions(prev => [...prev.slice(0, 2), ...aiSuggestions]);
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const allSuggestions = suggestions;

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-green-400" />
          <h3 className="text-xl font-bold text-green-400">Smart Budget Suggestions</h3>
        </div>
        <Button
          onClick={generateAISuggestions}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span>Get AI Advice</span>
        </Button>
      </div>

      <div className="space-y-4">
        {allSuggestions.map((suggestion, index) => (
          <motion.div
            key={`${suggestion.category}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${
              suggestion.aiGenerated 
                ? 'border-purple-500/30 bg-purple-500/10' 
                : 'border-gray-600 bg-gray-800/30'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  suggestion.aiGenerated 
                    ? 'bg-purple-500/20' 
                    : 'bg-gray-700'
                }`}>
                  <suggestion.icon className={`h-5 w-5 ${suggestion.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-white text-sm">
                      {suggestion.category}
                    </h4>
                    {suggestion.aiGenerated && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                        AI Generated
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mb-2">
                    {suggestion.reason}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-400 font-medium">
                      ${suggestion.amount.toFixed(0)}/month
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      suggestion.priority === 'high' 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {suggestion.priority} priority
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => onApplySuggestion(suggestion.category, suggestion.amount)}
                variant="outline"
                size="sm"
                className="ml-4"
              >
                Apply
              </Button>
            </div>
          </motion.div>
        ))}

        {aiAdvice && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border border-purple-500/30 bg-purple-500/10 rounded-lg"
          >
            <div className="flex items-start space-x-3">
              <Brain className="h-5 w-5 text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white text-sm mb-2">AI Financial Advice</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {aiAdvice.message}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {allSuggestions.length === 0 && (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No suggestions available</p>
            <p className="text-sm text-gray-500">
              Add more transactions to get personalized budget suggestions
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SmartBudgetSuggestions;