const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('./routes/users');
const { ACCESS_TOKEN_SECRET, USERS } = require('./routes/users');
const api = require('./routes/api');

const app = express();

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown Endpoint' })
}

const METHODS = [
    {
      method: "post",
      path: "/users/register",
      description: "Register, Required: email, user, password",
      example: {
        body: { email: "user@email.com", name: "user", password: "password" },
      },
    },
    {
      method: "post",
      path: "/users/login",
      description: "Login, Required: valid email and password",
      example: { body: { email: "user@email.com", password: "password" } },
    },
    {
      method: "post",
      path: "/users/token",
      description: "Renew access token, Required: valid refresh token",
      example: { headers: { token: "*Refresh Token*" } },
    },
    {
      method: "post",
      path: "/users/tokenValidate",
      description: "Access Token Validation, Required: valid access token",
      example: { headers: { authorization: "Bearer *Access Token*" } },
    },
    {
      method: "get",
      path: "/api/v1/information",
      description: "Access user's information, Required: valid access token",
      example: { headers: { authorization: "Bearer *Access Token*" } },
    },
    {
      method: "post",
      path: "/users/logout",
      description: "Logout, Required: access token",
      example: { body: { token: "*Refresh Token*" } },
    },
    {
      method: "get",
      path: "api/v1/users",
      description: "Get users DB, Required: Valid access token of admin user",
      example: { headers: { authorization: "Bearer *Access Token*" } },
    }
]

app.options('/', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(200).header('Allow', 'OPTIONS, GET, POST').json(METHODS.slice(0, 2));
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(200).header('Allow', 'OPTIONS, GET, POST').json(METHODS.slice(0, 3));
        const { isAdmin } = USERS.find(user => user.name === decoded.name);
        if (!isAdmin) return res.status(200).header('Allow', 'OPTIONS, GET, POST').json([...METHODS.slice(0, 3), ...METHODS.slice(4, 6)]);
    })
    return res.status(200).header('Allow', 'OPTIONS, GET, POST').json(METHODS);
})

app.use(express.json());
app.use('/users', users.router);
app.use('/api/v1', api);
app.use(unknownEndpoint);

module.exports = app;