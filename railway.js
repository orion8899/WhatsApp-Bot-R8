const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { 
    args: ['--no-sandbox']
  }
});

client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
  console.log(`QR Code generated at port ${port}`);
});

client.on('ready', () => {
  console.log('WhatsApp Connected!');
});

client.on('message', async msg => {
  // n8n वेबहुक को मैसेज फॉरवर्ड करें
  await fetch(process.env.N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({message: msg.body, from: msg.from})
  });
});

app.listen(port, () => {
  client.initialize();
  console.log(`Server running on port ${port}`);
});
