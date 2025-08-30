# FinanceAI - AI-Powered Personal Finance Manager

A modern, AI-powered personal finance application built with React, TypeScript, and OpenAI GPT-4, specifically designed for gig workers and people with variable income.

## 🚀 Features

### Core Functionality
- **Personal Finance Tracking**: Monitor income, expenses, and savings
- **Smart Budgeting**: AI-powered budget suggestions and optimization
- **Goal Management**: Set and track financial goals with AI guidance
- **Financial Health Scoring**: Comprehensive financial wellness assessment
- **Transaction Management**: Categorize and analyze spending patterns

### AI-Powered Features
- **AI Financial Coach**: Real-time financial advice using OpenAI GPT-4
- **Smart Budget Suggestions**: Personalized budget recommendations
- **Spending Analysis**: AI-driven insights into spending patterns
- **Goal Planning**: AI-assisted financial goal setting and tracking
- **Personalized Insights**: Context-aware financial recommendations

### User Experience
- **Modern Dark UI**: Beautiful, responsive interface with Tailwind CSS
- **Real-time Updates**: Instant feedback and data synchronization
- **Mobile-First Design**: Optimized for all device sizes
- **Smooth Animations**: Framer Motion powered interactions

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI Integration**: OpenAI GPT-4 API
- **State Management**: React Hooks + Local Storage
- **Charts**: Recharts
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FinanceAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up OpenAI API key**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   **Note**: You'll need to obtain your own OpenAI API key from [OpenAI's platform](https://platform.openai.com/api-keys)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5177` (or the port shown in terminal)

## 🔑 OpenAI API Integration

### API Configuration
The project is configured to use OpenAI's GPT-4 model for financial advice and insights.

**Current Configuration:**
- **Model**: gpt-4o-mini
- **Max Tokens**: 1000
- **Temperature**: 0.7 (balanced creativity and consistency)
- **API Endpoint**: https://api.openai.com/v1/chat/completions

### AI Services Available

#### 1. Financial Coaching
- Personalized financial advice based on user data
- Context-aware responses to financial questions
- Real-time coaching conversations powered by OpenAI

#### 2. Budget Optimization
- AI-generated budget suggestions
- Spending pattern analysis
- Personalized budget recommendations

#### 3. Goal Planning
- Financial goal prioritization
- Timeline recommendations
- Saving strategy suggestions

#### 4. Spending Analysis
- Pattern recognition
- Improvement suggestions
- Positive habit identification

#### 5. Emergency Fund Planning
- Status assessment
- Monthly savings targets
- Variable income strategies

### API Usage Examples

```typescript
// Get personalized financial coaching
const advice = await OpenAIService.getFinancialCoaching(
  "How can I save more money?",
  transactions,
  budgets,
  goals
);

// Analyze spending patterns
const analysis = await OpenAIService.analyzeSpending(transactions);

// Get budget advice
const budgetAdvice = await OpenAIService.getBudgetAdvice(
  transactions,
  budgets,
  monthlyIncome
);
```

## 📱 Application Structure

### Pages
- **Dashboard**: Financial overview and AI insights
- **Transactions**: Income and expense tracking
- **Budget**: Budget management and AI suggestions
- **Goals**: Financial goal setting and tracking
- **AI Coach**: Interactive financial coaching powered by OpenAI
- **Profile**: User settings and account management

### Components
- **AI Coach**: OpenAI-powered financial advisor
- **Smart Budget Suggestions**: AI-generated budget recommendations
- **Financial Analysis**: Spending pattern analysis
- **Goal Insights**: AI-powered goal planning
- **Quick Stats**: Financial metrics dashboard

## 🎯 Target Audience

This application is specifically designed for:
- **Gig Workers**: Uber, DoorDash, freelance professionals
- **Variable Income Earners**: People with irregular income streams
- **Financial Beginners**: Those starting their financial journey
- **Budget-Conscious Users**: People looking to optimize spending

## 🔒 Security & Privacy

- **Local Storage**: All financial data is stored locally
- **No External Servers**: Your data never leaves your device
- **OpenAI API**: Only sends necessary data for AI responses
- **Environment Variables**: API keys can be configured securely

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy
The built files in the `dist` folder can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your OpenAI API key is valid
3. Ensure you have sufficient API credits
4. Check the network tab for API call failures

## 🔮 Future Enhancements

- **Multi-currency Support**: International financial management
- **Investment Tracking**: Portfolio management and analysis
- **Tax Planning**: AI-powered tax optimization
- **Credit Score Monitoring**: Credit health tracking
- **Mobile App**: Native iOS and Android applications
- **Bank Integration**: Real-time transaction syncing
- **Advanced Analytics**: Machine learning insights

## 🎉 Acknowledgments

- **OpenAI** for providing the GPT-4 API
- React and TypeScript communities
- Tailwind CSS for the beautiful UI framework
- All contributors and users of this project

---

**Built with ❤️ and powered by OpenAI for better financial futures**
