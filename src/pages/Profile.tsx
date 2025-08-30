import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Shield, Edit3, Save, X, Target, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useFinancialData } from '../hooks/useFinancialData';

const Profile: React.FC = () => {
  const { user, saveUser, logout: logoutUser } = useFinancialData();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    workType: user?.workType || 'gig',
    monthlyIncomeRange: user?.monthlyIncomeRange || ''
  });

  const handleSaveProfile = () => {
    if (user) {
      const updatedUser = { ...user, ...editForm };
      saveUser(updatedUser);
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logoutUser();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl">
              <User className="h-10 w-10 text-green-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Profile & Settings
              </h1>
              <p className="text-gray-400 text-lg">
                Manage your account and preferences
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Financial Goals</p>
                  <p className="text-2xl font-bold text-green-400">{user.financialGoals.length}</p>
                </div>
                <Target className="h-8 w-8 text-green-400" />
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Work Type</p>
                  <p className="text-lg font-semibold text-blue-400 capitalize">{user.workType.replace('-', ' ')}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Income Range</p>
                  <p className="text-lg font-semibold text-purple-400">{user.monthlyIncomeRange}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-400" />
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Account Status</p>
                  <p className="text-lg font-semibold text-yellow-400">Active</p>
                </div>
                <CheckCircle className="h-8 w-8 text-yellow-400" />
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-green-400">Personal Information</h3>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveProfile} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-green-500/30 rounded-xl text-white focus:border-green-400 focus:outline-none"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-800/30 rounded-xl border border-gray-700">
                        <p className="text-white font-medium">{user.name}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-green-500/30 rounded-xl text-white focus:border-green-400 focus:outline-none"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-800/30 rounded-xl border border-gray-700">
                        <p className="text-white font-medium">{user.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Work Type</label>
                    {isEditing ? (
                      <select
                        value={editForm.workType}
                        onChange={(e) => setEditForm(prev => ({ ...prev, workType: e.target.value as any }))}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-green-500/30 rounded-xl text-white focus:border-green-400 focus:outline-none"
                      >
                        <option value="gig">Gig Worker</option>
                        <option value="informal">Informal Sector</option>
                        <option value="freelance">Freelancer</option>
                        <option value="traditional">Traditional Job</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-gray-800/30 rounded-xl border border-gray-700">
                        <p className="text-white font-medium capitalize">{user.workType.replace('-', ' ')}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Income Range</label>
                    {isEditing ? (
                      <select
                        value={editForm.monthlyIncomeRange}
                        onChange={(e) => setEditForm(prev => ({ ...prev, monthlyIncomeRange: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-green-500/30 rounded-xl text-white focus:border-green-400 focus:outline-none"
                      >
                        <option value="Under $1,000">Under $1,000</option>
                        <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                        <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                        <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                        <option value="Over $10,000">Over $10,000</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-gray-800/30 rounded-xl border border-gray-700">
                        <p className="text-white font-medium">{user.monthlyIncomeRange}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg">
                  <Target className="h-5 w-5 text-green-400" />
                </div>
                <h4 className="font-semibold text-white">Financial Goals</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-sm text-gray-300">Total Goals</span>
                  <span className="text-white font-semibold">{user.financialGoals.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-sm text-gray-300">Primary Focus</span>
                  <span className="text-white font-semibold text-sm">{user.financialGoals[0] || 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-sm text-gray-300">Member Since</span>
                  <span className="text-white font-semibold text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg">
                  <Shield className="h-5 w-5 text-red-400" />
                </div>
                <h4 className="font-semibold text-white">Account Actions</h4>
              </div>
              
              <div className="space-y-3">
                <Button onClick={handleLogout} variant="outline" size="lg" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
