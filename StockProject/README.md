# StockProject

This project is a web application that displays stock market data. It consists of a React frontend and a Node.js backend.

## Setup

1.  **Backend:**
    *   Navigate to the `backend` directory.
    *   Install the dependencies:
        ```
        npm install
        ```
    *   Create a `.env` file in the `backend` directory and add your Alpha Vantage API key:
        ```
        ALPHAVANTAGE_API_KEY=YOUR_API_KEY
        ```
    *   Run the backend server:
        ```
        npm start
        ```

2.  **Frontend:**
    *   Navigate to the `frontend` directory.
    *   Install the dependencies:
        ```
        npm install
        ```
    *   Run the frontend development server:
        ```
        npm start
        ```

## Usage

Once both the frontend and backend servers are running, you can access the application at `http://localhost:3000`. Enter a stock symbol and click "Get Data" to view the latest stock prices and a historical chart. You can also interact with the chatbot to get the latest stock price for a specific symbol.
