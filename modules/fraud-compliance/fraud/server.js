const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

let fraudFlags = [
  {
    entryId: uuidv4(),
    reason: 'Duplicate transaction detected',
    userId: 'user_001',
    amount: 500,
    timestamp: moment().subtract(2, 'hours').toISOString(),
    status: 'resolved',
    resolvedAt: moment().subtract(1, 'hour').toISOString()
  },
  {
    entryId: uuidv4(),
    reason: 'Abnormal credit spike - 10x normal activity',
    userId: 'user_002', 
    amount: 2500,
    timestamp: moment().subtract(1, 'hour').toISOString(),
    status: 'resolved',
    resolvedAt: moment().subtract(30, 'minutes').toISOString()
  },
  {
    entryId: uuidv4(),
    reason: 'Suspicious referral pattern',
    userId: 'user_003',
    amount: 150,
    timestamp: moment().subtract(30, 'minutes').toISOString(),
    status: 'resolved'
  },
  {
    entryId: uuidv4(),
    reason: 'Multiple rapid transactions from same IP',
    userId: 'user_005',
    amount: 750,
    timestamp: moment().subtract(15, 'minutes').toISOString(),
    status: 'pending'
  },
  {
    entryId: uuidv4(),
    reason: 'Credit earned exceeds daily limit by 300%',
    userId: 'user_006',
    amount: 3200,
    timestamp: moment().subtract(10, 'minutes').toISOString(),
    status: 'pending'
  },
  {
    entryId: uuidv4(),
    reason: 'Unusual purchase pattern - gaming the system',
    userId: 'user_002',
    amount: 1200,
    timestamp: moment().subtract(8, 'minutes').toISOString(),
    status: 'pending'
  },
  {
    entryId: uuidv4(),
    reason: 'Bot-like activity detected - automated clicks',
    userId: 'user_007',
    amount: 450,
    timestamp: moment().subtract(5, 'minutes').toISOString(),
    status: 'pending'
  },
  {
    entryId: uuidv4(),
    reason: 'Referral fraud - self-referrals detected',
    userId: 'user_003',
    amount: 850,
    timestamp: moment().subtract(3, 'minutes').toISOString(),
    status: 'pending'
  },
  {
    entryId: uuidv4(),
    reason: 'Account takeover suspected - login from 5 countries',
    userId: 'user_008',
    amount: 2100,
    timestamp: moment().subtract(1, 'minute').toISOString(),
    status: 'pending'
  }
];

let auditLogs = [
  {
    entryId: uuidv4(),
    changes: 'Credit adjustment: +500 for contest win',
    timestamp: moment().subtract(3, 'hours').toISOString(),
    userId: 'user_001',
    adminId: 'admin_001',
    action: 'credit_added'
  },
  {
    entryId: uuidv4(),
    changes: 'Fraud flag resolved: duplicate transaction',
    timestamp: moment().subtract(1, 'hour').toISOString(),
    userId: 'user_002',
    adminId: 'admin_001',
    action: 'fraud_resolved'
  },
  {
    entryId: uuidv4(),
    changes: 'User balance reset due to violation',
    timestamp: moment().subtract(45, 'minutes').toISOString(),
    userId: 'user_003',
    adminId: 'admin_002',
    action: 'balance_reset'
  },
  {
    entryId: uuidv4(),
    changes: 'New fraud flag created: Multiple rapid transactions from same IP',
    timestamp: moment().subtract(15, 'minutes').toISOString(),
    userId: 'user_005',
    adminId: 'system',
    action: 'fraud_flag_created'
  },
  {
    entryId: uuidv4(),
    changes: 'Account suspended: Excessive fraud activity detected',
    timestamp: moment().subtract(12, 'minutes').toISOString(),
    userId: 'user_008',
    adminId: 'admin_001',
    action: 'account_suspended'
  },
  {
    entryId: uuidv4(),
    changes: 'Credit earned: +200 for purchase completion',
    timestamp: moment().subtract(10, 'minutes').toISOString(),
    userId: 'user_009',
    adminId: 'system',
    action: 'credit_earned'
  },
  {
    entryId: uuidv4(),
    changes: 'Referral bonus awarded: +50 credits',
    timestamp: moment().subtract(8, 'minutes').toISOString(),
    userId: 'user_010',
    adminId: 'system',
    action: 'referral_bonus'
  },
  {
    entryId: uuidv4(),
    changes: 'Content submission approved: +25 credits',
    timestamp: moment().subtract(6, 'minutes').toISOString(),
    userId: 'user_001',
    adminId: 'admin_002',
    action: 'content_approved'
  },
  {
    entryId: uuidv4(),
    changes: 'Daily limit breach detected for user_006',
    timestamp: moment().subtract(4, 'minutes').toISOString(),
    userId: 'user_006',
    adminId: 'system',
    action: 'limit_breach'
  },
  {
    entryId: uuidv4(),
    changes: 'Manual credit adjustment: -100 for chargeback',
    timestamp: moment().subtract(2, 'minutes').toISOString(),
    userId: 'user_002',
    adminId: 'admin_001',
    action: 'credit_adjustment'
  }
];

