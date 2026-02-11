import React, { useState } from 'react';
import './App.css';
import StockChart from './components/StockChart';
import Chatbot from './components/Chatbot';
import StockTable from './components/StockTable';
import './components/StockTable.css';

function App() {
  const [symbol, setSymbol] = useState('IBM');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const processDataForChart = (stockData) => {
    const timeSeries = stockData['Time Series (Daily)'] || stockData['Weekly Time Series'] || stockData['Monthly Time Series'];
    if (!timeSeries) return null;

    const labels = Object.keys(timeSeries).sort().slice(-30); // Get last 30 data points
    const dataPoints = labels.map(date => parseFloat(timeSeries[date]['4. close']));

    return {
      labels,
      data: dataPoints,
    };
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    setChartData(null);
    try {
      const response = await fetch(`http://localhost:5000/api/stock/${symbol}`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch stock data.');
      }
      const result = await response.json();
      if (result['Error Message']) {
        throw new Error(result['Error Message']);
      }
      if (result['Note']) {
        throw new Error("API rate limit reached. Please wait a minute.");
      }
      setData(result);
      const processedData = processDataForChart(result);
      if (processedData) {
        setChartData(processedData);
      } else {
        throw new Error('Could not process data for chart.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="main-content">
        <header className="App-header">
          <h1>Stock Market Dashboard</h1>
        </header>
        <div className="stock-fetcher">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL)"
          />
          <button onClick={fetchData} disabled={loading}>{loading ? 'Loading...' : 'Get Data'}</button>
        </div>
        {error && <p className="error">{error}</p>}
        {loading && <p>Fetching latest market data...</p>}
        {!loading && chartData && (
          <div className="chart-container">
            <StockChart chartData={chartData} />
          </div>
        )}
        {data && <StockTable data={data} />}
      </div>
      <div className="chatbot-section">
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
