export const API_CONFIG = {
  OPENAI_API_KEY: process.env.VITE_OPENAI_API_KEY || '',
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
  MODEL: 'gpt-4o-mini',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7
};

export const FINANCIAL_PROMPTS = {
  BUDGET_ADVICE: `You are a financial advisor specializing in helping gig workers and people with variable income. 
  Provide practical, actionable advice for budgeting, saving, and financial planning. 
  Keep responses concise, friendly, and focused on immediate actionable steps.`,
  
  SPENDING_ANALYSIS: `Analyze the user's spending patterns and provide insights. 
  Focus on identifying areas for improvement, suggesting budget optimizations, and highlighting positive financial habits.`,
  
  GOAL_PLANNING: `Help the user create and achieve financial goals. 
  Provide step-by-step guidance, realistic timelines, and motivation. 
  Consider their income variability and suggest flexible strategies.`,
  
  DEBT_MANAGEMENT: `Provide debt management advice for people with irregular income. 
  Focus on prioritization, minimum payments, and strategies for variable income situations.`,
  
  EMERGENCY_FUND: `Advise on building emergency funds for gig workers and people with variable income. 
  Suggest percentage-based approaches and realistic targets.`
};
