# Universal Credit Wallet - Fraud & Compliance API

Backend service for monitoring abnormal credit flows, fraud detection, and compliance tracking.

## Features

- 🚨 Fraud flag monitoring and resolution
- 📋 Comprehensive audit logging
- 👥 User balance management
- ⚙️ Credit configuration management
- 🔒 Input validation and error handling
- 📊 Health monitoring

## API Endpoints

### Fraud Management
- `GET /api/fraud/flags` - Get flagged entries
- `POST /api/fraud/resolve` - Resolve fraud flags

### Audit & Compliance
- `GET /api/audit/logs` - Get audit logs with pagination

### Admin Management
- `GET /api/admin/users` - Get user balances
- `GET /api/admin/config` - Get credit configuration
- `PUT /api/admin/config` - Update credit configuration

### System
- `GET /health` - Health check endpoint

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Start production server:**
   ```bash
   npm start
   ```

## Deployment

### Heroku
```bash
# Create Heroku app
heroku create candidate-00X-wallet-fraud-[yourname]

# Deploy
git add .
git commit -m "Initial commit"
git push heroku main
```

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

### Render
1. Connect GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## API Examples

### Get Fraud Flags
```bash
curl -X GET http://localhost:3001/api/fraud/flags
```

### Resolve Fraud Flag
```bash
curl -X POST http://localhost:3001/api/fraud/resolve \
  -H "Content-Type: application/json" \
  -d '{"entryId":"flag-id","action":"approve"}'
```

### Get Audit Logs
```bash
curl -X GET "http://localhost:3001/api/audit/logs?limit=10&offset=0"
```

## Tech Stack

- Node.js + Express
- Joi for validation
- Helmet for security
- Morgan for logging
- CORS enabled for frontend integration

## License

MIT # candidate-00X-wallet-fraud-ameydabhade
