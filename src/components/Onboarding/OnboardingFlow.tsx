import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, User, Briefcase, Target, DollarSign } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { User as UserType } from '../../types';

interface OnboardingFlowProps {
  onComplete: (userData: Omit<UserType, 'id' | 'createdAt'>) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    workType: 'gig' as const,
    monthlyIncomeRange: '',
    financialGoals: [] as string[]
  });

  const steps = [
    {
      title: 'Welcome to FinanceAI',
      subtitle: 'Your personal AI financial coach',
      icon: User,
      component: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-800 border border-green-500/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-800 border border-green-500/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Tell us about your work',
      subtitle: 'This helps us provide personalized advice',
      icon: Briefcase,
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'gig', label: 'Gig Worker', desc: 'Uber, DoorDash, freelance work' },
              { value: 'informal', label: 'Informal Sector', desc: 'Cash-based, irregular income' },
              { value: 'freelance', label: 'Freelancer', desc: 'Project-based work' },
              { value: 'traditional', label: 'Traditional Job', desc: 'Regular salary or wages' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setUserData(prev => ({ ...prev, workType: option.value as any }))}
                className={`p-4 text-left border rounded-lg transition-colors ${
                  userData.workType === option.value
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : 'border-gray-600 text-gray-300 hover:border-green-500/50'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-400">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Monthly Income Range',
      subtitle: 'This helps us calibrate your financial goals',
      icon: DollarSign,
      component: (
        <div className="space-y-3">
          {[
            'Under $1,000',
            '$1,000 - $2,500',
            '$2,500 - $5,000',
            '$5,000 - $10,000',
            'Over $10,000'
          ].map(range => (
            <button
              key={range}
              onClick={() => setUserData(prev => ({ ...prev, monthlyIncomeRange: range }))}
              className={`w-full p-3 text-left border rounded-lg transition-colors ${
                userData.monthlyIncomeRange === range
                  ? 'border-green-500 bg-green-500/10 text-green-400'
                  : 'border-gray-600 text-gray-300 hover:border-green-500/50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      )
    },
    {
      title: 'Financial Goals',
      subtitle: 'What do you want to achieve? (Select all that apply)',
      icon: Target,
      component: (
        <div className="space-y-3">
          {[
            'Build Emergency Fund',
            'Pay Off Debt',
            'Save for Investment',
            'Buy a Home',
            'Start a Business',
            'Improve Credit Score',
            'Plan for Retirement',
            'Better Budget Control'
          ].map(goal => (
            <button
              key={goal}
              onClick={() => {
                const isSelected = userData.financialGoals.includes(goal);
                setUserData(prev => ({
                  ...prev,
                  financialGoals: isSelected
                    ? prev.financialGoals.filter(g => g !== goal)
                    : [...prev.financialGoals, goal]
                }));
              }}
              className={`w-full p-3 text-left border rounded-lg transition-colors ${
                userData.financialGoals.includes(goal)
                  ? 'border-green-500 bg-green-500/10 text-green-400'
                  : 'border-gray-600 text-gray-300 hover:border-green-500/50'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return userData.name && userData.email;
      case 1:
        return userData.workType;
      case 2:
        return userData.monthlyIncomeRange;
      case 3:
        return userData.financialGoals.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete(userData);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="text-center mb-8">
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-500/20 rounded-full">
                <currentStepData.icon className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {currentStepData.title}
            </h1>
            <p className="text-gray-400">{currentStepData.subtitle}</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-center space-x-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-green-400' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-left"
            >
              {currentStepData.component}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center space-x-2"
            >
              <span>{isLastStep ? 'Get Started' : 'Continue'}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingFlow;