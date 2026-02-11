require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.post('/api/chatbot', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const stockQueryMatch = message.match(/price of (\w+)/i) || message.match(/stock price for (\w+)/i);

  if (stockQueryMatch) {
    const symbol = stockQueryMatch[1].toUpperCase();
    const apiKey = process.env.ALPHAVANTAGE_API_KEY;

    if (apiKey === 'YOUR_API_KEY' || !apiKey) {
      return res.json({ response: 'Please configure your Alpha Vantage API key in the .env file.' });
    }
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data['Error Message']) {
        return res.json({ response: `Sorry, I couldn't find the stock price for ${symbol}.` });
      }
      const timeSeries = response.data['Time Series (Daily)'];
      if (!timeSeries) {
        return res.json({ response: `Sorry, I couldn't find the stock price for ${symbol}.` });
      }
      const latestDate = Object.keys(timeSeries)[0];
      const latestPrice = timeSeries[latestDate]['4. close'];
      return res.json({ response: `The latest closing price for ${symbol} is $${latestPrice}.` });
    } catch (error) {
      return res.json({ response: 'Sorry, I am having trouble fetching stock data right now.' });
    }
  } else {
    const botResponse = `Bot: You said "${message}"`;
    res.json({ response: botResponse });
  }
});

app.get('/api/stock/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const apiKey = process.env.ALPHAVANTAGE_API_KEY;
  // IMPORTANT: Replace YOUR_API_KEY in .env with your actual Alpha Vantage API key
  if (apiKey === 'YOUR_API_KEY' || !apiKey) {
    return res.status(400).json({ error: 'Please configure your Alpha Vantage API key in the .env file.' });
  }
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data['Error Message']) {
      return res.status(400).json({ error: response.data['Error Message'] });
    }
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock data.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
