require('dotenv').config(); 
const express = require('express');
const axios = require('axios'); 

const app = express();
const port = 3001; 


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Event Bus API is running. Use POST /api/events/publish.');
});

// This is the main endpoint for receiving events
app.post('/api/events/publish', async (req, res) => {
  const { type, payload } = req.body;

  console.log(`Event received: type = ${type}`);

  // Check if the event type is "PRIZE"
  if (type === 'PRIZE') {
    console.log('PRIZE event detected! Triggering enrollment process...');
    try {
      const userId = payload.userId;
      console.log(`--> Making call to /api/enroll for userId: ${userId}`);

      
      const enrollUrl = process.env.ENROLL_SERVICE_URL;
      if (!enrollUrl) {
        throw new Error('ENROLL_SERVICE_URL is not set');
      }

      await axios.post(enrollUrl, {
        userId: userId,
        eventType: 'PRIZE_WIN'
      });

      console.log('--> Enrollment call successful!');
    } catch (error) {
      console.error('--> Enrollment call failed:', error.message);
    }
  }


  res.status(200).json({ message: "Event processed successfully." });
});


app.post('/api/enroll', (req, res) => {
  console.log('Enroll endpoint called:', req.body);
  res.status(200).json({ message: 'User enrolled successfully.' });
});


app.listen(port, () => {
  console.log(`Events service is running on http://localhost:${port}`);
});
