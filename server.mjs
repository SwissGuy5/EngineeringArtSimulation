import express from 'express';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import path from 'path';
const __dirname = path.resolve();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const params = {};

app.use(express.static(path.join(__dirname, 'client')));

wss.on('connection', (ws) => {
  console.log('WS client connected');

  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message);
      console.log('Received message:', msg);

      switch (msg.type) {
        case 'matlab':
          Object.assign(params, msg.data);
          console.log('Updated params:', params);
          broadcast({
            type: 'params',
            data: params
          });
          break;
        default:
          console.log('Unknown message:', msg.type);
      }
    } catch (err) {
      console.error(err);
    }
  });

  // TEST
  // ws.send(JSON.stringify({
  //   type: 'params',
  //   data: {
  //     fieldShape: 2
  //   }
  // }));

  ws.on('close', () => {
    console.log('WS client disconnected');
  });
});

function broadcast(obj) {
  const payload = JSON.stringify(obj);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// app.use(express.json());
// app.post('/update', (req, res) => {
//   Object.assign(params, req.body);
//   broadcast({
//       type: 'params',
//       data: params
//   });
  
//   res.sendStatus(200);
// });

// hostname -I
const PORT = 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port: ${PORT}`);
});