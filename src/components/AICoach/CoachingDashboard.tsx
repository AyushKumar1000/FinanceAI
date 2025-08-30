import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  Trophy,
  Target,
  Send,
  Mic,
  MicOff,
  X,
  Loader2,
  TestTube
} from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { AIInsight, Transaction, Budget, Goal } from '../../types';
import { getInsightIcon, getInsightColor } from '../../utils/insights';
import { OpenAIService } from '../../services/openaiService';
import { testOpenAIAPI } from '../../utils/apiTest';

interface CoachingDashboardProps {
  insights: AIInsight[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  onDismissInsight: (id: string) => void;
}

const CoachingDashboard: React.FC<CoachingDashboardProps> = ({ 
  insights, 
  transactions, 
  budgets, 
  goals,
  onDismissInsight 
}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    id: string;
    message: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    isLoading?: boolean;
  }>>([
    {
      id: '1',
      message: "Hello! I'm your AI financial coach powered by OpenAI. I've analyzed your financial data and I'm here to provide personalized advice. What would you like to know about your finances?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingAPI, setIsTestingAPI] = useState(false);

  const testAPI = async () => {
    setIsTestingAPI(true);
    try {
      console.log('🧪 Testing OpenAI API...');
      await testOpenAIAPI();
      
      // Add test result to chat
      setChatHistory(prev => [...prev, {
        id: Date.now().toString(),
        message: "✅ API test successful! OpenAI is working correctly.",
        sender: 'ai',
        timestamp: new Date()
      }]);
      
    } catch (error) {
      console.error('API test failed:', error);
      
      setChatHistory(prev => [...prev, {
        id: Date.now().toString(),
        message: `❌ API test failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key and try again.`,
        sender: 'ai',
        timestamp: new Date()
      }]);
      
    } finally {
      setIsTestingAPI(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      message: chatMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);

    // Add loading message
    const loadingMessage = {
      id: (Date.now() + 1).toString(),
      message: "I'm analyzing your financial situation and preparing personalized advice...",
      sender: 'ai' as const,
      timestamp: new Date(),
      isLoading: true
    };

    setChatHistory(prev => [...prev, loadingMessage]);
    setIsLoading(true);

    try {
      // Get real AI response
      const aiResponse = await OpenAIService.getFinancialCoaching(
        chatMessage,
        transactions,
        budgets,
        goals
      );

      // Remove loading message and add real response
      setChatHistory(prev => prev.filter(msg => !msg.isLoading).concat({
        id: (Date.now() + 2).toString(),
        message: aiResponse.message,
        sender: 'ai',
        timestamp: new Date()
      }));
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Remove loading message and add error response
      setChatHistory(prev => prev.filter(msg => !msg.isLoading).concat({
        id: (Date.now() + 2).toString(),
        message: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      }));
    } finally {
      setIsLoading(false);
      setChatMessage('');
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real app, this would integrate with speech recognition
  };

  const priorityInsights = insights.sort((a, b) => b.priority - a.priority);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* AI Chat Interface */}
      <Card className="lg:col-span-2">
        <div className="flex items-center space-x-2 mb-6">
          <Brain className="h-6 w-6 text-green-400" />
          <h3 className="text-xl font-bold text-green-400">AI Financial Coach</h3>
          <div className="flex-1" />
          <div className="flex items-center space-x-3">
            <Button
              onClick={testAPI}
              variant="outline"
              size="sm"
              disabled={isTestingAPI}
              className="flex items-center space-x-2 text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/10"
            >
              {isTestingAPI ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4" />
              )}
              <span>Test API</span>
            </Button>
            <div className="text-sm text-gray-400">
              Powered by OpenAI GPT-4
            </div>
          </div>
        </div>

        <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-900/50 rounded-lg border border-green-500/20">
          {chatHistory.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                chat.sender === 'user'
                  ? 'bg-green-600 text-black'
                  : 'bg-gray-800 text-white border border-green-500/30'
              }`}>
                <div className="flex items-start space-x-2">
                  {chat.isLoading && (
                    <Loader2 className="h-4 w-4 animate-spin text-green-400 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{chat.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {format(chat.timestamp, 'HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask your AI coach anything about your finances..."
            className="flex-1 px-4 py-2 bg-gray-800 border border-green-500/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
            disabled={isLoading}
          />
          <Button
            onClick={toggleListening}
            variant={isListening ? 'primary' : 'outline'}
            size="md"
            className="px-3"
            disabled={isLoading}
          >
            {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          <Button 
            onClick={handleSendMessage} 
            size="md" 
            className="px-3"
            disabled={isLoading || !chatMessage.trim()}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </Card>

      {/* Priority Insights */}
      <Card>
        <div className="flex items-center space-x-2 mb-6">
          <AlertTriangle className="h-6 w-6 text-yellow-400" />
          <h3 className="text-lg font-bold text-white">Priority Insights</h3>
        </div>

        <div className="space-y-4">
          {priorityInsights.slice(0, 5).map((insight, index) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Icon className="h-5 w-5 mt-0.5 text-current" />
                    <div>
                      <h4 className="font-semibold text-white text-sm mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-xs text-gray-300">
                        {insight.message}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDismissInsight(insight.id)}
                    className="text-gray-400 hover:text-white transition-colors ml-2"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}

          {priorityInsights.length === 0 && (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">
                Great job! No urgent insights at the moment.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CoachingDashboard;