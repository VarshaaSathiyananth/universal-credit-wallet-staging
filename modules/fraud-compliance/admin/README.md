# Universal Credit Wallet - Admin Dashboard

A modern Next.js admin dashboard for managing the Universal Credit Wallet system, built with shadcn/ui components and Tailwind CSS.

## Features

- 📊 **Overview Dashboard** - Key metrics and stats at a glance
- 👥 **User Management** - View user balances and account status
- 🚨 **Fraud Detection** - Monitor and resolve fraud flags
- 📋 **Audit Logs** - Track all system activities
- ⚙️ **Credit Configuration** - Manage credit rules and limits
- 🎨 **Modern UI** - Beautiful interface with shadcn/ui components
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Hooks

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Start Development Server

```bash
npm run dev
```

The dashboard will be available at [http://localhost:3000](http://localhost:3000)

## API Integration

The dashboard integrates with the Fraud & Compliance API endpoints:

- `GET /api/fraud/flags` - Fraud monitoring
- `POST /api/fraud/resolve` - Resolve fraud flags
- `GET /api/audit/logs` - Audit trail
- `GET /api/admin/users` - User management
- `GET /api/admin/config` - Configuration management
- `PUT /api/admin/config` - Update configuration

## Dashboard Sections

### Overview
- User statistics (total, active, flagged)
- Pending fraud flags count
- Total balance across all accounts
- Recent activity summary
- Quick actions for fraud resolution

### User Management
- List all users with balances
- View user status (active, flagged, suspended)
- User account details and history

### Fraud Flags
- Real-time fraud detection alerts
- Approve/reject fraud flags
- Filter by status (pending, resolved, rejected)
- Detailed fraud information

### Audit Logs
- Complete activity trail
- Admin actions tracking
- System changes history
- Timestamped entries with user context

## Deployment

### Vercel (Recommended)

1. **Connect GitHub Repository**
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub account
   - Import the repository
   - Set environment variables:
     - `NEXT_PUBLIC_API_URL`: Your backend API URL

3. **Auto-deployment**
   - Automatic deployments on every push to main branch

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Set environment variables
railway variables set NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

### Netlify

```bash
# Build the project
npm run build

# Deploy to Netlify
npx netlify-cli deploy --prod --dir=out
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001` | Yes |

## Project Structure

```
wallet-dashboard-frontend/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with shadcn/ui variables
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── components/
│   └── ui/                # shadcn/ui components
│       ├── button.tsx     # Button component
│       └── card.tsx       # Card component
├── lib/
│   ├── api.ts            # API client and types
│   └── utils.ts          # Utility functions
├── public/               # Static assets
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Types

The dashboard uses TypeScript interfaces for type safety:

```typescript
interface User {
  userId: string
  username: string
  balance: number
  status: 'active' | 'flagged' | 'suspended'
}

interface FraudFlag {
  entryId: string
  reason: string
  userId: string
  amount: number
  timestamp: string
  status: 'pending' | 'resolved' | 'rejected'
}

interface AuditLog {
  entryId: string
  changes: string
  timestamp: string
  userId: string
  adminId: string
  action: string
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License

## Support

For support, please contact the development team or create an issue in the repository.
# candidate-00X-wallet-admin-ameydabhade
