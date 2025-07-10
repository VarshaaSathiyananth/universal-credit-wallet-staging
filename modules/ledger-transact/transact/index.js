const WALLET_API = "https://candidate-00x-wallet-ledger-aloksingh.onrender.com";

const express = require("express");
const axios = require("axios"); // to call Wallet Service
const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Transaction Processor</title>
        <style>
          body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #222;
          }
          h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          pre {
            background: #eee;
            padding: 10px;
            border-radius: 8px;
            font-size: 14px;
            max-width: 600px;
            overflow-x: auto;
          }
        </style>
      </head>
      <body>
        <h1>💸 Transaction Processor Running</h1>
        <p>Use the following endpoints with <code>POST</code> requests:</p>
        <pre>
POST /api/transactions/purchase   { userId, amountUsd }
POST /api/transactions/entry      { userId, contestId, tier }
POST /api/transactions/payout     { userId, contestId, takePrize: true }
POST /api/transactions/rollover   { userId, contestId }
        </pre>
        <p>Test with tools like <strong>Postman</strong> or <strong>curl</strong>.</p>
      </body>
    </html>
  `);
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//purchase

app.post("/api/transactions/purchase", async (req, res) => {
  const { userId, amountUsd } = req.body;
  const creditAmount = amountUsd * 10;

  try {
    const response = await axios.post(`${WALLET_API}/api/wallet/credit`, {
      userId,
      event: "usd_purchase",
      amount: creditAmount,
      refId: `purchase-${Date.now()}`
    });
    res.json({ success: true, credited: creditAmount, wallet: response.data });
  } catch (err) {
    res.status(500).json({ error: "Purchase failed", details: err.message });
  }
});

//entry
app.post("/api/transactions/entry", async (req, res) => {
  const { userId, contestId, tier } = req.body;

  const entryAmount = tier * 10; // example: tier 3 = 30 credits

  try {
    const response = await axios.post(`${WALLET_API}/api/wallet/debit`, {
      userId,
      event: `contest_entry_${contestId}`,
      amount: entryAmount,
      refId: `entry-${contestId}-${Date.now()}`
    });
    res.json({ success: true, debited: entryAmount, wallet: response.data });
  } catch (err) {
    res.status(500).json({ error: "Entry failed", details: err.response?.data || err.message });
  }
});

//payout 
app.post("/api/transactions/payout", async (req, res) => {
  const { userId, contestId, takePrize } = req.body;
  const prize = 100;

  if (!takePrize) {
    return res.json({ message: "Prize declined" });
  }

  try {
    const response = await axios.post(`${WALLET_API}/api/wallet/credit`, {
      userId,
      event: `contest_win_${contestId}`,
      amount: prize,
      refId: `payout-${contestId}-${Date.now()}`
    });
    res.json({ success: true, credited: prize, wallet: response.data });
  } catch (err) {
    res.status(500).json({ error: "Payout failed", details: err.message });
  }
});

//rollover

app.post("/api/transactions/rollover", async (req, res) => {
  const { userId, contestId } = req.body;
  const prize = 100;
  const rolloverAmount = prize / 2;

  try {
    const response = await axios.post(`${WALLET_API}/api/wallet/credit`, {
      userId,
      event: `contest_rollover_${contestId}`,
      amount: rolloverAmount,
      refId: `rollover-${contestId}-${Date.now()}`
    });
    res.json({ success: true, credited: rolloverAmount, discarded: rolloverAmount, wallet: response.data });
  } catch (err) {
    res.status(500).json({ error: "Rollover failed", details: err.message });
  }
});



