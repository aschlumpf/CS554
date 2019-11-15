const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const redisConnection = require('../redis-connection');
const nrpSender = require('../redis-connection/nrp-sender-shim');

app.use(bodyParser.json());

app.post('/api/people', async (req, res) => {
  const { first_name, last_name, email, gender, ip_address } = req.body;
  try {
    const response = await nrpSender.sendMessage({
      redis: redisConnection,
      eventName: 'post',
      data: {
        first_name,
        last_name,
        email,
        gender,
        ip_address
      }
    });
    res.status(200).json(response.success);
  } catch (e) {
    res.status(404).json({ error: e.error });
  }
});

app.put('/api/people/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, gender, ip_address } = req.body;
  const numID = Number(id);
  if (!numID) {
    res.status(400).send({ error: 'ID must be a number.' });
    return;
  }
  try {
    const response = await nrpSender.sendMessage({
      redis: redisConnection,
      eventName: 'put',
      data: {
        id: numID,
        first_name,
        last_name,
        email,
        gender,
        ip_address
      }
    });
    res.status(200).json(response.success);
  } catch (e) {
    res.status(404).json({ error: e.error });
  }
});

app.get('/api/people/:id', async (req, res) => {
  const { id } = req.params;
  const numID = Number(id);
  if (!numID) {
    res.status(400).send({ error: 'ID must be a number.' });
    return;
  }
  try {
    const response = await nrpSender.sendMessage({
      redis: redisConnection,
      eventName: 'get',
      data: {
        id: numID
      }
    });
    res.status(200).json(JSON.parse(response.success));
  } catch (e) {
    res.status(404).json({ error: e.error });
  }
});

app.delete('/api/people/:id', async (req, res) => {
  const { id } = req.params;
  const numID = Number(id);
  if (!numID) {
    res.status(400).send({ error: 'ID must be a number.' });
    return;
  }
  try {
    const response = await nrpSender.sendMessage({
      redis: redisConnection,
      eventName: 'delete',
      data: {
        id: numID
      }
    });
    res.status(200).json({ success: response.success });
  } catch (e) {
    res.status(404).json({ error: e.error });
  }
});

app.listen(3001, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3001');
});
