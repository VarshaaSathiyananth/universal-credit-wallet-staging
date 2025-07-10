# Transaction Processor Service – Alok Singh

This is Module BE-2 of the Alatree Tech Assessment. It handles transactions related to user purchases, contest entries, prize payouts, and rollover logic, using the Wallet Ledger backend service.

---

## 🔗 Live Deployment

**BE-2 Live URL:**  
https://candidate-00x-wallet-transact-aloksingh.onrender.com

**GitHub Repo:**  
https://github.com/aloksinghup67/candidate-00X-wallet-transact-aloksingh

**BE-1 Wallet URL:**  
https://candidate-00x-wallet-ledger-aloksingh.onrender.com

---

## 📘 API Endpoints

### 1. `POST /api/transactions/purchase`
Convert real USD to credits (10 credits per USD)

**Request Body:**
```json
{
  "userId": "user1",
  "amountUsd": 5
}
Description:
Credits amountUsd * 10 to the user's wallet via BE-1.

2. POST /api/transactions/entry
Debit wallet when entering a contest (tier × 10 credits)

Request Body:

json
Copy
Edit
{
  "userId": "user1",
  "contestId": "abc123",
  "tier": 2
}
Description:
Debits credits equal to tier * 10 from user's wallet via BE-1.

3. POST /api/transactions/payout
Payout credits if the user wins a contest (100 credits)

Request Body:

json
Copy
Edit
{
  "userId": "user1",
  "contestId": "abc123",
  "takePrize": true
}
Description:
Credits 100 to the user's wallet if takePrize is true.

4. POST /api/transactions/rollover
Rollover winnings: 50% credited to wallet, 50% discarded

Request Body:

json
Copy
Edit
{
  "userId": "user1",
  "contestId": "abc123"
}
Description:
Credits 50% of fixed prize (100) to wallet, discards the other 50%.

📦 Dependencies
Node.js

Express

Axios

⚙️ Setup Instructions
Clone the repo:
git clone https://github.com/aloksinghup67/candidate-00X-wallet-transact-aloksingh
cd candidate-00X-wallet-transact-aloksingh
Install dependencies:

npm install
Start the server:
node index.js
Server runs at http://localhost:3001

📡 Wallet API Communication
All credit/debit logic is delegated to BE-1 (Wallet Ledger) service:

URL: https://candidate-00x-wallet-ledger-aloksingh.onrender.com

