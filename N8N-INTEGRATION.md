# n8n Integration Guide

This document explains how to set up and use n8n for automating workflows in the Financial Coach application.

## Prerequisites

- Docker and Docker Compose installed
- Node.js and npm/yarn
- MongoDB instance running

## Setting Up n8n

1. Copy the example environment file and update it with your configuration:
   ```bash
   cp .env.example .env
   ```

2. Start n8n using Docker Compose:
   ```bash
   docker-compose -f docker-compose.n8n.yml up -d
   ```

3. Access the n8n web interface at: http://localhost:5678
   - Username: admin
   - Password: your-secure-password (as set in docker-compose.n8n.yml)

## Available Webhook Endpoints

### User Webhooks
- **URL**: `POST /api/webhooks/users`
- **Authentication**: Bearer token (set in N8N_WEBHOOK_SECRET)
- **Events**:
  - `user.created`: Triggered when a new user is created
  - `user.updated`: Triggered when a user is updated

### Transaction Webhooks
- **URL**: `POST /api/webhooks/transactions`
- **Authentication**: Bearer token (set in N8N_WEBHOOK_SECRET)
- **Events**:
  - `transaction.created`: Triggered when a new transaction is created
  - `transaction.updated`: Triggered when a transaction is updated

## Example n8n Workflows

### 1. Welcome Email for New Users
1. **Trigger**: Webhook (`user.created` event)
2. **Action**: Send email using your preferred email service (e.g., SendGrid, Mailchimp)
3. **Action**: Add user to your mailing list

### 2. Budget Alert Notification
1. **Trigger**: Webhook (`transaction.created` event)
2. **Action**: Check if transaction exceeds budget
3. **Condition**: If over budget, send notification (email/SMS)

### 3. Weekly Financial Report
1. **Trigger**: Schedule (every Monday at 9 AM)
2. **Action**: Generate financial report
3. **Action**: Send report to user via email

## Security Considerations

1. Always use HTTPS for webhook endpoints in production
2. Rotate the webhook secret (`N8N_WEBHOOK_SECRET`) regularly
3. Implement rate limiting on webhook endpoints
4. Validate all incoming webhook data

## Troubleshooting

- **n8n not starting**: Check if port 5678 is already in use
- **Webhook authentication fails**: Verify the webhook secret matches in both n8n and your .env file
- **Database connection issues**: Ensure MongoDB is running and accessible

## Next Steps

1. Create more complex workflows based on your application's needs
2. Set up monitoring for your n8n instance
3. Implement error handling and retries for failed workflows
