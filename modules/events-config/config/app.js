require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;
const CONFIG_FILE = 'creditConfig.json';


app.use(express.json());
app.use(cors());

// Load config from file or use default
let creditConfig;
if (fs.existsSync(CONFIG_FILE)) {
  creditConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
} else {
  creditConfig = {
    rate: 100,
    tiers: {
      bronze: { fee: 0.05, rollover_percentage: 10 },
      silver: { fee: 0.03, rollover_percentage: 15 },
      gold: { fee: 0.01, rollover_percentage: 20 }
    }
  };
}

// Helper: Validate config structure
function isValidConfig(config) {
  if (
    typeof config !== 'object' ||
    typeof config.rate !== 'number' ||
    typeof config.tiers !== 'object'
  ) return false;
  for (const tier of ['bronze', 'silver', 'gold']) {
    if (
      !config.tiers[tier] ||
      typeof config.tiers[tier].fee !== 'number' ||
      typeof config.tiers[tier].rollover_percentage !== 'number'
    ) return false;
  }
  return true;
}

// GET endpoint to fetch the credit configuration
app.get('/api/config/credits', (req, res) => {
  res.status(200).json(creditConfig);
});

// PUT endpoint to update the credit configuration
app.put('/api/config/credits', (req, res) => {
  const newConfig = req.body;
  if (!isValidConfig(newConfig)) {
    return res.status(400).json({ message: 'Bad Request: Invalid configuration structure.' });
  }
  creditConfig = newConfig;
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(creditConfig, null, 2));
  res.status(200).json({
    message: 'Configuration updated successfully!',
    newConfig: creditConfig
  });
});

// Start the server

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
