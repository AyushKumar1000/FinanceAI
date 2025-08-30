import { API_CONFIG, FINANCIAL_PROMPTS } from '../config/api';
import { Transaction, Budget, Goal } from '../types';

export interface OpenAIResponse {
  message: string;
  suggestions?: string[];
  insights?: string[];
}

export class OpenAIService {
  private static async makeAPICall(prompt: string, userData?: any): Promise<OpenAIResponse> {
    try {
      const response = await fetch(API_CONFIG.OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: API_CONFIG.MODEL,
          messages: [
            {
              role: 'system',
              content: prompt
            },
            {
              role: 'user',
              content: userData ? JSON.stringify(userData, null, 2) : 'Please provide financial advice.'
            }
          ],
          max_tokens: API_CONFIG.MAX_TOKENS,
          temperature: API_CONFIG.TEMPERATURE
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API call failed: ${response.status}`);
      }

      const data = await response.json();
      const message = data.choices[0]?.message?.content || 'Unable to generate response.';

      return {
        message,
        suggestions: this.extractSuggestions(message),
        insights: this.extractInsights(message)
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return {
        message: 'I apologize, but I\'m having trouble connecting to my financial advice system right now. Please try again later.',
        suggestions: ['Check your internet connection', 'Try again in a few minutes'],
        insights: ['Service temporarily unavailable']
      };
    }
  }

  private static extractSuggestions(message: string): string[] {
    // Simple extraction of suggestions from AI response
    const suggestions: string[] = [];
    const lines = message.split('\n');
    
    lines.forEach(line => {
      if (line.includes('•') || line.includes('-') || line.includes('*')) {
        const suggestion = line.replace(/^[•\-\*]\s*/, '').trim();
        if (suggestion) suggestions.push(suggestion);
      }
    });

    return suggestions.length > 0 ? suggestions : ['Review your spending patterns', 'Set realistic financial goals'];
  }

  private static extractInsights(message: string): string[] {
    // Extract key insights from AI response
    const insights: string[] = [];
    const sentences = message.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      if (trimmed.length > 20 && trimmed.length < 100) {
        if (trimmed.includes('income') || trimmed.includes('budget') || trimmed.includes('save') || 
            trimmed.includes('spend') || trimmed.includes('goal') || trimmed.includes('debt')) {
          insights.push(trimmed);
        }
      }
    });

    return insights.length > 0 ? insights.slice(0, 3) : ['Focus on building emergency savings', 'Track all expenses regularly'];
  }

  // Get personalized budget advice
  static async getBudgetAdvice(transactions: Transaction[], budgets: Budget[], monthlyIncome: number): Promise<OpenAIResponse> {
    const prompt = `${FINANCIAL_PROMPTS.BUDGET_ADVICE}
    
    User's financial situation:
    - Monthly income: $${monthlyIncome}
    - Recent transactions: ${transactions.length} transactions
    - Budget categories: ${budgets.map(b => b.category).join(', ')}
    
    Provide specific, actionable budget advice.`;
    
    return this.makeAPICall(prompt, { transactions, budgets, monthlyIncome });
  }

  // Analyze spending patterns
  static async analyzeSpending(transactions: Transaction[]): Promise<OpenAIResponse> {
    const prompt = `${FINANCIAL_PROMPTS.SPENDING_ANALYSIS}
    
    Analyze these spending patterns and provide insights:
    ${JSON.stringify(transactions, null, 2)}
    
    Focus on:
    - Spending trends
    - Areas for improvement
    - Positive habits to maintain
    - Specific recommendations`;
    
    return this.makeAPICall(prompt, { transactions });
  }

  // Get goal planning advice
  static async getGoalAdvice(goals: Goal[], monthlyIncome: number): Promise<OpenAIResponse> {
    const prompt = `${FINANCIAL_PROMPTS.GOAL_PLANNING}
    
    User's goals and situation:
    - Monthly income: $${monthlyIncome}
    - Current goals: ${goals.map(g => `${g.title} ($${g.currentAmount}/$${g.targetAmount})`).join(', ')}
    
    Provide:
    - Goal prioritization advice
    - Timeline recommendations
    - Saving strategies
    - Motivation and encouragement`;
    
    return this.makeAPICall(prompt, { goals, monthlyIncome });
  }

  // Get debt management advice
  static async getDebtAdvice(transactions: Transaction[], monthlyIncome: number): Promise<OpenAIResponse> {
    const prompt = `${FINANCIAL_PROMPTS.DEBT_MANAGEMENT}
    
    User's situation:
    - Monthly income: $${monthlyIncome}
    - Recent transactions: ${transactions.length} transactions
    
    Provide debt management strategies for variable income, including:
    - Payment prioritization
    - Minimum payment strategies
    - Extra payment opportunities
    - Debt consolidation considerations`;
    
    return this.makeAPICall(prompt, { transactions, monthlyIncome });
  }

  // Get emergency fund advice
  static async getEmergencyFundAdvice(monthlyExpenses: number, currentSavings: number): Promise<OpenAIResponse> {
    const prompt = `${FINANCIAL_PROMPTS.EMERGENCY_FUND}
    
    User's emergency fund situation:
    - Monthly expenses: $${monthlyExpenses}
    - Current emergency savings: $${currentSavings}
    - Target: 6 months of expenses ($${monthlyExpenses * 6})
    
    Provide:
    - Current status assessment
    - Monthly savings targets
    - Strategies for variable income
    - Timeline recommendations`;
    
    return this.makeAPICall(prompt, { monthlyExpenses, currentSavings });
  }

  // Get personalized financial coaching
  static async getFinancialCoaching(
    userMessage: string, 
    transactions: Transaction[], 
    budgets: Budget[], 
    goals: Goal[]
  ): Promise<OpenAIResponse> {
    const prompt = `You are an AI financial coach specializing in helping gig workers and people with variable income.
    
    User's financial profile:
    - Transactions: ${transactions.length} recent transactions
    - Budgets: ${budgets.length} budget categories
    - Goals: ${goals.length} financial goals
    
    User's question: "${userMessage}"
    
    Provide:
    - Direct answer to their question
    - Personalized advice based on their financial situation
    - Actionable next steps
    - Encouragement and motivation
    
    Keep the response conversational, helpful, and focused on their specific situation.`;
    
    return this.makeAPICall(prompt, { userMessage, transactions, budgets, goals });
  }
}
