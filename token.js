const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = '6F772A64291029A8D12';
const REFRESH_TOKEN_SECRET = 'ABA787191032BFF4557';

let refreshTokens = [];

function generateRefreshToken(name) {
    console.log(name);
    return jwt.sign({ name }, REFRESH_TOKEN_SECRET);
}

function generateAccessToken(name) {
    console.log(name);
    return jwt.sign({ name }, ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
}

function validateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.status(401).json({ message: 'Access Token Required' });
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid Access Token' });
        req.decoded = decoded;
        next();
    });
}

function useRefreshToken(req, res, next) {
    const { refreshToken } = req.body;
    console.log("refreshTokens:", refreshTokens);
    if (refreshToken === null) return res.status(401).json({ message: 'Refresh Token Required' });
    if (!refreshTokens.includes(refreshToken)) return res.status(403).json({ message: 'Invalid Refresh Token' });
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid Refresh Token' });
        req.decoded = decoded;
        next();
    });
}

module.exports = { generateAccessToken, generateRefreshToken, validateToken, useRefreshToken, refreshTokens, REFRESH_TOKEN_SECRET };
