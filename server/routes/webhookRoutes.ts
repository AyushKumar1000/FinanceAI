import express from 'express';
import { Request, Response } from 'express';
import User from '../src/models/User';
import { authenticateWebhook } from '../middleware/auth';

const router = express.Router();

// Middleware to verify n8n webhook secret
router.use(authenticateWebhook);

// Webhook for user events
router.post('/users', async (req: Request, res: Response) => {
  try {
    const { event, data } = req.body;
    
    switch (event) {
      case 'user.created':
        // Handle new user creation
        const user = new User(data);
        await user.save();
        break;
        
      case 'user.updated':
        // Handle user updates
        await User.findByIdAndUpdate(data.id, data, { new: true });
        break;
        
      default:
        return res.status(400).json({ error: 'Unsupported event type' });
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Webhook for financial events
router.post('/transactions', async (req: Request, res: Response) => {
  try {
    const { event, data } = req.body;
    
    // Add your transaction processing logic here
    // Example: Categorize transactions, update budgets, etc.
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Transaction webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