let userBalances = [
  { userId: 'user_001', username: 'john_doe', balance: 1250, status: 'active' },
  { userId: 'user_002', username: 'jane_smith', balance: 890, status: 'flagged' },
  { userId: 'user_003', username: 'bob_wilson', balance: 2150, status: 'active' },
  { userId: 'user_004', username: 'alice_brown', balance: 450, status: 'suspended' },
  { userId: 'user_005', username: 'charlie_wong', balance: 3200, status: 'flagged' },
  { userId: 'user_006', username: 'diana_martinez', balance: 5800, status: 'flagged' },
  { userId: 'user_007', username: 'erik_nielsen', balance: 180, status: 'flagged' },
  { userId: 'user_008', username: 'fiona_taylor', balance: 4750, status: 'suspended' },
  { userId: 'user_009', username: 'george_kim', balance: 920, status: 'active' },
  { userId: 'user_010', username: 'helen_davis', balance: 1580, status: 'active' }
];

let creditConfig = {
  contestWin: 100,
  referral: 50,
  contentSubmission: 25,
  follow: 10,
  purchase: 200,
  dailyLimit: 1000,
  maxSingleTransaction: 500
};

const resolveSchema = Joi.object({
  entryId: Joi.string().required(),
  action: Joi.string().valid('approve', 'reject', 'investigate').required()
});

app.get('/api/fraud/flags', (req, res) => {
  try {
    const { status } = req.query;
    let filteredFlags = fraudFlags;
    
    if (status) {
      filteredFlags = fraudFlags.filter(flag => flag.status === status);
    }
    
    res.json({
      success: true,
      data: filteredFlags,
      count: filteredFlags.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.post('/api/fraud/resolve', (req, res) => {
  try {
    const { error, value } = resolveSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    
    const { entryId, action } = value;
    const flagIndex = fraudFlags.findIndex(flag => flag.entryId === entryId);
    
    if (flagIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Fraud flag not found'
      });
    }
    
    fraudFlags[flagIndex].status = action === 'approve' ? 'resolved' : 'rejected';
    fraudFlags[flagIndex].resolvedAt = moment().toISOString();
    
    const auditEntry = {
      entryId: uuidv4(),
      changes: `Fraud flag ${action}ed: ${fraudFlags[flagIndex].reason}`,
      timestamp: moment().toISOString(),
      userId: fraudFlags[flagIndex].userId,
      adminId: 'admin_001',
      action: `fraud_${action}`
    };
    auditLogs.unshift(auditEntry);
    
    res.json({
      success: true,
      message: `Fraud flag ${action}ed successfully`,
      data: fraudFlags[flagIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/audit/logs', (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    
    const paginatedLogs = auditLogs.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedLogs,
      pagination: {
        total: auditLogs.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: endIndex < auditLogs.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/admin/users', (req, res) => {
  try {
    res.json({
      success: true,
      data: userBalances
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/admin/config', (req, res) => {
  try {
    res.json({
      success: true,
      data: creditConfig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.put('/api/admin/config', (req, res) => {
  try {
    const configSchema = Joi.object({
      contestWin: Joi.number().min(0),
      referral: Joi.number().min(0),
      contentSubmission: Joi.number().min(0),
      follow: Joi.number().min(0),
      purchase: Joi.number().min(0),
      dailyLimit: Joi.number().min(0),
      maxSingleTransaction: Joi.number().min(0)
    });
    
    const { error, value } = configSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    
   
    creditConfig = { ...creditConfig, ...value };
    
    
    const auditEntry = {
      entryId: uuidv4(),
      changes: `Credit configuration updated: ${JSON.stringify(value)}`,
      timestamp: moment().toISOString(),
      userId: 'system',
      adminId: 'admin_001',
      action: 'config_updated'
    };
    auditLogs.unshift(auditEntry);
    
    res.json({
      success: true,
      message: 'Configuration updated successfully',
      data: creditConfig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});


app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: moment().toISOString(),
    service: 'Wallet Fraud & Compliance API'
  });
});


app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Fraud & Compliance API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
}); 