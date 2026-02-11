document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'YOUR_API_KEY'; // Replace with your Alpha Vantage API key
    const symbol = 'IBM';

    // Chart.js setup
    const ctx = document.getElementById('stock-chart').getContext('2d');
    const stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: `Stock Price (${symbol})`,
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute'
                    }
                }
            }
        }
    });

    // Fetch stock data
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const timeSeries = data['Time Series (5min)'];
            if (timeSeries) {
                const labels = Object.keys(timeSeries).reverse();
                const prices = labels.map(key => timeSeries[key]['4. close']);
                
                stockChart.data.labels = labels;
                stockChart.data.datasets[0].data = prices;
                stockChart.update();
            } else {
                console.error('Error fetching stock data:', data);
            }
        })
        .catch(error => console.error('Error fetching stock data:', error));

    // Chatbot
    const chatContainer = document.getElementById('chatbot-container');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');

    const botResponses = {
        'hello': 'Hi there! How can I help you with the stock market today?',
        'price': `The current price of ${symbol} is being displayed on the chart.`,
        'buy': 'This is a simulation. You cannot buy stocks for real.',
        'sell': 'This is a simulation. You cannot sell stocks for real.',
        'default': 'I am a simple bot. I can only respond to "hello", "price", "buy", and "sell".'
    };

    chatSend.addEventListener('click', () => {
        const userMessage = chatInput.value.toLowerCase();
        if (userMessage.trim() === '') return;

        appendMessage('You', userMessage);
        chatInput.value = '';

        setTimeout(() => {
            const botMessage = botResponses[userMessage] || botResponses['default'];
            appendMessage('Bot', botMessage);
        }, 500);
    });

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Trading Simulation
    const balanceElement = document.getElementById('balance');
    const portfolioList = document.getElementById('portfolio-list');
    const tradeSymbolInput = document.getElementById('trade-symbol');
    const tradeQuantityInput = document.getElementById('trade-quantity');
    const buyBtn = document.getElementById('buy-btn');
    const sellBtn = document.getElementById('sell-btn');

    const portfolio = {
        balance: 100000,
        stocks: {}
    };

    function updatePortfolio() {
        balanceElement.textContent = `${portfolio.balance.toFixed(2)}`;
        portfolioList.innerHTML = '';
        for (const symbol in portfolio.stocks) {
            const quantity = portfolio.stocks[symbol];
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = `${symbol}: ${quantity}`;
            portfolioList.appendChild(listItem);
        }
    }

    buyBtn.addEventListener('click', () => {
        const symbolToTrade = tradeSymbolInput.value.toUpperCase();
        const quantity = parseInt(tradeQuantityInput.value);

        if (!symbolToTrade || !quantity || quantity <= 0) {
            alert('Please enter a valid symbol and quantity.');
            return;
        }

        const currentPrice = getCurrentPrice(symbolToTrade);
        if (!currentPrice) {
            alert('Could not get the current price for this stock.');
            return;
        }

        const cost = currentPrice * quantity;
        if (portfolio.balance < cost) {
            alert('Insufficient funds.');
            return;
        }

        portfolio.balance -= cost;
        portfolio.stocks[symbolToTrade] = (portfolio.stocks[symbolToTrade] || 0) + quantity;
        updatePortfolio();
    });

    sellBtn.addEventListener('click', () => {
        const symbolToTrade = tradeSymbolInput.value.toUpperCase();
        const quantity = parseInt(tradeQuantityInput.value);

        if (!symbolToTrade || !quantity || quantity <= 0) {
            alert('Please enter a valid symbol and quantity.');
            return;
        }

        if (!portfolio.stocks[symbolToTrade] || portfolio.stocks[symbolToTrade] < quantity) {
            alert('You do not own enough of this stock.');
            return;
        }

        const currentPrice = getCurrentPrice(symbolToTrade);
        if (!currentPrice) {
            alert('Could not get the current price for this stock.');
            return;
        }

        const revenue = currentPrice * quantity;
        portfolio.balance += revenue;
        portfolio.stocks[symbolToTrade] -= quantity;
        if (portfolio.stocks[symbolToTrade] === 0) {
            delete portfolio.stocks[symbolToTrade];
        }
        updatePortfolio();
    });

    function getCurrentPrice(symbolToTrade) {
        if (symbolToTrade === symbol) {
            const prices = stockChart.data.datasets[0].data;
            return prices.length > 0 ? prices[prices.length - 1] : null;
        }
        // In a real application, you would need to fetch the price for the given symbol
        // For this simulation, we will use a fixed price for other stocks
        return 150; 
    }

    updatePortfolio();
});
