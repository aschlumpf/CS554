const axios = require('axios');
const redisConnection = require('../redis-connection');
const API_KEY = require('../api_key').key;
const dataURL = 'https://pixabay.com/api/';

console.log('Worker running...');

redisConnection.on('query:request:*', async (message, channel) => {
  console.log('Worker received message');
  const { data, requestId, eventName } = message;
  const query = data.query.split(' ').join('+');
  try {
    const { data } = await axios.get(dataURL, {
      params: {
        key: API_KEY,
        q: query
      }
    });
    const hits = data.hits;
    const images = hits.map((hit) => hit.webformatURL);
    const successEvent = `${eventName}:success:${requestId}`;
    redisConnection.emit(successEvent, {
      requestId,
      data: {
        images
      },
      eventName
    });
  } catch (e) {
    console.log(e);
    const failedEvent = `${eventName}:failed:${requestId}`;
    redisConnection.emit(failedEvent, {
      requestId,
      data: {
        error: 'Could not load results to query.'
      },
      eventName
    });
  }
});
