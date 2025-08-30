import { Transaction, Budget, Goal, AIInsight, FinancialHealth } from '../types';

export class AIFinancialCoach {
  private transactions: Transaction[];
  private budgets: Budget[];
  private goals: Goal[];

  constructor(transactions: Transaction[], budgets: Budget[], goals: Goal[]) {
    this.transactions = transactions;
    this.budgets = budgets;
    this.goals = goals;
  }

  generateInsights(): AIInsight[] {
    const insights: AIInsight[] = [];
    const now = new Date();
    
    // Analyze spending patterns
    insights.push(...this.analyzeSpendingPatterns());
    
    // Check budget adherence
    insights.push(...this.checkBudgetAdherence());
    
    // Income volatility analysis
    insights.push(...this.analyzeIncomeVolatility());
    
    // Goal progress insights
    insights.push(...this.analyzeGoalProgress());
    
    // Emergency fund recommendations
    insights.push(...this.checkEmergencyFund());

    return insights.sort((a, b) => b.priority - a.priority);
  }

  private analyzeSpendingPatterns(): AIInsight[] {
    const insights: AIInsight[] = [];
    const recentExpenses = this.transactions
      .filter(t => t.type === 'expense' && this.isWithinDays(t.date, 30))
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const totalSpent = Object.values(recentExpenses).reduce((a, b) => a + b, 0);
    const topCategory = Object.entries(recentExpenses)
      .sort(([,a], [,b]) => b - a)[0];

    if (topCategory && topCategory[1] > totalSpent * 0.4) {
      insights.push({
        id: `spending-${Date.now()}`,
        type: 'warning',
        title: 'High Spending Alert',
        message: `You've spent ${((topCategory[1] / totalSpent) * 100).toFixed(0)}% of your budget on ${topCategory[0]} this month. Consider reviewing this category.`,
        actionable: true,
        priority: 8,
        createdAt: new Date()
      });
    }

    return insights;
  }

  private checkBudgetAdherence(): AIInsight[] {
    const insights: AIInsight[] = [];
    
    this.budgets.forEach(budget => {
      const adherenceRate = budget.spent / budget.allocated;
      
      if (adherenceRate > 0.9 && adherenceRate < 1.1) {
        insights.push({
          id: `budget-good-${budget.id}`,
          type: 'achievement',
          title: 'Great Budget Control!',
          message: `You're staying within your ${budget.category} budget. Keep it up!`,
          actionable: false,
          priority: 5,
          createdAt: new Date()
        });
      } else if (adherenceRate > 1.2) {
        insights.push({
          id: `budget-over-${budget.id}`,
          type: 'warning',
          title: 'Budget Exceeded',
          message: `You've exceeded your ${budget.category} budget by ${((adherenceRate - 1) * 100).toFixed(0)}%. Time to reassess your spending.`,
          actionable: true,
          priority: 9,
          createdAt: new Date()
        });
      }
    });

    return insights;
  }

  private analyzeIncomeVolatility(): AIInsight[] {
    const insights: AIInsight[] = [];
    const incomes = this.transactions
      .filter(t => t.type === 'income' && this.isWithinDays(t.date, 90))
      .map(t => t.amount);

    if (incomes.length >= 3) {
      const avg = incomes.reduce((a, b) => a + b, 0) / incomes.length;
      const variance = incomes.reduce((acc, income) => acc + Math.pow(income - avg, 2), 0) / incomes.length;
      const volatility = Math.sqrt(variance) / avg;

      if (volatility > 0.3) {
        insights.push({
          id: `income-volatile-${Date.now()}`,
          type: 'tip',
          title: 'Income Variability Detected',
          message: 'Your income varies significantly. Consider building a larger emergency fund and using percentage-based budgeting.',
          actionable: true,
          priority: 7,
          createdAt: new Date()
        });
      }
    }

    return insights;
  }

  private analyzeGoalProgress(): AIInsight[] {
    const insights: AIInsight[] = [];
    
    this.goals.forEach(goal => {
      const progress = goal.currentAmount / goal.targetAmount;
      const daysLeft = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      if (progress < 0.25 && daysLeft < 90) {
        insights.push({
          id: `goal-behind-${goal.id}`,
          type: 'warning',
          title: 'Goal Behind Schedule',
          message: `Your "${goal.title}" goal needs attention. You'll need to save $${((goal.targetAmount - goal.currentAmount) / Math.max(daysLeft, 1) * 30).toFixed(0)} per month to reach it.`,
          actionable: true,
          priority: 6,
          createdAt: new Date()
        });
      } else if (progress > 0.8) {
        insights.push({
          id: `goal-close-${goal.id}`,
          type: 'achievement',
          title: 'Goal Almost Reached!',
          message: `You're ${(progress * 100).toFixed(0)}% of the way to your "${goal.title}" goal. Amazing progress!`,
          actionable: false,
          priority: 4,
          createdAt: new Date()
        });
      }
    });

    return insights;
  }

  private checkEmergencyFund(): AIInsight[] {
    const insights: AIInsight[] = [];
    const monthlyExpenses = this.calculateMonthlyExpenses();
    const emergencyGoal = this.goals.find(g => g.category === 'emergency');
    
    if (!emergencyGoal) {
      insights.push({
        id: `emergency-missing-${Date.now()}`,
        type: 'recommendation',
        title: 'Create Emergency Fund',
        message: `As a gig worker, you should have 6 months of expenses saved. Start with $${(monthlyExpenses * 0.5).toFixed(0)}.`,
        actionable: true,
        priority: 10,
        createdAt: new Date()
      });
    } else {
      const monthsCovered = emergencyGoal.currentAmount / monthlyExpenses;
      if (monthsCovered < 3) {
        insights.push({
          id: `emergency-low-${Date.now()}`,
          type: 'warning',
          title: 'Emergency Fund Too Low',
          message: `Your emergency fund covers only ${monthsCovered.toFixed(1)} months. Aim for 6 months of expenses.`,
          actionable: true,
          priority: 8,
          createdAt: new Date()
        });
      }
    }

    return insights;
  }

  calculateFinancialHealth(): FinancialHealth {
    const monthlyIncome = this.calculateMonthlyIncome();
    const monthlyExpenses = this.calculateMonthlyExpenses();
    const emergencyFund = this.goals.find(g => g.category === 'emergency')?.currentAmount || 0;
    const totalDebt = this.goals.filter(g => g.category === 'debt').reduce((sum, g) => sum + g.targetAmount, 0);
    
    const factors = {
      emergencyFund: Math.min(emergencyFund / (monthlyExpenses * 6), 1) * 100,
      debtRatio: Math.max(0, 100 - (totalDebt / (monthlyIncome * 12)) * 100),
      savingsRate: Math.min(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100, 100),
      budgetAdherence: this.calculateBudgetAdherence(),
      incomeStability: this.calculateIncomeStability()
    };

    const score = Object.values(factors).reduce((sum, factor) => sum + factor, 0) / 5;

    return { score: Math.round(score), factors };
  }

  private calculateMonthlyIncome(): number {
    const recentIncome = this.transactions
      .filter(t => t.type === 'income' && this.isWithinDays(t.date, 30))
      .reduce((sum, t) => sum + t.amount, 0);
    
    return recentIncome || 0;
  }

  private calculateMonthlyExpenses(): number {
    const recentExpenses = this.transactions
      .filter(t => t.type === 'expense' && this.isWithinDays(t.date, 30))
      .reduce((sum, t) => sum + t.amount, 0);
    
    return recentExpenses || 0;
  }

  private calculateBudgetAdherence(): number {
    if (this.budgets.length === 0) return 50;
    
    const adherenceScores = this.budgets.map(budget => {
      const adherenceRate = budget.spent / budget.allocated;
      if (adherenceRate <= 1) return 100;
      return Math.max(0, 100 - (adherenceRate - 1) * 100);
    });

    return adherenceScores.reduce((sum, score) => sum + score, 0) / adherenceScores.length;
  }

  private calculateIncomeStability(): number {
    const incomes = this.transactions
      .filter(t => t.type === 'income' && this.isWithinDays(t.date, 90))
      .map(t => t.amount);

    if (incomes.length < 2) return 50;

    const avg = incomes.reduce((a, b) => a + b, 0) / incomes.length;
    const variance = incomes.reduce((acc, income) => acc + Math.pow(income - avg, 2), 0) / incomes.length;
    const volatility = Math.sqrt(variance) / avg;

    return Math.max(0, 100 - volatility * 200);
  }

  private isWithinDays(date: Date, days: number): boolean {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  }
}