import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Goals from './pages/Goals';
import AICoach from './pages/AICoach';
import Profile from './pages/Profile';
import OnboardingFlow from './components/Onboarding/OnboardingFlow';
import { useFinancialData } from './hooks/useFinancialData';
import { storage, STORAGE_KEYS } from './utils/storage';
import { User } from './types';

function App() {
  const { user, saveUser, loading } = useFinancialData();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = storage.get<boolean>(STORAGE_KEYS.ONBOARDING);
    if (!user && !hasCompletedOnboarding && !loading) {
      setShowOnboarding(true);
    }
  }, [user, loading]);

  const handleOnboardingComplete = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    saveUser(newUser);
    storage.set(STORAGE_KEYS.ONBOARDING, true);
    setShowOnboarding(false);

    // Add some sample data for demo purposes
    const sampleTransactions = [
      {
        id: '1',
        amount: 2500,
        category: 'freelance',
        description: 'Web development project',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        type: 'income' as const,
        tags: ['work']
      },
      {
        id: '2',
        amount: 45.50,
        category: 'food',
        description: 'Grocery shopping',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        type: 'expense' as const,
        tags: ['essentials']
      },
      {
        id: '3',
        amount: 1200,
        category: 'salary',
        description: 'Part-time job payment',
        date: new Date(),
        type: 'income' as const,
        tags: ['regular']
      }
    ];

    const sampleGoals = [
      {
        id: '1',
        title: 'Emergency Fund',
        targetAmount: 5000,
        currentAmount: 1200,
        deadline: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000),
        priority: 'high' as const,
        category: 'emergency' as const
      },
      {
        id: '2',
        title: 'New Laptop',
        targetAmount: 1500,
        currentAmount: 400,
        deadline: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000),
        priority: 'medium' as const,
        category: 'savings' as const
      }
    ];

    const sampleBudgets = [
      {
        id: '1',
        category: 'housing',
        allocated: 800,
        spent: 750,
        period: 'monthly' as const,
        isFlexible: false
      },
      {
        id: '2',
        category: 'food',
        allocated: 400,
        spent: 320,
        period: 'monthly' as const,
        isFlexible: true
      },
      {
        id: '3',
        category: 'transportation',
        allocated: 200,
        spent: 180,
        period: 'monthly' as const,
        isFlexible: false
      },
      {
        id: '4',
        category: 'entertainment',
        allocated: 150,
        spent: 120,
        period: 'monthly' as const,
        isFlexible: true
      }
    ];

    storage.set(STORAGE_KEYS.TRANSACTIONS, sampleTransactions);
    storage.set(STORAGE_KEYS.GOALS, sampleGoals);
    storage.set(STORAGE_KEYS.BUDGETS, sampleBudgets);
    
    // Force a data reload by updating the user state
    // This will trigger the useFinancialData hook to reload data
    setTimeout(() => {
      saveUser(newUser);
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400">Loading FinanceAI...</div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/insights" element={<AICoach />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;