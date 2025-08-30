import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar,
  MoreVertical
} from 'lucide-react';
import Card from '../UI/Card';
import { Transaction } from '../../types';
import { format } from 'date-fns';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: 'bg-orange-500/20 text-orange-400',
      transportation: 'bg-blue-500/20 text-blue-400',
      entertainment: 'bg-purple-500/20 text-purple-400',
      utilities: 'bg-yellow-500/20 text-yellow-400',
      healthcare: 'bg-red-500/20 text-red-400',
      income: 'bg-green-500/20 text-green-400',
      shopping: 'bg-pink-500/20 text-pink-400',
      default: 'bg-gray-500/20 text-gray-400'
    };
    return colors[category] || colors.default;
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        <Calendar className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        {recentTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getCategoryColor(transaction.category)}`}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownLeft className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="font-medium text-white">{transaction.description}</p>
                <p className="text-sm text-gray-400 capitalize">
                  {transaction.category} • {format(new Date(transaction.date), 'MMM dd')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-400' : 'text-gray-300'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
              </span>
              <button className="text-gray-400 hover:text-white transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}

        {recentTransactions.length === 0 && (
          <div className="text-center py-8">
            <ArrowUpRight className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No transactions yet</p>
            <p className="text-sm text-gray-500">Add your first transaction to get started</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentTransactions;