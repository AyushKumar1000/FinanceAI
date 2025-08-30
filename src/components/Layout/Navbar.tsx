import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  PieChart, 
  Target, 
  Bell, 
  User,
  Brain
} from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/transactions', icon: TrendingUp, label: 'Transactions' },
    { path: '/budget', icon: PieChart, label: 'Budget' },
    { path: '/goals', icon: Target, label: 'Goals' },
    { path: '/insights', icon: Brain, label: 'AI Coach' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="bg-black border-b border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent">
                FinanceAI
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === path
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'text-gray-300 hover:text-green-400 hover:bg-green-500/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Bell className="h-6 w-6 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-green-500/20">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                location.pathname === path
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'text-gray-300 hover:text-green-400 hover:bg-green-500/10'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;