# MongoDB Setup Guide for FinanceAI

## 🗄️ Setting up MongoDB for FinanceAI

### **Prerequisites**
- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account

### **Option 1: Local MongoDB Installation**

#### **Install MongoDB Community Edition**

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. Start MongoDB service

**Linux (Ubuntu):**
```bash
sudo apt-get install gnupg curl
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### **Verify MongoDB is Running**
```bash
mongosh
# or
mongo
```

### **Option 2: MongoDB Atlas (Cloud)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Set up database access (username/password)
5. Set up network access (IP whitelist)
6. Get your connection string

### **Environment Configuration**

Create a `.env` file in your project root:

```env
# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/financeai

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/financeai?retryWrites=true&w=majority

# Optional: MongoDB connection options
MONGODB_MAX_POOL_SIZE=10
MONGODB_SERVER_SELECTION_TIMEOUT=5000
MONGODB_SOCKET_TIMEOUT=45000
```

### **Database Initialization**

The application will automatically:
1. Connect to MongoDB on startup
2. Create the necessary collections
3. Set up indexes for optimal performance
4. Migrate existing localStorage data (if available)

### **Testing the Connection**

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Check the console for MongoDB connection status:
   ```
   ✅ MongoDB connected successfully
   ```

3. If you see connection errors, verify:
   - MongoDB service is running
   - Connection string is correct
   - Network access is configured (for Atlas)

### **Database Collections**

The application will create these collections:
- **users** - User profiles and settings
- **transactions** - Income and expense records
- **budgets** - Budget categories and limits
- **goals** - Financial goals and progress
- **aiinsights** - AI-generated financial insights

### **Data Migration**

Existing localStorage data will be automatically migrated to MongoDB:
- User profile information
- Transaction history
- Budget settings
- Financial goals
- AI insights

### **Troubleshooting**

#### **Connection Refused**
- Ensure MongoDB service is running
- Check if port 27017 is available
- Verify firewall settings

#### **Authentication Failed**
- Check username/password in connection string
- Verify database user permissions
- Ensure IP is whitelisted (for Atlas)

#### **Network Timeout**
- Check internet connection (for Atlas)
- Verify network access settings
- Increase timeout values in environment

### **Performance Optimization**

The application includes:
- Database indexes for fast queries
- Connection pooling for scalability
- Efficient data models with validation
- Automatic data cleanup and maintenance

### **Backup and Recovery**

**Local MongoDB:**
```bash
# Backup
mongodump --db financeai --out ./backup

# Restore
mongorestore --db financeai ./backup/financeai
```

**MongoDB Atlas:**
- Use the built-in backup service
- Schedule automated backups
- Point-in-time recovery available

### **Security Considerations**

- All data is stored locally or in your private MongoDB instance
- No data is shared with third parties (except OpenAI for AI responses)
- Database connections use secure protocols
- User data is isolated by user ID

---

**Need Help?** Check the console for detailed error messages or refer to MongoDB documentation.
