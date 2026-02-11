import React from 'react';

const StockTable = ({ data }) => {
  const timeSeries = data['Time Series (Daily)'];
  if (!timeSeries) {
    return <p>No data to display.</p>;
  }
  const dates = Object.keys(timeSeries).sort().reverse().slice(0, 10); // Show last 10 days

  return (
    <div className="stock-table-container">
      <h3>Recent Stock Data</h3>
      <table className="stock-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((date) => (
            <tr key={date}>
              <td>{date}</td>
              <td>{timeSeries[date]['1. open']}</td>
              <td>{timeSeries[date]['2. high']}</td>
              <td>{timeSeries[date]['3. low']}</td>
              <td>{timeSeries[date]['4. close']}</td>
              <td>{timeSeries[date]['5. volume']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
