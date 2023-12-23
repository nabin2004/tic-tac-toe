const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Update with your React app's URL
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

let gameData = {
  squares: Array(9).fill(null),
  xIsNext: true,
};

wss.on('connection', (ws) => {
  // Send initial game state to the client
  ws.send(JSON.stringify({ type: 'initial', data: gameData }));

  // Handle incoming messages from clients
  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      // Broadcast the parsed message to all clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (error) {
      console.error('Error parsing incoming message:', error);
    }
  });
});

server.listen(3001, () => {
  console.log('WebSocket server listening on port 3001');
});
