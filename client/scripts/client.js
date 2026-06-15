import { updateParams } from "./main.js";
// const status = document.getElementById('status');

const ws = new WebSocket(
  `ws://${window.location.host}`
);

ws.onopen = () => {
  console.log('Connected');
};

ws.onmessage = event => {
  const msg = JSON.parse(event.data);
  console.log('Received message:', event);

  if (msg.type === 'params') {
    updateParams(msg.data);
    // status.textContent = JSON.stringify(msg.data, null, 2);
  }
};

ws.onclose = () => {
  console.log('Disconnected');
};