import User, { IUser } from '../models/User';
import Transaction, { ITransaction } from '../models/Transaction';
import Budget, { IBudget } from '../models/Budget';
import Goal, { IGoal } from '../models/Goal';
import AIInsight, { IAIInsight } from '../models/AIInsight';
import { connectDatabase, disconnectDatabase, isDatabaseConnected } from '../config/database';

export class DatabaseService {
  // User operations
  static async createUser(userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }
      
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }
      
      return await User.findOne({ email: email.toLowerCase() });
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  static async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }
      
      return await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Transaction operations
  static async createTransaction(transactionData: Omit<ITransaction, '_id' | 'createdAt' | 'updatedAt'>): Promise<ITransaction> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }
      
      const transaction = new Transaction(transactionData);
      return await transaction.save();
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  static async getTransactionsByUserId(userId: string): Promise<ITransaction[]> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }
      
      return await Transaction.find({ userId }).sort({ date: -1 });
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }

  static async updateTransaction(transactionId: string, updateData: Partial<ITransaction>): Promise<ITransaction | null> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }
      
      return await Transaction.findByIdAndUpdate(transactionId, updateData, { new: true, runValidators: true });
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  static async deleteTransaction(transactionId: string): Promise<boolean> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }
      
      const result = await Transaction.findByIdAndDelete(transactionId);
      return !!result;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  // Budget operations
  static async createBudget(budgetData: Omit<IBudget, '_id' | 'createdAt' | 'updatedAt'>): Promise<IBudget> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }
      
      const budget = new Budget(budgetData);
      return await budget.save();
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  }

  static async getBudgetsByUserId(userId: string): Promise<IBudget[]> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }
      
      return await Budget.find({ userId, isActive: true }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting budgets:', error);
      throw error;
    }
  }

  static async updateBudget(budgetId: string, updateData: Partial<IBudget>): Promise<IBudget | null> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }
      
      return await Budget.findByIdAndUpdate(budgetId, updateData, { new: true, runValidators: true });
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  }

  // Goal operations
  static async createGoal(goalData: Omit<IGoal, '_id' | 'createdAt' | 'updatedAt'>): Promise<IGoal> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }
      
      const goal = new Goal(goalData);
      return await goal.save();
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  }

  static async getGoalsByUserId(userId: string): Promise<IGoal[]> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }
      
      return await Goal.find({ userId }).sort({ priority: -1, createdAt: -1 });
    } catch (error) {
      console.error('Error getting goals:', error);
      throw error;
    }
  }

  static async updateGoal(goalId: string, updateData: Partial<IGoal>): Promise<IGoal | null> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }
      
      return await Goal.findByIdAndUpdate(goalId, updateData, { new: true, runValidators: true });
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  }

  // AI Insight operations
  static async createAIInsight(insightData: Omit<IAIInsight, '_id' | 'createdAt' | 'updatedAt'>): Promise<IAIInsight> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }
      
      const insight = new AIInsight(insightData);
      return await insight.save();
    } catch (error) {
      console.error('Error creating AI insight:', error);
      throw error;
    }
  }

  static async getAIInsightsByUserId(userId: string): Promise<IAIInsight[]> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }
      
      return await AIInsight.find({ userId }).sort({ priority: -1, createdAt: -1 });
    } catch (error) {
      console.error('Error getting AI insights:', error);
      throw error;
    }
  }

  static async deleteAIInsight(insightId: string): Promise<boolean> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }
      
      const result = await AIInsight.findByIdAndDelete(insightId);
      return !!result;
    } catch (error) {
      console.error('Error deleting AI insight:', error);
      throw error;
    }
  }

  // Data migration from localStorage
  static async migrateFromLocalStorage(userData: any, transactions: any[], budgets: any[], goals: any[], insights: any[]): Promise<void> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }

      // Create user
      const user = await this.createUser(userData);
      const userId = user._id;

      // Migrate transactions
      for (const transaction of transactions) {
        await this.createTransaction({
          ...transaction,
          userId,
          date: new Date(transaction.date)
        });
      }

      // Migrate budgets
      for (const budget of budgets) {
        await this.createBudget({
          ...budget,
          userId,
          startDate: new Date(budget.startDate || Date.now()),
          endDate: new Date(budget.endDate || Date.now())
        });
      }

      // Migrate goals
      for (const goal of goals) {
        await this.createGoal({
          ...goal,
          userId,
          targetDate: new Date(goal.targetDate)
        });
      }

      // Migrate insights
      for (const insight of insights) {
        await this.createAIInsight({
          ...insight,
          userId
        });
      }

      console.log('✅ Data migration completed successfully');
    } catch (error) {
      console.error('❌ Data migration failed:', error);
      throw error;
    }
  }

  // Cleanup operations
  static async clearUserData(userId: string): Promise<void> {
    try {
      if (!isDatabaseConnected()) {
        await connectDatabase();
      }

      await Promise.all([
        Transaction.deleteMany({ userId }),
        Budget.deleteMany({ userId }),
        Goal.deleteMany({ userId }),
        AIInsight.deleteMany({ userId }),
        User.findByIdAndDelete(userId)
      ]);

      console.log('✅ User data cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing user data:', error);
      throw error;
    }
  }
}
