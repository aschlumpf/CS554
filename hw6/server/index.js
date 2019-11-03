const express = require("express");
const app = express();
const redisConnection = require("../redis-connection");

app.get("/api/people/:id", async (req, res) => {
  const { id } = req.params;

  redisConnection.emit("get", {
    id: Number(id)
  });

  redisConnection.on("get-response", (data, channel) => {
    const { person } = data;
    if (person) {
      res.status(200).json(JSON.parse(person));
    } else {
      res.status(404).json({ error: `No person with id ${id}` });
    }
  });
});

app.listen(3001, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3001");
});
