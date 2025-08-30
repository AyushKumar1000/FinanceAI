const STORAGE_KEYS = {
  USER: 'financialCoach_user',
  TRANSACTIONS: 'financialCoach_transactions',
  BUDGETS: 'financialCoach_budgets',
  GOALS: 'financialCoach_goals',
  INSIGHTS: 'financialCoach_insights',
  FINANCIAL_HEALTH: 'financialCoach_financial_health',
  ONBOARDING: 'financialCoach_onboarding'
};

export const storage = {
  get: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting item from localStorage (${key}):`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item in localStorage (${key}):`, error);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },

  debug: (): void => {
    console.log('Current localStorage contents:');
    Object.entries(STORAGE_KEYS).forEach(([key, value]) => {
      const item = localStorage.getItem(value);
      console.log(`${key}:`, item ? JSON.parse(item) : null);
    });
  }
};

export { STORAGE_KEYS };