const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory store
const wallets = {};  // userId: { balance: number, ledger: [] }

app.get("/", (req, res) => {
  res.send("Wallet Service Running");
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
