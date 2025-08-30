import { useState, useEffect, useCallback } from 'react';
import { User, Transaction, Budget, Goal, AIInsight, FinancialHealth } from '../types';
import { AIFinancialCoach } from '../utils/aiCoach';
import { storage, STORAGE_KEYS } from '../utils/storage';
import api from '../services/api';

// Define a type for the API response
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export const useFinancialData = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [financialHealth, setFinancialHealth] = useState<FinancialHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // Initialize data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user data from API
        const userResponse = await api.users.getAll() as User[];
        if (userResponse && userResponse.length > 0) {
          setUser(userResponse[0]);
        }
        
        // Load other data as needed
        // const transactionsResponse = await api.transactions.getAll() as Transaction[];
        // setTransactions(transactionsResponse);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading data from API:', error);
        // Fallback to localStorage if API fails
        loadFromLocalStorage();
      }
    };

    loadData();
  }, []);

  // Fallback: Load data from localStorage
  const loadFromLocalStorage = useCallback(() => {
    try {
      const savedUser = storage.get<User | null>(STORAGE_KEYS.USER, null);
      const savedTransactions = storage.get<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
      const savedBudgets = storage.get<Budget[]>(STORAGE_KEYS.BUDGETS, []);
      const savedGoals = storage.get<Goal[]>(STORAGE_KEYS.GOALS, []);
      const savedInsights = storage.get<AIInsight[]>(STORAGE_KEYS.INSIGHTS, []);
      const savedFinancialHealth = storage.get<FinancialHealth | null>(STORAGE_KEYS.FINANCIAL_HEALTH, null);

      setUser(savedUser || null);
      setTransactions(savedTransactions || []);
      setBudgets(savedBudgets || []);
      setGoals(savedGoals || []);
      setInsights(savedInsights || []);
      setFinancialHealth(savedFinancialHealth || null);
    } catch (error) {
      console.error('❌ Error loading from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data from MongoDB or localStorage
  const loadData = useCallback(async () => {
    if (useLocalStorage) {
      loadFromLocalStorage();
      return;
    }

    if (!dbConnected || !user?._id) return;

    try {
      setLoading(true);
      console.log('🔄 Loading data from MongoDB...');

      const [userTransactions, userBudgets, userGoals, userInsights] = await Promise.all([
        DatabaseService.getTransactionsByUserId(user._id),
        DatabaseService.getBudgetsByUserId(user._id),
        DatabaseService.getAIInsightsByUserId(user._id)
      ]);

      setTransactions(userTransactions);
      setBudgets(userBudgets);
      setGoals(userGoals);
      setInsights(userInsights);

      // Calculate financial health
      if (userTransactions.length > 0) {
        const coach = new AIFinancialCoach(userTransactions, userBudgets, userGoals);
        const health = coach.calculateFinancialHealth();
        setFinancialHealth(health);
      }

      console.log('✅ Data loaded from MongoDB:', {
        transactions: userTransactions.length,
        budgets: userBudgets.length,
        goals: userGoals.length,
        insights: userInsights.length
      });
    } catch (error) {
      console.error('❌ Error loading data from MongoDB:', error);
      // Fallback to localStorage if MongoDB fails
      setUseLocalStorage(true);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  }, [dbConnected, user?._id, useLocalStorage, loadFromLocalStorage]);

  // Load data when user or database connection changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save user data
  const saveUser = useCallback(async (userData: User) => {
    try {
      if (useLocalStorage) {
        // Save to localStorage
        storage.set(STORAGE_KEYS.USER, userData);
        setUser(userData);
        console.log('✅ User saved to localStorage');
        return userData;
      }

      if (!dbConnected) {
        console.warn('⚠️ Database not connected, cannot save user');
        return;
      }

      let savedUser: User;
      
      if (userData._id) {
        // Update existing user
        const updatedUser = await DatabaseService.updateUser(userData._id, userData);
        if (updatedUser) {
          savedUser = updatedUser;
          setUser(updatedUser);
        } else {
          throw new Error('Failed to update user');
        }
      } else {
        // Create new user
        const { _id, createdAt, updatedAt, ...userDataWithoutId } = userData;
        savedUser = await DatabaseService.createUser(userDataWithoutId);
        setUser(savedUser);
      }

      console.log('✅ User saved to MongoDB:', savedUser);
      return savedUser;
    } catch (error) {
      console.error('❌ Error saving user:', error);
      throw error;
    }
  }, [dbConnected, useLocalStorage]);

  // Save transaction
  const saveTransaction = useCallback(async (transactionData: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (useLocalStorage) {
        // Save to localStorage
        const newTransaction = {
          ...transactionData,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        const updatedTransactions = [newTransaction, ...transactions];
        storage.set(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);
        setTransactions(updatedTransactions);
        console.log('✅ Transaction saved to localStorage');
        return newTransaction;
      }

      if (!dbConnected || !user?._id) {
        console.warn('⚠️ Database not connected or user not logged in');
        return;
      }

      const savedTransaction = await DatabaseService.createTransaction({
        ...transactionData,
        userId: user._id
      });

      setTransactions(prev => [savedTransaction, ...prev]);
      console.log('✅ Transaction saved to MongoDB:', savedTransaction);
      return savedTransaction;
    } catch (error) {
      console.error('❌ Error saving transaction:', error);
      throw error;
    }
  }, [dbConnected, user?._id, useLocalStorage, transactions]);

  // Update transaction
  const updateTransaction = useCallback(async (transactionId: string, updateData: Partial<Transaction>) => {
    try {
      if (useLocalStorage) {
        // Update in localStorage
        const updatedTransactions = transactions.map(t => 
          t.id === transactionId ? { ...t, ...updateData } : t
        );
        storage.set(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);
        setTransactions(updatedTransactions);
        console.log('✅ Transaction updated in localStorage');
        return updatedTransactions.find(t => t.id === transactionId);
      }

      if (!dbConnected) {
        console.warn('⚠️ Database not connected, cannot update transaction');
        return;
      }

      const updatedTransaction = await DatabaseService.updateTransaction(transactionId, updateData);
      if (updatedTransaction) {
        setTransactions(prev => 
          prev.map(t => t._id === transactionId ? updatedTransaction : t)
        );
        console.log('✅ Transaction updated in MongoDB:', updatedTransaction);
        return updatedTransaction;
      }
    } catch (error) {
      console.error('❌ Error updating transaction:', error);
      throw error;
    }
  }, [dbConnected, useLocalStorage, transactions]);

  // Delete transaction
  const deleteTransaction = useCallback(async (transactionId: string) => {
    try {
      if (useLocalStorage) {
        // Delete from localStorage
        const updatedTransactions = transactions.filter(t => t.id !== transactionId);
        storage.set(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);
        setTransactions(updatedTransactions);
        console.log('✅ Transaction deleted from localStorage');
        return;
      }

      if (!dbConnected) {
        console.warn('⚠️ Database not connected, cannot delete transaction');
        return;
      }

      const success = await DatabaseService.deleteTransaction(transactionId);
      if (success) {
        setTransactions(prev => prev.filter(t => t._id !== transactionId));
        console.log('✅ Transaction deleted from MongoDB:', transactionId);
      }
    } catch (error) {
      console.error('❌ Error deleting transaction:', error);
      throw error;
    }
  }, [dbConnected, useLocalStorage, transactions]);

  // Save budget
  const saveBudget = useCallback(async (budgetData: Omit<Budget, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (useLocalStorage) {
        // Save to localStorage
        const newBudget = {
          ...budgetData,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        const updatedBudgets = [newBudget, ...budgets];
        storage.set(STORAGE_KEYS.BUDGETS, updatedBudgets);
        setBudgets(updatedBudgets);
        console.log('✅ Budget saved to localStorage');
        return newBudget;
      }

      if (!dbConnected || !user?._id) {
        console.warn('⚠️ Database not connected or user not logged in');
        return;
      }

      const savedBudget = await DatabaseService.createBudget({
        ...budgetData,
        userId: user._id
      });

      setBudgets(prev => [savedBudget, ...prev]);
      console.log('✅ Budget saved to MongoDB:', savedBudget);
      return savedBudget;
    } catch (error) {
      console.error('❌ Error saving budget:', error);
      throw error;
    }
  }, [dbConnected, user?._id, useLocalStorage, budgets]);

  // Update budget
  const updateBudget = useCallback(async (budgetId: string, updateData: Partial<Budget>) => {
    try {
      if (useLocalStorage) {
        // Update in localStorage
        const updatedBudgets = budgets.map(b => 
          b.id === budgetId ? { ...b, ...updateData } : b
        );
        storage.set(STORAGE_KEYS.BUDGETS, updatedBudgets);
        setBudgets(updatedBudgets);
        console.log('✅ Budget updated in localStorage');
        return updatedBudgets.find(b => b.id === budgetId);
      }

      if (!dbConnected) {
        console.warn('⚠️ Database not connected, cannot update budget');
        return;
      }

      const updatedBudget = await DatabaseService.updateBudget(budgetId, updateData);
      if (updatedBudget) {
        setBudgets(prev => 
          prev.map(b => b._id === budgetId ? updatedBudget : b)
        );
        console.log('✅ Budget updated in MongoDB:', updatedBudget);
        return updatedBudget;
      }
    } catch (error) {
      console.error('❌ Error updating budget:', error);
      throw error;
    }
  }, [dbConnected, useLocalStorage, budgets]);

  // Save goal
  const saveGoal = useCallback(async (goalData: Omit<Goal, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (useLocalStorage) {
        // Save to localStorage
        const newGoal = {
          ...goalData,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        const updatedGoals = [newGoal, ...goals];
        storage.set(STORAGE_KEYS.GOALS, updatedGoals);
        setGoals(updatedGoals);
        console.log('✅ Goal saved to localStorage');
        return newGoal;
      }

      if (!dbConnected || !user?._id) {
        console.warn('⚠️ Database not connected or user not logged in');
        return;
      }

      const savedGoal = await DatabaseService.createGoal({
        ...goalData,
        userId: user._id
      });

      setGoals(prev => [savedGoal, ...prev]);
      console.log('✅ Goal saved to MongoDB:', savedGoal);
      return savedGoal;
    } catch (error) {
      console.error('❌ Error saving goal:', error);
      throw error;
    }
  }, [dbConnected, user?._id, useLocalStorage, goals]);

  // Update goal
  const updateGoal = useCallback(async (goalId: string, updateData: Partial<Goal>) => {
    try {
      if (useLocalStorage) {
        // Update in localStorage
        const updatedGoals = goals.map(g => 
          g.id === goalId ? { ...g, ...updateData } : g
        );
        storage.set(STORAGE_KEYS.GOALS, updatedGoals);
        setGoals(updatedGoals);
        console.log('✅ Goal updated in localStorage');
        return updatedGoals.find(g => g.id === goalId);
      }

      if (!dbConnected) {
        console.warn('⚠️ Database not connected, cannot update goal');
        return;
      }

      const updatedGoal = await DatabaseService.updateGoal(goalId, updateData);
      if (updatedGoal) {
        setGoals(prev => 
          prev.map(g => g._id === goalId ? updatedGoal : g)
        );
        console.log('✅ Goal updated in MongoDB:', updatedGoal);
        return updatedGoal;
      }
    } catch (error) {
      console.error('❌ Error updating goal:', error);
      throw error;
    }
  }, [dbConnected, useLocalStorage, goals]);

  // Save AI insight
  const saveAIInsight = useCallback(async (insightData: Omit<AIInsight, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (useLocalStorage) {
        // Save to localStorage
        const newInsight = {
          ...insightData,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        const updatedInsights = [newInsight, ...insights];
        storage.set(STORAGE_KEYS.INSIGHTS, updatedInsights);
        setInsights(updatedInsights);
        console.log('✅ AI Insight saved to localStorage');
        return newInsight;
      }

      if (!dbConnected || !user?._id) {
        console.warn('⚠️ Database not connected or user not logged in');
        return;
      }

      const savedInsight = await DatabaseService.createAIInsight({
        ...insightData,
        userId: user._id
      });

      setInsights(prev => [savedInsight, ...prev]);
      console.log('✅ AI Insight saved to MongoDB:', savedInsight);
      return savedInsight;
    } catch (error) {
      console.error('❌ Error saving AI insight:', error);
      throw error;
    }
  }, [dbConnected, user?._id, useLocalStorage, insights]);

  // Dismiss insight
  const dismissInsight = useCallback(async (insightId: string) => {
    try {
      if (useLocalStorage) {
        // Delete from localStorage
        const updatedInsights = insights.filter(i => i.id !== insightId);
        storage.set(STORAGE_KEYS.INSIGHTS, updatedInsights);
        setInsights(updatedInsights);
        console.log('✅ AI Insight deleted from localStorage');
        return;
      }

      if (!dbConnected) {
        console.warn('⚠️ Database not connected, cannot delete insight');
        return;
      }

      const success = await DatabaseService.deleteAIInsight(insightId);
      if (success) {
        setInsights(prev => prev.filter(i => i._id !== insightId));
        console.log('✅ AI Insight deleted from MongoDB:', insightId);
      }
    } catch (error) {
      console.error('❌ Error deleting AI insight:', error);
      throw error;
    }
  }, [dbConnected, useLocalStorage, insights]);

  // Reload data
  const reloadData = useCallback(() => {
    loadData();
  }, [loadData]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      if (user?._id && dbConnected && !useLocalStorage) {
        // Clear user data from database
        await DatabaseService.clearUserData(user._id);
        console.log('✅ User data cleared from MongoDB');
      }
    } catch (error) {
      console.error('❌ Error clearing user data:', error);
    } finally {
      // Clear local state
      setUser(null);
      setTransactions([]);
      setBudgets([]);
      setGoals([]);
      setInsights([]);
      setFinancialHealth(null);
      
      // Clear localStorage
      storage.clear();
    }
  }, [user?._id, dbConnected, useLocalStorage]);

  // Debug function
  const debug = useCallback(() => {
    console.log('🔍 Debug Info:', {
      connected: dbConnected,
      useLocalStorage,
      user: user ? { id: user._id || user.id, email: user.email } : null,
      transactions: transactions.length,
      budgets: budgets.length,
      goals: goals.length,
      insights: insights.length,
      financialHealth: financialHealth ? 'calculated' : 'not calculated'
    });
  }, [dbConnected, useLocalStorage, user, transactions, budgets, goals, insights, financialHealth]);

  return {
    user,
    transactions,
    budgets,
    goals,
    insights,
    financialHealth,
    loading,
    dbConnected,
    useLocalStorage,
    saveUser,
    saveTransaction,
    updateTransaction,
    deleteTransaction,
    saveBudget,
    updateBudget,
    saveGoal,
    updateGoal,
    saveAIInsight,
    dismissInsight,
    reloadData,
    logout,
    debug
  };
};