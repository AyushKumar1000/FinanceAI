export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  workType: 'gig' | 'informal' | 'traditional' | 'freelance';
  monthlyIncomeRange: string;
  financialGoals: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface Transaction {
  _id?: string;
  id?: string;
  userId?: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  type: 'income' | 'expense';
  isRecurring?: boolean;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Budget {
  _id?: string;
  id?: string;
  userId?: string;
  category: string;
  allocated?: number;
  amount: number;
  spent: number;
  period?: 'weekly' | 'monthly';
  isFlexible?: boolean;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Goal {
  _id?: string;
  id?: string;
  userId?: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  targetDate?: Date;
  priority: 'high' | 'medium' | 'low';
  category?: 'emergency' | 'savings' | 'debt' | 'investment';
  isCompleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AIInsight {
  _id?: string;
  id?: string;
  userId?: string;
  type: 'warning' | 'tip' | 'achievement' | 'recommendation';
  title: string;
  message: string;
  actionable: boolean;
  priority: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface FinancialHealth {
  score: number;
  factors: {
    emergencyFund: number;
    debtRatio: number;
    savingsRate: number;
    budgetAdherence: number;
    incomeStability: number;
  };
}

// MongoDB Model interfaces
export interface IUser extends User {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction extends Transaction {
  _id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBudget extends Budget {
  _id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGoal extends Goal {
  _id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAIInsight extends AIInsight {
  _id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}