const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');
const path = require('path');
const redisConnection = require('./redis-connection');
const nrpSender = require('./redis-connection/nrp-sender-shim');
const static = express.static(__dirname + '/public');
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io'));

const images = io.of('/images');

app.use('/public', static);
app.use(cors());
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  res.status(200).sendFile(path.resolve('public/index.html'));
});

app.use('*', (req, res) => {
  res.status(404).sendFile(path.resolve('public/error.html'));
});

images.on('connection', (socket) => {
  socket.on('query', async (data) => {
    const { query, username, message } = data;
    console.log('server', data);
    const response = await nrpSender.sendMessage({
      redis: redisConnection,
      eventName: 'query',
      data: {
        query
      }
    });
    images.emit('new-query', {
      username,
      message,
      images: response.images
    });
  });
});

http.listen(3001, () => {
  console.log('listening on http://localhost:3001');
});
