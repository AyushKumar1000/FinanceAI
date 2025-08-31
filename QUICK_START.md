# FinanceAI - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you get FinanceAI up and running on your local machine quickly.

## 📋 Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **MongoDB** (local or cloud instance)
- **OpenAI API key** ([Get one here](https://platform.openai.com/api-keys))

## ⚡ Quick Setup

### 1. Clone the Repository
```bash
git clone https://github.com/AyushKumar1000/FinanceAI.git
cd FinanceAI
```

### 2. Install Dependencies
```bash
npm install
cd server && npm install && cd ..
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
nano .env.local  # or use your preferred editor
```

**Required Environment Variables:**
```env
# OpenAI API Configuration
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/financeai

# Optional: Server Configuration
PORT=3001
NODE_ENV=development
```

### 4. Start the Application
```bash
# Terminal 1: Start Frontend
npm run dev

# Terminal 2: Start Backend
cd server
npm run dev
```

### 5. Open Your Browser
Navigate to `http://localhost:5173` to see the application running!

## 🎯 First Steps

### 1. Create Your Account
- Click "Sign Up" on the landing page
- Enter your email and password
- Complete your profile setup

### 2. Set Up Your Financial Profile
- Choose your income type (fixed or variable)
- Enter your monthly income
- Set your primary financial goals

### 3. Add Your First Transaction
- Go to the Transactions page
- Click "Add Transaction"
- Enter income or expense details

### 4. Try the AI Coach
- Navigate to the AI Coach section
- Ask a financial question
- Get personalized advice from OpenAI

## 🔧 Development Commands

### Frontend Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Backend Commands
```bash
cd server

# Start development server
npm run dev

# Start production server
npm run start

# Type checking
npm run type-check

# Build TypeScript
npm run build
```

### Database Commands
```bash
# Start local MongoDB (if installed)
mongod

# Connect to MongoDB shell
mongosh

# Use database
use financeai

# View collections
show collections
```

## 📱 Application Structure

### Key Pages
- **Dashboard** (`/`) - Main overview and insights
- **Transactions** (`/transactions`) - Income/expense tracking
- **Budget** (`/budget`) - Budget management
- **Goals** (`/goals`) - Financial goal tracking
- **AI Coach** (`/ai-coach`) - AI-powered financial advice
- **Profile** (`/profile`) - User settings

### Key Components
- **AICoach** - OpenAI integration for financial coaching
- **Budget Management** - AI-powered budget suggestions
- **Goal Tracking** - Progress monitoring and optimization
- **Financial Analysis** - Spending pattern insights

## 🔌 API Testing

### Test OpenAI Integration
```bash
# Test OpenAI API connection
curl -X POST http://localhost:3001/api/ai/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, can you help me with budgeting?"}'
```

### Test Database Connection
```bash
# Check MongoDB connection
curl http://localhost:3001/api/health
```

## 🐛 Common Issues & Solutions

### Issue: "OpenAI API Key not set"
**Solution**: Ensure `VITE_OPENAI_API_KEY` is set in `.env.local`

### Issue: "MongoDB connection failed"
**Solution**: 
- Verify MongoDB is running
- Check `MONGODB_URI` in `.env.local`
- Ensure network access for cloud instances

### Issue: "Port already in use"
**Solution**: 
- Change port in `.env.local`: `PORT=3002`
- Or kill existing process: `lsof -ti:3001 | xargs kill`

### Issue: "Build errors"
**Solution**: 
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript: `npm run type-check`

## 📊 Sample Data

### Sample Transaction
```json
{
  "type": "expense",
  "amount": 45.50,
  "category": "Food & Dining",
  "description": "Grocery shopping",
  "date": "2025-01-30"
}
```

### Sample Budget
```json
{
  "category": "Food & Dining",
  "limit": 300,
  "period": "monthly",
  "startDate": "2025-01-01"
}
```

### Sample Goal
```json
{
  "title": "Emergency Fund",
  "description": "Save 6 months of expenses",
  "targetAmount": 6000,
  "targetDate": "2025-12-31",
  "priority": "high"
}
```

## 🔍 Debugging

### Frontend Debugging
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check browser console for errors
# Use React Developer Tools extension
```

### Backend Debugging
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check server logs
# Use Postman/Insomnia for API testing
```

### Database Debugging
```bash
# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log

# Connect to MongoDB shell
mongosh --host localhost --port 27017
```

## 🚀 Next Steps

### 1. Customize the Application
- Modify the AI prompts in `src/config/api.ts`
- Add new budget categories
- Customize the UI theme

### 2. Add New Features
- Implement new AI insights
- Add data export functionality
- Create custom financial reports

### 3. Deploy to Production
- Set up production MongoDB
- Configure environment variables
- Deploy to your preferred platform

## 📚 Additional Resources

- **Full Documentation**: [DOCUMENTATION.md](./DOCUMENTATION.md)
- **Workflow Diagrams**: [WORKFLOW_DIAGRAMS.md](./WORKFLOW_DIAGRAMS.md)
- **API Reference**: See DOCUMENTATION.md for detailed API docs
- **GitHub Repository**: [https://github.com/AyushKumar1000/FinanceAI](https://github.com/AyushKumar1000/FinanceAI)

## 🤝 Getting Help

### Documentation
- Check this guide first
- Review the full documentation
- Examine the workflow diagrams

### Code Issues
- Check the GitHub issues page
- Review the code comments
- Use the debugging tools above

### Community
- Create a GitHub issue for bugs
- Submit feature requests
- Contribute to the project

---

**Happy coding! 🎉**

If you find this guide helpful, please star the repository and share it with others!
