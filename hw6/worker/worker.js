const bluebird = require('bluebird');
const axios = require('axios');
const redisConnection = require('../redis-connection');
const redis = require('redis');
const client = redis.createClient();
const dataURL =
  'https://gist.githubusercontent.com/philbarresi/5cf15393d245b38a2d86ce8207d5076c/raw/d529fb474c1af347702ca4d7b992256237fa2819/lab5.json';
let INIT = false;
let MAX_ID = 0;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

(async () => {
  if (!INIT) {
    const { data } = await axios.get(dataURL);
    data.forEach(async (person) => {
      await client.setAsync(person.id, JSON.stringify(person));
      if (person.id > MAX_ID) {
        MAX_ID = person.id;
      }
    });
    INIT = true;
    console.log('Worker initialized redis storage.');
  }
})();

redisConnection.on('delete:request:*', async (message, channel) => {
  const requestId = message.requestId;
  const eventName = message.eventName;
  const id = message.data.id;

  const person = await client.delAsync(id);
  if (person) {
    const successEvent = `${eventName}:success:${requestId}`;
    redisConnection.emit(successEvent, {
      requestId,
      data: {
        success: `Successfully deleted person with ID ${id}.`
      },
      eventName
    });
  } else {
    const failedEvent = `${eventName}:failed:${requestId}`;
    redisConnection.emit(failedEvent, {
      requestId,
      data: {
        error: `No person with ID ${id}`
      },
      eventName
    });
  }
});

redisConnection.on('get:request:*', async (message, channel) => {
  const requestId = message.requestId;
  const eventName = message.eventName;
  const id = message.data.id;

  const person = await client.getAsync(id);
  if (person) {
    const successEvent = `${eventName}:success:${requestId}`;
    redisConnection.emit(successEvent, {
      requestId,
      data: {
        success: person
      },
      eventName
    });
  } else {
    const failedEvent = `${eventName}:failed:${requestId}`;
    redisConnection.emit(failedEvent, {
      requestId,
      data: {
        error: `No person with ID ${id}`
      },
      eventName
    });
  }
});

redisConnection.on('put:request:*', async (message, channel) => {
  const requestId = message.requestId;
  const eventName = message.eventName;
  const id = message.data.id;

  const person = await client.getAsync(id);
  if (person) {
    const { first_name, last_name, email, gender, ip_address } = message.data;
    const invalidFields = [];
    if (!first_name || typeof first_name !== 'string')
      invalidFields.push('Must provide a valid first name.');
    if (!last_name || typeof last_name !== 'string')
      invalidFields.push('Must provide a valid last name.');
    if (!email || typeof email !== 'string')
      invalidFields.push('Must provide a valid email.');
    if (!gender || typeof gender !== 'string')
      invalidFields.push('Must provide a valid gender.');
    if (!ip_address || typeof ip_address !== 'string')
      invalidFields.push('Must provide a valid IP address.');

    if (invalidFields.length) {
      const failedEvent = `${eventName}:failed:${requestId}`;
      redisConnection.emit(failedEvent, {
        requestId,
        data: {
          error: invalidFields.join(' ')
        },
        eventName
      });
    } else {
      const successEvent = `${eventName}:success:${requestId}`;
      const newPerson = {
        id,
        first_name,
        last_name,
        email,
        gender,
        ip_address
      };
      await client.setAsync(id, JSON.stringify(newPerson));
      redisConnection.emit(successEvent, {
        requestId,
        data: {
          success: newPerson
        },
        eventName
      });
    }
  } else {
    const failedEvent = `${eventName}:failed:${requestId}`;
    redisConnection.emit(failedEvent, {
      requestId,
      data: {
        error: `No person with ID ${id}`
      },
      eventName
    });
  }
});

redisConnection.on('post:request:*', async (message, channel) => {
  const requestId = message.requestId;
  const eventName = message.eventName;

  const { first_name, last_name, email, gender, ip_address } = message.data;
  const invalidFields = [];
  if (!first_name || typeof first_name !== 'string')
    invalidFields.push('Must provide a valid first name.');
  if (!last_name || typeof last_name !== 'string')
    invalidFields.push('Must provide a valid last name.');
  if (!email || typeof email !== 'string')
    invalidFields.push('Must provide a valid email.');
  if (!gender || typeof gender !== 'string')
    invalidFields.push('Must provide a valid gender.');
  if (!ip_address || typeof ip_address !== 'string')
    invalidFields.push('Must provide a valid IP address.');

  if (invalidFields.length) {
    const failedEvent = `${eventName}:failed:${requestId}`;
    redisConnection.emit(failedEvent, {
      requestId,
      data: {
        error: invalidFields.join(' ')
      },
      eventName
    });
  } else {
    const successEvent = `${eventName}:success:${requestId}`;
    const newPerson = {
      id: MAX_ID++,
      first_name,
      last_name,
      email,
      gender,
      ip_address
    };
    await client.setAsync(MAX_ID - 1, JSON.stringify(newPerson));
    redisConnection.emit(successEvent, {
      requestId,
      data: {
        success: newPerson
      },
      eventName
    });
  }
});
