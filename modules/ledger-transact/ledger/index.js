const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

app.use(express.json());

//in menmory
const wallets = {};  // userId: { balance: number, ledger: [] }

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Wallet Service</title>
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
        <h1>💼 Wallet Service Running</h1>
        <p>Use the following API endpoints:</p>
        <pre>
POST /api/wallet/credit   { userId, event, amount, refId }
POST /api/wallet/debit    { userId, event, amount, refId }
GET  /api/wallet/balance  ?userId=...
GET  /api/wallet/ledger   ?userId=...
        </pre>
        <p>Call these using <strong>Postman</strong>, <strong>curl</strong>, or your front-end app.</p>
      </body>
    </html>
  `);
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.post("/api/wallet/credit", (req, res) => {
  const { userId, event, amount, refId } = req.body;

  if (!wallets[userId]) {
    wallets[userId] = { balance: 0, ledger: [] };
  }

  wallets[userId].balance += amount;

  wallets[userId].ledger.push({
    entryId: uuidv4(),
    type: "credit",
    amount,
    event,
    refId,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, balance: wallets[userId].balance });
});

app.post("/api/wallet/debit", (req, res) => {
  const { userId, event, amount, refId } = req.body;

  if (!wallets[userId]) return res.status(404).json({ error: "Wallet not found" });
  if (wallets[userId].balance < amount) return res.status(400).json({ error: "Insufficient balance" });

  wallets[userId].balance -= amount;

  wallets[userId].ledger.push({
    entryId: uuidv4(),
    type: "debit",
    amount,
    event,
    refId,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, balance: wallets[userId].balance });
});
app.get("/api/wallet/balance", (req, res) => {
  const { userId } = req.query;
  if (!wallets[userId]) return res.status(404).json({ error: "Wallet not found" });

  res.json({ balanceCredits: wallets[userId].balance });
});

app.get("/api/wallet/ledger", (req, res) => {
  const { userId } = req.query;
  if (!wallets[userId]) return res.status(404).json({ error: "Wallet not found" });

  res.json(wallets[userId].ledger);
});
