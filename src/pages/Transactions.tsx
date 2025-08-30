import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useFinancialData } from '../hooks/useFinancialData';
import { Transaction } from '../types';
import { format } from 'date-fns';

const Transactions: React.FC = () => {
  const { transactions, addTransaction } = useFinancialData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0],
    tags: [] as string[]
  });

  const categories = {
    income: ['salary', 'freelance', 'business', 'investment', 'other'],
    expense: ['food', 'transportation', 'utilities', 'healthcare', 'entertainment', 'shopping', 'other']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.description) return;

    addTransaction({
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      type: formData.type,
      date: new Date(formData.date),
      tags: formData.tags
    });

    setFormData({
      amount: '',
      category: '',
      description: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      tags: []
    });
    setShowAddForm(false);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  const getCategoryColor = (category: string, type: string) => {
    if (type === 'income') return 'bg-green-500/20 text-green-400 border-green-500/30';
    
    const colors: Record<string, string> = {
      food: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      transportation: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      entertainment: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      utilities: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      healthcare: 'bg-red-500/20 text-red-400 border-red-500/30',
      shopping: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      default: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[category] || colors.default;
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent mb-2">
                Transactions
              </h1>
              <p className="text-gray-400">Track and manage your income and expenses</p>
            </div>
            <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Transaction</span>
            </Button>
          </div>

          {/* Search and Filter */}
          <Card>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-green-500/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="bg-gray-800 border border-green-500/30 rounded-lg px-3 py-2 text-white focus:border-green-400 focus:outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expenses</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Add Transaction Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-md"
              >
                <Card>
                  <h2 className="text-xl font-bold text-white mb-4">Add Transaction</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                        className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                          formData.type === 'income'
                            ? 'border-green-500 bg-green-500/10 text-green-400'
                            : 'border-gray-600 text-gray-300'
                        }`}
                      >
                        Income
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                        className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                          formData.type === 'expense'
                            ? 'border-green-500 bg-green-500/10 text-green-400'
                            : 'border-gray-600 text-gray-300'
                        }`}
                      >
                        Expense
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-full px-4 py-2 bg-gray-800 border border-green-500/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-2 bg-gray-800 border border-green-500/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
                        required
                      >
                        <option value="">Select category</option>
                        {categories[formData.type].map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-2 bg-gray-800 border border-green-500/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
                        placeholder="Enter description"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-4 py-2 bg-gray-800 border border-green-500/30 rounded-lg text-white focus:border-green-400 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="flex space-x-3">
                      <Button type="submit" className="flex-1">Add Transaction</Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => setShowAddForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg border ${getCategoryColor(transaction.category, transaction.type)}`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="h-5 w-5" />
                      ) : (
                        <ArrowDownLeft className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{transaction.description}</p>
                      <p className="text-sm text-gray-400 capitalize">
                        {transaction.category} • {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </p>
                      {transaction.tags.length > 0 && (
                        <div className="flex space-x-1 mt-1">
                          {transaction.tags.map(tag => (
                            <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-gray-300'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      {format(new Date(transaction.date), 'h:mm a')}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {filteredTransactions.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <ArrowUpRight className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No transactions found</p>
                <p className="text-sm text-gray-500 mb-4">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start by adding your first transaction'
                  }
                </p>
                {!searchTerm && filterType === 'all' && (
                  <Button onClick={() => setShowAddForm(true)}>
                    Add Your First Transaction
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;