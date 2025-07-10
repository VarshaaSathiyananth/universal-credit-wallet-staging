// modules/events-config/config/api/config.js

import fs from 'fs';

const CONFIG_FILE = 'creditConfig.json';

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

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(creditConfig);
  }

  if (req.method === 'PUT') {
    const newConfig = req.body;

    if (
      typeof newConfig !== 'object' ||
      typeof newConfig.rate !== 'number' ||
      typeof newConfig.tiers !== 'object'
    ) {
      return res.status(400).json({ message: 'Invalid configuration structure.' });
    }

    creditConfig = newConfig;
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(creditConfig, null, 2));
    return res.status(200).json({ message: 'Updated successfully', newConfig });
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}
