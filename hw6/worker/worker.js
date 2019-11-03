const bluebird = require("bluebird");
const axios = require("axios");
const redisConnection = require("../redis-connection");
const redis = require("redis");
const client = redis.createClient();
const dataURL =
  "https://gist.githubusercontent.com/philbarresi/5cf15393d245b38a2d86ce8207d5076c/raw/d529fb474c1af347702ca4d7b992256237fa2819/lab5.json";
let INIT = false;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

(async () => {
  if (!INIT) {
    const { data } = await axios.get(dataURL);
    data.forEach(
      async (person) => await client.setAsync(person.id, JSON.stringify(person))
    );
    INIT = true;
    console.log("init ran");
  }
})();

redisConnection.on("get", async (data, channel) => {
  const { id } = data;
  const person = await client.getAsync(id);
  redisConnection.emit("get-response", { person });
});
