import { Request, Response, NextFunction } from 'express';

// Simple webhook authentication middleware
export const authenticateWebhook = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET || 'your-secure-webhook-secret';
  
  if (!authHeader || authHeader !== `Bearer ${webhookSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// JWT authentication middleware (for future use)
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  // Implementation for JWT authentication
  // This can be used for user authentication in the future
  next();
};
