const express = require('express');
const router = express.Router();
const path = require('path');

const constructorMethod = app => {
  app.use(
    '/',
    router.get('/', (req, res) => {
      res.sendFile(path.resolve('views/index.html'));
    })
  );
  app.use('*', (req, res) => {
    res.status(404).sendFile(path.resolve('views/error.html'));
  });
};

module.exports = constructorMethod;
