# FinanceAI - Comprehensive Documentation

## 📋 Table of Contents
1. [Application Overview](#application-overview)
2. [Architecture](#architecture)
3. [Workflow Diagrams](#workflow-diagrams)
4. [API Documentation](#api-documentation)
5. [Database Schema](#database-schema)
6. [Component Structure](#component-structure)
7. [Security & Authentication](#security--authentication)
8. [Deployment Guide](#deployment-guide)
9. [Troubleshooting](#troubleshooting)

## 🎯 Application Overview

FinanceAI is an AI-powered financial coaching application designed specifically for gig workers and people with variable income. The application provides personalized financial advice, budget management, goal tracking, and spending analysis using OpenAI's GPT models.

### Key Features
- **AI Financial Coaching**: Personalized advice based on user data
- **Smart Budget Management**: AI-generated budget suggestions
- **Goal Tracking**: Financial goal setting and progress monitoring
- **Spending Analysis**: Pattern recognition and optimization suggestions
- **Real-time Insights**: Dynamic financial health scoring
- **Responsive Design**: Modern UI built with React and Tailwind CSS

### Target Audience
- Gig workers (Uber, DoorDash, freelancers)
- Variable income earners
- People seeking financial guidance
- Users wanting AI-powered financial insights

## 🏗️ Architecture

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
│   ├── AICoach/        # AI coaching interface
│   ├── Budget/         # Budget management
│   ├── Dashboard/      # Main dashboard views
│   ├── Goals/          # Goal tracking
│   ├── Layout/         # Navigation and layout
│   ├── Onboarding/     # User onboarding flow
│   └── UI/             # Base UI components
├── pages/              # Main application pages
├── services/           # API and external services
├── hooks/              # Custom React hooks
├── models/             # Data models and types
├── utils/              # Utility functions
└── config/             # Configuration files
```

### Backend Architecture
```
server/
├── middleware/         # Request processing middleware
├── routes/            # API endpoint definitions
├── server.ts          # Main server file
└── index.ts           # Server entry point
```

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB
- **AI Services**: OpenAI GPT-4
- **Authentication**: JWT tokens
- **Deployment**: Docker support

## 🔄 Workflow Diagrams

### 1. User Onboarding Flow
```
User Registration → Profile Setup → Financial Data Input → AI Analysis → Dashboard Access
     ↓                    ↓              ↓              ↓            ↓
  Create Account    Basic Info     Income/Expense   AI Insights   Main App
```

### 2. AI Coaching Workflow
```
User Question → Context Gathering → AI Processing → Response Generation → User Feedback
     ↓              ↓                ↓              ↓                ↓
  Input Query   User Data +      OpenAI API     Structured      Learning &
                History         Call           Response        Improvement
```

### 3. Budget Management Flow
```
Income Input → Expense Tracking → AI Analysis → Budget Suggestions → Implementation
     ↓            ↓               ↓              ↓                ↓
  Add Income   Log Expenses   Pattern Rec.   AI Recs.        User Actions
```

### 4. Goal Tracking Workflow
```
Goal Setting → Progress Tracking → AI Insights → Strategy Updates → Achievement
     ↓            ↓               ↓            ↓                ↓
  Define Goal   Monitor Data   AI Analysis   Adjust Plan     Goal Complete
```

## 📡 API Documentation

### Authentication Endpoints

#### POST /api/auth/login
```typescript
Request:
{
  email: string;
  password: string;
}

Response:
{
  success: boolean;
  token: string;
  user: User;
}
```

#### POST /api/auth/register
```typescript
Request:
{
  email: string;
  password: string;
  name: string;
  incomeType: 'fixed' | 'variable';
  monthlyIncome: number;
}
```

### Financial Data Endpoints

#### GET /api/transactions
```typescript
Response:
{
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
}
```

#### POST /api/transactions
```typescript
Request:
{
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
}
```

#### GET /api/budgets
```typescript
Response:
{
  budgets: Budget[];
  suggestions: AISuggestion[];
  overspending: BudgetAlert[];
}
```

### AI Coaching Endpoints

#### POST /api/ai/coach
```typescript
Request:
{
  question: string;
  context: {
    transactions: Transaction[];
    budgets: Budget[];
    goals: Goal[];
    monthlyIncome: number;
  };
}

Response:
{
  advice: string;
  actionableSteps: string[];
  confidence: number;
  followUpQuestions: string[];
}
```

#### POST /api/ai/analyze
```typescript
Request:
{
  dataType: 'spending' | 'budget' | 'goals';
  data: any[];
}

Response:
{
  insights: AIInsight[];
  recommendations: string[];
  riskFactors: string[];
}
```

## 🗄️ Database Schema

### User Collection
```typescript
interface User {
  _id: ObjectId;
  email: string;
  name: string;
  passwordHash: string;
  incomeType: 'fixed' | 'variable';
  monthlyIncome: number;
  financialGoals: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Transaction Collection
```typescript
interface Transaction {
  _id: ObjectId;
  userId: ObjectId;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  tags: string[];
  createdAt: Date;
}
```

### Budget Collection
```typescript
interface Budget {
  _id: ObjectId;
  userId: ObjectId;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}
```

### Goal Collection
```typescript
interface Goal {
  _id: ObjectId;
  userId: ObjectId;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
}
```

### AIInsight Collection
```typescript
interface AIInsight {
  _id: ObjectId;
  userId: ObjectId;
  type: 'spending' | 'budget' | 'goal' | 'general';
  insight: string;
  confidence: number;
  actionableSteps: string[];
  createdAt: Date;
  expiresAt: Date;
}
```

## 🧩 Component Structure

### Core Components

#### AICoach Components
- **CoachingDashboard**: Main AI coaching interface
- **FinancialAnalysis**: AI-powered financial insights
- **ConversationFlow**: Chat-like interaction with AI

#### Budget Components
- **BudgetForm**: Create and edit budgets
- **BudgetOverview**: Visual budget representation
- **SmartBudgetSuggestions**: AI-generated recommendations

#### Dashboard Components
- **QuickStats**: Key financial metrics
- **RecentTransactions**: Latest financial activity
- **FinancialHealthScore**: Overall financial wellness
- **AIInsights**: AI-generated recommendations

#### Goals Components
- **GoalCard**: Individual goal display
- **GoalForm**: Goal creation and editing
- **GoalInsights**: AI-powered goal optimization

## 🔐 Security & Authentication

### Authentication Flow
1. **User Registration**: Email/password with validation
2. **Login**: JWT token generation
3. **Token Validation**: Middleware-based protection
4. **Session Management**: Secure token storage

### Security Features
- **Password Hashing**: bcrypt for secure storage
- **JWT Tokens**: Stateless authentication
- **Input Validation**: Sanitization and validation
- **Rate Limiting**: API abuse prevention
- **CORS Protection**: Cross-origin security

### Environment Variables
```env
# Required
VITE_OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_connection_string

# Optional
VITE_GROK_API_KEY=your_grok_api_key
N8N_WEBHOOK_SECRET=your_webhook_secret
PORT=3001
NODE_ENV=development
```

## 🚀 Deployment Guide

### Prerequisites
- Node.js 18+
- MongoDB instance
- OpenAI API key
- Git repository access

### Local Development Setup
```bash
# Clone repository
git clone https://github.com/AyushKumar1000/FinanceAI.git
cd FinanceAI

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev

# Start backend server (in separate terminal)
cd server
npm run dev
```

### Production Deployment
```bash
# Build frontend
npm run build

# Set production environment variables
export NODE_ENV=production
export MONGODB_URI=your_production_mongodb_uri
export VITE_OPENAI_API_KEY=your_production_openai_key

# Start production server
npm run start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build individual containers
docker build -t financeai-frontend .
docker build -t financeai-backend ./server
```

## 🛠️ Troubleshooting

### Common Issues

#### API Key Errors
```bash
Error: OPENAI_API_KEY environment variable not set
Solution: Ensure VITE_OPENAI_API_KEY is set in .env.local
```

#### MongoDB Connection Issues
```bash
Error: MongoDB connection failed
Solution: Verify MONGODB_URI and network access
```

#### Build Errors
```bash
Error: TypeScript compilation failed
Solution: Run npm run type-check and fix type issues
```

### Performance Optimization
- **Database Indexing**: Ensure proper indexes on frequently queried fields
- **Caching**: Implement Redis for session and data caching
- **CDN**: Use CDN for static assets in production
- **Compression**: Enable gzip compression for API responses

### Monitoring & Logging
- **Error Tracking**: Implement error monitoring (Sentry, LogRocket)
- **Performance Monitoring**: Use APM tools for backend monitoring
- **User Analytics**: Track user behavior and feature usage
- **Health Checks**: Implement health check endpoints

## 📚 Additional Resources

### Development Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **TypeScript**: Type safety and development experience
- **Vite**: Fast development and building

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: User workflow testing
- **Performance Tests**: Load and stress testing

### Future Enhancements
- **Mobile App**: React Native implementation
- **Advanced AI**: Custom financial models
- **Social Features**: Community and sharing
- **Bank Integration**: Direct bank account connections
- **Investment Tracking**: Portfolio management features

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Ayush Kumar  
**Repository**: [https://github.com/AyushKumar1000/FinanceAI](https://github.com/AyushKumar1000/FinanceAI)
