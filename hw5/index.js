const bluebird = require('bluebird');
const express = require('express');
const app = express();
const redis = require('redis');
const dataModule = require('./data');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

app.get('/api/people/history', async (req, res) => {
  const history = await client.lrangeAsync('history', 0, 19);
  res.status(200).json(history.map((user) => JSON.parse(user)));
});

app.get('/api/people/:id', async (req, res) => {
  const { id } = req.params;
  let result;
  const user = await client.getAsync(id);
  if (user) {
    result = JSON.parse(user);
  } else {
    try {
      result = await dataModule.getById(Number(id));
    } catch (e) {
      res.status(404).json({ error: `No user with id ${id}` });
      return;
    }
    client.set(id, JSON.stringify(result));
  }
  await client.lpushAsync('history', JSON.stringify(result));
  res.status(200).json(result);
});

app.listen(3001, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3001');
});
