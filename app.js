const express = require('express');
const users = require('./routes/users');
const api = require('./routes/api');

const app = express();

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown Endpoint' })
}

app.use(express.json());
app.use('/users', users.router);
app.use('/api/v1', api);
app.use(unknownEndpoint);

module.exports = app;